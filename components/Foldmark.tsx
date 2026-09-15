/**
 * Small folded-paper glyphs for the pillar cells — the seat, a ledger with
 * a dog-eared corner, a lens, a paper plane — in the same facet language as
 * the larger marks so the icon row reads as part of the set rather than a
 * different vocabulary. Gold paper, navy where a fold turns under, light
 * from the upper left. Drawn in a 64-unit box; meant for ~2.5–3rem.
 *
 * Static and decorative — a server component with `uid`-namespaced
 * gradient ids. The four kinds share one page happily; two of the same
 * kind on one page need different `uid`s.
 */
export type FoldmarkKind = "seat" | "ledger" | "lens" | "plane";

// Each glyph is drawn at a comfortable size, then scaled about the centre
// to fill the box — the flatter shapes (ledger, lens) need more.
const SCALE: Record<FoldmarkKind, number> = { seat: 1.12, ledger: 1.3, lens: 1.2, plane: 1.15 };

export default function Foldmark({
  kind,
  className = "",
  uid = "foldmark",
}: {
  kind: FoldmarkKind;
  className?: string;
  uid?: string;
}) {
  const id = (name: string) => `${uid}-${kind}-${name}`;
  const g = (name: string) => `url(#${id(name)})`;

  return (
    <svg className={`foldmark ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("lit")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e9bd" />
          <stop offset="1" stopColor="#e2c890" />
        </linearGradient>
        <linearGradient id={id("mid")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9ae5c" />
          <stop offset="1" stopColor="#cca44e" />
        </linearGradient>
        <linearGradient id={id("shade")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5c25" />
          <stop offset="1" stopColor="#b5893a" />
        </linearGradient>
        <linearGradient id={id("navy")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#42558c" />
          <stop offset="1" stopColor="#24335c" />
        </linearGradient>
        <linearGradient id={id("navyDeep")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#27406c" />
          <stop offset="1" stopColor="#14305f" />
        </linearGradient>
      </defs>

      <g transform={`translate(32 32) scale(${SCALE[kind]}) translate(-32 -32)`}>
      {kind === "seat" && (
        <>
          {/* the back — a slab standing on the seat's rear edge */}
          <polygon points="28 4 32 6 32 30 28 28" fill={g("navyDeep")} />
          <polygon points="32 6 52 16 52 40 32 30" fill={g("navy")} />
          {/* the seat block */}
          <polygon points="32 30 52 40 32 50 12 40" fill={g("lit")} />
          <polygon points="12 40 32 50 32 58 12 48" fill={g("shade")} />
          <polygon points="32 50 52 40 52 48 32 58" fill={g("mid")} />
        </>
      )}

      {kind === "ledger" && (
        <>
          <polygon points="32 22 56 34 32 46 8 34" fill={g("lit")} />
          {/* the ruled lines, embossed */}
          <g stroke="#24335c" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round">
            <line x1="16.9" y1="34.8" x2="33.7" y2="26.4" />
            <line x1="21.2" y1="37" x2="38" y2="28.6" />
            <line x1="25.5" y1="39.2" x2="42.3" y2="30.8" />
          </g>
          {/* the corner turned back — its shadow, then the navy underside */}
          <polygon points="20 40 32 46 44 40" fill="rgba(5, 14, 46, 0.55)" />
          <polygon points="20 40 44 40 32 34" fill={g("navy")} />
        </>
      )}

      {kind === "lens" && (
        <>
          <polygon points="32 32 6 32 32 18" fill={g("lit")} />
          <polygon points="32 32 32 18 58 32" fill={g("mid")} />
          <polygon points="32 32 58 32 32 46" fill={g("shade")} />
          <polygon points="32 32 32 46 6 32" fill="#cca44e" />
          <circle cx="32" cy="32" r="7.5" fill={g("navyDeep")} />
          <circle cx="29.5" cy="29.5" r="1.6" fill="#ffffff" fillOpacity="0.8" />
        </>
      )}

      {kind === "plane" && (
        <>
          <polygon points="58 12 36 36 44 54" fill={g("navyDeep")} />
          <polygon points="58 12 36 36 28 56" fill={g("shade")} />
          <polygon points="58 12 6 30 36 36" fill={g("lit")} />
        </>
      )}
      </g>
    </svg>
  );
}
