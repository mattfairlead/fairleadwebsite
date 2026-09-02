import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import GlassStrip from "@/components/GlassStrip";
import LiveDots from "@/components/LiveDots";
import Btn from "@/components/Btn";

/**
 * Home §4.1 row 6 — the Intelligence band. Full-bleed Solaris Portfolio Map
 * still (TODO: sanitized screenshot — until then a stylized map ground)
 * with pulsing site dots (§5.8.6), a faint network between them, and the
 * Cottonwood four-option glass strip. The demo reel lives on /intelligence.
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
  const points = SITE_PINS.map((p) => `${parseFloat(p.x)},${parseFloat(p.y)}`).join(" ");
  return (
    <SectionReveal className="section">
      <div className="container-page grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <SectionHead
          eyebrow="Operating intelligence"
          title={<>Custom AI solutions that solve operational challenges.</>}
        />
        <p className="body-lg max-w-xl text-white-60 md:pb-2" data-anim="fade-up">
          A $720K utility claim landed on a portfolio company&rsquo;s desk. Solaris returned a four-option
          decision memo — every number traced to its source — with ~$360K of expected savings on the table.
        </p>
      </div>

      <div className="relative mt-14 overflow-hidden" style={{ aspectRatio: "1440/863", minHeight: "26rem" }}>
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
            maskImage: "radial-gradient(80% 70% at 50% 50%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(80% 70% at 50% 50%, #000 40%, transparent 100%)",
          }}
        />
        {/* the network between sites */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} fill="none" stroke="rgba(213,179,113,0.28)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" strokeDasharray="2 2" />
        </svg>
        <LiveDots pins={SITE_PINS} showLabels rings />
        {/* edge dissolve into the page */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050E2E 0%, rgba(5,14,46,0) 18%, rgba(5,14,46,0) 62%, #050E2E 100%)",
          }}
        />
        {/* live status */}
        <div className="absolute left-6 top-8 flex items-center gap-2 md:left-10" aria-hidden="true">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" style={{ animation: "ping 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="label text-white-50">Portfolio map · live</span>
        </div>
        <GlassStrip cells={OPTIONS} />
      </div>

      <div className="container-page mt-12 flex flex-wrap items-center gap-6">
        <Btn href="/intelligence#cottonwood" arrow dataAnim="pop">
          See the Cottonwood memo
        </Btn>
        <span className="body-sm text-white-40" data-anim="fade-up" data-anim-delay="0.1">
          Four options, each priced. Every figure traced to its source document.
        </span>
      </div>
      <style>{`@keyframes ping{75%,100%{transform:scale(2.5);opacity:0}}`}</style>
    </SectionReveal>
  );
}
