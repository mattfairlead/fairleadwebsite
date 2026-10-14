/**
 * /bio intake — the data shape (PRD §7 `data`), the conditional logic
 * (§6.9) as data, and validate(). The form and /api/bio share all of it:
 * the client validates as people type, the server validates again and
 * never trusts the client's verdict.
 *
 * Relative imports only (no "@/"), so `npm test` can compile lib/bio on its own.
 */

import {
  CAN_NAME,
  CLIENT_TYPES,
  CONCURRENT_ROLE_TYPES,
  CREDENTIAL_STATUS,
  DEGREES,
  DESIGNATIONS,
  EARLIEST_YEAR,
  ENGAGEMENT_ROLES,
  ENGAGEMENT_STATUS,
  AFFILIATION_ROLES,
  AFFILIATION_TYPES,
  FAIRLEAD_FOUNDED,
  FOCUS_AREAS,
  HEADSHOT_CHOICES,
  HONORS,
  INTERIM_LEADERSHIP,
  LANGUAGES,
  LEADERSHIP_MODES,
  LICENSES,
  LIMITS,
  OTHER,
  PRONOUNS,
  SEATS,
  SECTORS,
  SERVICE_LINES,
  SPECIALIZED_TITLES,
  SUPPORTING_AREAS,
  SUPPORTING_SERVICES,
  TITLES,
} from "./options";
import { crossChecks, isNewEmployer, isNewInstitution } from "./normalize";

export const SCHEMA_ID = "fairlead.bio-intake/v1";

/* ==========================================================================
   Types
   ========================================================================== */

export type Pronoun = (typeof PRONOUNS)[number]["value"];
export type CanName = (typeof CAN_NAME)[number]["value"];
export type EngagementStatus = (typeof ENGAGEMENT_STATUS)[number]["value"];
export type LeadershipMode = (typeof LEADERSHIP_MODES)[number]["value"];
export type ConcurrentRoleType = (typeof CONCURRENT_ROLE_TYPES)[number]["value"];
export type CredentialStatus = (typeof CREDENTIAL_STATUS)[number]["value"];
export type HeadshotChoice = (typeof HEADSHOT_CHOICES)[number]["value"];

/** One website-visible roster row, as the server hands it to the form (§5.2). */
export interface RosterMember {
  id: string;
  name: string;
  title: string;
  credentials: string | null;
  specialty: string;
  bio_md: string;
  has_photo: boolean;
}

export interface Basics {
  roster_match: string; // hub id, "not_listed", or "" before a choice
  is_new_hire: boolean;
  first_name: string;
  last_name: string;
  preferred_name: string;
  pronoun: Pronoun | "";
  email: string;
  title: string;
  title_custom: string;
  title_specialization: string;
  year_joined_fairlead: number | null;
  career_start_year: number | null;
  location: string;
  linkedin_url: string;
}

export interface FairleadRole {
  service_lines: string[];
  service_lines_custom: string[];
  supporting_areas: string[];
  supporting_areas_custom: string[];
  leadership_mode: LeadershipMode | null;
  seats: string[];
  seats_custom: string[];
  focus_areas: string[];
  focus_areas_custom: string[];
  sectors: string[];
  sectors_custom: string[];
  client_types: string[];
  client_types_custom: string[];
  value_statement: string;
}

export interface Engagement {
  company: string;
  can_name_publicly: CanName | "";
  descriptor: string;
  engagement_status: EngagementStatus | "";
  engagement_type: string;
  engagement_type_custom: string;
  your_role: string;
  your_role_custom: string;
  what_you_did: string;
  result: string;
  result_confidential: boolean;
  year: number | null;
  sponsor: string;
  sector: string;
  sector_custom: string;
}

export interface PriorRole {
  employer: string;
  employer_is_new_name: boolean;
  employer_descriptor: string;
  title: string;
  start_year: number | null;
  end_year: number | null;
  current: boolean;
  concurrent_role_type: ConcurrentRoleType | null;
  highlight: string;
}

export interface Degree {
  degree: string;
  degree_custom: string;
  field: string;
  concentration: string;
  institution: string;
  institution_is_new_name: boolean;
  honors: string;
  honors_custom: string;
  in_progress: boolean;
}

export interface Credential {
  designation: string;
  designation_custom: string;
  status: CredentialStatus | "";
  jurisdiction: string;
}

export interface Affiliation {
  role: string;
  role_custom: string;
  organization: string;
  type: string;
  type_custom: string;
}

export interface BioIntakeData {
  basics: Basics;
  fairlead_role: FairleadRole;
  recent_engagements: Engagement[];
  prior_roles: PriorRole[];
  earlier_career: string;
  education: Degree[];
  credentials: Credential[];
  registration: { is_registered_rep: boolean; broker_dealer_name: string; regulatory_disclosure: string };
  other_licenses: string[];
  extras: {
    board_and_affiliations: Affiliation[];
    has_outside_firm: boolean;
    outside_firm: { name: string; descriptor: string };
    languages: string[];
    languages_custom: string[];
    include_personal_line: boolean;
    personal_line: string;
    headshot_choice: HeadshotChoice | "";
    do_not_mention: string;
    notes_to_matt: string;
  };
  warnings: string[];
}

export function emptyEngagement(): Engagement {
  return {
    company: "",
    can_name_publicly: "not_sure",
    descriptor: "",
    engagement_status: "",
    engagement_type: "",
    engagement_type_custom: "",
    your_role: "",
    your_role_custom: "",
    what_you_did: "",
    result: "",
    result_confidential: false,
    year: null,
    sponsor: "",
    sector: "",
    sector_custom: "",
  };
}

export function emptyData(): BioIntakeData {
  return {
    basics: {
      roster_match: "",
      is_new_hire: false,
      first_name: "",
      last_name: "",
      preferred_name: "",
      pronoun: "",
      email: "",
      title: "",
      title_custom: "",
      title_specialization: "",
      year_joined_fairlead: null,
      career_start_year: null,
      location: "",
      linkedin_url: "",
    },
    fairlead_role: {
      service_lines: [],
      service_lines_custom: [],
      supporting_areas: [],
      supporting_areas_custom: [],
      leadership_mode: null,
      seats: [],
      seats_custom: [],
      focus_areas: [],
      focus_areas_custom: [],
      sectors: [],
      sectors_custom: [],
      client_types: [],
      client_types_custom: [],
      value_statement: "",
    },
    recent_engagements: [emptyEngagement()],
    prior_roles: [],
    earlier_career: "",
    education: [],
    credentials: [],
    registration: { is_registered_rep: false, broker_dealer_name: "", regulatory_disclosure: "" },
    other_licenses: [],
    extras: {
      board_and_affiliations: [],
      has_outside_firm: false,
      outside_firm: { name: "", descriptor: "" },
      languages: [],
      languages_custom: [],
      include_personal_line: false,
      personal_line: "",
      headshot_choice: "",
      do_not_mention: "",
      notes_to_matt: "",
    },
    warnings: [],
  };
}

/* ==========================================================================
   §6.9 Conditional logic. One predicate per row; the form shows a field
   when its predicate holds, prune() blanks it when it doesn't, and
   validate() only checks what is shown. A hidden field is never validated
   and never sent.
   ========================================================================== */

export const SHOW = {
  isNewHire: (b: Basics) => b.roster_match === "not_listed",
  titleSpecialization: (b: Basics) => SPECIALIZED_TITLES.includes(b.title),
  supportingAreas: (r: FairleadRole) => r.service_lines.includes(SUPPORTING_SERVICES),
  leadershipMode: (r: FairleadRole) => r.service_lines.includes(INTERIM_LEADERSHIP),
  sponsor: (e: Engagement) => e.can_name_publicly === "yes",
  result: (e: Engagement) => !e.result_confidential,
  endYear: (r: PriorRole) => !r.current,
  concurrentRoleType: (r: PriorRole) => r.current,
  jurisdiction: (c: Credential) => LICENSES.includes(c.designation) && c.status === "active",
  honors: (d: Degree) => !d.in_progress,
  registration: (d: Pick<BioIntakeData, "registration">) => d.registration.is_registered_rep,
  outsideFirm: (d: { extras: Pick<BioIntakeData["extras"], "has_outside_firm"> }) => d.extras.has_outside_firm,
  personalLine: (d: { extras: Pick<BioIntakeData["extras"], "include_personal_line"> }) => d.extras.include_personal_line,
} as const;

/**
 * A current role at the person's own firm, a board seat or a teaching post
 * isn't a prior role: finalize() moves it to outside_firm or
 * board_and_affiliations (§6.4).
 */
export function movesOut(r: PriorRole): boolean {
  return r.current && (r.concurrent_role_type === "own_firm" || r.concurrent_role_type === "board" || r.concurrent_role_type === "teaching");
}

/** The §6.9 table, as data — what each trigger reveals and whether it is then required. */
export const CONDITIONS: { trigger: string; shows: string; required: boolean | "soft" }[] = [
  { trigger: "Any pick has Other… selected", shows: "{field}_custom", required: true },
  { trigger: "roster_match = not_listed", shows: "is_new_hire", required: true },
  { trigger: "title = Other…", shows: "title_custom", required: true },
  { trigger: "title ∈ specialized titles", shows: "title_specialization", required: "soft" },
  { trigger: "service_lines ∋ Supporting Services", shows: "supporting_areas", required: true },
  { trigger: "service_lines ∋ Interim / Fractional Leadership", shows: "leadership_mode; seats soft", required: false },
  { trigger: "engagement can_name_publicly = yes", shows: "company required; sponsor", required: true },
  { trigger: "engagement result_confidential", shows: "result hidden", required: false },
  { trigger: "prior role current", shows: "concurrent_role_type; end_year hidden", required: true },
  { trigger: "credential is an active license", shows: "jurisdiction", required: true },
  { trigger: "degree in_progress", shows: "honors hidden", required: false },
  { trigger: "is_registered_rep = yes", shows: "broker_dealer_name, regulatory_disclosure", required: true },
  { trigger: "has_outside_firm = yes", shows: "outside_firm", required: true },
  { trigger: "include_personal_line = yes", shows: "personal_line", required: true },
  { trigger: "headshot_choice = upload", shows: "headshot uploader", required: true },
  { trigger: "is_new_hire = yes", shows: "prior_roles minimum 0 (soft warning)", required: false },
];

/** Blank every field whose §6.9 trigger doesn't hold. Returns a new object. */
export function prune(input: BioIntakeData): BioIntakeData {
  const d: BioIntakeData = structuredClone(input);
  const b = d.basics;
  if (!SHOW.isNewHire(b)) b.is_new_hire = false;
  if (TITLES.includes(b.title)) b.title_custom = "";
  if (!SHOW.titleSpecialization(b)) b.title_specialization = "";

  const r = d.fairlead_role;
  if (!SHOW.supportingAreas(r)) {
    r.supporting_areas = [];
    r.supporting_areas_custom = [];
  }
  if (!SHOW.leadershipMode(r)) r.leadership_mode = null;

  for (const e of d.recent_engagements) {
    if (!SHOW.sponsor(e)) e.sponsor = "";
    if (!SHOW.result(e)) e.result = "";
  }
  for (const p of d.prior_roles) {
    if (!SHOW.endYear(p)) p.end_year = null;
    if (!SHOW.concurrentRoleType(p)) p.concurrent_role_type = null;
  }
  for (const c of d.credentials) if (!SHOW.jurisdiction(c)) c.jurisdiction = "";
  for (const g of d.education) {
    if (!SHOW.honors(g)) {
      g.honors = "";
      g.honors_custom = "";
    }
  }
  if (!SHOW.registration(d)) d.registration = { is_registered_rep: false, broker_dealer_name: "", regulatory_disclosure: "" };
  if (!SHOW.outsideFirm(d)) d.extras.outside_firm = { name: "", descriptor: "" };
  if (!SHOW.personalLine(d)) d.extras.personal_line = "";
  // English alone is never mentioned (§6.6)
  if (d.extras.languages.every((l) => l === "English")) {
    d.extras.languages = [];
    d.extras.languages_custom = [];
  }
  return d;
}

/* ==========================================================================
   validate()
   ========================================================================== */

export type FieldErrors = Record<string, string>;

export interface ValidateContext {
  roster?: RosterMember | null;
  headshotAttached?: boolean;
  now?: Date;
}

export function countWords(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const LINKEDIN = /^https:\/\/www\.linkedin\.com\/in\/[^/?#\s]+$/;

/**
 * Checks a resolved data object. `errors` block submission (the §6.7 hard
 * requirements plus anything §6.9 marks required when shown); `warnings`
 * never do. Call prune() first — this assumes hidden fields are blank.
 */
export function validate(d: BioIntakeData, ctx: ValidateContext = {}): { errors: FieldErrors; warnings: string[] } {
  const errors: FieldErrors = {};
  const warnings: string[] = [];
  const year = (ctx.now ?? new Date()).getUTCFullYear();
  const err = (path: string, msg: string) => {
    if (!errors[path]) errors[path] = msg;
  };

  const text = (path: string, v: string, o: { required?: boolean; chars?: number; words?: number; label: string }) => {
    if (o.required && !v.trim()) return err(path, `${o.label} is required.`);
    if (o.chars && v.length > o.chars) err(path, `${o.label}: ${o.chars} characters at most.`);
    if (o.words && countWords(v) > o.words) err(path, `${o.label}: ${o.words} words at most.`);
  };

  /** A single pick: a standard value, or the typed Other value mirrored in `custom`. */
  const single = (path: string, v: string, custom: string, options: readonly string[], o: { required?: boolean; open?: boolean; label: string }) => {
    if (!v) {
      if (o.required) err(path, `${o.label} is required.`);
      return;
    }
    if (v === OTHER && o.open) return err(`${path}_custom`, "Other — please specify.");
    if (options.includes(v)) return;
    if (!o.open) return err(path, `${o.label}: choose from the list.`);
    if (v !== custom) return err(path, `${o.label}: choose from the list or Other….`);
    if (v.length > LIMITS.other) err(`${path}_custom`, `${o.label}: ${LIMITS.other} characters at most.`);
  };

  /** A multi pick: standard values plus typed ones, each typed one listed in `custom`. */
  const multi = (path: string, v: string[], custom: string[], options: readonly string[], o: { min?: number; max?: number; label: string }) => {
    if (o.min && v.length < o.min) err(path, o.min === 1 ? `Pick at least one ${o.label}.` : `Pick at least ${o.min} ${o.label}.`);
    if (o.max && v.length > o.max) err(path, `Pick up to ${o.max} ${o.label}.`);
    if (new Set(v).size !== v.length) err(path, `${o.label}: duplicate value.`);
    for (const x of v) {
      if (x === OTHER) {
        err(`${path}_custom`, "Other — please specify.");
        continue;
      }
      if (options.includes(x)) continue;
      if (!custom.includes(x)) err(path, `${o.label}: “${x}” isn’t on the list.`);
      if (!x.trim() || x.length > LIMITS.other) err(`${path}_custom`, `${o.label}: each typed value up to ${LIMITS.other} characters.`);
    }
    if (custom.some((c) => !v.includes(c))) err(`${path}_custom`, `${o.label}: typed value missing from the selection.`);
  };

  const yearIn = (path: string, v: number | null, min: number, label: string, required: boolean) => {
    if (v == null) {
      if (required) err(path, `${label} is required.`);
      return false;
    }
    if (!Number.isInteger(v) || v < min || v > year) {
      err(path, `${label}: a year between ${min} and ${year}.`);
      return false;
    }
    return true;
  };

  /* ---- Basics ---- */
  const b = d.basics;
  if (!b.roster_match) err("basics.roster_match", "Choose your name, or “I’m not listed”.");
  text("basics.first_name", b.first_name, { required: true, chars: LIMITS.name, label: "First name" });
  text("basics.last_name", b.last_name, { required: true, chars: LIMITS.name, label: "Last name" });
  text("basics.preferred_name", b.preferred_name, { chars: LIMITS.name, label: "Preferred name" });
  if (!PRONOUNS.some((p) => p.value === b.pronoun)) err("basics.pronoun", "Choose how the bio should refer to you.");
  if (!b.email.trim()) err("basics.email", "Email is required.");
  else if (!EMAIL.test(b.email)) err("basics.email", "Enter a valid email address.");
  else if (!b.email.endsWith("@fairleadadvisors.com")) warnings.push("Email isn’t a fairleadadvisors.com address.");
  if (!b.title) err("basics.title", "Title is required.");
  else if (!TITLES.includes(b.title)) {
    if (!b.title_custom || b.title !== b.title_custom) err("basics.title_custom", "Other — please specify.");
    else if (b.title_custom.length > LIMITS.title_custom) err("basics.title_custom", `Title: ${LIMITS.title_custom} characters at most.`);
  }
  text("basics.title_specialization", b.title_specialization, { chars: LIMITS.title_specialization, label: "Specialization" });
  if (b.title === "Strategic Partner" && !b.title_specialization) warnings.push("No specialization after “Strategic Partner”.");
  const joinedOk = yearIn("basics.year_joined_fairlead", b.year_joined_fairlead, FAIRLEAD_FOUNDED, "Year joined Fairlead", true);
  const startOk = yearIn("basics.career_start_year", b.career_start_year, EARLIEST_YEAR, "Career start year", true);
  if (joinedOk && startOk && b.career_start_year! > b.year_joined_fairlead!)
    err("basics.career_start_year", "Career start can’t be after the year you joined Fairlead.");
  text("basics.location", b.location, { chars: LIMITS.short, label: "Location" });
  if (b.linkedin_url && !LINKEDIN.test(b.linkedin_url)) err("basics.linkedin_url", "Use your linkedin.com/in/… profile link.");

  /* ---- Fairlead role ---- */
  const r = d.fairlead_role;
  multi("fairlead_role.service_lines", r.service_lines, r.service_lines_custom, SERVICE_LINES, { min: 1, max: LIMITS.service_lines, label: "service lines" });
  if (SHOW.supportingAreas(r))
    multi("fairlead_role.supporting_areas", r.supporting_areas, r.supporting_areas_custom, SUPPORTING_AREAS, { min: 1, max: LIMITS.supporting_areas, label: "supporting areas" });
  if (r.leadership_mode && !LEADERSHIP_MODES.some((m) => m.value === r.leadership_mode))
    err("fairlead_role.leadership_mode", "Choose interim, fractional or both.");
  multi("fairlead_role.seats", r.seats, r.seats_custom, SEATS, { max: LIMITS.seats, label: "seats" });
  if (SHOW.leadershipMode(r) && r.seats.length === 0) warnings.push("Interim / fractional leadership chosen, but no seats listed.");
  multi("fairlead_role.focus_areas", r.focus_areas, r.focus_areas_custom, FOCUS_AREAS, { min: LIMITS.focus_min, max: LIMITS.focus_max, label: "focus areas" });
  multi("fairlead_role.sectors", r.sectors, r.sectors_custom, SECTORS, { max: LIMITS.sectors, label: "sectors" });
  if (r.sectors.length === 0) warnings.push("No sectors chosen.");
  multi("fairlead_role.client_types", r.client_types, r.client_types_custom, CLIENT_TYPES, { label: "client types" });
  text("fairlead_role.value_statement", r.value_statement, { required: true, words: LIMITS.value_statement_words, label: "What you do for clients" });

  /* ---- Recent engagements ---- */
  const eng = d.recent_engagements;
  if (eng.length < 1) err("recent_engagements", "Add at least one recent Fairlead engagement.");
  if (eng.length > LIMITS.engagements) err("recent_engagements", `Up to ${LIMITS.engagements} engagements.`);
  eng.forEach((e, i) => {
    const p = `recent_engagements.${i}`;
    const n = `Engagement ${i + 1}`;
    if (!CAN_NAME.some((c) => c.value === e.can_name_publicly)) err(`${p}.can_name_publicly`, "Can we name the client publicly?");
    text(`${p}.company`, e.company, { required: e.can_name_publicly === "yes", chars: LIMITS.short, label: "Company" });
    text(`${p}.descriptor`, e.descriptor, { required: true, words: LIMITS.descriptor_words, label: "Anonymous description" });
    if (!ENGAGEMENT_STATUS.some((s) => s.value === e.engagement_status)) err(`${p}.engagement_status`, "Completed or ongoing?");
    single(`${p}.engagement_type`, e.engagement_type, e.engagement_type_custom, SERVICE_LINES, { open: true, label: "Engagement type" });
    single(`${p}.your_role`, e.your_role, e.your_role_custom, ENGAGEMENT_ROLES, { required: true, open: true, label: "Your role" });
    text(`${p}.what_you_did`, e.what_you_did, { required: true, words: LIMITS.what_you_did_words, label: "What you did" });
    text(`${p}.result`, e.result, { words: LIMITS.result_words, label: "Result" });
    yearIn(`${p}.year`, e.year, FAIRLEAD_FOUNDED, "Year", false);
    text(`${p}.sponsor`, e.sponsor, { chars: LIMITS.short, label: "Sponsor" });
    single(`${p}.sector`, e.sector, e.sector_custom, SECTORS, { open: true, label: "Sector" });
    if (!e.engagement_type) warnings.push(`${n} has no engagement type.`);
    if (e.year == null) warnings.push(`${n} has no year.`);
    if (!e.sector) warnings.push(`${n} has no sector.`);
  });
  const withoutResult = eng.filter((e) => !e.result_confidential && !e.result.trim());
  if (eng.length > 0 && eng.every((e) => !e.result.trim()))
    warnings.push("No engagement has a result. Bios with numbers read much stronger.");
  else eng.forEach((e, i) => withoutResult.includes(e) && warnings.push(`Engagement ${i + 1} has no result.`));

  /* ---- Career ---- */
  const minRoles = b.is_new_hire ? 0 : 1;
  const realRoles = d.prior_roles.filter((pr) => !movesOut(pr)).length;
  if (realRoles < minRoles) err("prior_roles", "Add at least one role before Fairlead (your own firm goes under Extras).");
  if (b.is_new_hire && realRoles === 0) warnings.push("No roles before Fairlead listed (new hire).");
  if (d.prior_roles.length > LIMITS.prior_roles) err("prior_roles", `Up to ${LIMITS.prior_roles} prior roles.`);
  d.prior_roles.forEach((pr, i) => {
    const p = `prior_roles.${i}`;
    text(`${p}.employer`, pr.employer, { required: true, chars: LIMITS.short, label: "Employer" });
    text(`${p}.employer_descriptor`, pr.employer_descriptor, { words: LIMITS.employer_descriptor_words, label: "Employer description" });
    text(`${p}.title`, pr.title, { required: true, chars: LIMITS.short, label: "Title" });
    const s = yearIn(`${p}.start_year`, pr.start_year, EARLIEST_YEAR, "Start year", false);
    const e = yearIn(`${p}.end_year`, pr.end_year, EARLIEST_YEAR, "End year", false);
    if (s && e && pr.end_year! < pr.start_year!) err(`${p}.end_year`, "End year can’t be before the start year.");
    if (pr.current && !CONCURRENT_ROLE_TYPES.some((c) => c.value === pr.concurrent_role_type))
      err(`${p}.concurrent_role_type`, "What kind of current role is this?");
    text(`${p}.highlight`, pr.highlight, { words: LIMITS.highlight_words, label: "Highlight" });
    const who = pr.employer || `Prior role ${i + 1}`;
    if (!pr.employer_descriptor) warnings.push(`${who}: no one-line description of the employer.`);
    if (!pr.highlight) warnings.push(`${who}: no highlight.`);
  });
  text("earlier_career", d.earlier_career, { words: LIMITS.earlier_career_words, label: "Earlier career" });

  /* ---- Education & credentials ---- */
  if (d.education.length === 0) warnings.push("No degrees listed.");
  if (d.education.length > LIMITS.education) err("education", `Up to ${LIMITS.education} degrees.`);
  d.education.forEach((g, i) => {
    const p = `education.${i}`;
    single(`${p}.degree`, g.degree, g.degree_custom, DEGREES, { required: true, open: true, label: "Degree" });
    text(`${p}.field`, g.field, { chars: LIMITS.short, label: "Field" });
    text(`${p}.concentration`, g.concentration, { chars: LIMITS.short, label: "Concentration" });
    text(`${p}.institution`, g.institution, { chars: LIMITS.short, label: "Institution" });
    single(`${p}.honors`, g.honors, g.honors_custom, HONORS, { open: true, label: "Honors" });
    if (!g.institution) warnings.push(`Degree ${i + 1} has no institution.`);
  });
  if (d.credentials.length > LIMITS.credentials) err("credentials", `Up to ${LIMITS.credentials} credentials.`);
  d.credentials.forEach((c, i) => {
    const p = `credentials.${i}`;
    single(`${p}.designation`, c.designation, c.designation_custom, DESIGNATIONS, { required: true, open: true, label: "Designation" });
    if (!CREDENTIAL_STATUS.some((s) => s.value === c.status)) err(`${p}.status`, "Choose a status.");
    if (SHOW.jurisdiction(c)) text(`${p}.jurisdiction`, c.jurisdiction, { required: true, chars: LIMITS.short, label: "Jurisdiction" });
  });
  if (SHOW.registration(d)) {
    text("registration.broker_dealer_name", d.registration.broker_dealer_name, { required: true, chars: LIMITS.short, label: "Broker-dealer" });
    text("registration.regulatory_disclosure", d.registration.regulatory_disclosure, {
      required: true,
      chars: LIMITS.disclosure_chars,
      label: "Regulatory disclosure",
    });
  }
  if (d.other_licenses.length > LIMITS.licenses) err("other_licenses", `Up to ${LIMITS.licenses} licenses.`);
  d.other_licenses.forEach((l, i) => text(`other_licenses.${i}`, l, { chars: LIMITS.short, label: "License" }));

  /* ---- Extras ---- */
  const x = d.extras;
  if (x.board_and_affiliations.length > LIMITS.affiliations) err("extras.board_and_affiliations", `Up to ${LIMITS.affiliations}.`);
  x.board_and_affiliations.forEach((a, i) => {
    const p = `extras.board_and_affiliations.${i}`;
    single(`${p}.role`, a.role, a.role_custom, AFFILIATION_ROLES, { required: true, open: true, label: "Role" });
    text(`${p}.organization`, a.organization, { required: true, chars: LIMITS.short, label: "Organization" });
    single(`${p}.type`, a.type, a.type_custom, AFFILIATION_TYPES, { open: true, label: "Type" });
  });
  if (SHOW.outsideFirm(d)) {
    text("extras.outside_firm.name", x.outside_firm.name, { required: true, chars: LIMITS.short, label: "Firm name" });
    text("extras.outside_firm.descriptor", x.outside_firm.descriptor, {
      required: true,
      words: LIMITS.employer_descriptor_words,
      label: "Firm description",
    });
  }
  multi("extras.languages", x.languages, x.languages_custom, LANGUAGES, { max: LIMITS.languages, label: "languages" });
  if (SHOW.personalLine(d)) text("extras.personal_line", x.personal_line, { required: true, words: LIMITS.personal_line_words, label: "Personal line" });
  if (x.headshot_choice && !HEADSHOT_CHOICES.some((h) => h.value === x.headshot_choice)) err("extras.headshot_choice", "Choose a headshot option.");
  if (x.headshot_choice === "upload" && ctx.headshotAttached === false) err("extras.headshot", "Choose a photo to upload.");
  if (x.headshot_choice === "keep" && ctx.roster && !ctx.roster.has_photo) warnings.push("Asked to keep a current photo, but the website has none.");
  if (x.headshot_choice === "need_new") warnings.push("Needs a new headshot taken.");
  text("extras.do_not_mention", x.do_not_mention, { chars: LIMITS.do_not_mention_chars, label: "Do not mention" });
  text("extras.notes_to_matt", x.notes_to_matt, { words: LIMITS.notes_words, label: "Notes to Matt" });

  /* ---- New canonical names, cross-field checks ---- */
  d.prior_roles.forEach((pr) => pr.employer && isNewEmployer(pr.employer) && warnings.push(`New employer name: “${pr.employer}”.`));
  d.education.forEach((g) => g.institution && isNewInstitution(g.institution) && warnings.push(`New institution name: “${g.institution}”.`));
  warnings.push(...crossChecks(d, ctx.roster ?? null, ctx.now));

  return { errors, warnings: [...new Set(warnings)] };
}

/** The section each error path belongs to — the form uses it for the progress rail. */
export function sectionOf(path: string): SectionId {
  if (path.startsWith("basics.")) return "basics";
  if (path.startsWith("fairlead_role.")) return "role";
  if (path.startsWith("recent_engagements")) return "work";
  if (path.startsWith("prior_roles") || path === "earlier_career") return "career";
  if (path.startsWith("education") || path.startsWith("credentials") || path.startsWith("registration") || path.startsWith("other_licenses"))
    return "education";
  return "extras";
}

export type SectionId = "basics" | "role" | "work" | "career" | "education" | "extras";

export const SECTIONS: { id: SectionId; title: string }[] = [
  { id: "basics", title: "Basics" },
  { id: "role", title: "Fairlead role" },
  { id: "work", title: "Recent Fairlead work" },
  { id: "career", title: "Career" },
  { id: "education", title: "Education & credentials" },
  { id: "extras", title: "Extras" },
];
