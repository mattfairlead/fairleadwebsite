# fairleadadvisors.com

From-scratch rebuild of the Fairlead Advisors website — **the embedded
operating platform for PE-backed companies.** Built to the spec in
[`FAIRLEAD_WEBSITE_REDESIGN_PLAN.md`](./FAIRLEAD_WEBSITE_REDESIGN_PLAN.md).

## Stack

- **Next.js 15** (App Router, RSC) + TypeScript
- **Tailwind v4** with the §5.1 tokens as CSS variables (`app/globals.css`)
- **GSAP 3.15** + ScrollTrigger + ScrollSmoother + SplitText + ScrollToPlugin
  via `@gsap/react` — constants and choreography in `lib/motion.ts` (§5.4/§5.8)
- **Supabase** — `/team` reads the engagement hub's `team_members` table live
  (see *Team content* below) and `/engagements` reads its `engagements` table
  server-side as a locked register (see *Engagement register* below); other
  content is seed-backed until the tables in `supabase/schema.sql` are
  provisioned. Without env vars the site serves `content/seed/` — identical
  shapes
- **SendGrid** for the contact form + newsletter (HubSpot is sunset); sends
  are skipped and logged when unconfigured, so previews work
- **Vercel** hosting; 301 redirects from the legacy WordPress URLs in
  `content/redirects.ts` (§3)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (24 routes)
npm run typecheck  # tsc --noEmit
npm run lint
```

Copy `.env.example` → `.env.local` and fill in what you have. Everything
degrades gracefully when unset.

## Where things live

```
app/                 routes (/, /platform, /intelligence, /engagements[/slug],
                     /team, /perspectives[/slug], /contact, /careers)
app/api/             contact, subscribe, ask (Phase 2 stub), revalidate,
                     register/request (the reveal form)
app/engagements/     unlock (the emailed link → grant cookie), lock (clears it)
components/register/ RegisterRow, Redacted, RevealModal/Provider/Button, Decode
lib/register.ts      hub `engagements` row → RegisterRow / RegisterPublicRow (redaction)
lib/register-access.ts  signed link + grant tokens, the grant cookie
components/          Hero, GlassStrip, HairlineFrame, SectionReveal, ...
lib/motion.ts        GSAP constants + sectionReveal()/pulseDots()/headerIntro()
lib/data.ts          content accessors (Supabase, seed fallback)
content/seed/        engagements, sectors, perspectives seed data; team = hub snapshot
lib/team.ts          hub `team_members` row → TeamMember (slug, title/credentials, group)
app/api/team/photo/  serves hub headshots (stored inline as base64) with CDN caching
content/redirects.ts legacy WordPress 301 map
supabase/schema.sql  content schema + RLS policies
```

## Team content

The roster on `/team` is owned by the engagement hub
([mattfairlead/fairlead](https://github.com/mattfairlead/fairlead)) — one
Supabase project, one `team_members` table, no sync job:

1. In the hub's **Team** module every card has a **Website** checkbox
   (`team_members.show_on_website`). Checked = on the site.
2. A row-level policy exposes only checked rows to the anon key, so this site
   reads `team_members` directly (`lib/data.ts → getTeam`) with no filter of
   its own to get wrong. Name, title/credentials (`suffix`), the roles line,
   the extended bio, the headshot and the sort order all come from the hub;
   `lib/team.ts` maps them onto the site's `TeamMember` shape and decides who
   is a partner (a bare "Partner" in the suffix).
3. Headshots are stored in the hub inline as data URLs, so the site lists the
   roster with a `has_photo` flag and serves each image through
   `/api/team/photo/[id]` with long cache headers.
4. Flipping the checkbox (or saving a bio / uploading a photo) makes the hub
   call this site's `POST /api/revalidate` with `REVALIDATE_SECRET`, so the
   page updates within seconds; `revalidate = 300` on the page is the safety
   net.

`content/seed/team.ts` is a snapshot of the hub table for previews without
env vars. To refresh it, run this in the hub project's SQL editor and paste
the rows back in the same shape:

```sql
select id, name, suffix, roles, sort_order, extended_bio
from team_members order by sort_order, id;
```

## Engagement register

`/engagements` renders **every** row of the hub's `engagements` table as a
locked register — sector, status, work-type tags, a sponsor-backed flag and
the summary (with the company and sponsor names scrubbed out, see
`scrubNames` in `lib/register.ts`) are public; the company and its sponsor
are not. A visitor reveals the names by asking for them:

1. **Reveal** (any locked row, or the header CTA) opens a sheet: name, firm,
   role, work email, an optional line. `POST /api/register/request`.
2. The visitor gets an email with a **48-hour link** (an HMAC-signed token,
   `ENGAGEMENTS_SECRET`). Fairlead gets "Register access requested — …" on
   the `CONTACT_TO` list, with everything they typed.
3. Opening the link (`/engagements/unlock`) sets a **30-day grant cookie**
   (httpOnly, signed) for that browser, emails Fairlead "Register unlocked —
   …", and bounces back to `/engagements?unlocked=1#register`, where the
   names decode out of their redaction. "Lock this browser" clears it.

Why it can't be worked around from the browser: the page is rendered per
request on the server, and the confidential fields **only enter the render
tree when the cookie's signature verifies**. The locked view is built from
`RegisterPublicRow`, a type with no field that could hold a name; the
redaction bars are drawn from a hash of the row id, not the text (so bar
widths say nothing about name length); nothing is blurred, hidden with CSS,
or shipped as JSON. The scrub replaces whole-word, case-insensitive mentions
of the company and the fund (and each without its corporate suffix) with
"the company" / "the sponsor" — it does not catch a summary that identifies
its subject some other way, so summaries in the hub should be written to
read anonymously. The hub table has **no anon RLS policy** — the site reads
it with `SUPABASE_SERVICE_ROLE_KEY`, server-only, and the anon key in the
client bundle cannot read it at all. Without the secret, production refuses
to issue grants; without the service key, the public-safe snapshot in
`content/seed/register.ts` is served and nothing can unlock.

Abuse controls on the request route: honeypot field, per-IP and per-address
hourly rate limits, length caps on every field. `ENGAGEMENTS_REVEAL_MODE=instant`
skips the email step (weaker; for a trial only).

Rows come from the hub with `show_on_website = true`
(`supabase/hub_engagements_website.sql`, applied to the hub project; default
true, so the register is the whole tracker until a row is unchecked). The
read is cached under the `engagements` tag for 5 minutes; the hub's
`POST /api/revalidate` with `/engagements` in `paths` clears it.

## Design system in one paragraph

Fully dark (`--blue-950` ground), Inter only, personality from weight 600 +
negative tracking (plus Inter's `cv11`/`ss03` alternates). Gold (`#D5B371`)
is the only accent, used sparingly. Cards never have fills or radii — cells
are separated by absolutely-positioned 1px hairlines (`.dec`) that draw
themselves in on scroll (`sectionReveal()`, §5.8.2: horizontals at `e`,
verticals at `e+.48`, cells at `e+.24+.3i`). Buttons are pills with spring
physics (hover lifts + gold glow, click compresses); inputs are underlines
whose gold rule draws in from the left on focus; hairline cells are
`.spot` surfaces that light under the cursor. The page sits on an ambient
layer (`.ambient`: two slow light sources + 4% film grain). Every reveal is
`once: true`; the generic `data-anim` reveals are wired per route by
`app/template.tsx`, so navigations animate in too. Only the live dots, the
ambient drift, the hero scroll cue, and the submit spinner loop. Reduced
motion kills ScrollSmoother, skips every hidden initial state, and renders
the resolved layout.

## Phase status (§8)

- **Phase 1 (this build):** all seven routes + careers, design system, motion
  system, redirects, SEO (sitemap/robots/JSON-LD/OG), contact + newsletter
  APIs, Supabase schema + seed content. **Launchable pending content
  resolutions below.**
- **Phase 2:** Ask Fairlead command bar (trigger + `/api/ask` stubbed behind
  `NEXT_PUBLIC_ASK_ENABLED=false`), Cottonwood `pin-steps` interactive
  reveal, Solaris demo reel embed, marketing-hub write path.
- **Phase 3:** newsletter automation, per-audience landing variants. (The
  full engagement import is superseded by the live register above.)

## Before launch — content owners (§9)

Search the repo for `TODO` — every open item is marked in place. Highlights:
photography (blue-hour infrastructure stills replace the gradient stand-ins
in `components/ImageBand.tsx`), the Dion Leadership testimonial still
(`public/engagements/dion-leadership-steve.jpg` — the graded monogram stands in
until it lands), the confirmed 16-sector list, the full team
roster + bios, GRP's tax-equity figure, Cottonwood/Dominion naming clearance,
the `info@` distribution list (then set `CONTACT_TO`), and the transaction
archive import.
