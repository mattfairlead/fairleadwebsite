/**
 * HairlineFrame — the reference's `.dec` primitive. §5.8.1.
 *
 * Rules are never CSS borders: each is its own absolutely-positioned 1px div,
 * animated by sectionReveal(). Verticals are inset 1px top/bottom so corners
 * stay crisp at every DPR. Cell content sits in the grid; the frame is a
 * sibling layer.
 *
 * `columns` places vertical rules at even fractions (e.g. 3 columns → rules
 * at 33.333% and 66.666%). Pass `verticalsAt` for custom positions.
 */
export default function HairlineFrame({
  columns = 0,
  verticalsAt,
  rows,
  top = true,
  bottom = true,
  className = "",
  children,
}: {
  columns?: number;
  verticalsAt?: string[];
  rows?: string[]; // horizontal rules at custom offsets (e.g. "50%")
  top?: boolean;
  bottom?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const verticals =
    verticalsAt ??
    (columns > 1
      ? Array.from({ length: columns - 1 }, (_, i) => `${((i + 1) * 100) / columns}%`)
      : []);

  return (
    <div className={`relative ${className}`}>
      {top && <span data-dec="top" className="dec left-0 top-0 h-px w-full" />}
      {bottom && <span data-dec="bottom" className="dec bottom-0 left-0 h-px w-full" />}
      {rows?.map((offset) => (
        <span key={offset} data-dec="top" className="dec left-0 h-px w-full" style={{ top: offset }} />
      ))}
      {verticals.map((left) => (
        <span
          key={left}
          data-dec="v"
          className="dec w-px max-md:hidden"
          style={{ left, top: 1, height: "calc(100% - 2px)" }}
        />
      ))}
      {children}
    </div>
  );
}
