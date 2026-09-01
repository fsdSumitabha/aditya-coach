import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { CONSULT_INCLUDES, DELIVERY, LEGAL, UPI } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Pricing | Transformation Audit ${LEGAL.CONSULT_PRICE} & Coaching`,
  description: `The Transformation Audit is ${LEGAL.CONSULT_PRICE} — the full amount, nothing added at checkout. Coaching program pricing is quoted to you in writing after the audit, before you pay.`,
  path: "/pricing",
});

/*
 * RAZORPAY NOTE: merchant review expects a public page stating what is sold,
 * the price, the currency, and that nothing is charged without prior
 * disclosure. Positioning rule (AGENTS.md) holds: only the audit price is ever
 * public — program prices are quoted after the audit and must never carry a
 * number on this site. This page states that policy explicitly rather than
 * leaving pricing undisclosed, which is what a reviewer flags.
 *
 * The price string comes from LEGAL.CONSULT_PRICE. Never hardcode it.
 *
 * PAYMENT METHOD: Razorpay is NOT integrated. §6 describes the live flow —
 * manual UPI to Aditya's PhonePe (lib/legal.ts UPI), reconciled by hand against
 * the UTR submitted on /book. Keep this page and components/book/UpiPayPanel
 * saying the same thing. When a gateway goes live, §6 and the "outside India"
 * bullet in §5 both change.
 */

const TOC = [
  { id: "audit", label: `Transformation Audit — ${LEGAL.CONSULT_PRICE}` },
  { id: "credited", label: "Your fee is credited against coaching" },
  { id: "programs", label: "Coaching programs — quoted after the audit" },
  { id: "free", label: "Free resources" },
  { id: "currency", label: "Currency, taxes and what you actually pay" },
  { id: "payment", label: "How payment is taken" },
  { id: "after", label: "What happens after you pay" },
  { id: "changes", label: "Price changes" },
  { id: "contact", label: "Questions" },
];

export default function PricingPage() {
  return (
    <LegalShell
      title="Pricing."
      lastUpdated={LEGAL.LAST_UPDATED}
      effectiveDate={LEGAL.EFFECTIVE_DATE}
      toc={TOC}
    >
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* Public pricing disclosure. Price + inclusions come from
          lib/legal.ts (CONSULT_PRICE, CONSULT_INCLUDES). Never hardcode. */}
      <p className="type-lead text-secondary">
        {/* [review] */}
        One price is public: the Transformation Audit. Everything after it is
        built around you, so it is quoted to you personally — in writing, before
        you pay anything.
      </p>

      <h2 id="audit" className="scroll-mt-28">
        1. Transformation Audit — {LEGAL.CONSULT_PRICE}
      </h2>
      <p>
        45 minutes, one-to-one, online over WhatsApp. We audit your lifestyle,
        health, fitness and habits, and you leave knowing what to fix first.
      </p>
      <p>
        <strong>
          {LEGAL.CONSULT_PRICE} is the full amount you pay.
        </strong>{" "}
        No booking fee, no service charge, no convenience fee, nothing added at
        checkout.
      </p>
      <p>What that fee includes:</p>
      <ul>
        <li>The 45-minute audit call itself.</li>
        <li>{CONSULT_INCLUDES.GIFT_CARD}</li>
        <li>{CONSULT_INCLUDES.BLUEPRINT}</li>
      </ul>
      <p>
        <Link href="/book">Book Your Consultation</Link>
      </p>

      <h2 id="credited" className="scroll-mt-28">
        2. Your fee is credited against coaching
      </h2>
      <p>{CONSULT_INCLUDES.CREDIT}</p>
      <p className="type-small text-muted">
        The credit applies once, against the price of the coaching program you
        join, and it is applied at the time you join. It is not a cash refund —
        refunds are governed by the{" "}
        <Link href="/refund">Refund Policy</Link>.
      </p>

      <h2 id="programs" className="scroll-mt-28">
        3. Coaching programs — quoted after the audit
      </h2>
      <p>
        Three coaching programs are offered:{" "}
        <strong>Lifestyle Coaching</strong>,{" "}
        <strong>Personality &amp; Presence Coaching</strong> and{" "}
        <strong>Complete Transformation</strong>. See{" "}
        <Link href="/coaching">Coaching</Link> for what each one covers.
      </p>
      <p>
        These carry no public price, and that is deliberate. Each program is
        scoped to the man in front of me — where he is starting, how long the
        work takes, and how much direct access he needs. Quoting a number before
        the audit would be quoting a number for a program that has not been
        designed yet.
      </p>
      <p>How pricing works instead:</p>
      <ul>
        <li>
          You take the {LEGAL.CONSULT_PRICE} Transformation Audit. Every program
          starts there.
        </li>
        <li>
          {/* [review] confirm billing term + auto-renew position with owner */}
          You are given the exact price, the billing term and what is included,{" "}
          <strong>in writing, before you pay anything.</strong>
        </li>
        <li>
          Nothing is charged to you without that written confirmation and your
          agreement. No automatic upgrades, no charges you did not approve.
        </li>
      </ul>

      <h2 id="free" className="scroll-mt-28">
        4. Free resources
      </h2>
      <p>
        The Lifestyle Blueprint, the Fat Loss Training Split, the Personality
        Audit Blueprint and the calorie calculator on{" "}
        <Link href="/tools">Tools</Link> cost nothing. You give an email
        address, the file is sent to it. No card, no charge, ever.
      </p>

      <h2 id="currency" className="scroll-mt-28">
        5. Currency, taxes and what you actually pay
      </h2>
      <ul>
        <li>
          <strong>Currency:</strong> all prices are in Indian Rupees (INR) and
          all payments are taken in INR.
        </li>
        <li>
          {/* [review] BLOCKING FOR RAZORPAY: confirm GST registration status.
              If registered, state the GSTIN and whether the price is inclusive
              of GST. If not registered, this line stays as-is. */}
          <strong>Taxes:</strong> the price shown is the total payable. Any tax
          applicable is already included in it — nothing is added on top at
          checkout.
        </li>
        <li>
          {/* [review] — UPI is domestic-only, so this replaces the old
              foreign-card line. Revisit if a card gateway goes live. */}
          <strong>Paying from outside India:</strong> payment is taken over UPI,
          which needs an Indian bank account. If you are abroad and cannot pay
          by UPI, message me on{" "}
          <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a> before booking and we
          will arrange it.
        </li>
        <li>
          <strong>No hidden costs:</strong> no setup fee, no cancellation fee,
          no charge for re-sending a file you already paid for.
        </li>
      </ul>

      <h2 id="payment" className="scroll-mt-28">
        6. How payment is taken
      </h2>
      <p>
        Payment is taken by <strong>UPI</strong>, direct to {UPI.PAYEE_NAME}. On
        the <Link href="/book">booking page</Link> you get the amount, the UPI
        ID (<code>{UPI.ID}</code>) and a QR code. Pay from any UPI app —
        PhonePe, Google Pay, Paytm, or your own bank&apos;s app — then paste the
        UPI reference number (UTR) from your app to confirm the booking.
      </p>
      <ul>
        <li>
          <strong>No card details are entered or stored on this site.</strong>{" "}
          There is no card form here. No card number, UPI PIN or banking
          credential ever reaches this website — UPI settles bank to bank,
          inside your own app.
        </li>
        <li>
          <strong>Check the payee name.</strong> Your UPI app should show{" "}
          {UPI.PAYEE_NAME} before you confirm. If it shows any other name, stop
          and message Aditya.
        </li>
        <li>
          <strong>Payment is verified by hand.</strong> Aditya matches your
          reference against the payment received and confirms your slot on
          WhatsApp within {DELIVERY.CONFIRM_WINDOW}. Submitting the booking form
          is a booking request, not an automatic confirmation.
        </li>
        <li>
          <strong>Nothing recurring.</strong> A UPI payment is a one-time
          transfer you approve in your own app. No mandate, no auto-debit, no
          card kept on file — nothing can be charged to you again unless you
          start it yourself.
        </li>
      </ul>
      <p>
        {/* [review] */}
        The <Link href="/terms">Terms of Service</Link> govern the purchase, and
        how your booking details are handled is set out in the{" "}
        <Link href="/privacy">Privacy Policy</Link>. If your payment goes out
        but the booking does not come back, message Aditya on{" "}
        <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a> with the reference — no
        payment is lost, and nothing is charged twice.
      </p>

      <h2 id="after" className="scroll-mt-28">
        7. What happens after you pay
      </h2>
      <p>
        You get a confirmation on WhatsApp within {DELIVERY.CONFIRM_WINDOW} and
        your slot is fixed with you directly. Full delivery timelines are in the{" "}
        <Link href="/shipping">Shipping &amp; Delivery Policy</Link>. Nothing is
        posted or couriered — everything is delivered online.
      </p>

      <h2 id="changes" className="scroll-mt-28">
        8. Price changes
      </h2>
      <p>
        Prices may change. The price shown on this page and at checkout at the
        moment you pay is the price that applies to you — a later change is
        never applied backwards to a session or program you have already paid
        for.
      </p>

      <h2 id="contact" className="scroll-mt-28">
        9. Questions
      </h2>
      <p>
        Anything about price you want answered before you pay? Email{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a>. Ask first,
        pay second.
      </p>
      <p className="type-small text-muted">
        {LEGAL.BUSINESS_NAME} · {LEGAL.LEGAL_BASIS_NOTE} ·{" "}
        {LEGAL.GRIEVANCE_ADDRESS}
      </p>
      {/* END TEMPLATE */}

      <p className="mt-12">
        <Link
          href="/"
          className="type-small text-secondary hover:text-primary transition-colors inline-flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          ← Back to home
        </Link>
      </p>
    </LegalShell>
  );
}
