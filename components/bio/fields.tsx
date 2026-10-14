"use client";

import clsx from "clsx";
import Field from "@/components/Field";
import { countWords } from "@/lib/bio/schema";

/**
 * Small inputs for /bio, all built on the site's own pieces: the underline
 * <Field>, `.chip` toggles, `.label`. Every control gets an id derived from
 * its data path (fid), and its error an id the control points at, so the
 * form can focus the first problem and screen readers hear why.
 */

export const fid = (path: string) => `f-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
export const eid = (path: string) => `e-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

export function ErrorText({ path, error }: { path: string; error?: string }) {
  if (!error) return null;
  return (
    <span id={eid(path)} className="body-sm text-gold">
      {error}
    </span>
  );
}

/** Keep the first `n` words; stop typing at the cap (§6.10). */
export function capWords(s: string, n: number): string {
  if (countWords(s) <= n) return s;
  const m = s.match(new RegExp(`^\\s*(?:\\S+\\s+){${n - 1}}\\S+`));
  return m ? m[0] : s;
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
  const n = words ? countWords(value) : value.length;
  const cap = words ?? chars;
  const atCap = cap != null && n >= cap;
  const hint =
    example || cap ? (
      <span className="flex flex-wrap items-baseline gap-x-3">
        {example && <span className="italic">{example}</span>}
        {cap != null && (
          <span className={clsx("tabular", atCap ? "text-gold" : "text-white-40")}>
            {n}/{cap}
            {words ? " words" : ""}
          </span>
        )}
      </span>
    ) : undefined;

  const common = {
    id: fid(path),
    value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? eid(path) : undefined,
    "data-invalid": error ? "" : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(words ? capWords(e.target.value, words) : e.target.value),
    onBlur: normalize ? () => onChange(normalize(value)) : undefined,
    maxLength: chars,
  };

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {textarea ? (
        <Field as="textarea" label={label} hint={hint} rows={3} {...common} />
      ) : (
        <Field label={label} hint={hint} {...inputProps} {...common} />
      )}
      <ErrorText path={path} error={error} />
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
  return (
    <div className="flex flex-col gap-2">
      <Field
        id={fid(path)}
        label={label}
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
      <ErrorText path={path} error={error} />
    </div>
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
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={error ? eid(path) : undefined}>
      <legend className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="label text-white-50">{legend}</span>
        {hint && <span className="body-sm text-white-40">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button
            key={o.value}
            id={i === 0 ? fid(path) : undefined}
            type="button"
            className="chip button"
            aria-pressed={value === o.value}
            data-invalid={error && i === 0 ? "" : undefined}
            onClick={() => onChange(value === o.value && allowClear ? "" : o.value)}
          >
            {o.label}
          </button>
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

/** A yes/no toggle bound to a boolean. */
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
    <label className="body-md inline-flex cursor-pointer items-center gap-3 self-start text-white-80">
      <input
        id={fid(path)}
        type="checkbox"
        className="h-4 w-4 shrink-0 cursor-pointer"
        style={{ accentColor: "var(--color-gold)" }}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

/** Header row of one repeater entry: "Engagement 2" + move/remove controls. */
export function EntryHead({
  title,
  onRemove,
  onUp,
  onDown,
  removeLabel,
}: {
  title: string;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  removeLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="label flex items-center gap-3 text-white-60">
        <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
        {title}
      </span>
      <span className="flex flex-wrap gap-2">
        {onUp && (
          <button type="button" className="chip button" onClick={onUp} aria-label={`Move ${title} up`}>
            ↑
          </button>
        )}
        {onDown && (
          <button type="button" className="chip button" onClick={onDown} aria-label={`Move ${title} down`}>
            ↓
          </button>
        )}
        {onRemove && (
          <button type="button" className="chip button" onClick={onRemove} aria-label={removeLabel}>
            Remove
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
        className="btn btn-ghost button self-start"
        onClick={onClick}
        disabled={disabled}
        aria-describedby={error && path ? eid(path) : undefined}
        data-invalid={error ? "" : undefined}
      >
        <span aria-hidden="true">+</span> {children}
      </button>
      {path && <ErrorText path={path} error={error} />}
    </div>
  );
}
