import Image from "next/image";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 8 — fee alignment, from deck slide 8.
 * TODO(copy): replace body with the verbatim slide-8 paragraph once the
 * deck text is dropped in; this draft carries the locked message ("we earn
 * alongside the sponsor, not in front of them") in the §10 voice.
 *
 * The eyebrow is the origami-boat mark (public/brand/paperboat.png) rather
 * than a text label — the same folded-paper motif as Brandboat/Mailmark, in
 * its own finished render with a reflection fading into the ground already
 * baked into the alpha. `data-anim="eyebrow"` keeps it on sectionReveal()'s
 * plain fade-and-rise; the h2 right after still carries the section's
 * meaning, so the mark is decorative (empty alt).
 */
export default function FeeBlock() {
  return (
    <SectionReveal className="section container-page">
      <HairlineFrame>
        <div className="relative overflow-hidden px-6 py-20 md:py-28">
          {/* one warm light behind the statement */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: "radial-gradient(50% 60% at 50% 50%, rgba(213,179,113,0.09) 0%, rgba(213,179,113,0) 70%)" }}
          />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Image
              data-anim="eyebrow"
              src="/brand/paperboat.png"
              alt=""
              width={1151}
              height={1080}
              className="h-[3.75rem] w-auto md:h-[5.25rem]"
              style={{ filter: "drop-shadow(0 0 24px rgba(213, 179, 113, 0.25))" }}
            />
            <h2 data-anim="h2" className="h2">
              Designed for how PE actually works.
            </h2>
            <p className="body-xl text-white-60" data-anim="fade-up">
              Our compensation is tied to the sponsor&rsquo;s success. We earn alongside the sponsor, not in
              front of them — and current fees run a fraction of Big-4 and investment-bank rates.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-4" data-anim="fade-up" data-anim-delay="0.15">
              {["Success-linked", "No retainer creep", "A fraction of Big-4"].map((t) => (
                <span key={t} className="body-sm flex items-center gap-2 text-white-50">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
