import clsx from "clsx";
import BackgroundVideo from "@/components/BackgroundVideo";

/**
 * Full-bleed image section (§5.3). Until production photography lands
 * (blue-hour infrastructure, graded royal blue with gold horizon light —
 * §5.1), this renders a layered gradient stand-in with the same grade and
 * the mandatory bottom dissolve into --blue-950 so sections melt into the
 * page. Pass `src` when real imagery is available, or `video` for a motion
 * band; the overlay stays either way, and the gradient stays underneath a
 * video as its poster/fallback.
 *
 * The band is always dark imagery, so it carries `theme-dark` to keep white
 * ink for anything laid over it. What it dissolves into is the page ground:
 * --ground-rgb, blue-950 by default and white on light routes (globals.css).
 *
 * TODO(photography): replace gradient stand-ins with graded stills.
 */
export default function ImageBand({
  src,
  video,
  videoPoster,
  aspect = "1440/922",
  mobileAspect = "375/812",
  minHeight,
  className = "",
  overlayStrength = 1,
  parallax = false,
  children,
}: {
  src?: string;
  video?: string;
  videoPoster?: string;
  aspect?: string;
  mobileAspect?: string;
  minHeight?: string;
  className?: string;
  overlayStrength?: number;
  parallax?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx("theme-dark relative w-full overflow-hidden", className)}
      style={{ aspectRatio: minHeight ? undefined : aspect, minHeight }}
    >
      {/* far layer — sky */}
      <div
        data-speed={parallax ? "0.85" : undefined}
        className="absolute inset-[-10%_0]"
        style={{
          background: src
            ? `url(${src}) center / cover no-repeat`
            : "linear-gradient(180deg, #050E2E 0%, #0A1A4F 45%, #1A3D94 72%, #B59860 98%)",
        }}
      />
      {/* motion layer — sits over the gradient, which doubles as its poster */}
      {video && <BackgroundVideo src={video} poster={videoPoster} speed={parallax ? "0.85" : undefined} />}
      {/* blue-hour wash so footage reads as graded brand imagery, not stock */}
      {video && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,14,46,0.45) 0%, rgba(10,26,79,0.28) 55%, rgba(5,14,46,0.5) 100%)" }}
        />
      )}
      {/* near layer — foreground silhouette */}
      {!src && !video && (
        <div
          data-speed={parallax ? "1.05" : undefined}
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--ground-rgb),0) 0%, rgba(var(--ground-rgb),0.85) 55%, rgb(var(--ground-rgb)) 100%)",
            clipPath:
              "polygon(0 62%, 8% 55%, 16% 60%, 27% 48%, 38% 58%, 50% 44%, 61% 56%, 72% 47%, 84% 57%, 93% 50%, 100% 58%, 100% 100%, 0 100%)",
          }}
        />
      )}
      {/* mandatory dissolve into the page — §5.1 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(5,14,46,${0.2 * overlayStrength}) 0%, rgba(5,14,46,0) 40%, rgba(var(--ground-rgb),${overlayStrength}) 100%)`,
        }}
      />
      {children}
      {/* mobile crop hint kept as a comment: swap aspect via media query when real imagery lands ({mobileAspect}) */}
      <span className="hidden" data-mobile-aspect={mobileAspect} />
    </div>
  );
}
