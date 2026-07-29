import "server-only";

import {
  renderEmail,
  eyebrow,
  paragraphs,
  infoTable,
  calloutBox,
  button,
  escapeHtml,
  sanitizeHeader,
  istTimestamp,
} from "./shell";

/**
 * /contact enquiry email bodies, built on the shared branded shell (./shell).
 * Every interpolated value is user-supplied → escaped before it reaches HTML.
 */

// Re-exported so existing importers (app/api/contact/route.ts) keep working.
export { escapeHtml, sanitizeHeader };

export type Enquiry = {
  name: string;
  email: string;
  message: string;
  source: string;
  /** ISO timestamp, rendered in IST for the coach's copy. */
  receivedAt: string;
};

/** Sent to the coach — the actual enquiry notification. */
export function coachNotification(enquiry: Enquiry): {
  subject: string;
  html: string;
  text: string;
} {
  const name = sanitizeHeader(enquiry.name);

  const bodyHtml =
    eyebrow("New enquiry") +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">${escapeHtml(name)} wants to talk</h1>` +
    infoTable([
      ["Name", escapeHtml(name)],
      [
        "Email",
        `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#8a6d1f">${escapeHtml(enquiry.email)}</a>`,
      ],
      ["Source", escapeHtml(enquiry.source)],
      ["Received", `${escapeHtml(istTimestamp(enquiry.receivedAt))} IST`],
    ]) +
    `<div style="border-top:1px solid #ececf0;padding-top:18px">` +
    eyebrow("Message") +
    paragraphs(enquiry.message) +
    "</div>" +
    `<p style="margin:22px 0 0">${button(`mailto:${enquiry.email}`, `Reply to ${name}`)}</p>`;

  const text = [
    `New enquiry from ${name}`,
    `Email: ${enquiry.email}`,
    `Source: ${enquiry.source}`,
    `Received: ${istTimestamp(enquiry.receivedAt)} IST`,
    "",
    enquiry.message,
  ].join("\n");

  return {
    subject: `New enquiry — ${name}`,
    html: renderEmail({ preheader: `New enquiry from ${name}`, bodyHtml }),
    text,
  };
}

/** Auto-reply to the enquirer, so the form doesn't feel like a void. */
export function enquiryAutoReply(
  enquiry: Enquiry,
  opts: { responseTime: string; waHref: string; siteOrigin: string },
): { subject: string; html: string; text: string } {
  const firstName = sanitizeHeader(enquiry.name).split(/\s+/)[0] || "there";

  const bodyHtml =
    `<h1 style="margin:0 0 16px;font-size:21px;font-weight:600">Got it, ${escapeHtml(firstName)}.</h1>` +
    `<p style="margin:0 0 14px">Thanks for reaching out. Your message has landed with me directly and I'll reply <strong>${escapeHtml(opts.responseTime)}</strong>.</p>` +
    calloutBox(eyebrow("What you sent") + paragraphs(enquiry.message)) +
    `<p style="margin:0 0 18px">If it's urgent, WhatsApp is the fastest way to reach me.</p>` +
    `<p style="margin:0 0 6px">${button(opts.waHref, "Chat on WhatsApp")}</p>`;

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

  return {
    subject: "Thanks for reaching out — I've got your message",
    html: renderEmail({ preheader: "I've got your message.", bodyHtml }),
    text,
  };
}
