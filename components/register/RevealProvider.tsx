"use client";

import { createContext, useCallback, useContext, useState } from "react";
import RevealModal from "@/components/register/RevealModal";
import type { RevealMode } from "@/lib/register-access";

/**
 * One modal for the whole register. Any RevealButton under this provider —
 * the header CTA, every locked row — opens the same sheet, so the page
 * carries a single form and a single piece of state.
 */
const RevealContext = createContext<{ open: () => void }>({ open: () => {} });

export function useReveal() {
  return useContext(RevealContext);
}

export default function RevealProvider({
  mode,
  total,
  children,
}: {
  mode: RevealMode;
  total: number;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <RevealContext.Provider value={{ open }}>
      {children}
      <RevealModal open={isOpen} onClose={close} mode={mode} total={total} />
    </RevealContext.Provider>
  );
}
