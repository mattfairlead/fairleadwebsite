import clsx from "clsx";

/**
 * Full-bleed image section (§5.3). Until production photography lands
 * (blue-hour infrastructure, graded royal blue with gold horizon light —
 * §5.1), this renders a layered gradient stand-in with the same grade and
 * the mandatory bottom dissolve into --blue-950 so sections melt into the
 * page. Pass `src` when real imagery is available; the overlay stays.
 *
 * TODO(photography): replace gradient stand-ins with graded stills.
 */
export default function ImageBand({
  src,
  aspect = "1440/922",
  mobileAspect = "375/812",
  minHeight,
  className = "",
  overlayStrength = 1,
  parallax = false,
  children,
}: {
  src?: string;
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
      className={clsx("relative w-full overflow-hidden", className)}
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
      {/* near layer — foreground silhouette */}
      {!src && (
        <div
          data-speed={parallax ? "1.05" : undefined}
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,14,46,0) 0%, rgba(5,14,46,0.85) 55%, #050E2E 100%)",
            clipPath:
              "polygon(0 62%, 8% 55%, 16% 60%, 27% 48%, 38% 58%, 50% 44%, 61% 56%, 72% 47%, 84% 57%, 93% 50%, 100% 58%, 100% 100%, 0 100%)",
          }}
        />
      )}
      {/* mandatory dissolve into the page — §5.1 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(5,14,46,${0.2 * overlayStrength}) 0%, rgba(5,14,46,0) 40%, rgba(5,14,46,${overlayStrength}) 100%)`,
        }}
      />
      {children}
      {/* mobile crop hint kept as a comment: swap aspect via media query when real imagery lands ({mobileAspect}) */}
      <span className="hidden" data-mobile-aspect={mobileAspect} />
    </div>
  );
}
