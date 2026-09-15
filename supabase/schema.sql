-- Fairlead Advisors content schema — §7 of the redesign plan.
-- Public read where visible = true; writes only via service role
-- (the marketing hub, Phase 2).
--
-- TEAM AND PERSPECTIVES ARE NOT HERE. Both are read live from the engagement
-- hub's tables in the same Supabase project (github.com/mattfairlead/fairlead):
--   • `team_members` — supabase/migrations/20260902000001_website_visibility.sql
--     adds `show_on_website` (the "Website" checkbox on each hub team card) and
--     an anon SELECT policy scoped to checked rows; lib/team.ts maps the row
--     onto the website's TeamMember shape.
--   • `perspectives` — supabase/migrations/20260915000001_website_perspectives.sql
--     creates the table the hub's Perspectives module edits, with the same
--     `show_on_website` + anon SELECT pattern; lib/perspectives.ts maps the row
--     onto the website's Perspective shape.
-- Nothing below needs to exist for /team or /perspectives.
--
-- The tables below (sectors, engagements) are NOT yet provisioned in that
-- project; lib/data.ts serves the seed content until they are.

create table sectors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort int not null default 0
);

create table engagements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  company_display text not null,
  sponsor_display text not null,
  sponsor_type text not null,
  sector text not null references sectors (slug),
  roles text[] not null default '{}',
  outcome_tags text[] not null default '{}',
  headline_metric text not null default '',
  summary_md text not null default '',
  body_md text,
  year_start int not null,
  year_end int,
  featured boolean not null default false,
  anonymized boolean not null default false,
  visible boolean not null default true
);

-- Row-level security: public read where visible = true.
alter table sectors enable row level security;
alter table engagements enable row level security;

create policy "public read sectors" on sectors for select using (true);
create policy "public read engagements" on engagements for select using (visible = true);
