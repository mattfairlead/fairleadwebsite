"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "@/components/Logo";
import { headerIntro, headerScrollBlur, registerGsap } from "@/lib/motion";
import { useGSAP } from "@gsap/react";

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/engagements", label: "Engagements" },
  { href: "/team", label: "Team" },
  { href: "/perspectives", label: "Perspectives" },
];

const ASK_ENABLED = process.env.NEXT_PUBLIC_ASK_ENABLED === "true";

/**
 * Fixed transparent header, 4.5rem, three segments split by 1px white-20
 * vertical rules: [logo] | [nav] | [Talk to a partner]. Bottom hairline.
 * On load: bottom rule scaleX in, verticals scaleY in (§5.8.3). Over the
 * first ~120px of scroll it eases into a 12px backdrop blur.
 *
 * Craft layer: a glass pill slides between nav links under the cursor; the
 * current page carries a gold dot; a 1px gold scroll-progress rule rides the
 * bottom edge; the mobile menu is a glass sheet whose links stagger in and
 * reverse out, with the page scroll locked while it's open.
 */
export default function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });

  useGSAP(
    () => {
      registerGsap();
      if (!ref.current) return;
      // Scroll-driven glass toggle always runs, even on narrow phones that
      // skip the load-in animation below.
      const cleanupScrollBlur = headerScrollBlur(ref.current);
      if (window.innerWidth >= 480) headerIntro(ref.current);
      return cleanupScrollBlur;
    },
    { scope: ref }
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock the page while the sheet is open; Escape closes it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const moveTo = useCallback((el: HTMLElement) => {
    const nav = navRef.current;
    if (!nav) return;
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ x: r.left - n.left, w: r.width, on: true });
  }, []);

  return (
    <header
      ref={ref}
      className="site-header fixed inset-x-0 top-0 z-50 h-[4.5rem]"
      style={{
        // Short: the glass is scroll-driven now, so a long transition would
        // just trail the scroll position instead of smoothing it.
        transition: "background-color 0.15s linear, backdrop-filter 0.15s linear, -webkit-backdrop-filter 0.15s linear",
      }}
    >
      <div className="container-page relative flex h-full items-stretch">
        {/* segment 1: logo */}
        <div className="flex items-center pr-8" data-header-item>
          <Logo />
        </div>

        {/* segment 2: nav */}
        <nav
          ref={navRef}
          className="relative hidden flex-1 items-center gap-1 pl-6 md:flex"
          aria-label="Primary"
          onMouseLeave={() => setPill((p) => ({ ...p, on: false }))}
        >
          <span data-dec="v" className="dec dec-header left-0 w-px" style={{ top: 1, height: "calc(100% - 2px)" }} />
          <span
            className={clsx("nav-pill", pill.on && "is-visible")}
            style={{ "--pill-x": `${pill.x}px`, "--pill-w": `${pill.w}px` } as React.CSSProperties}
            aria-hidden="true"
          />
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                data-header-item
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                onFocus={(e) => moveTo(e.currentTarget)}
                className={clsx(
                  "nav-link button transition-colors duration-200",
                  active ? "text-gold" : "text-white-60 hover:text-white-100"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* segment 3: Ask trigger + CTA */}
        <div className="relative ml-auto hidden items-center gap-6 pl-8 md:flex">
          <span data-dec="v" className="dec dec-header left-0 w-px" style={{ top: 1, height: "calc(100% - 2px)" }} />
          {ASK_ENABLED && (
            <button
              type="button"
              data-header-item
              className="button flex items-center gap-2 text-white-50 transition-colors duration-200 hover:text-white-100"
              aria-label="Ask Fairlead"
            >
              <kbd className="rounded-[3px] border border-white-20 px-1.5 py-0.5 text-[0.625rem]">⌘K</kbd>
              Ask Fairlead
            </button>
          )}
          <Link href="/contact" data-header-item className="btn btn-ghost button">
            Talk to a partner
          </Link>
        </div>

        {/* mobile burger */}
        <button
          type="button"
          className="relative z-50 ml-auto flex h-full w-10 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="block h-px w-6 bg-white-100 transition-transform duration-[400ms]"
            style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none", transitionTimingFunction: "var(--ease-spring)" }}
          />
          <span
            className="block h-px w-6 bg-white-100 transition-transform duration-[400ms]"
            style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none", transitionTimingFunction: "var(--ease-spring)" }}
          />
        </button>

        {/* bottom hairline + scroll progress */}
        <span data-dec="bottom" className="dec dec-header bottom-0 left-0 h-px w-full" />
        <span className="scroll-progress" aria-hidden="true" />
      </div>

      {/* mobile menu — glass sheet */}
      <div
        id="mobile-menu"
        data-open={open}
        className="mobile-menu fixed inset-x-0 top-[4.5rem] bottom-0 z-40 flex flex-col px-5 pt-10 md:hidden"
        aria-hidden={!open}
      >
        {NAV.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx("menu-item h3 flex items-baseline justify-between py-3", active ? "text-gold" : "text-white-100")}
              style={{ "--i": i } as React.CSSProperties}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
              <span className="label text-white-40 tabular">0{i + 1}</span>
            </Link>
          );
        })}
        <div className="menu-item mt-8 flex flex-col gap-6" style={{ "--i": NAV.length } as React.CSSProperties}>
          <Link href="/contact" className="btn btn-primary button self-start" tabIndex={open ? 0 : -1}>
            Talk to a partner
          </Link>
          <a href="tel:+16173154822" className="body-md text-white-50 tabular" tabIndex={open ? 0 : -1}>
            (617) 315-4822
          </a>
        </div>
        <p className="menu-item label mt-auto pb-10 text-white-40" style={{ "--i": NAV.length + 1 } as React.CSSProperties}>
          Boston · Houston · Minneapolis · Maryland
        </p>
      </div>
    </header>
  );
}
