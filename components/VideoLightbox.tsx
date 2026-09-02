"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

/**
 * VideoLightbox — a full-viewport glass overlay with the video framed at its
 * own aspect ratio, so the frame is exactly the video's size: no pillarbox
 * bars for a portrait clip, no letterbox for a landscape one. The frame
 * starts at `aspect` (known from the file) and snaps to the decoded
 * `videoWidth / videoHeight` once metadata arrives, so a mislabeled file
 * still fits.
 *
 * Portalled to <body>: the page content sits inside ScrollSmoother's
 * transformed wrapper, where `position: fixed` would be relative to the
 * wrapper rather than the viewport.
 *
 * Opens from a click, so play() with sound is allowed. Escape, the close
 * pill, or the backdrop closes it; scroll locks while open; focus moves to
 * the close pill and returns to the opener on close.
 */
export default function VideoLightbox({
  open,
  onClose,
  onEnded,
  src,
  label,
  caption,
  aspect,
}: {
  open: boolean;
  onClose: () => void;
  onEnded?: () => void;
  src: string;
  label: string;
  caption?: React.ReactNode;
  /** intrinsic display size of the video, e.g. { w: 720, h: 1280 } */
  aspect: { w: number; h: number };
}) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [ratio, setRatio] = useState(aspect.w / aspect.h);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  // Reset to the declared aspect whenever a new open begins
  useEffect(() => {
    if (open) setRatio(aspect.w / aspect.h);
  }, [open, aspect.w, aspect.h]);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      const opener = openerRef.current;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  // Exit: play the reverse keyframes, then let the parent unmount us
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
      return;
    }
    if (!visible) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setClosing(false);
      setVisible(false);
    }, 240);
    return () => window.clearTimeout(t);
  }, [open, visible]);

  // The frame mounts one render after `open` flips, so play() and the focus
  // move wait for `visible` rather than running in the open effect above.
  useEffect(() => {
    if (!open || !visible) return;
    const v = videoRef.current;
    if (v) {
      const p = v.play();
      if (p) p.catch(() => {});
    }
    closeRef.current?.focus({ preventScroll: true });
  }, [open, visible]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={clsx("lightbox fixed inset-0 z-[90] flex flex-col items-center justify-center", closing && "is-closing")}
      style={{ ["--ar" as string]: ratio }}
    >
      {/* backdrop — click to close */}
      <button type="button" aria-label="Close video" onClick={onClose} className="lightbox-backdrop absolute inset-0 cursor-default" />

      {/* close pill — top-right of the viewport, always reachable. Positioned by
          the wrapper: .btn sets position: relative from unlayered CSS, which
          outranks Tailwind's layered `absolute` utility on the button itself. */}
      <div className="lightbox-ui absolute right-4 top-4 z-10 md:right-8 md:top-6">
        <button ref={closeRef} type="button" onClick={onClose} className="btn btn-ghost button">
          Close
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* frame — exactly the video's aspect; height or width governs by viewport */}
      <div className="lightbox-frame relative z-10">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          controls
          playsInline
          preload="auto"
          controlsList="nodownload"
          aria-label={label}
          onEnded={onEnded}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
          }}
          className="absolute inset-0 h-full w-full bg-blue-950 object-contain"
        />
      </div>

      {caption && (
        <p className="lightbox-ui body-sm relative z-10 mt-4 flex items-center gap-3 text-white-50">
          <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
          {caption}
        </p>
      )}
    </div>,
    document.body
  );
}
