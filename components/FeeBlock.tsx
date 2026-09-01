import SectionReveal from "@/components/SectionReveal";

/**
 * Home §4.1 row 8 — fee alignment, from deck slide 8.
 * TODO(copy): replace body with the verbatim slide-8 paragraph once the
 * deck text is dropped in; this draft carries the locked message ("we earn
 * alongside the sponsor, not in front of them") in the §10 voice.
 */
export default function FeeBlock() {
  return (
    <SectionReveal className="section container-page">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        <span data-anim="eyebrow" className="label text-white-50">
          Alignment
        </span>
        <h2 data-anim="h2" className="h2">
          Designed for how PE actually works.
        </h2>
        <p className="body-xl text-white-60" data-anim="fade-up">
          Our compensation is tied to the sponsor&rsquo;s success. We earn alongside the sponsor, not in
          front of them — and current fees run a fraction of Big-4 and investment-bank rates.
        </p>
      </div>
    </SectionReveal>
  );
}
