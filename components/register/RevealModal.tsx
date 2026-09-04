"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Field from "@/components/Field";
import { ARROW } from "@/components/Btn";

const ROLES = ["Sponsor", "Portfolio company", "Intermediary", "Other"] as const;

/**
 * The request sheet — a glass overlay (the VideoLightbox recipe) with one
 * short form: name, firm, role, email, an optional line. Posts to
 * /api/register/request, which only notifies Fairlead: nothing is sent to
 * the visitor and nothing unlocks here. A partner reads the request and
 * decides what to share, so there is no client-side state that could open
 * the register — the server decides per request, from a cookie only a
 * partner-forwarded link can set.
 */
export default function RevealModal({ open, onClose, total }: { open: boolean; onClose: () => void; total: number }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error" | "limited">("idle");
  const [form, setForm] = useState({ name: "", firm: "", role: "", email: "", message: "", website: "" });
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  // Enter / exit choreography — mirrors VideoLightbox
  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
      return;
    }
    if (!visible) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setClosing(false);
      setVisible(false);
    }, 240);
    return () => window.clearTimeout(t);
  }, [open, visible]);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      const opener = openerRef.current;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && visible) panelRef.current?.querySelector("input")?.focus({ preventScroll: true });
  }, [open, visible]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/register/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setState("sent");
      else if (res.status === 429) setState("limited");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (!mounted || !visible) return null;

  const sent = state === "sent";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      className={clsx("lightbox fixed inset-0 z-[90] flex items-end justify-center md:items-center", closing && "is-closing")}
    >
      <button type="button" aria-label="Close" onClick={onClose} className="lightbox-backdrop absolute inset-0 cursor-default" />

      <div ref={panelRef} className="reveal-panel relative z-10 flex w-full max-w-2xl flex-col overflow-y-auto">
        <span className="dec left-0 top-0 h-px w-full" aria-hidden="true" />
        <span className="dec-gold absolute left-0 top-0 h-px w-40" aria-hidden="true" />

        <div className="flex items-start justify-between gap-6 px-6 pt-6 md:px-10 md:pt-8">
          <span className="label flex items-center gap-3 text-white-50">
            <LockGlyph open={sent} />
            {sent ? "Request sent" : "Ask for the names"}
          </span>
          <button type="button" onClick={onClose} className="btn btn-ghost button -mr-2 -mt-1">
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col gap-6 px-6 pb-8 pt-8 md:px-10 md:pb-12" role="status" aria-live="polite">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-gold"
              style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.5), 0 0 40px -10px rgba(213,179,113,0.6)" }}
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path className="check-draw" d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="reveal-title" className="h3">
              A partner has it.
            </h2>
            <p className="body-md max-w-md text-white-60">
              Your request went straight to the partners. One of them will reply to{" "}
              <span className="text-white-100">{form.email}</span> with what we can share. The summaries below are
              yours to read in the meantime.
            </p>
            <p className="body-sm text-white-40">
              In a hurry? Call{" "}
              <a href="tel:+16173154822" className="link-underline text-white-60 tabular">
                (617) 315-4822
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-8 px-6 pb-8 pt-6 md:px-10 md:pb-12">
            <div className="flex flex-col gap-3">
              <h2 id="reveal-title" className="h3">
                The names are a partner&rsquo;s call.
              </h2>
              <p className="body-md max-w-lg text-white-60">
                The register holds all <span className="text-white-100 tabular">{total}</span> engagements since 2010.
                What we did is on the page; who it was for is shared at a partner&rsquo;s discretion. Tell us who you
                are and what you&rsquo;re working through, and one of us will be in touch.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Field
                label="Name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
              />
              <Field
                label="Firm"
                required
                value={form.firm}
                onChange={(e) => set("firm", e.target.value)}
                autoComplete="organization"
              />
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="label mb-3 text-white-50">I&rsquo;m a</legend>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => set("role", form.role === role ? "" : role)}
                    aria-pressed={form.role === role}
                    className="chip button"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field
              label="Work email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              inputMode="email"
            />

            <Field
              label="What are you working through?"
              hint="Optional"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
            />

            {/* Honeypot — off-screen, never filled by a person */}
            <label className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
              Website
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </label>

            <div className="flex flex-wrap items-center gap-6">
              <button type="submit" className="btn btn-primary button" disabled={state === "busy"}>
                {state === "busy" ? (
                  <>
                    <span className="spin inline-block h-4 w-4 rounded-full border border-current border-t-transparent" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    Send the request
                    {ARROW}
                  </>
                )}
              </button>
              <span className="body-sm max-w-xs text-white-40">
                Read by a partner, not a queue. No account, no automated reply.
              </span>
            </div>

            {state === "error" && (
              <p className="body-sm text-gold" role="alert">
                Something broke. Call us instead —{" "}
                <a href="tel:+16173154822" className="link-underline tabular">
                  (617) 315-4822
                </a>
                .
              </p>
            )}
            {state === "limited" && (
              <p className="body-sm text-gold" role="alert">
                That&rsquo;s a few requests in a row. Give it an hour, or call{" "}
                <a href="tel:+16173154822" className="link-underline tabular">
                  (617) 315-4822
                </a>
                .
              </p>
            )}
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Padlock that swings open — the register's one icon. */
export function LockGlyph({ open = false, className }: { open?: boolean; className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={clsx("lock-glyph", open && "is-open", className)}
    >
      <rect x="2.5" y="6.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path className="lock-shackle" d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
