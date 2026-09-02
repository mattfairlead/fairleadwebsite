"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { initSmoother, registerGsap, trackSpotlight } from "@/lib/motion";

/**
 * Root motion boundary. Provides the .page-wrapper > .main-wrapper structure
 * ScrollSmoother requires, boots ScrollSmoother once fonts are ready, and
 * runs the single pointer tracker that feeds the spotlight cells.
 *
 * Per-route reveals are wired by app/template.tsx, which remounts on every
 * navigation — so new pages animate in, not just the first one.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      let cancelled = false;
      let smoother: ReturnType<typeof initSmoother> = null;
      const stopSpot = trackSpotlight(document.body);

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        if (cancelled) return;
        smoother = initSmoother();
      });

      return () => {
        cancelled = true;
        stopSpot();
        smoother?.kill();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div className="page-wrapper" ref={wrapperRef}>
      <div className="main-wrapper">{children}</div>
    </div>
  );
}
