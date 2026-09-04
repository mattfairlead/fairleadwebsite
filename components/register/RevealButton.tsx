"use client";

import { useReveal } from "@/components/register/RevealProvider";

/** A button that opens the register's reveal sheet. Styling is the caller's. */
export default function RevealButton({
  className,
  ariaLabel,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const { open } = useReveal();
  return (
    <button type="button" onClick={open} className={className} aria-label={ariaLabel} aria-haspopup="dialog">
      {children}
    </button>
  );
}
