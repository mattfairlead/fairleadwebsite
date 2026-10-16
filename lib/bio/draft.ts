/**
 * The form's working copy of a submission. It is the §7 `data` shape with
 * a stable `_k` on each repeater entry (React keys survive removes and
 * reorders) plus a stash of Other… text, so turning Other off and on again
 * restores what was typed (§6.0). toData() strips both.
 *
 * "Other… chosen, nothing typed yet" lives in the data as the OTHER
 * sentinel, so validate() reports it on the client and rejects it on the
 * server without a separate code path.
 */

import { fixedSpelling, matchOption, suggestOption } from "./normalize";
import { DESIGNATIONS, FOCUS_AREAS, LIMITS, SEATS, SPECIALIZED_TITLES, TITLES, CREDENTIAL_STATUS } from "./options";
import {
  emptyData,
  emptyEngagement,
  type Affiliation,
  type BioIntakeData,
  type Credential,
  type Degree,
  type Engagement,
  type PriorRole,
  type RosterMember,
} from "./schema";

export type Keyed<T> = T & { _k: string };

export interface DraftData
  extends Omit<BioIntakeData, "recent_engagements" | "prior_roles" | "education" | "credentials" | "extras" | "warnings"> {
  recent_engagements: Keyed<Engagement>[];
  prior_roles: Keyed<PriorRole>[];
  education: Keyed<Degree>[];
  credentials: Keyed<Credential>[];
  extras: Omit<BioIntakeData["extras"], "board_and_affiliations"> & { board_and_affiliations: Keyed<Affiliation>[] };
}

export interface Draft {
  data: DraftData;
  /** Other… text set aside while Other is deselected, by field key. */
  stash: Record<string, string[]>;
  /** The regulatory disclosure follows its template until the person edits it. */
  disclosure_auto: boolean;
}

let seq = 0;
export function newKey(): string {
  seq += 1;
  return `${Date.now().toString(36)}${seq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const key = <T>(x: T): Keyed<T> => ({ ...x, _k: newKey() });

export const newEngagement = (): Keyed<Engagement> => key(emptyEngagement());
export const newPriorRole = (): Keyed<PriorRole> =>
  key({
    employer: "",
    employer_is_new_name: false,
    employer_descriptor: "",
    title: "",
    start_year: null,
    end_year: null,
    current: false,
    concurrent_role_type: null,
    highlight: "",
  });
export const newDegree = (): Keyed<Degree> =>
  key({
    degree: "",
    degree_custom: "",
    field: "",
    concentration: "",
    institution: "",
    institution_is_new_name: false,
    honors: "",
    honors_custom: "",
    in_progress: false,
  });
export const newCredential = (): Keyed<Credential> => key({ designation: "", designation_custom: "", status: "", jurisdiction: "" });
export const newAffiliation = (): Keyed<Affiliation> => key({ role: "", role_custom: "", organization: "", type: "", type_custom: "" });

export function emptyDraft(): Draft {
  const d = emptyData();
  return {
    data: {
      ...d,
      recent_engagements: [newEngagement()],
      prior_roles: [newPriorRole()],
      education: [],
      credentials: [],
      extras: { ...d.extras, board_and_affiliations: [] },
    },
    stash: {},
    disclosure_auto: true,
  };
}

const unkey = <T>({ _k, ...rest }: Keyed<T>): T => {
  void _k;
  return rest as T;
};

export function toData(draft: Draft): BioIntakeData {
  const d = draft.data;
  return {
    ...d,
    recent_engagements: d.recent_engagements.map(unkey),
    prior_roles: d.prior_roles.map(unkey),
    education: d.education.map(unkey),
    credentials: d.credentials.map(unkey),
    extras: { ...d.extras, board_and_affiliations: d.extras.board_and_affiliations.map(unkey) },
    warnings: [],
  };
}

/* ==========================================================================
   Roster prefill (§5.2): name, title, credentials and the roles line. Every
   value stays editable; the original is recorded under submission.prefill.
   ========================================================================== */

const SEAT_ALIASES: Record<string, string> = {
  "board member": "Board member / Board advisor",
  "board advisor": "Board member / Board advisor",
  board: "Board member / Board advisor",
  "asset management": "Asset manager",
};

/** Split the hub roles line into seats and focus areas; anything unrecognised is left for the person. */
export function splitRolesLine(roles: string): { seats: string[]; focus: string[] } {
  const seats: string[] = [];
  const focus: string[] = [];
  for (const raw of roles.split(",").map((s) => s.trim()).filter(Boolean)) {
    const seat = matchOption(raw, SEATS) ?? SEAT_ALIASES[raw.toLowerCase()];
    if (seat) {
      if (!seats.includes(seat) && seats.length < LIMITS.seats) seats.push(seat);
      continue;
    }
    const f = suggestOption(raw, FOCUS_AREAS);
    if (f && !focus.includes(f) && focus.length < LIMITS.focus_max) focus.push(f);
  }
  return { seats, focus };
}

export function prefillFromRoster(draft: Draft, m: RosterMember): Draft {
  const d: DraftData = structuredClone(draft.data);
  const parts = m.name.trim().split(/\s+/);
  d.basics.roster_match = m.id;
  d.basics.is_new_hire = false;
  d.basics.first_name = parts[0] ?? "";
  d.basics.last_name = parts.slice(1).join(" ");

  const [base, ...spec] = m.title.split(",").map((s) => s.trim());
  if (TITLES.includes(base)) {
    d.basics.title = base;
    d.basics.title_custom = "";
    d.basics.title_specialization = SPECIALIZED_TITLES.includes(base) ? spec.join(", ") : "";
  } else if (m.title) {
    d.basics.title = m.title;
    d.basics.title_custom = m.title;
    d.basics.title_specialization = "";
  }

  // "CPA, CGMA" / "CPA (inactive)" → credential entries with a status.
  const creds: Keyed<Credential>[] = [];
  for (const token of (m.credentials ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
    const q = token.match(/\(([^)]*)\)/)?.[1]?.trim().toLowerCase() ?? "";
    const name = fixedSpelling(token.replace(/\([^)]*\)/, ""));
    if (["MBA", "J.D.", "Ph.D.", "Esq."].includes(name)) continue;
    const status = (CREDENTIAL_STATUS.find((s) => s.value === q)?.value ?? (q ? "inactive" : "active")) as Credential["status"];
    const std = DESIGNATIONS.includes(name);
    creds.push(key({ designation: name, designation_custom: std ? "" : name, status, jurisdiction: "" }));
  }
  if (creds.length) d.credentials = creds;

  const { seats, focus } = splitRolesLine(m.specialty);
  d.fairlead_role.seats = seats;
  d.fairlead_role.seats_custom = [];
  d.fairlead_role.focus_areas = focus;
  d.fairlead_role.focus_areas_custom = [];
  d.extras.headshot_choice = m.has_photo ? "keep" : "";
  return { ...draft, data: d };
}

/** §6.5 — pre-filled, editable, then reproduced word for word. */
export function disclosureTemplate(b: BioIntakeData["basics"], brokerDealer: string): string {
  const first = b.preferred_name || b.first_name || "{First}";
  const possessive = b.pronoun === "he" ? "his" : b.pronoun === "she" ? "her" : b.pronoun === "they" ? "their" : `${first}’s`;
  return `${first} is a registered representative of ${brokerDealer || "{broker-dealer}"} (member FINRA/SIPC), through which broker-dealer services associated with ${possessive} engagements are offered.`;
}

/* ==========================================================================
   Saved progress (§5.3)
   ========================================================================== */

export const STORAGE_KEY = "fairlead.bio-intake.v1";

export interface Saved {
  v: 1;
  draft: Draft | null;
  last_submission_id: string | null;
  /** The step the person was on, so a return visit resumes there. */
  step?: string;
}

export function readSaved(): Saved {
  const blank: Saved = { v: 1, draft: null, last_submission_id: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return blank;
    const s = JSON.parse(raw) as Partial<Saved>;
    if (s?.v !== 1) return blank;
    const draft = s.draft && typeof s.draft === "object" && s.draft.data ? s.draft : null;
    if (draft && !Array.isArray(draft.data.open_questions)) draft.data.open_questions = [];
    return {
      v: 1,
      draft,
      last_submission_id: typeof s.last_submission_id === "string" ? s.last_submission_id : null,
      step: typeof s.step === "string" ? s.step : undefined,
    };
  } catch {
    return blank;
  }
}

export function writeSaved(s: Saved): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Private mode or full storage: the form still works, it just won't survive a reload.
  }
}
