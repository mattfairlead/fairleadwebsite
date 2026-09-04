import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Register access — who may see the unlocked engagement register.
 *
 * The gate is a signed grant in an httpOnly cookie. A visitor asks to reveal
 * the register (RevealModal → POST /api/register/request); we email them a
 * one-time link (an HMAC-signed, expiring token); following it
 * (/engagements/unlock) sets the grant cookie; from then on the SERVER renders
 * the unlocked rows for that browser. Nothing confidential is ever in the
 * page until that point, so there is nothing client-side to bypass: no hidden
 * DOM, no JSON, no CSS blur over real text.
 *
 * Tokens are HMAC-SHA256 over a base64url JSON payload, keyed by
 * ENGAGEMENTS_SECRET. Without the secret, production refuses to issue or
 * honour grants (fail closed); development derives a throwaway key so the
 * flow works locally.
 *
 * ENGAGEMENTS_REVEAL_MODE:
 *   "verify"  (default) — email link required; the grant is issued on click.
 *   "instant"           — the grant is issued on form submit (no email step).
 *                         Weaker: anyone can POST a form. Fairlead is still
 *                         notified either way.
 */

export const GRANT_COOKIE = "fl_register";
const LINK_TTL_S = 60 * 60 * 48; // the emailed link — 48 hours
const GRANT_TTL_S = 60 * 60 * 24 * 30; // the browser grant — 30 days

export type RevealMode = "verify" | "instant";

export function revealMode(): RevealMode {
  return (process.env.ENGAGEMENTS_REVEAL_MODE || "").trim().toLowerCase() === "instant" ? "instant" : "verify";
}

/** Public-safe details carried in a grant — enough to greet and to notify. */
export interface Requester {
  name: string;
  firm: string;
  role: string;
  email: string;
}

type LinkPayload = Requester & { message: string; t: "link"; exp: number; iat: number };
type GrantPayload = Requester & { t: "grant"; exp: number; iat: number };

function secret(): string | null {
  const s = (process.env.ENGAGEMENTS_SECRET || "").trim();
  if (s) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-register-secret";
  return null;
}

export function isAccessConfigured(): boolean {
  return secret() !== null;
}

const b64 = {
  enc: (s: string) => Buffer.from(s, "utf8").toString("base64url"),
  dec: (s: string) => Buffer.from(s, "base64url").toString("utf8"),
};

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

function mint(payload: object): string | null {
  const key = secret();
  if (!key) return null;
  const body = b64.enc(JSON.stringify(payload));
  return `${body}.${sign(body, key)}`;
}

function open<T extends { t: string; exp: number }>(token: string | undefined | null, type: T["t"]): T | null {
  const key = secret();
  if (!key || !token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body, key);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let payload: T;
  try {
    payload = JSON.parse(b64.dec(body)) as T;
  } catch {
    return null;
  }
  if (payload.t !== type) return null;
  if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
  return payload;
}

const now = () => Math.floor(Date.now() / 1000);

/** The emailed one-time link token. */
export function mintLinkToken(r: Requester & { message: string }): string | null {
  const payload: LinkPayload = { ...r, t: "link", iat: now(), exp: now() + LINK_TTL_S };
  return mint(payload);
}
export function openLinkToken(token: string | null): (Requester & { message: string }) | null {
  const p = open<LinkPayload>(token, "link");
  if (!p) return null;
  const { name, firm, role, email, message } = p;
  return { name, firm, role, email, message };
}

/** The browser grant, stored in the cookie. */
export function mintGrantToken(r: Requester): string | null {
  const payload: GrantPayload = {
    name: r.name,
    firm: r.firm,
    role: r.role,
    email: r.email,
    t: "grant",
    iat: now(),
    exp: now() + GRANT_TTL_S,
  };
  return mint(payload);
}
export function openGrantToken(token: string | null | undefined): Requester | null {
  const p = open<GrantPayload>(token, "grant");
  if (!p) return null;
  const { name, firm, role, email } = p;
  return { name, firm, role, email };
}

export function grantCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: GRANT_TTL_S,
  };
}

/** The current request's verified grant, or null. Server components + routes. */
export async function getRegisterGrant(): Promise<Requester | null> {
  const jar = await cookies();
  return openGrantToken(jar.get(GRANT_COOKIE)?.value);
}
