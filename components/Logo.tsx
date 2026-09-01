import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Fairlead Advisors — home">
      <Image src="/brand/origami-mark.svg" alt="" width={20} height={20} className="h-5 w-5" priority />
      <span
        className="font-semibold text-white-100"
        style={{ fontSize: "1.5rem", letterSpacing: "-2px", lineHeight: 1 }}
      >
        Fairlead
      </span>
    </Link>
  );
}
