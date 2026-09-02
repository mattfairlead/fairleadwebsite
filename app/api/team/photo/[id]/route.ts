import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Headshot proxy. The engagement hub stores team photos inline in
 * `team_members.photo_url` as base64 data URLs (or, in future, as storage
 * URLs). Serving them from here keeps the base64 out of the page HTML and
 * lets the CDN cache each image; lib/team.ts appends `?v=<updated_at>` so a
 * new upload in the hub shows up without waiting out the cache.
 *
 * RLS does the access control: an unchecked member's row is invisible to the
 * anon key, so their photo 404s here too.
 */
const CACHE = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) return new NextResponse(null, { status: 404 });

  const sb = getSupabase();
  if (!sb) return new NextResponse(null, { status: 404 });

  const { data, error } = await sb
    .from("team_members")
    .select("photo_url")
    .eq("id", Number(id))
    .eq("show_on_website", true)
    .maybeSingle();
  const src = !error && data?.photo_url ? String(data.photo_url) : "";
  if (!src) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "public, max-age=60" } });

  if (/^https?:\/\//i.test(src)) {
    return NextResponse.redirect(src, { status: 302, headers: { "Cache-Control": CACHE } });
  }

  const m = src.match(/^data:(image\/[\w.+-]+);base64,([\s\S]+)$/);
  if (!m) return new NextResponse(null, { status: 404 });

  const bytes = Buffer.from(m[2], "base64");
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": m[1],
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
