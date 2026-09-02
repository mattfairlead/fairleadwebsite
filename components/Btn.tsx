import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

export const ARROW = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Btn({
  href,
  variant = "primary",
  arrow = false,
  className,
  children,
  type,
  disabled,
  onClick,
  dataAnim,
}: {
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  dataAnim?: string;
}) {
  const cls = clsx("btn button", `btn-${variant}`, className);

  if (href) {
    return (
      <Link href={href} className={cls} data-anim={dataAnim}>
        {children}
        {arrow && ARROW}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls} disabled={disabled} onClick={onClick} data-anim={dataAnim}>
      {children}
      {arrow && ARROW}
    </button>
  );
}
