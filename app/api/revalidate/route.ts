import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";

/**
 * Content revalidation — called by the engagement hub after a Supabase write
 * (a team card's Website checkbox, an engagement summary edit) so the site
 * updates without a deploy. Requires REVALIDATE_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = req.headers.get("x-revalidate-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths: string[] = ["/", "/team", "/engagements", "/perspectives"];
  try {
    const body = await req.json();
    if (Array.isArray(body?.paths) && body.paths.every((p: unknown) => typeof p === "string")) {
      paths = body.paths;
    }
  } catch {
    // default paths
  }

  for (const path of paths) revalidatePath(path);
  // The register (lib/data.ts → loadRegister) is cached under a tag rather
  // than a path, since /engagements renders per request.
  if (paths.some((p) => p === "/engagements" || p.startsWith("/engagements/"))) revalidateTag("engagements");
  return NextResponse.json({ ok: true, revalidated: paths });
}
