import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { sendMail } from "@/lib/resend";
import { getTeam } from "@/lib/data";
import { bioFilename, buildBioJson, fullName, prefillFor, prepare, sanitize, type SubmissionMeta } from "@/lib/bio/build";
import { renderEmail } from "@/lib/bio/email";
import type { RosterMember } from "@/lib/bio/schema";

export const runtime = "nodejs";

/**
 * /bio intake → Matt's inbox (PRD §5.4–5.5).
 *
 * The body carries the answers; the server re-runs the whole pipeline
 * (sanitize → normalize → prune → validate → finalize), stamps the
 * metadata itself (submission_id, submitted_at, user_agent, schema
 * version), and mails the summary with the JSON file attached and inline.
 *
 * Never fails silently: in production a skipped send (no RESEND_API_KEY)
 * is a 503, so the page shows its Download / email fallbacks rather than
 * telling someone their bio was sent when it wasn't.
 *
 * Abuse controls follow /api/register/request: honeypot, an in-memory
 * per-IP limit (generous — an office can share one IP), body size caps.
 */

const DEFAULT_TO = "mfaria@fairleadadvisors.com";
const BODY_MAX = 64 * 1024;
const BODY_MAX_WITH_PHOTO = 7 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

async function rosterMember(id: string): Promise<RosterMember | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    const m = (await getTeam()).find((t) => t.id === id);
    return m
      ? { id: m.id, name: m.name, title: m.title, credentials: m.credentials, specialty: m.specialty, bio_md: "", has_photo: !!m.photo_url }
      : null;
  } catch {
    return null;
  }
}

function headshotFrom(v: unknown): { ext: "jpg" | "png"; content: string } | null | "invalid" {
  if (v == null) return null;
  if (typeof v !== "object") return "invalid";
  const h = v as Record<string, unknown>;
  const ext = h.type === "image/png" ? "png" : h.type === "image/jpeg" ? "jpg" : null;
  const content = typeof h.content === "string" ? h.content : "";
  if (!ext || !content || !/^[A-Za-z0-9+/=]+$/.test(content) || content.length > BODY_MAX_WITH_PHOTO) return "invalid";
  return { ext, content };
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > BODY_MAX_WITH_PHOTO) return NextResponse.json({ error: "Too large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  // Honeypot — a real form never fills this.
  if (String(body.website ?? "").trim()) return NextResponse.json({ ok: true });

  const ip = clientIp(req);
  const code = process.env.BIO_ACCESS_CODE || "";
  if (code) {
    if (limited(`code:${ip}`, 30)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    if (String(body.access_code ?? "") !== code) return NextResponse.json({ error: "Wrong access code" }, { status: 401 });
  }
  if (body.check_code) return NextResponse.json({ ok: true });

  const headshot = headshotFrom(body.headshot);
  if (headshot === "invalid") return NextResponse.json({ error: "Headshot must be a JPG or PNG" }, { status: 400 });
  if (!headshot && raw.length > BODY_MAX) return NextResponse.json({ error: "Too large" }, { status: 413 });

  const answers = sanitize(body.data);
  const roster = await rosterMember(answers.basics.roster_match);
  const { data, errors } = prepare(answers, { roster, headshotAttached: !!headshot });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Some required answers are missing", errors }, { status: 400 });
  }

  if (limited(`ip:${ip}`, 10)) {
    return NextResponse.json({ error: "Too many submissions from this network. Try again later." }, { status: 429 });
  }

  const revision = String(body.revision_of ?? "");
  const meta: SubmissionMeta = {
    submission_id: randomUUID(),
    submitted_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    revision_of: UUID.test(revision) ? revision : null,
    source: "fairleadadvisors.com/bio",
    hub_team_member_id: roster ? Number(roster.id) : null,
    prefill: roster ? prefillFor(roster) : null,
    headshot_attached: !!headshot,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  };
  const file = buildBioJson(data, meta);
  const json = JSON.stringify(file, null, 2);
  const filename = bioFilename(file);
  const attachments = [
    { filename, content: Buffer.from(json, "utf8").toString("base64") },
    ...(headshot ? [{ filename: filename.replace(/^bio_/, "headshot_").replace(/\.json$/, `.${headshot.ext}`), content: headshot.content }] : []),
  ];

  const mail = renderEmail(file, json, { headshot: headshot ? attachments[1].filename : undefined });
  const sent = await sendMail({
    to: process.env.BIO_TO || DEFAULT_TO,
    replyTo: data.basics.email,
    subject: mail.subject,
    text: mail.text,
    attachments,
  });

  if (sent.skipped) {
    if (process.env.VERCEL_ENV === "production") {
      console.error("[bio] RESEND_API_KEY unset in production — submission not delivered:", meta.submission_id);
      return NextResponse.json({ error: "Email isn’t configured", file }, { status: 503 });
    }
    console.info(`[bio] mail skipped (no RESEND_API_KEY) — ${filename}:\n${json}`);
  } else if (!sent.ok) {
    return NextResponse.json({ error: "Mail delivery failed", file }, { status: 502 });
  }

  if (body.email_me_copy === true && !sent.skipped) {
    await sendMail({
      to: data.basics.email,
      subject: "Your Fairlead bio intake — copy",
      text: [
        `Thanks, ${data.basics.preferred_name || data.basics.first_name}. Matt has your answers and will send you a draft bio to approve.`,
        "",
        "Your answers are attached as a JSON file. Nothing is published until you approve the draft.",
      ].join("\n"),
      attachments: [attachments[0]],
    }).catch(() => undefined);
  }

  console.info(`[bio] ${fullName(data)} — ${meta.submission_id}`);
  return NextResponse.json({ ok: true, submission_id: meta.submission_id, file });
}
