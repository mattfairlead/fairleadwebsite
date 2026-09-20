import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TwoProblems from "@/components/TwoProblems";
import Scopes from "@/components/Scopes";
import CompetitorMatrix from "@/components/CompetitorMatrix";
import Advantage from "@/components/Advantage";
import Pillars from "@/components/Pillars";
import EngagementCards from "@/components/EngagementCards";
import FeeBlock from "@/components/FeeBlock";
import { pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `${SITE_NAME} · ${SITE_TAGLINE}`,
  "Hands-on operating engagements inside PE-backed companies since 2010: asset management, sell-side preparation and execution, restructuring, fundraising, and finance and back-office management.",
  "/"
);

/**
 * Home — the argument, end to end. The hands-on work states itself first;
 * the compounding-asset section folds in a short intelligence teaser,
 * linking out to the full case study on /intelligence.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TwoProblems />
      <Scopes />
      <Pillars />
      <CompetitorMatrix />
      <EngagementCards />
      <Advantage />
      <FeeBlock />
    </>
  );
}
