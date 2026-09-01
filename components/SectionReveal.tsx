"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, sectionReveal } from "@/lib/motion";

/**
 * Client boundary that runs the §5.8.2 sectionReveal() timeline on its
 * contents: eyebrow lifts, H2 types on, hairline horizontals draw at `e`,
 * verticals close the frame at `e+.48`, cells fill at `e+.24+.3i`.
 *
 * Mark children with data-anim="eyebrow" / data-anim="h2", wrap grids in
 * <HairlineFrame>, and mark each cell with data-cell (+ data-anim="title" /
 * "subtitle" / "visual" inside).
 */
export default function SectionReveal({
  as: Tag = "section",
  className = "",
  id,
  children,
}: {
  as?: "section" | "div" | "footer";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;
      const ready = document.fonts?.ready ?? Promise.resolve();
      let cancelled = false;
      ready.then(() => {
        if (!cancelled && el) sectionReveal(el);
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: ref }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={className}>
      {children}
    </Tag>
  );
}
