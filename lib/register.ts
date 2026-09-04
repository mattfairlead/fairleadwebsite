import type {
  Engagement,
  EngagementRole,
  HubEngagementRow,
  RegisterPublicRow,
  RegisterRow,
  RegisterSector,
  RegisterStatus,
  RegisterWork,
} from "@/lib/types";

/**
 * Hub → website mapping for the engagement register. The hub owns the data
 * (its `engagements` table); this file owns how it reads on the site and,
 * above all, what the LOCKED view is allowed to contain.
 *
 * Two shapes leave this file: RegisterPublicRow (sector, status, work-type
 * tags, an index, a sponsor-backed flag, and the summary with the company
 * and sponsor names scrubbed out) and RegisterRow (that plus company,
 * sponsor and the summary as written). Pages render the public shape unless
 * lib/register-access.ts has verified the visitor's grant cookie — and the
 * public shape has no field that could hold a name, so a locked page cannot
 * leak one even through a template mistake.
 */

/** Columns the site reads from the hub. */
export const HUB_ENGAGEMENT_COLUMNS =
  "id,company,pe_fund,key_symbols,sector,summary,status,sort_order,show_on_website,updated_at";

/** The hub's key-symbol legend (lib/constants.js in the hub), in its display order. */
export const WORK: { symbol: string; slug: RegisterWork; label: string }[] = [
  { symbol: "◆", slug: "operating-partner", label: "Operating partner" },
  { symbol: "⬤", slug: "assessment", label: "Assessment" },
  { symbol: "▲", slug: "m-and-a", label: "M&A" },
  { symbol: "◼", slug: "leadership", label: "Leadership" },
  { symbol: "⚑", slug: "advisory", label: "Advisory" },
];

export const SECTORS: { slug: RegisterSector; label: string; hub: string[] }[] = [
  { slug: "energy", label: "Energy & infrastructure", hub: ["Energy"] },
  { slug: "venture", label: "Venture-backed", hub: ["VC"] },
  { slug: "family-office", label: "Family office", hub: ["Family Office"] },
  { slug: "other", label: "Other sectors", hub: ["Other"] },
];

export const STATUSES: { slug: Exclude<RegisterStatus, null>; label: string }[] = [
  { slug: "active", label: "Active" },
  { slug: "historical", label: "Historical" },
];

export function workLabel(slug: RegisterWork): string {
  return WORK.find((w) => w.slug === slug)?.label ?? slug;
}
export function sectorLabel(slug: RegisterSector): string {
  return SECTORS.find((s) => s.slug === slug)?.label ?? slug;
}

export function parseWork(symbols: string): RegisterWork[] {
  const s = symbols ?? "";
  return WORK.filter((w) => s.includes(w.symbol)).map((w) => w.slug);
}

export function parseSector(hubSector: string): RegisterSector {
  const key = (hubSector ?? "").trim().toLowerCase();
  return SECTORS.find((s) => s.hub.some((h) => h.toLowerCase() === key))?.slug ?? "other";
}

export function parseStatus(status: string): RegisterStatus {
  const key = (status ?? "").trim().toLowerCase();
  if (key === "active") return "active";
  if (key === "historical") return "historical";
  return null;
}

export function sortHubEngagements<T extends Pick<HubEngagementRow, "sort_order" | "id">>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}

/** Full rows for the UNLOCKED view. Sorted, indexed, website-flag honoured. */
export function mapHubEngagements(rows: HubEngagementRow[]): RegisterRow[] {
  return sortHubEngagements(rows.filter((r) => r.show_on_website !== false)).map((r, i) => ({
    id: r.id,
    index: i + 1,
    sector: parseSector(r.sector),
    status: parseStatus(r.status),
    work: parseWork(r.key_symbols),
    sponsor_backed: Boolean((r.pe_fund ?? "").trim()),
    company: (r.company ?? "").trim(),
    sponsor: (r.pe_fund ?? "").trim() || null,
    summary: (r.summary ?? "").trim(),
  }));
}

/**
 * Strip a row down to what everyone may see. Builds a NEW object from named
 * public fields — never a spread — so a column added to the hub tomorrow
 * cannot ride along into the locked HTML. The summary comes through with the
 * company and sponsor names replaced (see scrubNames); the names themselves
 * do not.
 */
export function redact(row: RegisterRow): RegisterPublicRow {
  return {
    id: row.id,
    index: row.index,
    sector: row.sector,
    status: row.status,
    work: [...row.work],
    sponsor_backed: row.sponsor_backed,
    summary: scrubNames(row.summary, [
      [row.company, "the company"],
      [row.sponsor ?? "", "the sponsor"],
    ]),
  };
}

/* --------------------------------------------------------------------------
   Name scrubbing. The locked row shows the summary but not who it is about,
   so every mention of the company or its sponsor inside the summary text is
   replaced with a neutral phrase. Matches are case-insensitive and whole-word
   (so "Cordia's plants" → "the company's plants"), and each name is also
   matched without its corporate suffix ("Cordia Energy" → "Cordia") because
   that is how a summary usually refers to it. This catches direct mentions
   only: a summary that identifies its subject some other way is Fairlead's
   to reword in the hub.
   -------------------------------------------------------------------------- */

const CORPORATE_SUFFIX =
  /^(inc|incorporated|llc|l\.l\.c|lp|l\.p|llp|plc|ltd|limited|co|corp|corporation|company|holdings|holdco|group|partners|capital|management|energy|resources|services|solutions|systems|technologies|industries|international|ventures|fund|equity)\.?$/i;

/**
 * A name and every suffix-stripped stem of it, longest first: "Cordia Energy
 * Holdings, LLC" → ["Cordia Energy Holdings, LLC", "Cordia Energy Holdings",
 * "Cordia Energy", "Cordia"]. Exported for tests.
 */
export function nameVariants(name: string): string[] {
  const full = name.trim().replace(/\s+/g, " ");
  if (!full) return [];
  const out = new Set<string>([full]);
  const words = full.replace(/^the\s+/i, "").split(" ");
  const add = () => {
    const stem = words.join(" ").replace(/[,&]+$/, "");
    // Never a stem that is itself a generic word ("Energy Partners" → "Energy" would scrub every "energy").
    if (stem.length >= 3 && stem.toLowerCase() !== full.toLowerCase() && !CORPORATE_SUFFIX.test(stem)) out.add(stem);
  };
  add();
  // Peel trailing suffixes one at a time, keeping each intermediate form —
  // a summary may say "Cordia Energy" or just "Cordia".
  while (words.length > 1) {
    const last = words[words.length - 1].replace(/[,&]+$/, "");
    if (!last || CORPORATE_SUFFIX.test(last)) {
      words.pop();
      add();
    } else break;
  }
  return [...out].sort((a, b) => b.length - a.length);
}

/** Matches a run of corporate-suffix words after a name, so "Riverstone Holdings" folds into "Riverstone". */
const TRAILING_SUFFIX = String.raw`(?:[,\s]+(?:${CORPORATE_SUFFIX.source.slice(2, -5)})\.?(?![A-Za-z0-9]))*`;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replace every whole-word mention of each name (and its stem) in `text`. */
export function scrubNames(text: string, names: [name: string, replacement: string][]): string {
  let out = text ?? "";
  for (const [name, replacement] of names) {
    for (const variant of nameVariants(name)) {
      const re = new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(variant)}(?![A-Za-z0-9])${TRAILING_SUFFIX}`, "gi");
      out = out.replace(re, (_m, offset: number, whole: string) => {
        const before = whole.slice(0, offset).replace(/[\s"'“‘(]+$/, "");
        const sentenceStart = before === "" || /[.!?]$/.test(before);
        return sentenceStart ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
      });
    }
  }
  return out;
}

export type RegisterFilters = { work?: string; sector?: string; status?: string };

export function matchesFilters(r: RegisterPublicRow, f: RegisterFilters): boolean {
  if (f.work && !r.work.includes(f.work as RegisterWork)) return false;
  if (f.sector && r.sector !== f.sector) return false;
  if (f.status && r.status !== f.status) return false;
  return true;
}

export function filterRegister<T extends RegisterPublicRow>(rows: T[], f: RegisterFilters): T[] {
  return rows.filter((r) => matchesFilters(r, f));
}

/* --------------------------------------------------------------------------
   One register. The page renders a single list: the case studies Fairlead is
   cleared to name, then every other hub row — locked unless the browser holds
   a verified grant. Case studies are mapped onto the register's taxonomy so
   the filters and the numbering run across the whole list.
   -------------------------------------------------------------------------- */

export type RegisterItem =
  | { kind: "featured"; row: RegisterPublicRow; engagement: Engagement }
  | { kind: "locked"; row: RegisterPublicRow }
  | { kind: "unlocked"; row: RegisterRow };

const ENERGY_SECTORS = new Set(["energy", "renewables", "district-energy", "energy-storage", "oilfield-services", "infrastructure"]);

const ROLE_WORK: Record<EngagementRole, RegisterWork> = {
  "Interim CEO": "leadership",
  "Interim CFO": "leadership",
  "Interim COO": "leadership",
  Controller: "leadership",
  Board: "leadership",
  "Operating Partner": "operating-partner",
  "M&A": "m-and-a",
  Restructuring: "advisory",
};

export function featuredSector(e: Engagement): RegisterSector {
  if (e.sponsor_type === "VC") return "venture";
  if (e.sponsor_type === "Family office") return "family-office";
  return ENERGY_SECTORS.has(e.sector) ? "energy" : "other";
}

export function featuredWork(e: Engagement): RegisterWork[] {
  return WORK.map((w) => w.slug).filter((slug) => e.roles.some((r) => ROLE_WORK[r] === slug));
}

/** A case study as a register item. Negative ids keep clear of the hub's. */
export function featuredItem(e: Engagement, i: number): RegisterItem {
  return {
    kind: "featured",
    engagement: e,
    row: {
      id: -(i + 1),
      index: i + 1,
      sector: featuredSector(e),
      status: e.year_end === null ? "active" : "historical",
      work: featuredWork(e),
      sponsor_backed: e.sponsor_type !== "Corporate",
      summary: e.summary_md,
    },
  };
}

function sameCompany(a: string, b: string): boolean {
  const va = new Set(nameVariants(a).map((s) => s.toLowerCase()));
  return nameVariants(b).some((v) => va.has(v.toLowerCase()));
}

/**
 * Drop the hub rows a named case study already covers, so the list has one
 * row per company. Compares the CONFIDENTIAL company name server-side; the
 * result is redacted or rendered exactly as before, so nothing new leaves.
 * Anonymised case studies can't be matched and are left alone.
 */
export function withoutFeatured<T extends { company: string }>(rows: T[], featured: Engagement[]): T[] {
  const named = featured.filter((e) => !e.anonymized);
  return rows.filter((r) => !named.some((e) => sameCompany(e.company_display, r.company)));
}

/** Number the combined list 1…n in display order. */
export function renumber(items: RegisterItem[]): RegisterItem[] {
  return items.map((it, i) => ({ ...it, row: { ...it.row, index: i + 1 } }) as RegisterItem);
}

export function filterItems(items: RegisterItem[], f: RegisterFilters): RegisterItem[] {
  return items.filter((it) => matchesFilters(it.row, f));
}

export function registerStats<T extends RegisterPublicRow>(rows: T[]) {
  return {
    total: rows.length,
    active: rows.filter((r) => r.status === "active").length,
    sponsorBacked: rows.filter((r) => r.sponsor_backed).length,
  };
}

/* --------------------------------------------------------------------------
   Redaction geometry. The locked row draws the company name and summary as
   runs of bars. Their widths come from a hash of the ROW ID, never from the
   text — so the bar pattern says nothing about how long a name is, how many
   words a summary has, or which rows share a sponsor. Deterministic so SSR
   and hydration agree.
   -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RedactionShape = { title: number[]; lines: number[][] };

/** Bar widths in % for a row: 2–3 title bars, 2 summary lines of 3–5 bars. */
export function redactionShape(id: number): RedactionShape {
  const rnd = mulberry32(id * 2654435761 + 97);
  const run = (count: number, min: number, max: number, total: number) => {
    const raw = Array.from({ length: count }, () => min + rnd() * (max - min));
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map((w) => Math.round((w / sum) * total * 10) / 10);
  };
  const titleCount = 2 + Math.floor(rnd() * 2); // 2–3
  const title = run(titleCount, 1, 3, 58 + rnd() * 20); // 58–78% of the measure
  const lines = [run(4 + Math.floor(rnd() * 2), 1, 4, 96), run(3 + Math.floor(rnd() * 2), 1, 4, 52 + rnd() * 30)];
  return { title, lines };
}
