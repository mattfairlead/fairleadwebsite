"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import type { TeamMember } from "@/lib/types";
import { Markdown } from "@/lib/md";
import Portrait from "@/components/Portrait";

/**
 * Team card — circular portrait, name, title + credentials, the hub's roles
 * line; click expands the full bio in place (no modals — §5.9). Two layouts:
 * `featured` (partners: portrait beside the text, bio under both) and the
 * bench cell (portrait above, centered). Everything on the card is the hub
 * row, mapped by lib/team.ts.
 */
export default function TeamCell({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const title = member.credentials ? `${member.title}, ${member.credentials}` : member.title;
  const hasBio = member.bio_md.trim().length > 0;

  return (
    <div
      data-cell
      id={member.slug}
      className={clsx("spot flex h-full flex-col scroll-mt-24", featured ? "p-6 md:p-10" : "p-5 md:p-7")}
    >
      <button
        type="button"
        onClick={() => hasBio && setOpen((v) => !v)}
        aria-expanded={hasBio ? open : undefined}
        aria-controls={hasBio ? panelId : undefined}
        disabled={!hasBio}
        className={clsx(
          "group flex text-left disabled:cursor-default",
          featured ? "flex-col gap-6 sm:flex-row sm:items-center sm:gap-8" : "flex-col items-center gap-5 text-center"
        )}
      >
        <div data-anim="visual" className="shrink-0">
          <Portrait name={member.name} src={member.photo_url} size={featured ? "lg" : "md"} />
        </div>
        <div className={clsx("flex min-w-0 flex-col", featured ? "gap-2" : "items-center gap-1.5")}>
          <span className={clsx(featured ? "body-xxl" : "body-lg", "text-white-100")} data-anim="title">
            {member.name}
          </span>
          {title && (
            <span className="body-sm text-gold/90" data-anim="subtitle">
              {title}
            </span>
          )}
          {member.specialty && (
            <span className={clsx("body-sm text-white-50", featured ? "max-w-md" : "max-w-[18rem] line-clamp-2")}>
              {member.specialty}
            </span>
          )}
          {hasBio && (
            <span
              className={clsx(
                "mt-2 inline-flex items-center gap-2 text-white-40 transition-colors duration-300 group-hover:text-gold",
                open && "text-gold"
              )}
            >
              <span
                className={clsx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-500",
                  open && "rotate-45"
                )}
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", transitionTimingFunction: "var(--ease-spring)" }}
                aria-hidden="true"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="button">{open ? "Close" : "Read bio"}</span>
            </span>
          )}
        </div>
      </button>
      {hasBio && (
        <div
          id={panelId}
          className="grid transition-[grid-template-rows] duration-500"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", transitionTimingFunction: "var(--ease-out-expo)" }}
        >
          <div className="overflow-hidden">
            <div className={clsx("pt-6", featured ? "md:pt-8" : "text-left")}>
              <Markdown
                className={clsx("!gap-3", featured ? "[&>p]:!text-[0.9375rem]" : "[&>p]:!text-[0.875rem]")}
              >
                {member.bio_md}
              </Markdown>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-sm link-underline mt-4 inline-block text-white-60"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
