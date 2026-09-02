import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";
import Btn from "@/components/Btn";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Careers",
  "We're hiring operators who work AI-first — senior finance and operating people who want the tools to match the work.",
  "/careers"
);

// Light route (lib/theme.ts) — the browser chrome should match the white ground.
export const viewport: Viewport = { themeColor: "#ffffff" };

const TRAITS = [
  ["In the seat", "You've run a finance or operating function, not advised one."],
  ["AI-first", "You reach for the tool before the spreadsheet — and build the tool when it doesn't exist."],
  ["Sponsor-literate", "You know what a board wants to see before it asks."],
];

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
        aside={
          <Image
            src="/brand/origami-house.svg"
            alt=""
            width={820}
            height={660}
            className="h-auto w-64 max-md:mx-auto md:w-80 lg:w-96"
          />
        }
      />
      <SectionReveal className="container-page pb-24">
        <HairlineFrame columns={3}>
          <div className="grid md:grid-cols-3">
            {TRAITS.map(([head, body], i) => (
              <div key={head} data-cell className="spot flex flex-col gap-3 p-6 md:p-10">
                <span className="label text-white-40 tabular">0{i + 1}</span>
                <h2 data-anim="title" className="h4">
                  {head}
                </h2>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </HairlineFrame>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Btn href="/contact" arrow dataAnim="pop">
            Talk to a partner
          </Btn>
          <Link href="/team" className="body-sm link-underline text-white-60">
            Meet the team first
          </Link>
        </div>
      </SectionReveal>
    </>
  );
}
