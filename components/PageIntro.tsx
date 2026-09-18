import clsx from "clsx";
import SectionReveal from "@/components/SectionReveal";

/**
 * Inner-page intro — left-aligned, reads as an operating document (§5.6).
 * Clears the fixed 4.5rem header. A short gold rule anchors the eyebrow so
 * every inner page opens on the same mark. `backdrop` is an optional layer
 * (footage, imagery) painted behind the copy — it renders as a sibling of
 * the capped .container-page wrapper, not inside it, so it runs truly
 * edge-to-edge against the browser window rather than stopping at the
 * container's padding or (past 90rem) its centered max-width.
 */
export default function PageIntro({
  eyebrow,
  title,
  lead,
  children,
  aside,
  backdrop,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  backdrop?: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionReveal className={clsx("pb-12 pt-44 max-md:pt-32", backdrop && "relative isolate", className)}>
      {backdrop}
      <div className="container-page">
        <div className={clsx("grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end", backdrop && "relative z-10")}>
          <div className="flex max-w-4xl flex-col gap-6">
            <span data-anim="eyebrow" className="label flex items-center gap-3 text-white-50">
              <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
              {eyebrow}
            </span>
            <h1 data-anim="h2" className="h2" style={{ fontSize: "clamp(2.8125rem, 2rem + 3.2vw, 4.5rem)" }}>
              {title}
            </h1>
            {lead && (
              <p className="body-xl max-w-3xl text-white-60" data-anim="fade-up">
                {lead}
              </p>
            )}
            {children}
          </div>
          {aside && (
            <div data-anim="fade-up" data-anim-delay="0.2">
              {aside}
            </div>
          )}
        </div>
      </div>
    </SectionReveal>
  );
}
