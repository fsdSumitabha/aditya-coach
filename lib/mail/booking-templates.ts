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
  /** Optional: the ads landing page collects WhatsApp only, no email. */
  email: string;
  phone: string;
  /** Optional: the ads landing page does not ask for it. */
  age: string;
  goal: string;
  /** Which page took the booking, e.g. "transformation-audit-landing". */
  source?: string;
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

/**
 * Only the rows that carry a value. Email and age are optional — the ads
 * landing page collects name, WhatsApp and goal and nothing else — and an
 * empty "Email: —" row on a booking mail reads as a bug, not as a fact.
 */
function contactRows(s: BookingSubmission): [string, string][] {
  const tel = s.phone.replace(/\s+/g, "");
  const rows: [string, string][] = [
    ["Name", escapeHtml(sanitizeHeader(s.name))],
    [
      "WhatsApp",
      `<a href="https://wa.me/${escapeHtml(tel.replace(/^\+/, ""))}" style="color:#8a6d1f">${escapeHtml(s.phone)}</a>`,
    ],
  ];
  if (s.email) {
    rows.push([
      "Email",
      `<a href="mailto:${escapeHtml(s.email)}" style="color:#8a6d1f">${escapeHtml(s.email)}</a>`,
    ]);
  }
  if (s.age) rows.push(["Age", escapeHtml(s.age)]);
  rows.push(["Main goal", escapeHtml(s.goal)]);
  if (s.source) rows.push(["Came from", escapeHtml(sanitizeHeader(s.source))]);
  return rows;
}

/** Stage 1 — he says he has paid. Verify the UTR before confirming a slot. */
export function bookingNotification(s: BookingSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const name = sanitizeHeader(s.name);
  const utr = sanitizeHeader(s.upiReference);

  // The reference is optional on the ads landing page, so both mails have to
  // read correctly. With a UTR, it leads the subject — that is the string
  // Aditya searches his inbox for after spotting the credit in PhonePe.
  // Without one, the subject must SAY so rather than print "UTR ·": a booking
  // with no reference needs different handling, and he has to see that in the
  // inbox list, before he opens anything.
  const subject = utr
    ? `UTR ${utr} · ${s.amountLabel} audit booking · ${name}`
    : `NO UTR · ${s.amountLabel} audit booking · ${name}`;

  const callout = utr
    ? calloutBox(
        eyebrow("Check this against PhonePe first") +
          `<p style="margin:0 0 6px;font-size:20px;font-weight:700;letter-spacing:.02em">${escapeHtml(utr)}</p>` +
          `<p style="margin:0;font-size:14px;color:#6c6c76">${escapeHtml(s.amountLabel)} to ${escapeHtml(s.upiId)} · ` +
          `${escapeHtml(istTimestamp(s.submittedAt))} IST</p>`,
      ) +
      `<p style="margin:0 0 18px;font-size:14px;color:#6c6c76">` +
      `He entered this reference himself — nothing on the site verified it. Match it ` +
      `in PhonePe before you confirm his slot.</p>`
    : calloutBox(
        eyebrow("No UPI reference given") +
          `<p style="margin:0 0 6px;font-size:17px;font-weight:600">Match this one by hand</p>` +
          `<p style="margin:0;font-size:14px;color:#6c6c76">${escapeHtml(s.amountLabel)} to ${escapeHtml(s.upiId)} · ` +
          `${escapeHtml(istTimestamp(s.submittedAt))} IST</p>`,
      ) +
      `<p style="margin:0 0 18px;font-size:14px;color:#6c6c76">` +
      `He was not required to give a reference. Look for a ${escapeHtml(s.amountLabel)} credit ` +
      `around the time above, or ask him for the screenshot on WhatsApp.</p>`;

  const bodyHtml =
    eyebrow("Transformation Audit · payment claimed") +
    `<h1 style="margin:0 0 20px;font-size:21px;font-weight:600">${escapeHtml(name)} booked an audit</h1>` +
    callout +
    infoTable(contactRows(s)) +
    `<p style="margin:0;font-size:14px;color:#6c6c76">Reply to this email to reach him, or message him on WhatsApp above.</p>`;

  const text = [
    `${name} booked a Transformation Audit.`,
    ``,
    utr ? `UPI REFERENCE (UTR): ${utr}` : `UPI REFERENCE (UTR): not given`,
    `Amount claimed: ${s.amountLabel} to ${s.upiId}`,
    `Submitted: ${istTimestamp(s.submittedAt)} IST`,
    ``,
    ...(utr
      ? [
          `He entered this reference himself — nothing verified it.`,
          `Match it in PhonePe before confirming his slot.`,
        ]
      : [
          `He was not required to give a reference.`,
          `Look for a ${s.amountLabel} credit around the time above, or ask`,
          `him for the screenshot on WhatsApp, before confirming his slot.`,
        ]),
    ``,
    `Name:      ${name}`,
    `WhatsApp:  ${s.phone}`,
    ...(s.email ? [`Email:     ${s.email}`] : []),
    ...(s.age ? [`Age:       ${s.age}`] : []),
    `Main goal: ${s.goal}`,
    ...(s.source ? [`Came from: ${sanitizeHeader(s.source)}`] : []),
  ].join("\n");

  return {
    subject,
    html: renderEmail({
      preheader: utr ? `${s.amountLabel} · UTR ${utr}` : `${s.amountLabel} · no UTR given`,
      bodyHtml,
    }),
    text,
  };
}

/** Stage 2 — the optional answers he gave after paying. */
export function bookingIntakeNotification(
  s: BookingSubmission,
  intake: BookingIntake,
): { subject: string; html: string; text: string } {
  const name = sanitizeHeader(s.name);
  const utr = sanitizeHeader(s.upiReference);
  // Only /book reaches this stage today, and it always has a UTR and an email.
  // Both are optional on the type, so neither is assumed here.
  const subject = utr
    ? `Pre-call notes · ${name} · UTR ${utr}`
    : `Pre-call notes · ${name}`;
  const idLine = [utr ? `Booking UTR ${utr}` : `No booking UTR`, s.email]
    .filter(Boolean)
    .join(" · ");

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
    `<p style="margin:0 0 20px;font-size:14px;color:#6c6c76">${escapeHtml(idLine)}</p>` +
    (answered.length > 0
      ? answered
          .map(
            ([label, value]) =>
              calloutBox(eyebrow(label) + paragraphs(value)),
          )
          .join("")
      : `<p style="margin:0 0 18px">He skipped every question.</p>`);

  const text = [
    `${name} — pre-call notes (${idLine})`,
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
