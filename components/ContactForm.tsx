"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Field from "@/components/Field";
import { ARROW } from "@/components/Btn";

const ROLES = ["Sponsor", "Portfolio company", "Intermediary", "Other"] as const;

/**
 * The contact form — §4.7. Four underline fields on a dark page, nothing
 * else. Posts to /api/contact (SendGrid → info@ distribution list). Submit
 * shows the spin state inside the pill; success replaces the form with a
 * drawn check and a single .h3 line. No toasts, no modals (§5.9).
 *
 * `?subject=engagement-summary` presets the message (engagements page CTA).
 */
export default function ContactForm() {
  const searchParams = useSearchParams();
  const preset =
    searchParams.get("subject") === "engagement-summary"
      ? "Request engagement summary"
      : "";

  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", firm: "", role: "", message: preset, email: "" });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col gap-6" role="status" aria-live="polite">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-gold"
          style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.5), 0 0 40px -10px rgba(213,179,113,0.6)" }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path className="check-draw" d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="h3">Got it. A partner will be in touch.</p>
        <p className="body-md text-white-50">
          If it&rsquo;s urgent, call{" "}
          <a href="tel:+16173154822" className="link-underline text-white-100 tabular">
            (617) 315-4822
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-10">
      <div className="grid gap-10 md:grid-cols-2">
        <Field label="Name" required value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        <Field label="Firm" required value={form.firm} onChange={(e) => set("firm", e.target.value)} autoComplete="organization" />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="label mb-3 text-white-50">I&rsquo;m a</legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => set("role", role)}
              aria-pressed={form.role === role}
              className="chip button"
            >
              {role}
            </button>
          ))}
        </div>
      </fieldset>

      <Field
        as="textarea"
        label="What are you working through?"
        hint="A sentence is enough"
        required
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
      />

      <Field
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        autoComplete="email"
        inputMode="email"
      />

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn btn-primary button" disabled={state === "busy"}>
          {state === "busy" ? (
            <>
              <span className="spin inline-block h-4 w-4 rounded-full border border-current border-t-transparent" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Talk to a partner
              {ARROW}
            </>
          )}
        </button>
        <span className="body-sm text-white-40">A partner reads every submission.</span>
      </div>
      {state === "error" && (
        <p className="body-sm text-gold" role="alert">
          Something broke. Call us instead — <a href="tel:+16173154822" className="link-underline tabular">(617) 315-4822</a>.
        </p>
      )}
    </form>
  );
}
