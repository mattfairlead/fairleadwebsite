import clsx from "clsx";
import type { RegisterPublicRow, RegisterRow as FullRow } from "@/lib/types";
import { redactionShape, sectorLabel, workLabel } from "@/lib/register";
import { RedactedLines, RedactedTitle } from "@/components/register/Redacted";
import RevealButton from "@/components/register/RevealButton";
import Decode from "@/components/register/Decode";
import { LockGlyph } from "@/components/register/RevealModal";

/**
 * One register row — the EngagementRow grammar (label column, .h4 title,
 * gold line, summary, tags, pill) in two states that share nothing but the
 * public fields:
 *
 *  locked   — built from RegisterPublicRow ONLY. The title and summary are
 *             redaction bars; the whole row is a button that opens the reveal
 *             sheet. No confidential value is in scope here, by type.
 *  unlocked — RegisterRow: the company, its sponsor and the hub's summary.
 *
 * Server component. The only client pieces are the reveal button and the
 * optional decode animation on the unlocked title.
 */
type Props =
  | { locked: true; row: RegisterPublicRow; decode?: never }
  | { locked: false; row: FullRow; decode: boolean };

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

  if (props.locked) {
    const shape = redactionShape(row.id);
    return (
      <div data-anim="slide-in" className="register-row relative">
        <span className="dec left-0 top-0 h-px w-full" />
        <div className={clsx("spot group", GRID)}>
          {meta}
          <div className="flex flex-col gap-3">
            <span className="sr-only">
              Engagement {row.index}: company, sponsor and summary withheld. Reveal the register to read them.
            </span>
            <RedactedTitle shape={shape} />
            <RedactedLines shape={shape} />
            {tags}
          </div>
          <span className="reveal-pill btn btn-secondary button justify-self-start md:justify-self-end" aria-hidden="true">
            <LockGlyph />
            Reveal
          </span>
          {/* The whole row is the control; the pill above is its affordance. */}
          <RevealButton className="absolute inset-0 z-10 cursor-pointer" ariaLabel={`Reveal engagement ${row.index}`} />
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
