/**
 * A paper plane, drawn as flat folded facets — the same folded-paper
 * language as Brandboat and Mailmark: gold paper outside, navy where the
 * fold turns under, one warm light from the upper left. It climbs toward
 * the upper right so it reads as something sent, not something landing.
 *
 * Static and decorative, so it stays a server component: gradient ids are
 * namespaced by `uid` rather than by a hook. Render it twice on one page
 * and give the second a different `uid`.
 */
export default function Paperplane({
  className = "",
  uid = "paperplane",
  trail = true,
}: {
  className?: string;
  uid?: string;
  /** The dashed wake behind the tail — off for the small inline uses. */
  trail?: boolean;
}) {
  const id = (name: string) => `${uid}-${name}`;

  // Nose, left wing tip, tail centre on the top fold, right wing tip, keel.
  const N = "306 34";
  const TL = "12 88";
  const C = "134 118";
  const TR = "116 172";
  const K = "176 178";

  return (
    <svg
      className={className}
      viewBox="0 0 320 200"
      style={{ filter: "drop-shadow(0 18px 30px rgba(5, 14, 46, 0.6))" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("wingL")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e9bd" />
          <stop offset="1" stopColor="#d9ae5c" />
        </linearGradient>
        <linearGradient id={id("wingR")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5c25" />
          <stop offset="1" stopColor="#b5893a" />
        </linearGradient>
        <linearGradient id={id("keel")} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#14305f" />
          <stop offset="1" stopColor="#27406c" />
        </linearGradient>
        <linearGradient id={id("keelLit")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#42558c" />
          <stop offset="1" stopColor="#6a7cab" />
        </linearGradient>
      </defs>

      {trail && (
        <path
          d="M104 160C76 176 52 178 18 192"
          fill="none"
          stroke="rgba(213, 179, 113, 0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />
      )}

      {/* keel — the fold turned under, navy, and its lit outer layer */}
      <polygon points={`${N} ${C} ${K}`} fill={`url(#${id("keel")})`} />
      <polygon points={`${N} ${K} 196 166`} fill={`url(#${id("keelLit")})`} />
      {/* right wing — nearer, in the hull's shadow */}
      <polygon points={`${N} ${C} ${TR}`} fill={`url(#${id("wingR")})`} />
      {/* left wing — the lit top surface */}
      <polygon points={`${N} ${TL} ${C}`} fill={`url(#${id("wingL")})`} />
      {/* the centre crease catches the light */}
      <line x1="306" y1="34" x2="134" y2="118" stroke="#fff6dc" strokeOpacity="0.45" strokeWidth="1" />
    </svg>
  );
}
