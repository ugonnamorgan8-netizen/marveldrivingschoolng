// Email notifications to the school via Resend (https://resend.com).
import { env, escapeHtml } from "./http.js";

/**
 * Send a notification email. All values are HTML-escaped.
 * Returns { skipped } when email isn't configured, { ok } otherwise.
 */
export const notify = async ({ subject, heading, rows, replyTo, footer }) => {
  const apiKey = env("RESEND_API_KEY");
  const to = env("NOTIFY_EMAIL_TO");
  if (!apiKey || !to) return { skipped: true };

  const from = env("NOTIFY_EMAIL_FROM", "Marvel Driving School <onboarding@resend.dev>");
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
      <h2 style="margin:0 0 12px">${escapeHtml(heading)}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
      ${footer ? `<p style="color:#666;margin-top:16px">${escapeHtml(footer)}</p>` : ""}
    </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const payload = {
    from,
    to: to.split(",").map((s) => s.trim()).filter(Boolean),
    subject: String(subject).slice(0, 150),
    html,
    text,
  };
  if (replyTo) payload.reply_to = replyTo;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    console.error("Resend error", r.status, (await r.text()).slice(0, 300));
    return { ok: false };
  }
  return { ok: true };
};
