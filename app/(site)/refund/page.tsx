import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { CONSULT_INCLUDES, LEGAL, REFUND, UPI } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Cancellation & Refund Policy | Coaching and the Transformation Audit",
  description: `Coaching carries a ${REFUND.COACHING_SHARE} refund of your program price after ${REFUND.QUALIFYING_PERIOD} if you do not feel better about yourself. The ${LEGAL.CONSULT_PRICE} audit fee is credited against your program, not refunded.`,
  path: "/refund",
});

/*
 * CONFIRMED 1 Sep 2026 (Karthik, relaying Aditya). This page previously
 * promised a full refund of the audit fee under a "clarity guarantee". That
 * promise was withdrawn on 23 Jul 2026 and the copy was frozen until the
 * replacement amount was confirmed. It now is, so the page is rewritten to the
 * real model:
 *
 *   1. The audit fee (LEGAL.CONSULT_PRICE) is NOT refunded once the call
 *      happens. It comes back as a credit against the program price instead —
 *      CONSULT_INCLUDES.CREDIT. Never call the audit refundable.
 *   2. Coaching carries a REFUND.COACHING_SHARE refund of the FULL program
 *      price after REFUND.QUALIFYING_PERIOD. The share attaches to the price
 *      the program was quoted at, not to the reduced amount paid after the
 *      credit. §3 spells that out; do not shorten it into "half of what you
 *      paid", which is a different and smaller number.
 *
 * Every window and percentage comes from REFUND in lib/legal.ts. Never
 * hardcode one here. Program prices carry no number anywhere on this site
 * (AGENTS.md), which is why §3 is written in words rather than as a sum.
 *
 * Payment is manual UPI — Razorpay is not integrated — so refunds go back over
 * UPI, not through a gateway. Keep §5 aligned with /pricing §6.
 */

const TOC = [
  { id: "audit", label: "The audit fee — credited, not refunded" },
  { id: "coaching", label: `Coaching — ${REFUND.COACHING_SHARE} back after ${REFUND.QUALIFYING_PERIOD}` },
  { id: "how-it-adds-up", label: "How the two fit together" },
  { id: "request", label: "How to request a refund" },
  { id: "method-timeline", label: "Refund method and timeline" },
  { id: "cancellation", label: "Cancelling or moving your audit" },
  { id: "plans", label: "Written plans" },
  { id: "fair-use", label: "Fair use of this policy" },
  { id: "contact", label: "Questions" },
];

export default function RefundPage() {
  return (
    <LegalShell
      title="Cancellation & Refund Policy."
      lastUpdated={LEGAL.LAST_UPDATED}
      effectiveDate={LEGAL.EFFECTIVE_DATE}
      toc={TOC}
    >
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* Amounts, windows and percentages come from REFUND / CONSULT_INCLUDES
          in lib/legal.ts. Never hardcode one in this file. */}
      <p className="type-lead text-secondary">
        {/* [review] */}
        The audit fee is credited against your coaching, not refunded. The
        coaching itself carries a real one: {REFUND.COACHING_SHARE} of your
        program price back after {REFUND.QUALIFYING_PERIOD}, if you do not feel
        better about yourself. Both are set out below, in full.
      </p>

      <h2 id="audit" className="scroll-mt-28">
        1. The {LEGAL.CONSULT_PRICE} audit fee — credited, not refunded
      </h2>
      <p>
        The Transformation Audit is a delivered service. Once the call has
        happened, the {LEGAL.CONSULT_PRICE} is not refundable — you were given
        the assessment, the order of changes to make, and the material that
        comes with it.
      </p>
      <p>
        {/* [review] */}
        It does not disappear either. {CONSULT_INCLUDES.CREDIT}
      </p>
      <p>
        So the fee is never money you lose by continuing. It is the first
        payment toward your program, made before the program exists. What
        happens if you cancel <em>before</em> the call is a different thing
        entirely, and is covered in section 6.
      </p>

      <h2 id="coaching" className="scroll-mt-28">
        2. Coaching — {REFUND.COACHING_SHARE} back after{" "}
        {REFUND.QUALIFYING_PERIOD}
      </h2>
      <p>
        Every coaching program — <strong>Lifestyle Coaching</strong>,{" "}
        <strong>Personality &amp; Presence Coaching</strong> and the{" "}
        <strong>Complete Transformation</strong> — carries the same refund.
      </p>
      <p>
        <strong>
          Do {REFUND.QUALIFYING_PERIOD} of the work and if you do not feel more
          confident, or better about yourself, you get {REFUND.COACHING_SHARE}{" "}
          of your program price back.
        </strong>{" "}
        Not a credit. Money, returned to the account you paid from.
      </p>
      <ul>
        <li>
          <strong>When it opens:</strong> after {REFUND.QUALIFYING_PERIOD} of
          coaching. Not before — a month is the minimum honest test of the
          system, and asking earlier means the work has not been done yet.
        </li>
        <li>
          {/* [review] claim window — confirm with owner */}
          <strong>When to claim:</strong> within{" "}
          <strong>{REFUND.CLAIM_WINDOW}</strong> of that first month ending.
        </li>
        <li>
          <strong>What qualifies you:</strong> you were in the program for the
          full month, you attended your calls, and you followed what you were
          given. The refund is for a system that did not work for you, not for a
          month you did not turn up to.
        </li>
        <li>
          <strong>What happens next:</strong> coaching ends when the refund is
          issued. You keep every plan and document already delivered to you.
        </li>
      </ul>
      <p className="type-small text-muted">
        This is a refund of a fee, not a guarantee of a physical result. Results
        depend on the work you put in — see the{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>

      <h2 id="how-it-adds-up" className="scroll-mt-28">
        3. How the two fit together
      </h2>
      <p>
        {/* [review] — the one calculation on this page that must not be
            paraphrased loosely. See the note at the top of this file. */}
        Two separate things happen to your money, in this order:
      </p>
      <ol>
        <li>
          <strong>You pay {LEGAL.CONSULT_PRICE} for the audit.</strong> After
          the call, you are quoted a price for the coaching program that fits
          you — in writing, before you pay anything further. See{" "}
          <Link href="/pricing">Pricing</Link>.
        </li>
        <li>
          <strong>You join, and the audit fee comes off that price.</strong> The{" "}
          {LEGAL.CONSULT_PRICE} is deducted from the program price as a flat
          discount, so the amount you actually transfer is the quoted price
          minus the fee you have already paid.
        </li>
        <li>
          <strong>
            The {REFUND.COACHING_SHARE} refund is calculated on the full quoted
            program price
          </strong>{" "}
          — the price before your audit fee was taken off, not the reduced
          amount you transferred. Your {LEGAL.CONSULT_PRICE} counts toward the
          program in both directions: it lowers what you pay to join, and it
          still sits inside the figure the refund is worked out from.
        </li>
      </ol>
      <p className="type-small text-muted">
        The exact program price, the amount payable after the credit, and the{" "}
        {REFUND.COACHING_SHARE} figure that follows from it are all confirmed to
        you in writing before you pay. Nothing here is worked out after the
        fact.
      </p>

      <h2 id="request" className="scroll-mt-28">
        4. How to request a refund
      </h2>
      <div className="card flex flex-col gap-4" style={{ padding: 24 }}>
        <p>
          <strong>Step 1 — Ask.</strong> Email{" "}
          <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
          message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a>, within
          the window in section 2.
        </p>
        <p>
          <strong>Step 2 — Tell me what did not change.</strong> A couple of
          honest lines. It is not a test you can fail — it is how the system
          gets better.
        </p>
        <p>
          {/* [review] acknowledgement window — confirm with owner */}
          <strong>Step 3 — I confirm.</strong> Your request is acknowledged
          within <strong>{REFUND.ACK_WINDOW}</strong>.
        </p>
        <p>
          <strong>Step 4 — The money goes back.</strong> To the same account it
          came from, on the timeline below.
        </p>
      </div>

      <h2 id="method-timeline" className="scroll-mt-28">
        5. Refund method and timeline
      </h2>
      <ul>
        <li>
          {/* [review] — matches the manual UPI flow described on /pricing §6.
              Update both together if a gateway goes live. */}
          <strong>Method:</strong> payments are taken over UPI, so refunds go
          back the same way — to the UPI ID or bank account the payment came
          from. I cannot refund to a different account, so tell me if that
          account has since closed.
        </li>
        <li>
          {/* [review] initiation window — confirm with owner */}
          <strong>My side:</strong> once approved, the refund is sent within{" "}
          <strong>{REFUND.INITIATE_WINDOW}</strong>.
        </li>
        <li>
          {/* [review] bank-side window — confirm with owner */}
          <strong>Bank side:</strong> UPI transfers usually land the same day.
          If your bank routes it as a reversal instead, allow{" "}
          <strong>{REFUND.BANK_WINDOW}</strong>.
        </li>
        <li>
          You get confirmation, with the reference, the moment it is sent.
        </li>
        <li>
          <strong>No deductions.</strong> Nothing is held back for processing,
          admin or transfer charges.
        </li>
      </ul>

      <h2 id="cancellation" className="scroll-mt-28">
        6. Cancelling or moving your audit
      </h2>
      <ul>
        <li>
          <strong>Rescheduling:</strong> give at least{" "}
          <strong>{REFUND.CANCEL_NOTICE}</strong> notice on WhatsApp and your
          slot moves, at no extra cost.
        </li>
        <li>
          <strong>Cancelling before the call:</strong> cancel at least{" "}
          <strong>{REFUND.CANCEL_NOTICE}</strong> before your booked slot and
          you choose — the {LEGAL.CONSULT_PRICE} back in full, or held as credit
          for a later date. Nothing has been delivered yet, so nothing is
          withheld.
        </li>
        <li>
          <strong>No-shows:</strong> if you do not attend and gave no notice,
          the session counts as delivered and the fee stands. Message me and it
          gets sorted fairly the first time it happens.
        </li>
        <li>
          <strong>If I move the call:</strong> you get a new slot at your
          convenience, or the full {LEGAL.CONSULT_PRICE} back. Your choice.
        </li>
      </ul>

      <h2 id="plans" className="scroll-mt-28">
        7. Written plans
      </h2>
      <p>
        {/* [confirm with owner — review] */}
        Personalised written plans — lifestyle, fat loss and training, nutrition
        — are built for one person and delivered as a finished document. Once
        work on your plan has started, it is{" "}
        <strong>not refundable</strong>. The{" "}
        {REFUND.COACHING_SHARE} refund in section 2 applies to coaching
        programs, not to one-off written plans.
      </p>
      <p>
        If a plan is never delivered to you, you are refunded in full. Delivery
        timelines are on the{" "}
        <Link href="/shipping">Shipping &amp; Delivery Policy</Link>.
      </p>

      <h2 id="fair-use" className="scroll-mt-28">
        8. Fair use of this policy
      </h2>
      <p>
        This refund exists because the work stands behind itself. It is not
        cover for a month you did not show up for, calls you did not attend, or
        a plan you never opened. Do the work, and if it did not move you, the{" "}
        {REFUND.COACHING_SHARE} is yours without argument.
      </p>
      <p>
        Nothing in this policy takes away any right you have under Indian
        consumer law.
      </p>

      <h2 id="contact" className="scroll-mt-28">
        9. Questions
      </h2>
      <p>
        Ask before you pay, not after. Email{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a>. This policy
        forms part of the <Link href="/terms">Terms of Service</Link>, and how
        payment is taken is set out on <Link href="/pricing">Pricing</Link>.
      </p>
      <p className="type-small text-muted">
        Payments and refunds are made to and from {UPI.PAYEE_NAME} ·{" "}
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
