import type { RegisterPublicRow } from "@/lib/types";

/**
 * Public-safe snapshot of the engagement hub's `engagements` table — the
 * fields every visitor may see (sector, status, work-type, sponsor-backed
 * flag) and NOTHING else. No company, sponsor or summary lives in this repo;
 * those come from the hub at request time (lib/data.ts → loadRegister). The
 * name-scrubbed summary is public on the live site; the names only reach a
 * browser that holds a verified grant. Here `summary` is empty, so the
 * locked row falls back to its redaction bars.
 *
 * Served when SUPABASE_SERVICE_ROLE_KEY is unset (local dev, CI), so the
 * locked register still lays out at full length. Refresh with:
 *
 *   select id, sort_order, sector, key_symbols, status,
 *          (coalesce(pe_fund,'') <> '') as sponsor_backed
 *   from engagements where show_on_website order by sort_order, id;
 *
 * Snapshot: 2026-09-04.
 */
type Snap = [id: number, sector: string, symbols: string, status: string, sponsorBacked: 0 | 1];

const SNAPSHOT: Snap[] = [
  [1, "Other", "▲", "Historical", 0],
  [2, "Other", "◼⚑", "", 0],
  [3, "VC", "◼", "Active", 1],
  [4, "Energy", "◼▲", "Historical", 1],
  [5, "Energy", "⚑", "", 0],
  [6, "Energy", "◆▲", "Active", 1],
  [7, "VC", "▲◼", "Historical", 1],
  [8, "Energy", "▲", "Historical", 0],
  [9, "VC", "◼", "Active", 0],
  [10, "Energy", "⬤", "Historical", 1],
  [11, "Other", "⬤", "", 1],
  [12, "Energy", "◆◼", "Active", 1],
  [13, "Other", "▲", "Active", 0],
  [14, "Family Office", "▲◼", "Active", 1],
  [15, "Other", "▲◆⬤", "Historical", 1],
  [16, "VC", "◼▲", "Active", 1],
  [17, "Energy", "▲◼◆", "Historical", 1],
  [18, "Energy", "◆◼", "Active", 1],
  [19, "Energy", "⚑", "Active", 1],
  [20, "Energy", "▲", "Historical", 1],
  [21, "Other", "◆⬤", "Historical", 1],
  [22, "Other", "▲◆", "Historical", 1],
  [23, "Energy", "▲◼", "Historical", 1],
  [24, "VC", "◼⬤", "Historical", 1],
  [25, "VC", "◼◆", "Historical", 1],
  [26, "Energy", "⚑", "Historical", 0],
  [27, "Energy", "◼▲◆⬤", "Historical", 1],
  [28, "Energy", "▲◆⬤", "Historical", 1],
  [29, "Other", "▲", "Historical", 0],
  [30, "VC", "▲◼", "Historical", 0],
  [31, "Energy", "◼", "Active", 1],
  [32, "Energy", "◼", "Active", 1],
  [33, "Energy", "⚑", "Active", 0],
  [34, "VC", "◼▲⬤", "Historical", 1],
  [35, "Other", "◼", "Historical", 0],
  [36, "Energy", "⚑", "Historical", 0],
  [37, "Energy", "⬤", "Historical", 1],
  [38, "Energy", "⚑", "", 1],
  [39, "Energy", "▲◆⬤", "Historical", 1],
  [40, "Energy", "⬤", "Historical", 1],
  [41, "Energy", "▲◼◆", "Historical", 1],
  [42, "Energy", "◆▲◼", "Active", 1],
  [43, "Energy", "▲", "Historical", 0],
  [44, "Energy", "▲◼", "Active", 1],
  [45, "Energy", "⬤", "Historical", 0],
  [46, "Other", "◆◼", "Active", 1],
  [47, "VC", "◼", "Historical", 1],
  [48, "Energy", "⚑", "Historical", 0],
  [49, "Energy", "◼▲⚑", "Active", 0],
  [50, "Energy", "⚑", "", 0],
  [51, "VC", "▲◼⬤", "Historical", 1],
  [52, "VC", "◼", "Historical", 1],
  [53, "Energy", "◆", "Historical", 1],
  [54, "Energy", "⬤", "Historical", 0],
  [55, "Other", "◆▲", "", 1],
  [56, "VC", "◼▲", "Historical", 0],
  [57, "Energy", "▲◼◆⬤", "Historical", 1],
  [58, "Energy", "▲", "", 1],
  [59, "VC", "◼▲⬤", "Historical", 1],
  [60, "VC", "◼▲", "Historical", 0],
  [61, "VC", "⬤", "Historical", 1],
  [62, "Other", "▲", "Historical", 0],
  [63, "Other", "◆", "Active", 1],
  [64, "Energy", "⚑", "Active", 1],
  [66, "VC", "◼▲", "Historical", 1],
  [67, "Other", "◆◼", "", 1],
  [68, "Energy", "▲", "Historical", 0],
  [69, "VC", "◼", "Historical", 1],
  [70, "Energy", "◆⬤▲", "Active", 1],
  [71, "Energy", "◼◆", "Historical", 1],
  [72, "Other", "▲", "Historical", 0],
  [73, "Energy", "▲◼⬤", "Historical", 1],
  [74, "Other", "◆▲", "", 1],
  [75, "Other", "◼◆", "Active", 1],
  [76, "Energy", "⬤⚑", "Historical", 1],
  [77, "Energy", "▲⬤", "Historical", 1],
  [80, "Energy", "▲⚑", "Active", 1],
  [81, "Other", "◼⚑", "Active", 1],
  [82, "Energy", "◆⬤⚑", "Active", 0],
];

import { parseSector, parseStatus, parseWork } from "@/lib/register";

export const register: RegisterPublicRow[] = SNAPSHOT.map(([id, sector, symbols, status, sponsor], i) => ({
  id,
  index: i + 1,
  sector: parseSector(sector),
  status: parseStatus(status),
  work: parseWork(symbols),
  sponsor_backed: sponsor === 1,
  summary: "",
}));
