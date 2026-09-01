import Link from "next/link";
import Logo from "@/components/Logo";
import ImageBand from "@/components/ImageBand";
import LiveDots from "@/components/LiveDots";

const CITIES = ["Boston", "Houston", "Minneapolis", "Maryland"];

// Approximate positions of the four cities on the footer band, §5.8.6.
const CITY_PINS = [
  { label: "Boston", x: "78%", y: "34%" },
  { label: "Houston", x: "48%", y: "72%" },
  { label: "Minneapolis", x: "46%", y: "30%" },
  { label: "Maryland", x: "72%", y: "46%" },
];

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/engagements", label: "Engagements" },
  { href: "/team", label: "Team" },
  { href: "/perspectives", label: "Perspectives" },
  { href: "/contact", label: "Contact" },
];

/**
 * Footer — §5.5 last row. A blue-hour image band (21rem) with the four
 * office cities as live dots, then a hairline-segmented footer. No personal
 * emails, no fax. Mailing address small-print only (TODO §9: keep or drop).
 */
export default function Footer() {
  return (
    <footer>
      <ImageBand minHeight="21rem" overlayStrength={0.8} className="mt-20">
        <LiveDots pins={CITY_PINS} showLabels />
      </ImageBand>

      <div className="container-page relative">
        <span className="dec dec-footer left-0 top-0 h-px w-full" />

        <div className="grid gap-10 py-14 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="body-sm max-w-xs text-white-40">
              The embedded operating platform for PE-backed companies.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="body-sm text-white-40 transition-colors duration-200 hover:text-white-100">
                {item.label}
              </Link>
            ))}
            <Link href="/careers" className="body-sm text-white-40 transition-colors duration-200 hover:text-white-100">
              Careers
            </Link>
            <a
              href="https://tools.fairleadadvisors.com"
              className="body-sm text-white-40 transition-colors duration-200 hover:text-white-100"
            >
              Client portal
            </a>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="label text-white-50">Offices</span>
            {CITIES.map((city) => (
              <span key={city} className="body-sm text-white-40">
                {city}
              </span>
            ))}
            <a href="tel:+16173154822" className="body-sm mt-2 text-white-60 transition-colors duration-200 hover:text-gold tabular">
              (617) 315-4822
            </a>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-x-8 gap-y-2 py-6">
          <span className="dec dec-footer left-0 top-0 h-px w-full" />
          <span className="body-sm text-white-40">© {new Date().getFullYear()} Fairlead Advisors</span>
          <a
            href="https://www.linkedin.com/company/fairlead-advisors"
            rel="noopener noreferrer"
            target="_blank"
            className="body-sm text-white-40 transition-colors duration-200 hover:text-white-100"
          >
            LinkedIn
          </a>
          {/* TODO(§9): mailing address small print — keep or drop, pending decision */}
        </div>
      </div>
    </footer>
  );
}
