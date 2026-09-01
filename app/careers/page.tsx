import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Careers",
  "We're hiring operators who work AI-first — senior finance and operating people who want the tools to match the work.",
  "/careers"
);

/**
 * /careers — §3: short, links to contact.
 */
export default function CareersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Careers"
        title={<>We&rsquo;re hiring operators who work AI-first.</>}
        lead={
          <>
            Senior finance and operating people who want to sit in the seat — with fifteen years of
            operating intelligence and the tools to match. If that&rsquo;s the work you want, tell us.
          </>
        }
      />
      <SectionReveal className="container-page pb-24">
        <Link href="/contact" className="btn btn-primary button" data-anim="pop">
          Talk to a partner
        </Link>
      </SectionReveal>
    </>
  );
}
