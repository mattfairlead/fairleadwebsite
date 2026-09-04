import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendgrid";
import { GRANT_COOKIE, grantCookieOptions, mintGrantToken, openLinkToken } from "@/lib/register-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The emailed link lands here. A valid, unexpired link token becomes a
 * 30-day grant cookie for this browser and Fairlead hears that the visitor
 * followed through. Expired or tampered tokens bounce to the register with a
 * flag so the page can say "that link has expired — ask again".
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const requester = openLinkToken(url.searchParams.get("t"));
  const base = url.origin;

  if (!requester) {
    return NextResponse.redirect(`${base}/engagements?link=expired#register`, 303);
  }

  const grant = mintGrantToken(requester);
  if (!grant) return NextResponse.redirect(`${base}/engagements?link=expired#register`, 303);

  const who = `${requester.name}${requester.role ? ` (${requester.role})` : ""} at ${requester.firm}`;
  await sendMail({
    subject: `Register unlocked — ${who}`,
    replyTo: requester.email,
    text: [
      `Name:  ${requester.name}`,
      `Firm:  ${requester.firm}`,
      `Role:  ${requester.role || "—"}`,
      `Email: ${requester.email}`,
      ``,
      `What they're working through:`,
      requester.message || "—",
      ``,
      `They opened their verification link; the register is unlocked in their browser for 30 days.`,
    ].join("\n"),
  });

  const res = NextResponse.redirect(`${base}/engagements?unlocked=1#register`, 303);
  res.cookies.set(GRANT_COOKIE, grant, grantCookieOptions());
  return res;
}
