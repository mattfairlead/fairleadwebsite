"use client";

import { useState } from "react";
import Field from "@/components/Field";
import { ARROW } from "@/components/Btn";

/**
 * Newsletter capture (§4.6) — one underline field, posts to /api/subscribe
 * (SendGrid list). Success replaces the form with a single line, §5.9.
 */
export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="h4 flex items-center gap-3" role="status" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
        You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-6">
      <Field
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@firm.com"
        autoComplete="email"
        inputMode="email"
      />
      <button type="submit" className="btn btn-secondary button self-start" disabled={state === "busy"}>
        {state === "busy" ? "Sending…" : <>Get the next one {ARROW}</>}
      </button>
      {state === "error" && (
        <p className="body-sm text-gold" role="alert">
          Something broke — try again, or email us.
        </p>
      )}
    </form>
  );
}
