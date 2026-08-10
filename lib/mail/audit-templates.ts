import "server-only";

import {
  renderEmail,
  eyebrow,
  infoTable,
  calloutBox,
  button,
  escapeHtml,
  sanitizeHeader,
  istTimestamp,
} from "./shell";

/**
 * /audit submission mail. The PDF is the payload — this body is just the
 * cover note that tells the coach who it is from and how to reach them.
 */

export type AuditSubmission = {
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  goals: string[];
  fileName: string;
  /** ISO timestamp, rendered in IST for the coach's copy. */
  submittedAt: string;
};

export function auditNotification(submission: AuditSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const name = sanitizeHeader(submission.fullName);
  const goals = submission.goals.filter(Boolean);

  const rows: [string, string][] = [
    ["Name", escapeHtml(name)],
    [
      "Email",
      `<a href="mailto:${escapeHtml(submission.email)}" style="color:#8a6d1f">${escapeHtml(submission.email)}</a>`,
    ],
  ];
  if (submission.phone) {
    rows.push([
      "Phone",
      `<a href="tel:${escapeHtml(submission.phone.replace(/\s+/g, ""))}" style="color:#8a6d1f">${escapeHtml(submission.phone)}</a>`,
    ]);
  }
  if (submission.instagram) rows.push(["Instagram", escapeHtml(submission.instagram)]);
  rows.push(["Received", `${escapeHtml(istTimestamp(submission.submittedAt))} IST`]);

  const bodyHtml =
    eyebrow("Transformation Audit") +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">${escapeHtml(name)} completed the audit</h1>` +
    infoTable(rows) +
    (goals.length > 0
      ? calloutBox(
          eyebrow("What he came for") +
            `<p style="margin:0">${escapeHtml(goals.join(" · "))}</p>`,
        )
      : "") +
    `<p style="margin:0 0 18px;color:#6c6c76;font-size:14px">` +
    `The full audit is attached as <strong>${escapeHtml(submission.fileName)}</strong>, ` +
    `with every answer, the signature and the photo.</p>` +
    `<p style="margin:22px 0 0">${button(`mailto:${submission.email}`, `Reply to ${name}`)}</p>`;

  const text = [
    `${name} completed the Transformation Audit.`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : "",
    submission.instagram ? `Instagram: ${submission.instagram}` : "",
    goals.length > 0 ? `Goals: ${goals.join(", ")}` : "",
    `Received: ${istTimestamp(submission.submittedAt)} IST`,
    "",
    `The full audit is attached as ${submission.fileName}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `Transformation Audit — ${name}`,
    html: renderEmail({
      preheader: `${name} completed the Transformation Audit. PDF attached.`,
      bodyHtml,
    }),
    text,
  };
}
