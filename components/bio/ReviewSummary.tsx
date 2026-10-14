"use client";

import { CAN_NAME, CONCURRENT_ROLE_TYPES, HEADSHOT_CHOICES, LEADERSHIP_MODES, PRONOUNS } from "@/lib/bio/options";
import { SECTIONS, type BioIntakeData, type SectionId } from "@/lib/bio/schema";

/**
 * The review screen's answers: one card per step, each with an Edit button
 * that jumps straight back to it, and the warnings that belong to that step
 * shown inside its card ("worth a second look", never blockers).
 */

const label = <T extends { value: string; label: string }>(list: readonly T[], v: string | null) => list.find((x) => x.value === v)?.label ?? v ?? "";
const list = (xs: string[]) => xs.filter(Boolean).join(", ");

/** Which step a warning is about — a best guess from its wording. */
export function warningSection(w: string): SectionId | null {
  if (/^Engagement|mentions .* cleared|No engagement has a result/.test(w)) return "work";
  if (/employer|highlight|roles before Fairlead/i.test(w)) return "career";
  if (/degree|institution|active here|on the website but not listed/i.test(w)) return "education";
  if (/sector|seats|focus areas/i.test(w)) return "role";
  if (/^Title|Email|Career start|Strategic Partner/.test(w)) return "basics";
  if (/headshot|photo|do-not-mention/i.test(w)) return "extras";
  return null;
}

type Row = [string, string];

function rowsFor(id: SectionId, d: BioIntakeData): Row[] {
  const b = d.basics;
  const r = d.fairlead_role;
  switch (id) {
    case "basics":
      return [
        ["Name", `${b.first_name} ${b.last_name}`.trim() + (b.preferred_name && b.preferred_name !== b.first_name ? ` (goes by ${b.preferred_name})` : "")],
        ["Refer to me as", label(PRONOUNS, b.pronoun)],
        ["Email", b.email],
        ["Title", b.title + (b.title_specialization ? `, ${b.title_specialization}` : "")],
        ["Joined Fairlead", b.year_joined_fairlead ? String(b.year_joined_fairlead) : ""],
        ["Career started", b.career_start_year ? String(b.career_start_year) : ""],
        ["City", b.location],
        ["LinkedIn", b.linkedin_url],
      ];
    case "role":
      return [
        ["Service lines", list(r.service_lines)],
        ["Supporting services", list(r.supporting_areas)],
        ["Leadership", r.leadership_mode ? label(LEADERSHIP_MODES, r.leadership_mode) : ""],
        ["Seats", list(r.seats)],
        ["Focus areas", list(r.focus_areas)],
        ["Sectors", list(r.sectors)],
        ["Clients", list(r.client_types)],
        ["I help portfolio companies…", r.value_statement],
      ];
    case "work":
      return d.recent_engagements.flatMap((e, i): Row[] => [
        [
          `Engagement ${i + 1}`,
          [
            e.company && e.can_name_publicly === "yes" ? e.company : e.descriptor,
            e.can_name_publicly !== "yes" ? `(name publicly: ${label(CAN_NAME, e.can_name_publicly).toLowerCase()})` : "",
          ]
            .filter(Boolean)
            .join(" "),
        ],
        ["", [e.your_role, e.engagement_status, e.year ? String(e.year) : "", e.sector].filter(Boolean).join(" · ")],
        ["", e.what_you_did],
        ["", e.result_confidential ? "Result confidential" : e.result ? `Result: ${e.result}` : ""],
      ]);
    case "career":
      return [
        ...d.prior_roles.flatMap((p): Row[] => [
          [p.employer, `${p.title}${p.current && p.concurrent_role_type ? ` (current — ${label(CONCURRENT_ROLE_TYPES, p.concurrent_role_type).toLowerCase()})` : ""}`],
          ["", p.employer_descriptor],
          ["", p.highlight],
        ]),
        ["Earlier career", d.earlier_career],
      ];
    case "education":
      return [
        ...d.education.map((g): Row => [
          g.degree,
          [g.field && `in ${g.field}`, g.institution && `— ${g.institution}`, g.honors && `, ${g.honors}`, g.in_progress && "(in progress)"].filter(Boolean).join(" "),
        ]),
        ...d.credentials.map((c): Row => [c.designation, [c.status, c.jurisdiction].filter(Boolean).join(" · ")]),
        ["Registered rep", d.registration.is_registered_rep ? d.registration.broker_dealer_name : ""],
        ["Other licenses", list(d.other_licenses)],
      ];
    case "extras": {
      const x = d.extras;
      return [
        ...x.board_and_affiliations.map((a): Row => [a.role, [a.organization, a.type && `(${a.type})`].filter(Boolean).join(" ")]),
        ["Own firm", x.has_outside_firm ? `${x.outside_firm.name} — ${x.outside_firm.descriptor}` : ""],
        ["Languages", list(x.languages)],
        ["Personal line", x.personal_line],
        ["Headshot", x.headshot_choice ? label(HEADSHOT_CHOICES, x.headshot_choice) : ""],
        ["Keep out of the bio", x.do_not_mention],
        ["Notes to Matt", x.notes_to_matt],
      ];
    }
  }
}

export default function ReviewSummary({
  data,
  warnings,
  onEdit,
}: {
  data: BioIntakeData;
  warnings: string[];
  onEdit: (id: SectionId) => void;
}) {
  const general = warnings.filter((w) => !warningSection(w));
  return (
    <div className="flex flex-col gap-4">
      {general.length > 0 && <Notes items={general} />}
      {SECTIONS.map((s, i) => {
        const rows = rowsFor(s.id, data).filter(([, v]) => v && v.trim());
        const notes = warnings.filter((w) => warningSection(w) === s.id);
        return (
          <section
            key={s.id}
            aria-labelledby={`rv-${s.id}`}
            className="bio-rise flex flex-col gap-5 rounded-xl bg-blue-900/30 p-5 ring-1 ring-white/10 md:p-8"
            style={{ animationDelay: `${Math.min(i * 40, 280)}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 id={`rv-${s.id}`} className="label flex items-center gap-3 text-white-60">
                <span className="tabular text-gold">{i + 1}</span>
                {s.title}
              </h3>
              <button type="button" className="chip button" onClick={() => onEdit(s.id)} aria-label={`Edit ${s.title}`}>
                Edit
              </button>
            </div>
            {rows.length ? (
              <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_minmax(0,1fr)]">
                {rows.map(([k, v], j) => (
                  <div key={j} className="contents">
                    <dt className="body-sm text-white-40 max-sm:mt-2 max-sm:empty:hidden">{k}</dt>
                    <dd className="body-md break-words text-white-80">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="body-md text-white-40">Nothing here — that’s fine if it doesn’t apply.</p>
            )}
            {notes.length > 0 && <Notes items={notes} />}
          </section>
        );
      })}
    </div>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gold/[0.06] p-4 ring-1 ring-gold/20">
      <span className="label text-gold">Worth a second look</span>
      <ul className="flex flex-col gap-1.5">
        {items.map((w) => (
          <li key={w} className="body-sm flex gap-3 text-white-80">
            <span className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden="true" />
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
