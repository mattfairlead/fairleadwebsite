/**
 * Unit tests for the /bio pipeline (PRD §10): validate(), normalize and
 * buildBioJson() against five fixtures — minimal, full, Craig's case
 * (registered rep plus disclosure), Mitchell's case (a current role at his
 * own firm) and "Other everywhere". Run with `npm test`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { bioFilename, buildBioJson, prepare, sanitize, type SubmissionMeta } from "./build";
import { renderEmail, JSON_BEGIN, JSON_END } from "./email";
import { BIO_GENERATOR_V1 } from "./generator";
import { cleanText, fixedSpelling, normLinkedIn, normName, suggestOption } from "./normalize";
import { FOCUS_AREAS, SECTORS } from "./options";
import { emptyData, emptyEngagement, SCHEMA_ID, type BioIntakeData, type RosterMember } from "./schema";

const NOW = new Date("2026-10-15T15:42:10Z");

function minimal(): BioIntakeData {
  const d = emptyData();
  d.basics = {
    ...d.basics,
    roster_match: "12",
    first_name: "Alex",
    last_name: "MacDonald",
    pronoun: "he",
    email: "amacdonald@fairleadadvisors.com",
    title: "Managing Director",
    year_joined_fairlead: 2012,
    career_start_year: 2003,
  };
  d.fairlead_role.service_lines = ["Advisory"];
  d.fairlead_role.focus_areas = ["Financial Modeling", "Valuation", "Working Capital & Cash Management"];
  d.fairlead_role.value_statement = "I help portfolio companies model, value and fund their plans";
  d.recent_engagements = [
    {
      ...emptyEngagement(),
      can_name_publicly: "not_sure",
      descriptor: "an oil field services company",
      engagement_status: "completed",
      your_role: "CFO",
      what_you_did: "Served as interim Finance Director through its sale",
    },
  ];
  d.prior_roles = [
    {
      employer: "Niotan, Inc.",
      employer_is_new_name: false,
      employer_descriptor: "",
      title: "Vice President, Finance",
      start_year: 2005,
      end_year: 2012,
      current: false,
      concurrent_role_type: null,
      highlight: "",
    },
  ];
  return d;
}

function full(): BioIntakeData {
  const d = minimal();
  d.basics.preferred_name = "Alex";
  d.basics.location = "Minneapolis";
  d.basics.linkedin_url = "linkedin.com/in/alexmacdonald?trk=abc";
  d.fairlead_role.sectors = ["Energy & Power", "Minerals & Processing"];
  d.fairlead_role.client_types = ["Private equity"];
  d.fairlead_role.seats = ["CFO"];
  d.recent_engagements[0].result = "Sold to a strategic buyer in 2023";
  d.recent_engagements[0].year = 2023;
  d.recent_engagements[0].sector = "Oil & Gas";
  d.recent_engagements[0].engagement_type = "Interim / Fractional Leadership";
  d.recent_engagements.push({
    ...emptyEngagement(),
    company: "Greenleaf",
    can_name_publicly: "yes",
    descriptor: "a California biomass power producer",
    engagement_status: "ongoing",
    your_role: "Controller",
    what_you_did: "Runs monthly close and lender reporting",
    result: "Close cut from 20 to 8 days",
    year: 2024,
    sponsor: "Some Fund",
  });
  d.prior_roles[0].employer_descriptor = "a tantalum manufacturer";
  d.prior_roles[0].highlight = "Helped lead its turnaround and sale";
  d.education = [
    {
      degree: "B.S.",
      degree_custom: "",
      field: "Finance",
      concentration: "",
      institution: "Santa Clara University",
      institution_is_new_name: false,
      honors: "",
      honors_custom: "",
      in_progress: false,
    },
    {
      degree: "MBA",
      degree_custom: "",
      field: "",
      concentration: "",
      institution: "University of Nevada, Reno",
      institution_is_new_name: false,
      honors: "",
      honors_custom: "",
      in_progress: false,
    },
  ];
  d.credentials = [{ designation: "CPA", designation_custom: "", status: "active", jurisdiction: "MN" }];
  d.extras.headshot_choice = "keep";
  return d;
}

function craig(): BioIntakeData {
  const d = minimal();
  d.basics.first_name = "Craig";
  d.basics.last_name = "Example";
  d.fairlead_role.focus_areas = ["Capital Raising", "Broker-Dealer Services", "M&A Execution"];
  d.registration = {
    is_registered_rep: true,
    broker_dealer_name: "Example Securities LLC",
    regulatory_disclosure:
      "Craig is a registered representative of Example Securities LLC (member FINRA/SIPC), through which broker-dealer services associated with his engagements are offered.",
  };
  d.other_licenses = ["Series 79, Series 63"];
  return d;
}

function mitchell(): BioIntakeData {
  const d = minimal();
  d.basics.first_name = "Mitchell";
  d.prior_roles.unshift({
    employer: "Apex Global Advisors",
    employer_is_new_name: false,
    employer_descriptor: "a boutique restructuring practice",
    title: "Founder",
    start_year: 2015,
    end_year: null,
    current: true,
    concurrent_role_type: "own_firm",
    highlight: "",
  });
  return d;
}

function otherEverywhere(): BioIntakeData {
  const d = minimal();
  d.basics.title = "Chief of Staff";
  d.basics.title_custom = "Chief of Staff";
  const r = d.fairlead_role;
  r.service_lines = ["Advisory", "Board Services"];
  r.service_lines_custom = ["Board Services"];
  r.seats = ["Chief of Staff"];
  r.seats_custom = ["Chief of Staff"];
  r.focus_areas = ["Financial Reporting", "Treasury", "Lease Accounting"];
  r.focus_areas_custom = ["Lease Accounting"];
  r.sectors = ["Water"];
  r.sectors_custom = ["Water"];
  r.client_types = ["Pension funds"];
  r.client_types_custom = ["Pension funds"];
  const e = d.recent_engagements[0];
  e.engagement_type = "Board work";
  e.engagement_type_custom = "Board work";
  e.your_role = "Integration lead";
  e.your_role_custom = "Integration lead";
  e.sector = "Water";
  e.sector_custom = "Water";
  d.education = [
    {
      degree: "M.Eng.",
      degree_custom: "M.Eng.",
      field: "Civil Engineering",
      concentration: "",
      institution: "ETH Zurich",
      institution_is_new_name: false,
      honors: "with honors",
      honors_custom: "with honors",
      in_progress: false,
    },
  ];
  d.credentials = [{ designation: "CFE", designation_custom: "CFE", status: "active", jurisdiction: "" }];
  d.extras.board_and_affiliations = [
    { role: "Treasurer", role_custom: "Treasurer", organization: "Houston Food Bank", type: "Charity", type_custom: "Charity" },
  ];
  d.extras.languages = ["English", "Tagalog"];
  d.extras.languages_custom = ["Tagalog"];
  return d;
}

const META: SubmissionMeta = {
  submission_id: "3f1c7a52-8f3e-4b0a-9a51-0c1f3d2e4b6a",
  submitted_at: "2026-10-15T15:42:10Z",
  revision_of: null,
  source: "fairleadadvisors.com/bio",
  hub_team_member_id: 12,
  prefill: null,
  headshot_attached: false,
};

const ok = (d: BioIntakeData, roster: RosterMember | null = null) => {
  const out = prepare(d, { now: NOW, roster });
  assert.deepEqual(out.errors, {}, `unexpected errors: ${JSON.stringify(out.errors)}`);
  return out;
};

/* ---------- validate() ---------- */

test("minimal fixture: only the hard requirements, no errors", () => {
  ok(minimal());
});

test("full fixture: no errors, normalized LinkedIn, sponsor kept on a public engagement", () => {
  const { data } = ok(full());
  assert.equal(data.basics.linkedin_url, "https://www.linkedin.com/in/alexmacdonald");
  assert.equal(data.recent_engagements[1].sponsor, "Some Fund");
});

test("each hard requirement blocks submission", () => {
  const cases: [string, (d: BioIntakeData) => void][] = [
    ["basics.first_name", (d) => (d.basics.first_name = "")],
    ["basics.last_name", (d) => (d.basics.last_name = "")],
    ["basics.pronoun", (d) => (d.basics.pronoun = "")],
    ["basics.email", (d) => (d.basics.email = "")],
    ["basics.title", (d) => (d.basics.title = "")],
    ["basics.year_joined_fairlead", (d) => (d.basics.year_joined_fairlead = null)],
    ["basics.career_start_year", (d) => (d.basics.career_start_year = null)],
    ["fairlead_role.service_lines", (d) => (d.fairlead_role.service_lines = [])],
    ["fairlead_role.focus_areas", (d) => (d.fairlead_role.focus_areas = ["Valuation", "Treasury"])],
    ["fairlead_role.value_statement", (d) => (d.fairlead_role.value_statement = "")],
    ["recent_engagements", (d) => (d.recent_engagements = [])],
    ["prior_roles", (d) => (d.prior_roles = [])],
    ["credentials.0.status", (d) => (d.credentials = [{ designation: "CFA", designation_custom: "", status: "", jurisdiction: "" }])],
    ["recent_engagements.0.descriptor", (d) => (d.recent_engagements[0].descriptor = "")],
    ["recent_engagements.0.your_role", (d) => (d.recent_engagements[0].your_role = "")],
    ["recent_engagements.0.what_you_did", (d) => (d.recent_engagements[0].what_you_did = "")],
  ];
  for (const [path, mutate] of cases) {
    const d = minimal();
    mutate(d);
    const { errors } = prepare(d, { now: NOW });
    assert.ok(errors[path], `expected an error at ${path}, got ${JSON.stringify(errors)}`);
  }
});

test("new hires may list no prior roles (soft warning instead)", () => {
  const d = minimal();
  d.basics.roster_match = "not_listed";
  d.basics.is_new_hire = true;
  d.prior_roles = [];
  const { warnings } = ok(d);
  assert.ok(warnings.some((w) => w.includes("new hire")));
});

test("conditionals: required only when shown", () => {
  const d = minimal();
  d.recent_engagements[0].can_name_publicly = "yes";
  assert.ok(prepare(d, { now: NOW }).errors["recent_engagements.0.company"]);

  const s = minimal();
  s.fairlead_role.service_lines = ["Supporting Services"];
  assert.ok(prepare(s, { now: NOW }).errors["fairlead_role.supporting_areas"]);

  const c = minimal();
  c.credentials = [{ designation: "CPA", designation_custom: "", status: "active", jurisdiction: "" }];
  assert.ok(prepare(c, { now: NOW }).errors["credentials.0.jurisdiction"]);
  c.credentials[0].status = "inactive";
  assert.equal(prepare(c, { now: NOW }).errors["credentials.0.jurisdiction"], undefined);

  const p = minimal();
  p.prior_roles[0].current = true;
  assert.ok(prepare(p, { now: NOW }).errors["prior_roles.0.concurrent_role_type"]);

  const x = minimal();
  x.extras.include_personal_line = true;
  assert.ok(prepare(x, { now: NOW }).errors["extras.personal_line"]);
  x.extras.has_outside_firm = true;
  assert.ok(prepare(x, { now: NOW }).errors["extras.outside_firm.name"]);

  const h = minimal();
  h.extras.headshot_choice = "upload";
  assert.ok(prepare(h, { now: NOW, headshotAttached: false }).errors["extras.headshot"]);
});

test("hidden fields are never sent", () => {
  const d = full();
  d.recent_engagements[1].can_name_publicly = "not_sure";
  d.recent_engagements[1].result_confidential = true;
  d.basics.title_specialization = "Should vanish";
  d.extras.personal_line = "Should vanish";
  d.prior_roles[0].end_year = 2012;
  d.prior_roles[0].current = true;
  d.prior_roles[0].concurrent_role_type = "other_employment";
  const { data } = ok(d);
  assert.equal(data.recent_engagements[1].sponsor, "");
  assert.equal(data.recent_engagements[1].result, "");
  assert.equal(data.basics.title_specialization, "");
  assert.equal(data.extras.personal_line, "");
  assert.equal(data.prior_roles[0].end_year, null);
});

test("end_year before start_year is rejected", () => {
  const d = minimal();
  d.prior_roles[0].start_year = 2015;
  d.prior_roles[0].end_year = 2010;
  assert.ok(prepare(d, { now: NOW }).errors["prior_roles.0.end_year"]);
});

/* ---------- normalize ---------- */

test("fixed spellings and names", () => {
  assert.equal(fixedSpelling("pe"), "P.E.");
  assert.equal(fixedSpelling("BS"), "B.S.");
  assert.equal(fixedSpelling("cpa"), "CPA");
  assert.equal(fixedSpelling("CPA Canada"), "CA (Canada)");
  assert.equal(normName("MARY DAY"), "Mary Day");
  assert.equal(normName("mary o'brien"), "Mary O’Brien");
  assert.equal(normName("McDonald"), "McDonald");
  assert.equal(normName("de la Cruz"), "de la Cruz");
  assert.equal(normLinkedIn("http://linkedin.com/in/jdoe/?x=1"), "https://www.linkedin.com/in/jdoe");
  assert.equal(cleanText('Led the  "turnaround".', { sentence: true }), "Led the “turnaround”");
  assert.equal(cleanText("NRG Energy, Inc.", { sentence: true }), "NRG Energy, Inc.");
});

test("the server applies normalization even if the client is bypassed", () => {
  const d = minimal();
  d.basics.first_name = "ALEX";
  d.credentials = [{ designation: "pe", designation_custom: "pe", status: "inactive", jurisdiction: "" }];
  d.education = [
    {
      degree: "BS",
      degree_custom: "BS",
      field: "Finance",
      concentration: "",
      institution: "santa clara university",
      institution_is_new_name: false,
      honors: "",
      honors_custom: "",
      in_progress: false,
    },
  ];
  const { data } = ok(sanitize(JSON.parse(JSON.stringify(d))));
  assert.equal(data.basics.first_name, "Alex");
  assert.equal(data.credentials[0].designation, "P.E.");
  assert.equal(data.credentials[0].designation_custom, "");
  assert.equal(data.education[0].degree, "B.S.");
  assert.equal(data.education[0].institution, "Santa Clara University");
  assert.equal(data.education[0].institution_is_new_name, false);
});

test("“Did you mean…?” suggestions", () => {
  assert.equal(suggestOption("FP&A", FOCUS_AREAS), "Forecasting & FP&A");
  assert.equal(suggestOption("month-end close", FOCUS_AREAS), "Financial Reporting");
  assert.equal(suggestOption("netsuite", FOCUS_AREAS), "ERP Selection & Implementation");
  assert.equal(suggestOption("solar", SECTORS), "Renewable Power");
  assert.equal(suggestOption("solar", FOCUS_AREAS), null);
  assert.equal(suggestOption("Lease Accounting", FOCUS_AREAS), null);
});

test("Other everywhere: custom values kept and listed in *_custom", () => {
  const { data, warnings } = ok(otherEverywhere());
  assert.deepEqual(data.fairlead_role.focus_areas, ["Financial Reporting", "Treasury", "Lease Accounting"]);
  assert.deepEqual(data.fairlead_role.focus_areas_custom, ["Lease Accounting"]);
  assert.equal(data.basics.title, "Chief of Staff");
  assert.equal(data.recent_engagements[0].your_role_custom, "Integration lead");
  assert.deepEqual(data.extras.languages_custom, ["Tagalog"]);
  assert.equal(data.education[0].institution_is_new_name, true);
  assert.ok(warnings.some((w) => w.includes("ETH Zurich")));
  const email = renderEmail(buildBioJson(data, META), "{}").text;
  assert.match(email, /CUSTOM ENTRIES/);
  assert.match(email, /focus_areas = Lease Accounting/);
});

test("a typed value that matches the list becomes the standard option", () => {
  const d = minimal();
  d.fairlead_role.focus_areas = ["Valuation", "Treasury", "financial modeling"];
  d.fairlead_role.focus_areas_custom = ["financial modeling"];
  const { data } = ok(d);
  assert.deepEqual(data.fairlead_role.focus_areas, ["Valuation", "Treasury", "Financial Modeling"]);
  assert.deepEqual(data.fairlead_role.focus_areas_custom, []);
});

test("Other selected with a value off the list but missing from *_custom is still accepted server-side", () => {
  // The server re-derives *_custom from the values, so a client that forgets it can't smuggle anything.
  const d = minimal();
  d.fairlead_role.focus_areas = ["Valuation", "Treasury", "Lease Accounting"];
  const { data } = ok(sanitize(d));
  assert.deepEqual(data.fairlead_role.focus_areas_custom, ["Lease Accounting"]);
});

/* ---------- special cases ---------- */

test("Craig: registered rep needs a broker-dealer and disclosure, kept verbatim", () => {
  const { data } = ok(craig());
  assert.equal(
    data.registration.regulatory_disclosure,
    "Craig is a registered representative of Example Securities LLC (member FINRA/SIPC), through which broker-dealer services associated with his engagements are offered."
  );
  const d = craig();
  d.registration.broker_dealer_name = "";
  d.registration.regulatory_disclosure = "";
  const { errors } = prepare(d, { now: NOW });
  assert.ok(errors["registration.broker_dealer_name"]);
  assert.ok(errors["registration.regulatory_disclosure"]);
});

test("Mitchell: a current role at his own firm moves to outside_firm", () => {
  const { data } = ok(mitchell());
  assert.equal(data.prior_roles.length, 1);
  assert.equal(data.prior_roles[0].employer, "Niotan, Inc.");
  assert.equal(data.extras.has_outside_firm, true);
  assert.deepEqual(data.extras.outside_firm, { name: "Apex Global Advisors", descriptor: "a boutique restructuring practice" });

  // Own firm alone doesn't count as a prior role.
  const solo = mitchell();
  solo.prior_roles = solo.prior_roles.slice(0, 1);
  assert.ok(prepare(solo, { now: NOW }).errors["prior_roles"]);
});

test("cross-field checks", () => {
  const d = full();
  d.recent_engagements[0].company = "Acme Oilfield";
  d.recent_engagements[0].what_you_did = "Ran finance at Acme Oilfield through its sale";
  d.basics.career_start_year = 1980;
  d.extras.do_not_mention = "Greenleaf";
  d.fairlead_role.seats = ["CFO"];
  d.fairlead_role.focus_areas = ["Valuation", "Treasury", "Financial Modeling", "CFO"];
  d.fairlead_role.focus_areas_custom = ["CFO"];
  const roster: RosterMember = {
    id: "12",
    name: "Alex MacDonald",
    title: "Senior Consultant",
    credentials: "CFA",
    specialty: "",
    bio_md: "",
    has_photo: true,
  };
  const { data, warnings } = ok(d, roster);
  const has = (s: string) => assert.ok(warnings.some((w) => w.includes(s)), `missing warning containing “${s}”: ${warnings.join(" | ")}`);
  has("mentions Acme Oilfield");
  has("Title differs from website");
  has("CPA is active here but not shown");
  has("CFA is on the website");
  has("46 years");
  has("do-not-mention");
  has("already a seat: CFO");
  assert.ok(!data.fairlead_role.focus_areas.includes("CFO"));
});

test("an empty result on every engagement is one stronger warning", () => {
  const { warnings } = ok(minimal());
  assert.ok(warnings.includes("No engagement has a result. Bios with numbers read much stronger."));
  assert.ok(!warnings.some((w) => /^Engagement 1 has no result/.test(w)));
});

/* ---------- buildBioJson / email ---------- */

test("buildBioJson: schema, verbatim instructions, parseable, filename", () => {
  const { data } = ok(full());
  const file = buildBioJson(data, META);
  const parsed = JSON.parse(JSON.stringify(file, null, 2));
  assert.equal(parsed.schema, SCHEMA_ID);
  assert.equal(parsed.schema, "fairlead.bio-intake/v1");
  assert.deepEqual(parsed.instructions, JSON.parse(JSON.stringify(BIO_GENERATOR_V1)));
  assert.equal(parsed.instructions.version, "bio-generator/v1");
  assert.equal(parsed.submission.submission_id, META.submission_id);
  assert.equal(bioFilename(file), "bio_alex-macdonald_20261015-1542.json");
});

test("email: subject, summary, markers, revision suffix", () => {
  const { data } = ok(full());
  const file = buildBioJson(data, { ...META, revision_of: "11111111-2222-4333-8444-555555555555" });
  const json = JSON.stringify(file, null, 2);
  const mail = renderEmail(file, json);
  assert.equal(mail.subject, "Bio intake — Alex MacDonald, Managing Director (revision)");
  assert.ok(mail.text.includes(`${JSON_BEGIN}\n${json}\n${JSON_END}`));
  assert.match(mail.text, /RECENT FAIRLEAD WORK/);
  assert.match(mail.text, /WARNINGS/);
});

test("sanitize: wrong types and junk are coerced, never trusted", () => {
  const d = sanitize({
    basics: { first_name: 42, email: ["x"], year_joined_fairlead: "2012", pronoun: "he" },
    recent_engagements: "nope",
    warnings: ["client-supplied"],
    extra: { evil: true },
  });
  assert.equal(d.basics.first_name, "");
  assert.equal(d.basics.email, "");
  assert.equal(d.basics.year_joined_fairlead, null);
  assert.deepEqual(d.recent_engagements, []);
  assert.deepEqual(d.warnings, []);
  assert.equal(sanitize(null).basics.first_name, "");
});
