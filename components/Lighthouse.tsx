/**
 * Lighthouse silhouette, companion to the footer's sailboat — same
 * currentColor-fill, no-stroke-fill construction, and the same pair of
 * gulls overhead. Decorative only.
 */
export default function Lighthouse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 140" className={className} style={style} aria-hidden="true" fill="none">
      {/* gulls */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M38 18c3-4 6-4 9 0c3-4 6-4 9 0" />
        <path d="M6 30c3-4 6-4 9 0c3-4 6-4 9 0" />
      </g>
      {/* roof + finial */}
      <circle cx="30" cy="3" r="2" fill="currentColor" />
      <path d="M23 16L37 16L30 4Z" fill="currentColor" />
      {/* lantern room */}
      <path d="M25 34L35 34L35 16L25 16Z" fill="currentColor" />
      {/* gallery ledge */}
      <path d="M21 40L39 40L39 34L21 34Z" fill="currentColor" />
      {/* tower */}
      <path d="M24 120L36 120L34 40L26 40Z" fill="currentColor" />
      {/* base flare */}
      <path d="M14 138L46 138L36 120L24 120Z" fill="currentColor" />
    </svg>
  );
}
