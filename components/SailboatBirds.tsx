/**
 * The gulls that used to ride on the Sailboat mark, now split out so they
 * can drift on their own timeline (`sailboat-birds-drift`, globals.css) —
 * much slower than the boat, so it visibly coasts on ahead of them.
 * `sailboat-bird` gives each pair its own slow, staggered wingbeat so the
 * flock doesn't flap in lockstep. Decorative only.
 */
export default function SailboatBirds({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 14 48 32" className={className} style={style} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path className="sailboat-bird" d="M14 22c4-5 8-5 11 0c3-5 7-5 11 0" />
        <path className="sailboat-bird" d="M2 36c3-4 7-4 10 0c3-4 7-4 10 0" />
        <path className="sailboat-bird" d="M28 40c3-4 6-4 9 0c3-4 6-4 9 0" />
      </g>
    </svg>
  );
}
