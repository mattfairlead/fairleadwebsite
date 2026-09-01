import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TwoProblems from "@/components/TwoProblems";
import CompetitorMatrix from "@/components/CompetitorMatrix";
import Advantage from "@/components/Advantage";
import Pillars from "@/components/Pillars";
import IntelligenceBand from "@/components/IntelligenceBand";
import EngagementCards from "@/components/EngagementCards";
import FeeBlock from "@/components/FeeBlock";
import ContactStrip from "@/components/ContactStrip";
import { pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `${SITE_NAME} — ${SITE_TAGLINE}`,
  "Executive intelligence + artificial intelligence, working inside your portfolio. Embedded finance and operating leadership for PE-backed companies since 2010.",
  "/"
);

/**
 * Home — the argument, end to end (≈ the deck as a scroll). §4.1.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TwoProblems />
      <CompetitorMatrix />
      <Advantage />
      <Pillars />
      <IntelligenceBand />
      <EngagementCards />
      <FeeBlock />
      <ContactStrip />
    </>
  );
}
