/**
 * Content types — mirrors the Supabase schema in §7 of the redesign plan.
 * The local seed files in /content/seed conform to these shapes, so the
 * Supabase swap (lib/data.ts) is zero-code for page components.
 */

export type TeamGroup = "partner" | "team";

/**
 * One row of the engagement hub's `team_members` table
 * (github.com/mattfairlead/fairlead — the same Supabase project). The hub is
 * the system of record for the roster: names, titles, bios, headshots, and
 * the "Website" checkbox (`show_on_website`). The website never writes to it.
 * `photo_url` is deliberately not read in list queries — the hub stores
 * headshots inline as base64 data URLs, so the site fetches one at a time
 * through /api/team/photo/[id] and lists the roster with `has_photo`.
 */
export interface HubTeamRow {
  id: number;
  name: string;
  suffix: string; // "CFA, Partner", "Strategic Partner, Structured Finance & Risk"
  roles: string; // "CEO, CFO, CRO, Board Member, Operating Partner"
  sort_order: number;
  extended_bio: string; // paragraphs separated by blank lines
  has_photo: boolean;
  show_on_website: boolean;
  updated_at: string;
}

/** The website's view of a team member — derived from HubTeamRow by lib/team.ts. */
export interface TeamMember {
  id: string; // hub row id, as a string
  slug: string; // derived from the name — "adam-carte"; the /team#anchor and JSON-LD url
  name: string;
  title: string; // "Partner", "Senior Consultant", "Strategic Partner, Broker-Dealer Advisor"
  credentials: string | null; // "CFA", "P.E.", "CPA, CGMA"
  group: TeamGroup; // "partner" = the four founding partners (suffix contains a bare "Partner")
  specialty: string; // the hub's roles line — "CFO, Planning, Valuation, Transactional Services"
  bio_md: string;
  photo_url: string | null; // /api/team/photo/[id]?v=… or an https URL; null renders the monogram
  linkedin: string | null;
  visible: boolean;
  sort: number;
}

export type SponsorType = "PE" | "Infra" | "VC" | "Family office" | "Corporate";

export type EngagementRole =
  | "Interim CEO"
  | "Interim CFO"
  | "Interim COO"
  | "Controller"
  | "Operating Partner"
  | "Board"
  | "M&A"
  | "Restructuring";

export type OutcomeTag = "Sale" | "Financing" | "Turnaround" | "Spin-off" | "Tax equity";

export interface Engagement {
  id: string;
  slug: string;
  company_display: string; // anonymized where required ("a PE-backed metals platform")
  sponsor_display: string; // "KKR" or "a large-cap PE fund"
  sponsor_type: SponsorType;
  sector: string; // sector slug
  roles: EngagementRole[];
  outcome_tags: OutcomeTag[];
  headline_metric: string;
  summary_md: string;
  body_md: string | null; // full case study; null = card only, no detail page
  year_start: number;
  year_end: number | null;
  featured: boolean;
  anonymized: boolean;
  visible: boolean;
}

export interface Sector {
  id: string;
  slug: string;
  name: string;
  sort: number;
}

export type PerspectiveKind = "perspective" | "transaction";

export interface Perspective {
  id: string;
  slug: string;
  title: string;
  author_slug: string | null; // team slug
  kind: PerspectiveKind;
  published_at: string; // ISO date
  excerpt: string;
  body_md: string | null;
  external_url: string | null; // transactions link out to the original release
  visible: boolean;
}

/* ==========================================================================
   Engagement register — the hub's `engagements` table, rendered on
   /engagements as a locked register (every row) that unlocks per browser once
   a visitor verifies their email. See lib/register.ts and lib/register-access.ts.
   ========================================================================== */

/**
 * One row of the hub's `engagements` table — the internal tracker. Read
 * SERVER-SIDE ONLY with the service role (lib/supabase.ts → getSupabaseAdmin);
 * there is deliberately no anon policy on this table. `company`, `pe_fund`
 * and `summary` are the confidential fields.
 */
export interface HubEngagementRow {
  id: number;
  company: string;
  pe_fund: string;
  key_symbols: string; // "◆⬤▲◼⚑" subset — the hub's work-type legend
  sector: string; // "Energy" | "VC" | "Family Office" | "Other"
  summary: string;
  status: string; // "Active" | "Historical" | ""
  sort_order: number;
  show_on_website: boolean;
  updated_at: string;
}

/** The hub's work-type legend, as slugs the site filters on. */
export type RegisterWork = "operating-partner" | "assessment" | "m-and-a" | "leadership" | "advisory";
export type RegisterSector = "energy" | "venture" | "family-office" | "other";
export type RegisterStatus = "active" | "historical" | null;

/**
 * What EVERY visitor may see about a register row. Structurally incapable of
 * carrying a company or sponsor name — the locked view is built from this
 * type alone, so no name can reach the HTML by accident. `summary` is the
 * hub's summary with the company and sponsor names scrubbed out
 * (lib/register.ts → redact); empty when the hub is unreachable.
 */
export interface RegisterPublicRow {
  id: number;
  index: number; // 1-based position in the register ("№ 023")
  sector: RegisterSector;
  status: RegisterStatus;
  work: RegisterWork[];
  sponsor_backed: boolean; // the hub row names a fund — the name itself stays private
  summary: string; // name-scrubbed; "" when no hub connection
}

/** The unlocked row — public fields plus the confidential ones. */
export interface RegisterRow extends RegisterPublicRow {
  company: string;
  sponsor: string | null;
  summary: string; // the hub's summary as written, names and all
}
