import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import EngagementRow from "@/components/EngagementRow";
import TestimonialFeature from "@/components/TestimonialFeature";
import Btn from "@/components/Btn";
import { getEngagements, getSectors } from "@/lib/data";
import { pageMetadata, videoJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Engagements",
  "Selected from 60+ embedded engagements across 16 sectors since 2010 — by sector, role, sponsor type, and outcome.",
  "/engagements"
);

/**
 * Dion Leadership testimonial — Steve Dion on the sale to Gallagher. Served
 * from the "Reviews" GitHub release (H.264 + AAC QuickTime, fast-start) via
 * /api/media/dion-testimonial, which re-serves it with video headers —
 * GitHub Releases sends `Content-Disposition: attachment`, which iOS Safari
 * treats as a forced download and refuses to play inline. Set
 * NEXT_PUBLIC_DION_TESTIMONIAL_URL once the file moves to Blob/Supabase
 * Storage (§9 media plan); a proper storage host serves correct headers
 * directly, so this bypasses the proxy — no code change needed.
 */
const DION_VIDEO = process.env.NEXT_PUBLIC_DION_TESTIMONIAL_URL || "/api/media/dion-testimonial";
const DION_POSTER = "/engagements/dion-leadership-steve.jpg";
const DION_LABEL = "Steve Dion, Dion Leadership, on working with Fairlead through the sale to Gallagher";
// Portrait phone clip: 1280×720 track with a 90° rotation matrix → displays 720×1280. 2:09 long.
const DION_ASPECT = { w: 720, h: 1280 };
const DION_DURATION = "2:10";

const ROLES = [
  "Interim CEO",
  "Interim CFO",
  "Interim COO",
  "Controller",
  "Operating Partner",
  "Board",
  "M&A",
  "Restructuring",
];
const SPONSOR_TYPES = ["PE", "Infra", "VC", "Family office", "Corporate"];
const OUTCOMES = ["Sale", "Financing", "Turnaround", "Spin-off", "Tax equity"];

type Search = { sector?: string; role?: string; sponsor?: string; outcome?: string };

function filterHref(current: Search, key: keyof Search, value: string | null): string {
  const next = { ...current };
  if (value === null || current[key] === value) delete next[key];
  else next[key] = value;
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
  return qs ? `/engagements?${qs}` : "/engagements";
}

function FilterGroup({
  label,
  options,
  paramKey,
  current,
}: {
  label: string;
  options: { value: string; label: string }[];
  paramKey: keyof Search;
  current: Search;
}) {
  const activeValue = current[paramKey];
  return (
    <div className="grid gap-3 py-5 md:grid-cols-[9rem_1fr] md:gap-8">
      <span className="label flex items-center gap-2 pt-2.5 text-white-50">
        {label}
        {activeValue && <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = activeValue === option.value;
          return (
            <Link
              key={option.value}
              href={filterHref(current, paramKey, option.value)}
              className={clsx("chip button", active && "is-active")}
              aria-pressed={active}
              scroll={false}
            >
              {option.label}
              {active && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function EngagementsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const sectors = await getSectors();
  const engagements = await getEngagements({
    sector: sp.sector,
    role: sp.role,
    sponsorType: sp.sponsor,
    outcome: sp.outcome,
  });

  const activeCount = [sp.sector, sp.role, sp.sponsor, sp.outcome].filter(Boolean).length;
  const hasFilter = activeCount > 0;

  return (
    <>
      <PageIntro
        eyebrow="Engagements"
        title={<>The proof, filterable.</>}
        lead={<>Sixty-plus embedded engagements across sixteen sectors since 2010. Filter by what you&rsquo;re working through.</>}
        aside={
          <dl className="grid grid-cols-3 gap-8 md:gap-10">
            {[
              ["60+", "engagements"],
              ["16", "sectors"],
              ["2010", "since"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col gap-1">
                <dt className="h3 text-white-100 tabular">{n}</dt>
                <dd className="label text-white-40">{l}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <TestimonialFeature
        eyebrow="In their words"
        title={<>Hear it from the founder.</>}
        metric="Sold to Gallagher · 2025"
        body={
          <>
            Steve Dion built Dion Leadership and sold it to Gallagher in 2025. Fairlead ran the process from
            preparation to close. Here he describes what that was like from the founder&rsquo;s chair.
          </>
        }
        speaker={{ name: "Steve Dion", title: "Founder & CEO, Dion Leadership" }}
        tags={["M&A", "Sale", "Professional services"]}
        video={{ src: DION_VIDEO, poster: DION_POSTER, label: DION_LABEL, aspect: DION_ASPECT, duration: DION_DURATION }}
        href="/engagements/dion-leadership"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            videoJsonLd({
              name: "Dion Leadership — client testimonial",
              description: DION_LABEL,
              contentUrl: DION_VIDEO.startsWith("/") ? `${SITE_URL}${DION_VIDEO}` : DION_VIDEO,
              thumbnailPath: DION_POSTER,
              uploadDate: "2026-09-02",
              duration: "PT2M10S",
              path: "/engagements",
            })
          ),
        }}
      />

      <section className="container-page relative pb-8" aria-label="Filters">
        <span className="dec left-0 top-0 h-px w-full" />
        <div className="flex items-center justify-between gap-4 py-5">
          <span className="body-sm text-white-50">
            <span className="text-white-100 tabular">{engagements.length}</span>{" "}
            {engagements.length === 1 ? "engagement" : "engagements"}
            {hasFilter && (
              <>
                {" "}
                · <span className="tabular">{activeCount}</span> {activeCount === 1 ? "filter" : "filters"} on
              </>
            )}
          </span>
          {hasFilter && (
            <Link href="/engagements" className="chip button" scroll={false}>
              Clear all
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>
        <div className="relative">
          <span className="dec left-0 top-0 h-px w-full" />
          <FilterGroup
            label="Sector"
            paramKey="sector"
            current={sp}
            options={sectors.map((s) => ({ value: s.slug, label: s.name }))}
          />
          <FilterGroup label="Role" paramKey="role" current={sp} options={ROLES.map((r) => ({ value: r, label: r }))} />
          <FilterGroup
            label="Sponsor type"
            paramKey="sponsor"
            current={sp}
            options={SPONSOR_TYPES.map((s) => ({ value: s, label: s }))}
          />
          <FilterGroup
            label="Outcome"
            paramKey="outcome"
            current={sp}
            options={OUTCOMES.map((o) => ({ value: o, label: o }))}
          />
        </div>
      </section>

      <SectionReveal className="container-page pb-20">
        {engagements.length > 0 ? (
          <div className="relative">
            {engagements.map((engagement) => (
              <EngagementRow key={engagement.slug} engagement={engagement} />
            ))}
            <span className="dec bottom-0 left-0 h-px w-full" />
          </div>
        ) : (
          // Empty state — designed, not defaulted (§5.9)
          <div className="relative px-6 py-24 text-center md:px-10">
            <span className="dec left-0 top-0 h-px w-full" />
            <span className="dec bottom-0 left-0 h-px w-full" />
            <span className="label text-gold">No match — yet</span>
            <h2 className="h2 mt-4">Nothing matches that combination.</h2>
            <p className="body-lg mx-auto mt-4 max-w-md text-white-60">
              The site shows a selection. The full engagement summary goes deeper — sixty-plus engagements,
              every role and outcome.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Btn href="/contact?subject=engagement-summary" arrow>
                Request the engagement summary
              </Btn>
              <Link href="/engagements" className="btn btn-ghost button">
                Clear filters
              </Link>
            </div>
          </div>
        )}

        <p className="body-sm mt-10 max-w-2xl text-white-40">
          Selected from 60+ embedded engagements across 16 sectors. Full engagement summary available on
          request —{" "}
          <Link href="/contact?subject=engagement-summary" className="link-underline text-white-60">
            request the engagement summary
          </Link>
          .
        </p>
      </SectionReveal>
    </>
  );
}
