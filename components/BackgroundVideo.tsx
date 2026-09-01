"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Autoplaying muted background video layer for ImageBand (§5.3).
 *
 * Purely additive: the gradient/still beneath it always renders, so this layer
 * only ever improves on the stand-in. The <video> mounts client-side after an
 * opt-in check (motion allowed, data-saver off) and fades in on `canplay`, so
 * the band never flashes black and reduced-motion users never download it.
 *
 * The wrapper div is server-rendered so ScrollSmoother collects its
 * `data-speed` when effects initialise — only the <video> inside mounts later.
 */
export default function BackgroundVideo({
  src,
  poster,
  speed,
  className = "",
}: {
  src: string;
  poster?: string;
  speed?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;
    // iOS Safari can reject the implicit autoplay; muted + playsInline makes the
    // explicit retry succeed. A rejection just leaves the gradient in place.
    const p = v.play();
    if (p) p.catch(() => {});
  }, [enabled]);

  return (
    <div
      data-speed={speed}
      className={clsx("pointer-events-none absolute inset-[-10%_0] overflow-hidden", className)}
      aria-hidden="true"
    >
      {enabled && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          onCanPlay={() => setVisible(true)}
          className="h-full w-full object-cover transition-opacity duration-1000 ease-out"
          // graded toward the §5.1 blue-hour palette rather than raw footage
          style={{ opacity: visible ? 1 : 0, filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
        />
      )}
    </div>
  );
}
