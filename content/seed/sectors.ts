import type { Sector } from "@/lib/types";

/**
 * TODO(§9): the deck says 16 sectors but the actual list is unconfirmed —
 * Matt to pull the canonical 16 from the March 2026 Engagement Summary.
 * This list is a working draft assembled from known engagements; replace
 * wholesale when the confirmed list lands (slugs are referenced by
 * engagements.ts, so update both together).
 */
export const sectors: Sector[] = [
  { id: "1", slug: "energy", name: "Energy", sort: 1 },
  { id: "2", slug: "renewables", name: "Renewables & solar", sort: 2 },
  { id: "3", slug: "district-energy", name: "District energy", sort: 3 },
  { id: "4", slug: "energy-storage", name: "Energy storage", sort: 4 },
  { id: "5", slug: "oilfield-services", name: "Oilfield services", sort: 5 },
  { id: "6", slug: "industrial-processing", name: "Industrial processing", sort: 6 },
  { id: "7", slug: "infrastructure", name: "Infrastructure", sort: 7 },
  { id: "8", slug: "biotech", name: "Biotech", sort: 8 },
  { id: "9", slug: "life-sciences", name: "Life sciences", sort: 9 },
  { id: "10", slug: "healthcare", name: "Healthcare", sort: 10 },
  { id: "11", slug: "ai-software", name: "AI & software", sort: 11 },
  { id: "12", slug: "business-services", name: "Business services", sort: 12 },
  { id: "13", slug: "consumer", name: "Consumer", sort: 13 },
  { id: "14", slug: "metals-mining", name: "Metals & mining", sort: 14 },
  { id: "15", slug: "manufacturing", name: "Manufacturing", sort: 15 },
  { id: "16", slug: "professional-services", name: "Professional services", sort: 16 },
];
