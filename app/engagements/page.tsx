import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import TestimonialFeature from "@/components/TestimonialFeature";
import RevealProvider from "@/components/register/RevealProvider";
import RegisterRow from "@/components/register/RegisterRow";
import { LockGlyph } from "@/components/register/RevealModal";
import { getEngagements, loadRegister } from "@/lib/data";
import {
  featuredItem,
  filterItems,
  redact,
  registerStats,
  renumber,
  withoutFeatured,
  SECTORS,
  STATUSES,
  WORK,
  type RegisterFilters,
  type RegisterItem,
} from "@/lib/register";
import { getRegisterGrant } from "@/lib/register-access";
import { pageMetadata, videoJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Engagements",
  "The full Fairlead engagement register — every embedded engagement since 2010, by sector, work and status. What we did, in the open; the names at a partner's discretion.",
  "/engagements"
);

// Renders per request: the register's locked/unlocked state is a cookie.
export const dynamic = "force-dynamic";

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

type Search = RegisterFilters & { unlocked?: string; link?: string };

function filterHref(current: RegisterFilters, key: keyof RegisterFilters, value: string | null): string {
  const next: RegisterFilters = { work: current.work, sector: current.sector, status: current.status };
  if (value === null || current[key] === value) delete next[key];
  else next[key] = value;
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
  return `/engagements${qs ? `?${qs}` : ""}#register`;
}

function FilterGroup({
  label,
  options,
  paramKey,
  current,
}: {
  label: string;
  options: { value: string; label: string }[];
  paramKey: keyof RegisterFilters;
  current: RegisterFilters;
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
  const filters: RegisterFilters = { work: sp.work, sector: sp.sector, status: sp.status };

  const [caseStudies, register, grant] = await Promise.all([
    getEngagements({ featuredOnly: true }),
    loadRegister(),
    getRegisterGrant(),
  ]);
  // The one decision that matters: full rows exist only when the hub is
  // reachable AND this browser holds a verified grant. Everything below
  // renders from `items`, whose kinds say which it is.
  const unlocked = Boolean(grant) && register.live;

  // One list: the case studies we're cleared to name, then every other hub
  // row. Hub rows a case study already names are dropped (server-side, on
  // the confidential rows) so each company appears once; the whole list is
  // then numbered in display order.
  const studies = caseStudies.filter((e) => e.body_md); // cleared for the public record: the ones with a case study
  const featured = studies.map(featuredItem);
  const rest: RegisterItem[] = register.live
    ? withoutFeatured(register.rows, studies).map((row) =>
        unlocked ? { kind: "unlocked", row } : { kind: "locked", row: redact(row) }
      )
    : register.publicRows.map((row) => ({ kind: "locked", row }));
  const items = renumber([...featured, ...rest]);
  const visible = filterItems(items, filters);

  const stats = registerStats(items.map((it) => it.row));
  const activeCount = [filters.work, filters.sector, filters.status].filter(Boolean).length;
  const hasFilter = activeCount > 0;
  const justUnlocked = unlocked && sp.unlocked === "1";
  const linkExpired = !unlocked && sp.link === "expired";

  return (
    <RevealProvider total={stats.total}>
      <PageIntro
        eyebrow="Engagements"
        title={<>The register.</>}
        lead={
          <>
            Every embedded engagement since 2010 — sponsor-backed and founder-led, from a portfolio assessment to the
            seat itself. What we did is on the record; who it was for is a partner&rsquo;s call.
          </>
        }
        aside={
          <dl className="grid grid-cols-3 gap-8 md:gap-10">
            {[
              [stats.total, "engagements"],
              [stats.active, "active"],
              [stats.sponsorBacked, "sponsor-backed"],
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

      <SectionReveal id="register" className="container-page pb-8 pt-4">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="The register" title={<>{stats.total} engagements, 2010 to today.</>} />
          {grant ? (
            <div className="flex flex-col items-start gap-4 md:items-end" data-anim="fade-up">
              <span className="grant-chip button">
                <LockGlyph open />
                Unlocked for {grant.name} · {grant.firm}
              </span>
              <Link href="/engagements/lock" className="body-sm link-underline text-white-40" prefetch={false}>
                Lock this browser
              </Link>
            </div>
          ) : (
            <p className="body-md max-w-sm text-white-50" data-anim="fade-up">
              Interim CFO and controller seats, operating-partner roles, M&amp;A and portfolio assessments — across
              energy and infrastructure, venture-backed companies and family offices.{" "}
              <span className="text-white-100 tabular">{stats.active}</span> active today;{" "}
              <span className="text-white-100 tabular">{stats.sponsorBacked}</span> with a sponsor at the table.
            </p>
          )}
        </div>

        {linkExpired && (
          <p
            className="body-md mt-10 flex items-start gap-3 text-gold"
            role="alert"
            style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.3)", padding: "1rem 1.25rem" }}
          >
            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            That link has expired or was already used. Ask again and we&rsquo;ll send a fresh one.
          </p>
        )}
        {grant && !register.live && (
          <p className="body-md mt-10 text-white-50" role="status">
            Unlocked for {grant.name} — but this preview has no connection to the engagement hub, so the rows below
            stay redacted. The live site serves the full register.
          </p>
        )}
      </SectionReveal>

      <section className="container-page relative pb-8" aria-label="Filters">
        <span className="dec left-0 top-0 h-px w-full" />
        <div className="flex items-center justify-between gap-4 py-5">
          <span className="body-sm text-white-50">
            <span className="text-white-100 tabular">{visible.length}</span>{" "}
            {visible.length === 1 ? "engagement" : "engagements"}
            {hasFilter && (
              <>
                {" "}
                · <span className="tabular">{activeCount}</span> {activeCount === 1 ? "filter" : "filters"} on
              </>
            )}
          </span>
          {hasFilter && (
            <Link href="/engagements#register" className="chip button" scroll={false}>
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
            label="Work"
            paramKey="work"
            current={filters}
            options={WORK.map((w) => ({ value: w.slug, label: w.label }))}
          />
          <FilterGroup
            label="Sector"
            paramKey="sector"
            current={filters}
            options={SECTORS.map((s) => ({ value: s.slug, label: s.label }))}
          />
          <FilterGroup
            label="Status"
            paramKey="status"
            current={filters}
            options={STATUSES.map((s) => ({ value: s.slug, label: s.label }))}
          />
        </div>
      </section>

      <SectionReveal className="container-page pb-20">
        {visible.length > 0 ? (
          <div className="relative">
            {visible.map((it) =>
              it.kind === "featured" ? (
                <RegisterRow key={`f${it.row.id}`} kind="featured" row={it.row} engagement={it.engagement} />
              ) : it.kind === "locked" ? (
                <RegisterRow key={it.row.id} kind="locked" row={it.row} />
              ) : (
                <RegisterRow key={it.row.id} kind="unlocked" row={it.row} decode={justUnlocked} />
              )
            )}
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
              Loosen a filter, or talk to a partner about the work you&rsquo;re actually facing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/engagements#register" className="btn btn-secondary button" scroll={false}>
                Clear filters
              </Link>
              <Link href="/contact" className="btn btn-ghost button">
                Talk to a partner
              </Link>
            </div>
          </div>
        )}

        {unlocked ? (
          <p className="body-sm mt-10 max-w-2xl text-white-40">
            Summaries are maintained in Fairlead&rsquo;s engagement hub and reflect the current record. Shared with you
            in confidence.
          </p>
        ) : !register.live ? (
          <p className="body-sm mt-10 max-w-2xl text-white-40">
            This is a snapshot of the register: the engagement hub isn&rsquo;t connected here, so the summaries stay
            redacted. On the live site they read in full with the names taken out.
          </p>
        ) : null}
      </SectionReveal>
    </RevealProvider>
  );
}
