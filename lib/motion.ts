"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);
  registered = true;
}

/**
 * lib/motion.ts — the reference's (vita-travel.webflow.io) exact motion
 * constants, translated 1:1. See FAIRLEAD_WEBSITE_REDESIGN_PLAN.md §5.4.
 */
export const EASE_OUT = "power3.out";
export const EASE_INOUT = "power2.inOut";
export const D_REVEAL = 0.8; // primary reveal
export const D_FAST = 0.7; // secondary / cards
export const D_MICRO = 0.6;
export const STAGGER_EL = 0.08; // sibling elements (0.06 for dense lists)
export const STAGGER_DENSE = 0.06;
export const STAGGER_CH = 0.008; // SplitText chars
export const TRIGGER = "top 88%"; // "top 90%" for footers
export const TRIGGER_FOOTER = "top 90%";
export const ONCE = true;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 480;
}

/**
 * ScrollSmoother — desktop only, killed entirely under reduced-motion.
 * Wrapper/content structure is required: .page-wrapper > .main-wrapper.
 */
export function initSmoother() {
  registerGsap();
  if (prefersReducedMotion()) return null;
  return ScrollSmoother.create({
    wrapper: ".page-wrapper",
    content: ".main-wrapper",
    smooth: 1.2,
    effects: true,
    smoothTouch: 0.1,
  });
}

/**
 * Generic reveal recipes keyed by `data-anim`. Applied once per element via
 * ScrollTrigger, `once: true`. Initial ("from") states are set inline by
 * `setInitialState` before first paint so SSR/no-JS/reduced-motion always
 * renders the resolved layout — nothing "jumps to hidden."
 */
export const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 30 },
  "fade-down": { opacity: 0, y: -40 },
  "slide-in": { opacity: 0, x: -40 },
  "scale-in": { opacity: 1, scale: 1.2 },
  "blur-in": { opacity: 0, filter: "blur(12px)" },
  "zoom-in": { opacity: 0, scale: 0.85 },
  "zoom-out": { opacity: 0, scale: 1.15 },
  pop: { opacity: 0, scale: 0 },
};

export const REVEAL_TO: Record<string, gsap.TweenVars> = {
  "fade-up": { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT },
  "fade-down": { opacity: 1, y: 0, duration: D_REVEAL, ease: EASE_OUT },
  "slide-in": { opacity: 1, x: 0, duration: D_FAST, ease: EASE_OUT },
  "scale-in": { scale: 1, duration: D_REVEAL, ease: EASE_OUT },
  "blur-in": { opacity: 1, filter: "blur(0px)", duration: D_REVEAL, ease: EASE_OUT, clearProps: "filter" },
  "zoom-in": { opacity: 1, scale: 1, duration: D_REVEAL, ease: EASE_OUT },
  "zoom-out": { opacity: 1, scale: 1, duration: D_REVEAL, ease: EASE_OUT },
  pop: { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", transformOrigin: "center" },
};

export function setInitialState(el: Element) {
  const anim = el.getAttribute("data-anim");
  if (!anim || !(anim in REVEAL_FROM)) return;
  gsap.set(el, REVEAL_FROM[anim]);
}

/**
 * Wires every plain `data-anim` element on the page (excluding the ones
 * handled by a dedicated component: count, draw-x, draw-y, split-*, type,
 * read, parallax, pin-steps, pulse). Call once, after fonts are ready.
 */
export function reveal(root: ParentNode = document) {
  const reduced = prefersReducedMotion();
  const mobile = isMobile();
  const simple = new Set(["fade-up", "fade-down", "slide-in", "scale-in", "blur-in", "zoom-in", "zoom-out", "pop"]);

  root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
    const anim = el.getAttribute("data-anim");
    if (!anim || !simple.has(anim)) return;

    // Under 480px, char/line-split treatments are skipped for plain fade-up —
    // but simple recipes already degrade gracefully, so only clamp mobile here.
    const key = mobile && anim !== "fade-up" ? "fade-up" : anim;

    if (reduced) {
      gsap.set(el, REVEAL_TO[key] ?? { opacity: 1 });
      return;
    }

    const delay = Number(el.getAttribute("data-anim-delay") ?? 0);
    gsap.to(el, {
      ...REVEAL_TO[key],
      delay,
      scrollTrigger: { trigger: el, start: TRIGGER, once: ONCE },
    });
  });
}

/** Numeric count-up for stat strips. `data-count-to` holds the target value. */
export function animateCounts(root: ParentNode = document) {
  const reduced = prefersReducedMotion();
  root.querySelectorAll<HTMLElement>('[data-anim="count"]').forEach((el) => {
    const to = Number(el.getAttribute("data-count-to") ?? 0);
    const suffix = el.getAttribute("data-count-suffix") ?? "";
    if (reduced) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: to,
      duration: 2,
      ease: "none",
      scrollTrigger: { trigger: el, start: TRIGGER, once: ONCE },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.val)}${suffix}`;
      },
    });
  });
}

/**
 * sectionReveal() — the reference's exact draw order. §5.8.2.
 * One timeline per section: eyebrow lifts, H2 types on char-by-char,
 * hairline horizontals draw at `e` (half the headline typed), verticals
 * drop at `e+.48`, then cells fill in while the frame is still closing.
 */
export function sectionReveal(section: HTMLElement) {
  registerGsap();
  const q = <T extends Element>(sel: string) => section.querySelector<T>(sel);
  const qa = <T extends Element>(sel: string) => Array.from(section.querySelectorAll<T>(sel));

  const eyebrow = q<HTMLElement>('[data-anim="eyebrow"]');
  const h2El = q<HTMLElement>('[data-anim="h2"]');
  const hLines = qa<HTMLElement>('[data-dec="top"],[data-dec="bottom"]');
  const vLines = qa<HTMLElement>('[data-dec="v"]');
  const cells = qa<HTMLElement>("[data-cell]");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: TRIGGER, once: ONCE },
  });

  if (eyebrow) {
    gsap.set(eyebrow, { opacity: 0, y: 40 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: EASE_OUT }, 0);
  }

  let e = 0.3;
  if (h2El && !prefersReducedMotion() && !isMobile()) {
    // "words,chars" — chars alone drops the whitespace between words
    const split = new SplitText(h2El, { type: "words,chars" });
    gsap.set(split.chars, { opacity: 0 });
    tl.to(
      split.chars,
      {
        keyframes: [
          { opacity: 0.4, duration: 0.06, ease: "none" },
          { opacity: 1, duration: 0.18, ease: "power1.out" },
        ],
        stagger: STAGGER_CH * 3.75, // 0.03 — SplitText chars use the wider "type" stagger
      },
      0
    );
    e = split.chars.length * 0.03 * 0.5;
  } else if (h2El) {
    gsap.set(h2El, { opacity: 0 });
    tl.to(h2El, { opacity: 1, duration: 0.4 }, 0);
  }

  gsap.set(hLines, { width: "0%" });
  gsap.set(vLines, { height: "0%" });
  tl.to(hLines, { width: "100%", duration: 0.8, ease: EASE_INOUT, stagger: 0.1 }, e);
  tl.to(vLines, { height: "calc(100% - 2px)", duration: 0.8, ease: EASE_INOUT, stagger: 0.1 }, e + 0.48);

  cells.forEach((cell, i) => {
    const title = cell.querySelector<HTMLElement>('[data-anim="title"]');
    const subtitle = cell.querySelector<HTMLElement>('[data-anim="subtitle"]');
    const visual = cell.querySelector<HTMLElement>('[data-anim="visual"]');
    gsap.set([title, subtitle].filter(Boolean) as HTMLElement[], { opacity: 0, y: 30 });
    if (visual) gsap.set(visual, { opacity: 0, x: -40 });

    const o = e + 0.24 + 0.3 * i;
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT }, o);
    if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT }, o + 0.1);
    if (visual) tl.to(visual, { opacity: 1, x: 0, duration: 0.8, ease: EASE_OUT }, o + 0.15);
  });

  return tl;
}

/**
 * Live-dot pulse — §5.8.6. Shuffled entrance, then a perpetual desync'd
 * yoyo so dots never sync. Used on the Intelligence portfolio map and the
 * footer city markers — the one place the site breathes on its own.
 */
export function pulseDots(root: HTMLElement) {
  registerGsap();
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));
  const glows = Array.from(root.querySelectorAll<HTMLElement>("[data-glow]"));
  const order = dots.map((_, i) => i).sort(() => Math.random() - 0.5);

  if (prefersReducedMotion()) {
    gsap.set(dots, { scale: 1, opacity: 1 });
    gsap.set(glows, { scale: 0.6, opacity: 0.1 });
    return;
  }

  gsap.set(dots, { scale: 0 });
  gsap.set(glows, { scale: 0, opacity: 0, filter: "blur(2px)" });

  order.forEach((idx, i) => {
    const dot = dots[idx];
    const glow = glows[idx];
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: TRIGGER, once: ONCE },
      delay: i * STAGGER_EL,
    });
    tl.to(dot, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    if (glow) tl.to(glow, { scale: 0.6, opacity: 0.15, filter: "blur(2px)", duration: 0.6, ease: "elastic.out(1, 0.5)" }, "<");
    tl.call(() => {
      gsap.to(dot, {
        scale: 1.2,
        duration: 1 + Math.random() * 0.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      });
      if (glow) {
        gsap.to(glow, {
          scale: 1.4,
          opacity: 0.1,
          duration: 1 + Math.random() * 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2,
        });
      }
    });
  });
}

/** Header on-load orchestration + scroll blur toggle. §5.8.3. */
export function headerIntro(header: HTMLElement) {
  registerGsap();
  const bottom = header.querySelector<HTMLElement>('[data-dec="bottom"]');
  const verticals = Array.from(header.querySelectorAll<HTMLElement>('[data-dec="v"]'));

  if (prefersReducedMotion()) {
    if (bottom) gsap.set(bottom, { scaleX: 1 });
    gsap.set(verticals, { scaleY: 1 });
  } else {
    if (bottom) {
      gsap.set(bottom, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(bottom, { scaleX: 1, duration: 0.5, ease: EASE_INOUT, delay: 0.3 });
    }
    verticals.forEach((v, i) => {
      gsap.set(v, { scaleY: 0, transformOrigin: "center top" });
      gsap.to(v, { scaleY: 1, duration: 0.5, ease: EASE_INOUT, delay: 0.4 + i * 0.1 });
    });
  }

  const onScroll = () => {
    header.classList.toggle("is-active", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/** Smooth anchor scroll — §5.8.7. */
export function scrollToHash(hash: string, headerHeight = 72) {
  registerGsap();
  gsap.to(window, {
    duration: 0.8,
    ease: EASE_INOUT,
    scrollTo: { y: hash, offsetY: headerHeight + 20 },
  });
}

export { gsap };
