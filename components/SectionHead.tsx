export default function SectionHead({
  eyebrow,
  title,
  className = "",
  titleClass = "h2",
  eyebrowClass = "text-white-50",
}: {
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
  titleClass?: string;
  eyebrowClass?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <span data-anim="eyebrow" className={`label ${eyebrowClass}`}>
        {eyebrow}
      </span>
      <h2 data-anim="h2" className={`${titleClass} max-w-4xl`}>
        {title}
      </h2>
    </div>
  );
}
