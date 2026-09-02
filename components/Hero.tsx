"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion, isMobile, EASE_OUT, D_REVEAL } from "@/lib/motion";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassStrip from "@/components/GlassStrip";
import ImageBand from "@/components/ImageBand";
import { ARROW } from "@/components/Btn";

/**
 * Hero — "Visibility". §5.5 row 1 + §5.7.
 *
 * Full-bleed two-layer parallax band; H1 chars split on load; one pill CTA;
 * glass stat strip at the bottom edge. As the user scrolls the first 60vh,
 * three hairline markers pin onto the foreground and a chip resolves beside
 * each — the only scrubbed animation on the site (scrub: 0.6, then hold).
 */

/**
 * Hero background footage. Currently served from the WordPress uploads dir;
 * set NEXT_PUBLIC_HERO_VIDEO_URL once the file moves to Blob/Supabase Storage
 * (§9 media plan) — no code change needed. Empty string disables the video and
 * falls back to the ImageBand gradient.
 */
const HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
  "https://fairleadadvisors.com/wp-content/uploads/2026/06/4130872-uhd_3840_2160_25fps.mp4";

// Markers sit in the outer thirds so the chips never cross the headline
// column; the right-hand chips open leftward.
const MARKERS = [
  { x: "8%", y: "68%", side: "right", chip: "Inverter string 14 — 48% failure ratio, 8 matched issues", source: "SCADA + CMMS" },
  { x: "91%", y: "62%", side: "left", chip: "DSCR 1.31× — covenant headroom 0.11×", source: "Lender model" },
  { x: "86%", y: "70%", side: "left", chip: "Retention payable aging 94 days — $412K", source: "AP ledger" },
] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root) return;
      const reduced = prefersReducedMotion();
      const mobile = isMobile();

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        const h1 = root.querySelector<HTMLElement>("[data-hero-h1]");
        const eyebrow = root.querySelector<HTMLElement>("[data-hero-eyebrow]");
        const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
        const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
        const cue = root.querySelector<HTMLElement>("[data-hero-cue]");

        if (reduced) {
          gsap.set([eyebrow, sub, cta, cue].filter(Boolean), { opacity: 1, y: 0 });
        } else {
          const tl = gsap.timeline({ delay: 0.15 });
          if (eyebrow) {
            gsap.set(eyebrow, { opacity: 0, y: -12 });
            tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT }, 0);
          }
          if (h1 && !mobile) {
            // "words,chars" — chars alone drops the whitespace between words
            const split = new SplitText(h1, { type: "words,chars" });
            gsap.set(split.chars, { opacity: 0, y: 28, rotateX: -30, transformOrigin: "50% 100%" });
            tl.to(split.chars, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: "expo.out", stagger: 0.012 }, 0.1);
          } else if (h1) {
            gsap.set(h1, { opacity: 0, y: 30 });
            tl.to(h1, { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT }, 0.1);
          }
          if (sub) {
            gsap.set(sub, { opacity: 0, y: 24 });
            tl.to(sub, { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT }, 0.55);
          }
          if (cta) {
            gsap.set(cta, { opacity: 0, y: 16, scale: 0.9 });
            tl.to(cta, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.8);
          }
          if (cue) {
            gsap.set(cue, { opacity: 0 });
            tl.to(cue, { opacity: 1, duration: 0.8, ease: EASE_OUT }, 1.3);
          }
        }

        // §5.7 — the scrubbed visibility markers (desktop only)
        const markers = Array.from(root.querySelectorAll<HTMLElement>("[data-marker]"));
        if (reduced || mobile) {
          gsap.set(markers, { opacity: 1 });
          markers.forEach((m) => {
            const line = m.querySelector<HTMLElement>("[data-marker-line]");
            const chip = m.querySelector<HTMLElement>("[data-marker-chip]");
            if (line) gsap.set(line, { scaleX: 1 });
            if (chip) gsap.set(chip, { opacity: 1 });
          });
          return;
        }

        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=60%",
            scrub: 0.6,
          },
        });
        markers.forEach((m, i) => {
          const dot = m.querySelector<HTMLElement>("[data-marker-dot]");
          const line = m.querySelector<HTMLElement>("[data-marker-line]");
          const chip = m.querySelector<HTMLElement>("[data-marker-chip]");
          const side = m.getAttribute("data-marker-side");
          gsap.set(m, { opacity: 1 });
          if (dot) gsap.set(dot, { scale: 0 });
          if (line) gsap.set(line, { scaleX: 0, transformOrigin: side === "left" ? "right center" : "left center" });
          if (chip) gsap.set(chip, { opacity: 0, y: 8 });

          const at = i * 0.28;
          if (dot) scrubTl.to(dot, { scale: 1, duration: 0.12 }, at);
          if (line) scrubTl.to(line, { scaleX: 1, duration: 0.14 }, at + 0.08);
          if (chip) scrubTl.to(chip, { opacity: 1, y: 0, duration: 0.14 }, at + 0.18);
        });
        ScrollTrigger.refresh();
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative">
      <ImageBand
        aspect="1440/922"
        minHeight="min(100svh, 58rem)"
        parallax
        overlayStrength={1}
        video={HERO_VIDEO || undefined}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-36 text-center">
          <span data-hero-eyebrow className="label mb-8 flex items-center gap-3 text-white-50">
            <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
            The embedded operating platform
            <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
          </span>
          {/* .h1 clamps to 12vw for short display words; this two-phrase
              headline needs the narrower clamp to hold two lines (caveman rule) */}
          <h1 data-hero-h1 className="h1" style={{ fontSize: "clamp(3rem, 8.5vw, 8.75rem)", perspective: "800px" }}>
            You can&rsquo;t run
            <br />
            <span className="text-gold-glow">what you can&rsquo;t see.</span>
          </h1>
          <p data-hero-sub className="body-xl mt-8 max-w-3xl text-white-60">
            Executive intelligence + artificial intelligence, working inside your portfolio.
            <br />
            Embedded finance and operating leadership for PE-backed companies.
          </p>
          <Link data-hero-cta href="/contact" className="btn btn-primary button mt-10">
            Talk to a partner
            {ARROW}
          </Link>
        </div>

        {/* §5.7 visibility markers */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {MARKERS.map((m) => (
            <div key={m.chip} data-marker data-marker-side={m.side} className="absolute opacity-0" style={{ left: m.x, top: m.y }}>
              <span data-marker-dot className="absolute -left-1 -top-1 block h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_rgba(213,179,113,0.8)]" />
              <span
                data-marker-line
                className={m.side === "left" ? "absolute right-2 top-0 block h-px w-16 bg-white-20" : "absolute left-2 top-0 block h-px w-16 bg-white-20"}
              />
              <div
                data-marker-chip
                className={m.side === "left" ? "data-chip absolute right-[4.7rem] top-[-1.1rem] w-52 px-3 py-2.5 text-left" : "data-chip absolute left-[4.7rem] top-[-1.1rem] w-56 px-3 py-2.5 text-left"}
              >
                <p className="body-sm text-white-100">{m.chip}</p>
                <p className="label mt-1.5 text-gold/80">source · {m.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* scroll cue — sits just above the stat strip on desktop */}
        <div data-hero-cue className="pointer-events-none absolute inset-x-0 bottom-[8.5rem] hidden justify-center md:flex" aria-hidden="true">
          <span className="label flex flex-col items-center gap-2 text-white-40">
            Scroll
            <span className="block h-8 w-px overflow-hidden bg-white-10">
              <span className="block h-full w-full origin-top bg-gold" style={{ animation: "cue-drop 1.8s cubic-bezier(0.16,1,0.3,1) infinite" }} />
            </span>
          </span>
        </div>

        {/* Hero stats strip — the 60+ / 16 / 2010 trio lives here, §5.5 */}
        <GlassStrip
          clear
          cells={[
            { countTo: 60, countSuffix: "+", head: "embedded engagements" },
            { countTo: 16, head: "sectors" },
            { countTo: 2010, head: "operating inside portfolios since" },
          ]}
        />
      </ImageBand>
      <style>{`@keyframes cue-drop{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}`}</style>
    </section>
  );
}
