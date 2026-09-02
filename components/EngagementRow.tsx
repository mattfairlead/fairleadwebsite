import Link from "next/link";
import clsx from "clsx";
import type { Engagement } from "@/lib/types";
import { ARROW } from "@/components/Btn";

/**
 * Hairline-row engagement list item — the reference's .featured-item
 * pattern (§5.8.5): sponsor label, .h4 company, metric in gold, summary,
 * role tags, pill CTA. When a case study exists the whole row is the link
 * (no hunting for the button); the pill is its visual affordance.
 */
export default function EngagementRow({ engagement }: { engagement: Engagement }) {
  const detail = Boolean(engagement.body_md);
  const period = `${engagement.year_start}${
    engagement.year_end && engagement.year_end !== engagement.year_start ? `–${engagement.year_end}` : ""
  }`;

  const inner = (
    <>
      <div className="flex flex-col gap-1">
        <span className="label text-white-50">{engagement.sponsor_display}</span>
        <span className="body-sm text-white-40 tabular">{period}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className={clsx("h4 transition-colors duration-300", detail && "group-hover:text-gold-soft")}>{engagement.company_display}</h3>
        <span className="body-md text-gold">{engagement.headline_metric}</span>
        <p className="body-md max-w-2xl text-white-60">{engagement.summary_md}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {engagement.roles.map((r) => (
            <span
              key={r}
              className="label rounded-[3px] px-2 py-1.5 text-white-50"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      {detail && (
        <span className="btn btn-secondary button justify-self-start md:justify-self-end">
          See the engagement
          {ARROW}
        </span>
      )}
    </>
  );

  const cls =
    "spot group grid items-center gap-4 px-2 py-8 md:grid-cols-[10rem_1fr_auto] md:gap-10 md:px-5";

  return (
    <div data-anim="slide-in" className="relative">
      <span className="dec left-0 top-0 h-px w-full" />
      {detail ? (
        <Link href={`/engagements/${engagement.slug}`} className={cls} aria-label={`${engagement.company_display} — see the engagement`}>
          {inner}
        </Link>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </div>
  );
}
