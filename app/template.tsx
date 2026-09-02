"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { animateCounts, registerGsap, reveal, ScrollSmoother, ScrollTrigger } from "@/lib/motion";

let firstMount = true;

/**
 * Route shell — remounts on every navigation (Next's template semantics), so
 * each page gets: a rise-in, its generic `data-anim` reveals and counters
 * wired, the scroll position reset (or the hash honoured) through the
 * smoother, and a ScrollTrigger refresh once layout has settled.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root) return;
      let cancelled = false;

      const smoother = ScrollSmoother.get();
      if (!firstMount) {
        const hash = window.location.hash;
        const target = hash ? document.querySelector<HTMLElement>(hash) : null;
        if (target) {
          if (smoother) smoother.scrollTo(target, false, "top 100px");
          else target.scrollIntoView();
        } else if (smoother) {
          smoother.scrollTop(0);
        } else {
          window.scrollTo(0, 0);
        }
      }
      firstMount = false;

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        if (cancelled) return;
        reveal(root);
        animateCounts(root);
        // Fonts/images may have shifted layout; give triggers the final geometry.
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: ref, dependencies: [pathname] }
  );

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
