"use client";

import { useId, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { TeamMember } from "@/lib/types";
import { Markdown } from "@/lib/md";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Team card — photo, name, title, one-line specialty; click expands the
 * full bio in place (no modals — §5.9). Photo eases in scale on hover and
 * its gradient deepens. Until headshots land, a graded monogram stands in.
 */
export default function TeamCell({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const title = member.credentials ? `${member.title}, ${member.credentials}` : member.title;

  return (
    <div data-cell id={member.slug} className="flex flex-col scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex flex-col text-left"
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5", borderRadius: "3px" }}>
          <div
            className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
          >
            {member.photo_url ? (
              <Image src={member.photo_url} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
            ) : (
              // TODO(media): standardized headshots, one aspect ratio (§4.5)
              <div className="monogram absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span
                  className="select-none font-semibold text-gold-soft/40"
                  style={{ fontSize: featured ? "clamp(5rem, 10vw, 8rem)" : "clamp(3.5rem, 6vw, 5rem)", letterSpacing: "-0.06em", lineHeight: 1 }}
                >
                  {initials(member.name)}
                </span>
                <Image src="/brand/brandmark-white.svg" alt="" width={20} height={20} className="absolute bottom-5 right-5 opacity-30" />
              </div>
            )}
          </div>
          {/* bottom gradient, deepens on hover — §5.9 */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "linear-gradient(180deg, rgba(5,14,46,0) 0%, #050E2E 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5">
            <span className={clsx(featured ? "body-xl" : "body-lg", "text-white-100")} data-anim="title">
              {member.name}
            </span>
            <span className="body-sm text-gold/90" data-anim="subtitle">
              {title}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-4">
          <span className="body-sm text-white-60">{member.specialty}</span>
          <span
            className={clsx(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white-60 transition-all duration-500 group-hover:text-gold",
              open && "rotate-45 text-gold"
            )}
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", transitionTimingFunction: "var(--ease-spring)" }}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </button>
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-500"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", transitionTimingFunction: "var(--ease-out-expo)" }}
      >
        <div className="overflow-hidden">
          <div className="pb-6">
            <Markdown className="!gap-3 [&>p]:!text-[0.9375rem]">{member.bio_md}</Markdown>
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
    </div>
  );
}
