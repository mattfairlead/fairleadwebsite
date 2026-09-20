import type { Engagement } from "@/lib/types";

/**
 * Featured engagements — the nine from §4.4, drafted in the §10 voice.
 * Past tense, operator's vocabulary, metric first.
 *
 * Sources: the GRP figure is the public March 2023 press release (the
 * perspectives archive carries it in full); the Cordia interim-CEO role is
 * per Adam Carte (firm profile, Sept 2026); the McKinsey collaboration on
 * Cordia is deliberately omitted until cleared. The rest of the register is
 * read live from the engagement hub (lib/data.ts → loadRegister).
 */
export const engagements: Engagement[] = [
  {
    id: "1",
    slug: "cordia",
    company_display: "Cordia",
    sponsor_display: "KKR",
    sponsor_type: "Infra",
    sector: "district-energy",
    roles: ["Interim CEO", "Operating Partner", "M&A"],
    outcome_tags: ["Spin-off"],
    headline_metric: "$1.9B carve-out, stood up as a standalone platform",
    summary_md:
      "Fairlead embedded through the $1.9B carve-out of a district energy platform, with Adam Carte as interim CEO: the finance function, the reporting, and the operating cadence a standalone company needs from day one.",
    body_md:
      "When KKR carved Cordia out at $1.9B, the platform needed a complete leadership and finance function, not advice on one. Fairlead sat in the seats. Adam Carte served as interim CEO through the carve-out, and the team behind him stood up accounting, treasury, reporting, and the board cadence while the business kept running.\n\nThe work was the standard carve-out list, done from inside: separating from the seller's systems and contracts, building the sponsor's reporting from the ground up, and putting an operating rhythm in place that the permanent management team could inherit. The same people who ran the close ran the board meeting.",
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
      "Tripled run-rate EBITDA in 18 months: embedded finance leadership through the turnaround and into the exit.",
    body_md:
      "Cadre needed the seat filled, fast, in a market that had turned. Fairlead ran the finance function through the downturn: cash discipline weekly, cost structure rebuilt, and the business repositioned so the recovery dropped to the bottom line.\n\nRun-rate EBITDA tripled in eighteen months. The same team stayed in the seat through the turnaround and into the exit, so the numbers a buyer diligenced were the numbers the company had been run on.",
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
    headline_metric: "$82.5M tax equity raised",
    summary_md:
      "Ran the tax equity process for a 116 MW biomass platform with Ares-led project debt: $82.5M raised with the same team that ran the monthly close.",
    body_md:
      "The same people who closed the books ran the raise. Fairlead manages GRP Holdco, the owner of two operating biomass projects in Georgia (116 MW under 30-year power purchase agreements), and prepared the model, the diligence room, and the investor process for its tax equity financing: $82.5M committed, monetizing production tax credits through 2029.\n\nThe structure had to work for a project-debt consortium led by an Ares Management infrastructure debt fund, the tax equity investor, and the company at the same time. It closed in March 2023.",
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
    headline_metric: "Seed stage to acquisition by a U.S. tech giant",
    summary_md:
      "Fractional commercial, financial, and back-office leadership from the seed round to the 2022 acquisition by a U.S.-based tech giant.",
    body_md:
      "Nirenberg Neuroscience, a New York computer-vision company built on Dr. Sheila Nirenberg's work decoding the neural code of human vision, engaged Fairlead at its seed round and kept the team in place until a U.S.-based tech giant acquired the company in early 2022.\n\nFairlead provided strategic planning, executive management, and accounting: the fractional commercial, financial, and back-office function of a company that deliberately kept its cost structure to a minimum. That discipline bought the founder time. Pilot applications proved the software on a wide range of problems, a license agreement with Ford Motor Company followed for its autonomous-vehicle program, and a chip partnership made the technology available to any company with a computer-vision problem.\n\nThat partnership led to the acquisition. The company spent its capital on the science; Fairlead carried the rest.",
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
      "Supported Dion Leadership through its sale to Gallagher: process management from preparation to close.",
    body_md:
      "At Fairlead Advisors, we've long believed that the most enduring companies aren't just built on clean financials. They're built on trust, clarity, and a deep understanding of what drives value beneath the surface. That's why we were proud to support Dion Leadership, a Detroit-based executive coaching and leadership development firm, in its acquisition by Arthur J. Gallagher & Co., a global leader in insurance and HR consulting.\n\n**What made this engagement unique?**\n\nDion Leadership isn't a conventional consulting business. Since its founding in 2019, the firm has built a national reputation with over 60 coaches and consultants helping organizations lead more effectively. Dion was growing steadily, but the real asset wasn't only in the financials. It was the way the firm delivers client results, scales talent, and sustains long-term client relationships.\n\nFairlead wasn't brought in just to clean up spreadsheets. We were engaged to translate Dion's value into language that investors and strategic buyers would understand. That meant examining the entire business model, not just the metrics.\n\n**Our role**\n\nWe worked closely with founder Steve Dion and his leadership team to clarify and position Dion's business model and track record in a format that resonated with acquirers; identify strategic and financial partners that could see and build on Dion's platform; support the negotiation and deal structure to reflect both immediate value and long-term potential; and align founder and buyer around a shared post-transaction vision.\n\n**The result**\n\nDion Leadership now operates within Gallagher's Talent Consulting Practice, adding depth in executive coaching, leadership development, and organizational effectiveness. Gallagher's CEO, J. Patrick Gallagher, Jr., shared that \"Dion Leadership's strong client relationships and expertise... will expand our capabilities in the executive consulting space.\" This outcome speaks to the value of Dion's team, the clarity of their model, and the strength of the positioning that led to a successful transaction.\n\n**Looking ahead**\n\nThis engagement is a clear example of how Fairlead helps surface and communicate real value. We don't rely on standard playbooks. We dig in, identify what matters most, and help move deals forward with confidence. Whether you are a founder, investor, or buyer, we bring seasoned operational insight and transactional support to drive results.",
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
    headline_metric: "Sold at a premium to invested capital, three weeks before the cash ran out",
    summary_md:
      "Three years of financials restated, plant efficiency proven in a model, and a competitive auction run inside a twelve-month cash runway.",
    body_md:
      "A venture-stage manufacturer had built a commercial-scale plant with a genuinely better production process and could not show whether it was profitable. Raw materials were bought six months ahead, the accounting had never kept up, and the company had less than a year of cash from its investor.\n\nFairlead's mandate was a financing or a sale before the money ran out. The accounting team restated three years of financial statements after uncovering significant errors. In parallel, with no time to implement an ERP, the analysis team rebuilt the production process in a model alongside the VP of Operations, which both validated the founder's efficiency thesis and gave operations the data to improve it during the process.\n\nWith proof of the plant's performance, the company drew customer and competitor interest. After a competitive auction, its largest customer bought the company at a premium to invested capital, three weeks before the cash ran out, with three years of audited financials delivered at close.",
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
      "Embedded with Ambri through its restructuring: finance leadership, creditor process, and the path to continued operations.",
    body_md: null, // no detail page until the partners confirm what can be said publicly
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
    sector: "renewables",
    roles: ["Interim CEO", "Operating Partner", "M&A"],
    outcome_tags: ["Turnaround", "Sale"],
    headline_metric: "Grown into one of the largest biomass platforms in the U.S.",
    summary_md:
      "Ran and grew Greenleaf Power into one of the largest biomass power platforms in the country: acquisitions, operations, and the divestiture of plants in California, Connecticut, and Quebec.",
    body_md: null, // no detail page until the partners clear one
    year_start: 2011,
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
      "Supported the $1.25B district energy transaction: diligence, carve-out finance, and process support at infrastructure scale.",
    body_md: null,
    year_start: 2019,
    year_end: 2020,
    featured: true,
    anonymized: false,
    visible: true,
  },
];
