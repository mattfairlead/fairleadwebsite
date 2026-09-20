import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";
import { ARROW } from "@/components/Btn";

/**
 * Home — the hands-on work, stated before any of the tooling. Five scopes
 * carry better as hairline rows (the .featured-item grammar in EngagementRow)
 * than as a five-column grid. Each row links to its section on
 * /hands-on-engagements.
 */

const SCOPES = [
  {
    id: "asset-management",
    title: "Asset management",
    body: "The operating partner or board seat, and the week-to-week that comes with it: budget and capex discipline, plan versus actual, the reporting cadence the fund expects.",
  },
  {
    id: "sell-side",
    title: "Sell-side preparation and execution",
    body: "Clean historicals, a defensible forecast, a data room that already exists. The same team that runs the company runs the process to sell it.",
  },
  {
    id: "restructuring",
    title: "Restructuring",
    body: "13-week cash as the operating document, lender and covenant conversations, a cost structure taken down to what the business can carry.",
  },
  {
    id: "fundraising",
    title: "Fundraising",
    body: "Capital raise preparation and execution: model, materials, diligence file, including project finance and tax equity for development-stage platforms.",
  },
  {
    id: "finance-back-office",
    title: "Finance and back-office management",
    body: "Interim CFO, COO, and Controller seats with the team underneath: monthly close, AP and AR, audit support, G&A and vendor discipline.",
  },
];

export default function Scopes() {
  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="What we do" title={<>Five ways we take the seat.</>} />
      <HairlineFrame className="mt-14">
        {SCOPES.map((scope, i) => (
          <div key={scope.id} data-anim="slide-in" className="relative">
            {i > 0 && <span className="dec left-0 top-0 h-px w-full" />}
            <Link
              href={`/hands-on-engagements#${scope.id}`}
              className="spot group grid items-center gap-4 px-2 py-8 md:grid-cols-[6rem_1fr_auto] md:gap-10 md:px-5"
            >
              <span
                className="flex h-11 w-11 items-center justify-center self-start rounded-full text-base font-semibold text-blue-950"
                style={{ background: "var(--color-gold)" }}
              >
                {i + 1}
              </span>
              <span className="flex flex-col gap-2">
                <h3 className="h4 transition-colors duration-300 group-hover:text-gold-soft">{scope.title}</h3>
                <span className="body-md max-w-2xl text-white-60">{scope.body}</span>
              </span>
              <span className="btn btn-secondary button justify-self-start md:justify-self-end">
                See the scope
                {ARROW}
              </span>
            </Link>
          </div>
        ))}
      </HairlineFrame>
    </SectionReveal>
  );
}
