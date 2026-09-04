import { getSupabase } from "@/lib/supabase";
import type { Engagement, HubTeamRow, Perspective, Sector, TeamMember } from "@/lib/types";
import { HUB_TEAM_COLUMNS, mapHubMember, sortHubRows } from "@/lib/team";
import { team as seedTeam } from "@/content/seed/team";
import { engagements as seedEngagements } from "@/content/seed/engagements";
import { sectors as seedSectors } from "@/content/seed/sectors";
import { perspectives as seedPerspectives } from "@/content/seed/perspectives";

/**
 * Content accessors.
 *
 * Team is live: it reads the engagement hub's `team_members` table
 * (github.com/mattfairlead/fairlead) with the anon key. RLS on that table
 * only exposes rows whose "Website" checkbox is on, so the query needs no
 * filter of its own — the `.eq` below is belt-and-braces. Without env vars
 * (local dev, CI) the seed snapshot in content/seed/team.ts is served through
 * the same mapping, so pages never know the difference.
 *
 * Engagements, sectors and perspectives are still seed-backed: the hub's
 * `engagements` table is the internal tracker (a different shape, not
 * public), and the website-shaped tables in supabase/schema.sql have not
 * been provisioned. Each accessor tries Supabase first and falls back to seed
 * on an error or an empty result, so provisioning them later is zero-code.
 */

export async function getTeam(): Promise<TeamMember[]> {
  const sb = getSupabase();
  let rows: HubTeamRow[] | null = null;
  if (sb) {
    const { data, error } = await sb
      .from("team_members")
      .select(HUB_TEAM_COLUMNS)
      .eq("show_on_website", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) {
      console.warn("[data] team_members read failed — serving seed roster:", error.message);
    } else {
      rows = (data ?? []) as unknown as HubTeamRow[];
    }
  }
  if (!rows) rows = seedTeam.filter((r) => r.show_on_website);
  return sortHubRows(rows).map(mapHubMember);
}

export async function getTeamMember(slug: string): Promise<TeamMember | null> {
  const all = await getTeam();
  return all.find((m) => m.slug === slug) ?? null;
}

/** Supabase rows if the table exists and has visible content; otherwise the seed. */
async function supabaseOrSeed<T>(
  table: string,
  seed: () => T[],
  build: (q: ReturnType<NonNullable<ReturnType<typeof getSupabase>>["from"]>) => PromiseLike<{
    data: unknown;
    error: { message: string } | null;
  }>
): Promise<T[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await build(sb.from(table));
    if (!error && Array.isArray(data) && data.length > 0) return data as T[];
    if (error) console.warn(`[data] ${table} read failed — serving seed:`, error.message);
  }
  return seed();
}

export async function getSectors(): Promise<Sector[]> {
  return supabaseOrSeed<Sector>(
    "sectors",
    () => [...seedSectors].sort((a, b) => a.sort - b.sort),
    (q) => q.select("*").order("sort")
  );
}

export async function getEngagements(filters?: {
  sector?: string;
  role?: string;
  sponsorType?: string;
  outcome?: string;
  featuredOnly?: boolean;
}): Promise<Engagement[]> {
  let rows = await supabaseOrSeed<Engagement>(
    "engagements",
    () => seedEngagements.filter((e) => e.visible),
    (q) => q.select("*").eq("visible", true).order("year_start", { ascending: false })
  );

  if (filters?.featuredOnly) rows = rows.filter((e) => e.featured);
  if (filters?.sector) rows = rows.filter((e) => e.sector === filters.sector);
  if (filters?.role) rows = rows.filter((e) => e.roles.includes(filters.role as Engagement["roles"][number]));
  if (filters?.sponsorType) rows = rows.filter((e) => e.sponsor_type === filters.sponsorType);
  if (filters?.outcome)
    rows = rows.filter((e) => e.outcome_tags.includes(filters.outcome as Engagement["outcome_tags"][number]));
  return rows;
}

export async function getEngagement(slug: string): Promise<Engagement | null> {
  const all = await getEngagements();
  return all.find((e) => e.slug === slug) ?? null;
}

export async function getPerspectives(kind?: "perspective" | "transaction"): Promise<Perspective[]> {
  const rows = await supabaseOrSeed<Perspective>(
    "perspectives",
    () =>
      seedPerspectives
        .filter((p) => p.visible)
        .sort((a, b) => b.published_at.localeCompare(a.published_at)),
    (q) => q.select("*").eq("visible", true).order("published_at", { ascending: false })
  );
  return kind ? rows.filter((p) => p.kind === kind) : rows;
}

export async function getPerspective(slug: string): Promise<Perspective | null> {
  const all = await getPerspectives();
  return all.find((p) => p.slug === slug) ?? null;
}

/* ==========================================================================
   Engagement register — the hub's `engagements` table, every row, read with
   the service role and cached under the "engagements" tag (the hub's
   revalidate call clears it; 5 minutes is the safety net). The page decides
   per request whether the visitor holds a grant (lib/register-access.ts)
   and renders either the full rows or their redaction — the redaction is
   computed here, on the server, from named public fields only, and the
   public summary has the company and sponsor names scrubbed before it
   leaves the server.
   ========================================================================== */

import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { HubEngagementRow, RegisterPublicRow, RegisterRow } from "@/lib/types";
import { HUB_ENGAGEMENT_COLUMNS, mapHubEngagements, redact } from "@/lib/register";
import { register as seedRegister } from "@/content/seed/register";

const readHubEngagements = unstable_cache(
  async (): Promise<HubEngagementRow[] | null> => {
    const sb = getSupabaseAdmin();
    if (!sb) return null;
    const { data, error } = await sb
      .from("engagements")
      .select(HUB_ENGAGEMENT_COLUMNS)
      .eq("show_on_website", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) {
      console.warn("[data] engagements read failed — serving the public-safe snapshot:", error.message);
      return null;
    }
    return (data ?? []) as unknown as HubEngagementRow[];
  },
  ["hub-engagements"],
  { tags: ["engagements"], revalidate: 300 }
);

export type RegisterLoad =
  | { live: true; rows: RegisterRow[]; publicRows: RegisterPublicRow[] }
  | { live: false; rows: null; publicRows: RegisterPublicRow[] };

/**
 * `rows` (the confidential shape) is only present when the hub is reachable;
 * `publicRows` always is. Callers render `rows` ONLY behind a verified grant.
 */
export async function loadRegister(): Promise<RegisterLoad> {
  const hub = await readHubEngagements();
  if (!hub) return { live: false, rows: null, publicRows: seedRegister };
  const rows = mapHubEngagements(hub);
  return { live: true, rows, publicRows: rows.map(redact) };
}
