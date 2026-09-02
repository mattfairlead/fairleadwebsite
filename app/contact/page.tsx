import type { Metadata } from "next";
import { Suspense } from "react";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import ContactForm from "@/components/ContactForm";
import HairlineFrame from "@/components/HairlineFrame";
import Mailmark from "@/components/Mailmark";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Talk to a partner. One form, one phone, four cities — Boston, Houston, Minneapolis, Maryland.",
  "/contact"
);

const CITIES = ["Boston", "Houston", "Minneapolis", "Maryland"];

/**
 * /contact — §4.7. One form, one phone, four cities. No personal emails,
 * no fax.
 */
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={<>Talk to a partner.</>}
        lead={<>Tell us what you&rsquo;re working through. A partner reads every submission.</>}
      />

      <SectionReveal className="container-page pb-24 max-lg:pt-8">
        <HairlineFrame verticalsAt={["60%"]}>
          {/* Docked right, resting on the frame's top hairline. `bottom-full`
              rather than a transform, so the reveal is free to animate one; the
              box carries the size and the aspect so the mark never has to be
              measured from its own intrinsic dimensions. */}
          <span
            data-anim="fade-up"
            aria-hidden="true"
            className="absolute bottom-full right-0 mb-3 block"
            style={{ width: "clamp(5.5rem, 8vw, 8.5rem)", aspectRatio: "300 / 186" }}
          >
            <Mailmark className="block h-full w-full" />
          </span>
          <div className="grid md:grid-cols-[3fr_2fr]">
            <div data-cell className="p-6 md:p-12">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
            <div data-cell className="spot flex flex-col gap-10 p-6 md:p-12">
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
                <ul data-anim="subtitle" className="flex flex-col gap-2">
                  {CITIES.map((c) => (
                    <li key={c} className="body-lg flex items-center gap-3 text-white-60">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/80" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <span className="label text-white-50">Elsewhere</span>
                <a
                  href="https://www.linkedin.com/company/fairlead-advisors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-lg link-underline self-start text-white-60"
                >
                  LinkedIn
                </a>
              </div>
              <p className="body-sm mt-auto text-white-40">No personal inboxes, no business developers. One form, one line, four cities.</p>
            </div>
          </div>
        </HairlineFrame>
      </SectionReveal>
    </>
  );
}
