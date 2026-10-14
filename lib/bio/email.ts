/**
 * The plain-text email Matt gets for each /bio submission (PRD §5.5): a
 * readable summary he can check on a phone, the warnings, the custom
 * entries and new names, then the whole file between markers so it
 * survives a stripped attachment. The review screen renders the same
 * summary, so what people check is what Matt reads.
 */

import { CAN_NAME, CONCURRENT_ROLE_TYPES, HEADSHOT_CHOICES, LEADERSHIP_MODES, PRONOUNS } from "./options";
import { fullName, type BioFile } from "./build";
import type { BioIntakeData } from "./schema";

export const JSON_BEGIN = "----- BEGIN BIO JSON -----";
export const JSON_END = "----- END BIO JSON -----";

const label = <T extends { value: string; label: string }>(list: readonly T[], v: string | null) =>
  list.find((x) => x.value === v)?.label ?? (v || "—");
const join = (xs: string[]) => (xs.length ? xs.join(", ") : "—");
const or = (s: string | number | null | undefined) => (s === "" || s == null ? "—" : String(s));

/** The readable, sectioned summary of one submission. */
export function renderSummary(d: BioIntakeData): string {
  const b = d.basics;
  const r = d.fairlead_role;
  const L: string[] = [];
  const h = (t: string) => L.push("", t.toUpperCase(), "");

  h("Basics");
  L.push(`Name:          ${fullName(d)}${b.preferred_name && b.preferred_name !== b.first_name ? ` (goes by ${b.preferred_name})` : ""}`);
  L.push(`Pronoun:       ${label(PRONOUNS, b.pronoun)}`);
  L.push(`Email:         ${or(b.email)}`);
  L.push(`Title:         ${or(b.title)}${b.title_specialization ? `, ${b.title_specialization}` : ""}`);
  L.push(`Roster:        ${b.roster_match === "not_listed" ? `Not listed${b.is_new_hire ? " (new hire)" : ""}` : or(b.roster_match)}`);
  L.push(`Joined:        ${or(b.year_joined_fairlead)}    Career start: ${or(b.career_start_year)}`);
  if (b.location) L.push(`Location:      ${b.location}`);
  if (b.linkedin_url) L.push(`LinkedIn:      ${b.linkedin_url}`);

  h("Fairlead role");
  L.push(`Service lines: ${join(r.service_lines)}`);
  if (r.supporting_areas.length) L.push(`Supporting:    ${join(r.supporting_areas)}`);
  if (r.leadership_mode) L.push(`Leadership:    ${label(LEADERSHIP_MODES, r.leadership_mode)}`);
  L.push(`Seats:         ${join(r.seats)}`);
  L.push(`Focus areas:   ${join(r.focus_areas)}`);
  L.push(`Sectors:       ${join(r.sectors)}`);
  if (r.client_types.length) L.push(`Clients:       ${join(r.client_types)}`);
  L.push(`Value:         ${or(r.value_statement)}`);

  h("Recent Fairlead work");
  d.recent_engagements.forEach((e, i) => {
    const naming = label(CAN_NAME, e.can_name_publicly);
    L.push(`${i + 1}. ${e.company || "(company not given)"} — name publicly: ${naming}`);
    L.push(`   As:        ${e.descriptor || "—"}`);
    L.push(`   Status:    ${or(e.engagement_status)}${e.year ? ` (${e.engagement_status === "ongoing" ? "started" : "completed"} ${e.year})` : ""}`);
    if (e.engagement_type) L.push(`   Type:      ${e.engagement_type}`);
    L.push(`   Role:      ${or(e.your_role)}`);
    L.push(`   Did:       ${or(e.what_you_did)}`);
    L.push(`   Result:    ${e.result_confidential ? "(confidential)" : or(e.result)}`);
    if (e.sponsor) L.push(`   Sponsor:   ${e.sponsor}`);
    if (e.sector) L.push(`   Sector:    ${e.sector}`);
  });

  h("Career before Fairlead");
  if (!d.prior_roles.length) L.push("—");
  d.prior_roles.forEach((p, i) => {
    const when = p.current ? `${or(p.start_year)}–now` : `${or(p.start_year)}–${or(p.end_year)}`;
    L.push(`${i + 1}. ${p.title || "—"}, ${p.employer || "—"} (${when})${p.current && p.concurrent_role_type ? ` [${label(CONCURRENT_ROLE_TYPES, p.concurrent_role_type)}]` : ""}`);
    if (p.employer_descriptor) L.push(`   ${p.employer_descriptor}`);
    if (p.highlight) L.push(`   Highlight: ${p.highlight}`);
  });
  if (d.earlier_career) L.push(`Earlier: ${d.earlier_career}`);

  h("Education & credentials");
  if (!d.education.length) L.push("Degrees: —");
  d.education.forEach((g) => {
    const parts = [g.degree, g.field && `in ${g.field}`, g.concentration && `(${g.concentration})`, g.institution && `— ${g.institution}`, g.honors && `, ${g.honors}`];
    L.push(`- ${parts.filter(Boolean).join(" ")}${g.in_progress ? " [in progress]" : ""}`);
  });
  d.credentials.forEach((c) => L.push(`- ${c.designation} — ${or(c.status)}${c.jurisdiction ? ` (${c.jurisdiction})` : ""}`));
  if (d.registration.is_registered_rep) {
    L.push(`Registered rep: yes — ${d.registration.broker_dealer_name}`);
    L.push(`Disclosure: ${d.registration.regulatory_disclosure}`);
  }
  if (d.other_licenses.length) L.push(`Other licenses: ${join(d.other_licenses)}`);

  h("Extras");
  const x = d.extras;
  x.board_and_affiliations.forEach((a) => L.push(`- ${a.role}, ${a.organization}${a.type ? ` (${a.type})` : ""}`));
  if (x.has_outside_firm) L.push(`Outside firm (not for the bio unless approved): ${x.outside_firm.name} — ${x.outside_firm.descriptor}`);
  if (x.languages.length) L.push(`Languages: ${join(x.languages)}`);
  if (x.personal_line) L.push(`Personal line: ${x.personal_line}`);
  L.push(`Headshot: ${label(HEADSHOT_CHOICES, x.headshot_choice || null)}`);
  if (x.do_not_mention) L.push(`Do not mention: ${x.do_not_mention}`);
  if (x.notes_to_matt) L.push(`Notes to Matt: ${x.notes_to_matt}`);

  return L.join("\n").trim();
}

/** Every value someone typed under Other…, as "field = value" lines. */
export function customEntries(d: BioIntakeData): string[] {
  const out: string[] = [];
  const add = (field: string, v: string | string[]) => [v].flat().filter(Boolean).forEach((x) => out.push(`${field} = ${x}`));
  add("title", d.basics.title_custom);
  const r = d.fairlead_role;
  add("service_lines", r.service_lines_custom);
  add("supporting_areas", r.supporting_areas_custom);
  add("seats", r.seats_custom);
  add("focus_areas", r.focus_areas_custom);
  add("sectors", r.sectors_custom);
  add("client_types", r.client_types_custom);
  d.recent_engagements.forEach((e) => {
    add("engagement_type", e.engagement_type_custom);
    add("your_role", e.your_role_custom);
    add("sector", e.sector_custom);
  });
  d.education.forEach((g) => {
    add("degree", g.degree_custom);
    add("honors", g.honors_custom);
  });
  d.credentials.forEach((c) => add("designation", c.designation_custom));
  d.extras.board_and_affiliations.forEach((a) => {
    add("affiliation role", a.role_custom);
    add("affiliation type", a.type_custom);
  });
  add("languages", d.extras.languages_custom);
  return out;
}

export function newNames(d: BioIntakeData): string[] {
  return [
    ...d.prior_roles.filter((p) => p.employer_is_new_name).map((p) => `employer: ${p.employer}`),
    ...d.education.filter((g) => g.institution_is_new_name).map((g) => `institution: ${g.institution}`),
  ];
}

export function emailSubject(file: BioFile): string {
  const d = file.data;
  const title = d.basics.title + (d.basics.title_specialization ? `, ${d.basics.title_specialization}` : "");
  return `Bio intake — ${fullName(d)}, ${title}${file.submission.revision_of ? " (revision)" : ""}`;
}

/** The full body Matt receives. `json` is the pretty-printed file, identical to the attachment. */
export function renderEmail(file: BioFile, json: string, opts: { headshot?: string } = {}): { subject: string; text: string } {
  const d = file.data;
  const s = file.submission;
  const custom = customEntries(d);
  const names = newNames(d);
  const text = [
    `${fullName(d)} submitted a bio intake${s.revision_of ? ` (a revision of ${s.revision_of})` : ""}.`,
    `Attached: the JSON file${opts.headshot ? ` and a headshot (${opts.headshot})` : ""}. Drop the file into Claude and send “Generate bios.”`,
    "",
    renderSummary(d),
    "",
    "WARNINGS",
    "",
    ...(d.warnings.length ? d.warnings.map((w) => `- ${w}`) : ["None."]),
    ...(custom.length ? ["", "CUSTOM ENTRIES", "", ...custom.map((c) => `- ${c}`)] : []),
    ...(names.length ? ["", "NEW NAMES (not on the canonical lists)", "", ...names.map((n) => `- ${n}`)] : []),
    ...(s.prefill ? ["", "WEBSITE BEFORE", "", `${s.prefill.name} — ${s.prefill.suffix}`, s.prefill.roles] : []),
    "",
    `Submission ${s.submission_id} · ${s.submitted_at}`,
    "",
    JSON_BEGIN,
    json,
    JSON_END,
  ].join("\n");
  return { subject: emailSubject(file), text };
}
