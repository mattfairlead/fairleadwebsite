import Image from "next/image";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 2 — the deck's slide 2, verbatim structure: two problems,
 * two hairline-divided cells, no fills. The right cell's vertical rule is
 * the frame closing on "Information." Each cell carries a brand graphic in
 * place of the old ghost numeral — stacked above the copy on narrow screens,
 * alongside it once there's room — and the second problem — the one Fairlead
 * is built for — is the only one the eye lands on in gold.
 */
const CELLS = [
  {
    label: "Problem one",
    title: "Performance",
    body: "The visible problem. Revenue, margin, cash: the numbers every sponsor manages and a crowded market of firms offers to fix.",
    foot: "Most of the market competes here.",
    accent: false,
    icon: { src: "/brand/PlanAsset%203.svg", width: 622, height: 344 },
  },
  {
    label: "Problem two",
    title: "Information",
    body: "The harder problem. Knowing what is actually happening inside the company: the visibility LPs hold sponsors accountable for.",
    foot: "Most sponsors only solve one of the two.",
    accent: true,
    icon: { src: "/brand/InformationAsset%204.svg", width: 322, height: 440 },
  },
];

export default function TwoProblems() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="Two problems" title={<>Every portfolio company has two problems.</>} />
      <HairlineFrame columns={2} className="mt-14">
        <div className="grid md:grid-cols-2">
          {CELLS.map((cell) => (
            <div key={cell.title} data-cell className="spot flex gap-8 p-6 md:min-h-[18rem] md:p-10">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex h-12 items-end md:hidden" aria-hidden="true">
                  {cell.icon && (
                    <Image src={cell.icon.src} alt="" width={cell.icon.width} height={cell.icon.height} className="h-full w-auto" />
                  )}
                </div>
                <span className="label text-gold">{cell.label}</span>
                <h3 data-anim="title" className="h3">
                  {cell.title}
                </h3>
                <p data-anim="subtitle" className="body-lg max-w-md text-white-60">
                  {cell.body}
                </p>
                <p className="body-sm mt-auto flex items-center gap-3 pt-4 italic text-white-40">
                  <span className={cell.accent ? "inline-block h-px w-5 bg-gold" : "inline-block h-px w-5 bg-white-20"} aria-hidden="true" />
                  {cell.foot}
                </p>
              </div>
              {cell.icon && (
                <Image
                  src={cell.icon.src}
                  alt=""
                  width={cell.icon.width}
                  height={cell.icon.height}
                  aria-hidden="true"
                  className="hidden h-14 w-auto shrink-0 self-center md:block lg:h-16 xl:h-20"
                />
              )}
            </div>
          ))}
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
