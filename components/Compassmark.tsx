/**
 * A compass rose folded from paper — eight points, each creased down its
 * spine into a lit and a shaded facet, the cardinal points in gold and the
 * short intercardinals in navy, with the brandmark roundel embossed at the
 * hub the way it sits in the roof of the origami house. It is the site's
 * "steer" made into an object.
 *
 * Facets are generated, not hand-placed: the light direction decides which
 * half of every point is lit, so the shading stays consistent all the way
 * round. Static and decorative — a server component with `uid`-namespaced
 * gradient ids, like Mailmark.
 */
const CX = 120;
const CY = 120;
const R_LONG = 112;
const R_SHORT = 62;
const R_IN = 26;
const LIGHT = [-0.6, -0.8]; // from the upper left, as everywhere else on the site

type Pt = [number, number];
const polar = (r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
};
const fmt = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

interface Facet {
  points: string;
  lit: boolean;
  cardinal: boolean;
}

function facets(): Facet[] {
  const out: Facet[] = [];
  for (let k = 0; k < 8; k++) {
    const deg = k * 45;
    const cardinal = k % 2 === 0;
    const tip = polar(cardinal ? R_LONG : R_SHORT, deg);
    const halves: Pt[] = [polar(R_IN, deg - 22.5), polar(R_IN, deg + 22.5)];
    // brightness of each half from where its centroid sits against the light
    const scored = halves.map((corner) => {
      const cx = (CX + tip[0] + corner[0]) / 3 - CX;
      const cy = (CY + tip[1] + corner[1]) / 3 - CY;
      const len = Math.hypot(cx, cy) || 1;
      return { corner, score: (cx / len) * LIGHT[0] + (cy / len) * LIGHT[1] };
    });
    const brighter = scored[0].score >= scored[1].score ? 0 : 1;
    scored.forEach((h, i) => {
      out.push({
        points: `${fmt([CX, CY])} ${fmt(tip)} ${fmt(h.corner)}`,
        lit: i === brighter,
        cardinal,
      });
    });
  }
  // short navy points first so the long gold ones sit over their bases
  return [...out.filter((f) => !f.cardinal), ...out.filter((f) => f.cardinal)];
}

const FACETS = facets();

export default function Compassmark({ className = "", uid = "compass" }: { className?: string; uid?: string }) {
  const id = (name: string) => `${uid}-${name}`;
  const fill = (f: Facet) =>
    f.cardinal ? (f.lit ? `url(#${id("goldLit")})` : `url(#${id("goldShade")})`) : f.lit ? `url(#${id("navyLit")})` : `url(#${id("navyShade")})`;

  // The brandmark is 29.73 units square; 40 units across fits the hub.
  const s = 40 / 29.73;

  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      style={{ filter: "drop-shadow(0 22px 40px rgba(5, 14, 46, 0.6)) drop-shadow(0 0 32px rgba(213, 179, 113, 0.14))" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("goldLit")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e9bd" />
          <stop offset="1" stopColor="#e2c890" />
        </linearGradient>
        <linearGradient id={id("goldShade")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cca44e" />
          <stop offset="1" stopColor="#9a7430" />
        </linearGradient>
        <linearGradient id={id("navyLit")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a7cab" />
          <stop offset="1" stopColor="#42558c" />
        </linearGradient>
        <linearGradient id={id("navyShade")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#27406c" />
          <stop offset="1" stopColor="#14305f" />
        </linearGradient>
        <linearGradient id={id("hub")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b5893a" />
          <stop offset="1" stopColor="#7a5c25" />
        </linearGradient>
        <linearGradient id={id("roundel")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e9bd" />
          <stop offset="1" stopColor="#dcbc7a" />
        </linearGradient>
      </defs>

      {/* the bearing ring — a hairline, like every rule on the site */}
      <circle cx={CX} cy={CY} r="118" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

      {FACETS.map((f) => (
        <polygon key={f.points} points={f.points} fill={fill(f)} />
      ))}

      {/* the hub — a dark gold disc with the brandmark laid over it; the
          sail is the cut-out, so the disc shows through it */}
      <circle cx={CX} cy={CY} r="24" fill={`url(#${id("hub")})`} />
      <g transform={`translate(${CX - 20} ${CY - 20}) scale(${s})`} fill={`url(#${id("roundel")})`}>
        <path d="M9.72,24.64C12.83,6.63,10.31.78,10.28.72,4.32,2.66,0,8.26,0,14.87c0,8.21,6.66,14.87,14.87,14.87,3.42,0,6.57-1.16,9.09-3.1-.55-.23-6.84-2.76-14.23-1.99Z" />
        <path d="M29.73,14.87C29.73,6.66,23.08,0,14.87,0c-1.6,0-3.14.26-4.58.72l13.69,25.89c3.5-2.72,5.76-6.97,5.76-11.75Z" />
      </g>
    </svg>
  );
}
