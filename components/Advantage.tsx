import SectionReveal from "@/components/SectionReveal";
import ImageBand from "@/components/ImageBand";

/**
 * Home §4.1 row 4 — the compounding asset. 2-col: headline + gold-soft
 * italic subhead + paragraph / graded photo (scale-in).
 */
export default function Advantage() {
  return (
    <SectionReveal className="section container-page">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
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
        </div>
        <div data-anim="scale-in" className="overflow-hidden" style={{ borderRadius: "3px" }}>
          <ImageBand aspect="4/5" overlayStrength={0.6} />
        </div>
      </div>
    </SectionReveal>
  );
}
