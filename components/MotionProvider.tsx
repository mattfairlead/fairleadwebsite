"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateCounts, initSmoother, reveal, registerGsap } from "@/lib/motion";

/**
 * Root motion boundary. Provides the .page-wrapper > .main-wrapper structure
 * ScrollSmoother requires, boots ScrollSmoother, and wires every generic
 * `data-anim` element on the page once fonts are ready — so nothing "jumps
 * to hidden" and SplitText never measures against a fallback font.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    let cancelled = false;

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      const smoother = initSmoother();
      reveal(document);
      animateCounts(document);
      return () => smoother?.kill();
    });

    return () => {
      cancelled = true;
    };
  }, { scope: wrapperRef });

  return (
    <div className="page-wrapper" ref={wrapperRef}>
      <div className="main-wrapper">{children}</div>
    </div>
  );
}
