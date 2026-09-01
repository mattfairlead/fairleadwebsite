import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * "Ask Fairlead" — §6. Phase 2 deliverable: a command bar backed by the
 * Anthropic API over a small curated corpus (site content + engagement
 * summary + perspectives), with UI actions (navigate, open cards, prefill
 * the contact form).
 *
 * Phase 1 ships this stub behind NEXT_PUBLIC_ASK_ENABLED=false. The nav
 * trigger renders only when the flag is on; this route answers 503 until
 * the Phase 2 implementation lands (RAG index in /content/ask-corpus,
 * Anthropic key server-side only, rate-limited).
 */
export async function POST() {
  if (process.env.NEXT_PUBLIC_ASK_ENABLED !== "true") {
    return NextResponse.json({ error: "Ask Fairlead is not enabled" }, { status: 503 });
  }
  return NextResponse.json({ error: "Ask Fairlead ships in Phase 2" }, { status: 501 });
}
