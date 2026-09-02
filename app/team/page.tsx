import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import HairlineFrame from "@/components/HairlineFrame";
import TeamCell from "@/components/TeamCell";
import { getTeam } from "@/lib/data";
import { pageMetadata, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Team",
  "Partners and operators. Fairlead team members are prepared to lead organizations, manage teams, make decisions, and act as individual contributors.",
  "/team"
);

/**
 * /team — §4.5. Partners featured 2×2; full team as expandable cards.
 * Roster, titles, and credentials standardize via the Supabase `team`
 * table (self-service via the marketing hub, Phase 2).
 */
export default async function TeamPage() {
  const team = await getTeam();
  const partners = team.filter((m) => m.group === "partner");
  const rest = team.filter((m) => m.group === "team");

  return (
    <>
      <PageIntro
        eyebrow="Team"
        title={<>Operators, in the seat.</>}
        lead={<>The team behind every engagement — partners who sit in the seat, and the bench that scales with it.</>}
        aside={
          <dl className="grid grid-cols-2 gap-10">
            {[
              [String(partners.length), "partners"],
              [String(team.length), "operators"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col gap-1">
                <dt className="h3 text-white-100 tabular">{n}</dt>
                <dd className="label text-white-40">{l}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <SectionReveal className="container-page pb-6">
        <SectionHead eyebrow="Partners" title={<>The partners.</>} titleClass="h3" />
        <HairlineFrame columns={2} rows={partners.length > 2 ? ["50%"] : undefined} className="mt-10">
          <div className="grid md:grid-cols-2">
            {partners.map((member) => (
              <div key={member.slug} className="p-4 md:p-8">
                <TeamCell member={member} featured />
              </div>
            ))}
          </div>
        </HairlineFrame>
        <p className="body-sm mt-4 text-white-40">Select a name to read the bio.</p>
      </SectionReveal>

      {rest.length > 0 && (
        <SectionReveal className="section container-page">
          <SectionHead eyebrow="Team" title={<>The bench.</>} titleClass="h3" />
          <HairlineFrame columns={4} className="mt-10">
            <div className="grid sm:grid-cols-2 md:grid-cols-4">
              {rest.map((member) => (
                <div key={member.slug} className="p-4 md:p-6">
                  <TeamCell member={member} />
                </div>
              ))}
            </div>
          </HairlineFrame>
        </SectionReveal>
      )}

      <SectionReveal className="container-page pb-24">
        <HairlineFrame>
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <p className="body-xl max-w-3xl text-white-60" data-anim="fade-up">
              Fairlead team members are prepared to lead organizations, manage teams, make decisions, and act
              as individual contributors.
            </p>
            <Link href="/careers" className="btn btn-secondary button self-start" data-anim="pop">
              Careers at Fairlead
            </Link>
          </div>
        </HairlineFrame>
      </SectionReveal>

      {partners.map((p) => (
        <script
          key={p.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(p)) }}
        />
      ))}
    </>
  );
}
