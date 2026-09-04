import { NextResponse } from "next/server";
import { GRANT_COOKIE } from "@/lib/register-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** "Lock" in the unlocked register's header — clears this browser's grant. */
export async function GET(req: Request) {
  const res = NextResponse.redirect(`${new URL(req.url).origin}/engagements#register`, 303);
  res.cookies.set(GRANT_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
