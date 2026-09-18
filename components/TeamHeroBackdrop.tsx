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

// The box runs the full height of the intro and is docked to the right
// edge at a fixed share of the viewport (not derived from the footage's own
// 1250×600 aspect ratio, which used to blow the box out to nearly the full
// width of the page and wash the copy on the left). object-cover in
// BackgroundVideo crops the grid of faces to whatever box shape results, so
// docking it narrower never distorts or empty-letterboxes the footage.
// Top, bottom and its left edge still fade into the page ground, but now
// over a box that actually stays clear of the intro's left-column copy.
// Below lg the intro drops to one column — the aside stacks under the
// lead paragraph instead of sitting beside the footage — so the dock still
// runs under that copy; dimmed there so the text stays legible until the
// two-column layout gives it a real lane of its own.
//
// Every fade reaches full transparency a few percent short of the edge,
// never at 100%. On scroll the page moves on fractional offsets and the
// mask can rasterise a pixel short of the box, which would flash a 1px
// line of footage along the seam; keeping the edge rows transparent means
// there is nothing to reveal.
const MASK = [
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 22%, #000 44%)",
  "linear-gradient(180deg, rgba(0,0,0,0) 3%, rgba(0,0,0,0.85) 26%, #000 55%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0) 96%)",
].join(", ");

export default function TeamHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-y-0 right-0 w-[92%] max-lg:opacity-40 md:w-[62%] lg:w-[46%] xl:w-[38%]"
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
        {/* blue-hour wash — deepest where the copy sits, lifting off the faces toward the edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,14,46,0.6) 0%, rgba(10,26,79,0.2) 45%, rgba(5,14,46,0.12) 100%), linear-gradient(180deg, rgba(5,14,46,0.3) 0%, rgba(5,14,46,0) 35%, rgba(5,14,46,0.4) 100%)",
          }}
        />
      </div>
    </div>
  );
}
