import type { Metadata } from "next";
import Link from "next/link";
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
 * The roster is read live from the engagement hub (see lib/data.ts). The hub
 * pings /api/revalidate when a card's "Website" checkbox flips; this
 * interval is the safety net if that ping is ever missed.
 */
export const revalidate = 300;

/**
 * Horizontal hairline under a grid cell. Rows grow when a bio opens, so the
 * rules track the cells instead of sitting at fixed offsets on the frame:
 * every row but the last, at every column count the grid steps through
 * (`cols` maps a breakpoint to its column count; "" is the phone).
 */
function CellRule({ index, count, cols }: { index: number; count: number; cols: Record<string, number> }) {
  if (index >= count - 1) return null;
  const classes = Object.entries(cols).map(([bp, n]) => {
    const lastRowStart = (Math.ceil(count / n) - 1) * n;
    const shown = index < lastRowStart;
    const prefix = bp ? `${bp}:` : "";
    return `${prefix}${shown ? "block" : "hidden"}`;
  });
  return <span className={`dec bottom-0 left-0 h-px w-full ${classes.join(" ")}`} aria-hidden="true" />;
}

/**
 * /team — §4.5. No intro: the page opens straight on the roster, so the
 * first section clears the fixed header itself (same offset PageIntro
 * uses). Partners featured 2×2 with the portrait beside the text; the rest
 * of the roster as a hairline grid of circular portraits. Who
 * appears, in what order, with which title, bio and headshot is decided in
 * the hub's Team module — one checkbox per card.
 */
export default async function TeamPage() {
  const team = await getTeam();
  const partners = team.filter((m) => m.group === "partner");
  const rest = team.filter((m) => m.group === "team");

  return (
    <>
      {partners.length > 0 && (
        <SectionReveal className="container-page pb-6 pt-44 max-md:pt-32">
          <SectionHead eyebrow="Partners" title={<>The partners.</>} titleClass="h3" />
          <HairlineFrame columns={2} columnsFrom="lg" className="mt-10">
            <div className="grid lg:grid-cols-2">
              {partners.map((member, i) => (
                <div key={member.slug} className="relative">
                  <CellRule index={i} count={partners.length} cols={{ "": 1, lg: 2 }} />
                  <TeamCell member={member} featured />
                </div>
              ))}
            </div>
          </HairlineFrame>
          <p className="body-sm mt-4 text-white-40">Select a name to read the bio.</p>
        </SectionReveal>
      )}

      {rest.length > 0 && (
        <SectionReveal className={partners.length > 0 ? "section container-page" : "container-page pb-28 pt-44 max-md:pt-32"}>
          <SectionHead eyebrow="Team" title={<>The operators.</>} titleClass="h3" />
          <HairlineFrame columns={4} columnsFrom="lg" midColumns={2} midFrom="sm" className="mt-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {rest.map((member, i) => (
                <div key={member.slug} className="relative">
                  <CellRule index={i} count={rest.length} cols={{ "": 1, sm: 2, lg: 4 }} />
                  <TeamCell member={member} />
                </div>
              ))}
            </div>
          </HairlineFrame>
        </SectionReveal>
      )}

      {team.length === 0 && (
        <SectionReveal className="container-page pb-28 pt-44 max-md:pt-32">
          <HairlineFrame>
            <p className="body-lg p-10 text-white-50">The roster is being updated. Check back shortly.</p>
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
            <Link href="/careers" className="btn btn-secondary button justify-self-start" data-anim="pop">
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
