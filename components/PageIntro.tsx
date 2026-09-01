import SectionReveal from "@/components/SectionReveal";

/**
 * Inner-page intro — left-aligned, reads as an operating document (§5.6).
 * Clears the fixed 4.5rem header.
 */
export default function PageIntro({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <SectionReveal className="container-page pb-10 pt-40 max-md:pt-32">
      <div className="flex max-w-4xl flex-col gap-6">
        <span data-anim="eyebrow" className="label text-white-50">
          {eyebrow}
        </span>
        <h1 data-anim="h2" className="h2">
          {title}
        </h1>
        {lead && (
          <p className="body-xl max-w-3xl text-white-60" data-anim="fade-up">
            {lead}
          </p>
        )}
        {children}
      </div>
    </SectionReveal>
  );
}
