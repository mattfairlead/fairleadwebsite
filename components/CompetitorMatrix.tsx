import clsx from "clsx";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 3 — hairline-divided rows (the reference's .featured-item
 * pattern). Fairlead's row is the only filled one: a gold-edged blue-900
 * wash with gold checks that pop last. Every other row lights under the
 * cursor.
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

function Mark({ on, gold }: { on: boolean; gold?: boolean }) {
  if (!on)
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-white-20"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
        aria-label="No"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  return (
    <span
      className={clsx("flex h-8 w-8 items-center justify-center rounded-full", gold ? "text-blue-950" : "text-white-80")}
      style={{
        background: gold ? "var(--color-gold)" : "rgba(255,255,255,0.06)",
        boxShadow: gold ? "0 0 20px -4px rgba(213,179,113,0.7)" : "inset 0 0 0 1px rgba(255,255,255,0.1)",
      }}
      data-anim={gold ? "pop" : undefined}
      aria-label="Yes"
    >
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function CompetitorMatrix() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="The field" title={<>No competitor solves both halves.</>} eyebrowClass="text-gold" />
      <HairlineFrame className="mt-14">
        {/* column heads */}
        <div className="grid grid-cols-[1fr_5rem_5rem] items-center gap-4 px-4 py-4 md:grid-cols-[14rem_1fr_9rem_9rem] md:px-6">
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
            {row.fairlead && <span className="absolute inset-y-0 left-0 w-0.5 bg-gold" aria-hidden="true" />}
            <div
              className={clsx(
                "grid grid-cols-[1fr_5rem_5rem] items-center gap-4 px-4 py-6 md:grid-cols-[14rem_1fr_9rem_9rem] md:px-6",
                row.fairlead ? "" : "spot"
              )}
              style={
                row.fairlead
                  ? { background: "linear-gradient(90deg, rgba(213,179,113,0.14) 0%, rgba(10,26,79,0.9) 34%, rgba(10,26,79,0.6) 100%)" }
                  : undefined
              }
            >
              <span className="flex flex-col gap-1">
                <span className={clsx("body-lg", row.fairlead ? "text-gold" : "text-white-100")}>{row.who}</span>
                <span className="body-sm text-white-40 md:hidden">{row.note}</span>
              </span>
              <span className={clsx("body-md hidden md:block", row.fairlead ? "text-white-80" : "text-white-50")}>{row.note}</span>
              {row.has.map((on, i) => (
                <span key={i} className="flex justify-center">
                  <Mark on={on} gold={row.fairlead} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </HairlineFrame>
    </SectionReveal>
  );
}
