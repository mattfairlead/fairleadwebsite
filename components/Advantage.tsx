import SectionReveal from "@/components/SectionReveal";
import ImageBand from "@/components/ImageBand";

/**
 * Home §4.1 row 4 — the compounding asset. 2-col, 55/45: headline + gold-soft
 * italic subhead + paragraph / graded photo (scale-in) carrying the one
 * number that matters — fifteen years — as a display numeral.
 */
export default function Advantage() {
  return (
    <SectionReveal className="section container-page">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr] md:gap-20">
        <div className="flex flex-col gap-6">
          <span data-anim="eyebrow" className="label text-white-50">
            The compounding asset
          </span>
          <h2 data-anim="h2" className="h2">
            AI gets better with high-quality data.
          </h2>
          <p className="h3 italic" style={{ color: "var(--color-gold-soft)" }} data-anim="fade-up">
            Fairlead has 15 years of it, from inside the companies.
          </p>
          <p className="body-lg max-w-xl text-white-60" data-anim="fade-up" data-anim-delay="0.15">
            Every engagement deepens the operating intelligence behind our tools — captured, structured,
            source-cited.
          </p>
          <ul className="mt-2 grid max-w-xl grid-cols-3 gap-6" data-anim="fade-up" data-anim-delay="0.25">
            {[
              ["Captured", "inside the seat"],
              ["Structured", "one schema"],
              ["Cited", "to the source"],
            ].map(([head, sub]) => (
              <li key={head} className="relative flex flex-col gap-1 pl-4">
                <span className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-px bg-gold/70" aria-hidden="true" />
                <span className="body-md text-white-100">{head}</span>
                <span className="body-sm text-white-40">{sub}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group relative overflow-hidden" style={{ borderRadius: "3px" }}>
          <div data-anim="scale-in" className="transition-transform duration-[1200ms] group-hover:scale-[1.03]" style={{ transitionTimingFunction: "var(--ease-out-expo)" }}>
            <ImageBand aspect="4/5" overlayStrength={0.7} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
            <div className="flex flex-col">
              <span className="h1 text-white-100 tabular" style={{ fontSize: "clamp(4.5rem, 9vw, 7.5rem)" }}>
                15
              </span>
              <span className="label -mt-1 text-gold">years inside the companies</span>
            </div>
            <span className="label text-white-40">since 2010</span>
          </div>
          <span className="pointer-events-none absolute left-0 top-0 h-px w-16 bg-gold/70" aria-hidden="true" />
          <span className="pointer-events-none absolute left-0 top-0 h-16 w-px bg-gold/70" aria-hidden="true" />
        </div>
      </div>
    </SectionReveal>
  );
}
