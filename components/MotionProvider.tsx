"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { guardWrapperScroll, initSmoother, interceptHashLinks, registerGsap, trackSpotlight } from "@/lib/motion";

/**
 * Root motion boundary. Provides the .page-wrapper > .main-wrapper structure
 * ScrollSmoother requires, boots ScrollSmoother once fonts are ready, and
 * runs the single pointer tracker that feeds the spotlight cells. It also
 * owns the two guards that keep native scrolling away from the smoother's
 * pinned wrapper: in-page hash links go through scrollToHash(), and any
 * stray wrapper offset is handed back to the smoother (lib/motion.ts).
 *
 * Per-route reveals are wired by app/template.tsx, which remounts on every
 * navigation — so new pages animate in, not just the first one.
 *
 * Routes in NATIVE_SCROLL_ROUTES get the browser's own scrolling: on a long
 * form the smoother's lag fights focus scrolling, and its transformed
 * content breaks `position: sticky`. Leaving such a route boots it again.
 */
const NATIVE_SCROLL_ROUTES = ["/bio"];
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "";
  const native = NATIVE_SCROLL_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  useGSAP(
    () => {
      registerGsap();
      const stopSpot = trackSpotlight(document.body);
      const stopHash = interceptHashLinks(document.body);
      const stopGuard = wrapperRef.current ? guardWrapperScroll(wrapperRef.current) : () => {};

      return () => {
        stopSpot();
        stopHash();
        stopGuard();
      };
    },
    { scope: wrapperRef }
  );

  useEffect(() => {
    if (native) return;
    let cancelled = false;
    let smoother: ReturnType<typeof initSmoother> = null;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!cancelled) smoother = initSmoother();
    });
    return () => {
      cancelled = true;
      smoother?.kill();
    };
  }, [native]);

  return (
    <div className="page-wrapper" ref={wrapperRef}>
      <div className="main-wrapper">{children}</div>
    </div>
  );
}
