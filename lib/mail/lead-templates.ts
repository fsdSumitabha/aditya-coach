import "server-only";

import {
  renderEmail,
  eyebrow,
  infoTable,
  calloutBox,
  button,
  escapeHtml,
  istTimestamp,
} from "./shell";
import type { Resource } from "./resources";

/**
 * Lead-magnet email bodies, built on the shared branded shell (./shell):
 *  - `leadMagnetDelivery`  → the subscriber, with the PDF attached
 *  - `leadAdminNotification` → the coach, with lead source + metadata
 */

export type LeadMeta = {
  /** lead's full name, as typed */
  name: string;
  /** lead's phone number, as typed */
  phone: string;
  email: string;
  source: string;
  /** ISO timestamp */
  receivedAt: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
};

/** Delivery email to the subscriber (the PDF rides as an attachment). */
export function leadMagnetDelivery(opts: {
  resource: Resource;
  attached: boolean;
  /** on-site fallback link to the same guide */
  pdfUrl?: string;
  bookUrl: string;
  /** lead's full name — the greeting is dropped when it's absent */
  name?: string;
}): { subject: string; html: string; text: string } {
  const { resource } = opts;
  const t = escapeHtml(resource.title);
  const firstName = (opts.name ?? "").trim().split(/\s+/)[0] ?? "";

  const attachLine = opts.attached
    ? `<p style="margin:0 0 14px">Your copy of <strong>${t}</strong> is attached to this email as a PDF. Save it somewhere you'll actually open it.</p>`
    : `<p style="margin:0 0 14px">Your copy of <strong>${t}</strong> is on its way. ${
        opts.pdfUrl
          ? `You can also read it here any time.`
          : `I'll follow up shortly with your copy.`
      }</p>`;

  const bodyHtml =
    eyebrow("Your free guide") +
    `<h1 style="margin:0 0 14px;font-size:22px;font-weight:600">Here's ${t}.</h1>` +
    /* [review] first-name greeting — dropped when no name was captured */
    (firstName
      ? `<p style="margin:0 0 14px">${escapeHtml(firstName)} — you asked for it, so here it is.</p>`
      : "") +
    `<p style="margin:0 0 14px">${escapeHtml(resource.summary)}</p>` +
    attachLine +
    calloutBox(
      `<p style="margin:0;font-size:14px;color:#6c6c76"><strong style="color:#8a6d1f">How to use it:</strong> Don't try to do all ten at once. Pick one. Do it for 7 days. Then add the next. Compounded over 90 days, this becomes a completely different life.</p>`,
    ) +
    (opts.pdfUrl
      ? `<p style="margin:0 0 22px">${button(opts.pdfUrl, "Open the guide")}</p>`
      : "") +
    `<p style="margin:0 0 14px">When you're ready to build the full system around your life — the training, the nutrition, the presence — that's what the coaching is for.</p>` +
    `<p style="margin:0 0 6px">${button(opts.bookUrl, "Book a Consultation")}</p>`;

  const text = [
    `Here's ${resource.title}.`,
    "",
    firstName ? `${firstName} — you asked for it, so here it is.` : "",
    resource.summary,
    "",
    opts.attached
      ? "Your copy is attached to this email as a PDF."
      : "Your copy is on its way.",
    opts.pdfUrl ? `Read it online: ${opts.pdfUrl}` : "",
    "",
    "How to use it: Don't try to do all ten at once. Pick one. Do it for 7 days. Then add the next.",
    "",
    `Ready for the full system? Book a consultation: ${opts.bookUrl}`,
    "",
    "— Aditya Kumar Upadhyay",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `Your copy of ${resource.title} is here`,
    html: renderEmail({
      preheader: `${resource.title} — attached, ready to read.`,
      bodyHtml,
    }),
    text,
  };
}

/** Admin notification — a new lead landed, with its source + metadata. */
export function leadAdminNotification(opts: {
  resource: Resource;
  meta: LeadMeta;
  /** whether the subscriber's delivery email actually went out */
  delivered: boolean;
}): { subject: string; html: string; text: string } {
  const { resource, meta } = opts;
  const email = escapeHtml(meta.email);
  const phoneHref = meta.phone.replace(/[^\d+]/g, "");

  const status = opts.delivered
    ? `<span style="color:#2e7d32;font-weight:600">Delivered ✓</span>`
    : `<span style="color:#b23c17;font-weight:600">Delivery FAILED — follow up manually</span>`;

  const rows: [string, string][] = [
    ["Resource", escapeHtml(resource.title)],
    ["Name", escapeHtml(meta.name)],
    [
      "Phone",
      `<a href="tel:${escapeHtml(phoneHref)}" style="color:#8a6d1f">${escapeHtml(meta.phone)}</a>`,
    ],
    ["Email", `<a href="mailto:${email}" style="color:#8a6d1f">${email}</a>`],
    ["Source", escapeHtml(meta.source)],
    ["Received", `${escapeHtml(istTimestamp(meta.receivedAt))} IST`],
    ["Delivery", status],
  ];
  if (meta.ip) rows.push(["IP", escapeHtml(meta.ip)]);
  if (meta.referer) rows.push(["Referer", escapeHtml(meta.referer)]);
  if (meta.userAgent) rows.push(["Device", escapeHtml(meta.userAgent)]);

  const bodyHtml =
    eyebrow("New lead") +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">New download — ${escapeHtml(resource.title)}</h1>` +
    infoTable(rows) +
    `<p style="margin:0 0 6px">${button(`mailto:${meta.email}`, "Email this lead")}</p>`;

  const text = [
    `New lead — ${resource.title}`,
    `Name: ${meta.name}`,
    `Phone: ${meta.phone}`,
    `Email: ${meta.email}`,
    `Source: ${meta.source}`,
    `Received: ${istTimestamp(meta.receivedAt)} IST`,
    `Delivery: ${opts.delivered ? "Delivered" : "FAILED — follow up manually"}`,
    meta.ip ? `IP: ${meta.ip}` : "",
    meta.referer ? `Referer: ${meta.referer}` : "",
    meta.userAgent ? `Device: ${meta.userAgent}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `New lead — ${resource.title} (${meta.name} · ${meta.phone})`,
    html: renderEmail({ preheader: `New download: ${resource.title}`, bodyHtml }),
    text,
  };
}
