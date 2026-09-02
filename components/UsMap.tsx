import { US_MAP_VIEWBOX, US_NATION_PATH, US_STATES_PATH } from "@/content/us-map";

export interface MapCity {
  label: string;
  x: number; // map-space coordinates (the us-map viewBox frame)
  y: number;
}

/**
 * The footer's map of the lower 48 — §5.8.6's ground. A dot-matrix fill
 * clipped to the nation, hairline state borders, a gold edge, the brandmark
 * ghosted over the western states, and a slow dashed route threading the
 * offices together. Pure SVG, no runtime; the
 * live dots layer sits on top and does the breathing.
 */
export default function UsMap({ cities = [], className = "" }: { cities?: MapCity[]; className?: string }) {
  // One loop through the offices — a quadratic arc per leg, bowed off the
  // straight line so the route reads as travel, not a wireframe.
  const route = cities
    .map((from, i) => {
      const to = cities[(i + 1) % cities.length];
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = Math.min(len * 0.18, 60);
      const cx = mx - (dy / len) * bow;
      const cy = my + (dx / len) * bow;
      return `M${from.x},${from.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${to.x},${to.y}`;
    })
    .join(" ");

  return (
    <svg viewBox={US_MAP_VIEWBOX} className={`h-full w-full overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <pattern id="us-map-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.45" fill="rgba(255,255,255,0.28)" />
        </pattern>
        <radialGradient id="us-map-ground" cx="70%" cy="40%" r="70%">
          <stop offset="0" stopColor="rgba(26,61,148,0.55)" />
          <stop offset="0.6" stopColor="rgba(15,42,110,0.35)" />
          <stop offset="1" stopColor="rgba(10,26,79,0.15)" />
        </radialGradient>
        <linearGradient id="us-map-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(213,179,113,0.18)" />
          <stop offset="0.55" stopColor="rgba(213,179,113,0.55)" />
          <stop offset="1" stopColor="rgba(230,209,170,0.75)" />
        </linearGradient>
        <clipPath id="us-map-clip">
          <path d={US_NATION_PATH} />
        </clipPath>
      </defs>

      {/* soft halo behind the landmass so it lifts off the band */}
      <path d={US_NATION_PATH} fill="none" stroke="rgba(213,179,113,0.10)" strokeWidth="14" strokeLinejoin="round" />
      <path d={US_NATION_PATH} fill="none" stroke="rgba(213,179,113,0.08)" strokeWidth="5" strokeLinejoin="round" />

      {/* ground + dot matrix */}
      <path d={US_NATION_PATH} fill="url(#us-map-ground)" />
      <path d={US_NATION_PATH} fill="url(#us-map-dots)" />

      {/* state hairlines, clipped so nothing bleeds past the coast */}
      <g clipPath="url(#us-map-clip)">
        <path
          d={US_STATES_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* the coastline */}
      <path
        d={US_NATION_PATH}
        fill="none"
        stroke="url(#us-map-edge)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* the brandmark, laid over the open western states like a watermark */}
      <g
        transform="translate(168 112) scale(8.8)"
        fill="rgba(230,209,170,0.13)"
        style={{ mixBlendMode: "screen" }}
      >
        <path d="M9.72,24.64C12.83,6.63,10.31.78,10.28.72,4.32,2.66,0,8.26,0,14.87c0,8.21,6.66,14.87,14.87,14.87,3.42,0,6.57-1.16,9.09-3.1-.55-.23-6.84-2.76-14.23-1.99Z" />
        <path d="M29.73,14.87C29.73,6.66,23.08,0,14.87,0c-1.6,0-3.14.26-4.58.72l13.69,25.89c3.5-2.72,5.76-6.97,5.76-11.75Z" />
      </g>

      {/* the route between offices */}
      {cities.length > 1 && (
        <path
          d={route}
          fill="none"
          stroke="rgba(213,179,113,0.6)"
          strokeWidth="1.25"
          strokeDasharray="4 5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="us-map-route"
        />
      )}
    </svg>
  );
}
