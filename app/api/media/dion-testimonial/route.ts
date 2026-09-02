import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Proxies the Dion Leadership testimonial off GitHub Releases.
 *
 * GitHub always serves release assets as `Content-Type: application/octet-stream`
 * with `Content-Disposition: attachment` — correct for downloads, but iOS
 * Safari treats that as a forced download and refuses to play the file
 * inline, so the <video> element silently fails on iPhone. This route
 * streams the same bytes back with video headers and forwards Range
 * requests (required for iOS playback and seeking).
 *
 * Drop this once the file moves to Blob/Supabase Storage (§9 media plan) —
 * point NEXT_PUBLIC_DION_TESTIMONIAL_URL at the new location directly.
 */
const ORIGIN_URL =
  "https://github.com/mattfairlead/fairleadwebsite/releases/download/Reviews/dionleadership.mov";

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
  headers.set("Content-Type", "video/quicktime");
  headers.set("Content-Disposition", "inline; filename=dionleadership.mov");
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
