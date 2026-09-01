import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import EngagementRow from "@/components/EngagementRow";
import { getEngagements, getSectors } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Engagements",
  "Selected from 60+ embedded engagements across 16 sectors since 2010 — by sector, role, sponsor type, and outcome.",
  "/engagements"
);

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
  return (
    <div className="flex flex-col gap-3">
      <span className="label text-white-50">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = current[paramKey] === option.value;
          return (
            <Link
              key={option.value}
              href={filterHref(current, paramKey, option.value)}
              className={clsx(
                "button rounded-pill px-4 py-2 transition-all duration-200",
                active
                  ? "bg-gold text-blue-950"
                  : "bg-blue-900 text-white-60 hover:bg-blue-800 hover:text-white-100"
              )}
              aria-pressed={active}
            >
              {option.label}
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

  const hasFilter = Boolean(sp.sector || sp.role || sp.sponsor || sp.outcome);

  return (
    <>
      <PageIntro
        eyebrow="Engagements"
        title={<>The proof, filterable.</>}
        lead={<>Sixty-plus embedded engagements across sixteen sectors since 2010. Filter by what you&rsquo;re working through.</>}
      />

      <section className="container-page flex flex-col gap-8 pb-6">
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
        {hasFilter && (
          <Link href="/engagements" className="body-sm link-underline self-start text-white-60">
            Clear filters
          </Link>
        )}
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
            <h2 className="h2">Nothing matches that combination — yet.</h2>
            <p className="body-lg mt-4 text-white-60">The full engagement summary goes deeper than the site.</p>
            <Link href="/contact?subject=engagement-summary" className="btn btn-primary button mt-8">
              Request the engagement summary
            </Link>
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
