import Link from "next/link";
import Image from "next/image";

/**
 * Full lockup — origami mark + "Fairlead" wordmark + "Advisors" — from the
 * production brand assets (public/brand/logo-white.svg, 167.39×42.75).
 * `className` controls display height; width follows via `w-auto`.
 */
export default function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Fairlead Advisors — home">
      <Image src="/brand/logo-white.svg" alt="Fairlead Advisors" width={167} height={43} className={`w-auto ${className}`} priority />
    </Link>
  );
}
