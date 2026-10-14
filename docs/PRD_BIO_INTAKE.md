# PRD — Team Bio Intake (`fairleadadvisors.com/bio`)

| | |
|---|---|
| **Owner** | Matt Faria |
| **Status** | Draft for build — 2026-10-14 |
| **Ship by** | Before the Fairlead team call on **Thu 2026-10-15** |
| **Submissions go to** | `mfaria@fairleadadvisors.com` |
| **Repo** | `mattfairlead/fairleadwebsite` (Next.js 15, Resend, Supabase hub) |

---

## 1. Why

Our 26 bios don't match each other. They run from 50 words (Rohan) to 550 (Adam Carte). Some use "Mr./Ms.", some use first names. Titles in the bios disagree with the titles in the deck (Mary Day and Adam Vosker are "Senior Consultant" in the deck but "Senior Advisor" in their bios). Credential status is written three different ways. Several bios are years out of date: Renee's lists 2013–2015 engagements, and Charlie's says "over the last three years". Some never say what the person does at Fairlead (Liesa, Joe, Jaime).

On today's call (2026-10-14), Renee suggested using tomorrow's team call as a **bio workshop**:

- Adam, Renee and Mitchell will all miss the call. Matt runs it.
- **Don't announce the topic in advance**, or people won't join. Matt shares the link live on the call.
- Spend about 5 minutes on what a bio needs: **business background, education, and the recent significant deals you've worked on at Fairlead**. Use Adam's and Renee's bios as examples of bios that have gone stale.
- Then everyone stays on the call for **20–30 minutes**, fills in their bio and asks questions as they go. Treat it like a classroom.

We need a page that collects **facts, not prose**, in a fixed structure. Each submission is emailed to Matt as a **self-contained JSON file**. Matt can drop one or many files into Claude and get bios in the same format, length and tone every time.

## 2. Goals and non-goals

**Goals**
1. One URL Matt can paste into the call chat. It works on a laptop or phone with no login.
2. Most people finish in **20 minutes or less**. Nobody loses their work if the tab closes or the call drops.
3. Every submission reaches Matt's inbox **with a JSON attachment** in one versioned schema.
4. Each JSON file **contains its own generation instructions**, so the result doesn't depend on Matt remembering a prompt.
5. Claude's output maps one-to-one onto the hub's `team_members` fields (`suffix`, `roles`, `extended_bio`). Approved bios can be pasted into the hub, and `/team` updates on its own.

**Non-goals for v1**
- Generating bios on the page. This happens in Claude, after Matt reviews.
- Writing to Supabase or the hub automatically. Matt approves every bio first.
- Public visibility. The page isn't in the nav, the sitemap or search results.
- Any login or SSO.

## 3. Users

| User | Context | Need |
|---|---|---|
| **Team member** (26 people: partners, strategic partners, consultants, staff) | On the Thursday call, or later on their own (Adam, Renee, Mitchell) | Fast, obvious fields; pick-lists instead of writing; their current bio visible for reference; can stop and come back |
| **Matt** (reviewer) | Inbox, then Claude | One email per person, a valid JSON file, nothing missing, the ability to tell revisions apart |

## 4. User flow

1. Matt pastes `fairleadadvisors.com/bio` into the call chat.
2. **Intro screen** (about 20 seconds to read): what this is for, roughly 15–20 minutes, saves as you go, nothing is published until Matt reviews it.
3. **"Who are you?"** A list of the current roster (hub `team_members`, website-visible rows), plus **"I'm not listed"**.
   - Choosing a name pre-fills name, current title, current credentials and the current roles line. It also opens a collapsed **"Your current bio"** panel the person can copy facts from.
4. **Six short sections** on one page with a progress rail. Sections can be completed in any order: *Basics → Fairlead role → Recent Fairlead work → Career → Education & credentials → Extras*.
5. **Review screen**: a compact read-only summary plus warnings, e.g. "No result on Accomplishment 2", "No degrees listed". Warnings don't block submission. Only a short list of hard requirements does (§6.7).
6. **Submit**. A success screen with a check mark and the text "Got it — Matt will send you a draft to approve." It also offers **"Download a copy (JSON)"**.
7. If submission fails, the page says so plainly, keeps everything, and offers **Retry**, **Download JSON** and **"Email it instead"** (a `mailto:` to Matt with the JSON in the body).

## 5. Functional requirements

### 5.1 Route and access (P0)
- New route `app/bio/page.tsx`, rendered on the server, with the client form at `components/bio/BioIntakeForm.tsx`.
- `metadata.robots = { index: false, follow: false }`. Add `/bio` to `disallow` in `app/robots.ts`. Leave it out of `app/sitemap.ts`, the header and the footer.
- No password for the call. Optional env `BIO_ACCESS_CODE`: if set, the page asks for it once and keeps it in `sessionStorage`. Leave it **unset for Thursday**.
- Keep the link open with no expiry. Adam, Renee and Mitchell will fill it in later.

### 5.2 Roster prefill (P0)
- The server component calls the existing `getTeam()` (`lib/data.ts`) and passes `{ id, name, title, credentials, specialty, bio_md }` to the form.
- This only shows people who are already website-visible. **"I'm not listed"** covers everyone else and new hires.
- Prefilled values stay editable. The JSON records the original values under `prefill` so Matt can see what changed.

### 5.3 Save progress (P0)
- Save the form to `localStorage` under `fairlead.bio-intake.v1` on every change (debounced at 500 ms), wrapped in try/catch.
- On return, show "Welcome back — we kept your answers" with a **Start over** link.
- Clear the draft after a successful submission. Keep `last_submission_id` so a later submission can record `revision_of`.

### 5.4 Submission API (P0)
- New route `app/api/bio/route.ts` (`runtime = "nodejs"`). Follow the patterns in `app/api/register/request/route.ts`:
  - a honeypot field (`website`)
  - per-IP rate limiting, at most **10 submissions per hour per IP**. Several people may share one office IP, so keep this generous.
  - length caps on every field, and validation against the schema in §7. Reject with 400 and a list of field errors.
- The server sets `submission_id` (UUID v4), `submitted_at` (ISO 8601 UTC), `user_agent` and `schema_version`. It never trusts these values from the client.
- Send email with `lib/resend.ts → sendMail` (details in §5.5).
- **Never fail silently.** Today `sendMail` returns `{ ok: true, skipped: true }` when Resend isn't configured. For this route, `skipped` in production (`VERCEL_ENV === "production"`) counts as failure and returns **503**, so the client shows the fallback in §4.7. Otherwise submissions would vanish.

### 5.5 Email to Matt (P0)
- **To:** `BIO_TO` env, default `mfaria@fairleadadvisors.com`. **Reply-To:** the submitter's email.
- **Subject:** `Bio intake — {Full name}, {Title}` with ` (revision)` appended when `revision_of` is set.
- **Plain-text body** with three parts:
  1. A readable summary of every section, so Matt can check it on his phone.
  2. Any warnings from the review screen.
  3. The full JSON between the markers `----- BEGIN BIO JSON -----` and `----- END BIO JSON -----`, so he can copy it even if the attachment is stripped.
- **Attachment:** `bio_{slug}_{YYYYMMDD-HHmm}.json` (UTF-8, pretty-printed). This needs a small extension to `sendMail`: an optional `attachments: { filename: string; content: string /* base64 */ }[]`, passed through to Resend's `attachments` field. `/api/contact` doesn't change.
- **Optional copy to the submitter (P1):** a checkbox "Email me a copy", on by default. It sends a short confirmation with the same attachment.

### 5.6 Headshot (P1)
- Optional upload, JPG or PNG, up to 5 MB, resized in the browser to 1200 px on the long edge. It's sent as a second attachment, and the JSON only records `headshot_attached: true`.
- Skip this for Thursday if time is short. Headshots already live in the hub.

### 5.7 Design (P0)
- Reuse the site's own pieces: `Field`, the `.chip` toggles from `ContactForm`, `btn btn-primary`, `PageIntro`, `HairlineFrame`. Dark ground, gold focus rule, no modals or toasts (§5.9 of the redesign plan).
- Single column, at least 16 px gutters, works at 360 px wide. People will be on the call using a laptop or phone.
- Each free-text field shows a live **word counter** against its limit, plus a one-line example in the hint slot (e.g. *"Led sale of a 42 MW hydro platform to a strategic buyer"*).
- Multi-selects are chips with a visible "pick up to N" count. Every open list ends with an **Other…** chip; see §6.0 for how it behaves.

### 5.8 Accessibility (P0)
- Every input has a label. Chip groups use `<fieldset>`/`<legend>` with `aria-pressed`. Errors go in an `aria-live` region. The whole form works with the keyboard alone. Contrast is AA.

## 6. Fields

Notation: **R** = required to submit, *S* = soft (shows a warning if empty), blank = optional. "Pick" means chips from a fixed list. **Every pick list ends with "Other…"** unless marked *closed*. §6.0 covers how Other behaves, and §6.9 covers the conditional fields.

### 6.0 How "Other…" works everywhere (P0)
- Choosing **Other…** reveals a text input directly below the group and focuses it. Its label is "Other — please specify". It's **required while Other is selected**, ≤ 60 characters.
- In a multi-select, Other can take **several values**: type one, press Enter or comma, and it becomes a chip. Custom chips count toward the group's "pick up to N" limit.
- **Matching custom values to the list:** as the person types, if the text matches an existing option or a synonym (§6.10), the page shows *"Did you mean **Financial Reporting**?"* One click selects the standard option instead. This keeps custom entries rare and the lists consistent.
- If Other is deselected, its text is cleared from the submission but kept in the draft, so turning Other back on restores it.
- **In the JSON**, the pick field holds the final resolved values with standard and custom entries mixed. A matching `*_custom` array lists the values that were typed. The generator uses custom values as written after normalizing them (§6.10), and Matt sees them in the email's "Custom entries" block so he can add frequent ones to the lists. Example:
  ```json
  "focus_areas": ["Financial Reporting", "Treasury", "Lease Accounting"],
  "focus_areas_custom": ["Lease Accounting"]
  ```
- *Closed* lists, which have no Other option: `pronoun`, `can_name_publicly`, `engagement_status`, credential `status`, and the yes/no toggles.

### 6.1 Basics
| Field | Type | Rules |
|---|---|---|
| `first_name`, `last_name` | text | **R**, ≤ 60 chars each |
| `preferred_name` | text | e.g. "Charlie". Used after the first mention. Defaults to the first name. |
| `pronoun` | pick (*closed*): he / she / they / **use my name only** | **R**. Bios are third-person, so we ask rather than guess. "Name only" means the generator repeats the preferred name and uses no pronouns. |
| `email` | email | **R**. Becomes the Reply-To. |
| `title` | pick (one) | **R**. Partner · Managing Director · Strategic Partner · Senior Advisor · Senior Consultant · Consultant · Associate · Administrative and Operations Manager · Other… |
| ↳ `title_custom` | text ≤ 60 chars | Shown, and **R**, when `title = Other…` |
| ↳ `title_specialization` | text ≤ 50 chars | Shown for Strategic Partner, Senior Advisor and Senior Consultant, e.g. "Structured Finance & Risk", "Human Resources". Title Case, no trailing period. |
| `roster_match` | pick from roster or "I'm not listed" | Shown first. "Not listed" reveals ↳ `is_new_hire` (yes/no). New hires get a softer warning on `prior_roles`. |
| `year_joined_fairlead` | year | **R**, 2010 to the current year |
| `career_start_year` | year | **R**. The generator turns this into "more than N years". **We never store "years of experience"**, because it goes stale. |
| `location` | text | City, e.g. "Houston" |
| `linkedin_url` | url | Must be a `linkedin.com/in/…` URL |

### 6.2 Fairlead role
| Field | Type | Rules |
|---|---|---|
| `service_lines` | pick, 1–3 | **R**. Uses the engagement deck's legend: Operating Partner · Assessment & Diligence · M&A & Capital Raising · Interim / Fractional Leadership · Advisory · Supporting Services · Other… |
| ↳ `supporting_areas` | pick, 1–3 | Shown, and **R**, when Supporting Services is selected: Accounting & Close · Financial Reporting · Human Resources · Payroll · Corporate Governance & Secretary · Administration & Operations · IT & Systems · Tax · Other… |
| ↳ `leadership_mode` | pick | Shown when Interim / Fractional Leadership is selected: Interim (full-time, fixed term) · Fractional (part-time, ongoing) · Both |
| `seats` | pick, 0–5 | Roles you step into: CEO · CFO · COO · CRO · Chief Restructuring Officer · Controller · Treasurer · Board member / Board advisor · Operating Partner · Asset manager · HR lead · Corporate secretary · Other… |
| `focus_areas` | pick, **3–4** | **R**. This becomes the deck card line and the hub `roles` field. List in §6.8. |
| `sectors` | pick, 1–3 | *S*. From the deck: Energy & Power · Renewable Power · District Energy · Oil & Gas · Sustainable Fuels · Infrastructure · Construction · Industrial · Minerals & Processing · Food Industry · Technology & Startups · AI · SaaS · IoT · HealthTech · Other… |
| `client_types` | pick | Private equity · Venture capital · Family office · Lenders & creditors · Boards · Management teams · Government |
| `value_statement` | text ≤ 30 words | **R**. Prompt: *"Finish the sentence: I help portfolio companies…"* Claude rewrites it in house tone. |

### 6.3 Recent Fairlead work (from the Renee call: "the last big deals you've worked on")
Repeatable block, **1–3 entries**, with at least 1 required. Shown first and given the most room on the page.

| Field | Type | Rules |
|---|---|---|
| `company` | text, with autocomplete from the deck's public engagement names | **R** if `can_name_publicly = yes`; otherwise optional and labeled "for Matt only" |
| `can_name_publicly` | pick (*closed*): yes / no / not sure | **R**. Defaults to **not sure**. Anything other than "yes" means Claude must use the descriptor. |
| `descriptor` | text ≤ 15 words | **R**. An anonymous version, e.g. "a PE-backed oil field services company with $300M in revenue" |
| `engagement_status` | pick (*closed*): completed / ongoing | **R**. Sets the tense: ongoing is written in present tense ("serves as fractional CFO"), completed in past tense. |
| `engagement_type` | pick (one): the six service lines from §6.2 + Other… | *S*. The deck's legend for this engagement |
| `your_role` | pick (one): the seats list from §6.2 + Sell-side lead · Buy-side diligence lead · Fundraising lead · Special committee chair · Workstream lead · Team member + Other… | **R** |
| `what_you_did` | text ≤ 30 words | **R**. Start with a verb. |
| `result` | text ≤ 25 words | *S*. A number wherever possible: $, MW, %, multiple, timeline |
| `result_confidential` | checkbox | If checked, `result` is hidden and its warning is cleared. The generator describes the work without an outcome. |
| `year` | year | *S*. Labeled "year started" for ongoing engagements and "year completed" for completed ones. |
| `sponsor` | text | Shown only if `can_name_publicly = yes`, under the same naming rule |
| `sector` | pick (one) from §6.2 sectors + Other… | *S* |

### 6.4 Career before Fairlead
Repeatable, **1–4 entries**, most recent first. Drag to reorder.

| Field | Type | Rules |
|---|---|---|
| `employer` | text, with autocomplete from the canonical employer list (§6.10) | **R** |
| `employer_descriptor` | text ≤ 12 words | *S*, e.g. "a $1.5 billion district energy company". Pre-filled when an autocompleted employer has a standard descriptor. |
| `title` | text | **R**. Spelled out, never abbreviated ("Vice President, Finance", not "VP Fin") |
| `start_year`, `end_year` | year, plus a **"Current role"** checkbox that replaces `end_year` | Used **for ordering only**. Never printed. `end_year` ≥ `start_year`. |
| `concurrent_role_type` | pick (*closed*), shown only when **Current role** is checked: "My own firm / practice" · "Board seat" · "Teaching / adjunct" · "Other employment" | Choosing "My own firm" moves the entry into `extras.outside_firm` (§6.6) and removes it from prior roles. Board and teaching entries go to `board_and_affiliations`. |
| `highlight` | text ≤ 30 words | *S*. One quantified fact |

Plus `earlier_career` (text ≤ 25 words, optional), e.g. *"Began in public accounting with a focus on audit and tax."*

### 6.5 Education and credentials
| Field | Type | Rules |
|---|---|---|
| `degrees[]` | repeatable: **degree** (pick: B.A. · B.S. · BBA · B.Com. · B.Eng. · M.A. · M.S. · MBA · M.Acc. · Master of Business Taxation · Master's (other) · J.D. · Ph.D. · Other…) · **field** (text, e.g. "Finance") · **concentration** (text, optional) · **institution** (autocomplete, §6.10) · **honors** (pick: summa cum laude · magna cum laude · cum laude · with distinction · Other…) · **in progress** (checkbox) | *S*, at least 1. "In progress" makes the generator write "is pursuing". |
| `credentials[]` | repeatable: **designation** (pick: CFA · CPA · P.E. · CGMA · CIRA · CTP · CMA · CIA · CFP · CAIA · FRM · PMP · CA (Canada) · SHRM-CP · SHRM-SCP · SPHR · Other…) · **status** (*closed*: active / inactive / retired / expired) · **jurisdiction** | Status is **R** for each entry. Jurisdiction is shown, and **R**, only when the designation is a license (CPA, P.E., CA) and the status is active. Values match the `CREDENTIAL` regex in `lib/team.ts`, which needs SHRM/SPHR/CA added. |
| `is_registered_rep` | toggle (*closed*): yes / no | "Are you a registered representative of a broker-dealer?" Defaults to no. |
| ↳ `broker_dealer_name` | text | Shown, and **R**, when the toggle is yes |
| ↳ `regulatory_disclosure` | textarea | Shown, and **R**, when the toggle is yes. Pre-filled with *"{First} is a registered representative of {broker_dealer_name} (member FINRA/SIPC), through which broker-dealer services associated with {his/her/their} engagements are offered."* The person can edit it. It's reproduced word for word. |
| `other_licenses` | text list | e.g. "Series 79, Series 63", "Licensed Professional Engineer, California" |

### 6.6 Extras
| Field | Type | Rules |
|---|---|---|
| `board_and_affiliations[]` | repeatable: **role** (pick: Board member · Board chair · Advisory board · Committee chair · Chapter president · Officer · Member · Adjunct instructor · Other…) · **organization** (text) · **type** (pick: Company · Nonprofit · Industry association · Academic · Other…) | e.g. President, TMA Houston Chapter (industry association) |
| `has_outside_firm` | toggle (*closed*) | "Do you also run your own firm or practice?" |
| ↳ `outside_firm` | name + descriptor (≤ 12 words) | Shown, and **R**, when the toggle is yes (e.g. Valinor Energy, Apex Global Advisors). Recorded for Matt. The generator leaves it out unless he approves. |
| `languages[]` | pick: English · Spanish · French · Portuguese · German · Mandarin · Vietnamese · Hindi · Arabic · Other… | Shown only if the person picks something besides English. English alone isn't mentioned in the bio. |
| `include_personal_line` | toggle (*closed*) | "Add one personal line for the website?" |
| ↳ `personal_line` | text ≤ 25 words | Shown, and **R**, when the toggle is yes, e.g. "Avid runner; 11 marathons including Boston 2015" |
| `headshot_choice` | pick (*closed*): keep my current photo · upload a new one · I need a new one taken | "Keep" is offered only when the roster record `has_photo`. "Upload" reveals the uploader from §5.6. "Need one" is flagged for Matt. |
| `do_not_mention` | text | Anything that must stay out of the bio |
| `notes_to_matt` | text ≤ 100 words | Not used in the bio |

### 6.7 Hard requirements to submit
First and last name, pronoun, email, title, year joined, career start year, at least 1 service line, 3–4 focus areas, the value statement, **at least 1 recent Fairlead engagement**, at least 1 prior role (0 for new hires), and a status on every credential. Also every field §6.9 marks **required when shown**, for example a typed value whenever Other… is selected. Everything else is a warning, not a blocker. Nobody should get stuck halfway through the call.

### 6.8 Focus-area list (`focus_areas`)
Normalized from the deck's role lines so the same skill isn't written three ways:

> Accounting · Financial Reporting · Forecasting & FP&A · Financial Modeling · Valuation · Working Capital & Cash Management · Treasury · Tax & International Accounting · Audit Support · ERP Selection & Implementation · Internal Controls & Compliance · Payroll · M&A Execution · Buy-side Diligence · Sell-side & Exit Preparation · Capital Raising · Debt & Structured Finance · Credit Risk · Restructuring & Turnaround · Strategic Planning · Business Planning · Operations · Asset Management · Project Management · Capital Planning · EHS · Commercial Diligence · Go-to-Market Strategy · Growth Planning · Sales & Marketing Systems · Business Development · Human Resources · Integration & 100-Day Plans · Corporate Governance · Board Support · Back Office Support · Technology Integration · Data Analysis · Research · Financial Hedging · Broker-Dealer Services · Other…

The chips are grouped under small headings (Finance & Accounting · Transactions · Leadership & Strategy · Operations & Technical · Commercial · People & Governance) so 42 options stay easy to scan.

### 6.9 Conditional logic, all in one place
`lib/bio/schema.ts` exports this as data, and the form and the API both evaluate it. A hidden field is never validated and never sent.

| Trigger | Shows | Required when shown? |
|---|---|---|
| Any pick has **Other…** selected | `{field}_custom` input (§6.0) | Yes |
| `roster_match` = "I'm not listed" | `is_new_hire`; name fields start empty | Yes |
| `roster_match` = a name | The "Your current bio" panel; prefill | — |
| `title` = Other… | `title_custom` | Yes |
| `title` ∈ {Strategic Partner, Senior Advisor, Senior Consultant} | `title_specialization` | No (Strategic Partner: *S*) |
| `service_lines` ∋ Supporting Services | `supporting_areas` | Yes |
| `service_lines` ∋ Interim / Fractional Leadership | `leadership_mode`; `seats` becomes *S* | No |
| Engagement `can_name_publicly` = yes | `company` required; `sponsor` shown | Yes |
| Engagement `can_name_publicly` = no / not sure | `company` relabeled "for Matt only", optional; `sponsor` hidden | — |
| Engagement `engagement_status` = ongoing | `year` relabeled "year started"; present tense | — |
| Engagement `result_confidential` checked | `result` hidden; its warning cleared | — |
| Prior role **Current role** checked | `concurrent_role_type`; `end_year` hidden | Yes |
| `concurrent_role_type` = My own firm | The entry moves to `outside_firm`, `has_outside_firm` is set to yes | — |
| Credential is a license (CPA, P.E., CA) **and** status = active | `jurisdiction` | Yes |
| Credential status ≠ active | Note: "Won't appear after your name; still useful for Matt" | — |
| Degree `in_progress` checked | `honors` hidden | — |
| `is_registered_rep` = yes | `broker_dealer_name`, `regulatory_disclosure` (pre-filled) | Yes |
| `has_outside_firm` = yes | `outside_firm` name + descriptor | Yes |
| `include_personal_line` = yes | `personal_line` | Yes |
| `headshot_choice` = upload | The uploader (§5.6) | Yes |
| `headshot_choice` = keep | Offered only if the roster record `has_photo` | — |
| `is_new_hire` = yes | The `prior_roles` minimum drops from 1 to 0, with a soft warning | — |

### 6.10 Consistency layer
Free text is where bios start to drift, so the page normalizes input **on blur**. The person sees the corrected value. The raw input is kept only in the draft. The same functions (`lib/bio/normalize.ts`) run again on the server.

**Typing and format**
- Trim, collapse repeated spaces, convert straight quotes to curly quotes, and drop the trailing period on any field under 15 words.
- Names: Title Case only if typed all-lowercase or ALL-CAPS. Mixed case is left alone (McDonald, de la Cruz).
- Years: four digits between 1960 and the current year. `end_year` ≥ `start_year`. `year_joined_fairlead` ≥ 2010 (Fairlead's founding year). `career_start_year` ≤ `year_joined_fairlead`.
- LinkedIn: strip query strings and force `https://www.linkedin.com/in/{handle}`.
- Email: lowercase. Show a gentle warning if the domain isn't `fairleadadvisors.com` (strategic partners may use their own).
- Word and character counters turn gold at the limit and stop further input at the cap.

**Fixed spellings** (applied to credentials, degrees and Other values)
| Typed | Stored |
|---|---|
| PE, P.E, pe, Professional Engineer | P.E. |
| cpa, C.P.A. | CPA |
| BS, B.S, BSc, Bachelor of Science | B.S. |
| BA, B.A, Bachelor of Arts | B.A. |
| MBA, M.B.A. | MBA |
| PhD, Ph.D | Ph.D. |
| JD, J.D | J.D. |
| Chartered Accountant (Canada), CPA Canada | CA (Canada) |
| CFA charterholder | CFA |

**Synonyms for "Did you mean…?"** (custom text → standard option; this is a starting list in `lib/bio/options.ts`)
| Typed (case-insensitive) | Standard option |
|---|---|
| Reporting, financial statements, close, month-end close | Financial Reporting |
| FP&A, budgeting, planning, forecasting | Forecasting & FP&A |
| modeling, models, financial model | Financial Modeling |
| ERP, D365, Dynamics, NetSuite, Sage Intacct, SAP, QuickBooks implementation | ERP Selection & Implementation |
| M&A, mergers, acquisitions, transactions | M&A Execution |
| due diligence, diligence, buy-side | Buy-side Diligence |
| exit, sale process, sell-side | Sell-side & Exit Preparation |
| fundraising, capital raise, equity raise | Capital Raising |
| restructuring, turnaround, bankruptcy, Chapter 11, CRO | Restructuring & Turnaround |
| SOX, controls, compliance | Internal Controls & Compliance |
| HR, people, talent, compensation, benefits | Human Resources |
| integration, PMI, 100-day plan | Integration & 100-Day Plans |
| governance, corporate secretary, board minutes | Corporate Governance |
| GTM, go to market, sales strategy | Go-to-Market Strategy |
| cash, cash management, liquidity, working capital | Working Capital & Cash Management |
| tax, international tax, transfer pricing | Tax & International Accounting |
| AP/AR, bookkeeping, accounting | Accounting |
| Solar, wind, renewables | Renewable Power (sector) |
| Biotech, life sciences, medtech | HealthTech (sector) |
| Oilfield services, frac sand, midstream | Oil & Gas (sector) |

**Canonical names** (autocomplete for `employer` and `institution`, taken from the current bios, so a name is written the same way in every bio)
- *Employers:* NRG Energy, Inc. · The Trigen Companies · Veolia North America · Vicinity Energy · Ever-Green Energy · Greenleaf Power · AlphaStruxure · Excelsior Energy, Inc. · Texas-New Mexico Power · Wayzata Investment Partners · KLX Energy Services · Greene's Energy Group · J.P. Morgan · Morgan Stanley · UBS · Deutsche Bank · Barclays Capital · CIBC Capital Markets · The Brattle Group · Merrill Lynch · Ernst & Young · Grant Thornton · Alvarez & Marsal · Getzler Henrich · Macquarie · Raytheon Engineers & Constructors · Honeywell · Ecolab · Ambri, Inc. · Niotan, Inc. · Pinnacle Airlines (now Endeavor Air) · Dufresne Spencer Group (Ashley Furniture HomeStore) · PSP Investments · Entegris, Inc. · Comcast · Black Box Network Services · Kearsarge Energy · AAFCPAs. Each comes with a standard descriptor where we have one (e.g. NRG Energy, Inc. → "then the third-largest independent power producer in the world").
- *Institutions:* University of Minnesota, Carlson School of Management · Columbia Business School · NYU Stern School of Business · The Wharton School, University of Pennsylvania · Rice University, Jones Graduate School of Business · London School of Economics · Tufts University · Georgetown University · Cornell University · McGill University · Texas A&M University · Santa Clara University · University of Nevada, Reno · University of Maryland · University of Vermont · University of Denver · University of St. Thomas · University of Iowa · University of Houston · University of North Dakota · Nicholls State University · University of Oxford · University of Louisiana at Lafayette · Earlham College · Union University · ICADE Business School.
- Autocomplete only suggests. Any value is accepted, and a new value is flagged as "new name" in the email so Matt can add it to the list.

**Cross-field checks** (warnings shown on the review screen and listed in `data.warnings`)
- `focus_areas` and `seats` repeat each other, e.g. "CFO" chosen in both. The focus area is dropped automatically.
- A recent engagement's `what_you_did` mentions a company name while `can_name_publicly` ≠ yes. Prompt: "This mentions *{name}* — move it to the descriptor?"
- `title` is Partner, but the roster record says otherwise, or the reverse. Flagged as "Title differs from website — Matt to confirm".
- A credential is active but not in the roster `suffix`, or the reverse. Flagged.
- `career_start_year` gives 40+ years, or fewer than 2. Asks "Is this right?"
- An empty `result` on every engagement. A single stronger warning: "Bios with numbers read much stronger."
- A `do_not_mention` term appears anywhere else in the submission. Flagged.

## 7. JSON output (`fairlead.bio-intake/v1`)

Each file has three top-level parts: **`instructions`** (fixed text, the same in every file), **`submission`** (metadata) and **`data`** (the answers). Matt can drop in one file or twenty and Claude gets the same rules each time.

The source of truth for the instructions is `lib/bio/generator.ts` (`BIO_GENERATOR_V1`). The API route copies it into every file, so the page and the files can't drift apart. Changing the instructions means bumping to `v2`.

```json
{
  "schema": "fairlead.bio-intake/v1",
  "instructions": {
    "version": "bio-generator/v1",
    "task": "Write this person's Fairlead Advisors bio in the exact formats in `outputs`, following every rule in `style`. Return ONLY the JSON object described in `return_format`. If several of these files are provided, return an array with one object per file, in the order given.",
    "outputs": {
      "card": "Line 1: '{Full name}' + ', {active credentials}' if any. Line 2: Fairlead title (+ ', {title_specialization}'). Line 3: focus_areas joined with ', '. This is the deck slide format.",
      "short": "60–80 words, one paragraph. Sentence 1: name, title at Fairlead Advisors, and what they do for clients (from value_statement + service_lines + focus_areas). Sentence 2: the strongest recent Fairlead engagement. Sentence 3: the most relevant prior role. Final sentence: degrees.",
      "standard": "160–200 words, exactly four paragraphs. P1 Fairlead role: title, what they do for clients, service lines, sectors, seats. P2 Recent Fairlead work: 2–3 engagements, each with action and result. P3 Career before Fairlead: up to 3 prior roles, most recent first, employer descriptor + one highlight each. P4 Credentials and education: active credentials, degrees, board roles; then personal_line if present. If regulatory_disclosure is present, append it verbatim as a separate final line."
    },
    "style": [
      "Third person. Use the pronoun given in data.basics.pronoun; never infer it. If it is 'name_only', repeat the preferred name and use no pronouns.",
      "Ongoing engagements (engagement_status 'ongoing') in present tense; completed ones in past tense. If result_confidential is true, describe the work without an outcome.",
      "Values listed in any *_custom array were typed by the person: use them as written (already normalized) and list each in `flags` as 'custom value: {field} = {value}'.",
      "Degrees marked in_progress are written 'is pursuing a {degree} in {field} at {institution}'.",
      "Languages: mention only if a language other than English is listed.",
      "Full name on first mention; preferred_name (or first name) thereafter. Never Mr./Ms.",
      "Present tense for the Fairlead role; past tense for prior roles and completed engagements.",
      "Lead with what the person does for clients, not with career history.",
      "Compute experience from career_start_year against submitted_at, rounded down to the nearest 5 years and phrased 'more than N years'. Compute Fairlead tenure as 'since joining Fairlead in {year_joined_fairlead}'. Never print other year ranges.",
      "Numbers over adjectives. Keep every figure exactly as submitted; never round up, combine, or invent one.",
      "Banned words: seasoned, accomplished, proven, track record, trusted advisor, leverages, results-driven, passionate, dynamic, synergy, world-class, extensive (unless quantified).",
      "Name a client or sponsor ONLY if can_name_publicly is 'yes'; otherwise use the descriptor verbatim or lightly edited. Never name a sponsor whose company is anonymized.",
      "Only credentials with status 'active' appear after the name or as post-nominals. Inactive/retired/expired credentials are omitted unless Matt asks otherwise.",
      "Do not mention outside_firm or anything in do_not_mention.",
      "Title comes from data.basics.title exactly; never describe the person with a different title.",
      "Use only facts present in `data`. Do not add employers, degrees, numbers, or clients. If something essential is missing, say so in `flags` rather than filling the gap.",
      "American English, Oxford comma, '$1.9 billion' / '$300 million' in prose, 'MW' for megawatts, no exclamation marks, no first person."
    ],
    "return_format": {
      "person": "Full name",
      "hub_fields": {
        "name": "Full name",
        "suffix": "Active credentials then title, comma-separated — e.g. 'CFA, Partner' — matching team_members.suffix",
        "roles": "focus_areas joined with ', ' — matching team_members.roles",
        "extended_bio": "The standard bio, paragraphs separated by a blank line — matching team_members.extended_bio"
      },
      "card": "string (3 lines, \\n-separated)",
      "short": "string",
      "standard": "string",
      "word_counts": { "short": 0, "standard": 0 },
      "flags": ["Anything missing, inconsistent, unverifiable, or that needs Matt's decision (e.g. 'Engagement 2 has no result', 'CPA status inactive — omitted')."]
    }
  },
  "submission": {
    "submission_id": "uuid",
    "submitted_at": "2026-10-15T15:42:10Z",
    "revision_of": null,
    "source": "fairleadadvisors.com/bio",
    "hub_team_member_id": 12,
    "prefill": { "name": "…", "suffix": "…", "roles": "…" },
    "headshot_attached": false
  },
  "data": {
    "basics": {
      "roster_match": "hub id | not_listed", "is_new_hire": false,
      "first_name": "", "last_name": "", "preferred_name": "",
      "pronoun": "he|she|they|name_only",
      "email": "", "title": "", "title_custom": "", "title_specialization": "",
      "year_joined_fairlead": 2012, "career_start_year": 2005,
      "location": "", "linkedin_url": ""
    },
    "fairlead_role": {
      "service_lines": [], "service_lines_custom": [],
      "supporting_areas": [], "supporting_areas_custom": [],
      "leadership_mode": "interim|fractional|both|null",
      "seats": [], "seats_custom": [],
      "focus_areas": [], "focus_areas_custom": [],
      "sectors": [], "sectors_custom": [],
      "client_types": [], "client_types_custom": [],
      "value_statement": ""
    },
    "recent_engagements": [
      { "company": "", "can_name_publicly": "yes|no|not_sure", "descriptor": "",
        "engagement_status": "completed|ongoing",
        "engagement_type": "", "engagement_type_custom": "",
        "your_role": "", "your_role_custom": "",
        "what_you_did": "", "result": "", "result_confidential": false,
        "year": 2025, "sponsor": "", "sector": "", "sector_custom": "" }
    ],
    "prior_roles": [
      { "employer": "", "employer_is_new_name": false, "employer_descriptor": "", "title": "",
        "start_year": 2015, "end_year": 2020, "current": false, "concurrent_role_type": null,
        "highlight": "" }
    ],
    "earlier_career": "",
    "education": [
      { "degree": "", "degree_custom": "", "field": "", "concentration": "",
        "institution": "", "institution_is_new_name": false,
        "honors": "", "honors_custom": "", "in_progress": false }
    ],
    "credentials": [
      { "designation": "CPA", "designation_custom": "",
        "status": "active|inactive|retired|expired", "jurisdiction": "TX" }
    ],
    "registration": {
      "is_registered_rep": false, "broker_dealer_name": "", "regulatory_disclosure": ""
    },
    "other_licenses": [],
    "extras": {
      "board_and_affiliations": [
        { "role": "", "role_custom": "", "organization": "", "type": "", "type_custom": "" }
      ],
      "has_outside_firm": false, "outside_firm": { "name": "", "descriptor": "" },
      "languages": [], "languages_custom": [],
      "include_personal_line": false, "personal_line": "",
      "headshot_choice": "keep|upload|need_new",
      "do_not_mention": "", "notes_to_matt": ""
    },
    "warnings": []
  }
}
```

**Matt's workflow:** save the attachments to a folder, drop them into Claude, and send *"Generate bios."* The rules travel with the files, so no other prompt is needed. Paste `hub_fields` into the hub's Team module, and `/team` revalidates by itself.

**Worked example** (what `short` should look like, from Alex MacDonald's current facts):
> Alex MacDonald is a Managing Director at Fairlead Advisors, where he leads financial modeling, valuation, working capital management, and debt compliance for portfolio companies. Since joining Fairlead in 2012, Alex has supported dozens of clients across power generation, mining, and oil field services, including serving as interim Finance Director of an oil field services company through its 2023 sale. He previously helped lead the turnaround and sale of tantalum manufacturer Niotan. Alex holds a B.S. in Finance from Santa Clara University and an MBA from the University of Nevada, Reno.

## 8. Technical design

```
app/bio/page.tsx                 server: getTeam() → roster props; noindex metadata
components/bio/BioIntakeForm.tsx client: sections, chips, repeaters, autosave, review, submit, fallbacks
components/bio/options.ts        every pick-list in §6, synonyms, canonical employers/institutions (single source)
components/bio/PickGroup.tsx     chip group + "Other…" reveal + custom-chip entry + "Did you mean…?"
lib/bio/schema.ts                types + CONDITIONS (§6.9) + validate(): BioIntakeData → { errors, warnings }
lib/bio/normalize.ts             §6.10 normalizers + cross-field checks (run on blur and on the server)
lib/bio/generator.ts             BIO_GENERATOR_V1 (the `instructions` block in §7)
lib/bio/email.ts                 renders the readable plain-text summary
app/api/bio/route.ts             honeypot, rate limit, validate, stamp metadata, build JSON, send
lib/resend.ts                    + optional `attachments` passthrough
app/robots.ts                    + disallow "/bio"
.env.example                     + BIO_TO, BIO_ACCESS_CODE
```

- No new dependencies. Validation is hand-written in `lib/bio/schema.ts`, matching the existing routes. The client and server share the same `validate()`.
- The client builds the JSON for the **Download** fallback with the same builder the server uses (`buildBioJson(data, meta)`). The only difference: a downloaded file has `submission.submission_id = "local-…"` and `source = "download"`.
- Request body cap: 64 KB, or 7 MB with a headshot (P1).

**Environment (production on Vercel):**
| Var | Value | Note |
|---|---|---|
| `RESEND_API_KEY` | existing | **Confirm it's set in Production before the call.** Without it, the route returns 503 (§5.4). |
| `CONTACT_FROM` | `no-reply@fairleadadvisors.com` | Must be a domain verified in Resend |
| `BIO_TO` | `mfaria@fairleadadvisors.com` | New. Comma-separated values allowed. |
| `BIO_ACCESS_CODE` | *(unset)* | Optional gate. Leave it off for Thursday. |

## 9. Acceptance criteria

1. `GET /bio` returns 200 on production, with `<meta name="robots" content="noindex, nofollow">`. `/bio` is absent from `/sitemap.xml` and disallowed in `/robots.txt`.
2. Choosing a name from the roster pre-fills title, credentials and roles, and shows the current bio.
3. Reloading the tab in the middle of the form restores every field, including repeaters.
4. Submitting with only the hard requirements (§6.7) succeeds. Leaving any of them out blocks submission and moves focus to the first error.
5. Within 1 minute, `mfaria@fairleadadvisors.com` receives an email with the correct subject, the readable summary, the warnings, the inline JSON block and a `.json` attachment.
6. The attached JSON parses, has `schema = fairlead.bio-intake/v1`, and its `instructions` match `BIO_GENERATOR_V1` exactly.
7. Two test files dropped into Claude with "Generate bios." return a 2-element array in `return_format`. Each `short` is 60–80 words and each `standard` is 160–200 words in four paragraphs. No banned words appear, and an engagement marked `not_sure` is not named.
8. With `RESEND_API_KEY` removed in a Preview deploy set to production mode, submitting shows the error state with working **Download JSON** and **Email it instead**.
9. **Conditionals:** each row of §6.9 is checked. The dependent field appears, it's required only when visible, and a hidden field never appears in the JSON. Choosing Other… in any group shows a required text input. Typing "FP&A" there suggests *Forecasting & FP&A*.
10. **Normalization:** "pe" → "P.E.", "BS" → "B.S.", an ALL-CAPS name → Title Case, and an `end_year` before `start_year` is rejected. The server applies the same results even if the client is bypassed.
11. Lighthouse accessibility ≥ 95. The full flow works with the keyboard only, and at 360 px wide.
12. `npm run typecheck`, `npm run lint` and `npm run build` pass.

## 10. Test plan (tonight)

- Unit-test `validate()`, `normalize()` and `buildBioJson()` with five fixtures: minimal, full, Craig's case (registered rep plus disclosure), Mitchell's case (a current role at his own firm), and an "Other everywhere" case (a custom value in every group).
- On a Preview deploy: submit the three fixtures, confirm the three emails and attachments arrive, then run the attachments through Claude and check criterion 7.
- On a phone: run through the whole form on iOS Safari and Android Chrome.
- **Thursday morning:** one real submission on production by Matt, end to end.

## 11. Launch plan for Thursday

| When | What |
|---|---|
| Wed evening | Build, open the PR, deploy a Preview, run §10 |
| Wed night | Merge to `main`, confirm production env vars (§8), smoke test |
| Thu, before the call | Matt submits his own bio, checks the email, runs it through Claude |
| Thu, on the call | Don't announce it ahead of time. Open with "Adam, Renee and Mitchell are tied up." Spend about 5 minutes on what a good bio includes (business background, education, recent big Fairlead deals), using Adam's and Renee's current bios as examples. Paste `fairleadadvisors.com/bio` in the chat. Everyone works for 20–30 minutes with open Q&A. |
| Thu, after the call | Send the link to Adam, Renee and Mitchell. Track who hasn't submitted against the 26-person roster. |
| Following week | Generate the bios, send each person their draft to approve, paste approved `hub_fields` into the hub, update deck slides 2–3 from `card` |

## 12. Risks

| Risk | Mitigation |
|---|---|
| Resend isn't configured in production, so mail is silently skipped | The route returns 503 in that case (§5.4), and the client always offers Download and mailto fallbacks. Smoke test Thursday morning. |
| People run out of time on the call | Autosave, a short list of hard requirements, and **recent Fairlead work** placed early in the form |
| Confidential client names end up in public bios | `can_name_publicly` defaults to "not sure", a descriptor is required, and the generator rule enforces it. Matt reviews every bio. |
| Facts invented during generation | The "use only facts in `data`" rule plus `flags`, and each person approves their own draft |
| The URL leaks | noindex, not linked anywhere, rate limited, and the optional `BIO_ACCESS_CODE`. The cost of a leak is some spam email to Matt. |
| The roster lacks people who aren't website-visible | "I'm not listed" path |

## 13. Decisions taken in this PRD (change before build if needed)

1. **First name after first mention.** No Mr./Ms.
2. **Only active credentials** appear. Inactive, retired and expired ones are collected but left out.
3. **The submitter flags client naming, and Matt has the final say.** "Not sure" means don't name.
4. **Outside firms are collected but left out of the bio** unless Matt approves.
5. **Sectors use the deck's 15-sector list.** The website's `content/seed/sectors.ts` is a separate, unconfirmed draft (see the TODO in that file). Merge the two lists later. Not a blocker.

## 14. Later (v2)

- A "Send to hub" button in the hub's Team module that ingests the JSON and runs the generator through the Anthropic API (`ANTHROPIC_API_KEY` already exists in `.env.example` for Ask Fairlead).
- A completion tracker showing who has and hasn't submitted.
- Pre-filling recent engagements from the hub's `engagements` table. This needs a login first, because those names are confidential and `/bio` is unauthenticated.
