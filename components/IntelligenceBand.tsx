import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import GlassStrip from "@/components/GlassStrip";
import LiveDots from "@/components/LiveDots";

/**
 * Home §4.1 row 6 — the Intelligence band. Full-bleed Solaris Portfolio Map
 * still (TODO: sanitized screenshot — until then a stylized map ground)
 * with pulsing site dots (§5.8.6) and the Cottonwood four-option glass
 * strip. The demo reel lives on /intelligence, not here.
 */

const SITE_PINS = [
  { label: "Site A", x: "16%", y: "38%" },
  { label: "Site B", x: "31%", y: "55%" },
  { label: "Site C", x: "44%", y: "30%" },
  { label: "Site D", x: "58%", y: "62%" },
  { label: "Site E", x: "71%", y: "42%" },
  { label: "Site F", x: "84%", y: "56%" },
];

const OPTIONS = [
  { head: "Accept", body: "Pay the claim as presented." },
  { head: "Withdraw", body: "Exit the interconnection queue." },
  { head: "Counter", body: "Contest with matched precedent." },
  { head: "Escalate", body: "Formal dispute, counsel engaged." },
];

export default function IntelligenceBand() {
  return (
    <SectionReveal className="section">
      <div className="container-page">
        <SectionHead
          eyebrow="Operating intelligence"
          title={<>Custom AI solutions that solve operational challenges.</>}
        />
        <p className="body-lg mt-6 max-w-2xl text-white-60" data-anim="fade-up">
          A $720K utility claim landed on a portfolio company&rsquo;s desk. Solaris returned a four-option
          decision memo — every number traced to its source — with ~$360K of expected savings on the table.
        </p>
      </div>

      <div className="relative mt-14 overflow-hidden" style={{ aspectRatio: "1440/863", minHeight: "24rem" }}>
        {/* TODO(media): replace with the sanitized Solaris Portfolio Map still, blurred at edges into blue-950 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, #0F2A6E 0%, #0A1A4F 45%, #050E2E 100%)",
          }}
        />
        {/* graticule */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <LiveDots pins={SITE_PINS} />
        {/* edge dissolve into the page */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050E2E 0%, rgba(5,14,46,0) 18%, rgba(5,14,46,0) 62%, #050E2E 100%)",
          }}
        />
        <GlassStrip cells={OPTIONS} />
      </div>

      <div className="container-page mt-12">
        <Link href="/intelligence" className="btn btn-primary button" data-anim="pop">
          See the Cottonwood memo
        </Link>
      </div>
    </SectionReveal>
  );
}
