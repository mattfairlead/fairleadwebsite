"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Autoplaying muted background video layer for ImageBand (§5.3).
 *
 * Purely additive: the gradient/still beneath it always renders, so this layer
 * only ever improves on the stand-in. The <video> is expensive (the bands are
 * tens of megabytes), so it is the last thing the page asks for:
 *
 *   - never under data-saver, on 2g/3g, or with reduced motion — those
 *     visitors get the poster and never download a byte of footage;
 *   - never on a phone either, unless the caller passes `mobileOk` (the
 *     homepage hero does — its video has no poster fallback, so skipping it
 *     on mobile left that hero blank rather than showing a still);
 *   - mounted only once the band is within 200px of the viewport AND the
 *     window `load` event has fired, so it never competes with fonts, images
 *     or the JS the first paint needs;
 *   - paused while scrolled out of view or the tab is hidden, so a hero clip
 *     stops decoding the moment you scroll past it.
 *
 * It fades in on `canplay`, so the band never flashes black. The poster,
 * when given, is painted as a plain <img> under the video from the first
 * server render, so a visitor who never gets the video still sees the still.
 *
 * The wrapper div is server-rendered so ScrollSmoother collects its
 * `data-speed` when effects initialise — only the <video> inside mounts later.
 * It overscans 10% top and bottom by default so parallax never shows an
 * edge; pass `inset="0"` when the box is sized to the footage and every
 * pixel of the frame should stay visible.
 */

type NetInfo = { saveData?: boolean; effectiveType?: string };

function videoAllowed(mobileOk: boolean): boolean {
  if (prefersReducedMotion()) return false;
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g|3g/.test(conn.effectiveType)) return false;
  return mobileOk || window.matchMedia("(min-width: 768px)").matches;
}

function afterLoad(cb: () => void): () => void {
  if (document.readyState === "complete") {
    cb();
    return () => {};
  }
  window.addEventListener("load", cb, { once: true });
  return () => window.removeEventListener("load", cb);
}

export default function BackgroundVideo({
  src,
  poster,
  speed,
  inset = "-10% 0",
  className = "",
  mobileOk = false,
}: {
  src: string;
  poster?: string;
  speed?: string;
  inset?: string;
  className?: string;
  mobileOk?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);

  // Decide once whether this visitor gets footage at all, then wait for the
  // band to approach and the page to finish loading before mounting it.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !videoAllowed(mobileOk)) return;
    let cancelLoad = () => {};
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) cancelLoad = afterLoad(() => setEnabled(true));
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(box);
    return () => {
      io.disconnect();
      cancelLoad();
    };
  }, []);

  // Play only while on screen and the tab is visible.
  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      if (inView && document.visibilityState === "visible") {
        // iOS Safari can reject the implicit autoplay; muted + playsInline
        // makes the explicit retry succeed. A rejection leaves the poster.
        const p = v.play();
        if (p) p.catch(() => {});
      } else {
        v.pause();
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [enabled, inView]);

  return (
    <div
      ref={boxRef}
      data-speed={speed}
      className={clsx("pointer-events-none absolute overflow-hidden", className)}
      style={{ inset }}
      aria-hidden="true"
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative still, may be a remote media URL
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
          draggable={false}
        />
      )}
      {enabled && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          onCanPlay={() => setVisible(true)}
          className="relative h-full w-full object-cover transition-opacity duration-1000 ease-out"
          // graded toward the §5.1 blue-hour palette rather than raw footage
          style={{ opacity: visible ? 1 : 0, filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
        />
      )}
    </div>
  );
}
