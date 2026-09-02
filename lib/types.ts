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
