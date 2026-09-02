/**
 * Sailboat silhouette with a few birds — the Beacon masthead's boat, in
 * the site's navy, for the footer's waterline. The sail is the brandmark's
 * sail (the cut-out in the roundel), lifted verbatim and set on a hull, so
 * the boat and the mark share one shape. Decorative only.
 */
export default function Sailboat({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 170 140" className={className} style={style} aria-hidden="true" fill="none">
      {/* birds */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 22c4-5 8-5 11 0c3-5 7-5 11 0" />
        <path d="M2 36c3-4 7-4 10 0c3-4 7-4 10 0" />
        <path d="M28 40c3-4 6-4 9 0c3-4 6-4 9 0" />
      </g>
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
