import clsx from "clsx";
import HairlineFrame, { RowRule } from "@/components/HairlineFrame";

export interface GlassCell {
  /** numeric stat — rendered with the `count` tween (tabular-nums) */
  countTo?: number;
  countSuffix?: string;
  head: string;
  body?: string;
}

/**
 * Glass strip — §5.8.4. backdrop-blur + saturate panel, no fill beyond a
 * faint gradient, no border — only hairlines; anchored to the bottom edge of
 * a full-bleed image section. Used for the hero stats (60+ / 16 / 2010), the
 * Cottonwood options on the Intelligence band, and the engagement process on
 * /hands-on-engagements.
 *
 * Two layouts. A stat strip (cells with `countTo`) is three columns from sm
 * up and a ruled ledger of rows on a phone — number and label on one line,
 * so a long label never stacks four deep in a 120px column. A text strip is
 * four columns from lg up and a 2×2 grid below that, ruled on both axes.
 *
 * `clear` drops the blur and tint so the strip is see-through: only the
 * hairlines and the figures sit over the footage (the hero).
 */
export default function GlassStrip({
  cells,
  className = "",
  anchored = true,
  clear = false,
}: {
  cells: GlassCell[];
  className?: string;
  anchored?: boolean;
  clear?: boolean;
}) {
  const hasCounts = cells.some((c) => c.countTo !== undefined);
  return (
    <div className={`${anchored ? "absolute inset-x-0 bottom-0" : "relative"} glass-strip ${clear ? "glass-strip-clear" : ""} ${className}`}>
      {hasCounts ? (
        <HairlineFrame columns={cells.length} columnsFrom="sm">
          <div className="grid sm:grid-cols-3">
            {cells.map((cell, i) => (
              <div
                key={cell.head}
                data-cell
                className="spot flex items-baseline gap-3 px-5 py-4 sm:flex-col sm:items-center sm:justify-center sm:gap-2 sm:p-6 sm:text-center md:p-10"
              >
                {i > 0 && <RowRule className="sm:hidden" />}
                <span
                  className="h3 tabular text-white-100"
                  data-anim="count"
                  data-count-to={cell.countTo}
                  data-count-suffix={cell.countSuffix ?? ""}
                >
                  <span data-count-value>{cell.countTo}</span>
                  {cell.countSuffix && <span className="text-gold">{cell.countSuffix}</span>}
                </span>
                <span data-anim="title" className="body-sm text-white-50">
                  {cell.head}
                </span>
              </div>
            ))}
          </div>
        </HairlineFrame>
      ) : (
        <HairlineFrame columns={cells.length} columnsFrom="lg">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {cells.map((cell, i) => (
              <div key={cell.head} data-cell className="spot flex flex-col gap-2 p-5 md:p-8 lg:p-10">
                {/* the 2×2 layout's own rules: a row rule on the second row, a column rule on the right-hand cells */}
                {i >= 2 && <RowRule className="lg:hidden" />}
                {i % 2 === 1 && (
                  <span className="dec left-0 w-px lg:hidden" style={{ top: 1, height: "calc(100% - 2px)" }} aria-hidden="true" />
                )}
                <span className="label text-gold/80 tabular">0{i + 1}</span>
                <span data-anim="title" className={clsx("text-white-100", "body-lg")}>
                  {cell.head}
                </span>
                {cell.body && (
                  <span data-anim="subtitle" className="body-sm text-white-50">
                    {cell.body}
                  </span>
                )}
              </div>
            ))}
          </div>
        </HairlineFrame>
      )}
    </div>
  );
}
