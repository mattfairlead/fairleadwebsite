import BackgroundVideo from "@/components/BackgroundVideo";

/**
 * Team hero backdrop — the team footage sits behind the right side of the
 * /team intro and dissolves into the page ground on its left, top and
 * bottom edges, so the blue reads as one continuous surface the footage
 * surfaces out of rather than a rectangle dropped on it.
 *
 * The dissolve is a mask, not a painted gradient: what shows through is the
 * ambient ground itself (its drifting light sources and grain), so the seam
 * never goes flat. A blue-hour wash on top grades the footage toward the
 * §5.1 palette, the same way ImageBand treats motion bands.
 *
 * Served from the "Team" GitHub release via /api/media/team-hero (see that
 * route for why). Set NEXT_PUBLIC_TEAM_HERO_VIDEO_URL once the file moves
 * to Blob/Supabase Storage (§9 media plan) — no code change needed.
 */
const TEAM_VIDEO = process.env.NEXT_PUBLIC_TEAM_HERO_VIDEO_URL || "/api/media/team-hero";
const TEAM_POSTER = "/team/hero-poster.jpg";

// Left edge feathers over ~60% of the box so the blue melts in; top and
// bottom fade under the header and into the sections below.
const MASK = [
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0.8) 52%, #000 72%)",
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 26%, #000 55%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0) 100%)",
].join(", ");

export default function TeamHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-y-0 right-0 w-[64%] max-md:w-[92%] max-md:opacity-60"
        style={{
          WebkitMaskImage: MASK,
          maskImage: MASK,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <BackgroundVideo src={TEAM_VIDEO} poster={TEAM_POSTER} />
        {/* blue-hour wash — deepest where the copy sits, lifting toward the edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,14,46,0.6) 0%, rgba(10,26,79,0.3) 45%, rgba(5,14,46,0.3) 100%), linear-gradient(180deg, rgba(5,14,46,0.35) 0%, rgba(5,14,46,0) 40%, rgba(5,14,46,0.45) 100%)",
          }}
        />
      </div>
    </div>
  );
}
