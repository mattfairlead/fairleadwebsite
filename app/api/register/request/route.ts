import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendgrid";
import {
  GRANT_COOKIE,
  grantCookieOptions,
  isAccessConfigured,
  mintGrantToken,
  mintLinkToken,
  revealMode,
  type Requester,
} from "@/lib/register-access";

export const runtime = "nodejs";

/**
 * "Reveal the register" — the modal on /engagements posts here.
 *
 * verify mode (default): mint a 48-hour link token, email it to the visitor,
 * tell Fairlead who asked. Nothing is unlocked until the link is followed
 * (/engagements/unlock). instant mode: set the grant cookie right away.
 *
 * Abuse controls: honeypot field, per-IP and per-address rate limits (in
 * memory — best effort on serverless, which is fine: the cost of a miss is
 * one extra email to an address its owner typed). Every payload field is
 * length-capped before it reaches a token or a mail.
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
  if (String(body.website ?? "").trim()) return NextResponse.json({ ok: true, mode: "verify" });

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

  if (!isAccessConfigured()) {
    console.error("[register] ENGAGEMENTS_SECRET unset — cannot issue access");
    return NextResponse.json({ error: "Register access is not configured" }, { status: 503 });
  }

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

  if (revealMode() === "instant") {
    const grant = mintGrantToken(requester);
    if (!grant) return NextResponse.json({ error: "Register access is not configured" }, { status: 503 });
    await sendMail({
      subject: `Register unlocked — ${who}`,
      replyTo: requester.email,
      text: `${details}\n\nInstant mode: the register was unlocked for this browser on submit.`,
    });
    const res = NextResponse.json({ ok: true, mode: "instant" });
    res.cookies.set(GRANT_COOKIE, grant, grantCookieOptions());
    return res;
  }

  const token = mintLinkToken({ ...requester, message });
  if (!token) return NextResponse.json({ error: "Register access is not configured" }, { status: 503 });
  // The origin the visitor is on (preview or production), so the link and
  // the cookie it sets land on the same host.
  const link = `${new URL(req.url).origin}/engagements/unlock?t=${encodeURIComponent(token)}`;

  const visitor = await sendMail({
    to: requester.email,
    subject: "Your link to the Fairlead engagement register",
    text: [
      `${requester.name},`,
      ``,
      `Here is your link to the full engagement register — every company, sponsor and summary:`,
      ``,
      link,
      ``,
      `It works for 48 hours and unlocks the register in the browser you open it in for 30 days.`,
      `If you didn't ask for this, ignore it — nothing is unlocked until the link is opened.`,
      ``,
      `Fairlead Advisors · (617) 315-4822 · fairleadadvisors.com`,
    ].join("\n"),
    html: linkEmailHtml(requester.name, link),
  });
  if (visitor.skipped) console.info(`[register] mail skipped — unlock link for ${requester.email}:\n${link}`);
  if (!visitor.ok) return NextResponse.json({ error: "Mail delivery failed" }, { status: 502 });

  await sendMail({
    subject: `Register access requested — ${who}`,
    replyTo: requester.email,
    text: `${details}\n\nA verification link was sent to ${requester.email}. You'll get a second note when it's opened.`,
  });

  return NextResponse.json({ ok: true, mode: "verify" });
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

function linkEmailHtml(name: string, link: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#050e2e;color:#ffffff;font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050e2e;"><tr><td align="center" style="padding:48px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 0 28px 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);font-weight:600;">
<span style="display:inline-block;width:32px;height:1px;background:#d5b371;vertical-align:middle;margin-right:12px;"></span>Fairlead Advisors</td></tr>
<tr><td style="padding:0 0 16px 0;font-size:28px;line-height:1.1;letter-spacing:-0.04em;font-weight:600;color:#ffffff;">Your link to the engagement register.</td></tr>
<tr><td style="padding:0 0 28px 0;font-size:16px;line-height:1.5;color:rgba(255,255,255,0.7);">${esc(name)}, here is the full register — every company, sponsor and summary. The link works for 48 hours and unlocks the register in the browser you open it in for 30 days.</td></tr>
<tr><td style="padding:0 0 32px 0;"><a href="${esc(link)}" style="display:inline-block;background:#ffffff;color:#050e2e;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:-0.02em;padding:18px 32px;border-radius:80px;">Open the register &rarr;</a></td></tr>
<tr><td style="padding:0 0 12px 0;border-top:1px solid rgba(255,255,255,0.1);"></td></tr>
<tr><td style="padding:12px 0 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">If you didn&rsquo;t ask for this, ignore it &mdash; nothing is unlocked until the link is opened.<br>Fairlead Advisors &middot; (617) 315-4822 &middot; fairleadadvisors.com</td></tr>
</table></td></tr></table></body></html>`;
}
