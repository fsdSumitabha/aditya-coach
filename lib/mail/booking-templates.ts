import "server-only";

import {
  calloutBox,
  escapeHtml,
  eyebrow,
  infoTable,
  istTimestamp,
  paragraphs,
  renderEmail,
  sanitizeHeader,
} from "./shell";

/**
 * /book notification emails — the ONLY record a booking leaves.
 *
 * There is no CRM and no payment gateway. A man pays over UPI straight into
 * Aditya's PhonePe, and the money arrives with nothing attached to it but a
 * UTR. This email is what turns that anonymous ₹999 into a named booking, so
 * two things matter more than looks:
 *
 *   1. The UTR is in the SUBJECT LINE. Aditya reads a UTR off his PhonePe
 *      statement, searches his inbox for it, and lands on this mail.
 *   2. Reply-To is the payer, so hitting Reply answers the man, not the
 *      mailbox.
 *
 * Two stages, both sent to the same address:
 *   "paid"   — fired the moment he claims payment. Critical: if this is lost,
 *              the booking is lost. Carries everything needed to confirm him.
 *   "intake" — the optional pre-call answers, sent afterwards. Nice to have;
 *              losing it costs a few questions on the call, not a booking.
 *
 * NOTHING HERE IS VERIFIED. The wording says "claims to have paid" on purpose
 * — Aditya checks the UTR against PhonePe before the slot is real. Do not
 * soften that into "payment received".
 */

export type BookingSubmission = {
  name: string;
  email: string;
  phone: string;
  age: string;
  goal: string;
  /** UPI reference (UTR) the payer copied out of his app. Unverified. */
  upiReference: string;
  /** Server-side amount — never taken from the client. */
  amountLabel: string;
  upiId: string;
  submittedAt: string;
};

export type BookingIntake = {
  occupation: string;
  lifestyle: string;
  training: string;
  blocker: string;
  success: string;
};

function contactRows(s: BookingSubmission): [string, string][] {
  const tel = s.phone.replace(/\s+/g, "");
  return [
    ["Name", escapeHtml(sanitizeHeader(s.name))],
    [
      "WhatsApp",
      `<a href="https://wa.me/${escapeHtml(tel.replace(/^\+/, ""))}" style="color:#8a6d1f">${escapeHtml(s.phone)}</a>`,
    ],
    [
      "Email",
      `<a href="mailto:${escapeHtml(s.email)}" style="color:#8a6d1f">${escapeHtml(s.email)}</a>`,
    ],
    ["Age", escapeHtml(s.age)],
    ["Main goal", escapeHtml(s.goal)],
  ];
}

/** Stage 1 — he says he has paid. Verify the UTR before confirming a slot. */
export function bookingNotification(s: BookingSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const name = sanitizeHeader(s.name);
  const utr = sanitizeHeader(s.upiReference);

  // UTR first in the subject: this is what Aditya searches his inbox for after
  // spotting the credit in PhonePe.
  const subject = `UTR ${utr} · ${s.amountLabel} audit booking · ${name}`;

  const bodyHtml =
    eyebrow("Transformation Audit · payment claimed") +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">${escapeHtml(name)} booked an audit</h1>` +
    calloutBox(
      eyebrow("Check this against PhonePe first") +
        `<p style="margin:0 0 6px;font-size:20px;font-weight:700;letter-spacing:.02em">${escapeHtml(utr)}</p>` +
        `<p style="margin:0;font-size:14px;color:#6c6c76">${escapeHtml(s.amountLabel)} to ${escapeHtml(s.upiId)} · ` +
        `${escapeHtml(istTimestamp(s.submittedAt))} IST</p>`,
    ) +
    `<p style="margin:0 0 18px;font-size:14px;color:#6c6c76">` +
    `He entered this reference himself — nothing on the site verified it. Match it ` +
    `in PhonePe before you confirm his slot.</p>` +
    infoTable(contactRows(s)) +
    `<p style="margin:0;font-size:14px;color:#6c6c76">Reply to this email to reach him, or message him on WhatsApp above.</p>`;

  const text = [
    `${name} booked a Transformation Audit.`,
    ``,
    `UPI REFERENCE (UTR): ${utr}`,
    `Amount claimed: ${s.amountLabel} to ${s.upiId}`,
    `Submitted: ${istTimestamp(s.submittedAt)} IST`,
    ``,
    `He entered this reference himself — nothing verified it.`,
    `Match it in PhonePe before confirming his slot.`,
    ``,
    `Name:      ${name}`,
    `WhatsApp:  ${s.phone}`,
    `Email:     ${s.email}`,
    `Age:       ${s.age}`,
    `Main goal: ${s.goal}`,
  ].join("\n");

  return { subject, html: renderEmail({ preheader: `${s.amountLabel} · UTR ${utr}`, bodyHtml }), text };
}

/** Stage 2 — the optional answers he gave after paying. */
export function bookingIntakeNotification(
  s: BookingSubmission,
  intake: BookingIntake,
): { subject: string; html: string; text: string } {
  const name = sanitizeHeader(s.name);
  const utr = sanitizeHeader(s.upiReference);
  const subject = `Pre-call notes · ${name} · UTR ${utr}`;

  const fields: [string, string][] = [
    ["What he does", intake.occupation],
    ["Current lifestyle", intake.lifestyle],
    ["Current training", intake.training],
    ["What's stopped him", intake.blocker],
    ["Success in 3–6 months", intake.success],
  ];
  const answered = fields.filter(([, v]) => v.trim().length > 0);

  const bodyHtml =
    eyebrow("Transformation Audit · before the call") +
    `<h1 style="margin:0 0 8px;font-size:21px;font-weight:600">${escapeHtml(name)} filled in his pre-call notes</h1>` +
    `<p style="margin:0 0 20px;font-size:14px;color:#6c6c76">Booking UTR ${escapeHtml(utr)} · ${escapeHtml(s.email)}</p>` +
    (answered.length > 0
      ? answered
          .map(
            ([label, value]) =>
              calloutBox(eyebrow(label) + paragraphs(value)),
          )
          .join("")
      : `<p style="margin:0 0 18px">He skipped every question.</p>`);

  const text = [
    `${name} — pre-call notes (booking UTR ${utr})`,
    ``,
    ...(answered.length > 0
      ? answered.flatMap(([label, value]) => [`${label}:`, value, ``])
      : ["He skipped every question."]),
  ].join("\n");

  return {
    subject,
    html: renderEmail({ preheader: `Pre-call notes from ${name}`, bodyHtml }),
    text,
  };
}
