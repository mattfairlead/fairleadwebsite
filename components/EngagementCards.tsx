import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import EngagementRow from "@/components/EngagementRow";
import Btn from "@/components/Btn";
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
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHead eyebrow="Proof" title={<>Selected engagements.</>} />
        <p className="body-md max-w-sm text-white-50" data-anim="fade-up">
          Three of sixty-plus. Metric first, in the operator&rsquo;s vocabulary.
        </p>
      </div>
      <div className="relative mt-14">
        {rows.map((engagement) => (
          <EngagementRow key={engagement.slug} engagement={engagement} />
        ))}
        <span className="dec bottom-0 left-0 h-px w-full" />
      </div>
      <div className="mt-10">
        <Btn href="/engagements" variant="secondary" arrow dataAnim="pop">
          All engagements
        </Btn>
      </div>
    </SectionReveal>
  );
}
