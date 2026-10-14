/**
 * Resend transactional mail — the contact form (§7) and /bio intake. The
 * newsletter signup and the register's emailed links still go through
 * SendGrid (lib/sendgrid.ts).
 *
 * Without RESEND_API_KEY the send is skipped and logged, so preview
 * deploys work before the account is provisioned.
 */

const RESEND_URL = "https://api.resend.com/emails";

/** CONTACT_TO may hold a comma-separated list of addresses. */
function recipients(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendMail(opts: {
  subject: string;
  text: string;
  replyTo?: string;
  /** Defaults to CONTACT_TO (the info@ list, comma-separated). Set for mail to a visitor. */
  to?: string;
  /** Passed through to Resend. `content` is base64. */
  attachments?: { filename: string; content: string }[];
}): Promise<{ ok: boolean; skipped?: boolean }> {
  // `||` not `??` — env vars imported with blank values must fall through
  const key = process.env.RESEND_API_KEY || "";
  const to = recipients(opts.to || process.env.CONTACT_TO || "");
  const from = process.env.CONTACT_FROM || "no-reply@fairleadadvisors.com";

  if (!key || to.length === 0) {
    console.warn("[resend] RESEND_API_KEY/CONTACT_TO unset — mail skipped:", opts.subject);
    return { ok: true, skipped: true };
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `fairleadadvisors.com <${from}>`,
      to,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      subject: opts.subject,
      text: opts.text,
      ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
    }),
  });

  if (!res.ok) console.error("[resend] send failed:", res.status, (await res.text().catch(() => "")).slice(0, 500));
  return { ok: res.ok };
}
