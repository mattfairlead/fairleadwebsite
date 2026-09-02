"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import SectionReveal from "@/components/SectionReveal";
import HairlineFrame from "@/components/HairlineFrame";
import { ARROW } from "@/components/Btn";

export interface TestimonialFeatureProps {
  /** Eyebrow above the headline — "In their words" */
  eyebrow: string;
  /** Short headline; keep it under ~30 characters so the char-typing reveal stays quick */
  title: React.ReactNode;
  /** One paragraph of context in the §10 voice — who, what, outcome */
  body: React.ReactNode;
  speaker: { name: string; title: string; initials?: string };
  /** Gold metric line, e.g. "Sold to Gallagher" */
  metric: string;
  /** Role / outcome tags rendered as hairline labels */
  tags: string[];
  video: { src: string; poster: string; label: string };
  /** Where "See the engagement" goes */
  href: string;
}

const PLAY = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {/* optical centering — a filled triangle sits ~1px right of geometric center */}
    <path d="M7.5 4.8v12.4c0 .8.9 1.3 1.6.9l9.6-6.2c.6-.4.6-1.4 0-1.8L9.1 3.9c-.7-.4-1.6.1-1.6.9z" fill="currentColor" />
  </svg>
);

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * TestimonialFeature — the one client voice on /engagements, placed at the
 * top of the list as its proof-of-proof. Two hairline cells: a still of the
 * speaker (graded into the §5.1 palette, dissolving into blue-950 at the foot
 * so the caption reads) with a glass play control, and the context column.
 *
 * Click anywhere on the still to play: the still fades, the <video> mounts in
 * place with native controls and sound (the click is the user gesture, so
 * autoplay with audio is allowed). Nothing downloads until the click — the
 * source is a 180MB QuickTime release asset (H.264 + AAC, fast-start) that
 * streams progressively. When the video ends the still returns with a
 * "Watch again" affordance. No modal (§5.9).
 *
 * The still is optional at runtime: if the poster 404s, a graded monogram
 * stands in so the composition never breaks.
 */
export default function TestimonialFeature({
  eyebrow,
  title,
  body,
  speaker,
  metric,
  tags,
  video,
  href,
}: TestimonialFeatureProps) {
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [posterMissing, setPosterMissing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = useCallback(() => {
    setEnded(false);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;
    // Explicit play() covers browsers that ignore the autoplay attribute on a
    // freshly inserted element; a rejection leaves the native controls up.
    const p = v.play();
    if (p) p.catch(() => {});
  }, [playing]);

  const cta = ended ? "Watch again" : "Watch the testimonial";

  return (
    <SectionReveal className="container-page pb-16 md:pb-20">
      <HairlineFrame verticalsAt={["58%"]}>
        <div className="grid md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)]">
          {/* ---------------------------------------------------------- stage */}
          <div data-cell className="relative">
            <div
              data-anim="visual"
              className="stage group relative w-full overflow-hidden bg-blue-950 aspect-[4/5] sm:aspect-[16/11] md:aspect-auto md:h-full md:min-h-[26rem]"
            >
              {/* still — graded, scales on hover like the team cells */}
              <div
                className={clsx(
                  "absolute inset-0 transition-[opacity,transform] duration-[1200ms]",
                  playing ? "scale-[1.04] opacity-0" : "opacity-100 group-hover:scale-[1.03]"
                )}
                style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                aria-hidden={playing}
              >
                {!posterMissing ? (
                  <Image
                    src={video.poster}
                    alt={`${speaker.name}, ${speaker.title}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 28%", filter: "saturate(0.88) contrast(1.06)" }}
                    onError={() => setPosterMissing(true)}
                  />
                ) : (
                  <div className="monogram absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span
                      className="select-none font-semibold text-gold-soft/40"
                      style={{ fontSize: "clamp(5rem, 12vw, 9rem)", letterSpacing: "-0.06em", lineHeight: 1 }}
                    >
                      {speaker.initials ?? initialsOf(speaker.name)}
                    </span>
                  </div>
                )}
                {/* blue-hour wash + mandatory foot dissolve — §5.1 */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,14,46,0.28) 0%, rgba(10,26,79,0.06) 38%, rgba(5,14,46,0.2) 62%, rgba(5,14,46,0.92) 100%)",
                  }}
                />
              </div>

              {/* video — mounts on demand, sits over the still */}
              {playing && (
                <video
                  ref={videoRef}
                  src={video.src}
                  autoPlay
                  controls
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  onEnded={() => {
                    setPlaying(false);
                    setEnded(true);
                  }}
                  className="absolute inset-0 h-full w-full bg-blue-950 object-contain"
                  aria-label={video.label}
                />
              )}

              {/* click target — the whole still is the button */}
              {!playing && (
                <button
                  type="button"
                  onClick={play}
                  aria-label={`${cta} — ${video.label}`}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center text-left"
                >
                  {/* play control — glass at rest, gold under the cursor, a slow sonar ring says "live" */}
                  <span className="relative flex items-center justify-center">
                    <span className="play-ring absolute inset-0 rounded-full" aria-hidden="true" />
                    <span className="play-ring play-ring-2 absolute inset-0 rounded-full" aria-hidden="true" />
                    <span className="play-btn relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full text-white-100">
                      {PLAY}
                    </span>
                  </span>

                  {/* caption — mirrors the team-cell typography */}
                  <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5 md:p-7">
                    <span className="label mb-2 flex items-center gap-3 text-white-50">
                      <span className="inline-block h-px w-6 bg-gold" aria-hidden="true" />
                      Client testimonial
                    </span>
                    <span className="body-xl text-white-100">{speaker.name}</span>
                    <span className="body-sm text-gold/90">{speaker.title}</span>
                  </span>

                  {/* corner hint — reads as a state, not a second button */}
                  <span className="label absolute right-5 top-5 flex items-center gap-2 text-white-50 transition-colors duration-300 group-hover:text-gold md:right-7 md:top-7">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(213,179,113,0.8)]" aria-hidden="true" />
                    {ended ? "Watch again" : "Play with sound"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------- context */}
          <div data-cell className="spot flex flex-col justify-between gap-10 p-6 md:p-10">
            <div className="flex flex-col gap-5">
              <span data-anim="eyebrow" className="label flex items-center gap-3 text-white-50">
                <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
                {eyebrow}
              </span>
              <h2 data-anim="h2" className="h3">
                {title}
              </h2>
              <span data-anim="title" className="body-md text-gold">
                {metric}
              </span>
              <p data-anim="subtitle" className="body-md max-w-prose text-white-60">
                {body}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="label rounded-[3px] px-2 py-1.5 text-white-50"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={play} className="btn btn-primary button" disabled={playing} aria-disabled={playing}>
                {playing ? "Now playing" : cta}
                {!playing && PLAY}
              </button>
              <Link href={href} className="btn btn-ghost button">
                See the engagement
                {ARROW}
              </Link>
            </div>
          </div>
        </div>
      </HairlineFrame>
    </SectionReveal>
  );
}
