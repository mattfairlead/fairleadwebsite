import type { ReactNode } from "react";

/**
 * Minimal markdown renderer for seed/hub `*_md` fields — paragraphs,
 * `## `/`### ` headings, `- ` bullet lists, **bold**, *italic*,
 * [links](https://…). That is the vocabulary the hub's Perspectives editor
 * documents; anything richer can move to MDX later (§7). Dependency-free on
 * purpose.
 */
const LINK = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    const link = part.match(LINK);
    if (link) {
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-white-100"
        >
          {link[1]}
        </a>
      );
    }
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

const BULLET = /^[-*]\s+/;

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  const blocks = children
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {blocks.map((block, i) => {
        const heading = block.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          // `#` and `##` are section heads under the page title; `###` a sub-head.
          const sub = heading[1].length === 3;
          const Tag = sub ? "h3" : "h2";
          return (
            <Tag key={i} className={`${sub ? "h4" : "h3"} mt-4 text-white-100`}>
              {renderInline(heading[2].trim(), `h${i}`)}
            </Tag>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => BULLET.test(l))) {
          return (
            <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
              {lines.map((l, j) => (
                <li key={j} className="body-lg text-white-60" style={{ lineHeight: 1.6 }}>
                  {renderInline(l.replace(BULLET, ""), `b${i}-${j}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="body-lg text-white-60" style={{ lineHeight: 1.6 }}>
            {renderInline(block, `b${i}`)}
          </p>
        );
      })}
    </div>
  );
}
