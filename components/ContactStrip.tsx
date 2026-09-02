import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";
import Btn from "@/components/Btn";

/**
 * Home §4.1 row 9 — contact strip: the ask · phone · four cities.
 * Two rules only (§5.8.8): vertical at .4, horizontal at .1.
 */
const CITIES = ["Boston", "Houston", "Minneapolis", "Maryland"];

export default function ContactStrip() {
  return (
    <SectionReveal className="section container-page">
      <HairlineFrame verticalsAt={["58%"]}>
        <div className="grid md:grid-cols-[58fr_42fr]">
          <div data-cell className="spot flex flex-col gap-5 p-6 md:p-12">
            <span className="label text-gold">Talk to a partner</span>
            <h2 data-anim="title" className="h2" style={{ fontSize: "clamp(2.25rem, 1.6rem + 2vw, 3.25rem)" }}>
              Working through something in the portfolio?
            </h2>
            <p data-anim="subtitle" className="body-lg max-w-md text-white-60">
              One conversation. A partner, not a business developer.
            </p>
            <div className="mt-4">
              <Btn href="/contact" arrow dataAnim="pop">
                Talk to a partner
              </Btn>
            </div>
          </div>
          <div data-cell className="spot flex flex-col justify-center gap-8 p-6 md:p-12">
            <div className="flex flex-col gap-2">
              <span className="label text-white-50">Phone</span>
              <a
                href="tel:+16173154822"
                className="h3 text-white-100 transition-colors duration-200 hover:text-gold tabular"
                style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem)" }}
              >
                (617) 315-4822
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="label text-white-50">Offices</span>
              <ul data-anim="subtitle" className="flex flex-wrap gap-x-6 gap-y-2">
                {CITIES.map((c) => (
                  <li key={c} className="body-md flex items-center gap-2 text-white-60">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/80" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
