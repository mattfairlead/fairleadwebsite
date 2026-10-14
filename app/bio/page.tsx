import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import BioIntakeForm from "@/components/bio/BioIntakeForm";
import { getEngagements, getTeam } from "@/lib/data";
import type { RosterMember } from "@/lib/bio/schema";

/**
 * /bio — the team bio intake (PRD_BIO_INTAKE). Unlisted: not in the nav,
 * the footer or the sitemap, disallowed in robots.txt and noindex here.
 * The roster comes live from the hub (website-visible rows); "I'm not
 * listed" covers everyone else.
 */
export const metadata: Metadata = {
  title: "Team bio",
  description: "Fairlead team bio intake.",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function BioPage() {
  const [team, engagements] = await Promise.all([getTeam(), getEngagements()]);
  const roster: RosterMember[] = team.map((m) => ({
    id: m.id,
    name: m.name,
    title: m.title,
    credentials: m.credentials,
    specialty: m.specialty,
    bio_md: m.bio_md,
    has_photo: !!m.photo_url,
  }));
  const companies = [...new Set(engagements.filter((e) => !e.anonymized).map((e) => e.company_display))].sort();

  return (
    <>
      <PageIntro
        eyebrow="Team bio"
        title={<>Your bio, in facts.</>}
        lead={
          <>
            Answer in facts, not prose. Matt turns them into a bio in the same format, length and tone as everyone
            else&rsquo;s, then sends it to you to approve.
          </>
        }
      >
        <ul className="body-md flex flex-col gap-2 text-white-60" data-anim="fade-up">
          {[
            "About 15–20 minutes.",
            "Saves as you go on this device — close the tab and pick up where you left off.",
            "Nothing is published until you approve the draft.",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </PageIntro>

      <section className="container-page pb-24">
        <BioIntakeForm roster={roster} companies={companies} gated={!!process.env.BIO_ACCESS_CODE} />
      </section>
    </>
  );
}
