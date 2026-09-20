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

// The box is always sized from the footage's own 1250×600 aspect ratio, via
// the `aspect-[25/12]` class below, rather than stretched to fill the
// intro's width AND height — forcing both meant object-cover had to cover
// whichever dimension the box distorted more, cropping a full row of faces
// off whichever edges lost out. Which dimension is left to derive from the
// other flips at md:
//
//   - From md up, the box is pinned to the intro's height (`md:inset-y-0`)
//     and its width is left to the aspect ratio, so object-cover never has
//     to crop either axis: the whole grid of faces is always visible, at
//     whatever width that height implies. It still docks to the right edge
//     (no `left`, just `right: 0`), so on a narrower viewport it simply
//     runs past the left edge rather than shrinking and cropping again.
//
//   - Below md the intro carries no min-height, so its height comes purely
//     from stacked, wrapped copy — on a phone that's short enough that
//     deriving width from height the same way would run the box 2.5–3x the
//     screen width, leaving only its last sliver of faces inside the
//     viewport. So below md it runs the other way: a fixed share of the
//     viewport width instead (`max-md:w-[140%]`, vertically centered with
//     `top-1/2 -translate-y-1/2` since it no longer spans the full height),
//     and height follows from that width — still zero crop, just a
//     shorter, wider-in-view band that puts more of the roster on screen.
//
// The mask is what keeps this from washing out the copy: it fades from
// fully transparent at the box's own left edge up to fully revealed by
// ~42% of its width, so the video still dissolves into the page ground
// behind the eyebrow and headline, but climbs fast enough that the faces
// read through well before the copy block ends rather than staying hidden
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
  "linear-gradient(180deg, rgba(0,0,0,0) 2%, rgba(0,0,0,0.85) 12%, #000 24%, #000 92%, rgba(0,0,0,0.85) 97%, rgba(0,0,0,0) 100%)",
].join(", ");

export default function TeamHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={[
          "absolute right-0 aspect-[25/12] max-lg:opacity-40",
          "max-md:top-1/2 max-md:w-[140%] max-md:-translate-y-1/2",
          "md:inset-y-0 md:w-auto",
          // own compositor layer: the mask is rasterised once with the box
          // and travels with it, instead of being re-cut every scroll frame
          "transform-gpu will-change-transform",
        ].join(" ")}
        style={{
          WebkitMaskImage: MASK,
          maskImage: MASK,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <BackgroundVideo src={TEAM_VIDEO} poster={TEAM_POSTER} inset="0" mobileOk objectPosition="right center" />
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
