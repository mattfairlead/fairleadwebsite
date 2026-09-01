# Fairlead Advisors — Website Redesign Plan & Build Brief

**Prepared by:** EatCrayons (Matt Faria) · **Date:** September 1, 2026 · **v2** — design system re-based on vita-travel.webflow.io
**Purpose:** Strategy + build specification for a from-scratch rebuild of fairleadadvisors.com, deployable via Claude Code → GitHub → Vercel.
**Why now:** Fairlead's positioning moved from "fractional CFO / operating partner services" to **The Embedded Operating Platform for PE-backed companies — executive intelligence + artificial intelligence, working inside the portfolio.** The current site says none of this.

---

## 0. TL;DR for the build agent

- Build a **Next.js (App Router) + Tailwind** site on **Vercel**, content-backed by **Supabase** (team, engagements, perspectives) so bios and engagement summaries update without a deploy. Forms go to **SendGrid/Resend**, not HubSpot (HubSpot is being sunset).
- Seven routes: `/` `/platform` `/intelligence` `/engagements` `/team` `/perspectives` `/contact` (+ `/careers` lightweight).
- Brand: deep royal blue / gold, fully dark, Inter only, hairline grid. Visual/motion language cloned from vita-travel.webflow.io (see §5). Feel: **quiet, expensive, precise.** Not a SaaS landing page.
- Motion: GSAP + ScrollTrigger + ScrollSmoother + SplitText, using the reference site's exact eases, durations, and staggers (§5.4), and its line-draw / glass-strip choreography as a reusable `sectionReveal()` timeline (§5.8). The detail floor in §5.9 is acceptance criteria.
- One signature interactive element (the "Visibility" hero) and one differentiated AI surface (**Ask Fairlead** command bar — not a bottom-right chatbot).
- The word "AI" appears in body copy, not headlines. The site *demonstrates* AI fluency; it does not announce it.
- Ship in three phases; Phase 1 is a complete, launchable site.

---

## 1. Where we are — current site audit (fairleadadvisors.com, WordPress)

Crawled 9/1/26. Problems, in priority order:

| Issue | Evidence | Impact |
|---|---|---|
| **Positioning is a generation old** | Hero: "Your partner in achieving success." Footer tagline: "Comprehensive Operating Partner Services." | Site contradicts the deck partners are now presenting to KKR/Carlyle/Ares-tier sponsors. |
| **SEO metadata is wrong** | `<title>` is "Investment Management Services"; meta description says "investment management solutions." | Google thinks Fairlead is a wealth manager. Zero-cost, high-impact fix. |
| **Zero evidence of technology** | No mention of Solaris, Sherpa, Working Capital Wizard, board report generator, or the tools.fairleadadvisors.com portal. | The single biggest differentiator in the deck is invisible online. |
| **"Success Stories" is a press-release dump** | 27 reposted third-party press releases back to 2010 (MXenergy, Ford, K.A.CARE...). Only 2–3 are actual Fairlead-authored case studies. | Buries real proof (Cordia/KKR, Cadre, GRP/Ares, Nirenberg, Dion). Reads like a scrapbook. |
| **Team page is a 6,000-word scroll** | 20 full bios on one page, inconsistent titles (Alex: "Vice President" heading vs "Director" caption; Adam Vosker: "Senior Advisor" in copy vs "Senior Consultant" in title), typos ("Ms. Salgo," "Jamie/Jaime"). | Undermines the "precision" the brand sells. |
| **Numbers don't reconcile** | Services page: "over 100 engagements"; deck: "60+ embedded engagements"; Who We Are: "In 2008..." vs "Since 2010"; "$1..35B in gross proceeds" (typo). | Sponsors notice. See §9 for resolution list. |
| **Footer leaks** | Four personal partner emails, a fax number, a Houston mailing address as primary. | Spam magnet; reads dated. |
| **Industries page is a legacy taxonomy** | Energy / Venture-Stage / District Energy / Industrial Processing. Deck says 16 sectors incl. biotech, AI, infrastructure. | Narrows perceived scope. |
| **No interactivity, no motion, no demo** | Static Beaver Builder page with a GIF. | Nothing on the page suggests the firm builds software. |

**What's worth keeping:** the origami visual system (boat, bird, plane — distinctive and already in the deck), the navy/gold palette, the fee-structure message ("we earn alongside the sponsor, not in front of them"), Jason's Feb 2026 AI post (good voice, becomes the first *Perspective*), the three anchor case studies, the bios as raw material.

---

## 2. Positioning the site must carry (source of truth = the deck + Adam's 5/10 note)

### Core statement
> **The embedded operating platform for PE-backed companies.**
> Executive intelligence + artificial intelligence, working inside your portfolio.

### The argument (this is the homepage narrative, in order)
1. **You can't run what you can't see.** Two problems — *Performance* (visible, crowded market) and *Information* (harder; what LPs actually hold sponsors accountable for). Most sponsors only solve one.
2. **No competitor solves both halves.** Big 4 (partial team, no visibility), restructuring firms (senior people, no live data), solo fractional CFOs (one person, no platform), AI/data vendors (no operator access). Fairlead: both, integrated, at portfolio scale.
3. **AI gets better with high-quality data. Fairlead has 15 years of it, from inside the companies.** 60+ embedded engagements · 16 sectors · since 2010. Every engagement compounds the operating intelligence.
4. **Operating discipline, on the sponsor's clock.** Embedded leadership · Overhead discipline · Real-time visibility · Exit-ready.
5. **Custom AI solutions that solve operational challenges.** Cottonwood Solar / Solaris case study: $720K Dominion claim → four-option decision memo → ~$360K expected savings.
6. **Proof.** Cordia (KKR, $1.9B spinoff) · Cadre Proppants (3× EBITDA, 18 months) · GRP Holdco (Ares, $82.5M tax equity).
7. **Designed for how PE actually works.** Compensation tied to sponsor success; current fees a fraction of Big-4 / IB rates.

### Messaging guardrails (from the April–August working sessions — these are non-negotiable)
- **Implicit, not explicit.** Position as AI leader *by demonstration*. "Not the most vocal participants in discussions about AI — but when a portfolio company asks whether an approach will work, we answer from experience rather than optimism."
- **Not a SaaS company.** Tools are *examples of what becomes possible when operators have crossed the implementation threshold*, not products. Show variety so a sponsor can "fill in the blank" for their own need.
- **"Finance with an undertone of software development"** — never the reverse.
- **Imply cost/FTE savings; don't state them as claims.** (Adam still owes a decision on any $40K-vs-$300K framing — leave it out until he weighs in.)
- **Do not position AI as a modeling replacement** (undercuts live engagements).
- **Retire the word "chatbot."** Use *assistant*, *operating intelligence*, *Solaris*.
- **Confidentiality:** no client data, no unreleased plans. Sanitized demo data only. Exclude team members who've opted out of marketing (Chrystelle).
- **"Caveman rule":** every screen graspable in one glance; the strapline carries the context.

### Audiences (in priority order)
1. **PE sponsors** — operating partners, deal teams, portfolio managers. Want: assurance the portfolio is under control without hassling management. Emotional payoff: *"so much more relaxed"* (verbatim from a current sponsor).
2. **Portfolio company CEOs/CFOs** — need a CFO/COO seat filled fast, want tools not busywork.
3. **Intermediaries** — bankers (Piper Sandler-type), lenders, family offices who refer. Want a credible one-pager they can forward.
4. **Boards under pressure to "do something with AI."**
5. **Recruits** — senior finance/ops people who want to work AI-first.

---

## 3. Site architecture

```
/                       Home — the argument, end to end (≈ the deck as a scroll)
/platform               How the embedded operating platform works (4 pillars + engagement model + fees)
/intelligence           Solaris & custom tools — demo video, tool gallery, Cottonwood case study, tools portal link
/engagements            Filterable proof: 60+ engagements by sector / role / sponsor / outcome (Supabase)
/engagements/[slug]     Individual case study pages (start with 6–8)
/team                   Partners featured; full team as expandable cards (Supabase)
/perspectives           Firm point of view — starts with Jason's AI post; archive old press reposts here as "Transactions"
/perspectives/[slug]
/contact                One form, one phone, four cities. No personal emails.
/careers                Short. "We're hiring operators who work AI-first." Links to contact.
```

**Removed from nav:** Industries (becomes a filter on `/engagements`), Announcements (folded into Perspectives → Transactions), Join Our Team (becomes footer link `/careers`).

**Nav (desktop):** Platform · Intelligence · Engagements · Team · Perspectives · [Contact ▸]
**Persistent utility:** `⌘K / Ask Fairlead` trigger in the nav (see §6).
**External:** `tools.fairleadadvisors.com` — client login, linked from Intelligence page and footer ("Client portal"). Not part of this build.

### URL redirects (301) — required at launch
```
/who-we-are/            → /team
/services/              → /platform
/what-we-do/            → /engagements
/what-we-do/#energy     → /engagements?sector=energy
/announcements/         → /perspectives
/join-our-team/         → /careers
/contact-us/            → /contact
/2026/02/over-the-past-year-...  → /perspectives/ai-as-core-capability
/2023/05/fairlead-advises-...nirenberg... → /engagements/nirenberg-neuroscience
/2023/06/case-study-survival-sprint...   → /engagements/survival-sprint
/2025/12/fairlead-supports-dion...       → /engagements/dion-leadership
(all other /YYYY/MM/* posts)             → /perspectives/transactions/[slug]
```

---

## 4. Page-by-page content spec

### 4.1 Home `/`
Structure mirrors the deck. Each block is a full-width section; the page reads as one argument.

| # | Section | Content | Component |
|---|---|---|---|
| 1 | **Hero — "Visibility"** | Full-bleed two-layer parallax photo (§5.5). H1: *You can't run / What you can't see.* Sub: *The embedded operating platform for PE-backed companies. Executive intelligence + artificial intelligence, working inside your portfolio.* CTA: **Talk to a partner** (pill). Glass stat strip at the bottom edge. | `Hero` + `StatsStrip` (§5.5, §5.7) |
| 2 | **Two problems** | Performance vs Information — two hairline-divided cells (§5.5), content exactly as slide 2 | `TwoProblems` |
| 3 | **No competitor solves both halves** | Comparison table (Big 4 / Restructuring / Solo CFO / AI platforms / Fairlead). Row highlight on hover. | `CompetitorMatrix` |
| 4 | **The compounding asset** | 2-col: headline + gold-soft italic subhead + paragraph *Every engagement deepens the operating intelligence behind our tools — captured, structured, source-cited.* / graded photo. (The 60+ · 16 · 2010 figures moved to the hero stat strip.) | `Advantage` |
| 5 | **Operating discipline, on the sponsor's clock** | 4-col hairline grid: `.label` counter, line icon, `.h4`, `.body-md`. Embedded leadership · Overhead discipline · Real-time visibility · Exit-ready. Each links to `/platform#pillar` | `Pillars` |
| 6 | **Intelligence band** | Full-bleed Solaris Portfolio Map still with glass strip (Cottonwood four options, `pin-steps`); demo reel embedded on `/intelligence`, not here. CTA → `/intelligence` | `IntelligenceBand` |
| 7 | **Selected engagements** | Cordia · Cadre · GRP cards → `/engagements` | `EngagementCards` (pulls `featured=true` from Supabase) |
| 8 | **Designed for how PE actually works** | Fee alignment paragraph verbatim from slide 8 | `FeeBlock` |
| 9 | **Contact strip** | Phone · four cities · form CTA | `ContactStrip` |

### 4.2 Platform `/platform`
- Intro: *Sitting in the seat, not visiting it.* The engagement model in one paragraph: you don't get one person, you get the team; scales up or down.
- **Four pillars, expanded** (anchor IDs):
  - **Embedded leadership** — Fractional/interim CEO, CFO, COO, Controller; board & operating partner roles; whole-company services. (From current Services page, edited to 40% length.)
  - **Overhead discipline** — G&A reduction, vendor management, 13-week cash forecasting, covenant compliance. *"Particularly for development-stage platforms where the fund is advancing G&A and development capital, every month of overhead discipline is real return."* (Adam's emphasis — keep verbatim.)
  - **Real-time visibility** — Sponsors see what's happening without depending on management *or Fairlead* to tell them. Links to `/intelligence`.
  - **Exit-ready** — Sell-side readiness, buy-side diligence, capital raise prep, M&A process management (no IB/broker-dealer role). *The same team that runs the company runs the process to sell it.*
- **Portfolio company assessment** — 2–4 week assessment; now accelerated by synthesizing contracts, financials, forecasts and interviews into a persistent repository the sponsor keeps using after the assessment. (From April transcript.)
- **Fee structure** — as slide 8.
- CTA.

### 4.3 Intelligence `/intelligence`
The page that proves the "AI" half without shouting. Title: **Custom AI solutions that solve operational challenges.**

1. **Lead paragraph** (from Jason's post / April session): AI is a core capability at Fairlead, used daily in production across engagements for six-plus months — past the pilot phase most firms are stuck in. Tools are built to solve a specific client's pain, which is why they generalize.
2. **Solaris demo reel** — full-width video, straplines from the demo outline:
   - *Your entire portfolio, live — every issue one click from its source.* (Portfolio Map)
   - *Every number traces back to its source — full audit trail, automatically.* (Provenance)
   - *Predicts major equipment failures weeks before they happen.* (Leading risk)
   - *Ask for any table, chart, or visual — push it straight into your board deck.* (Sketchpad)
   - *1,000+ documents indexed, searchable, readable — right in the app.* (Knowledge base)
   - *Drop in a 47-tab workbook — get back a clean, AI-ready model.* (Solaris Sheets)
   - *Sweeps your inbox — every attachment extracted, routed, stored.* (Email intake)
3. **Tool gallery** — cards, each one sentence + a sanitized screenshot. Framed as "built for a portfolio company, reused across the portfolio":
   - **Solaris** — operating intelligence platform (portfolio map, provenance financials, predictive risk, sketchpad, knowledge base)
   - **Working Capital / Cash Flow Dashboard** — QuickBooks + order system → 13-week forecast; the sponsor checks it before every meeting
   - **Board Report Generator** — formatted, editable, audit-trailed board packs from live data
   - **AP Triage & Scheduling** — vendor priority buckets, auto-scheduled payments under a weekly cap
   - **Vendor Sentiment Tracker** — flags tone escalation in vendor email to prioritize AR/AP
   - **Sherpa** — the assistant that surfaced an undercharged largest customer (anonymized anecdote)
4. **Case study: Cottonwood Solar** — the interactive decision memo (§5.4). Exactly the slide-6 content: the question, what Solaris produced, four options, EV math (~$360K net expected savings; ~$75K at risk; 60% success assumed — fix "addumed" typo).
5. **How we work with your team on AI** — three lines: team upskilling · tools built for the engagement · integrations to your existing systems. Board-pressure framing: *bottom-up tooling, top-down strategy.*
6. **Client portal** — `tools.fairleadadvisors.com` link, 2FA noted.
7. CTA: *Want a deeper demo of Solaris — or a custom solution built for you?*

### 4.4 Engagements `/engagements`
- Filter bar: Sector (16) · Role (Interim CEO / CFO / COO / Controller / Operating Partner / Board / M&A / Restructuring) · Sponsor type (PE / Infra / VC / Family office / Corporate) · Outcome (Sale / Financing / Turnaround / Spin-off / Tax equity).
- Card grid from Supabase `engagements` table. Anonymized where required ("PE fund," "ACME Metals").
- Featured rows: Cordia/KKR · Cadre · GRP/Ares · Nirenberg Neuroscience · Dion Leadership/Gallagher · Survival Sprint · Ambri (Nora) · Greenleaf · Veolia district energy ($1.25B).
- Footer note: *Selected from 60+ embedded engagements across 16 sectors. Full engagement summary available on request.* → triggers form with "Request engagement summary" preset.
- Source data: Matt's March 2026 Engagement Summary (five engagement categories) — import as CSV.

### 4.5 Team `/team`
- **Partners** (Adam Carte, Renee Sass, Charles Abbott, Jason Salgo) — photo, 2-sentence role, expandable full bio.
- **Team** — grid of cards (photo, name, title, one-line specialty). Click → drawer with full bio. Pulled from Supabase `team` table so members can self-edit via the marketing hub (per June 4 meeting).
- Standardize titles, fix typos, one photo aspect ratio, one credential format ("CPA," "P.E.," "CFA").
- Respect opt-outs; `visible` boolean in the table.
- Closing block: *Fairlead team members are prepared to lead organizations, manage teams, make decisions, and act as individual contributors.* + `/careers` link.

### 4.6 Perspectives `/perspectives`
- **Firm view** — starts with "AI as a core capability" (Jason, Feb 2026). Target cadence: one per quarter. Newsletter capture here (SendGrid).
- **Transactions** — the historical press reposts, listed as a compact dated timeline (title, date, one line, link out to original). This preserves the deal history without pretending it's editorial.

### 4.7 Contact `/contact`
- One form: Name · Firm · Role (Sponsor / Portfolio company / Intermediary / Other) · What are you working through? · Email. Posts to SendGrid → `info@` distribution list (create one; retire personal emails from the site).
- Phone (617) 315-4822. Boston · Houston · Minneapolis · Maryland. Mailing address in footer small print only. **Drop the fax.**
- LinkedIn.

---

## 5. Design system — aligned to the reference (vita-travel.webflow.io)

**Reference read:** the site's compiled CSS and GSAP bundle were inspected directly (not screenshots). Everything below is a translation of those exact values into Fairlead's palette. Where the reference uses orange, Fairlead uses gold; where it uses teal-black, Fairlead uses deep royal blue. Nothing else changes.

### 5.1 Color tokens
The reference is **fully dark** — no light sections. Adopt that. The cream/ivory sections from the deck are retired; the deck's cream survives only as the gold-on-blue type color for emphasis.

| Token | Value | Reference equivalent | Use |
|---|---|---|---|
| `--blue-950` | `#050E2E` | `body #091b20` | Page background |
| `--blue-900` | `#0A1A4F` | `--brand-green #0d2e37` | Panels, secondary buttons, cards over imagery |
| `--blue-800` | `#0F2A6E` | — | Hover surface, active nav segment |
| `--blue-700` | `#1A3D94` | — | Royal accent for links-on-dark, chart strokes, focus rings |
| `--gold` | `#D5B371` | `--brand-accent #fb9826` | **Brand primary accent (locked).** Button hover, highlighted headline words, active states, live dots |
| `--gold-pressed` | `#B59860` | `--button-clicked #fa8805` | `:focus` / pressed |
| `--gold-soft` | `#E6D1AA` | — | Italic subhead treatment (*"from inside the companies"*) |
| `--white-100` | `#FFFFFF` | same | Headlines, primary button fill |
| `--white-60` | `rgba(255,255,255,.6)` | same | Body copy on dark |
| `--white-50` | `rgba(255,255,255,.5)` | same | Secondary body |
| `--white-40` | `rgba(255,255,255,.4)` | same | Legal, footer links |
| `--white-20` | `rgba(255,255,255,.2)` | same | Header rules, footer rules |
| `--white-10` | `rgba(255,255,255,.1)` | same | Section/grid hairlines, input underlines |
| `--muted` | `#7C8BB3` | `#5d6c7b` | Icon grey, placeholder |

**Photo grade:** all photography is color-graded into the blue family (blue-hour / dusk), with warm gold light as the only counter-color — so imagery and UI share one palette. Overlay: `linear-gradient(180deg, rgba(5,14,46,0) 40%, #050E2E 100%)` at the bottom of every full-bleed image so sections dissolve into the page.

### 5.2 Type — Inter, one family
`next/font/google` → `Inter`, weights 300 / 400 / 500 / 600 / 700, variable, `display: swap`. No Poppins, no Raleway, no second face. Personality comes from **weight 600 + negative tracking**, exactly as the reference.

| Class | Size | Tracking | Weight | Leading | Reference |
|---|---|---|---|---|---|
| `.h1` | `clamp(4.5rem, 12vw, 11.875rem)` | `-0.06em` (≈ −10px at max) | 600 | 100% | `.h1` |
| `.h2` | `3.75rem` | `-3.6px` | 600 | 110% | `.h2` |
| `.h3` | `2.8125rem` | `-3px` | 600 | 100% | `.h3` |
| `.h4` | `1.75rem` | `-2px` | 600 | 120% | `.h4` |
| `.body-xxl` | `1.75rem` | `-2px` | 600 | 130% | `.body-xxl` |
| `.body-xl` | `1.375rem` | `-1px` | 500 | 120% | `.body-xl` |
| `.body-lg` | `1.125rem` | `-0.5px` | 500 | 130% | `.body-lg` |
| `.body-md` | `1rem` | `-0.5px` | 500 | 130% | `.body-md` |
| `.body-sm` | `0.875rem` | `-0.6px` | 400 | 130% | `.body-sm` |
| `.button` | `0.875rem` | `-0.5px` | 600 | 90% | `.button-sm` |
| `.label` | `0.625rem` | 0 | 600 | 110% | `.how-works-item__count` (step counters, white-50) |

Mobile overrides (from the reference's breakpoint rules): `.h1 → 7.625rem` then `clamp` down; `.h2 → 2.8125rem / −3px`; `.h3 → 1.75rem / −2px`; `.body-xl → 1.125rem`. Body copy on dark is `--white-60`, never pure white. Headlines are `--white-100` with one gold phrase where the deck already uses it (*What you can't see*).

### 5.3 Layout grammar
- **Page:** `.page-wrapper > .main-wrapper` (required by ScrollSmoother). Container gutters `2.5rem` desktop / `1.25rem` mobile; sections `padding: 5rem 0` (`4rem 0 2rem` mobile). No max-width on the container — full-width grids, like the reference.
- **Header:** fixed, transparent, `4.5rem` tall, three segments separated by `1px --white-20` vertical rules: `[logo] | [nav] | [Talk to a partner]`. Bottom hairline. Logo lockup: origami mark 1.25rem + "Fairlead" wordmark at `1.5rem / −2px / 600`. Nav links `.button` size; current page in gold.
- **Hairline grid system:** cards and stat cells do **not** have backgrounds or radii. They're `2.5rem`-padded cells separated by absolutely-positioned `1px --white-10` rules (top/bottom/right "dec" elements), exactly as `.statistic-item`, `.combine-step`, `.practitioners-person`. This is the single most recognizable trait of the reference — adopt it everywhere: competitor matrix, stats, pillars, engagement list, team grid.
- **Full-bleed image sections:** `aspect-ratio: 1440/922` (hero) and `1440/863` (Intelligence "combine" band), `background-size: cover`, content centered or bottom-anchored. Mobile swaps to a `375/812` crop.
- **Glass strips:** `backdrop-filter: blur(10px)` panel pinned to the bottom of an image section, subdivided by hairlines (`.combine__steps`). Use for the 60+ / 16 / 2010 stat strip under the hero and the four-step engagement process over the Intelligence band.
- **Radii:** buttons `5rem` (pill); everything else `0`–`3px`. No card shadows.
- **Buttons:** `.btn-primary` = white fill, blue-950 text, `padding: 1.25rem 2rem`, icon 1rem gap, `transition: all .2s`, hover → `--gold` fill + white text, focus → `--gold-pressed`. `.btn-secondary` = `--blue-900` fill, white text, `padding: .875rem 1.5rem`, `min-width: 8.5rem`, hover → gold. Disabled → `--white-10` fill / `--white-20` text.
- **Inputs:** no box. Bottom border `1px --white-10`, text `1.375rem / −1px / 500`, transparent background, `padding-bottom: .9rem`. Textarea `9.625rem` tall. Contact form is four fields on a dark page — nothing else.
- **Links:** underline via `border-bottom: 1px solid --white-100`, no text-decoration.

### 5.4 Motion spec — GSAP, matching the reference exactly
Stack: `gsap@3.14` + `ScrollTrigger` + `ScrollSmoother` + `SplitText` + `ScrollToPlugin` (all free since GSAP 3.13). Wrap in `@gsap/react` `useGSAP`. Framer Motion is **out**.

```ts
// lib/motion.ts — the reference's constants, verbatim
export const EASE_OUT   = "power3.out";
export const EASE_INOUT = "power2.inOut";
export const D_REVEAL   = 0.8;   // primary reveal
export const D_FAST     = 0.7;   // secondary / cards
export const D_MICRO    = 0.6;
export const STAGGER_EL = 0.08;  // sibling elements (0.06 for dense lists)
export const STAGGER_CH = 0.008; // SplitText chars
export const TRIGGER    = "top 88%"; // "top 90%" for footers
export const ONCE       = true;

ScrollSmoother.create({ wrapper: ".page-wrapper", content: ".main-wrapper", smooth: 1.2, effects: true });
```

Recipes (each is a `data-anim` attribute the build agent wires once):

| `data-anim` | What happens | Values |
|---|---|---|
| `fade-up` | `from {opacity:0, y:30}` → `{opacity:1, y:0}` | `D_REVEAL`, `EASE_OUT`, optional `data-anim-delay` |
| `fade-down` | same, `y:-40 → 0` (header, hero eyebrow) | `D_REVEAL` |
| `slide-in` | `x:-40 → 0` (left-aligned copy blocks) | `D_FAST` |
| `split-lines` | `SplitText type:"lines"`, each line in an `overflow:hidden` mask, `y:"100%" → "0%"` | `D_REVEAL`, `STAGGER_EL` |
| `split-chars` | `SplitText type:"chars"`, `opacity:0, y:20 → 0` | `D_FAST`, `STAGGER_CH` — hero H1 only |
| `count` | numeric tween 0 → value, `duration: 2`, `ease:"none"`, tabular-nums | stats strip |
| `parallax` | `data-speed="0.85"` / `"1.15"` via ScrollSmoother effects on hero bg layers and section images | — |
| `scale-in` | image `scale:1.2 → 1` inside an `overflow:hidden` frame on enter | `D_REVEAL` |
| `pin-steps` | pinned section; step items reveal sequentially as scroll progresses (the reference pins two sections) | `scrub:false`, `once` |
| `draw-x` | hairline `width: 0% → 100%` (horizontal rules) | `0.8`, `EASE_INOUT`, stagger `0.1` between lines — see §5.8 |
| `draw-y` | hairline `height: 0% → calc(100% - 2px)` (vertical rules), starts `+0.48s` after the horizontals | `0.8`, `EASE_INOUT` |
| `type` | SplitText chars: each char `opacity 0 → .4` over `.06s` (linear) then `→ 1` over `.18s` (`power1.out`), stagger `0.03` — the "typewriter" headline | used on section H2s |
| `read` | SplitText `lines,chars`: lines mask-slide up, chars start `rgba(255,255,255,.4)` then brighten to white, `duration .08`, `stagger .008`, starting `+0.5s` after the line slide | body paragraphs on image sections |
| `pop` | `scale: 0 → 1, opacity 0 → 1`, `transformOrigin: center`, CSS transition disabled during tween | `0.5`, `power2.out` — pill buttons inside lists |
| `blur-in` | `opacity 0, filter: blur(12px) → 0`, `clearProps: filter` | `D_REVEAL` — glass panels and screenshots |
| `zoom-in` / `zoom-out` | `opacity 0, scale .85 → 1` / `scale 1.15 → 1` | `D_REVEAL` |
| `pulse` | elastic `scale 0 → 1` in, then perpetual `sine.inOut` yoyo `1 → 1.2` with a soft glow | §5.8.6 |

Hover: `transition: all .2s` on buttons/cards; `.4s` on burger/menu. Prefers-reduced-motion: kill ScrollSmoother, set all `from` states to final, keep `count` instant.

**Rule from the reference:** every reveal is `once: true`. Nothing re-animates on scroll-back. Only two things loop: the `pulse` on live-portfolio dots (§5.8.6) and the `spin` on the form's submit state. Under 480px, SplitText char effects and header line-draws are skipped entirely — mobile gets plain `fade-up` (`y:30`) so it never stutters.

### 5.5 Section-by-section translation (Home)
| Section | Reference pattern | Fairlead version |
|---|---|---|
| Hero | `.intro` — full-bleed landscape photo, two parallax bg layers (`intro-1` sky/far, `intro-2` foreground), centered H1 char-split, one pill CTA, mobile CTA pinned to bottom | Blue-hour aerial of a portfolio asset (solar field / industrial site / biomass plant) graded royal blue with gold horizon light. Layer 1 = sky + far terrain (`data-speed .85`), layer 2 = foreground site (`data-speed 1.05`). H1 *You can't run / What you can't see* with the second line in gold. Sub in `body-xl --white-60`. Pill: **Talk to a partner**. |
| Stats strip | `.combine__steps` glass strip subdivided by hairlines | Glass strip at the hero's bottom edge: **60+** embedded engagements · **16** sectors · **2010** since — `.h3` numbers with `count`, `.body-sm --white-50` labels. |
| Two problems | `.statistic` — 3-col hairline grid with a visual per cell | 2-col hairline grid. Left cell "Performance", right cell "Information". Each cell: `.label` above, `.h4` title, `.body-lg --white-60` body, italic `.body-sm` footnote. No fills — the deck's cream/navy panels become two hairline cells. |
| Competitor matrix | `.featured-item` — hairline-divided rows, 2-col text/visual | Hairline rows: Big 4 / Restructuring / Solo CFO / AI platforms / Fairlead. Fairlead row gets `--blue-900` fill and gold checks — the only filled row. `slide-in` per row, `STAGGER_EL`. |
| Compounding asset | `.about` — 2-col, copy + image, with two small stat cells | Left: `.h2` *AI gets better with high-quality data.* + gold-soft italic `.h3` *Fairlead has 15 years of it, from inside the companies.* Right: graded photo, `scale-in`. |
| Pillars | `.how-works` — 4-col, small icon + `.label` count + `.h4` + `.body-md` | Four pillars with the deck's line icons. Counters are legitimate here (it's the delivery sequence). |
| Intelligence band | `.combine` — full-bleed illustration with glass step-strip at bottom | Full-bleed sanitized Solaris Portfolio Map screenshot, blurred at edges into blue-950; glass strip with the four Cottonwood options (Accept / Withdraw / Counter / Escalate) that reveal on `pin-steps`. |
| Engagements | `.featured-item` list | Hairline rows: sponsor label, `.h3` company, `.body-sm` metric, `.body-md --white-60` summary, pill **See the engagement**. |
| Team teaser | `.practitioners` — 2×2 hairline photo grid with name overlay bottom-left | Partners 2×2, photo with bottom gradient, name `.body-lg`, title `.body-sm --white-50`. |
| Contact / footer | `.footer` — full-width image band `21rem` tall with `#091b2066` layer, then hairline-segmented footer | Blue-hour image band with `--blue-950` at 40% layer; footer with logo | links | four cities | `(617) 315-4822`, all separated by `--white-20` rules. |

### 5.6 What we are deliberately *not* copying
- The reference's illustrated/travel imagery — Fairlead uses infrastructure photography.
- Orange. Gold is the only accent and it is used sparingly: hover, one headline phrase, active nav, stat numbers.
- The reference's centered hero copy on inner pages — inner pages are left-aligned to read as operating documents.
- Its marketing tone. Copy stays as §10.

### 5.7 Signature interaction (kept from v1, rebuilt in GSAP)
The "Visibility" idea now lives *inside* the reference hero pattern: as the user scrolls the first `60vh`, three hairline markers pin onto the foreground layer of the hero photo (an inverter row, a substation, a storage bank) and a `.body-sm` chip resolves beside each — *"Inverter string 14 — 48% failure ratio, 8 matched issues"* — each chip drawing a 1px line to a "source" tag. `ScrollTrigger scrub: 0.6`, then hold. It's the only scrubbed animation on the site.

### 5.8 Line & glass choreography — the part that makes it feel expensive
This is the mechanism behind the reference's "everything is being drawn for me" feeling. It is not decoration; it is a strict order of operations, and the build agent must implement it as a reusable timeline, not per-section one-offs. All values are lifted from the reference's `app.min.js`.

**5.8.1 The hairline primitive.** Rules are never CSS borders. Each is its own absolutely-positioned `div` (`.dec`) — `1px` thick, `--white-10` (sections) or `--white-20` (header/footer), `transform`/`width`/`height` animated. Vertical rules are inset `1px` top and bottom (`height: calc(100% - 2px)`, `top: 1px`) so they never overlap the horizontals — corners stay crisp at every DPR. Cell content sits in the grid; the frame is a sibling layer.

```tsx
// components/HairlineFrame.tsx (sketch)
<div className="relative">
  <span data-dec="top"    className="dec absolute left-0 right-0 top-0 h-px bg-white/10" />
  <span data-dec="bottom" className="dec absolute left-0 right-0 bottom-0 h-px bg-white/10" />
  <span data-dec="v"      className="dec absolute top-px bottom-px w-px bg-white/10" style={{left:'33.333%'}} />
  <span data-dec="v"      className="dec absolute top-px bottom-px w-px bg-white/10" style={{left:'66.666%'}} />
  {children}
</div>
```

**5.8.2 The draw order (one timeline per section, `start: "top 88%"`, `once: true`).**
```ts
// lib/motion.ts — drawFrame(): the reference's exact sequence
export function sectionReveal(section: HTMLElement) {
  const tl = gsap.timeline();
  const eyebrow = q('[data-anim="eyebrow"]');           // small label
  const h2      = split(q('[data-anim="h2"]'), 'chars'); // section headline
  const hLines  = qa('[data-dec="top"],[data-dec="bottom"]');
  const vLines  = qa('[data-dec="v"]');
  const cells   = qa('[data-cell]');

  // 0.00  eyebrow lifts in
  tl.to(eyebrow, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 0);
  // 0.00  headline types on, char by char
  tl.to(h2.chars, { keyframes: [
      { opacity: .4, duration: .06, ease: 'none' },
      { opacity: 1,  duration: .18, ease: 'power1.out' } ],
      stagger: .03 }, 0);
  // e     horizontals draw left→right, once the headline is ~half typed
  const e = h2.chars.length * .03 * .5;
  tl.to(hLines, { width: '100%', duration: .8, ease: 'power2.inOut', stagger: .1 }, e);
  // e+.48 verticals drop top→bottom — the frame closes
  tl.to(vLines, { height: 'calc(100% - 2px)', duration: .8, ease: 'power2.inOut', stagger: .1 }, e + .48);
  // e+.24 cells fill in, one at a time, while the frame is still drawing
  cells.forEach((cell, i) => {
    const o = e + .24 + .3 * i;
    tl.to(cell.querySelector('[data-anim="title"]'),    { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, o);
    tl.to(cell.querySelector('[data-anim="subtitle"]'), { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, o + .1);
    tl.to(cell.querySelector('[data-anim="visual"]'),   { opacity: 1, x: 0, duration: .8, ease: 'power3.out' }, o + .15);
  });
  return tl;
}
```
Initial states (set on mount, not in CSS, so SSR paints the final layout for no-JS/reduced-motion): `eyebrow {opacity:0,y:40}`, `h2.chars {opacity:0}`, `hLines {width:'0%'}`, `vLines {height:'0%'}`, `title/subtitle {opacity:0,y:30}`, `visual {opacity:0,x:-40}`.

Why this reads as "resourced": the frame is still closing while content is already arriving inside it — two overlapping rhythms (`power2.inOut` for structure, `power3.out` for content), nothing waits for anything else to finish, and the whole section resolves in ~2.2s. Fade-everything-together looks generated; this looks operated.

**5.8.3 Header on load and on scroll.** Page load runs one orchestrated sequence, desktop only: bottom hairline `scaleX 0 → 1` from `left center` (`.5s`, `power2.inOut`, delay `.3`), then the two vertical rules `scaleY 0 → 1` from `center top` (`.5s`, delays `.4` and `.5`). On scroll past `20px` the header gets `.is-active` → `backdrop-filter: blur(12px)`; before that it is fully transparent over the hero photo. That's the entire header behavior. No shrink, no color change, no shadow.

**5.8.4 Glass strips (the `.combine__steps` pattern).** A `backdrop-filter: blur(10px)` panel, no background fill, no border — only hairlines. Anchored to the bottom of a full-bleed image section. Its reveal is a three-beat sequence:
1. Section headline lines mask-slide up (`.8`, `power3.out`, stagger `.08`); sub-titles follow at `+.15s` each; the strip's top and bottom horizontals draw (`.1s` apart).
2. `+.6s` — the strip's description paragraph runs `read` (lines slide up, then chars brighten left→right at `.008` stagger); the vertical dividers between cells drop in at `+.4s`, `.1s` apart.
3. `+.6s` — each cell's head and body lines slide up, cells staggered `.2s`, head then body `+.1s`.
Use for: the hero stats strip (60+ / 16 / 2010), the Cottonwood four-option strip on the Intelligence band, and the four-step engagement process on `/platform`.

**5.8.5 Hairline-row lists (the `.featured-item` pattern).** Engagements, competitor matrix, team list. The list's outer horizontals draw first (`.1s` apart), then row dividers drop, then each row runs its own `top 90%` trigger: title lines up (`.7`, stagger `.08`), metric fade-up `+.1`, properties fade-up stagger `.08`, pill button `pop`s last, image `x:-40 → 0`. Rows never animate together — each earns its own reveal as it enters.

**5.8.6 Live dots (the `.destination__dots` pattern) → Fairlead's portfolio map.** SVG dot + soft glow pairs. On enter, in **shuffled** order, stagger `.08`: dot `scale 0 → 1`, glow `scale 0 → .6, opacity .15, filter blur(2px)`, both `elastic.out(1, 0.5)`, `.6s`. Then forever: dot `scale → 1.2`, glow `scale → 1.4, opacity .1`, `sine.inOut`, `yoyo`, `repeat: -1`, each with a random delay `0–2s` and duration `1–1.8s` so they never sync. Gold dots on a deep-blue map = the portfolio is live. Use on the Intelligence band (site pins) and the footer image band (Boston · Houston · Minneapolis · Maryland). This is the one place the site breathes on its own.

**5.8.7 Smooth anchor scroll.** All in-page links go through `ScrollToPlugin`: `duration .8`, `power2.inOut`, `offsetY = header height + 20`. Pinned sidebars on long inner pages (`/platform`, `/perspectives/[slug]`) use `pinSpacing: false` and end at content bottom.

**5.8.8 Fairlead-specific placements.**
| Where | Pattern | Note |
|---|---|---|
| Header | 5.8.3 | Logo · nav · CTA segments; glass only after scroll |
| Hero stats strip | 5.8.4 | Numbers use `count` inside beat 3 |
| Two problems | 5.8.2 (2 cells) | Left cell first; the right cell's vertical rule is the frame closing on "Information" |
| Competitor matrix | 5.8.5 | Fairlead row `pop`s its gold checks last |
| Pillars | 5.8.2 (4 cells) | Counters fade with titles |
| Intelligence band | 5.8.4 + 5.8.6 | Portfolio map dots pulse under the glass strip |
| Engagements | 5.8.5 | One trigger per row |
| Team | 5.8.2 grid + `x:-40` photos | Name/title lines slide up over the photo gradient |
| Contact | 5.8.2 with two rules only | Vertical rule draws at `.4`, horizontal at `.1`; form `fade-up` last |
| Footer | 5.8.5 order, `--white-20` | Bottom rule `+.1`, copyright vertical `+.2` |

### 5.9 The detail floor — what "billion-dollar" actually means in the DOM
None of the motion above lands if any of these are wrong. Treat as acceptance criteria per PR.
- **True 1px hairlines** at every DPR (`h-px`, never `0.5px`, never `border` on a scaled element). Rules are pixel-snapped; check at 125% and 150% zoom.
- **No layout shift, ever.** Every image has intrinsic `aspect-ratio`; fonts load with `next/font` so no FOUT; SplitText runs after `document.fonts.ready`; initial `gsap.set` happens before first paint (in a layout effect), so nothing "jumps to hidden."
- **Tabular figures** on every number (`font-variant-numeric: tabular-nums`) so `count` doesn't jitter width.
- **Hover is `.2s`, and every interactive thing has one:** pill fill → gold, link underline color, row background → `--blue-900`, team photo gradient deepens. Focus rings are `2px --blue-700` offset `2px`, visible on keyboard only (`:focus-visible`).
- **Selection color** `--gold` on `--blue-950`. Scrollbar thin, `--white-20` thumb. Custom cursor: none (the reference doesn't use one; don't add one).
- **Reduced motion**: one guard in `lib/motion.ts` — kill ScrollSmoother, skip all `gsap.set` initial states, keep `.2s` hovers. The page must read identically, just still.
- **Form states**: underline input; on focus the underline animates `--white-10 → --white-100` (`.3s`); submit button shows the `spin` keyframe inside the pill; success state replaces the form with a single `.h3` line that `fade-up`s. No toasts, no modals.
- **Empty and 404 states** designed, not defaulted: same hairline frame, one `.h2`, one pill.
- **Scroll performance**: only `transform`, `opacity`, `width/height` on the 1px rules, and `filter` on ≤ 2 elements at a time. `will-change` only on hero layers. Lighthouse Performance ≥ 95 *with* GSAP loaded; ScrollSmoother must not cause `overflow` bugs on iOS Safari (test).
- **Motion budget**: at most one `type` headline and one `read` paragraph visible per viewport. If a section has both a `type` H2 and a `read` body, the body waits for `e + .5`.

## 6. "Ask Fairlead" — the differentiated AI surface

**Not** a bottom-right bubble. A **command bar** (`⌘K` / nav trigger) that behaves like an operator's assistant:

- Answers questions about Fairlead using *only* site content + the engagement summary + Perspectives (RAG over a small, curated corpus; Supabase pgvector or a flat JSON index — corpus is tiny).
- **Takes actions in the UI:** "show me energy turnarounds" → navigates to `/engagements?sector=energy&outcome=turnaround`; "who leads district energy work" → opens Charlie/Jason cards; "send me the Cottonwood memo" → opens the case study; "I want to talk to someone" → opens contact form pre-filled.
- Powered by the Anthropic API (server route in Next.js; key in Vercel env, never client-side). System prompt: Fairlead voice, refuses off-topic, never invents engagements or numbers, never quotes client data, offers the contact form when unsure.
- Suggested prompts shown on open: *"What does embedded mean in practice?"* · *"Show engagements with KKR-scale sponsors"* · *"How is Solaris different from a dashboard?"*
- Visual: inline panel that slides from the nav, navy, gold caret, response renders with the same components as the site (engagement cards, team cards), not raw text bubbles. **This is the "in-chat rendering quality" point from the demo outline applied to the website itself.**
- Phase 2 deliverable; Phase 1 ships the trigger disabled behind a feature flag.

---

## 7. Technical architecture

```
Stack
  Framework      Next.js 15 (App Router, RSC), TypeScript
  Styling        Tailwind v4 + CSS variables from §5.1
  Motion         gsap@3.14 + ScrollTrigger + ScrollSmoother + SplitText + ScrollToPlugin via @gsap/react (see §5.4)
  Fonts          next/font/google Inter (variable, 300–700), display:swap — the only typeface
  Content        Supabase (Postgres) — tables: team, engagements, perspectives, sectors
                 MDX fallback for long-form Perspectives if preferred
  Media          Vercel Blob or Supabase Storage for headshots/screenshots; video on Mux or Vercel Blob (mp4 + webm, poster)
  Forms/Email    SendGrid (transactional + newsletter list). No HubSpot.
  AI             Anthropic API via /api/ask (edge or node route); rate-limited; corpus index rebuilt on content change
  Analytics      Vercel Analytics + Speed Insights; optional Plausible
  Hosting        Vercel (preview deploys per PR); DNS at GoDaddy → Vercel
  SEO            next-sitemap, robots, OG images generated per route (@vercel/og), JSON-LD Organization + Person (partners) + Article (perspectives)
```

**Supabase schema (minimum)**
```sql
team(id, slug, name, title, credentials, group enum('partner','team'), specialty, bio_md, photo_url, linkedin, visible bool, sort int, updated_at)
engagements(id, slug, company_display, sponsor_display, sponsor_type, sector_id, roles text[], outcome_tags text[], headline_metric, summary_md, body_md, year_start, year_end, featured bool, anonymized bool, visible bool)
sectors(id, slug, name, sort)
perspectives(id, slug, title, author_id→team, kind enum('perspective','transaction'), published_at, excerpt, body_md, external_url, visible bool)
```
Row-level security: public read where `visible = true`; write via service role from the marketing hub only.

**Repo layout**
```
/app
  /(site)/page.tsx, /platform, /intelligence, /engagements/[slug], /team, /perspectives/[slug], /contact, /careers
  /api/contact/route.ts  /api/ask/route.ts  /api/revalidate/route.ts
/components  Hero, StatsStrip, HairlineGrid, CompetitorMatrix, Pillars, IntelligenceBand, DemoReel, EngagementRow, TeamCell, CottonwoodMemo, AskFairlead, Header, Footer, GlassStrip, Btn
/lib/motion.ts  GSAP registration, constants (§5.4), data-anim resolver, reduced-motion guard
/content     ask-corpus/ (generated), straplines.ts, redirects.ts
/lib         supabase.ts, sendgrid.ts, anthropic.ts, seo.ts
/public      brand/ (logo svg, origami svg set, favicon), video/
next.config.ts (redirects from §3), tailwind.config.ts, .env.example
```

**Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SENDGRID_API_KEY`, `CONTACT_TO`, `ANTHROPIC_API_KEY`, `REVALIDATE_SECRET`.

**Performance targets:** LCP < 1.8s on 4G, CLS < 0.05, hero SVG < 60KB, demo video lazy (poster first), Lighthouse ≥ 95 all four.

---

## 8. Build phases

### Phase 1 — Launchable site (target: 3 weeks)
1. Repo scaffold, tokens, type, Nav/Footer, redirects, SEO plumbing
2. Home (all nine sections; GSAP wiring via `data-anim` from the start — the reference's fluidity is the product, not a polish pass)
3. Platform, Intelligence (video placeholder if reel isn't cut yet; Cottonwood memo static), Contact (SendGrid live)
4. Supabase schema + seed: 4 partners, 16 team, 9 featured engagements, 1 perspective, 27 transactions
5. Team, Engagements (filters), Perspectives
6. QA: redirects, forms, mobile, a11y, Lighthouse; partner review; DNS cutover

### Phase 2 — Intelligence layer (weeks 4–6)
- Ask Fairlead command bar (feature flag → on)
- Cottonwood interactive reveal (`pin-steps`)
- Solaris demo reel embedded once Ryan's footage is cut
- Marketing hub write path (team self-edit bios) → `/api/revalidate`

### Phase 3 — Growth (ongoing)
- Full engagement import (60+) with sanitization pass
- Newsletter automation from Perspectives
- Per-sponsor landing variants (`/for/sponsors`, `/for/portfolio-companies`) if outreach data supports it
- Sanitized Solaris "sandbox" embed if the demo app stabilizes (consensus.com-style interactive demo — parked until then)

---

## 9. Content to resolve before launch (owner: Matt → Adam/Renee)

| Item | Current | Decision needed |
|---|---|---|
| Engagement count | 60+ (deck) vs 100+ (site) | Pick one. Recommend **60+ embedded** (roles) and, if true, "100+ engagements including assessments and transactions." |
| Founding year | 2008 vs 2010 | Recommend "Since 2010." Delete 2008 reference. |
| Sector count | 16 (deck) | Need the actual list of 16 for the filter. |
| GRP Holdco metric | $82.5M tax equity | Matt flagged uncertainty in May; Adam to confirm. |
| Cordia | $1.9B carve-out; McKinsey collaboration named | Confirm McKinsey mention is cleared. |
| Cottonwood | Dominion named; "Solaris" named | Confirm client is OK being named on the public site; else "a utility-scale solar platform" / "the utility." |
| Historical stat block | 45 valuations / 21 plans / 30 companies / 17 transactions / "$1..35B" | Update or retire. Recommend retire in favor of the 60+/16/2010 trio. |
| Team roster | 20 on site | Confirm additions (Joe Winters, Kristen, Adam Vosker are on; Chrystelle off), titles, and who's a Partner vs Senior Advisor. |
| Cost-savings framing | Not on site | Adam owes a call on any explicit $ framing. Default: imply, don't state. |
| Tool names public? | Solaris, Sherpa, Working Capital Wizard used internally | Confirm which names go public. Recommend Solaris + descriptive names for the rest. |
| `info@` inbox | Doesn't exist | Create distribution list before form goes live. |
| Footer address | Houston mailbox | Keep in small print or drop? |

---

## 10. Copy voice guide (for whoever writes the remaining strings)

- **Plain, declarative, short.** Model sentence: *Sitting in the seat, not visiting it.*
- **Operator's vocabulary**, not consultant's: run, close, forecast, sell, restructure. Avoid "leverage," "synergies," "solutions" (except in the deck-locked phrase "custom AI solutions").
- **Experience over optimism.** Past tense wins. "Tripled run-rate EBITDA in 18 months" beats "we help companies grow."
- **AI appears as a noun in body copy, never as a headline modifier.** Say what the tool did.
- **Sentence case everywhere** except the logo and the deck-locked headline treatments.
- Every CTA says what happens: *Talk to a partner* · *Request the engagement summary* · *See the Cottonwood memo* — not *Learn more*.

---

## 11. Success metrics (90 days post-launch)
- Organic impressions for "operating partner private equity," "interim CFO PE portfolio," "portfolio company visibility" — currently ~0 because the title tag says investment management.
- Contact form submissions by audience type (sponsor / portco / intermediary).
- Engagement-summary requests.
- Ask Fairlead: sessions, top questions, % that end in contact.
- Intermediary use: how often partners send the URL instead of the PDF deck.

---

## Appendix A — Source material used
- *Fairlead Positioning & Pitch Deck, Concept 1.1* (ac/mf, Sept 2026) — the content spine
- Adam Carte → Matt, 5/10/26: partner alignment on "Executive Intelligence + AI," "Embedded Operating Platform," overhead discipline for development-stage platforms
- Fairlead AI Positioning & Tech Review, 4/20/26 — tool inventory, "implicit not explicit," 95%-of-pilots-fail framing, tools.fairleadadvisors.com
- Ryan/Matt Campaign Script Strategy, 5/5/26 — "not SaaS," differentiated AI interface, consensus-style demos, sponsor anecdotes
- Fairlead Weekly, 6/4/26 — rebuild from scratch, sunset HubSpot → SendGrid, Supabase marketing hub, bios self-service
- Matt/Ryan Solaris Demo Recording, 8/6/26 + *Solaris Demo Video Outline v1* — feature straplines, messaging guardrails, priority order
- fairleadadvisors.com crawl, 9/1/26 — Home, Services, Who We Are, Announcements
- vita-travel.webflow.io — compiled CSS (`vita-travel.webflow.shared.*.css`, `app.min.css`) and GSAP bundle (`app.min.js`) inspected 9/1/26 for fonts, tokens, layout grammar, and motion constants

## Appendix B — Claude Code kickoff prompt
```
Read FAIRLEAD_WEBSITE_REDESIGN_PLAN.md in full. Scaffold the Next.js 15 + Tailwind + Supabase
project per §7 and implement the redirects in §3. Build the design system first and exactly as
§5: Inter via next/font, the color tokens in §5.1, the type scale in §5.2 as Tailwind utilities
(.h1 … .label), the hairline-grid primitive, pill buttons, underline inputs, glass strips. Then
lib/motion.ts per §5.4 — GSAP + ScrollTrigger + ScrollSmoother(smooth:1.2, effects:true) +
SplitText, the HairlineFrame primitive and sectionReveal() timeline from §5.8 (exact offsets:
horizontals at e, verticals at e+.48, cells at e+.24+.3i), the glass-strip three-beat sequence,
and a prefers-reduced-motion guard. Verify §5.9 before any route PR. Only then build Phase 1
(§8) route by route starting with /, using the section translations in §5.5 and the copy in §4.
Where copy is missing, draft it in the voice from §10 and mark it TODO. Do not use Framer Motion,
Poppins, Raleway, light-background sections, card shadows, or border radii other than 5rem/3px/0.
Do not build Ask Fairlead yet — stub the trigger behind NEXT_PUBLIC_ASK_ENABLED=false.
Open a PR per route; include a Lighthouse run and a reduced-motion screenshot in each PR.
```
