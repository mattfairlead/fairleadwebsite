"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Field from "@/components/Field";
import { ARROW } from "@/components/Btn";
import type { RevealMode } from "@/lib/register-access";

const ROLES = ["Sponsor", "Portfolio company", "Intermediary", "Other"] as const;

/**
 * The reveal sheet — a glass overlay (the VideoLightbox recipe) with one
 * short form: name, firm, role, email, an optional line. Posts to
 * /api/register/request. In verify mode success is "check your inbox"; the
 * register stays locked until the emailed link is opened, and there is no
 * client-side state that could unlock it — the server decides per request.
 * In instant mode the response sets the grant cookie and the page re-renders.
 */
export default function RevealModal({
  open,
  onClose,
  mode,
  total,
}: {
  open: boolean;
  onClose: () => void;
  mode: RevealMode;
  total: number;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error" | "limited" | "unavailable">("idle");
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
      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as { mode?: string };
        if (json.mode === "instant") {
          onClose();
          router.replace("/engagements?unlocked=1#register");
          router.refresh();
          setState("idle");
        } else {
          setState("sent");
        }
      } else if (res.status === 429) setState("limited");
      else if (res.status === 503) setState("unavailable");
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
            {sent ? "Link sent" : "Reveal the register"}
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
              Check your inbox.
            </h2>
            <p className="body-md max-w-md text-white-60">
              We sent a link to <span className="text-white-100">{form.email}</span>. It&rsquo;s good for 48 hours and
              unlocks the register in this browser for 30 days.
            </p>
            <p className="body-sm text-white-40">
              Nothing to show? Check spam, or call{" "}
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
                Every name, every sponsor, on every row.
              </h2>
              <p className="body-md max-w-lg text-white-60">
                The register holds all <span className="text-white-100 tabular">{total}</span> engagements since 2010.
                Tell us who you are and we&rsquo;ll{" "}
                {mode === "instant" ? "open it in this browser." : "email you a link that opens it. A partner sees every request."}
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
                    {mode === "instant" ? "Reveal the register" : "Send my link"}
                    {ARROW}
                  </>
                )}
              </button>
              <span className="body-sm max-w-xs text-white-40">
                {mode === "instant" ? "A partner is notified of every reveal." : "No account, no password — one link."}
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
            {state === "unavailable" && (
              <p className="body-sm text-gold" role="alert">
                The register isn&rsquo;t taking requests right now. Call{" "}
                <a href="tel:+16173154822" className="link-underline tabular">
                  (617) 315-4822
                </a>{" "}
                and a partner will send it.
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
