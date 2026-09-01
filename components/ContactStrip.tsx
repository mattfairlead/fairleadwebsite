import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 9 — contact strip: phone · four cities · form CTA.
 * Two rules only (§5.8.8): vertical at .4, horizontal at .1.
 */
export default function ContactStrip() {
  return (
    <SectionReveal className="section container-page">
      <HairlineFrame columns={2}>
        <div className="grid md:grid-cols-2">
          <div data-cell className="flex flex-col gap-4 p-6 md:p-10">
            <span className="label text-white-50">Talk to a partner</span>
            <h2 data-anim="title" className="h3">
              Working through something in the portfolio?
            </h2>
            <p data-anim="subtitle" className="body-lg text-white-60">
              One conversation. A partner, not a business developer.
            </p>
            <Link href="/contact" className="btn btn-primary button mt-4 self-start" data-anim="fade-up">
              Talk to a partner
            </Link>
          </div>
          <div data-cell className="flex flex-col justify-center gap-3 p-6 md:p-10">
            <a href="tel:+16173154822" className="body-xl text-white-100 transition-colors duration-200 hover:text-gold tabular">
              (617) 315-4822
            </a>
            <p data-anim="subtitle" className="body-md text-white-50">
              Boston · Houston · Minneapolis · Maryland
            </p>
          </div>
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
