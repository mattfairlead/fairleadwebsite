import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 2 — the deck's slide 2, verbatim structure: two problems,
 * two hairline-divided cells, no fills. The right cell's vertical rule is
 * the frame closing on "Information." Each cell carries an oversized ghost
 * numeral and the second problem — the one Fairlead is built for — is the
 * only one the eye lands on in gold.
 */
const CELLS = [
  {
    label: "Problem one",
    title: "Performance",
    body: "The visible problem. Revenue, margin, cash — the numbers every sponsor manages and a crowded market of firms offers to fix.",
    foot: "Most of the market competes here.",
    accent: false,
  },
  {
    label: "Problem two",
    title: "Information",
    body: "The harder problem. Knowing what is actually happening inside the company — the visibility LPs hold sponsors accountable for.",
    foot: "Most sponsors only solve one of the two.",
    accent: true,
  },
];

export default function TwoProblems() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="Two problems" title={<>Every portfolio company has two problems.</>} />
      <HairlineFrame columns={2} className="mt-14">
        <div className="grid md:grid-cols-2">
          {CELLS.map((cell, i) => (
            <div key={cell.title} data-cell className="spot flex min-h-[18rem] flex-col gap-4 p-6 md:p-10">
              <span className="ghost-num" aria-hidden="true">
                0{i + 1}
              </span>
              <span className={cell.accent ? "label text-gold" : "label text-white-50"}>{cell.label}</span>
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
          ))}
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
