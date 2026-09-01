import type { Metadata } from "next";
import { Suspense } from "react";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import ContactForm from "@/components/ContactForm";
import HairlineFrame from "@/components/HairlineFrame";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Talk to a partner. One form, one phone, four cities — Boston, Houston, Minneapolis, Maryland.",
  "/contact"
);

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

      <SectionReveal className="container-page pb-20">
        <HairlineFrame verticalsAt={["60%"]}>
          <div className="grid md:grid-cols-[3fr_2fr]">
            <div data-cell className="p-6 md:p-10">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
            <div data-cell className="flex flex-col gap-6 p-6 md:p-10">
              <div className="flex flex-col gap-2">
                <span className="label text-white-50">Phone</span>
                <a href="tel:+16173154822" className="body-xl text-white-100 transition-colors duration-200 hover:text-gold tabular">
                  (617) 315-4822
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="label text-white-50">Offices</span>
                <p data-anim="subtitle" className="body-lg text-white-60">
                  Boston · Houston · Minneapolis · Maryland
                </p>
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
            </div>
          </div>
        </HairlineFrame>
      </SectionReveal>
    </>
  );
}
