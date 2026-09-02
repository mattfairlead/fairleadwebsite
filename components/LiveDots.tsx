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
 * with an elastic pop, then breathe forever on desync'd sine yoyos. With
 * `rings`, each dot also sends out a slow sonar ring every few seconds.
 * The one place the site moves on its own.
 */
export default function LiveDots({
  pins,
  showLabels = false,
  rings = false,
}: {
  pins: DotPin[];
  showLabels?: boolean;
  rings?: boolean;
}) {
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
          {rings && (
            <span
              data-ring
              className="absolute -left-3 -top-3 block h-6 w-6 rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.7)", opacity: 0 }}
            />
          )}
          <span data-dot className="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(213,179,113,0.9)]" />
          {showLabels && (
            <span className="label absolute left-4 top-[-0.4em] whitespace-nowrap text-white-50">{pin.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
