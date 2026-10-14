/**
 * BIO_GENERATOR_V1 — the `instructions` block copied into every intake file
 * (PRD §7). This file is the source of truth: /api/bio and the page's
 * Download fallback both copy it in, so a file always carries the rules it
 * was written against. Changing a word here means bumping to v2.
 */

export const BIO_GENERATOR_V1 = {
  version: "bio-generator/v1",
  task: "Write this person's Fairlead Advisors bio in the exact formats in `outputs`, following every rule in `style`. Return ONLY the JSON object described in `return_format`. If several of these files are provided, return an array with one object per file, in the order given.",
  outputs: {
    card: "Line 1: '{Full name}' + ', {active credentials}' if any. Line 2: Fairlead title (+ ', {title_specialization}'). Line 3: focus_areas joined with ', '. This is the deck slide format.",
    short:
      "60–80 words, one paragraph. Sentence 1: name, title at Fairlead Advisors, and what they do for clients (from value_statement + service_lines + focus_areas). Sentence 2: the strongest recent Fairlead engagement. Sentence 3: the most relevant prior role. Final sentence: degrees.",
    standard:
      "160–200 words, exactly four paragraphs. P1 Fairlead role: title, what they do for clients, service lines, sectors, seats. P2 Recent Fairlead work: 2–3 engagements, each with action and result. P3 Career before Fairlead: up to 3 prior roles, most recent first, employer descriptor + one highlight each. P4 Credentials and education: active credentials, degrees, board roles; then personal_line if present. If regulatory_disclosure is present, append it verbatim as a separate final line.",
  },
  style: [
    "Third person. Use the pronoun given in data.basics.pronoun; never infer it. If it is 'name_only', repeat the preferred name and use no pronouns.",
    "Ongoing engagements (engagement_status 'ongoing') in present tense; completed ones in past tense. If result_confidential is true, describe the work without an outcome.",
    "Values listed in any *_custom array were typed by the person: use them as written (already normalized) and list each in `flags` as 'custom value: {field} = {value}'.",
    "Degrees marked in_progress are written 'is pursuing a {degree} in {field} at {institution}'.",
    "Languages: mention only if a language other than English is listed.",
    "Full name on first mention; preferred_name (or first name) thereafter. Never Mr./Ms.",
    "Present tense for the Fairlead role; past tense for prior roles and completed engagements.",
    "Lead with what the person does for clients, not with career history.",
    "Compute experience from career_start_year against submitted_at, rounded down to the nearest 5 years and phrased 'more than N years'. Compute Fairlead tenure as 'since joining Fairlead in {year_joined_fairlead}'. Never print other year ranges.",
    "Numbers over adjectives. Keep every figure exactly as submitted; never round up, combine, or invent one.",
    "Banned words: seasoned, accomplished, proven, track record, trusted advisor, leverages, results-driven, passionate, dynamic, synergy, world-class, extensive (unless quantified).",
    "Name a client or sponsor ONLY if can_name_publicly is 'yes'; otherwise use the descriptor verbatim or lightly edited. Never name a sponsor whose company is anonymized.",
    "Only credentials with status 'active' appear after the name or as post-nominals. Inactive/retired/expired credentials are omitted unless Matt asks otherwise.",
    "Do not mention outside_firm or anything in do_not_mention.",
    "Title comes from data.basics.title exactly; never describe the person with a different title.",
    "Use only facts present in `data`. Do not add employers, degrees, numbers, or clients. If something essential is missing, say so in `flags` rather than filling the gap.",
    "American English, Oxford comma, '$1.9 billion' / '$300 million' in prose, 'MW' for megawatts, no exclamation marks, no first person.",
  ],
  return_format: {
    person: "Full name",
    hub_fields: {
      name: "Full name",
      suffix: "Active credentials then title, comma-separated — e.g. 'CFA, Partner' — matching team_members.suffix",
      roles: "focus_areas joined with ', ' — matching team_members.roles",
      extended_bio: "The standard bio, paragraphs separated by a blank line — matching team_members.extended_bio",
    },
    card: "string (3 lines, \\n-separated)",
    short: "string",
    standard: "string",
    word_counts: { short: 0, standard: 0 },
    flags: [
      "Anything missing, inconsistent, unverifiable, or that needs Matt's decision (e.g. 'Engagement 2 has no result', 'CPA status inactive — omitted').",
    ],
  },
} as const;
