/**
 * The consistency layer (PRD §6.10). The form runs these on blur so people
 * see the corrected value; /api/bio runs normalizeData() again so a
 * bypassed client gets the same result. Plus the cross-field checks that
 * become review-screen warnings.
 */

import {
  AFFILIATION_ROLES,
  AFFILIATION_TYPES,
  CLIENT_TYPES,
  DEGREES,
  DESIGNATIONS,
  EARLIEST_YEAR,
  EMPLOYERS,
  ENGAGEMENT_ROLES,
  FIXED_SPELLINGS,
  FOCUS_AREAS,
  FOCUS_SYNONYMS,
  HONORS,
  INSTITUTIONS,
  LANGUAGES,
  OTHER,
  SEATS,
  SECTOR_SYNONYMS,
  SECTORS,
  SERVICE_LINES,
  SUPPORTING_AREAS,
  TITLES,
} from "./options";
import type { BioIntakeData, RosterMember } from "./schema";

/* ==========================================================================
   Text
   ========================================================================== */

/** Straight quotes → curly. An opening quote follows whitespace or an opening bracket. */
export function curlyQuotes(s: string): string {
  return s
    .replace(/(^|[\s([{—–-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{—–-])'/g, "$1‘")
    .replace(/'/g, "’");
}

const ABBREVIATION_END = /(?:\b(?:Inc|Co|Corp|Ltd|Jr|Sr|St|Esq|Bros|No|vs)\.|\b(?:[A-Za-z]\.){2,})$/;

export function countWordsOf(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

/**
 * Trim, collapse spaces, curly quotes. `sentence` fields also lose a single
 * trailing period when under 15 words (not "Inc." or "U.S.").
 */
export function cleanText(s: string, opts: { sentence?: boolean } = {}): string {
  let out = curlyQuotes(s.replace(/\s+/g, " ").trim());
  if (opts.sentence && countWordsOf(out) < 15 && /[^.]\.$/.test(out) && !ABBREVIATION_END.test(out)) {
    out = out.slice(0, -1);
  }
  return out;
}

/** Multi-line text: trim each line, keep paragraph breaks, curly quotes. */
export function cleanBlock(s: string): string {
  return curlyQuotes(
    s
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((l) => l.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

const MINOR_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);

/** Capitalize each word's first letter (minor words stay lowercase unless first). Leaves the rest alone. */
export function titleCaseWords(s: string): string {
  return s
    .split(" ")
    .map((w, i) => (i > 0 && MINOR_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * Names: Title Case only when typed all-lowercase or ALL-CAPS. Mixed case is
 * left alone (McDonald, de la Cruz).
 */
export function normName(s: string): string {
  const t = cleanText(s);
  const letters = t.replace(/[^\p{L}]/gu, "");
  if (!letters) return t;
  if (letters !== letters.toLowerCase() && letters !== letters.toUpperCase()) return t;
  return t
    .toLowerCase()
    .replace(/(^|[\s\-’'])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Title Case for short label-like fields (specialization), when typed all one case. */
export function normLabel(s: string): string {
  const t = cleanText(s, { sentence: true });
  const letters = t.replace(/[^\p{L}]/gu, "");
  if (letters && (letters === letters.toLowerCase() || letters === letters.toUpperCase())) {
    return titleCaseWords(t.toLowerCase());
  }
  return titleCaseWords(t);
}

export function normEmail(s: string): string {
  return s.trim().toLowerCase();
}

/** Any linkedin.com/in/{handle} form → https://www.linkedin.com/in/{handle}. Anything else is returned trimmed. */
export function normLinkedIn(s: string): string {
  const t = s.trim();
  if (!t) return "";
  const m = t.match(/^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([^/?#\s]+)/i);
  return m ? `https://www.linkedin.com/in/${m[1]}` : t;
}

/** Fixed spellings (P.E., CPA, B.S., MBA, Ph.D., …) for credentials, degrees and Other values. */
export function fixedSpelling(s: string): string {
  const t = cleanText(s);
  return FIXED_SPELLINGS[t.toLowerCase()] ?? t;
}

/** A typed value that is really a standard option (any case, or a fixed spelling) → that option. */
export function matchOption(s: string, options: readonly string[]): string | null {
  const t = fixedSpelling(s).toLowerCase();
  return options.find((o) => o.toLowerCase() === t) ?? null;
}

/**
 * "Did you mean…?" — an exact option match, a fixed spelling, or a synonym.
 * Only suggests options that exist in `options`.
 */
export function suggestOption(s: string, options: readonly string[]): string | null {
  const t = s.trim().toLowerCase();
  if (t.length < 2) return null;
  const exact = matchOption(s, options);
  if (exact) return exact;
  const syn = FOCUS_SYNONYMS[t] ?? SECTOR_SYNONYMS[t];
  if (syn && options.includes(syn)) return syn;
  return null;
}

export function canonicalEmployer(s: string): string {
  const t = cleanText(s);
  return EMPLOYERS.find((e) => e.name.toLowerCase() === t.toLowerCase())?.name ?? t;
}
export function employerDescriptor(name: string): string | undefined {
  return EMPLOYERS.find((e) => e.name === name)?.descriptor;
}
export function canonicalInstitution(s: string): string {
  const t = cleanText(s);
  return INSTITUTIONS.find((i) => i.toLowerCase() === t.toLowerCase()) ?? t;
}
export function isNewEmployer(s: string): boolean {
  return !EMPLOYERS.some((e) => e.name === s);
}
export function isNewInstitution(s: string): boolean {
  return !INSTITUTIONS.includes(s);
}

/* ==========================================================================
   Whole-submission normalization
   ========================================================================== */

/** Resolve a multi pick: typed values that match an option become the option. */
function normMulti(values: string[], options: readonly string[]): [string[], string[]] {
  const outValues: string[] = [];
  const outCustom: string[] = [];
  for (const v of values) {
    if (options.includes(v) || v === OTHER) {
      if (!outValues.includes(v)) outValues.push(v);
      continue;
    }
    const fixed = fixedSpelling(v);
    const std = matchOption(fixed, options);
    const val = std ?? fixed;
    if (!val || outValues.includes(val)) continue;
    outValues.push(val);
    if (!std) outCustom.push(val); // a non-option value is always a typed one
  }
  return [outValues, outCustom];
}

/** Resolve a single pick the same way. */
function normSingle(value: string, options: readonly string[]): [string, string] {
  if (!value || value === OTHER || options.includes(value)) return [value, ""];
  const fixed = fixedSpelling(value);
  const std = matchOption(fixed, options);
  return std ? [std, ""] : [fixed, fixed];
}

/**
 * Applies every §6.10 rule to a whole submission. Value-level only: entries
 * are never added, removed or reordered here (error paths stay stable).
 * `notes` are changes the person should hear about — they join the warnings.
 */
export function normalizeData(input: BioIntakeData): { data: BioIntakeData; notes: string[] } {
  const d: BioIntakeData = structuredClone(input);
  const notes: string[] = [];
  const S = { sentence: true };

  const b = d.basics;
  b.first_name = normName(b.first_name);
  b.last_name = normName(b.last_name);
  b.preferred_name = normName(b.preferred_name);
  b.email = normEmail(b.email);
  [b.title, b.title_custom] = normSingle(b.title, TITLES);
  b.title_specialization = b.title_specialization ? normLabel(b.title_specialization) : "";
  b.location = cleanText(b.location, S);
  b.linkedin_url = normLinkedIn(b.linkedin_url);

  const r = d.fairlead_role;
  [r.service_lines, r.service_lines_custom] = normMulti(r.service_lines, SERVICE_LINES);
  [r.supporting_areas, r.supporting_areas_custom] = normMulti(r.supporting_areas, SUPPORTING_AREAS);
  [r.seats, r.seats_custom] = normMulti(r.seats, SEATS);
  [r.focus_areas, r.focus_areas_custom] = normMulti(r.focus_areas, FOCUS_AREAS);
  [r.sectors, r.sectors_custom] = normMulti(r.sectors, SECTORS);
  [r.client_types, r.client_types_custom] = normMulti(r.client_types, CLIENT_TYPES);
  r.value_statement = cleanText(r.value_statement, S);

  // A seat chosen again as a focus area (e.g. "CFO" in both): the focus area goes.
  const seatsLower = new Set(r.seats.map((s) => s.toLowerCase()));
  const dupes = r.focus_areas.filter((f) => seatsLower.has(f.toLowerCase()));
  if (dupes.length) {
    r.focus_areas = r.focus_areas.filter((f) => !dupes.includes(f));
    r.focus_areas_custom = r.focus_areas_custom.filter((f) => !dupes.includes(f));
    notes.push(`Dropped from focus areas because it’s already a seat: ${dupes.join(", ")}.`);
  }

  for (const e of d.recent_engagements) {
    e.company = cleanText(e.company);
    e.descriptor = cleanText(e.descriptor, S);
    [e.engagement_type, e.engagement_type_custom] = normSingle(e.engagement_type, SERVICE_LINES);
    [e.your_role, e.your_role_custom] = normSingle(e.your_role, ENGAGEMENT_ROLES);
    e.what_you_did = cleanText(e.what_you_did, S);
    e.result = cleanText(e.result, S);
    e.sponsor = cleanText(e.sponsor);
    [e.sector, e.sector_custom] = normSingle(e.sector, SECTORS);
  }

  for (const p of d.prior_roles) {
    p.employer = canonicalEmployer(p.employer);
    p.employer_is_new_name = !!p.employer && isNewEmployer(p.employer);
    p.employer_descriptor = cleanText(p.employer_descriptor, S);
    p.title = cleanText(p.title, S);
    p.highlight = cleanText(p.highlight, S);
  }
  d.earlier_career = cleanText(d.earlier_career, S);

  for (const g of d.education) {
    [g.degree, g.degree_custom] = normSingle(g.degree, DEGREES);
    g.field = cleanText(g.field, S);
    g.concentration = cleanText(g.concentration, S);
    g.institution = canonicalInstitution(g.institution);
    g.institution_is_new_name = !!g.institution && isNewInstitution(g.institution);
    [g.honors, g.honors_custom] = normSingle(g.honors, HONORS);
  }
  for (const c of d.credentials) {
    [c.designation, c.designation_custom] = normSingle(c.designation, DESIGNATIONS);
    c.jurisdiction = cleanText(c.jurisdiction, S);
  }
  d.registration.broker_dealer_name = cleanText(d.registration.broker_dealer_name);
  // Reproduced word for word — only the outer whitespace goes.
  d.registration.regulatory_disclosure = d.registration.regulatory_disclosure.trim();
  d.other_licenses = d.other_licenses.map((l) => cleanText(l, S)).filter(Boolean);

  const x = d.extras;
  for (const a of x.board_and_affiliations) {
    [a.role, a.role_custom] = normSingle(a.role, AFFILIATION_ROLES);
    a.organization = cleanText(a.organization);
    [a.type, a.type_custom] = normSingle(a.type, AFFILIATION_TYPES);
  }
  x.outside_firm = { name: cleanText(x.outside_firm.name), descriptor: cleanText(x.outside_firm.descriptor, S) };
  [x.languages, x.languages_custom] = normMulti(x.languages, LANGUAGES);
  x.personal_line = cleanText(x.personal_line, S);
  x.do_not_mention = cleanBlock(x.do_not_mention);
  x.notes_to_matt = cleanBlock(x.notes_to_matt);

  return { data: d, notes };
}

/* ==========================================================================
   Cross-field checks (§6.10) — warnings, never blockers.
   ========================================================================== */

/** "CPA, CGMA" / "CPA (inactive)" → the active designations, in fixed spelling. */
export function activeRosterCredentials(credentials: string | null): string[] {
  if (!credentials) return [];
  return credentials
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c && !/\(/.test(c))
    .map((c) => fixedSpelling(c))
    .filter((c) => !["MBA", "J.D.", "Ph.D.", "Esq."].includes(c));
}

export function crossChecks(d: BioIntakeData, roster: RosterMember | null, now: Date = new Date()): string[] {
  const out: string[] = [];

  d.recent_engagements.forEach((e, i) => {
    const name = e.company.trim();
    if (!name || e.can_name_publicly === "yes" || name.length < 3) return;
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    for (const [label, v] of [
      ["what you did", e.what_you_did],
      ["result", e.result],
      ["description", e.descriptor],
    ] as const) {
      if (re.test(v)) out.push(`Engagement ${i + 1}: “${label}” mentions ${name}, which isn’t cleared to name — move it to the descriptor?`);
    }
  });

  if (roster) {
    const websiteTitle = roster.title.split(",")[0].trim();
    if (websiteTitle && d.basics.title && websiteTitle !== d.basics.title)
      out.push(`Title differs from website (“${roster.title}”) — Matt to confirm.`);

    const site = activeRosterCredentials(roster.credentials);
    const here = d.credentials.filter((c) => c.status === "active").map((c) => c.designation);
    for (const c of here) if (!site.includes(c)) out.push(`${c} is active here but not shown on the website.`);
    for (const c of site) if (!here.includes(c)) out.push(`${c} is on the website but not listed as active here.`);
  }

  const start = d.basics.career_start_year;
  if (start && start >= EARLIEST_YEAR) {
    const years = now.getUTCFullYear() - start;
    if (years >= 40 || years < 2) out.push(`Career start year gives ${years} years of experience — is this right?`);
  }

  const terms = d.extras.do_not_mention
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
  if (terms.length) {
    const rest = JSON.stringify({ ...d, extras: { ...d.extras, do_not_mention: "", notes_to_matt: "" }, warnings: [] }).toLowerCase();
    for (const t of terms) if (rest.includes(t.toLowerCase())) out.push(`“${t}” is on the do-not-mention list but appears elsewhere in the submission.`);
  }

  return out;
}
