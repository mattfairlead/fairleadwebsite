import Link from "next/link";
import type { Engagement } from "@/lib/types";

/**
 * Hairline-row engagement list item — the reference's .featured-item
 * pattern (§5.8.5): sponsor label, .h3 company, .body-sm metric,
 * .body-md summary, pill CTA. Each row earns its own reveal.
 */
export default function EngagementRow({ engagement }: { engagement: Engagement }) {
  const detail = Boolean(engagement.body_md);
  return (
    <div data-anim="slide-in" className="relative">
      <span className="dec left-0 top-0 h-px w-full" />
      <div className="grid items-center gap-4 px-1 py-8 transition-colors duration-200 hover:bg-blue-900/40 md:grid-cols-[10rem_1fr_auto] md:gap-10 md:px-4">
        <div className="flex flex-col gap-1">
          <span className="label text-white-50">{engagement.sponsor_display}</span>
          <span className="body-sm text-white-40">
            {engagement.year_start}
            {engagement.year_end && engagement.year_end !== engagement.year_start ? `–${engagement.year_end}` : ""}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="h4">{engagement.company_display}</h3>
          <span className="body-sm text-gold">{engagement.headline_metric}</span>
          <p className="body-md max-w-2xl text-white-60">{engagement.summary_md}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {engagement.roles.map((r) => (
              <span key={r} className="label rounded-[3px] border border-white-10 px-2 py-1 text-white-50">
                {r}
              </span>
            ))}
          </div>
        </div>
        {detail && (
          <Link href={`/engagements/${engagement.slug}`} className="btn btn-secondary button justify-self-start md:justify-self-end">
            See the engagement
          </Link>
        )}
      </div>
    </div>
  );
}
