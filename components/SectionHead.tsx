export default function SectionHead({
  eyebrow,
  title,
  className = "",
  titleClass = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
  titleClass?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <span data-anim="eyebrow" className="label text-white-50">
        {eyebrow}
      </span>
      <h2 data-anim="h2" className={`${titleClass} max-w-4xl`}>
        {title}
      </h2>
    </div>
  );
}
