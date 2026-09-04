"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * DataBox — the compounding asset, drawn. An open isometric box (gold
 * walls, navy floor) with structured data streaming up out of it: motes
 * of light, thin column ticks and ledger rows rising from the floor,
 * converging into a soft plume and dispersing above the rim.
 *
 * One projection drives everything. The box faces are SVG polygons
 * computed from box-space coordinates by `iso()`, and the particle field is
 * a canvas that spawns in the same box space (points on the floor) and maps
 * through the same viewBox — so a mote born deep in the box really does
 * climb out from behind the front rim. Depth is real, not painted: the box
 * is split into a back layer (floor, inner walls, back rim) under the
 * canvas and a front layer (outer walls, front rim) over it.
 *
 * The canvas runs only while on screen and stops on `prefers-reduced-motion`
 * (a single settled frame is painted instead). Additive blending on the
 * page's navy ground is what makes the light read as light.
 */

// ── Projection ─────────────────────────────────────────────────────────
const S = 100; // one box edge in viewBox units
const COS = Math.sqrt(3) / 2;
const SIN = 0.5;
const T = 0.055; // wall thickness, box units
const H = 0.52; // wall height, box units
function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS * S, (x + y) * SIN * S - z * S];
}
const pts = (...p: [number, number, number][]) => p.map((q) => iso(...q).join(",")).join(" ");

// The stage: room above the rim for the plume, a little below for the shadow.
const VB = { x: -130, y: -230, w: 260, h: 360 };
const FLOOR_CENTER = iso(0.5, 0.5, 0);
const RIM_Y = iso(0.5, 0.5, H)[1]; // where the beam clears the opening

// ── Box faces (box-space quads) ────────────────────────────────────────
const FACES = {
  floor: pts([T, T, 0], [1 - T, T, 0], [1 - T, 1 - T, 0], [T, 1 - T, 0]),
  innerLeft: pts([T, T, H], [T, 1 - T, H], [T, 1 - T, 0], [T, T, 0]), // plane x=T, faces +x
  innerRight: pts([T, T, H], [1 - T, T, H], [1 - T, T, 0], [T, T, 0]), // plane y=T, faces +y
  rimBack: pts([0, 0, H], [1, 0, H], [1 - T, T, H], [T, T, H]),
  rimLeft: pts([0, 1, H], [0, 0, H], [T, T, H], [T, 1 - T, H]),
  rimRight: pts([1, 0, H], [1, 1, H], [1 - T, 1 - T, H], [1 - T, T, H]),
  rimFront: pts([1, 1, H], [0, 1, H], [T, 1 - T, H], [1 - T, 1 - T, H]),
  outerLeft: pts([0, 1, H], [1, 1, H], [1, 1, 0], [0, 1, 0]), // plane y=1
  outerRight: pts([1, 0, H], [1, 1, H], [1, 1, 0], [1, 0, 0]), // plane x=1
};

// ── Particles ──────────────────────────────────────────────────────────
type Kind = 0 | 1 | 2 | 3; // 0 mote, 1 column tick, 2 ledger row, 3 bokeh (out-of-focus mote)
interface P {
  kind: Kind;
  x0: number;
  y0: number;
  vy: number;
  drift: number;
  amp: number;
  freq: number;
  phase: number;
  life: number;
  age: number;
  size: number;
  depth: number; // 0 far back → 1 near front
  cool: boolean;
}
const COUNT: Record<Kind, number> = { 0: 80, 1: 14, 2: 10, 3: 7 };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function spawn(kind: Kind, age = 0): P {
  // bias toward the middle of the floor so the plume has a spine
  const g = () => 0.5 + (Math.random() + Math.random() + Math.random() - 1.5) * 0.52;
  const u = Math.min(1 - T - 0.05, Math.max(T + 0.05, g()));
  const v = Math.min(1 - T - 0.05, Math.max(T + 0.05, g()));
  const [x0, y0] = iso(u, v, 0);
  const depth = (u + v) / 2;
  const base = {
    x0,
    y0,
    depth,
    age,
    phase: rnd(0, Math.PI * 2),
    drift: rnd(-4, 4),
    cool: Math.random() < 0.08,
  };
  if (kind === 1) return { ...base, kind, vy: rnd(85, 135), life: rnd(1.7, 2.6), amp: rnd(1, 3), freq: rnd(1.2, 2), size: rnd(14, 38) };
  if (kind === 2) return { ...base, kind, vy: rnd(22, 36), life: rnd(3.6, 5.2), amp: rnd(2, 5), freq: rnd(0.6, 1.1), size: rnd(6, 20) };
  if (kind === 3) return { ...base, kind, vy: rnd(12, 22), life: rnd(6, 9), amp: rnd(4, 9), freq: rnd(0.3, 0.6), size: rnd(7, 13), cool: false };
  return { ...base, kind, vy: rnd(34, 68), life: rnd(3, 5.4), amp: rnd(3, 10), freq: rnd(0.8, 1.8), size: rnd(1.4, 3.8) };
}

function step(p: P, dt: number): P {
  p.age += dt;
  return p.age >= p.life ? spawn(p.kind) : p;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function makeSprite(core: string, glow: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, core);
  grad.addColorStop(0.14, glow);
  grad.addColorStop(0.42, glow.replace(/[\d.]+\)$/, "0.22)"));
  grad.addColorStop(1, "rgba(213,179,113,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export default function DataBox({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const gold = makeSprite("rgba(255,241,210,1)", "rgba(226,190,120,0.9)");
    const cool = makeSprite("rgba(255,255,255,1)", "rgba(190,210,255,0.8)");

    // particles, pre-warmed so the plume is already alive on first paint
    const ps: P[] = [];
    (Object.keys(COUNT) as unknown as Kind[]).forEach((k) => {
      for (let i = 0; i < COUNT[k]; i++) ps.push(spawn(k, Math.random() * 4));
    });
    for (let i = 0; i < ps.length; i++) ps[i] = spawn(ps[i].kind, Math.random() * ps[i].life);

    let k = 1; // px per viewBox unit
    let w = 0;
    let h = 0;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = stage.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = w / VB.w;
    };
    const X = (x: number) => (x - VB.x) * k;
    const Y = (y: number) => (y - VB.y) * k;

    let t = 0;
    const draw = (dt: number) => {
      t += dt;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // the plume — a breathing column of light standing in the opening
      const breathe = 0.82 + 0.18 * Math.sin(t * 0.9);
      const cx = X(FLOOR_CENTER[0]);
      const cy = Y(FLOOR_CENTER[1] - 24);
      // the mouth — a pool of light sitting in the opening
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110 * k);
      rg.addColorStop(0, `rgba(226,190,120,${0.34 * breathe})`);
      rg.addColorStop(0.4, `rgba(213,179,113,${0.1 * breathe})`);
      rg.addColorStop(1, "rgba(213,179,113,0)");
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(0.75, 0.55);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      // the beam — a soft column of light standing up out of the box. An
      // anisotropic radial so it has no edge anywhere, only falloff.
      const bcy = Y(RIM_Y - 70);
      const beam = ctx.createRadialGradient(cx, bcy, 0, cx, bcy, 150 * k);
      beam.addColorStop(0, `rgba(226,190,120,${0.22 * breathe})`);
      beam.addColorStop(0.5, `rgba(213,179,113,${0.05 * breathe})`);
      beam.addColorStop(1, "rgba(213,179,113,0)");
      ctx.save();
      ctx.translate(cx, bcy);
      ctx.scale(0.42, 1);
      ctx.translate(-cx, -bcy);
      ctx.fillStyle = beam;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      for (let i = 0; i < ps.length; i++) {
        const p = step(ps[i], dt);
        ps[i] = p;
        const pr = p.age / p.life;
        const rise = p.vy * p.age * (1 + 0.35 * pr);
        const y = p.y0 - rise;
        // gentle convergence toward the spine, then the sway takes over
        const x = p.x0 + p.drift * p.age + Math.sin(p.age * p.freq + p.phase) * p.amp * pr - p.x0 * 0.28 * pr;
        const a = Math.min(1, p.age / 0.35) * (1 - smooth(0.55, 1, pr)) * (0.55 + 0.45 * p.depth);
        if (a <= 0.004) continue;
        const px = X(x);
        const py = Y(y);

        if (p.kind === 3) {
          // out-of-focus mote drifting past the lens
          const r = p.size * k;
          ctx.globalAlpha = a * 0.22;
          ctx.drawImage(gold, px - r * 4, py - r * 4, r * 8, r * 8);
        } else if (p.kind === 0) {
          const tw = 0.85 + 0.15 * Math.sin(p.age * 6 + p.phase);
          const r = p.size * k * (1 + 0.6 * p.depth);
          if (p.vy > 48) {
            // a short trail on the quick ones — the eye reads speed, not dots
            const len = p.vy * 0.07 * k;
            const tg = ctx.createLinearGradient(0, py + len, 0, py);
            tg.addColorStop(0, "rgba(226,190,120,0)");
            tg.addColorStop(1, `rgba(240,215,160,${0.45 * a * tw})`);
            ctx.globalAlpha = 1;
            ctx.fillStyle = tg;
            ctx.fillRect(px - 0.5 * k, py, Math.max(1, k), len);
          }
          ctx.globalAlpha = a * tw * (p.cool ? 0.85 : 1);
          ctx.drawImage(p.cool ? cool : gold, px - r * 4, py - r * 4, r * 8, r * 8);
          ctx.globalAlpha = a * tw;
          ctx.fillStyle = p.cool ? "rgba(255,255,255,0.95)" : "rgba(255,246,222,0.95)";
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.7, r * 0.45), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 1) {
          const len = p.size * k;
          const lg = ctx.createLinearGradient(0, py - len, 0, py);
          lg.addColorStop(0, "rgba(213,179,113,0)");
          lg.addColorStop(0.5, `rgba(245,225,175,${0.95 * a})`);
          lg.addColorStop(1, "rgba(213,179,113,0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = lg;
          ctx.fillRect(px - 0.7 * k, py - len, Math.max(1, 1.4 * k), len);
        } else {
          const len = p.size * k;
          ctx.globalAlpha = 0.5 * a;
          ctx.fillStyle = "rgba(230,209,170,1)";
          ctx.fillRect(px - len / 2, py, len, Math.max(1, 1.2 * k));
          ctx.globalAlpha = 0.9 * a;
          ctx.fillStyle = "rgba(255,247,226,1)";
          ctx.fillRect(px - len / 2, py, Math.max(1, 1.6 * k), Math.max(1, 1.2 * k));
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    fit();
    const ro = new ResizeObserver(() => {
      fit();
      if (reduced) draw(0);
    });
    ro.observe(stage);

    if (reduced) {
      draw(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      if (!visible) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && document.visibilityState === "visible";
      if (visible) start();
      else stop();
    }, { rootMargin: "80px" });
    io.observe(stage);
    const onVis = () => {
      if (document.visibilityState !== "visible") {
        visible = false;
        stop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const viewBox = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;

  return (
    <div
      ref={stageRef}
      className={clsx("relative select-none", className)}
      style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
      aria-hidden="true"
    >
      {/* back layer — what the data rises in front of */}
      <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="db-inner-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DCA64E" />
            <stop offset="1" stopColor="#C48D3E" />
          </linearGradient>
          <linearGradient id="db-inner-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EDBD5E" />
            <stop offset="1" stopColor="#D9A54C" />
          </linearGradient>
          <linearGradient id="db-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1E3F74" />
            <stop offset="1" stopColor="#132A56" />
          </linearGradient>
          <radialGradient id="db-floor-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0" stopColor="#E9C98A" stopOpacity="0.7" />
            <stop offset="0.55" stopColor="#D5B371" stopOpacity="0.16" />
            <stop offset="1" stopColor="#D5B371" stopOpacity="0" />
          </radialGradient>
          <filter id="db-shadow" x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {/* grounding shadow, tinted to the page blue rather than black */}
        <ellipse cx="0" cy={S + 6} rx={COS * S * 0.98} ry="22" fill="rgba(2,8,28,0.75)" filter="url(#db-shadow)" />
        <polygon points={FACES.floor} fill="url(#db-floor)" />
        <polygon points={FACES.floor} fill="url(#db-floor-glow)" />
        <polygon points={FACES.innerLeft} fill="url(#db-inner-left)" />
        <polygon points={FACES.innerRight} fill="url(#db-inner-right)" />
        <polygon points={FACES.rimBack} fill="#E7D199" />
        <polygon points={FACES.rimLeft} fill="#E1C88E" />
      </svg>

      {/* the data */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* front layer — the rim and outer walls the data climbs out from behind */}
      <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="db-outer-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#B4753A" />
            <stop offset="1" stopColor="#CF9446" />
          </linearGradient>
          <linearGradient id="db-outer-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E2A64C" />
            <stop offset="1" stopColor="#F2C367" />
          </linearGradient>
          <linearGradient id="db-rim-front" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#EFD9A1" />
            <stop offset="0.5" stopColor="#F9EAC0" />
            <stop offset="1" stopColor="#F1DBA3" />
          </linearGradient>
          <linearGradient id="db-rim-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4E1AE" />
            <stop offset="1" stopColor="#EAD29A" />
          </linearGradient>
          <linearGradient id="db-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={FACES.outerLeft} fill="url(#db-outer-left)" />
        <polygon points={FACES.outerRight} fill="url(#db-outer-right)" />
        {/* light from the plume catching the top of the front walls */}
        <polygon points={FACES.outerLeft} fill="url(#db-sheen)" />
        <polygon points={FACES.outerRight} fill="url(#db-sheen)" />
        <polygon points={FACES.rimRight} fill="url(#db-rim-right)" />
        <polygon points={FACES.rimFront} fill="url(#db-rim-front)" />
        {/* the front edge, drawn as a hairline of light */}
        <polyline
          points={pts([0, 1, H], [1, 1, H], [1, 0, H])}
          fill="none"
          stroke="#FFF6DC"
          strokeOpacity="0.7"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <line x1={iso(1, 1, H)[0]} y1={iso(1, 1, H)[1]} x2={iso(1, 1, 0)[0]} y2={iso(1, 1, 0)[1]} stroke="#FFF6DC" strokeOpacity="0.35" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
