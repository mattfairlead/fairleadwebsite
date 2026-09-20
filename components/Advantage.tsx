import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import DataBox from "@/components/DataBox";

/**
 * Home §4.1 row 4 — the compounding asset, merged with the intelligence
 * teaser that used to run as its own section. 2-col, 55/45: headline +
 * gold-soft italic subhead + paragraph + proof list + a one-line case-study
 * teaser on the left; DataBox — the open box with data streaming out of it —
 * docked to the right, with the one number that matters — fifteen years —
 * captioned underneath. DataBox reads scroll velocity itself, so the flow
 * only moves while the page is actually scrolling.
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
          <p className="body-md max-w-xl text-white-50" data-anim="fade-up" data-anim-delay="0.35">
            When a $720K utility claim landed on a portfolio company&rsquo;s desk, Solaris returned a
            four-option decision memo, every number traced to its source, with ~$360K in expected savings
            on the table.{" "}
            <Link href="/intelligence#case-study" className="link-underline text-white-100">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 md:items-end">
          <div data-anim="zoom-in" className="w-full max-w-sm" style={{ transformOrigin: "50% 85%" }}>
            <DataBox />
          </div>
          <div className="relative flex w-full max-w-sm items-end justify-between pt-5" data-anim="fade-up" data-anim-delay="0.2">
            <span className="absolute inset-x-0 top-0 h-px bg-white-10" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="h1 text-white-100 tabular" style={{ fontSize: "clamp(3.25rem, 6vw, 5rem)" }}>
                15
              </span>
              <span className="label -mt-1 text-gold">years inside the companies</span>
            </div>
            <span className="label text-white-40">since 2010</span>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
