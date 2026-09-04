import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendgrid";
import { mintLinkToken, type Requester } from "@/lib/register-access";

export const runtime = "nodejs";

/**
 * "Ask for the names" — the sheet on /engagements posts here.
 *
 * Fairlead is emailed who asked, what they're working through, and a 7-day
 * share link a partner can forward if they decide to share the register.
 * Nothing is sent to the visitor and nothing unlocks: the partner decides.
 * Following the forwarded link (/engagements/unlock) is what sets the grant.
 *
 * Abuse controls: honeypot field, per-IP and per-address rate limits (in
 * memory — best effort on serverless, which is fine: the cost of a miss is
 * one extra email to Fairlead). Every payload field is length-capped before
 * it reaches a token or a mail.
 */

const ROLES = new Set(["Sponsor", "Portfolio company", "Intermediary", "Other", ""]);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();
function limited(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — a real form never fills this.
  if (String(body.website ?? "").trim()) return NextResponse.json({ ok: true });

  const requester: Requester = {
    name: String(body.name ?? "").slice(0, 120).trim(),
    firm: String(body.firm ?? "").slice(0, 120).trim(),
    role: String(body.role ?? "").slice(0, 40).trim(),
    email: String(body.email ?? "").slice(0, 254).trim().toLowerCase(),
  };
  const message = String(body.message ?? "").slice(0, 1000).trim();

  if (!requester.name || !requester.firm || !EMAIL.test(requester.email)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!ROLES.has(requester.role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  if (limited(`ip:${clientIp(req)}`, 12) || limited(`email:${requester.email}`, 4)) {
    return NextResponse.json({ error: "Too many requests — try again later" }, { status: 429 });
  }

  const who = `${requester.name}${requester.role ? ` (${requester.role})` : ""} at ${requester.firm}`;
  const details = [
    `Name:  ${requester.name}`,
    `Firm:  ${requester.firm}`,
    `Role:  ${requester.role || "—"}`,
    `Email: ${requester.email}`,
    ``,
    `What they're working through:`,
    message || "—",
  ].join("\n");

  // The share link lands on the origin the visitor is on (preview or
  // production), so the cookie it sets is for the host they'll return to.
  const token = mintLinkToken({ ...requester, message });
  const link = token ? `${new URL(req.url).origin}/engagements/unlock?t=${encodeURIComponent(token)}` : null;
  if (!token) console.error("[register] ENGAGEMENTS_SECRET unset — request forwarded without a share link");

  const share = link
    ? [
        `To share the register with them, forward this link. It opens every name, sponsor and summary in the`,
        `browser it's opened in for 30 days, and expires in 7 days. Nothing has been sent to them yet:`,
        ``,
        link,
        ``,
        `Or just reply to this email — it goes straight to them.`,
      ]
    : [
        `No share link could be made: ENGAGEMENTS_SECRET is unset on the website. Reply to this email to reach them.`,
      ];

  const sent = await sendMail({
    subject: `Register access requested — ${who}`,
    replyTo: requester.email,
    text: [details, ``, ...share].join("\n"),
  });
  if (sent.skipped && link) console.info(`[register] mail skipped — share link for ${requester.email}:\n${link}`);
  if (!sent.ok) return NextResponse.json({ error: "Mail delivery failed" }, { status: 502 });

  return NextResponse.json({ ok: true });
}
