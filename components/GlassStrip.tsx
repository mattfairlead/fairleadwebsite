import HairlineFrame from "@/components/HairlineFrame";

export interface GlassCell {
  /** numeric stat — rendered with the `count` tween (tabular-nums) */
  countTo?: number;
  countSuffix?: string;
  head: string;
  body?: string;
}

/**
 * Glass strip — §5.8.4. backdrop-blur(10px) panel, no fill, no border,
 * only hairlines; anchored to the bottom edge of a full-bleed image
 * section. Used for the hero stats (60+ / 16 / 2010), the Cottonwood
 * options on the Intelligence band, and the engagement process on /platform.
 */
export default function GlassStrip({
  cells,
  className = "",
  anchored = true,
}: {
  cells: GlassCell[];
  className?: string;
  anchored?: boolean;
}) {
  return (
    <div className={`${anchored ? "absolute inset-x-0 bottom-0" : "relative"} glass-strip ${className}`}>
      <HairlineFrame columns={cells.length}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
          {cells.map((cell) => (
            <div key={cell.head} data-cell className="flex flex-col gap-2 p-6 md:p-10">
              {cell.countTo !== undefined && (
                <span
                  className="h3 tabular"
                  data-anim="count"
                  data-count-to={cell.countTo}
                  data-count-suffix={cell.countSuffix ?? ""}
                >
                  {cell.countTo}
                  {cell.countSuffix ?? ""}
                </span>
              )}
              <span data-anim="title" className={cell.countTo !== undefined ? "body-sm text-white-50" : "body-lg text-white-100"}>
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
    </div>
  );
}
