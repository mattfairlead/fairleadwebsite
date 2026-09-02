import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";
import Btn from "@/components/Btn";
import { Markdown } from "@/lib/md";
import { getEngagement, getEngagements, getSectors } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const engagements = await getEngagements();
  return engagements.filter((e) => e.body_md).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const engagement = await getEngagement(slug);
  if (!engagement) return {};
  return pageMetadata(
    `${engagement.company_display} — Engagement`,
    engagement.summary_md,
    `/engagements/${engagement.slug}`
  );
}

export default async function EngagementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const engagement = await getEngagement(slug);
  if (!engagement || !engagement.body_md) notFound();

  const sectors = await getSectors();
  const sector = sectors.find((s) => s.slug === engagement.sector);

  return (
    <>
      <PageIntro
        eyebrow={`${engagement.sponsor_display} · ${sector?.name ?? engagement.sector}`}
        title={engagement.company_display}
        lead={engagement.headline_metric}
      />

      <SectionReveal className="container-page pb-10">
        <HairlineFrame columns={3}>
          <div className="grid md:grid-cols-3">
            <div data-cell className="spot flex flex-col gap-2 p-6 md:p-8">
              <span className="label text-white-50">Roles</span>
              <span data-anim="title" className="body-md text-white-100">
                {engagement.roles.join(" · ")}
              </span>
            </div>
            <div data-cell className="spot flex flex-col gap-2 p-6 md:p-8">
              <span className="label text-white-50">Outcome</span>
              <span data-anim="title" className="body-md text-white-100">
                {engagement.outcome_tags.join(" · ")}
              </span>
            </div>
            <div data-cell className="spot flex flex-col gap-2 p-6 md:p-8">
              <span className="label text-white-50">Period</span>
              <span data-anim="title" className="body-md text-white-100 tabular">
                {engagement.year_start}
                {engagement.year_end && engagement.year_end !== engagement.year_start
                  ? `–${engagement.year_end}`
                  : engagement.year_end === null
                    ? "–present"
                    : ""}
              </span>
            </div>
          </div>
        </HairlineFrame>
      </SectionReveal>

      <section className="container-page pb-16">
        <div className="prose-measure">
          <Markdown>{engagement.body_md}</Markdown>
        </div>
      </section>

      <SectionReveal className="container-page pb-20">
        <div className="flex flex-wrap gap-4">
          <Link href="/engagements" className="btn btn-secondary button">
            All engagements
          </Link>
          <Btn href="/contact" arrow>
            Talk to a partner
          </Btn>
        </div>
      </SectionReveal>
    </>
  );
}
