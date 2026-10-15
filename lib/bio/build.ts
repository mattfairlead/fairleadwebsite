/**
 * From answers to the file Matt drops into Claude (PRD §7). The client's
 * Download fallback and /api/bio use the same pipeline:
 *
 *   sanitize (server only) → normalizeData → prune → validate → finalize → buildBioJson
 */

import { BIO_GENERATOR_V2 } from "./generator";
import { LIMITS } from "./options";
import { isNewEmployer, isNewInstitution, normalizeData } from "./normalize";
import {
  emptyData,
  isOpenQuestionField,
  movesOut,
  prune,
  SCHEMA_ID,
  validate,
  type BioIntakeData,
  type FieldErrors,
  type RosterMember,
  type ValidateContext,
} from "./schema";

export interface SubmissionMeta {
  submission_id: string;
  submitted_at: string;
  revision_of: string | null;
  source: string;
  hub_team_member_id: number | null;
  prefill: { name: string; suffix: string; roles: string } | null;
  headshot_attached: boolean;
  user_agent?: string;
}

export interface BioFile {
  schema: typeof SCHEMA_ID;
  instructions: typeof BIO_GENERATOR_V2;
  submission: SubmissionMeta;
  data: BioIntakeData;
}

/** The roster values the form started from — recorded so Matt can see what changed (§5.2). */
export function prefillFor(m: RosterMember): NonNullable<SubmissionMeta["prefill"]> {
  return {
    name: m.name,
    suffix: [m.credentials, m.title].filter(Boolean).join(", "),
    roles: m.specialty,
  };
}

/**
 * Structural moves that come after validation, so error paths line up with
 * what the person sees: a current role at their own firm becomes
 * outside_firm; a current board seat or teaching post becomes an affiliation.
 */
export function finalize(input: BioIntakeData): BioIntakeData {
  const d: BioIntakeData = structuredClone(input);
  const keep: BioIntakeData["prior_roles"] = [];
  for (const r of d.prior_roles) {
    if (!movesOut(r)) {
      keep.push(r);
      continue;
    }
    if (r.concurrent_role_type === "own_firm") {
      d.extras.has_outside_firm = true;
      if (!d.extras.outside_firm.name) d.extras.outside_firm = { name: r.employer, descriptor: r.employer_descriptor };
    } else {
      const board = r.concurrent_role_type === "board";
      const dup = d.extras.board_and_affiliations.some((a) => a.organization.toLowerCase() === r.employer.toLowerCase());
      if (!dup)
        d.extras.board_and_affiliations.push({
          role: board ? "Board member" : "Adjunct instructor",
          role_custom: "",
          organization: r.employer,
          type: board ? "Company" : "Academic",
          type_custom: "",
        });
    }
  }
  d.prior_roles = keep;
  for (const r of d.prior_roles) r.employer_is_new_name = !!r.employer && isNewEmployer(r.employer);
  for (const g of d.education) g.institution_is_new_name = !!g.institution && isNewInstitution(g.institution);
  return d;
}

/** The full pipeline short of stamping metadata. `data.warnings` is filled in. */
export function prepare(raw: BioIntakeData, ctx: ValidateContext = {}): { data: BioIntakeData; errors: FieldErrors; warnings: string[] } {
  const { data: normalized, notes } = normalizeData(raw);
  const pruned = prune(normalized);
  const { errors, warnings } = validate(pruned, ctx);
  const data = finalize(pruned);
  data.warnings = [...new Set([...notes, ...warnings])];
  return { data, errors, warnings: data.warnings };
}

export function buildBioJson(data: BioIntakeData, meta: SubmissionMeta): BioFile {
  return { schema: SCHEMA_ID, instructions: BIO_GENERATOR_V2, submission: meta, data };
}

export function slugifyName(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** bio_{slug}_{YYYYMMDD-HHmm}.json, UTC. */
export function bioFilename(file: BioFile): string {
  const b = file.data.basics;
  const slug = slugifyName(`${b.first_name} ${b.last_name}`) || "unknown";
  const t = new Date(file.submission.submitted_at);
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}-${p(t.getUTCHours())}${p(t.getUTCMinutes())}`;
  return `bio_${slug}_${stamp}.json`;
}

export function fullName(d: BioIntakeData): string {
  return `${d.basics.first_name} ${d.basics.last_name}`.trim();
}

/* ==========================================================================
   sanitize() — the server's first look at an untrusted body. Coerces every
   field into the expected type with hard length and count caps, so nothing
   downstream handles an unexpected shape. Real limits are validate()'s job;
   these caps only bound the work.
   ========================================================================== */

const CAP = 2000;
const LIST = 12;

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const str = (v: unknown, cap = CAP): string => (typeof v === "string" ? v.slice(0, cap) : "");
const bool = (v: unknown): boolean => v === true;
const int = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : null);
const strs = (v: unknown, cap = 120): string[] => (Array.isArray(v) ? v.slice(0, LIST).map((x) => str(x, cap)).filter(Boolean) : []);
const objs = (v: unknown): Obj[] => (Array.isArray(v) ? v.slice(0, LIST).map(obj) : []);

export function sanitize(input: unknown): BioIntakeData {
  const d = emptyData();
  const i = obj(input);

  const b = obj(i.basics);
  d.basics = {
    roster_match: str(b.roster_match, 40),
    is_new_hire: bool(b.is_new_hire),
    first_name: str(b.first_name, 200),
    last_name: str(b.last_name, 200),
    preferred_name: str(b.preferred_name, 200),
    pronoun: str(b.pronoun, 20) as BioIntakeData["basics"]["pronoun"],
    email: str(b.email, 254),
    title: str(b.title, 200),
    title_custom: str(b.title_custom, 200),
    title_specialization: str(b.title_specialization, 200),
    year_joined_fairlead: int(b.year_joined_fairlead),
    career_start_year: int(b.career_start_year),
    location: str(b.location, 200),
    linkedin_url: str(b.linkedin_url, 300),
  };

  const r = obj(i.fairlead_role);
  d.fairlead_role = {
    service_lines: strs(r.service_lines),
    service_lines_custom: strs(r.service_lines_custom),
    supporting_areas: strs(r.supporting_areas),
    supporting_areas_custom: strs(r.supporting_areas_custom),
    leadership_mode: (str(r.leadership_mode, 20) || null) as BioIntakeData["fairlead_role"]["leadership_mode"],
    seats: strs(r.seats),
    seats_custom: strs(r.seats_custom),
    focus_areas: strs(r.focus_areas),
    focus_areas_custom: strs(r.focus_areas_custom),
    sectors: strs(r.sectors),
    sectors_custom: strs(r.sectors_custom),
    client_types: strs(r.client_types),
    client_types_custom: strs(r.client_types_custom),
    value_statement: str(r.value_statement),
  };

  d.recent_engagements = objs(i.recent_engagements).map((e) => ({
    company: str(e.company, 200),
    can_name_publicly: str(e.can_name_publicly, 20) as BioIntakeData["recent_engagements"][number]["can_name_publicly"],
    descriptor: str(e.descriptor),
    engagement_status: str(e.engagement_status, 20) as BioIntakeData["recent_engagements"][number]["engagement_status"],
    engagement_type: str(e.engagement_type, 200),
    engagement_type_custom: str(e.engagement_type_custom, 200),
    your_role: str(e.your_role, 200),
    your_role_custom: str(e.your_role_custom, 200),
    what_you_did: str(e.what_you_did),
    result: str(e.result),
    result_confidential: bool(e.result_confidential),
    year: int(e.year),
    sponsor: str(e.sponsor, 200),
    sector: str(e.sector, 200),
    sector_custom: str(e.sector_custom, 200),
  }));

  d.prior_roles = objs(i.prior_roles).map((p) => ({
    employer: str(p.employer, 200),
    employer_is_new_name: false,
    employer_descriptor: str(p.employer_descriptor),
    title: str(p.title, 200),
    start_year: int(p.start_year),
    end_year: int(p.end_year),
    current: bool(p.current),
    concurrent_role_type: (str(p.concurrent_role_type, 30) || null) as BioIntakeData["prior_roles"][number]["concurrent_role_type"],
    highlight: str(p.highlight),
  }));
  d.earlier_career = str(i.earlier_career);

  d.education = objs(i.education).map((g) => ({
    degree: str(g.degree, 200),
    degree_custom: str(g.degree_custom, 200),
    field: str(g.field, 200),
    concentration: str(g.concentration, 200),
    institution: str(g.institution, 200),
    institution_is_new_name: false,
    honors: str(g.honors, 200),
    honors_custom: str(g.honors_custom, 200),
    in_progress: bool(g.in_progress),
  }));

  d.credentials = objs(i.credentials).map((c) => ({
    designation: str(c.designation, 200),
    designation_custom: str(c.designation_custom, 200),
    status: str(c.status, 20) as BioIntakeData["credentials"][number]["status"],
    jurisdiction: str(c.jurisdiction, 200),
  }));

  const reg = obj(i.registration);
  d.registration = {
    is_registered_rep: bool(reg.is_registered_rep),
    broker_dealer_name: str(reg.broker_dealer_name, 200),
    regulatory_disclosure: str(reg.regulatory_disclosure, LIMITS.disclosure_chars * 2),
  };
  d.other_licenses = strs(i.other_licenses, 200);

  const x = obj(i.extras);
  const firm = obj(x.outside_firm);
  d.extras = {
    board_and_affiliations: objs(x.board_and_affiliations).map((a) => ({
      role: str(a.role, 200),
      role_custom: str(a.role_custom, 200),
      organization: str(a.organization, 200),
      type: str(a.type, 200),
      type_custom: str(a.type_custom, 200),
    })),
    has_outside_firm: bool(x.has_outside_firm),
    outside_firm: { name: str(firm.name, 200), descriptor: str(firm.descriptor) },
    languages: strs(x.languages),
    languages_custom: strs(x.languages_custom),
    include_personal_line: bool(x.include_personal_line),
    personal_line: str(x.personal_line),
    headshot_choice: str(x.headshot_choice, 20) as BioIntakeData["extras"]["headshot_choice"],
    do_not_mention: str(x.do_not_mention),
    notes_to_matt: str(x.notes_to_matt, 4000),
  };

  d.open_questions = objs(i.open_questions)
    .map((q) => ({ field: str(q.field, 60), note: str(q.note, 1000) }))
    .filter((q): q is BioIntakeData["open_questions"][number] => isOpenQuestionField(q.field));

  return d;
}
