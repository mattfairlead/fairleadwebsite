import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * Home §4.1 row 2 — the deck's slide 2, verbatim structure: two problems,
 * two hairline-divided cells, no fills. The right cell's vertical rule is
 * the frame closing on "Information."
 */
const CELLS = [
  {
    label: "Problem one",
    title: "Performance",
    body: "The visible problem. Revenue, margin, cash — the numbers every sponsor manages and a crowded market of firms offers to fix.",
    foot: "Most of the market competes here.",
  },
  {
    label: "Problem two",
    title: "Information",
    body: "The harder problem. Knowing what is actually happening inside the company — the visibility LPs hold sponsors accountable for.",
    foot: "Most sponsors only solve one of the two.",
  },
];

export default function TwoProblems() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="Two problems" title={<>Every portfolio company has two problems.</>} />
      <HairlineFrame columns={2} className="mt-14">
        <div className="grid md:grid-cols-2">
          {CELLS.map((cell) => (
            <div key={cell.title} data-cell className="flex flex-col gap-4 p-6 md:p-10">
              <span className="label text-white-50">{cell.label}</span>
              <h3 data-anim="title" className="h4">
                {cell.title}
              </h3>
              <p data-anim="subtitle" className="body-lg text-white-60">
                {cell.body}
              </p>
              <p className="body-sm italic text-white-40">{cell.foot}</p>
            </div>
          ))}
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
