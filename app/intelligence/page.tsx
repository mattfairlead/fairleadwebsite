import type { Metadata } from "next";
import clsx from "clsx";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";
import Btn from "@/components/Btn";
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
    flagship: true,
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
  { head: "Accept", body: "Pay the $720K claim as presented.", ev: "−$720K", recommended: false },
  { head: "Withdraw", body: "Exit the queue; forfeit position and sunk costs.", ev: "Position lost", recommended: false },
  { head: "Counter", body: "Contest with matched precedent from the interconnection record.", ev: "Recommended", recommended: true },
  { head: "Escalate", body: "Formal dispute with counsel engaged.", ev: "Higher cost, slower", recommended: false },
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
        <div className="group relative mt-14 overflow-hidden" style={{ aspectRatio: "16/9", borderRadius: "3px" }}>
          {/* TODO(media): embed the Solaris demo reel (mp4 + webm, poster) once cut */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(100% 80% at 50% 30%, #0F2A6E 0%, #0A1A4F 50%, #050E2E 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full text-gold transition-transform duration-500 group-hover:scale-105"
              style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.45), 0 0 60px -12px rgba(213,179,113,0.5)", transitionTimingFunction: "var(--ease-spring)" }}
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <path d="M7 4.5v13l10-6.5z" />
              </svg>
            </span>
            <span className="label text-white-50">Demo reel — coming with the next cut</span>
          </div>
          <span className="pointer-events-none absolute left-0 top-0 h-px w-16 bg-gold/70" aria-hidden="true" />
          <span className="pointer-events-none absolute left-0 top-0 h-16 w-px bg-gold/70" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-px w-16 bg-gold/70" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-16 w-px bg-gold/70" aria-hidden="true" />
        </div>
        <HairlineFrame columns={2} className="mt-14">
          <ul className="grid md:grid-cols-2">
            {STRAPLINES.map((s, i) => (
              <li key={s} data-cell className="spot flex items-start gap-5 px-6 py-6 md:px-8" data-anim="fade-up" data-anim-delay={String(i * 0.05)}>
                <span className="label pt-1 text-gold/80 tabular">0{i + 1}</span>
                <span data-anim="title" className="body-md text-white-80">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </HairlineFrame>
      </SectionReveal>

      {/* Tool gallery */}
      <SectionReveal className="section container-page">
        <SectionHead
          eyebrow="The tools"
          title={<>Built for a portfolio company. Reused across the portfolio.</>}
        />
        <HairlineFrame columns={3} rows={["50%"]} className="mt-14">
          <div className="grid md:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <div key={tool.name} data-cell className="spot flex min-h-[15rem] flex-col gap-3 p-6 md:p-10">
                {/* TODO(media): sanitized screenshot per tool */}
                <span className="label flex items-center gap-2 text-white-40 tabular">
                  0{i + 1}
                  {tool.flagship && <span className="rounded-[3px] bg-gold/15 px-1.5 py-0.5 text-gold">Flagship</span>}
                </span>
                <h3 data-anim="title" className="h4 mt-2">
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
      <SectionReveal className="section container-page scroll-mt-24" id="cottonwood">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <SectionHead eyebrow="Case study — Cottonwood Solar" title={<>A $720K claim, answered in four options.</>} />
          <p className="body-lg max-w-xl text-white-60 md:pb-2" data-anim="fade-up">
            Dominion presented a $720K interconnection claim. Solaris synthesized the contract record, the
            correspondence, and the precedent — and returned a decision memo the same week: four options,
            each priced.
          </p>
        </div>
        <HairlineFrame columns={4} className="mt-14">
          <div className="grid md:grid-cols-4">
            {OPTIONS.map((option, i) => (
              <div
                key={option.head}
                data-cell
                className={clsx("spot relative flex min-h-[17rem] flex-col gap-3 p-6 md:p-8")}
                style={
                  option.recommended
                    ? { background: "linear-gradient(180deg, rgba(213,179,113,0.10) 0%, rgba(213,179,113,0.02) 100%)" }
                    : undefined
                }
              >
                {option.recommended && <span className="absolute inset-x-0 top-0 h-0.5 bg-gold" aria-hidden="true" />}
                <span className={clsx("label tabular", option.recommended ? "text-gold" : "text-white-50")}>0{i + 1}</span>
                <h3 data-anim="title" className="h4">
                  {option.head}
                </h3>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {option.body}
                </p>
                <span className={clsx("mt-auto flex items-center gap-2 pt-4", option.recommended ? "body-md text-gold" : "body-sm text-white-50 tabular")}>
                  {option.recommended && <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
                  {option.ev}
                </span>
              </div>
            ))}
          </div>
        </HairlineFrame>
        <dl className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-3" data-anim="fade-up">
          {[
            ["~$360K", "net expected savings"],
            ["~$75K", "at risk"],
            ["60%", "success assumed"],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col gap-1 border-l border-white-10 pl-4">
              <dt className="h4 text-white-100 tabular">{n}</dt>
              <dd className="body-sm text-white-50">{l}</dd>
            </div>
          ))}
        </dl>
        <p className="body-sm mt-6 max-w-3xl text-white-40">Every figure traced to its source document.</p>
      </SectionReveal>

      {/* How we work with your team on AI */}
      <SectionReveal className="section container-page">
        <SectionHead eyebrow="Working with your team" title={<>Bottom-up tooling, top-down strategy.</>} />
        <HairlineFrame columns={3} className="mt-14">
          <div className="grid md:grid-cols-3">
            {[
              ["Team upskilling", "Your people learn the tools by using them on live work."],
              ["Tools built for the engagement", "Against your actual pain, not a demo dataset."],
              ["Integrations you already run", "Accounting, orders, email — the systems that are there."],
            ].map(([head, body], i) => (
              <div key={head} data-cell className="spot flex flex-col gap-3 p-6 md:p-10">
                <span className="label text-white-40 tabular">0{i + 1}</span>
                <h3 data-anim="title" className="h4">
                  {head}
                </h3>
                <p data-anim="subtitle" className="body-md text-white-60">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </HairlineFrame>
      </SectionReveal>

      {/* Client portal + CTA */}
      <SectionReveal className="container-page pb-24">
        <HairlineFrame columns={2}>
          <div className="grid md:grid-cols-2">
            <div data-cell className="spot flex flex-col gap-3 p-6 md:p-10">
              <span className="label text-white-50">Client portal</span>
              <p data-anim="title" className="body-lg text-white-60">
                Engagement clients work in the tools at{" "}
                <a href="https://tools.fairleadadvisors.com" className="link-underline text-white-100">
                  tools.fairleadadvisors.com
                </a>{" "}
                — two-factor authentication required.
              </p>
            </div>
            <div data-cell className="spot flex flex-col items-start justify-center gap-5 p-6 md:p-10">
              <p data-anim="title" className="body-lg text-white-60">
                Want a deeper demo of Solaris — or a custom solution built for you?
              </p>
              <Btn href="/contact" arrow>
                Talk to a partner
              </Btn>
            </div>
          </div>
        </HairlineFrame>
      </SectionReveal>
    </>
  );
}
