import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Proxies the team hero footage off GitHub Releases.
 *
 * Same reason as /api/media/dion-testimonial: GitHub serves release assets
 * as `application/octet-stream` with `Content-Disposition: attachment`,
 * which iOS Safari treats as a forced download and refuses to play inline.
 * This route streams the same bytes back with video headers and forwards
 * Range requests (required for iOS playback and seeking).
 *
 * Drop this once the file moves to Blob/Supabase Storage (§9 media plan) —
 * point NEXT_PUBLIC_TEAM_HERO_VIDEO_URL at the new location directly.
 */
const ORIGIN_URL = "https://github.com/mattfairlead/fairleadwebsite/releases/download/Team3/Sequence.01_1.mp4";

export async function GET(request: NextRequest) {
  const range = request.headers.get("range");

  const originResponse = await fetch(ORIGIN_URL, {
    headers: range ? { range } : undefined,
    redirect: "follow",
  });

  if (!originResponse.ok && originResponse.status !== 206) {
    return new Response("Failed to fetch source video", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "video/mp4");
  headers.set("Content-Disposition", "inline; filename=team-hero.mp4");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  const contentLength = originResponse.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentRange = originResponse.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(originResponse.body, {
    status: originResponse.status,
    headers,
  });
}
