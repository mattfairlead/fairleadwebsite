import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is the content backend (§7): team, engagements, perspectives,
 * sectors. Public pages read with the anon key under RLS (`visible = true`);
 * the marketing hub writes with the service role.
 *
 * When the env vars are absent (local dev, preview before the project is
 * provisioned), lib/data.ts falls back to the seed content in /content/seed —
 * same shapes, zero code change for pages.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
