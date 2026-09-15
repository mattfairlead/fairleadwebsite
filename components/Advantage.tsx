import SectionReveal from "@/components/SectionReveal";
import ImageBand from "@/components/ImageBand";
import DataBox from "@/components/DataBox";

/**
 * Home §4.1 row 4 — the compounding asset. 2-col, 55/45: the open box with
 * data streaming out of it (DataBox) over the eyebrow, headline + gold-soft
 * italic subhead + paragraph / graded photo (scale-in) carrying the one
 * number that matters — fifteen years — as a display numeral.
 */
export default function Advantage() {
  return (
    <SectionReveal className="section container-page">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr] md:gap-20">
        <div className="flex flex-col gap-6">
          <div data-anim="zoom-in" className="-mb-2 w-[18rem] max-w-full" style={{ transformOrigin: "50% 85%" }}>
            <DataBox />
          </div>
          <span data-anim="eyebrow" className="label text-white-50">
            The compounding asset
          </span>
          <h2 data-anim="h2" className="h2">
            AI gets better with operators behind it.
          </h2>
          <p className="h3 italic" style={{ color: "var(--color-gold-soft)" }} data-anim="fade-up">
            Fairlead has fifteen years of them, inside the companies.
          </p>
          <p className="body-lg max-w-xl text-white-60" data-anim="fade-up" data-anim-delay="0.15">
            More data doesn&rsquo;t make AI smarter. An operator who&rsquo;s done the job does, and every
            engagement adds another one.
          </p>
          <ul className="mt-2 grid max-w-xl gap-3 sm:grid-cols-3 sm:gap-6" data-anim="fade-up" data-anim-delay="0.25">
            {[
              ["Built", "inside the seat"],
              ["Used", "on live work"],
              ["Reused", "across the portfolio"],
            ].map(([head, sub]) => (
              <li key={head} className="relative flex items-baseline gap-2 pl-4 sm:flex-col sm:items-stretch sm:gap-1">
                <span className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-px bg-gold/70" aria-hidden="true" />
                <span className="body-md text-white-100">{head}</span>
                <span className="body-sm text-white-40">{sub}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group relative overflow-hidden" style={{ borderRadius: "3px" }}>
          <div data-anim="scale-in" className="transition-transform duration-[1200ms] group-hover:scale-[1.03]" style={{ transitionTimingFunction: "var(--ease-out-expo)" }}>
            <ImageBand aspect="auto" className="aspect-[4/3] md:aspect-[4/5]" overlayStrength={0.7} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-8">
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
