"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion, isMobile, EASE_OUT, D_REVEAL } from "@/lib/motion";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassStrip from "@/components/GlassStrip";
import ImageBand from "@/components/ImageBand";

/**
 * Hero — "Visibility". §5.5 row 1 + §5.7.
 *
 * Full-bleed two-layer parallax band; H1 chars split on load; one pill CTA;
 * glass stat strip at the bottom edge. As the user scrolls the first 60vh,
 * three hairline markers pin onto the foreground and a chip resolves beside
 * each — the only scrubbed animation on the site (scrub: 0.6, then hold).
 */

/**
 * Hero background footage. Currently served from a GitHub Releases asset;
 * set NEXT_PUBLIC_HERO_VIDEO_URL once the file moves to Blob/Supabase Storage
 * (§9 media plan) — no code change needed. Empty string disables the video and
 * falls back to the ImageBand gradient.
 */
const HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
  "https://github.com/mattfairlead/fairleadwebsite/releases/download/Videos/Sequence.01.mp4";

const MARKERS = [
  { x: "18%", y: "62%", chip: "Inverter string 14 — 48% failure ratio, 8 matched issues", source: "SCADA + CMMS" },
  { x: "52%", y: "70%", chip: "DSCR 1.31× — covenant headroom 0.11×", source: "Lender model" },
  { x: "79%", y: "58%", chip: "Retention payable aging 94 days — $412K", source: "AP ledger" },
];

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
        const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
        const cta = root.querySelector<HTMLElement>("[data-hero-cta]");

        if (reduced) {
          gsap.set([sub, cta].filter(Boolean), { opacity: 1, y: 0 });
        } else {
          const tl = gsap.timeline({ delay: 0.2 });
          if (h1 && !mobile) {
            // "words,chars" — chars alone drops the whitespace between words
            const split = new SplitText(h1, { type: "words,chars" });
            gsap.set(split.chars, { opacity: 0, y: 20 });
            tl.to(split.chars, { opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.008 }, 0);
          } else if (h1) {
            gsap.set(h1, { opacity: 0, y: 30 });
            tl.to(h1, { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT }, 0);
          }
          if (sub) {
            gsap.set(sub, { opacity: 0, y: 30 });
            tl.to(sub, { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT }, 0.4);
          }
          if (cta) {
            gsap.set(cta, { opacity: 0, scale: 0 });
            tl.to(cta, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.7);
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
          gsap.set(m, { opacity: 1 });
          if (dot) gsap.set(dot, { scale: 0 });
          if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-32 text-center">
          {/* .h1 clamps to 12vw for short display words; this two-phrase
              headline needs the narrower clamp to hold two lines (caveman rule) */}
          <h1 data-hero-h1 className="h1" style={{ fontSize: "clamp(3rem, 8.5vw, 8.75rem)" }}>
            You can&rsquo;t run
            <br />
            <span className="text-gold">what you can&rsquo;t see.</span>
          </h1>
          <p data-hero-sub className="body-xl mt-8 max-w-2xl text-white-60">
            The embedded operating platform for PE-backed companies. Executive intelligence + artificial
            intelligence, working inside your portfolio.
          </p>
          <Link data-hero-cta href="/contact" className="btn btn-primary button mt-10">
            Talk to a partner
          </Link>
        </div>

        {/* §5.7 visibility markers */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
          {MARKERS.map((m) => (
            <div key={m.chip} data-marker className="absolute opacity-0" style={{ left: m.x, top: m.y }}>
              <span data-marker-dot className="absolute -left-1 -top-1 block h-2 w-2 rounded-full bg-gold" />
              <span data-marker-line className="absolute left-2 top-0 block h-px w-16 bg-white-20" />
              <div data-marker-chip className="absolute left-[4.7rem] top-[-0.9rem] w-56">
                <p className="body-sm text-white-100">{m.chip}</p>
                <p className="label mt-1 text-white-40">source · {m.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hero stats strip — the 60+ / 16 / 2010 trio lives here, §5.5 */}
        <GlassStrip
          cells={[
            { countTo: 60, countSuffix: "+", head: "embedded engagements" },
            { countTo: 16, head: "sectors" },
            { countTo: 2010, head: "operating inside portfolios since" },
          ]}
        />
      </ImageBand>
    </section>
  );
}
