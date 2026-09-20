/**
 * Sailboat silhouette — the Beacon masthead's boat, in the site's navy, for
 * the footer's waterline. The sail is the brandmark's sail (the cut-out in
 * the roundel), lifted verbatim and set on a hull, so the boat and the mark
 * share one shape. Decorative only.
 *
 * `sailboat-drift` (globals.css) carries the boat slowly across the water,
 * one direction only: it sails off the right edge (clipped by the band's
 * overflow-hidden) and loops back to its start, rather than reversing
 * course. The gulls that used to ride along with it now drift on their own,
 * much slower (SailboatBirds), so the boat coasts on ahead of them.
 */
export default function Sailboat({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 170 140" className={className} style={style} aria-hidden="true" fill="none">
      {/* the sail — brandmark coordinates (29.73 frame), scaled onto the hull */}
      <path
        d="M10.28 0.72L23.98 26.61C23.41 26.41 17.12 23.88 9.72 24.64C12.83 6.63 10.31 0.78 10.28 0.72Z"
        transform="translate(52 8) scale(3.9)"
        fill="currentColor"
      />
      {/* hull */}
      <path d="M56 112h100l-9 18c-28 5-56 5-84 0Z" fill="currentColor" />
    </svg>
  );
}
