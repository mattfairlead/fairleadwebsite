import type {
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
 * tags, an index, a sponsor-backed flag) and RegisterRow (that plus company,
 * sponsor and summary). Pages render the public shape unless
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
 * cannot ride along into the locked HTML.
 */
export function redact(row: RegisterPublicRow): RegisterPublicRow {
  return {
    id: row.id,
    index: row.index,
    sector: row.sector,
    status: row.status,
    work: [...row.work],
    sponsor_backed: row.sponsor_backed,
  };
}

export type RegisterFilters = { work?: string; sector?: string; status?: string };

export function filterRegister<T extends RegisterPublicRow>(rows: T[], f: RegisterFilters): T[] {
  let out = rows;
  if (f.work) out = out.filter((r) => r.work.includes(f.work as RegisterWork));
  if (f.sector) out = out.filter((r) => r.sector === f.sector);
  if (f.status) out = out.filter((r) => r.status === f.status);
  return out;
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
