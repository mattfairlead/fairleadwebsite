import type { RedactionShape } from "@/lib/register";

/**
 * The redaction — runs of bars standing in for a company name and a
 * summary. Widths come from redactionShape(id), a hash of the row id, so the
 * pattern carries no information about the text it stands in for. Purely
 * presentational; the screen-reader copy lives on the row.
 */
export function RedactedTitle({ shape }: { shape: RedactionShape }) {
  return (
    <span className="redact redact-title" aria-hidden="true">
      {shape.title.map((w, i) => (
        <i key={i} style={{ width: `${w}%` }} />
      ))}
    </span>
  );
}

export function RedactedLines({ shape }: { shape: RedactionShape }) {
  return (
    <span className="flex flex-col gap-[0.55em]" aria-hidden="true">
      {shape.lines.map((line, i) => (
        <span key={i} className="redact redact-line">
          {line.map((w, j) => (
            <i key={j} style={{ width: `${w}%` }} />
          ))}
        </span>
      ))}
    </span>
  );
}
