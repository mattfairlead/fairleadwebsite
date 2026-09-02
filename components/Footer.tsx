import Link from "next/link";
import Logo from "@/components/Logo";
import ImageBand from "@/components/ImageBand";
import LiveDots, { type DotPin } from "@/components/LiveDots";
import UsMap, { type MapCity } from "@/components/UsMap";
import { US_MAP_ASPECT, US_MAP_VIEWBOX } from "@/content/us-map";

const CITIES = ["Boston", "Houston", "Minneapolis", "Maryland"];

// The four offices projected into the map frame (Albers USA — see
// content/us-map.ts). Order is the route the dashed line threads.
const OFFICES: MapCity[] = [
  { label: "Minneapolis", x: 541.9, y: 161 },
  { label: "Boston", x: 908.7, y: 167.1 },
  { label: "Maryland", x: 836.4, y: 263.8 },
  { label: "Houston", x: 510.4, y: 509.2 },
];

// The live dots sit in a layer over the SVG, so map-space → percent of the
// same box. Boston's label stacks above its dot (it sits on the coast, and
// a right-opening label would collide with Minneapolis); Maryland opens left.
const LABEL_SIDE: Record<string, DotPin["labelSide"]> = { Boston: "top", Maryland: "left" };
const [vx, vy, vw, vh] = US_MAP_VIEWBOX.split(" ").map(Number);
const CITY_PINS: DotPin[] = OFFICES.map((c) => ({
  label: c.label,
  x: `${(((c.x - vx) / vw) * 100).toFixed(2)}%`,
  y: `${(((c.y - vy) / vh) * 100).toFixed(2)}%`,
  labelSide: LABEL_SIDE[c.label] ?? "right",
}));

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/engagements", label: "Engagements" },
  { href: "/team", label: "Team" },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
];

const linkCls = "body-sm text-white-40 transition-colors duration-200 hover:text-white-100";

/**
 * Footer — §5.5 last row. A blue-hour image band (21rem) carrying a
 * dot-matrix map of the lower 48 with the four office cities as live dots,
 * then a hairline-segmented footer. No personal
 * emails, no fax. Mailing address small-print only (TODO §9: keep or drop).
 */
export default function Footer() {
  return (
    <footer>
      <ImageBand minHeight="21rem" overlayStrength={0.8} className="mt-20">
        <div
          className="absolute top-1/2 -translate-y-1/2 max-md:left-1/2 max-md:-translate-x-1/2 md:right-[5%]"
          style={{ width: "min(29rem, 92vw)", aspectRatio: US_MAP_ASPECT }}
        >
          <UsMap cities={OFFICES} />
          <LiveDots pins={CITY_PINS} showLabels />
        </div>
        <div className="theme-page absolute bottom-8 left-6 flex items-center gap-2 md:left-10" aria-hidden="true">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="label text-white-40">Four offices · one platform</span>
        </div>
      </ImageBand>

      <div className="container-page relative">
        <span className="dec dec-footer left-0 top-0 h-px w-full" />

        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-20">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="body-md max-w-xs text-white-50">
              The embedded operating platform for PE-backed companies. Executive intelligence + artificial
              intelligence, working inside your portfolio.
            </p>
            <a
              href="tel:+16173154822"
              className="body-lg self-start text-white-100 transition-colors duration-200 hover:text-gold tabular"
            >
              (617) 315-4822
            </a>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer">
            <span className="label mb-1 text-white-50">Site</span>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls}>
                {item.label}
              </Link>
            ))}
            <a href="https://tools.fairleadadvisors.com" className={`${linkCls} mt-2 flex items-center gap-2`}>
              Client portal
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 8l6-6M3 2h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="label mb-1 text-white-50">Offices</span>
            {CITIES.map((city) => (
              <span key={city} className="body-sm text-white-40">
                {city}
              </span>
            ))}
            <a
              href="https://www.linkedin.com/company/fairlead-advisors"
              rel="noopener noreferrer"
              target="_blank"
              className={`${linkCls} mt-2`}
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
          <span className="dec dec-footer left-0 top-0 h-px w-full" />
          <span className="body-sm text-white-40">© {new Date().getFullYear()} Fairlead Advisors</span>
          <span className="label text-white-20">Operating inside portfolios since 2010</span>
          {/* TODO(§9): mailing address small print — keep or drop, pending decision */}
        </div>
      </div>
    </footer>
  );
}
