"use client";

import { createContext, useContext, useLayoutEffect, useRef } from "react";
import clsx from "clsx";
import { countWords } from "@/lib/bio/schema";

/**
 * The intake's controls. Every one is a filled surface lifted a tone off
 * the blue — no borders, a gold ring only on focus — so the thing you type
 * into is always obvious (the `.bio-*` recipes in globals.css). Each gets
 * an id derived from its data path (fid) and its error an id the control
 * points at, so the form can focus the first problem and screen readers
 * hear why.
 *
 * A field that is filled in and valid grows a small gold check. Validity
 * comes from <Validity>, which the form wraps everything in with the full
 * error map (visible or not), so a check never shows on a value the review
 * step would bounce.
 */

export const fid = (path: string) => `f-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
export const eid = (path: string) => `e-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

export const Validity = createContext<Record<string, string>>({});
const useValid = (path: string) => !useContext(Validity)[path];

export function CheckGlyph({ size = 14, className, stroke = 2.5 }: { size?: number; className?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ErrorText({ path, error }: { path: string; error?: string }) {
  if (!error) return null;
  return (
    <span id={eid(path)} className="bio-error body-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 7.5v5.5M12 16.25v.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {error}
    </span>
  );
}

/**
 * Stop typing at the word cap (§6.10). Already at the cap, a change that
 * adds a word is refused outright — trimming it instead would eat the
 * space and glue every further keystroke onto the last word. Under the cap
 * (a long paste), keep the first `n` words.
 */
export function capWords(next: string, n: number, prev = ""): string {
  if (countWords(next) <= n) return next;
  if (countWords(prev) >= n) return prev;
  const m = next.match(new RegExp(`^\\s*(?:\\S+\\s+){${n - 1}}\\S+`));
  return m ? m[0] : next;
}

export function TextField({
  path,
  label,
  value,
  onChange,
  normalize,
  words,
  chars,
  example,
  error,
  textarea,
  required,
  className,
  inputProps,
}: {
  path: string;
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  /** Applied on blur — the person sees the corrected value. */
  normalize?: (v: string) => string;
  words?: number;
  chars?: number;
  example?: string;
  error?: string;
  textarea?: boolean;
  required?: boolean;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  // A word-limited phrase wraps and grows instead of scrolling sideways in
  // a one-line input; it still behaves like one line (Enter adds nothing).
  // Every box grows with its text, so nothing hides behind an inner scroll.
  const grow = !textarea && !!words;
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);

  const n = words ? countWords(value) : value.length;
  const cap = words ?? chars;
  const atCap = cap != null && n >= cap;
  // Word caps are part of the brief, so they always show; a character cap
  // only surfaces once it is close enough to matter.
  const showCount = cap != null && (!!words || n >= cap * 0.7);
  const filled = value.trim().length > 0;
  const valid = useValid(path) && !error;

  const common = {
    id: fid(path),
    value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? eid(path) : undefined,
    "data-invalid": error ? "" : undefined,
    className: "bio-input",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = grow ? e.target.value.replace(/[\r\n]+/g, " ") : e.target.value;
      onChange(words ? capWords(v, words, value) : v);
    },
    onBlur: normalize ? () => onChange(normalize(value)) : undefined,
    maxLength: chars,
  };

  return (
    <div className={clsx("flex min-w-0 flex-col gap-2", className)}>
      <label className={clsx("bio-field", filled && "is-filled", filled && valid && "is-valid", error && "is-invalid", atCap && "is-capped")}>
        <span className="bio-field-head">
          <span className="bio-field-label label">{label}</span>
          {showCount && (
            <span className="bio-field-meta tabular body-sm">
              {n}/{cap}
              {words ? " words" : ""}
            </span>
          )}
        </span>
        {grow ? (
          <textarea rows={1} ref={ref} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} {...common} />
        ) : textarea ? (
          <textarea rows={3} ref={ref} style={{ minHeight: "5.5rem" }} {...common} />
        ) : (
          <input {...inputProps} {...common} />
        )}
        <span className="bio-field-check">
          <CheckGlyph size={16} />
        </span>
      </label>
      {(example || error) && (
        <p className="bio-field-foot body-sm">
          {error ? <ErrorText path={path} error={error} /> : <span className="bio-hint">{example}</span>}
        </p>
      )}
    </div>
  );
}

export function YearField({
  path,
  label,
  value,
  onChange,
  error,
  required,
}: {
  path: string;
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  error?: string;
  required?: boolean;
}) {
  const filled = value != null;
  const valid = useValid(path) && !error;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label className={clsx("bio-field", filled && "is-filled", filled && valid && "is-valid", error && "is-invalid")}>
        <span className="bio-field-head">
          <span className="bio-field-label label">{label}</span>
        </span>
        <input
          id={fid(path)}
          className="bio-input tabular"
          value={value == null ? "" : String(value)}
          inputMode="numeric"
          autoComplete="off"
          placeholder="YYYY"
          maxLength={4}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? eid(path) : undefined}
          data-invalid={error ? "" : undefined}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
            onChange(digits ? Number(digits) : null);
          }}
        />
        <span className="bio-field-check">
          <CheckGlyph size={16} />
        </span>
      </label>
      {error && (
        <p className="bio-field-foot body-sm">
          <ErrorText path={path} error={error} />
        </p>
      )}
    </div>
  );
}

/** One chip. `pressed` paints it gold and unfolds the check. */
export function Chip({
  pressed,
  children,
  className,
  wrap,
  ...rest
}: { pressed: boolean; wrap?: boolean } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">) {
  return (
    <button type="button" className={clsx("bio-chip button", wrap && "bio-chip-wrap", className)} aria-pressed={pressed} {...rest}>
      <span className="bio-chip-check">
        <CheckGlyph size={14} stroke={3} />
      </span>
      {children}
    </button>
  );
}

/** The question above a chip group — with a gold check once it is answered. */
export function Legend({ children, hint, done }: { children: React.ReactNode; hint?: React.ReactNode; done?: boolean }) {
  return (
    <legend className="bio-legend">
      <span className="bio-legend-text label">
        {children}
        {done && (
          <span className="bio-legend-check">
            <CheckGlyph size={12} stroke={3} />
          </span>
        )}
      </span>
      {hint && <span className="bio-legend-meta body-sm">{hint}</span>}
    </legend>
  );
}

/** A closed single choice rendered as chips (pronoun, yes/no, status…). */
export function ChoiceChips<V extends string>({
  path,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
  allowClear,
}: {
  path: string;
  legend: React.ReactNode;
  hint?: React.ReactNode;
  options: readonly { value: V; label: string }[];
  value: V | "" | null;
  onChange: (v: V | "") => void;
  error?: string;
  allowClear?: boolean;
}) {
  const valid = useValid(path) && !error;
  const wrap = options.some((o) => o.label.length > 22);
  return (
    <fieldset className="bio-group" aria-describedby={error ? eid(path) : undefined}>
      <Legend hint={hint} done={!!value && valid}>
        {legend}
      </Legend>
      <div className="bio-chips">
        {options.map((o, i) => (
          <Chip
            key={o.value}
            id={i === 0 ? fid(path) : undefined}
            pressed={value === o.value}
            wrap={wrap}
            data-invalid={error && i === 0 ? "" : undefined}
            onClick={() => onChange(value === o.value && allowClear ? "" : o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
      <ErrorText path={path} error={error} />
    </fieldset>
  );
}

export const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

/** A yes/no question bound to a boolean. */
export function YesNo({
  path,
  legend,
  hint,
  value,
  onChange,
}: {
  path: string;
  legend: React.ReactNode;
  hint?: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return <ChoiceChips path={path} legend={legend} hint={hint} options={YES_NO} value={value ? "yes" : "no"} onChange={(v) => onChange(v === "yes")} />;
}

/** A labelled switch — a whole row you can tap. */
export function Check({
  path,
  label,
  checked,
  onChange,
}: {
  path: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" id={fid(path)} role="switch" aria-checked={checked} className="bio-switch-row body-md" onClick={() => onChange(!checked)}>
      <span>{label}</span>
      <span className="bio-switch" aria-hidden="true">
        <span className="bio-switch-thumb" />
      </span>
    </button>
  );
}

const Chevron = ({ up }: { up?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: up ? "rotate(180deg)" : undefined }}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Header row of one repeater entry: a numbered badge, the kind, and the move/remove controls. */
export function EntryHead({
  title,
  index,
  onRemove,
  onUp,
  onDown,
  removeLabel,
}: {
  title: string;
  index: number;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  removeLabel: string;
}) {
  const name = `${title} ${index + 1}`;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-3">
        <span className="tabular flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-semibold text-blue-950" aria-hidden="true">
          {index + 1}
        </span>
        <span className="label text-white-60">
          {title}
          <span className="sr-only"> {index + 1}</span>
        </span>
      </span>
      <span className="flex gap-1.5">
        {onUp && (
          <button type="button" className="bio-icon-btn" onClick={onUp} aria-label={`Move ${name} up`}>
            <Chevron up />
          </button>
        )}
        {onDown && (
          <button type="button" className="bio-icon-btn" onClick={onDown} aria-label={`Move ${name} down`}>
            <Chevron />
          </button>
        )}
        {onRemove && (
          <button type="button" className="bio-icon-btn bio-icon-btn-danger" onClick={onRemove} aria-label={removeLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </span>
    </div>
  );
}

export function AddButton({ onClick, children, disabled, path, error }: { onClick: () => void; children: React.ReactNode; disabled?: boolean; path?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        id={path ? fid(path) : undefined}
        className="bio-add button"
        onClick={onClick}
        disabled={disabled}
        aria-describedby={error && path ? eid(path) : undefined}
        data-invalid={error ? "" : undefined}
      >
        <span className="bio-add-plus" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
        {children}
      </button>
      {path && <ErrorText path={path} error={error} />}
    </div>
  );
}

/**
 * The escape hatch on a required question: "Not sure? Leave it for Matt."
 * `value` is null while the question is answered normally and the note
 * (possibly "") once it has been left open. As a link it sits under a
 * field; as a switch it heads a whole list ("nothing to list here").
 */
export function LeaveForMatt({
  path,
  prompt,
  hint,
  value,
  onChange,
  variant = "link",
  example,
}: {
  path: string;
  /** The link text, or the switch row's label. */
  prompt: string;
  /** Under the switch row, or in the open box: what happens next. */
  hint?: string;
  value: string | null;
  onChange: (v: string | null) => void;
  variant?: "link" | "switch";
  example?: string;
}) {
  const open = value != null;
  const note = (
    <div className="bio-note bio-note-gold bio-rise flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="label flex items-center gap-2 text-gold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20h16M4 4h16M9 4v3a3 3 0 006 0V4M9 20v-3a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Left for Matt
        </span>
        {variant === "link" && (
          <button type="button" className="link-underline body-sm text-white-50" onClick={() => onChange(null)}>
            I can answer this
          </button>
        )}
      </div>
      <p className="body-sm text-white-60">{hint ?? "Matt will ask you before he drafts. Anything you do know helps:"}</p>
      <TextField path={`open_questions.${path}`} label="What you do know (optional)" value={value ?? ""} chars={400} example={example} onChange={(v) => onChange(v)} />
    </div>
  );
  if (variant === "switch") {
    return (
      <div className="flex flex-col gap-3">
        <Check path={`open_questions.${path}.switch`} label={prompt} checked={open} onChange={(on) => onChange(on ? "" : null)} />
        {open && note}
      </div>
    );
  }
  if (open) return note;
  return (
    <button type="button" className="link-underline body-sm self-start px-1 text-white-40 hover:text-gold" onClick={() => onChange("")}>
      {prompt}
    </button>
  );
}

/** A small uppercase heading over a cluster of questions inside a step. */
export function Cluster({ title, children, hint }: { title: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="label flex items-center gap-3 text-white-60">
          <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
          {title}
        </span>
        {hint && <span className="body-sm text-white-40">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
