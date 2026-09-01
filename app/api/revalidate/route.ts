import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * Content revalidation — called by the marketing hub (Phase 2) after a
 * Supabase write so bios and engagement summaries update without a deploy.
 * Requires REVALIDATE_SECRET.
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
  return NextResponse.json({ ok: true, revalidated: paths });
}
