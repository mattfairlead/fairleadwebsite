import BackgroundVideo from "@/components/BackgroundVideo";

/**
 * Team footage backdrop — the roster footage sits behind the right side of
 * the /hands-on-engagements intro and dissolves into the page ground on its left, top and
 * bottom edges, so the blue reads as one continuous surface the footage
 * surfaces out of rather than a rectangle dropped on it.
 *
 * The dissolve is a mask, not a painted gradient: what shows through is the
 * ambient ground itself (its drifting light sources and grain), so the seam
 * never goes flat. A blue-hour wash on top grades the footage toward the
 * §5.1 palette, the same way ImageBand treats motion bands.
 *
 * Served from the "Team4" GitHub release via /api/media/team-hero (see that
 * route for why). Set NEXT_PUBLIC_TEAM_HERO_VIDEO_URL once the file moves
 * to Blob/Supabase Storage (§9 media plan) — no code change needed.
 */
const TEAM_VIDEO = process.env.NEXT_PUBLIC_TEAM_HERO_VIDEO_URL || "/api/media/team-hero";
const TEAM_POSTER = "/team/hero-poster.jpg";

// The box now runs the full width and height of the intro rather than being
// docked to a narrow share of it: at the old 46–68% widths, object-cover in
// BackgroundVideo had to crop the footage's own 1250×600 grid down to its
// centre few columns, so most of the roster — and the whole right edge —
// never appeared, and what did show stopped mid-tile at the viewport edge.
// Full width lets object-cover cover on the box's WIDTH instead of its
// height, so nearly the entire frame of faces is visible with only a
// sliver cropped top and bottom.
//
// The mask below is what keeps this from washing out the copy: it fades
// from fully transparent at the left edge up to fully revealed by ~42% of
// the viewport, so the video still dissolves into the page ground behind
// the eyebrow and headline, but climbs fast enough that the faces read
// through well before the copy block ends rather than staying hidden
// under it. The wash on top is a light vignette, not a heavy paint, so
// once revealed the faces stay vivid instead of graded flat.
//
// Below lg the intro drops to one column — the copy stacks above this
// backdrop instead of sitting beside it — so the whole layer is dimmed
// there to keep the text legible.
//
// Every fade reaches full transparency a few percent short of the edge,
// never at 100%. On scroll the page moves on fractional offsets and the
// mask can rasterise a pixel short of the box, which would flash a 1px
// line of footage along the seam; keeping the edge rows transparent means
// there is nothing to reveal.
const MASK = [
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 16%, rgba(0,0,0,0.85) 30%, #000 42%)",
  "linear-gradient(180deg, rgba(0,0,0,0) 2%, rgba(0,0,0,0.75) 18%, #000 40%, rgba(0,0,0,0.7) 88%, rgba(0,0,0,0) 97%)",
].join(", ");

export default function TeamHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 max-lg:opacity-50"
        style={{
          WebkitMaskImage: MASK,
          maskImage: MASK,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          // own compositor layer: the mask is rasterised once with the box
          // and travels with it, instead of being re-cut every scroll frame
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <BackgroundVideo src={TEAM_VIDEO} poster={TEAM_POSTER} inset="0" />
        {/* blue-hour vignette — deepest where the copy sits, all but gone past it */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,14,46,0.55) 0%, rgba(10,26,79,0.15) 40%, rgba(5,14,46,0.04) 65%), linear-gradient(180deg, rgba(5,14,46,0.3) 0%, rgba(5,14,46,0) 35%, rgba(5,14,46,0.4) 100%)",
          }}
        />
      </div>
    </div>
  );
}
