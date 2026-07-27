import "server-only";

/**
 * Enquiry email bodies. Every interpolated value is user-supplied, so it goes
 * through `escapeHtml` — an unescaped message would let a submitter inject
 * markup (or a phishing link) into the coach's inbox.
 */

export type Enquiry = {
  name: string;
  email: string;
  message: string;
  source: string;
  /** ISO timestamp, rendered in IST for the coach's copy. */
  receivedAt: string;
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Newlines/carriage returns in a header value enable header injection. */
export function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function paragraphs(message: string): string {
  return escapeHtml(message)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px">${block.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function istTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

const SHELL_OPEN =
  '<div style="background:#0b0b0c;padding:28px 16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif">' +
  '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden">' +
  '<div style="height:3px;background:linear-gradient(90deg,#c9a227,#f0d67a,#c9a227)"></div>' +
  '<div style="padding:28px 26px;color:#1b1b1f;font-size:15px;line-height:1.6">';

const SHELL_CLOSE = "</div></div></div>";

/** Sent to the coach — the actual lead notification. */
export function coachNotification(enquiry: Enquiry): { subject: string; html: string; text: string } {
  const name = sanitizeHeader(enquiry.name);

  const html =
    SHELL_OPEN +
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f">New enquiry</p>' +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">${escapeHtml(name)} wants to talk</h1>` +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin:0 0 20px">' +
    row("Name", escapeHtml(name)) +
    row("Email", `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#8a6d1f">${escapeHtml(enquiry.email)}</a>`) +
    row("Source", escapeHtml(enquiry.source)) +
    row("Received", escapeHtml(istTimestamp(enquiry.receivedAt)) + " IST") +
    "</table>" +
    '<div style="border-top:1px solid #ececf0;padding-top:18px">' +
    '<p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6c6c76">Message</p>' +
    paragraphs(enquiry.message) +
    "</div>" +
    `<p style="margin:22px 0 0"><a href="mailto:${escapeHtml(enquiry.email)}" style="display:inline-block;background:#c9a227;color:#141416;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:8px">Reply to ${escapeHtml(name)}</a></p>` +
    SHELL_CLOSE;

  const text = [
    `New enquiry from ${name}`,
    `Email: ${enquiry.email}`,
    `Source: ${enquiry.source}`,
    `Received: ${istTimestamp(enquiry.receivedAt)} IST`,
    "",
    enquiry.message,
  ].join("\n");

  return { subject: `New enquiry — ${name}`, html, text };
}

/** Auto-reply to the enquirer, so the form doesn't feel like a void. */
export function enquiryAutoReply(
  enquiry: Enquiry,
  opts: { responseTime: string; waHref: string; siteOrigin: string },
): { subject: string; html: string; text: string } {
  const firstName = sanitizeHeader(enquiry.name).split(/\s+/)[0] || "there";

  const html =
    SHELL_OPEN +
    `<h1 style="margin:0 0 16px;font-size:21px;font-weight:600">Got it, ${escapeHtml(firstName)}.</h1>` +
    `<p style="margin:0 0 14px">Thanks for reaching out. Your message has landed with me directly and I'll reply <strong>${escapeHtml(opts.responseTime)}</strong>.</p>` +
    '<div style="background:#faf7ee;border-left:3px solid #c9a227;border-radius:6px;padding:14px 16px;margin:0 0 18px">' +
    '<p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f">What you sent</p>' +
    paragraphs(enquiry.message) +
    "</div>" +
    '<p style="margin:0 0 18px">If it\'s urgent, WhatsApp is the fastest way to reach me.</p>' +
    `<p style="margin:0 0 24px"><a href="${escapeHtml(opts.waHref)}" style="display:inline-block;background:#c9a227;color:#141416;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:8px">Chat on WhatsApp</a></p>` +
    '<p style="margin:0;color:#6c6c76;font-size:13px">— Aditya Kumar Upadhyay<br />' +
    `<a href="${escapeHtml(opts.siteOrigin)}" style="color:#8a6d1f">${escapeHtml(opts.siteOrigin.replace(/^https?:\/\//, ""))}</a></p>` +
    SHELL_CLOSE;

  const text = [
    `Got it, ${firstName}.`,
    "",
    `Thanks for reaching out. Your message has landed with me directly and I'll reply ${opts.responseTime}.`,
    "",
    "What you sent:",
    enquiry.message,
    "",
    `If it's urgent, WhatsApp is fastest: ${opts.waHref}`,
    "",
    "— Aditya Kumar Upadhyay",
    opts.siteOrigin,
  ].join("\n");

  return { subject: "Thanks for reaching out — I've got your message", html, text };
}

function row(label: string, value: string): string {
  return (
    '<tr><td style="padding:5px 0;color:#6c6c76;width:88px;vertical-align:top">' +
    label +
    '</td><td style="padding:5px 0;color:#1b1b1f">' +
    value +
    "</td></tr>"
  );
}
