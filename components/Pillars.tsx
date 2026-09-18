import Image from "next/image";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame, { RowRule } from "@/components/HairlineFrame";
import { ARROW } from "@/components/Btn";

/**
 * Home §4.1 row 5 — the four pillars in a 4-col hairline grid: .label
 * counter, brand icon, .h4, .body-md. Counters are legitimate here — it's
 * the delivery sequence. Each cell links to its /hands-on-engagements
 * anchor; the cell is a spotlight surface and the arrow at its foot signals
 * the link. Icons share one fixed h-14 w-14 box and object-contain, so the
 * four brand SVGs — wildly different aspect ratios — still read as a
 * uniform row instead of four different-sized marks.
 */

const PILLARS: { id: string; icon: { src: string; width: number; height: number }; title: string; body: string }[] = [
  {
    id: "embedded-leadership",
    icon: { src: "/brand/Seat.svg", width: 357, height: 493 },
    title: "Embedded leadership",
    body: "Fractional and interim CEO, CFO, COO, Controller. You don't get one person: you get the team.",
  },
  {
    id: "overhead-discipline",
    icon: { src: "/brand/information2Asset%206.svg", width: 322, height: 440 },
    title: "Overhead discipline",
    body: "G&A reduction, vendor management, 13-week cash forecasting, covenant compliance.",
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
    body: "The same team that runs the company runs the process to sell it.",
  },
];

export default function Pillars() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="How it runs" title={<>Operating discipline, on the sponsor&rsquo;s clock.</>} />
      <HairlineFrame columns={4} columnsFrom="lg" midColumns={2} className="mt-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <Link
              key={pillar.id}
              href={`/hands-on-engagements#${pillar.id}`}
              data-cell
              className="spot group flex flex-col gap-5 p-6 md:min-h-[20rem] md:p-8 xl:p-10"
            >
              {i >= 2 && <RowRule className="max-md:hidden lg:hidden" />}
              <span className="ghost-num" aria-hidden="true">
                0{i + 1}
              </span>
              <span
                className="flex h-14 w-14 items-center justify-center transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110"
                style={{ transitionTimingFunction: "var(--ease-spring)" }}
              >
                <Image
                  src={pillar.icon.src}
                  alt=""
                  width={pillar.icon.width}
                  height={pillar.icon.height}
                  data-anim="visual"
                  className="h-full w-full object-contain"
                />
              </span>
              <h3 data-anim="title" className="h4 mt-2">
                {pillar.title}
              </h3>
              <p data-anim="subtitle" className="body-md text-white-60">
                {pillar.body}
              </p>
              <span className="row-arrow mt-auto flex items-center gap-2 pt-4 text-white-40">
                <span className="button">Read more</span>
                {ARROW}
              </span>
            </Link>
          ))}
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
