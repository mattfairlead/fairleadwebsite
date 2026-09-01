import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import EngagementRow from "@/components/EngagementRow";
import { getEngagements } from "@/lib/data";

/**
 * Home §4.1 row 7 — selected engagements: Cordia · Cadre · GRP, as
 * hairline rows, linking through to /engagements.
 */
const HOME_SLUGS = ["cordia", "cadre-proppants", "grp-holdco"];

export default async function EngagementCards() {
  const featured = await getEngagements({ featuredOnly: true });
  const rows = HOME_SLUGS.map((slug) => featured.find((e) => e.slug === slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e)
  );

  return (
    <SectionReveal className="section container-page">
      <SectionHead eyebrow="Proof" title={<>Selected engagements.</>} />
      <div className="relative mt-14">
        {rows.map((engagement) => (
          <EngagementRow key={engagement.slug} engagement={engagement} />
        ))}
        <span className="dec bottom-0 left-0 h-px w-full" />
      </div>
      <div className="mt-10">
        <Link href="/engagements" className="btn btn-secondary button">
          All engagements
        </Link>
      </div>
    </SectionReveal>
  );
}
