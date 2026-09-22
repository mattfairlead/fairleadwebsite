"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses the looping decoration inside it while it is scrolled out of view.
 *
 * A CSS animation keeps ticking while its element is off screen, and the
 * footer's loops (the gulls' wingbeat and the map route's dash offset) are
 * SVG-child animations Chrome runs on the main thread — a layout and a
 * repaint every frame, on every page, for a footer nobody is looking at.
 * This writes `data-loops="running" | "paused"` from an IntersectionObserver
 * and globals.css maps "paused" to `animation-play-state: paused`. Without
 * JS the attribute is never written and the loops simply run.
 */
export default function LoopGate({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.loops = entry.isIntersecting ? "running" : "paused";
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
