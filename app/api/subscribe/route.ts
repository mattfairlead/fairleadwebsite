import { NextResponse } from "next/server";
import { addToList } from "@/lib/sendgrid";

export const runtime = "nodejs";

/** Newsletter capture → SendGrid marketing list. §4.6. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").slice(0, 320).trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { ok } = await addToList(email);
  if (!ok) return NextResponse.json({ error: "Subscribe failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
