/**
 * Sailboat silhouette with a few birds — the Beacon masthead's boat, in
 * the site's navy, for the footer's waterline. Decorative only.
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
      {/* mainsail */}
      <path d="M116 4c-14 30-24 62-30 102h48Z" fill="currentColor" />
      {/* jib */}
      <path d="M104 40c-16 18-26 42-30 66h20Z" fill="currentColor" />
      {/* hull */}
      <path d="M56 112h100l-9 18c-28 5-56 5-84 0Z" fill="currentColor" />
    </svg>
  );
}
