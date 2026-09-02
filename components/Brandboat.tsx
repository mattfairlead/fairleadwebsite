"use client";

import { useId } from "react";

/**
 * The origami boat, drawn as flat folded facets so it can sit inline in a
 * headline at cap height and stay crisp at any size (§5.2 — the mark scales
 * with the type, not with a raster asset).
 *
 * `em` is the height of the hull in em, so the boat tracks the font size of
 * whatever line it sits in. The short reflection below the hull lets the
 * text baseline read as the waterline — which is what makes it sit *in* the
 * line rather than float beside it.
 *
 * Decorative: the headline carries the meaning, so it is hidden from AT.
 */
export default function Brandboat({
  em = 0.68,
  reflection = true,
  className = "",
}: {
  em?: number;
  reflection?: boolean;
  className?: string;
}) {
  // Unique per instance — several boats on one page must not share gradients.
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;

  // Hull occupies 0–580 of the viewBox; the reflection is clipped at 760 so
  // only the waterline sliver shows.
  const vbH = reflection ? 760 : 580;
  const height = (em * vbH) / 580;
  const width = em * 2;
  // Drop the hull's bottom edge onto the text baseline; the reflection hangs
  // below it like a descender.
  const verticalAlign = -(height - em);

  return (
    // The box is an inline-block sized in em rather than the <svg> itself:
    // a bare inline <svg> sized only in CSS reports zero width when it
    // follows text, which drops it onto its own line.
    <span
      className={`brandboat ${className}`}
      style={{
        display: "inline-block",
        width: `${width}em`,
        height: `${height}em`,
        verticalAlign: `${verticalAlign.toFixed(3)}em`,
        filter: "drop-shadow(0 0 28px rgba(213, 179, 113, 0.22))",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 1160 ${vbH}`}
        style={{ display: "block", width: "100%", height: "100%" }}
        focusable="false"
      >
        <defs>
          <linearGradient id={id("hullL")} x1="0" y1="0" x2="0.9" y2="0.8">
            <stop offset="0" stopColor="#7a5c25" />
            <stop offset="1" stopColor="#b5893a" />
          </linearGradient>
          <linearGradient id={id("rimL")} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0" stopColor="#f5e7c1" />
            <stop offset="1" stopColor="#e2c890" />
          </linearGradient>
          <linearGradient id={id("front")} x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0" stopColor="#87672b" />
            <stop offset="1" stopColor="#cca44e" />
          </linearGradient>
          <linearGradient id={id("hullR")} x1="0" y1="1" x2="0.85" y2="0">
            <stop offset="0" stopColor="#d9ae5c" />
            <stop offset="1" stopColor="#f8e9bd" />
          </linearGradient>
          <linearGradient id={id("rimR")} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#e9d29a" />
            <stop offset="1" stopColor="#f7ebc6" />
          </linearGradient>
          <linearGradient id={id("sailL")} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="#14305f" />
            <stop offset="1" stopColor="#27406c" />
          </linearGradient>
          <linearGradient id={id("sailR")} x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0" stopColor="#42558c" />
            <stop offset="1" stopColor="#8092c3" />
          </linearGradient>

          {/* Waterline fade for the reflection */}
          <linearGradient
            id={id("fade")}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="574"
            x2="0"
            y2="790"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={id("water")}>
            <rect
              x="0"
              y="574"
              width="1160"
              height="216"
              fill={`url(#${id("fade")})`}
            />
          </mask>

          {/* One boat, drawn once, used twice (hull + its reflection) */}
          <g id={id("boat")}>
            {/* hull — left outer face, then the lit rim folded over its top edge */}
            <path d="M6 38 L676 288 L214 566 Z" fill={`url(#${id("hullL")})`} />
            <path d="M6 38 L470 186 L676 288 Z" fill={`url(#${id("rimL")})`} />
            {/* hull — front face between the two bottom points */}
            <path
              d="M214 566 L676 288 L846 558 Z"
              fill={`url(#${id("front")})`}
            />
            {/* hull — right outer face and its rim */}
            <path
              d="M676 288 L1154 44 L846 558 Z"
              fill={`url(#${id("hullR")})`}
            />
            <path
              d="M676 288 L1154 44 L930 250 Z"
              fill={`url(#${id("rimR")})`}
            />
            {/* sail — folded down the middle, dark side to the light */}
            <path
              d="M589 4 L676 288 L452 214 Z"
              fill={`url(#${id("sailL")})`}
            />
            <path
              d="M589 4 L722 276 L676 288 Z"
              fill={`url(#${id("sailR")})`}
            />
          </g>
        </defs>

        <use href={`#${id("boat")}`} />
        {reflection && (
          <g mask={`url(#${id("water")})`}>
            <use href={`#${id("boat")}`} transform="matrix(1 0 0 -1 0 1140)" />
          </g>
        )}
      </svg>
    </span>
  );
}
