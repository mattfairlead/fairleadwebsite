import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";
import GlassStrip from "@/components/GlassStrip";
import ImageBand from "@/components/ImageBand";
import FeeBlock from "@/components/FeeBlock";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Platform",
  "How the embedded operating platform works: embedded leadership, overhead discipline, real-time visibility, exit-ready. Sitting in the seat, not visiting it.",
  "/platform"
);

/**
 * /platform — §4.2. The four pillars expanded (anchor IDs), the 2–4 week
 * assessment, and the fee structure.
 */

const PILLARS = [
  {
    id: "embedded-leadership",
    title: "Embedded leadership",
    body: (
      <>
        Fractional and interim CEO, CFO, COO, and Controller seats; board and operating partner roles;
        whole-company services when the situation calls for it. You don&rsquo;t get one person — you get the
        team behind the person, and it scales up or down with the engagement.
        {/* TODO(copy): fold in the current Services page content, edited to 40% length */}
      </>
    ),
  },
  {
    id: "overhead-discipline",
    title: "Overhead discipline",
    body: (
      <>
        G&amp;A reduction, vendor management, 13-week cash forecasting, covenant compliance.{" "}
        <em>
          &ldquo;Particularly for development-stage platforms where the fund is advancing G&amp;A and
          development capital, every month of overhead discipline is real return.&rdquo;
        </em>
      </>
    ),
  },
  {
    id: "real-time-visibility",
    title: "Real-time visibility",
    body: (
      <>
        Sponsors see what&rsquo;s happening without depending on management — or Fairlead — to tell them.
        Live dashboards, source-cited numbers, and reporting that doesn&rsquo;t wait for month-end. See{" "}
        <Link href="/intelligence" className="link-underline text-white-100">
          Intelligence
        </Link>
        .
      </>
    ),
  },
  {
    id: "exit-ready",
    title: "Exit-ready",
    body: (
      <>
        Sell-side readiness, buy-side diligence, capital raise preparation, and M&amp;A process management
        (no investment-banking or broker-dealer role). The same team that runs the company runs the process
        to sell it.
      </>
    ),
  },
];

const PROCESS = [
  { head: "Assess", body: "2–4 weeks inside the company. Contracts, financials, forecasts, interviews." },
  { head: "Embed", body: "The seats filled. The team behind them engaged." },
  { head: "Run", body: "Weekly cash, monthly close, live visibility for the sponsor." },
  { head: "Exit", body: "Ready when the window opens — the process run by the team that ran the company." },
];

export default function PlatformPage() {
  return (
    <>
      <PageIntro
        eyebrow="Platform"
        title={<>Sitting in the seat, not visiting it.</>}
        lead={
          <>
            You don&rsquo;t get one person — you get the team. Fairlead embeds finance and operating
            leadership inside PE-backed companies, and scales the engagement up or down as the situation
            moves.
          </>
        }
      />

      {PILLARS.map((pillar, i) => (
        <SectionReveal key={pillar.id} id={pillar.id} className="container-page scroll-mt-24 py-10">
          <HairlineFrame columns={1}>
            <div className="grid gap-6 p-6 md:grid-cols-[10rem_1fr] md:gap-14 md:p-10" data-cell>
              <span className="label text-white-50 tabular">0{i + 1}</span>
              <div className="flex max-w-3xl flex-col gap-4">
                <h2 data-anim="title" className="h3">
                  {pillar.title}
                </h2>
                <p data-anim="subtitle" className="body-lg text-white-60">
                  {pillar.body}
                </p>
              </div>
            </div>
          </HairlineFrame>
        </SectionReveal>
      ))}

      {/* Portfolio company assessment + engagement process */}
      <SectionReveal className="section">
        <div className="container-page">
          <span data-anim="eyebrow" className="label text-white-50">
            Where it starts
          </span>
          <h2 data-anim="h2" className="h2 mt-4 max-w-4xl">
            The portfolio company assessment.
          </h2>
          <p className="body-lg mt-6 max-w-3xl text-white-60" data-anim="fade-up">
            Two to four weeks, accelerated by synthesizing contracts, financials, forecasts, and interviews
            into a persistent repository — one the sponsor keeps using long after the assessment ends.
          </p>
        </div>
        <div className="relative mt-14">
          <ImageBand aspect="1440/863" minHeight="22rem" overlayStrength={0.9}>
            <GlassStrip cells={PROCESS} />
          </ImageBand>
        </div>
      </SectionReveal>

      <FeeBlock />

      <SectionReveal className="container-page pb-10">
        <Link href="/contact" className="btn btn-primary button" data-anim="pop">
          Talk to a partner
        </Link>
      </SectionReveal>
    </>
  );
}
