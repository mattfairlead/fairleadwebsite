"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion, isMobile, EASE_OUT, D_REVEAL } from "@/lib/motion";
import { SplitText } from "gsap/SplitText";
import GlassStrip from "@/components/GlassStrip";
import ImageBand from "@/components/ImageBand";
import { ARROW } from "@/components/Btn";

/**
 * Hero — "Visibility". §5.5 row 1.
 *
 * Full-bleed two-layer parallax band; H1 chars split on load; one pill CTA;
 * glass stat strip at the bottom edge.
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

        if (reduced) {
          gsap.set([eyebrow, sub, cta].filter(Boolean), { opacity: 1, y: 0 });
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
        }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative">
      <ImageBand
        aspect="1440/922"
        minHeight="min(100svh, 58rem)"
        className="hero-band"
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
          </p>
          <Link data-hero-cta href="/contact" className="btn btn-primary button mt-10">
            Talk to a partner
            {ARROW}
          </Link>
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
    </section>
  );
}
