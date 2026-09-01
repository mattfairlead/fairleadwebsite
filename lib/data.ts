import { getSupabase } from "@/lib/supabase";
import type { Engagement, Perspective, Sector, TeamMember } from "@/lib/types";
import { team as seedTeam } from "@/content/seed/team";
import { engagements as seedEngagements } from "@/content/seed/engagements";
import { sectors as seedSectors } from "@/content/seed/sectors";
import { perspectives as seedPerspectives } from "@/content/seed/perspectives";

/**
 * Content accessors. Reads Supabase when NEXT_PUBLIC_SUPABASE_* are set,
 * otherwise serves the local seed content — identical shapes, so pages
 * never know the difference. RLS on the Supabase side enforces
 * `visible = true` for the anon key; the seed path filters here.
 */

export async function getTeam(): Promise<TeamMember[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("team")
      .select("*")
      .eq("visible", true)
      .order("sort", { ascending: true });
    if (!error && data) return data as TeamMember[];
  }
  return seedTeam.filter((m) => m.visible).sort((a, b) => a.sort - b.sort);
}

export async function getTeamMember(slug: string): Promise<TeamMember | null> {
  const all = await getTeam();
  return all.find((m) => m.slug === slug) ?? null;
}

export async function getSectors(): Promise<Sector[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from("sectors").select("*").order("sort");
    if (!error && data) return data as Sector[];
  }
  return [...seedSectors].sort((a, b) => a.sort - b.sort);
}

export async function getEngagements(filters?: {
  sector?: string;
  role?: string;
  sponsorType?: string;
  outcome?: string;
  featuredOnly?: boolean;
}): Promise<Engagement[]> {
  const sb = getSupabase();
  let rows: Engagement[];
  if (sb) {
    const { data, error } = await sb
      .from("engagements")
      .select("*")
      .eq("visible", true)
      .order("year_start", { ascending: false });
    rows = !error && data ? (data as Engagement[]) : [];
  } else {
    rows = seedEngagements.filter((e) => e.visible);
  }

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
  const sb = getSupabase();
  let rows: Perspective[];
  if (sb) {
    const { data, error } = await sb
      .from("perspectives")
      .select("*")
      .eq("visible", true)
      .order("published_at", { ascending: false });
    rows = !error && data ? (data as Perspective[]) : [];
  } else {
    rows = seedPerspectives
      .filter((p) => p.visible)
      .sort((a, b) => b.published_at.localeCompare(a.published_at));
  }
  return kind ? rows.filter((p) => p.kind === kind) : rows;
}

export async function getPerspective(slug: string): Promise<Perspective | null> {
  const all = await getPerspectives();
  return all.find((p) => p.slug === slug) ?? null;
}
