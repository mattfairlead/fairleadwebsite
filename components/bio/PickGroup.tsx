"use client";

import { useContext, useId, useRef, useState } from "react";
import clsx from "clsx";
import { OTHER } from "@/lib/bio/options";
import { cleanText, fixedSpelling, matchOption, suggestOption } from "@/lib/bio/normalize";
import { Chip, eid, ErrorText, fid, Legend, Validity } from "@/components/bio/fields";

/**
 * A chip group with the §6.0 Other… behavior, single or multi.
 *
 *   values — what the field holds: standard options, typed values, and
 *            OTHER while Other… is on with nothing typed yet
 *   custom — the typed values (the field's *_custom)
 *
 * Choosing Other… reveals a required text input and focuses it. In a multi
 * group, Enter or a comma turns the text into a chip; typed chips count
 * toward the "pick up to N" limit. Text that matches an option or a
 * synonym offers "Did you mean …?". Deselecting Other… sets the typed
 * values aside in the stash; choosing it again restores them.
 */
export default function PickGroup({
  path,
  legend,
  hint,
  options,
  groups,
  multiple,
  max,
  min,
  open = true,
  values,
  custom,
  stash,
  onChange,
  error,
  customError,
}: {
  path: string;
  legend: React.ReactNode;
  hint?: React.ReactNode;
  options: readonly string[];
  /** Optional headings over the chips (focus areas). Must cover every option. */
  groups?: { heading: string; options: string[] }[];
  multiple?: boolean;
  max?: number;
  min?: number;
  open?: boolean;
  values: string[];
  custom: string[];
  stash?: string[];
  onChange: (values: string[], custom: string[], stash?: string[]) => void;
  error?: string;
  customError?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const uid = useId();
  const otherId = fid(`${path}_custom`);
  const allErrors = useContext(Validity);

  const otherOn = values.includes(OTHER) || custom.length > 0;
  const standard = values.filter((v) => v !== OTHER && !custom.includes(v));
  const chosen = standard.length + custom.length;
  const full = multiple && max != null && chosen >= max;
  const done = chosen > 0 && !error && !customError && !allErrors[path] && !allErrors[`${path}_custom`];

  function emit(nextStandard: string[], nextCustom: string[], on: boolean, nextStash?: string[]) {
    const vals = [...nextStandard, ...nextCustom];
    if (on && nextCustom.length === 0) vals.push(OTHER);
    onChange(vals, nextCustom, nextStash);
  }

  function toggleStandard(opt: string) {
    if (!multiple) {
      if (standard.includes(opt)) return emit([], [], false, custom.length ? custom : stash);
      return emit([opt], [], false, custom.length ? custom : stash);
    }
    if (standard.includes(opt)) return emit(standard.filter((s) => s !== opt), custom, otherOn);
    if (full) return;
    emit([...standard, opt], custom, otherOn);
  }

  function toggleOther() {
    if (otherOn) {
      setText("");
      return emit(multiple ? standard : [], [], false, custom.length ? custom : stash);
    }
    const room = multiple && max != null ? Math.max(0, max - standard.length) : 1;
    const restored = (stash ?? []).slice(0, room);
    emit(multiple ? standard : [], restored, true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  /** Multi: turn typed text into a chip (or the standard option it matches). */
  function commit(raw: string) {
    const t = fixedSpelling(cleanText(raw.replace(/,+$/, "")));
    setText("");
    if (!t) return;
    const std = matchOption(t, options);
    if (std) {
      if (!standard.includes(std) && !full) emit([...standard, std], custom, otherOn);
      return;
    }
    if (custom.some((c) => c.toLowerCase() === t.toLowerCase()) || full) return;
    emit(standard, [...custom, t.slice(0, 60)], true);
  }

  function removeCustom(c: string) {
    emit(standard, custom.filter((x) => x !== c), true);
  }

  /** Single: the text box is the value. */
  function setSingleText(t: string) {
    emit([], t ? [t] : [], true);
  }

  function acceptSuggestion(s: string) {
    setText("");
    if (multiple) {
      if (!standard.includes(s) && !full) emit([...standard, s], custom, otherOn && custom.length > 0);
      else emit(standard, custom, otherOn && custom.length > 0);
    } else {
      emit([s], [], false);
    }
  }

  const current = multiple ? text : custom[0] ?? "";
  const suggestion = otherOn && current ? suggestOption(current, options) : null;
  const countLine = multiple
    ? max != null
      ? min && min > 1
        ? `Pick ${min}–${max} · ${chosen} chosen`
        : `Pick up to ${max} · ${chosen} chosen`
      : chosen
        ? `${chosen} chosen`
        : "Pick any"
    : null;

  const chip = (opt: string, i: number) => (
    <Chip
      key={opt}
      id={i === 0 ? fid(path) : undefined}
      pressed={standard.includes(opt)}
      disabled={!standard.includes(opt) && !!full}
      data-invalid={error && i === 0 ? "" : undefined}
      onClick={() => toggleStandard(opt)}
    >
      {opt}
    </Chip>
  );

  const otherChip = open && (
    <Chip pressed={otherOn} aria-expanded={otherOn} aria-controls={otherOn ? otherId : undefined} disabled={!otherOn && !!full} onClick={toggleOther}>
      {OTHER}
    </Chip>
  );

  const describedBy = [error && eid(path), customError && eid(`${path}_custom`)].filter(Boolean).join(" ") || undefined;
  let index = 0;

  return (
    <fieldset className="bio-group" aria-describedby={describedBy}>
      <Legend
        done={done}
        hint={
          hint || countLine ? (
            <>
              {hint}
              {hint && countLine ? " · " : ""}
              {countLine && <span className={clsx("tabular", full && "text-gold")}>{countLine}</span>}
            </>
          ) : undefined
        }
      >
        {legend}
      </Legend>

      {groups ? (
        <div className="flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g.heading} className="flex flex-col gap-2.5">
              <span className="body-sm text-white-40">{g.heading}</span>
              <div className="bio-chips">{g.options.map((o) => chip(o, index++))}</div>
            </div>
          ))}
          {open && <div className="bio-chips">{otherChip}</div>}
        </div>
      ) : (
        <div className="bio-chips">
          {options.map((o) => chip(o, index++))}
          {otherChip}
        </div>
      )}

      {otherOn && (
        <div className="bio-rise flex flex-col gap-3 pt-1">
          {multiple && custom.length > 0 && (
            <ul className="bio-chips" aria-label="Your own entries">
              {custom.map((c) => (
                <li key={c}>
                  <Chip pressed onClick={() => removeCustom(c)} aria-label={`Remove ${c}`}>
                    {c}
                    <span className="bio-chip-x" aria-hidden="true">
                      ×
                    </span>
                  </Chip>
                </li>
              ))}
            </ul>
          )}
          <label className={clsx("bio-field", current && "is-filled", customError && "is-invalid")}>
            <span className="bio-field-head">
              <span className="bio-field-label label">Other — please specify</span>
              {multiple && <span className="bio-field-meta body-sm">Enter or comma adds it</span>}
            </span>
            <input
              ref={inputRef}
              id={otherId}
              className="bio-input"
              value={current}
              maxLength={60}
              aria-invalid={customError ? true : undefined}
              aria-describedby={[customError && eid(`${path}_custom`), suggestion && `${uid}-sugg`].filter(Boolean).join(" ") || undefined}
              data-invalid={customError ? "" : undefined}
              disabled={multiple && !!full && custom.length > 0 && !text}
              onChange={(e) => {
                const v = e.target.value;
                if (!multiple) return setSingleText(v);
                if (v.endsWith(",")) return commit(v);
                setText(v);
              }}
              onKeyDown={(e) => {
                if (multiple && e.key === "Enter") {
                  e.preventDefault();
                  commit(text);
                }
              }}
              onBlur={() => {
                if (multiple) {
                  if (text.trim()) commit(text);
                  return;
                }
                const t = fixedSpelling(cleanText(current));
                const std = matchOption(t, options);
                if (std) emit([std], [], false);
                else if (t !== current) setSingleText(t);
              }}
            />
          </label>
          {suggestion && (
            <p id={`${uid}-sugg`} className="bio-field-foot body-sm text-white-60" aria-live="polite">
              <span>
                Did you mean{" "}
                <button type="button" className="link-underline font-semibold text-gold" onMouseDown={(e) => e.preventDefault()} onClick={() => acceptSuggestion(suggestion)}>
                  {suggestion}
                </button>
                ?
              </span>
            </p>
          )}
          <ErrorText path={`${path}_custom`} error={customError} />
        </div>
      )}
      <ErrorText path={path} error={error} />
    </fieldset>
  );
}
