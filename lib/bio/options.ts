/**
 * Every pick-list on /bio, plus the synonyms and canonical names the
 * consistency layer uses (PRD §6, §6.10). Single source: the form renders
 * from these, and lib/bio/schema.ts validates against them on both sides.
 *
 * Lists marked "closed" have no Other… option. Everything else ends with
 * Other…, which the form renders itself — the arrays below hold only the
 * standard values.
 */

export const OTHER = "Other…";

/* ---------- §6.1 Basics ---------- */

export const PRONOUNS = [
  { value: "he", label: "he" },
  { value: "she", label: "she" },
  { value: "they", label: "they" },
  { value: "name_only", label: "use my name only" },
] as const; // closed

export const TITLES = [
  "Partner",
  "Managing Director",
  "Strategic Partner",
  "Senior Advisor",
  "Senior Consultant",
  "Consultant",
  "Associate",
  "Administrative and Operations Manager",
];

/** Titles that carry a specialization line ("Strategic Partner, Structured Finance & Risk"). */
export const SPECIALIZED_TITLES = ["Strategic Partner", "Senior Advisor", "Senior Consultant"];

/* ---------- §6.2 Fairlead role ---------- */

export const SUPPORTING_SERVICES = "Supporting Services";
export const INTERIM_LEADERSHIP = "Interim / Fractional Leadership";

export const SERVICE_LINES = [
  "Operating Partner",
  "Assessment & Diligence",
  "M&A & Capital Raising",
  INTERIM_LEADERSHIP,
  "Advisory",
  SUPPORTING_SERVICES,
];

export const SUPPORTING_AREAS = [
  "Accounting & Close",
  "Financial Reporting",
  "Human Resources",
  "Payroll",
  "Corporate Governance & Secretary",
  "Administration & Operations",
  "IT & Systems",
  "Tax",
];

export const LEADERSHIP_MODES = [
  { value: "interim", label: "Interim (full-time, fixed term)" },
  { value: "fractional", label: "Fractional (part-time, ongoing)" },
  { value: "both", label: "Both" },
] as const; // closed

export const SEATS = [
  "CEO",
  "CFO",
  "COO",
  "CRO",
  "Chief Restructuring Officer",
  "Controller",
  "Treasurer",
  "Board member / Board advisor",
  "Operating Partner",
  "Asset manager",
  "HR lead",
  "Corporate secretary",
];

/** §6.8 — grouped so 42 chips stay scannable. Flattened in FOCUS_AREAS. */
export const FOCUS_AREA_GROUPS: { heading: string; options: string[] }[] = [
  {
    heading: "Finance & Accounting",
    options: [
      "Accounting",
      "Financial Reporting",
      "Forecasting & FP&A",
      "Financial Modeling",
      "Valuation",
      "Working Capital & Cash Management",
      "Treasury",
      "Tax & International Accounting",
      "Audit Support",
      "Internal Controls & Compliance",
      "Payroll",
      "Financial Hedging",
    ],
  },
  {
    heading: "Transactions",
    options: [
      "M&A Execution",
      "Buy-side Diligence",
      "Sell-side & Exit Preparation",
      "Capital Raising",
      "Debt & Structured Finance",
      "Credit Risk",
      "Integration & 100-Day Plans",
      "Broker-Dealer Services",
    ],
  },
  {
    heading: "Leadership & Strategy",
    options: ["Restructuring & Turnaround", "Strategic Planning", "Business Planning", "Capital Planning"],
  },
  {
    heading: "Operations & Technical",
    options: [
      "Operations",
      "Asset Management",
      "Project Management",
      "EHS",
      "ERP Selection & Implementation",
      "Technology Integration",
      "Data Analysis",
      "Research",
    ],
  },
  {
    heading: "Commercial",
    options: [
      "Commercial Diligence",
      "Go-to-Market Strategy",
      "Growth Planning",
      "Sales & Marketing Systems",
      "Business Development",
    ],
  },
  {
    heading: "People & Governance",
    options: ["Human Resources", "Corporate Governance", "Board Support", "Back Office Support"],
  },
];

export const FOCUS_AREAS = FOCUS_AREA_GROUPS.flatMap((g) => g.options);

export const SECTORS = [
  "Energy & Power",
  "Renewable Power",
  "District Energy",
  "Oil & Gas",
  "Sustainable Fuels",
  "Infrastructure",
  "Construction",
  "Industrial",
  "Minerals & Processing",
  "Food Industry",
  "Technology & Startups",
  "AI",
  "SaaS",
  "IoT",
  "HealthTech",
];

export const CLIENT_TYPES = [
  "Private equity",
  "Venture capital",
  "Family office",
  "Lenders & creditors",
  "Boards",
  "Management teams",
  "Government",
];

/* ---------- §6.3 Recent Fairlead work ---------- */

export const CAN_NAME = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
] as const; // closed

export const ENGAGEMENT_STATUS = [
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
] as const; // closed

export const ENGAGEMENT_ROLES = [
  ...SEATS,
  "Sell-side lead",
  "Buy-side diligence lead",
  "Fundraising lead",
  "Special committee chair",
  "Workstream lead",
  "Team member",
];

/* ---------- §6.4 Career ---------- */

export const CONCURRENT_ROLE_TYPES = [
  { value: "own_firm", label: "My own firm / practice" },
  { value: "board", label: "Board seat" },
  { value: "teaching", label: "Teaching / adjunct" },
  { value: "other_employment", label: "Other employment" },
] as const; // closed

/* ---------- §6.5 Education and credentials ---------- */

export const DEGREES = [
  "B.A.",
  "B.S.",
  "BBA",
  "B.Com.",
  "B.Eng.",
  "M.A.",
  "M.S.",
  "MBA",
  "M.Acc.",
  "Master of Business Taxation",
  "Master's (other)",
  "J.D.",
  "Ph.D.",
];

export const HONORS = ["summa cum laude", "magna cum laude", "cum laude", "with distinction"];

export const DESIGNATIONS = [
  "CFA",
  "CPA",
  "P.E.",
  "CGMA",
  "CIRA",
  "CTP",
  "CMA",
  "CIA",
  "CFP",
  "CAIA",
  "FRM",
  "PMP",
  "CA (Canada)",
  "SHRM-CP",
  "SHRM-SCP",
  "SPHR",
];

/** Designations that are licenses — an active one needs a jurisdiction. */
export const LICENSES = ["CPA", "P.E.", "CA (Canada)"];

export const CREDENTIAL_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "retired", label: "Retired" },
  { value: "expired", label: "Expired" },
] as const; // closed

/* ---------- §6.6 Extras ---------- */

export const AFFILIATION_ROLES = [
  "Board member",
  "Board chair",
  "Advisory board",
  "Committee chair",
  "Chapter president",
  "Officer",
  "Member",
  "Adjunct instructor",
];

export const AFFILIATION_TYPES = ["Company", "Nonprofit", "Industry association", "Academic"];

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "Portuguese",
  "German",
  "Mandarin",
  "Vietnamese",
  "Hindi",
  "Arabic",
];

export const HEADSHOT_CHOICES = [
  { value: "keep", label: "Keep my current photo" },
  { value: "upload", label: "Upload a new one" },
  { value: "need_new", label: "I need a new one taken" },
] as const; // closed

/* ---------- §6.10 Consistency layer ---------- */

/** Fixed spellings for credentials, degrees and Other values. Keys are lowercase. */
export const FIXED_SPELLINGS: Record<string, string> = {
  pe: "P.E.",
  "p.e": "P.E.",
  "p.e.": "P.E.",
  "professional engineer": "P.E.",
  cpa: "CPA",
  "c.p.a.": "CPA",
  "c.p.a": "CPA",
  bs: "B.S.",
  "b.s": "B.S.",
  "b.s.": "B.S.",
  bsc: "B.S.",
  "bachelor of science": "B.S.",
  ba: "B.A.",
  "b.a": "B.A.",
  "b.a.": "B.A.",
  "bachelor of arts": "B.A.",
  mba: "MBA",
  "m.b.a.": "MBA",
  "m.b.a": "MBA",
  phd: "Ph.D.",
  "ph.d": "Ph.D.",
  "ph.d.": "Ph.D.",
  jd: "J.D.",
  "j.d": "J.D.",
  "j.d.": "J.D.",
  "chartered accountant (canada)": "CA (Canada)",
  "cpa canada": "CA (Canada)",
  "cfa charterholder": "CFA",
};

/** Custom text → standard option, for "Did you mean…?". Keys are lowercase. */
export const FOCUS_SYNONYMS: Record<string, string> = {
  reporting: "Financial Reporting",
  "financial statements": "Financial Reporting",
  close: "Financial Reporting",
  "month-end close": "Financial Reporting",
  "fp&a": "Forecasting & FP&A",
  budgeting: "Forecasting & FP&A",
  planning: "Forecasting & FP&A",
  forecasting: "Forecasting & FP&A",
  modeling: "Financial Modeling",
  models: "Financial Modeling",
  "financial model": "Financial Modeling",
  erp: "ERP Selection & Implementation",
  d365: "ERP Selection & Implementation",
  dynamics: "ERP Selection & Implementation",
  netsuite: "ERP Selection & Implementation",
  "sage intacct": "ERP Selection & Implementation",
  sap: "ERP Selection & Implementation",
  "quickbooks implementation": "ERP Selection & Implementation",
  "m&a": "M&A Execution",
  mergers: "M&A Execution",
  acquisitions: "M&A Execution",
  transactions: "M&A Execution",
  "due diligence": "Buy-side Diligence",
  diligence: "Buy-side Diligence",
  "buy-side": "Buy-side Diligence",
  exit: "Sell-side & Exit Preparation",
  "sale process": "Sell-side & Exit Preparation",
  "sell-side": "Sell-side & Exit Preparation",
  fundraising: "Capital Raising",
  "capital raise": "Capital Raising",
  "equity raise": "Capital Raising",
  restructuring: "Restructuring & Turnaround",
  turnaround: "Restructuring & Turnaround",
  bankruptcy: "Restructuring & Turnaround",
  "chapter 11": "Restructuring & Turnaround",
  cro: "Restructuring & Turnaround",
  sox: "Internal Controls & Compliance",
  controls: "Internal Controls & Compliance",
  compliance: "Internal Controls & Compliance",
  hr: "Human Resources",
  people: "Human Resources",
  talent: "Human Resources",
  compensation: "Human Resources",
  benefits: "Human Resources",
  integration: "Integration & 100-Day Plans",
  pmi: "Integration & 100-Day Plans",
  "100-day plan": "Integration & 100-Day Plans",
  governance: "Corporate Governance",
  "corporate secretary": "Corporate Governance",
  "board minutes": "Corporate Governance",
  gtm: "Go-to-Market Strategy",
  "go to market": "Go-to-Market Strategy",
  "sales strategy": "Go-to-Market Strategy",
  cash: "Working Capital & Cash Management",
  "cash management": "Working Capital & Cash Management",
  liquidity: "Working Capital & Cash Management",
  "working capital": "Working Capital & Cash Management",
  tax: "Tax & International Accounting",
  "international tax": "Tax & International Accounting",
  "transfer pricing": "Tax & International Accounting",
  "working capital management": "Working Capital & Cash Management",
  "erp systems": "ERP Selection & Implementation",
  "erp implementation": "ERP Selection & Implementation",
  "erp assessment and implementation": "ERP Selection & Implementation",
  "international accounting and tax": "Tax & International Accounting",
  "regulatory compliance": "Internal Controls & Compliance",
  "structured finance": "Debt & Structured Finance",
  "m&a advisory": "M&A Execution",
  "project finance modeling": "Financial Modeling",
  "ap/ar": "Accounting",
  bookkeeping: "Accounting",
  accounting: "Accounting",
};

export const SECTOR_SYNONYMS: Record<string, string> = {
  solar: "Renewable Power",
  wind: "Renewable Power",
  renewables: "Renewable Power",
  biotech: "HealthTech",
  "life sciences": "HealthTech",
  medtech: "HealthTech",
  "oilfield services": "Oil & Gas",
  "oil field services": "Oil & Gas",
  "frac sand": "Oil & Gas",
  midstream: "Oil & Gas",
};

/** Canonical employers, with the standard descriptor where we have one. */
export const EMPLOYERS: { name: string; descriptor?: string }[] = [
  { name: "NRG Energy, Inc.", descriptor: "then the third-largest independent power producer in the world" },
  { name: "The Trigen Companies" },
  { name: "Veolia North America" },
  { name: "Vicinity Energy", descriptor: "a $1.5 billion district energy company" },
  { name: "Ever-Green Energy" },
  { name: "Greenleaf Power" },
  { name: "AlphaStruxure", descriptor: "a private equity–backed Energy-as-a-Service and microgrid developer" },
  { name: "Excelsior Energy, Inc.", descriptor: "a start-up developing a $2.3 billion clean coal–fueled power plant" },
  { name: "Texas-New Mexico Power", descriptor: "an electric utility serving approximately 275,000 customers" },
  { name: "Wayzata Investment Partners", descriptor: "a private equity firm managing multiple large equity funds" },
  { name: "KLX Energy Services" },
  { name: "Greene's Energy Group" },
  { name: "J.P. Morgan" },
  { name: "Morgan Stanley" },
  { name: "UBS" },
  { name: "Deutsche Bank" },
  { name: "Barclays Capital" },
  { name: "CIBC Capital Markets" },
  { name: "The Brattle Group" },
  { name: "Merrill Lynch" },
  { name: "Ernst & Young" },
  { name: "Grant Thornton" },
  { name: "Alvarez & Marsal" },
  { name: "Getzler Henrich" },
  { name: "Macquarie" },
  { name: "Raytheon Engineers & Constructors" },
  { name: "Honeywell" },
  { name: "Ecolab" },
  { name: "Ambri, Inc." },
  { name: "Niotan, Inc." },
  { name: "Pinnacle Airlines (now Endeavor Air)" },
  { name: "Dufresne Spencer Group (Ashley Furniture HomeStore)" },
  { name: "PSP Investments" },
  { name: "Entegris, Inc." },
  { name: "Comcast" },
  { name: "Black Box Network Services", descriptor: "a publicly traded multinational communications solutions provider" },
  { name: "Kearsarge Energy", descriptor: "a commercial-scale solar developer" },
  { name: "AAFCPAs" },
];

export const INSTITUTIONS = [
  "University of Minnesota, Carlson School of Management",
  "Columbia Business School",
  "NYU Stern School of Business",
  "The Wharton School, University of Pennsylvania",
  "Rice University, Jones Graduate School of Business",
  "London School of Economics",
  "Tufts University",
  "Georgetown University",
  "Cornell University",
  "McGill University",
  "Texas A&M University",
  "Santa Clara University",
  "University of Nevada, Reno",
  "University of Maryland",
  "University of Vermont",
  "University of Denver",
  "University of St. Thomas",
  "University of Iowa",
  "University of Houston",
  "University of North Dakota",
  "Nicholls State University",
  "University of Oxford",
  "University of Louisiana at Lafayette",
  "Earlham College",
  "Union University",
  "ICADE Business School",
];

/* ---------- Limits ---------- */

export const LIMITS = {
  name: 60,
  title_custom: 60,
  title_specialization: 50,
  other: 60,
  short: 120,
  long: 400,
  value_statement_words: 30,
  descriptor_words: 15,
  what_you_did_words: 30,
  result_words: 25,
  employer_descriptor_words: 12,
  highlight_words: 30,
  earlier_career_words: 25,
  personal_line_words: 25,
  notes_words: 100,
  disclosure_chars: 800,
  do_not_mention_chars: 400,
  service_lines: 3,
  supporting_areas: 3,
  seats: 5,
  focus_min: 3,
  focus_max: 4,
  sectors: 3,
  engagements: 3,
  prior_roles: 4,
  education: 6,
  credentials: 8,
  affiliations: 8,
  licenses: 8,
  languages: 6,
} as const;

export const FAIRLEAD_FOUNDED = 2010;
export const EARLIEST_YEAR = 1960;
