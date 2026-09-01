/**
 * Content types — mirrors the Supabase schema in §7 of the redesign plan.
 * The local seed files in /content/seed conform to these shapes, so the
 * Supabase swap (lib/data.ts) is zero-code for page components.
 */

export type TeamGroup = "partner" | "team";

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  title: string;
  credentials: string | null; // one format: "CPA", "P.E.", "CFA"
  group: TeamGroup;
  specialty: string; // one-line specialty for the card
  bio_md: string;
  photo_url: string | null;
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
