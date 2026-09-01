"use client";

import { useEffect, useRef, useState } from "react";
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
 * On load: bottom rule scaleX in, verticals scaleY in (§5.8.3). Past 20px
 * of scroll it gains a 12px backdrop blur — nothing else changes.
 */
export default function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      ref={ref}
      className="site-header fixed inset-x-0 top-0 z-50 h-[4.5rem]"
      style={{
        transition: "background-color 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease",
      }}
    >
      <div className="container-page relative flex h-full items-stretch">
        {/* segment 1: logo */}
        <div className="flex items-center pr-8">
          <Logo />
        </div>
        {/* segment 2: nav */}
        <nav className="relative hidden flex-1 items-center gap-8 border-l-0 pl-10 md:flex" aria-label="Primary">
          <span data-dec="v" className="dec dec-header left-0 w-px" style={{ top: 1, height: "calc(100% - 2px)" }} />
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "button transition-colors duration-200",
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
        <div className="relative ml-auto hidden items-center gap-6 pl-10 md:flex">
          <span data-dec="v" className="dec dec-header left-0 w-px" style={{ top: 1, height: "calc(100% - 2px)" }} />
          {ASK_ENABLED && (
            <button
              type="button"
              className="button flex items-center gap-2 text-white-50 transition-colors duration-200 hover:text-white-100"
              aria-label="Ask Fairlead"
            >
              <kbd className="rounded-[3px] border border-white-20 px-1.5 py-0.5 text-[0.625rem]">⌘K</kbd>
              Ask Fairlead
            </button>
          )}
          <Link href="/contact" className="btn btn-secondary button">
            Talk to a partner
          </Link>
        </div>

        {/* mobile burger */}
        <button
          type="button"
          className="ml-auto flex h-full w-10 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="block h-px w-6 bg-white-100 transition-transform duration-[400ms]"
            style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-px w-6 bg-white-100 transition-transform duration-[400ms]"
            style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
          />
        </button>

        {/* bottom hairline */}
        <span data-dec="bottom" className="dec dec-header bottom-0 left-0 h-px w-full" />
      </div>

      {/* mobile menu */}
      <div
        className={clsx(
          "fixed inset-x-0 top-[4.5rem] bottom-0 z-40 flex flex-col gap-2 bg-blue-950 px-5 pt-8 transition-opacity duration-[400ms] md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="h4 py-3 text-white-100">
            {item.label}
          </Link>
        ))}
        <Link href="/contact" className="btn btn-primary button mt-6 self-start">
          Talk to a partner
        </Link>
      </div>
    </header>
  );
}
