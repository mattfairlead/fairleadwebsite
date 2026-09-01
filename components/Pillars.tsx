import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 5 — the four pillars in a 4-col hairline grid: .label
 * counter, line icon, .h4, .body-md. Counters are legitimate here — it's
 * the delivery sequence. Each cell links to its /platform anchor.
 */

const ICONS: Record<string, React.ReactNode> = {
  seat: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 14V6a2 2 0 012-2h10a2 2 0 012 2v8M5 14h18v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4zM9 20v4M19 20v4" />
    </svg>
  ),
  gauge: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 22a10 10 0 1110-10M14 22l6-8" />
    </svg>
  ),
  eye: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14s4.5-7 12-7 12 7 12 7-4.5 7-12 7-12-7-12-7z" />
      <circle cx="14" cy="14" r="3.5" />
    </svg>
  ),
  exit: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V6a2 2 0 012-2h8M17 9l5 5-5 5M22 14H11" />
    </svg>
  ),
};

const PILLARS = [
  {
    id: "embedded-leadership",
    icon: "seat",
    title: "Embedded leadership",
    body: "Fractional and interim CEO, CFO, COO, Controller. You don't get one person — you get the team.",
  },
  {
    id: "overhead-discipline",
    icon: "gauge",
    title: "Overhead discipline",
    body: "G&A reduction, vendor management, 13-week cash forecasting, covenant compliance.",
  },
  {
    id: "real-time-visibility",
    icon: "eye",
    title: "Real-time visibility",
    body: "Sponsors see what's happening without depending on management — or Fairlead — to tell them.",
  },
  {
    id: "exit-ready",
    icon: "exit",
    title: "Exit-ready",
    body: "The same team that runs the company runs the process to sell it.",
  },
];

export default function Pillars() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="How it runs" title={<>Operating discipline, on the sponsor&rsquo;s clock.</>} />
      <HairlineFrame columns={4} className="mt-14">
        <div className="grid md:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <Link
              key={pillar.id}
              href={`/platform#${pillar.id}`}
              data-cell
              className="group flex flex-col gap-4 p-6 transition-colors duration-200 hover:bg-blue-900/40 md:p-10"
            >
              <span className="label text-white-50 tabular">0{i + 1}</span>
              <span className="text-muted transition-colors duration-200 group-hover:text-gold">
                {ICONS[pillar.icon]}
              </span>
              <h3 data-anim="title" className="h4">
                {pillar.title}
              </h3>
              <p data-anim="subtitle" className="body-md text-white-60">
                {pillar.body}
              </p>
            </Link>
          ))}
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
