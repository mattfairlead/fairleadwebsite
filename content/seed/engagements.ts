import type { Engagement } from "@/lib/types";

/**
 * Featured engagements — the nine from §4.4, drafted in the §10 voice.
 * Past tense, operator's vocabulary, metric first.
 *
 * TODO(§9) before launch:
 *  - GRP Holdco $82.5M tax equity figure — Adam to confirm.
 *  - Cordia: McKinsey collaboration mention deliberately omitted until cleared.
 *  - Full 60+ engagement import from Matt's March 2026 Engagement Summary CSV
 *    (scripts/import-engagements.ts is the entry point).
 *  - Anonymization pass on non-featured rows.
 */
export const engagements: Engagement[] = [
  {
    id: "1",
    slug: "cordia",
    company_display: "Cordia",
    sponsor_display: "KKR",
    sponsor_type: "Infra",
    sector: "district-energy",
    roles: ["Interim CFO", "Operating Partner", "M&A"],
    outcome_tags: ["Spin-off"],
    headline_metric: "$1.9B carve-out, stood up as a standalone platform",
    summary_md:
      "Fairlead embedded through the $1.9B carve-out of a district energy platform — building the finance function, the reporting, and the operating cadence a standalone company needs from day one.",
    body_md:
      "When KKR carved Cordia out at $1.9B, the platform needed a complete finance and operating function — not advice on one. Fairlead sat in the seats: standing up accounting, treasury, reporting, and the board cadence while the business kept running.\n\nTODO: expand with cleared detail from the deck case study.",
    year_start: 2020,
    year_end: null,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "2",
    slug: "cadre-proppants",
    company_display: "Cadre Proppants",
    sponsor_display: "PE-backed",
    sponsor_type: "PE",
    sector: "oilfield-services",
    roles: ["Interim CFO", "Restructuring"],
    outcome_tags: ["Turnaround", "Sale"],
    headline_metric: "3× run-rate EBITDA in 18 months",
    summary_md:
      "Tripled run-rate EBITDA in 18 months — embedded finance leadership through the turnaround and into the exit.",
    body_md:
      "Cadre needed the seat filled, fast, in a market that had turned. Fairlead ran the finance function through the downturn: cash discipline weekly, cost structure rebuilt, and the business repositioned so the recovery dropped to the bottom line.\n\nTODO: expand with cleared detail from the deck case study.",
    year_start: 2016,
    year_end: 2018,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "3",
    slug: "grp-holdco",
    company_display: "GRP Holdco",
    sponsor_display: "Ares",
    sponsor_type: "Infra",
    sector: "renewables",
    roles: ["Interim CFO", "M&A"],
    outcome_tags: ["Financing", "Tax equity"],
    headline_metric: "$82.5M tax equity raised", // TODO(§9): Adam to confirm figure
    summary_md:
      "Ran the tax equity process for an Ares-backed renewables platform — $82.5M raised with the same team that ran the monthly close.",
    body_md:
      "The same people who closed the books ran the raise. Fairlead prepared the model, the diligence room, and the lender process for GRP's tax equity financing — $82.5M committed.\n\nTODO: expand with cleared detail; confirm figure with Adam.",
    year_start: 2022,
    year_end: null,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "4",
    slug: "nirenberg-neuroscience",
    company_display: "Nirenberg Neuroscience",
    sponsor_display: "Founder-led",
    sponsor_type: "VC",
    sector: "life-sciences",
    roles: ["M&A"],
    outcome_tags: ["Sale"],
    headline_metric: "Advised through sale",
    summary_md:
      "Advised Nirenberg Neuroscience through its sale process — preparation, diligence, and close.",
    body_md: "TODO: adapt the 2023 case study post into the case study format.",
    year_start: 2023,
    year_end: 2023,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "5",
    slug: "dion-leadership",
    company_display: "Dion Leadership",
    sponsor_display: "Founder-led",
    sponsor_type: "Corporate",
    sector: "professional-services",
    roles: ["M&A"],
    outcome_tags: ["Sale"],
    headline_metric: "Sold to Gallagher",
    summary_md:
      "Supported Dion Leadership through its sale to Gallagher — process management from preparation to close.",
    body_md:
      "At Fairlead Advisors, we've long believed that the most enduring companies aren't just built on clean financials. They're built on trust, clarity, and a deep understanding of what drives value beneath the surface. That's why we were proud to support Dion Leadership, a Detroit-based executive coaching and leadership development firm, in its acquisition by Arthur J. Gallagher & Co., a global leader in insurance and HR consulting.\n\n**What made this engagement unique?**\n\nDion Leadership isn't a conventional consulting business. Since its founding in 2019, the firm has built a national reputation with over 60 coaches and consultants helping organizations lead more effectively. Dion was growing steadily, but the real asset wasn't only in the financials — it was the way the firm delivers client results, scales talent, and sustains long-term client relationships.\n\nFairlead wasn't brought in just to clean up spreadsheets. We were engaged to translate Dion's value into language that investors and strategic buyers would understand. That meant examining the entire business model, not just the metrics.\n\n**Our role**\n\nWe worked closely with founder Steve Dion and his leadership team to clarify and position Dion's business model and track record in a format that resonated with acquirers; identify strategic and financial partners that could see and build on Dion's platform; support the negotiation and deal structure to reflect both immediate value and long-term potential; and align founder and buyer around a shared post-transaction vision.\n\n**The result**\n\nDion Leadership now operates within Gallagher's Talent Consulting Practice, adding depth in executive coaching, leadership development, and organizational effectiveness. Gallagher's CEO, J. Patrick Gallagher, Jr., shared that \"Dion Leadership's strong client relationships and expertise... will expand our capabilities in the executive consulting space.\" This outcome speaks to the value of Dion's team, the clarity of their model, and the strength of the positioning that led to a successful transaction.\n\n**Looking ahead**\n\nThis engagement is a clear example of how Fairlead helps surface and communicate real value. We don't rely on standard playbooks. We dig in, identify what matters most, and help move deals forward with confidence. Whether you are a founder, investor, or buyer, we bring seasoned operational insight and transactional support to drive results.",
    year_start: 2025,
    year_end: 2025,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "6",
    slug: "survival-sprint",
    company_display: "A venture-stage manufacturer",
    sponsor_display: "VC-backed",
    sponsor_type: "VC",
    sector: "manufacturing",
    roles: ["Interim CFO", "Restructuring"],
    outcome_tags: ["Turnaround", "Financing"],
    headline_metric: "Runway extended through the sprint to financing",
    summary_md:
      "The survival sprint: cash controlled weekly, overhead cut to the operating core, and the company carried to its next financing.",
    body_md: "TODO: adapt the 2023 “Survival Sprint” case study post.",
    year_start: 2023,
    year_end: 2023,
    featured: true,
    anonymized: true,
    visible: true,
  },
  {
    id: "7",
    slug: "ambri",
    company_display: "Ambri",
    sponsor_display: "Investor consortium",
    sponsor_type: "VC",
    sector: "energy-storage",
    roles: ["Interim CFO", "Restructuring"],
    outcome_tags: ["Turnaround", "Financing"],
    headline_metric: "Embedded finance leadership through restructuring",
    summary_md:
      "Embedded with Ambri through its restructuring — finance leadership, creditor process, and the path to continued operations.",
    body_md: null, // TODO: confirm what can be said publicly before adding a detail page
    year_start: 2023,
    year_end: null,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "8",
    slug: "greenleaf",
    company_display: "Greenleaf",
    sponsor_display: "PE-backed",
    sponsor_type: "PE",
    sector: "industrial-processing",
    roles: ["Interim CFO"],
    outcome_tags: ["Turnaround"],
    headline_metric: "TODO: confirm headline metric",
    summary_md: "TODO: draft summary pending engagement detail from the March 2026 summary.",
    body_md: null,
    year_start: 2021,
    year_end: null,
    featured: true,
    anonymized: false,
    visible: true,
  },
  {
    id: "9",
    slug: "veolia-district-energy",
    company_display: "Veolia district energy assets",
    sponsor_display: "Corporate",
    sponsor_type: "Corporate",
    sector: "district-energy",
    roles: ["M&A"],
    outcome_tags: ["Sale"],
    headline_metric: "$1.25B transaction",
    summary_md:
      "Supported the $1.25B district energy transaction — diligence, carve-out finance, and process support at infrastructure scale.",
    body_md: null,
    year_start: 2019,
    year_end: 2020,
    featured: true,
    anonymized: false,
    visible: true,
  },
];
