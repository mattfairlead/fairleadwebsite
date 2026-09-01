"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { pulseDots, registerGsap } from "@/lib/motion";

export interface DotPin {
  label: string;
  x: string; // percentage, e.g. "72%"
  y: string;
}

/**
 * Live-dot layer — §5.8.6. Gold dot + soft glow pairs that enter shuffled
 * with an elastic pop, then breathe forever on desync'd sine yoyos.
 * The one place the site moves on its own.
 */
export default function LiveDots({ pins, showLabels = false }: { pins: DotPin[]; showLabels?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (ref.current) pulseDots(ref.current);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {pins.map((pin) => (
        <div key={pin.label} className="absolute" style={{ left: pin.x, top: pin.y }}>
          <span
            data-glow
            className="absolute -left-3 -top-3 block h-6 w-6 rounded-full bg-gold"
            style={{ opacity: 0.15 }}
          />
          <span data-dot className="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full bg-gold" />
          {showLabels && (
            <span className="body-sm absolute left-3 top-[-0.5em] whitespace-nowrap text-white-50">{pin.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
