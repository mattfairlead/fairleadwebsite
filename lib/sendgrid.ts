/**
 * SendGrid transactional mail — §7. HubSpot is sunset; the contact form
 * posts here and lands on the info@ distribution list (TODO §9: create the
 * list before launch — no personal partner emails anywhere on the site).
 *
 * Without SENDGRID_API_KEY the send is skipped and logged, so preview
 * deploys work before the account is provisioned.
 */

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

export async function sendMail(opts: {
  subject: string;
  text: string;
  /** Optional HTML alternative (the register link email); text is always sent. */
  html?: string;
  replyTo?: string;
  /** Defaults to CONTACT_TO (the info@ list). Set for mail to a visitor. */
  to?: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  // `||` not `??` — env vars imported with blank values must fall through
  const key = process.env.SENDGRID_API_KEY || "";
  const to = opts.to || process.env.CONTACT_TO || "";
  const from = process.env.CONTACT_FROM || "no-reply@fairleadadvisors.com";

  if (!key || !to) {
    console.warn("[sendgrid] SENDGRID_API_KEY/CONTACT_TO unset — mail skipped:", opts.subject);
    return { ok: true, skipped: true };
  }

  const res = await fetch(SENDGRID_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "fairleadadvisors.com" },
      ...(opts.replyTo ? { reply_to: { email: opts.replyTo } } : {}),
      subject: opts.subject,
      content: [
        { type: "text/plain", value: opts.text },
        ...(opts.html ? [{ type: "text/html", value: opts.html }] : []),
      ],
    }),
  });

  return { ok: res.ok };
}

/** Add a contact to the SendGrid marketing list (newsletter capture, §4.6). */
export async function addToList(email: string): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    console.warn("[sendgrid] SENDGRID_API_KEY unset — subscribe skipped");
    return { ok: true, skipped: true };
  }
  const listId = process.env.SENDGRID_LIST_ID;
  const res = await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
    method: "PUT",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(listId ? { list_ids: [listId] } : {}),
      contacts: [{ email }],
    }),
  });
  return { ok: res.ok };
}
