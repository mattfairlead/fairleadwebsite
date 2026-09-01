"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { TeamMember } from "@/lib/types";
import { Markdown } from "@/lib/md";

/**
 * Team card — photo, name, title, one-line specialty; click expands the
 * full bio in place (no modals — §5.9). Photo gradient deepens on hover.
 */
export default function TeamCell({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const title = member.credentials ? `${member.title}, ${member.credentials}` : member.title;

  return (
    <div data-cell id={member.slug} className="flex flex-col scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex flex-col text-left"
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5", borderRadius: "3px" }}>
          {member.photo_url ? (
            <Image src={member.photo_url} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
          ) : (
            // TODO(media): standardized headshots, one aspect ratio (§4.5)
            <div
              className="absolute inset-0 flex items-center justify-center bg-blue-900"
              aria-hidden="true"
            >
              <Image src="/brand/origami-mark.svg" alt="" width={48} height={48} className="opacity-40" />
            </div>
          )}
          {/* bottom gradient, deepens on hover — §5.9 */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 opacity-80 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: "linear-gradient(180deg, rgba(5,14,46,0) 0%, #050E2E 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5">
            <span className={clsx(featured ? "body-xl" : "body-lg", "text-white-100")} data-anim="title">
              {member.name}
            </span>
            <span className="body-sm text-white-50" data-anim="subtitle">
              {title}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-4">
          <span className="body-sm text-white-60">{member.specialty}</span>
          <span
            className={clsx(
              "body-sm shrink-0 text-white-40 transition-transform duration-200",
              open && "rotate-45"
            )}
            aria-hidden="true"
          >
            +
          </span>
        </div>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
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
