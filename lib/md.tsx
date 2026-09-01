import type { ReactNode } from "react";

/**
 * Minimal markdown renderer for seed/Supabase `*_md` fields — paragraphs,
 * **bold**, *italic*. Long-form Perspectives can move to MDX later (§7);
 * this keeps Phase 1 dependency-free.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-white-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  const blocks = children.split(/\n\n+/).filter(Boolean);
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {blocks.map((block, i) => (
        <p key={i} className="body-lg text-white-60">
          {renderInline(block.trim(), `b${i}`)}
        </p>
      ))}
    </div>
  );
}
