-- ============================================================================
-- Engagement register visibility — applied to the ENGAGEMENT HUB's Supabase
-- project (github.com/mattfairlead/fairlead), where `engagements` lives.
-- ============================================================================
-- Kept here for the record: this is the hub's table, and the migration belongs
-- in the hub repo's supabase/migrations/ alongside 20260902000001_website_visibility.sql
-- (the team_members equivalent). It was applied to the live project as
-- `engagements_website_visibility` on 2026-09-04.
--
-- The website (app/engagements) reads this table SERVER-SIDE with the service
-- role — deliberately no anon policy: company names, sponsors and summaries
-- must never be readable with the public anon key. Rows with the flag off are
-- withheld from the site entirely; rows with it on appear locked until a
-- visitor verifies their email (lib/register-access.ts).
--
-- Safe to re-run.

ALTER TABLE engagements
  ADD COLUMN IF NOT EXISTS show_on_website BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS engagements_website_idx
  ON engagements (sort_order, id) WHERE show_on_website;

COMMENT ON COLUMN engagements.show_on_website IS
  'Checked → engagement appears (locked) in the register on fairleadadvisors.com/engagements. Read server-side by the website with the service role; never exposed to the anon key.';
