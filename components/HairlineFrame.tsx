import clsx from "clsx";

/**
 * HairlineFrame — the reference's `.dec` primitive. §5.8.1.
 *
 * Rules are never CSS borders: each is its own absolutely-positioned 1px div,
 * animated by sectionReveal(). Verticals are inset 1px top/bottom so corners
 * stay crisp at every DPR. Cell content sits in the grid; the frame is a
 * sibling layer.
 *
 * `columns` places vertical rules at even fractions (e.g. 3 columns → rules
 * at 33.333% and 66.666%) from the `columnsFrom` breakpoint up (md by
 * default). A grid that steps down to fewer columns on a tablet passes
 * `midColumns` (+ `midFrom`, sm or md) and the frame draws that layout's
 * verticals only between the two breakpoints. Row rules for the stepped-down
 * layout are the cell's job — see <RowRule>. Pass `verticalsAt` for custom
 * positions.
 */
type Bp = "sm" | "md" | "lg";
const HIDE_BELOW: Record<Bp, string> = { sm: "max-sm:hidden", md: "max-md:hidden", lg: "max-lg:hidden" };
const HIDE_FROM: Record<Bp, string> = { sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden" };

function fractions(n: number): string[] {
  return n > 1 ? Array.from({ length: n - 1 }, (_, i) => `${((i + 1) * 100) / n}%`) : [];
}

export default function HairlineFrame({
  columns = 0,
  columnsFrom = "md",
  midColumns,
  midFrom = "md",
  verticalsAt,
  rows,
  top = true,
  bottom = true,
  className = "",
  children,
}: {
  columns?: number;
  columnsFrom?: Bp;
  midColumns?: number;
  midFrom?: Bp;
  verticalsAt?: string[];
  rows?: string[]; // horizontal rules at custom offsets (e.g. "50%") — desktop only
  top?: boolean;
  bottom?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const verticals = verticalsAt ?? fractions(columns);
  const mid = midColumns ? fractions(midColumns) : [];

  return (
    <div className={`relative ${className}`}>
      {top && <span data-dec="top" className="dec left-0 top-0 h-px w-full" />}
      {bottom && <span data-dec="bottom" className="dec bottom-0 left-0 h-px w-full" />}
      {rows?.map((offset) => (
        <span key={offset} data-dec="top" className="dec left-0 h-px w-full max-md:hidden" style={{ top: offset }} />
      ))}
      {verticals.map((left) => (
        <span
          key={left}
          data-dec="v"
          className={clsx("dec w-px", HIDE_BELOW[columnsFrom])}
          style={{ left, top: 1, height: "calc(100% - 2px)" }}
        />
      ))}
      {mid.map((left) => (
        <span
          key={`mid-${left}`}
          data-dec="v"
          className={clsx("dec w-px", HIDE_BELOW[midFrom], HIDE_FROM[columnsFrom])}
          style={{ left, top: 1, height: "calc(100% - 2px)" }}
        />
      ))}
      {children}
    </div>
  );
}

/**
 * RowRule — a horizontal hairline along the top edge of a grid cell, for the
 * rows a stepped-down layout creates. Where a 4-up grid becomes 2-up on a
 * tablet, cells 3 and 4 start a second row and carry one of these, shown
 * only between the breakpoints where that row exists. The cell must be
 * `relative` (every `[data-cell]` is).
 */
export function RowRule({ className }: { className: string }) {
  return <span data-dec="top" className={clsx("dec left-0 top-0 h-px w-full", className)} aria-hidden="true" />;
}
