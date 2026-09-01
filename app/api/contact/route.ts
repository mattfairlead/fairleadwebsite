import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendgrid";

export const runtime = "nodejs";

const ROLES = new Set(["Sponsor", "Portfolio company", "Intermediary", "Other", ""]);
const MAX = 4000;

/** Contact form → SendGrid → info@ distribution list. §4.7. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").slice(0, 200).trim();
  const firm = String(body.firm ?? "").slice(0, 200).trim();
  const role = String(body.role ?? "").slice(0, 50).trim();
  const message = String(body.message ?? "").slice(0, MAX).trim();
  const email = String(body.email ?? "").slice(0, 320).trim();

  if (!name || !firm || !message || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { ok } = await sendMail({
    subject: `Website contact — ${name}${role ? ` (${role})` : ""} at ${firm}`,
    replyTo: email,
    text: [
      `Name:  ${name}`,
      `Firm:  ${firm}`,
      `Role:  ${role || "—"}`,
      `Email: ${email}`,
      ``,
      `What are you working through?`,
      message,
    ].join("\n"),
  });

  if (!ok) return NextResponse.json({ error: "Mail delivery failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
