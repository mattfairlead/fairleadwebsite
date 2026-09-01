import clsx from "clsx";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 3 — hairline-divided rows (the reference's .featured-item
 * pattern). Fairlead's row is the only filled one: --blue-900 with gold
 * checks that pop last. Row highlight on hover.
 */

const COLUMNS = ["Senior operators", "Live visibility"];

const ROWS: { who: string; note: string; has: [boolean, boolean]; fairlead?: boolean }[] = [
  { who: "Big 4", note: "Partial team on site; no live visibility between reports.", has: [false, false] },
  { who: "Restructuring firms", note: "Senior people, engaged late; no live data.", has: [true, false] },
  { who: "Solo fractional CFOs", note: "One person; no platform behind them.", has: [true, false] },
  { who: "AI & data vendors", note: "Software without operator access to the business.", has: [false, true] },
  {
    who: "Fairlead",
    note: "Both halves, integrated, at portfolio scale.",
    has: [true, true],
    fairlead: true,
  },
];

function Check({ on, gold }: { on: boolean; gold?: boolean }) {
  if (!on)
    return (
      <span className="body-md text-white-20" aria-label="No">
        —
      </span>
    );
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-label="Yes"
      data-anim={gold ? "pop" : undefined}
      className={gold ? "text-gold" : "text-white-60"}
    >
      <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CompetitorMatrix() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="The field" title={<>No competitor solves both halves.</>} />
      <HairlineFrame className="mt-14">
        {/* column heads */}
        <div className="grid grid-cols-[1fr_6rem_6rem] items-center gap-4 px-4 py-4 md:grid-cols-[14rem_1fr_8rem_8rem] md:px-6">
          <span className="label text-white-50">Who</span>
          <span className="label hidden text-white-50 md:block" />
          {COLUMNS.map((c) => (
            <span key={c} className="label text-center text-white-50">
              {c}
            </span>
          ))}
        </div>
        {ROWS.map((row) => (
          <div key={row.who} data-anim="slide-in" className="relative">
            <span className="dec left-0 top-0 h-px w-full" />
            <div
              className={clsx(
                "grid grid-cols-[1fr_6rem_6rem] items-center gap-4 px-4 py-6 transition-colors duration-200 md:grid-cols-[14rem_1fr_8rem_8rem] md:px-6",
                row.fairlead ? "bg-blue-900" : "hover:bg-blue-900/40"
              )}
            >
              <span className={clsx("body-lg", row.fairlead ? "text-gold" : "text-white-100")}>{row.who}</span>
              <span className="body-md hidden text-white-50 md:block">{row.note}</span>
              {row.has.map((on, i) => (
                <span key={i} className="flex justify-center">
                  <Check on={on} gold={row.fairlead} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </HairlineFrame>
    </SectionReveal>
  );
}
