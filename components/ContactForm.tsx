"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ROLES = ["Sponsor", "Portfolio company", "Intermediary", "Other"] as const;

/**
 * The contact form — §4.7. Four underline fields on a dark page, nothing
 * else. Posts to /api/contact (SendGrid → info@ distribution list). Submit
 * shows the spin state inside the pill; success replaces the form with a
 * single .h3 line. No toasts, no modals (§5.9).
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
      <p className="h3" data-anim="fade-up">
        Got it. A partner will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-10">
      <label className="flex flex-col gap-2">
        <span className="label text-white-50">Name</span>
        <input className="field" required value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </label>

      <label className="flex flex-col gap-2">
        <span className="label text-white-50">Firm</span>
        <input className="field" required value={form.firm} onChange={(e) => set("firm", e.target.value)} autoComplete="organization" />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className="label mb-3 text-white-50">Role</legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => set("role", role)}
              aria-pressed={form.role === role}
              className={`button rounded-pill px-4 py-2 transition-all duration-200 ${
                form.role === role
                  ? "bg-gold text-blue-950"
                  : "bg-blue-900 text-white-60 hover:bg-blue-800 hover:text-white-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="label text-white-50">What are you working through?</span>
        <textarea className="field" required value={form.message} onChange={(e) => set("message", e.target.value)} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="label text-white-50">Email</span>
        <input
          className="field"
          type="email"
          required
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
        />
      </label>

      <button type="submit" className="btn btn-primary button self-start" disabled={state === "busy"}>
        {state === "busy" ? (
          <>
            <span className="spin inline-block h-4 w-4 rounded-full border border-current border-t-transparent" aria-hidden="true" />
            Sending
          </>
        ) : (
          "Talk to a partner"
        )}
      </button>
      {state === "error" && (
        <p className="body-sm text-gold">
          Something broke. Call us instead — <a href="tel:+16173154822" className="link-underline">(617) 315-4822</a>.
        </p>
      )}
    </form>
  );
}
