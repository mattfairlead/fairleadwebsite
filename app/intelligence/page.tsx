import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Intelligence",
  "Custom AI solutions that solve operational challenges. Solaris and the tools Fairlead builds inside engagements — in production, not in pilot.",
  "/intelligence"
);

/**
 * /intelligence — §4.3. The page that proves the AI half without shouting.
 */

const STRAPLINES = [
  "Your entire portfolio, live — every issue one click from its source.",
  "Every number traces back to its source — full audit trail, automatically.",
  "Predicts major equipment failures weeks before they happen.",
  "Ask for any table, chart, or visual — push it straight into your board deck.",
  "1,000+ documents indexed, searchable, readable — right in the app.",
  "Drop in a 47-tab workbook — get back a clean, AI-ready model.",
  "Sweeps your inbox — every attachment extracted, routed, stored.",
];

const TOOLS = [
  {
    name: "Solaris",
    line: "Operating intelligence platform — portfolio map, provenance financials, predictive risk, sketchpad, knowledge base.",
  },
  {
    name: "Working capital & cash flow dashboard",
    line: "QuickBooks + the order system in, a 13-week forecast out — the sponsor checks it before every meeting.",
  },
  {
    name: "Board report generator",
    line: "Formatted, editable, audit-trailed board packs assembled from live data.",
  },
  {
    name: "AP triage & scheduling",
    line: "Vendor priority buckets, payments auto-scheduled under a weekly cap.",
  },
  {
    name: "Vendor sentiment tracker",
    line: "Flags tone escalation in vendor email so AR/AP gets prioritized before it becomes a call.",
  },
  {
    name: "Sherpa",
    line: "The assistant that noticed a client's largest customer was being undercharged.",
  },
];

// Cottonwood four options — slide 6. TODO(§9): confirm Cottonwood/Dominion
// naming is cleared for the public site; fallback copy is "a utility-scale
// solar platform" / "the utility."
const OPTIONS = [
  { head: "Accept", body: "Pay the $720K claim as presented.", ev: "−$720K" },
  { head: "Withdraw", body: "Exit the queue; forfeit position and sunk costs.", ev: "Position lost" },
  { head: "Counter", body: "Contest with matched precedent from the interconnection record.", ev: "Recommended" },
  { head: "Escalate", body: "Formal dispute with counsel engaged.", ev: "Higher cost, slower" },
];

export default function IntelligencePage() {
  return (
    <>
      <PageIntro
        eyebrow="Intelligence"
        title={<>Custom AI solutions that solve operational challenges.</>}
        lead={
          <>
            AI is a core capability at Fairlead — used daily, in production, across engagements for more
            than six months. Past the pilot phase most firms are stuck in. Every tool was built to solve a
            specific client&rsquo;s pain, which is why they generalize.
          </>
        }
      />

      {/* Demo reel — Phase 1 placeholder until Ryan's footage is cut (§8) */}
      <SectionReveal className="section container-page">
        <SectionHead eyebrow="Solaris" title={<>See the platform run.</>} />
        <div className="relative mt-14 overflow-hidden" style={{ aspectRatio: "16/9", borderRadius: "3px" }}>
          {/* TODO(media): embed the Solaris demo reel (mp4 + webm, poster) once cut */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "radial-gradient(100% 80% at 50% 30%, #0F2A6E 0%, #0A1A4F 50%, #050E2E 100%)",
            }}
          >
            <span className="body-lg text-white-50">Demo reel — coming with the next cut</span>
          </div>
        </div>
        <ul className="mt-10 grid gap-x-14 gap-y-3 md:grid-cols-2">
          {STRAPLINES.map((s) => (
            <li key={s} className="body-md flex items-baseline gap-3 text-white-60" data-anim="fade-up">
              <span className="inline-block h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-gold" />
              {s}
            </li>
          ))}
        </ul>
      </SectionReveal>

      {/* Tool gallery */}
      <SectionReveal className="section container-page">
        <SectionHead
          eyebrow="The tools"
          title={<>Built for a portfolio company. Reused across the portfolio.</>}
        />
        <HairlineFrame columns={3} rows={["50%"]} className="mt-14">
          <div className="grid md:grid-cols-3">
            {TOOLS.map((tool) => (
              <div key={tool.name} data-cell className="flex flex-col gap-3 p-6 md:p-10">
                {/* TODO(media): sanitized screenshot per tool */}
                <h3 data-anim="title" className="h4">
                  {tool.name}
                </h3>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {tool.line}
                </p>
              </div>
            ))}
          </div>
        </HairlineFrame>
      </SectionReveal>

      {/* Cottonwood case study — static in Phase 1; pin-steps reveal in Phase 2 */}
      <SectionReveal className="section container-page" id="cottonwood">
        <SectionHead eyebrow="Case study — Cottonwood Solar" title={<>A $720K claim, answered in four options.</>} />
        <p className="body-lg mt-6 max-w-3xl text-white-60" data-anim="fade-up">
          Dominion presented a $720K interconnection claim. Solaris synthesized the contract record, the
          correspondence, and the precedent — and returned a decision memo the same week: four options,
          each priced.
        </p>
        <HairlineFrame columns={4} className="mt-14">
          <div className="grid md:grid-cols-4">
            {OPTIONS.map((option, i) => (
              <div key={option.head} data-cell className="flex flex-col gap-3 p-6 md:p-8">
                <span className="label text-white-50 tabular">0{i + 1}</span>
                <h3 data-anim="title" className="h4">
                  {option.head}
                </h3>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {option.body}
                </p>
                <span className="body-sm mt-auto text-gold">{option.ev}</span>
              </div>
            ))}
          </div>
        </HairlineFrame>
        <p className="body-md mt-8 max-w-3xl text-white-50" data-anim="fade-up">
          Expected value of the recommended path: ~$360K net expected savings, ~$75K at risk, 60% success
          assumed. Every figure traced to its source document.
        </p>
      </SectionReveal>

      {/* How we work with your team on AI */}
      <SectionReveal className="section container-page">
        <SectionHead eyebrow="Working with your team" title={<>Bottom-up tooling, top-down strategy.</>} />
        <div className="mt-10 flex max-w-3xl flex-col gap-4">
          {[
            "Team upskilling — your people learn the tools by using them on live work.",
            "Tools built for the engagement — against your actual pain, not a demo dataset.",
            "Integrations to the systems you already run — accounting, orders, email.",
          ].map((line) => (
            <p key={line} className="body-lg text-white-60" data-anim="fade-up">
              {line}
            </p>
          ))}
        </div>
      </SectionReveal>

      {/* Client portal + CTA */}
      <SectionReveal className="container-page pb-20">
        <HairlineFrame columns={2}>
          <div className="grid md:grid-cols-2">
            <div data-cell className="flex flex-col gap-3 p-6 md:p-10">
              <span className="label text-white-50">Client portal</span>
              <p data-anim="title" className="body-lg text-white-60">
                Engagement clients work in the tools at{" "}
                <a href="https://tools.fairleadadvisors.com" className="link-underline text-white-100">
                  tools.fairleadadvisors.com
                </a>{" "}
                — two-factor authentication required.
              </p>
            </div>
            <div data-cell className="flex flex-col items-start justify-center gap-4 p-6 md:p-10">
              <p data-anim="title" className="body-lg text-white-60">
                Want a deeper demo of Solaris — or a custom solution built for you?
              </p>
              <Link href="/contact" className="btn btn-primary button">
                Talk to a partner
              </Link>
            </div>
          </div>
        </HairlineFrame>
      </SectionReveal>
    </>
  );
}
