/**
 * The envelope, drawn as four flat facets meeting at a centre fold — the
 * same folded-paper language as the origami boat in the hero, so the two
 * marks read as a set.
 *
 * Static and decorative, so it stays a server component: gradient ids are
 * namespaced by `uid` rather than by a hook, and nothing ships to the client.
 * Render it twice on one page and give the second a different `uid`.
 */
export default function Mailmark({
  className = "",
  uid = "mailmark",
}: {
  className?: string;
  uid?: string;
}) {
  const id = (name: string) => `${uid}-${name}`;

  // 300 × 186 — the flap's fold sits at 58% of the height, so the navy
  // reads as the open envelope seen from behind.
  const W = 300;
  const H = 186;
  const fold = `150 108`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      style={{ filter: "drop-shadow(0 18px 34px rgba(5, 14, 46, 0.55))" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("flap")} x1="0" y1="0" x2="0.55" y2="1">
          <stop offset="0" stopColor="#46578c" />
          <stop offset="1" stopColor="#24335c" />
        </linearGradient>
        <linearGradient id={id("left")} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#c2932f" />
          <stop offset="1" stopColor="#e0b45f" />
        </linearGradient>
        <linearGradient id={id("right")} x1="1" y1="0" x2="0" y2="0.6">
          <stop offset="0" stopColor="#f2d192" />
          <stop offset="1" stopColor="#d9a94a" />
        </linearGradient>
        <linearGradient id={id("bottom")} x1="0" y1="1" x2="0.8" y2="0">
          <stop offset="0" stopColor="#e6bb69" />
          <stop offset="1" stopColor="#c9993c" />
        </linearGradient>
        {/* The reference art carries a whisper of a corner radius */}
        <clipPath id={id("card")}>
          <rect x="0" y="0" width={W} height={H} rx="5" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id("card")})`}>
        <path d={`M0 0 L${W} 0 L${fold} Z`} fill={`url(#${id("flap")})`} />
        <path d={`M0 0 L${fold} L0 ${H} Z`} fill={`url(#${id("left")})`} />
        <path d={`M${W} 0 L${W} ${H} L${fold} Z`} fill={`url(#${id("right")})`} />
        <path d={`M0 ${H} L${fold} L${W} ${H} Z`} fill={`url(#${id("bottom")})`} />
      </g>
      {/* Lifts the silhouette off the blue ground without reading as a border */}
      <rect
        x="0.5"
        y="0.5"
        width={W - 1}
        height={H - 1}
        rx="5"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
    </svg>
  );
}
