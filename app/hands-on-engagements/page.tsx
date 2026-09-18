import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import TeamHeroBackdrop from "@/components/TeamHeroBackdrop";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame, { RowRule } from "@/components/HairlineFrame";
import GlassStrip from "@/components/GlassStrip";
import ImageBand from "@/components/ImageBand";
import FeeBlock from "@/components/FeeBlock";
import Btn from "@/components/Btn";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Hands-On Engagements",
  "The work Fairlead does inside PE-backed companies: asset management, sell-side preparation and execution, restructuring, fundraising, and finance and back-office management.",
  "/hands-on-engagements"
);

/**
 * /hands-on-engagements — the five hands-on scopes, each with its own anchor,
 * followed by how an engagement runs (the four pillars, kept as anchors so
 * the homepage deep links still land), the 2–4 week assessment, and fees.
 *
 * Replaces /platform: the word "platform" read as software, which buried the
 * operating work behind the tooling.
 */

const SCOPES = [
  {
    id: "asset-management",
    title: "Asset management",
    tags: ["Operating partner", "Board seat", "Budget & capex", "Sponsor reporting"],
    body: (
      <>
        <p>
          The sponsor owns the asset. We run it to the plan. Fairlead takes the operating partner or board
          seat and carries the week-to-week: budget and capex discipline, plan versus actual, vendor and
          contract decisions, and the reporting cadence the fund and its LPs expect.
        </p>
        <p>
          Most of this work starts where a sponsor has more assets than bandwidth: a development platform
          advancing G&amp;A, a carve-out still running on the seller&rsquo;s systems, a company whose
          management is strong on operations and thin on finance. We fill the gap without displacing the
          team that&rsquo;s already there.
        </p>
        <p>
          It is a standing seat, not a project. The engagement scales up when something breaks and back down
          when it doesn&rsquo;t.
        </p>
      </>
    ),
  },
  {
    id: "sell-side",
    title: "Sell-side preparation and execution",
    tags: ["Readiness", "Diligence", "Data room", "Process management"],
    body: (
      <>
        <p>
          Exit readiness starts long before a banker is hired: clean historicals, a forecast that can be
          defended line by line, a quality-of-earnings that survives contact with a buyer, and a data room
          that doesn&rsquo;t take six weeks to assemble.
        </p>
        <p>
          When the window opens we run the process alongside the banker: diligence responses, management
          presentations, buyer questions answered from the source rather than from memory. The same team
          that runs the company runs the process to sell it.
        </p>
        <p className="body-sm text-white-40">
          Fairlead prepares and manages the process. We do not act as an investment bank or broker-dealer.
        </p>
      </>
    ),
  },
  {
    id: "restructuring",
    title: "Restructuring",
    tags: ["13-week cash", "Lenders & covenants", "Turnaround", "Wind-down"],
    body: (
      <>
        <p>
          When cash gets tight the first job is knowing exactly how tight, and for how long. We build the
          13-week forecast, make it the operating document the company actually runs on, and put a number on
          every decision in front of the board.
        </p>
        <p>
          From there: covenant and lender conversations, vendor prioritization, contract renegotiation, cost
          structure taken down to what the business can carry. Someone from Fairlead is in the seat for
          those calls, not briefing from the outside.
        </p>
        <p>
          Some of this work ends in a turnaround and some ends in an orderly sale or wind-down. Both need the
          same thing: an operator with the numbers, who can talk to lenders.
        </p>
      </>
    ),
  },
  {
    id: "fundraising",
    title: "Fundraising",
    tags: ["Capital raise prep", "Model & materials", "Lenders", "Tax equity"],
    body: (
      <>
        <p>
          Capital raise preparation and execution: the model, the materials, the diligence file, and the
          outreach list, then the process itself, run with the sponsor through close.
        </p>
        <p>
          Development-stage platforms carry their own vocabulary: project finance, construction debt, tax
          equity, and their own diligence burden. We have sat on the company side of those raises, which is
          why the questions get answered the first time they are asked.
        </p>
      </>
    ),
  },
  {
    id: "finance-back-office",
    title: "Finance and back-office management",
    tags: ["Interim CFO / Controller", "Monthly close", "AP / AR", "Systems"],
    body: (
      <>
        <p>
          Fractional and interim CFO, COO, and Controller seats, and the team underneath them: monthly close,
          AP and AR, payroll, audit support, and the systems that carry all of it. You don&rsquo;t get one
          person: you get the team behind the person.
        </p>
        <p>
          Overhead discipline sits here too: G&amp;A reduction, vendor management, covenant compliance.{" "}
          <em>
            &ldquo;Particularly for development-stage platforms where the fund is advancing G&amp;A and
            development capital, every month of overhead discipline is real return.&rdquo;
          </em>
        </p>
        <p>
          It is also where visibility gets built. Once the close is clean and the data is structured, the
          sponsor can see the company without waiting for month-end. See{" "}
          <Link href="/intelligence" className="link-underline text-white-100">
            Intelligence
          </Link>
          .
        </p>
      </>
    ),
  },
];

// The four pillars, kept as anchors (the homepage Pillars cells deep-link to
// them) but demoted from page spine to how an engagement is run. Icons share
// one fixed h-12 w-12 box and object-contain, so the four brand SVGs — wildly
// different aspect ratios — still read as a uniform row (same treatment as
// the homepage's Pillars section).
const PILLARS: { id: string; icon: { src: string; width: number; height: number }; title: string; body: string }[] = [
  {
    id: "embedded-leadership",
    icon: { src: "/brand/Seat.svg", width: 357, height: 493 },
    title: "Embedded leadership",
    body: "Fractional and interim CEO, CFO, COO, Controller; board and operating partner roles. Sitting in the seat, not visiting it.",
  },
  {
    id: "overhead-discipline",
    icon: { src: "/brand/information2Asset%206.svg", width: 322, height: 440 },
    title: "Overhead discipline",
    body: "G&A reduction, vendor management, 13-week cash forecasting, covenant compliance: every month of it real return.",
  },
  {
    id: "real-time-visibility",
    icon: { src: "/brand/glassesAsset%207.svg", width: 550, height: 297 },
    title: "Real-time visibility",
    body: "Sponsors see what's happening without depending on management, or Fairlead, to tell them.",
  },
  {
    id: "exit-ready",
    icon: { src: "/brand/Plane2Asset%205.svg", width: 622, height: 344 },
    title: "Exit-ready",
    body: "The company is kept in a condition to be sold, so the process starts when the window opens rather than six weeks later.",
  },
];

const PROCESS = [
  { head: "Assess", body: "2–4 weeks inside the company. Contracts, financials, forecasts, interviews." },
  { head: "Embed", body: "The seats filled. The team behind them engaged." },
  { head: "Run", body: "Weekly cash, monthly close, live visibility for the sponsor." },
  { head: "Exit", body: "Ready when the window opens: the process run by the team that ran the company." },
];

export default function HandsOnEngagementsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Hands-on engagements"
        backdrop={<TeamHeroBackdrop />}
        className="flex flex-col justify-center md:min-h-[42rem]"
        title={<>We sit in the seat and do the work.</>}
        lead={
          <>
            Fairlead takes active, hands-on roles inside PE-backed companies: running the asset, preparing
            and executing the sale, restructuring the balance sheet, raising the capital, and holding the
            finance function together. You don&rsquo;t get one person; you get the team, and it scales up or
            down as the situation moves.
          </>
        }
        aside={
          <nav aria-label="On this page" className="flex flex-col gap-2">
            <span className="label mb-1 text-white-40">Five scopes</span>
            {SCOPES.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="body-sm flex items-center gap-3 text-white-50 transition-colors duration-200 hover:text-gold"
              >
                <span className="label tabular">0{i + 1}</span>
                {s.title}
              </a>
            ))}
          </nav>
        }
      />

      <SectionReveal className="container-page">
        <HairlineFrame>
          {SCOPES.map((scope, i) => (
            <div key={scope.id} id={scope.id} data-cell className="spot relative scroll-mt-28">
              {i > 0 && <span className="dec left-0 top-0 h-px w-full" />}
              <div className="grid gap-6 p-6 md:grid-cols-[10rem_1fr] md:gap-14 md:p-12">
                <span className="h3 text-white-20 tabular" style={{ letterSpacing: "-0.06em" }}>
                  0{i + 1}
                </span>
                <div className="flex max-w-3xl flex-col gap-5">
                  <h2 data-anim="title" className="h3">
                    {scope.title}
                  </h2>
                  <div data-anim="subtitle" className="body-lg flex flex-col gap-4 text-white-60">
                    {scope.body}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {scope.tags.map((t) => (
                      <span
                        key={t}
                        className="label tag"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HairlineFrame>
      </SectionReveal>

      {/* How an engagement runs — the four operating principles */}
      <SectionReveal className="section container-page">
        <SectionHead eyebrow="How it runs" title={<>Operating discipline, on the sponsor&rsquo;s clock.</>} />
        <HairlineFrame columns={4} columnsFrom="lg" midColumns={2} className="mt-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.id}
                id={pillar.id}
                data-cell
                className="spot flex scroll-mt-28 flex-col gap-4 p-6 md:min-h-[16rem] md:p-8 xl:p-10"
              >
                {i >= 2 && <RowRule className="max-md:hidden lg:hidden" />}
                <span className="ghost-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src={pillar.icon.src}
                    alt=""
                    width={pillar.icon.width}
                    height={pillar.icon.height}
                    data-anim="visual"
                    className="h-full w-full object-contain"
                  />
                </span>
                <h3 data-anim="title" className="h4 mt-1">
                  {pillar.title}
                </h3>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </HairlineFrame>
      </SectionReveal>

      {/* Portfolio company assessment + engagement process */}
      <SectionReveal className="section">
        <div className="container-page grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <span data-anim="eyebrow" className="label text-white-50">
              Where it starts
            </span>
            <h2 data-anim="h2" className="h2 max-w-4xl">
              The portfolio company assessment.
            </h2>
          </div>
          <p className="body-lg max-w-xl text-white-60 md:pb-2" data-anim="fade-up">
            Two to four weeks, accelerated by synthesizing contracts, financials, forecasts, and interviews
            into a persistent repository the sponsor keeps using long after the assessment ends.
          </p>
        </div>
        <div className="relative mt-14">
          <ImageBand aspect="1440/863" minHeight="24rem" overlayStrength={0.9}>
            <div className="absolute left-5 top-6 md:left-10 md:top-8" aria-hidden="true">
              <span className="label text-white-40">The engagement, in four beats</span>
            </div>
            <GlassStrip cells={PROCESS} />
          </ImageBand>
        </div>
      </SectionReveal>

      <FeeBlock />

      <SectionReveal className="container-page flex flex-col items-start gap-6 pb-16">
        <p className="body-lg max-w-2xl text-white-60" data-anim="fade-up">
          How we keep all of this visible:{" "}
          <Link href="/intelligence" className="link-underline text-white-100">
            Intelligence
          </Link>
          .
        </p>
        <Btn href="/contact" arrow dataAnim="pop">
          Talk to a partner
        </Btn>
      </SectionReveal>
    </>
  );
}
