"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { CONSULT_INCLUDES, LEGAL, UPI, upiPayLink } from "@/lib/legal";

/**
 * The payment step — a UPI hand-off dressed as a gateway.
 *
 * Razorpay is not integrated, so there is no hosted checkout to redirect to.
 * This panel does the three things a real gateway does, in the same order:
 *
 *   1. States the amount and what it buys, unambiguously.
 *   2. Hands off to the payer's own app — the `upi://` intent opens PhonePe /
 *      GPay / Paytm with payee, amount and note already filled in. On desktop
 *      that intent has no handler, so the QR leads there instead and the CSS
 *      `order` flips the two: phone gets the button first, desktop the QR.
 *   3. Takes a reference back, so the payment can actually be reconciled.
 *
 * Nothing here verifies anything — no webhook, no signature. Every string in
 * this panel is written to be true under that constraint: the button says
 * "I've Paid", never "Payment successful", and the confirmation downstream
 * says Aditya will verify. Do not soften that into a false guarantee.
 *
 * The payee name is shown next to the ID on purpose. A man about to send money
 * to a stranger's VPA checks the name his app shows him against the name on
 * the page; if they don't match he abandons. UPI.PAYEE_NAME, the QR artwork
 * and the bank account must all agree.
 */

function CopyIcon({ done }: { done: boolean }) {
  return done ? (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden="true">
      <rect
        x={9}
        y={9}
        width={11}
        height={11}
        rx={2.5}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path
        d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function UpiPayPanel({
  payerName,
  reference,
  referenceError,
  onReferenceChange,
  onConfirm,
  confirming,
  confirmFailed,
  whatsAppFallbackHref,
  productLabel = `Transformation Audit · Online via WhatsApp`,
  referenceRequired = true,
}: {
  payerName: string;
  reference: string;
  referenceError?: string;
  onReferenceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  confirming: boolean;
  /** The booking mail failed. Not a validation error — money has moved. */
  confirmFailed: boolean;
  /** Recovery link, pre-filled with his UTR. */
  whatsAppFallbackHref: string;
  /** What the money buys, shown under the amount. Overridable because the ads
      landing page must not name a duration (Transformation Audit brief §1). */
  productLabel?: string;
  /**
   * Whether the UTR must be supplied to confirm. True on /book. False on the
   * ads landing page, where a cold visitor who cannot find the reference in
   * his banking app would otherwise abandon at the very last step.
   *
   * This only changes the LABELLING here — the caller owns validation. Set it
   * to match the caller's rule, or the field will say "required" while the
   * form lets an empty value through (or the reverse, which is worse).
   */
  referenceRequired?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  // `tn` is the note the payer sees in his app and Aditya sees on his
  // statement. Stripped to alphanumerics + spaces and capped — punctuation in
  // a UPI note breaks the intent on some Android handsets.
  const note = `Audit ${payerName}`.replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 30);
  const payHref = upiPayLink(note || "Transformation Audit");

  async function copyId() {
    try {
      await navigator.clipboard.writeText(UPI.ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied (insecure context, Safari without a gesture) — the ID
      // is selectable text right there, so there is nothing to recover from.
    }
  }

  return (
    <div id="pay" className="card card-featured spot scroll-mt-24">
      {/* ---- The amount ---- */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="type-caption text-muted uppercase tracking-[0.12em]">
          Amount to pay
        </p>
        <p className="type-caption text-muted">UPI · PhonePe</p>
      </div>
      <p className="font-display text-gold-grad mt-2 text-[clamp(2.4rem,5vw,3rem)] leading-none">
        {LEGAL.CONSULT_PRICE}
      </p>
      <p className="type-small text-secondary mt-2">{productLabel}</p>

      <div className="gold-line my-6" aria-hidden="true" />

      {/* ---- The hand-off. Phone: button first. Desktop: QR first. ---- */}
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-10">
        {/* QR — sits on white, like the printed thing it is */}
        <div className="order-2 flex flex-col items-center md:order-1">
          <div className="rounded-2xl bg-white p-3">
            {/* unoptimized on purpose: next.config sets formats:["image/webp"],
                so the optimizer would re-encode this lossily and a single
                artefact on a QR module is a code that won't scan. The source
                is a 73KB lossless PNG already sized for this slot — there is
                nothing to gain from optimizing it and a payment to lose.
                (Next 16 also gates `quality` behind an images.qualities
                allowlist, so raising quality instead would 400.) */}
            <Image
              src={UPI.QR_SRC}
              width={UPI.QR_W}
              height={UPI.QR_H}
              unoptimized
              alt={`PhonePe UPI QR code for ${UPI.PAYEE_NAME}. UPI ID ${UPI.ID}.`}
              className="h-auto w-[200px] md:w-[184px]"
            />
          </div>
          <p className="type-caption text-muted mt-3 text-center">
            Scan with any UPI app
          </p>
        </div>

        {/* Actions */}
        <div className="order-1 flex flex-col md:order-2">
          <a href={payHref} className="btn-gold w-full">
            Pay {LEGAL.CONSULT_PRICE} with any UPI app
          </a>
          <p className="type-caption text-muted mt-2.5">
            {/* [review] — honest about where the intent works */}
            Opens PhonePe, Google Pay or Paytm on your phone. On a computer,
            scan the QR instead.
          </p>

          {/* Payee identity — what he is checking against his app */}
          <div className="border-hairline-soft mt-6 border-t pt-5">
            <p className="type-caption text-muted uppercase tracking-[0.12em]">
              Paying
            </p>
            <p className="type-body text-primary mt-1.5">{UPI.PAYEE_NAME}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <code className="border-hairline-soft bg-surface-2 text-primary rounded-lg border px-3 py-2 font-mono text-[0.9375rem]">
                {UPI.ID}
              </code>
              <button
                type="button"
                onClick={copyId}
                className="border-hairline-soft text-secondary hover:text-primary hover:border-hairline-gold inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3 text-[0.875rem] font-medium transition-colors"
              >
                <CopyIcon done={copied} />
                {copied ? "Copied" : "Copy UPI ID"}
              </button>
              {/* announced without stealing focus from the button */}
              <span aria-live="polite" className="sr-only">
                {copied ? "UPI ID copied to clipboard" : ""}
              </span>
            </div>

            <p className="type-caption text-muted mt-3 max-w-[36ch]">
              {/* [review] — anti-fraud check the payer should actually run */}
              Your app should show {UPI.PAYEE_NAME}. If it shows any other name,
              stop and message Aditya.
            </p>
          </div>
        </div>
      </div>

      {/* ---- The reference back ---- */}
      <div className="border-hairline-soft mt-8 border-t pt-7">
        <label htmlFor="bk-upiref" className="field-label">
          UPI reference number
          {!referenceRequired && (
            <span className="text-muted font-normal"> (optional)</span>
          )}
        </label>
        <p id="bk-upiref-hint" className="type-caption text-muted mt-1 mb-2.5">
          {/* [review] */}
          {referenceRequired
            ? "After paying, copy the reference (UTR) from your UPI app so Aditya can match your payment."
            : "If you have it, paste the reference (UTR) from your UPI app — it lets Aditya match your payment straight away. If you can't find it, skip it and send him the screenshot on WhatsApp."}
        </p>
        <input
          id="bk-upiref"
          type="text"
          name="upiReference"
          inputMode="numeric"
          autoComplete="off"
          className="input-dark"
          placeholder="e.g. 412345678901"
          value={reference}
          onChange={onReferenceChange}
          aria-invalid={referenceError ? true : undefined}
          aria-describedby="bk-upiref-hint bk-upiref-error"
        />
        <p id="bk-upiref-error" className="field-error" aria-live="polite">
          {referenceError}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="btn-gold mt-4 min-h-[52px] w-full leading-snug"
          disabled={confirming}
          aria-busy={confirming || undefined}
        >
          {confirming
            ? "Confirming…"
            : `I've Paid ${LEGAL.CONSULT_PRICE} — Confirm My Booking`}
        </button>

        {/* Recovery path. His money is already gone, so this cannot be a bare
            "something went wrong" — it has to hand him a working way to reach
            Aditya with the reference attached. */}
        {confirmFailed && (
          <div
            role="alert"
            className="border-hairline-gold mt-5 rounded-xl border p-4"
            style={{ background: "rgba(201,162,75,0.06)" }}
          >
            <p className="type-small text-primary">
              {/* [review] — no reference to send when the field was left
                  blank, so the ask becomes the screenshot instead */}
              We couldn&apos;t record your booking — but your payment is safe.
              {reference.trim()
                ? " Send Aditya the reference and he'll confirm your slot."
                : " Message Aditya with your payment screenshot and he'll confirm your slot."}
            </p>
            <a
              href={whatsAppFallbackHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-4 w-full"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {reference.trim() ? "Send Aditya My Reference" : "Message Aditya Now"}
            </a>
            <p className="type-caption text-muted mt-3">
              Or try Confirm again — nothing is charged twice.
            </p>
          </div>
        )}
      </div>

      {/* ---- Trust cues ---- */}
      <ul className="type-small text-muted mt-6 grid gap-2">
        <li>
          {/* [review] — true of UPI: it settles bank to bank, we store no card */}
          <span aria-hidden="true">🔒</span> Paid directly to Aditya over UPI. No
          card details are entered or stored on this site.
        </li>
        <li>
          <span aria-hidden="true">📱</span> Aditya verifies the payment and
          confirms your slot on WhatsApp within 24h.
        </li>
        <li>
          {/* [review] risk-reducer. NOT a refund promise: the audit fee is not
              refundable once the call happens (/refund §1). The credit is the
              honest reassurance here — the fee comes off the program price —
              and the refund link stays for the coaching terms behind it. */}
          <span aria-hidden="true">↩︎</span> {CONSULT_INCLUDES.CREDIT}{" "}
          <Link
            href="/refund"
            className="underline underline-offset-2 hover:text-secondary"
          >
            Refund policy
          </Link>
          .
        </li>
      </ul>
    </div>
  );
}
