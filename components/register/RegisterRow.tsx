import Link from "next/link";
import clsx from "clsx";
import type { Engagement, RegisterPublicRow, RegisterRow as FullRow } from "@/lib/types";
import { redactionShape, sectorLabel, workLabel } from "@/lib/register";
import { RedactedLines, RedactedTitle } from "@/components/register/Redacted";
import RevealButton from "@/components/register/RevealButton";
import Decode from "@/components/register/Decode";
import { LockGlyph } from "@/components/register/RevealModal";
import { ARROW } from "@/components/Btn";

/**
 * One register row — the EngagementRow grammar (meta column, .h4 title,
 * gold line, summary, tags, pill) in three states that share the same
 * public fields, so the list reads as one table:
 *
 *  featured — a case study Fairlead is cleared to name: company, sponsor,
 *             summary; the whole row links to the case study when one exists.
 *  locked   — built from RegisterPublicRow ONLY. The title is redaction
 *             bars; the summary is readable, with the company and sponsor
 *             names already scrubbed out server-side (falls back to bars when
 *             the hub is unreachable and there is no summary to show). The
 *             whole row is a button that opens the request sheet. No name is
 *             in scope here, by type.
 *  unlocked — RegisterRow: the company, its sponsor and the hub's summary,
 *             for a browser holding a verified grant.
 *
 * Server component. The only client pieces are the request button and the
 * optional decode animation on the unlocked title.
 */
type Props =
  | { kind: "featured"; row: RegisterPublicRow; engagement: Engagement }
  | { kind: "locked"; row: RegisterPublicRow }
  | { kind: "unlocked"; row: FullRow; decode: boolean };

const GRID = "grid items-start gap-4 px-2 py-8 md:grid-cols-[10rem_1fr_auto] md:gap-10 md:px-5";

export default function RegisterRow(props: Props) {
  const { row } = props;
  const num = `№ ${String(row.index).padStart(3, "0")}`;

  const meta = (
    <div className="flex flex-col gap-2">
      <span className="label text-white-50 tabular">{num}</span>
      <span className="body-sm text-white-40">{sectorLabel(row.sector)}</span>
      {row.status && (
        <span className="body-sm flex items-center gap-2 text-white-40">
          <span
            className={clsx("inline-block h-1.5 w-1.5 rounded-full", row.status === "active" ? "bg-gold" : "bg-white-20")}
            aria-hidden="true"
          />
          {row.status === "active" ? "Active" : "Historical"}
        </span>
      )}
    </div>
  );

  const tags = (
    <div className="mt-2 flex flex-wrap gap-2">
      {row.work.map((w) => (
        <span
          key={w}
          className="label rounded-[3px] px-2 py-1.5 text-white-50"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
        >
          {workLabel(w)}
        </span>
      ))}
      {row.sponsor_backed && (
        <span className="label rounded-[3px] px-2 py-1.5 text-gold/80" style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.25)" }}>
          Sponsor-backed
        </span>
      )}
    </div>
  );

  if (props.kind === "featured") {
    const e = props.engagement;
    const detail = Boolean(e.body_md);
    const inner = (
      <>
        {meta}
        <div className="flex flex-col gap-2">
          <h3 className={clsx("h4 transition-colors duration-300", detail && "group-hover:text-gold-soft")}>{e.company_display}</h3>
          <span className="body-md text-gold">{e.sponsor_display}</span>
          <p className="body-md max-w-2xl text-white-60">{e.summary_md}</p>
          {tags}
        </div>
        {detail ? (
          <span className="btn btn-secondary button justify-self-start md:justify-self-end">
            See the engagement
            {ARROW}
          </span>
        ) : (
          <span className="hidden md:block" />
        )}
      </>
    );
    return (
      <div data-anim="slide-in" className="register-row is-open relative">
        <span className="dec left-0 top-0 h-px w-full" />
        {detail ? (
          <Link href={`/engagements/${e.slug}`} className={clsx("spot group", GRID)} aria-label={`${e.company_display} — see the engagement`}>
            {inner}
          </Link>
        ) : (
          <div className={clsx("spot", GRID)}>{inner}</div>
        )}
      </div>
    );
  }

  if (props.kind === "locked") {
    const shape = redactionShape(row.id);
    return (
      <div data-anim="slide-in" className="register-row relative">
        <span className="dec left-0 top-0 h-px w-full" />
        <div className={clsx("spot group", GRID)}>
          {meta}
          <div className="flex flex-col gap-3">
            <span className="sr-only">
              Engagement {row.index}: company and sponsor withheld. Ask a partner for them.
            </span>
            <RedactedTitle shape={shape} />
            {row.summary ? <p className="body-md max-w-2xl text-white-60">{row.summary}</p> : <RedactedLines shape={shape} />}
            {tags}
          </div>
          <span className="reveal-pill btn btn-secondary button justify-self-start md:justify-self-end" aria-hidden="true">
            <LockGlyph />
            Ask for the name
          </span>
          {/* The whole row is the control; the pill above is its affordance. */}
          <RevealButton className="absolute inset-0 z-10 cursor-pointer" ariaLabel={`Ask for the name of engagement ${row.index}`} />
        </div>
      </div>
    );
  }

  const full = props.row;
  return (
    <div data-anim="slide-in" className="register-row is-open relative">
      <span className="dec left-0 top-0 h-px w-full" />
      <div className={clsx("spot", GRID)}>
        {meta}
        <div className="flex flex-col gap-2">
          <h3 className="h4">
            <Decode text={full.company} active={props.decode} delay={Math.min(full.index, 24) * 45} />
          </h3>
          {full.sponsor && <span className="body-md text-gold">{full.sponsor}</span>}
          <p className="body-md max-w-2xl text-white-60">{full.summary}</p>
          {tags}
        </div>
        <span className="hidden md:block" />
      </div>
    </div>
  );
}
