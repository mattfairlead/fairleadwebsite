import ImageBand from "@/components/ImageBand";
import SectionReveal from "@/components/SectionReveal";

/**
 * /intelligence hero — §4.3. Full-bleed Solaris footage (the plant map
 * running live) with the page intro laid over it. The copy keeps the
 * inner-page grammar — left-aligned, gold rule, eyebrow / H1 / lead — so
 * the route still opens like an operating document; only the ground behind
 * it is footage instead of the page blue.
 *
 * ImageBand supplies the blue-hour wash and the mandatory dissolve into the
 * page ground at the bottom edge. A left-weighted scrim on top keeps the
 * copy legible where the plant surface runs bright, and lifts off toward
 * the right so the footage is what you see once the eye leaves the text.
 *
 * Served from the "Intelligence" GitHub release via /api/media/intelligence-hero
 * (see that route for why). Set NEXT_PUBLIC_INTELLIGENCE_HERO_VIDEO_URL once
 * the file moves to Blob/Supabase Storage (§9 media plan) — no code change
 * needed. Empty string disables the video and leaves the poster.
 */
const INTELLIGENCE_VIDEO =
  process.env.NEXT_PUBLIC_INTELLIGENCE_HERO_VIDEO_URL ?? "/api/media/intelligence-hero";
const INTELLIGENCE_POSTER = "/intelligence/hero-poster.jpg";

export default function IntelligenceHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
}) {
  return (
    <SectionReveal className="relative">
      <ImageBand
        aspect="1440/922"
        minHeight="min(100svh, 52rem)"
        className="hero-band"
        parallax
        overlayStrength={1}
        src={INTELLIGENCE_POSTER}
        video={INTELLIGENCE_VIDEO || undefined}
        videoPoster={INTELLIGENCE_POSTER}
      >
        {/* legibility scrim — deepest under the copy, clear on the right */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,14,46,0.82) 0%, rgba(5,14,46,0.55) 40%, rgba(5,14,46,0.15) 75%, rgba(5,14,46,0) 100%)",
          }}
        />
        <div className="container-page absolute inset-0 flex flex-col justify-end pb-20 pt-44 max-md:pb-16 max-md:pt-32">
          <div className="flex max-w-4xl flex-col gap-6">
            <span data-anim="eyebrow" className="label flex items-center gap-3 text-white-50">
              <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
              {eyebrow}
            </span>
            <h1 data-anim="h2" className="h2" style={{ fontSize: "clamp(2.8125rem, 2rem + 3.2vw, 4.5rem)" }}>
              {title}
            </h1>
            <p className="body-xl max-w-3xl text-white-60" data-anim="fade-up">
              {lead}
            </p>
          </div>
        </div>
      </ImageBand>
    </SectionReveal>
  );
}
