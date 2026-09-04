"use client";

import { createContext, useCallback, useContext, useState } from "react";
import RevealModal from "@/components/register/RevealModal";

/**
 * One request sheet for the whole register. Any RevealButton under this
 * provider — every locked row, the footnote link — opens the same sheet, so
 * the page carries a single form and a single piece of state.
 */
const RevealContext = createContext<{ open: () => void }>({ open: () => {} });

export function useReveal() {
  return useContext(RevealContext);
}

export default function RevealProvider({ total, children }: { total: number; children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <RevealContext.Provider value={{ open }}>
      {children}
      <RevealModal open={isOpen} onClose={close} total={total} />
    </RevealContext.Provider>
  );
}
