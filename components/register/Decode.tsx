"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789–·";

/**
 * Text that "decodes" on mount — glyphs churn and settle left to right. Used
 * on the unlocked register right after the emailed link lands
 * (`?unlocked=1`), so the names appear to resolve out of their redaction.
 * Purely cosmetic: the real text is server-rendered either way (the visitor
 * already holds the grant), and reduced motion renders it still.
 */
export default function Decode({
  text,
  active,
  delay = 0,
  className,
}: {
  text: string;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const chars = Array.from(text);
    const duration = Math.min(1400, 500 + chars.length * 28);
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * chars.length);
      setDisplay(
        chars
          .map((c, i) => (i < settled || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    const timer = window.setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [active, text, delay]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
