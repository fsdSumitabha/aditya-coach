import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Refund Policy | Consultations & Coaching",
  description: `Our refund policy for the ${LEGAL.CONSULT_PRICE} consultation and monthly coaching. Clear terms, no surprises.`,
  path: "/refund",
});

/*
 * ALIGNMENT NOTE (spec 3.2): the on-page promise around the discovery
 * consultation is "You leave with complete clarity." This policy must honor
 * that exact promise — the consultation fee is refundable if you leave
 * without clarity. Keep the guarantee wording consistent with whatever the
 * /book page states; if /book copy changes, update this in lockstep.
 * [Confirm the guarantee window and "clarity" definition with the owner — review]
 */

const TOC = [
  { id: "consultation", label: `The ${LEGAL.CONSULT_PRICE} discovery consultation — clarity guarantee` },
  { id: "how", label: "How, when and where to request a refund" },
  { id: "method-timeline", label: "Refund method and timeline" },
  { id: "reschedule", label: "Rescheduling and cancellation" },
  { id: "coaching", label: "Monthly Coaching and Online Plans" },
  { id: "exceptions", label: "Fair use of this policy" },
  { id: "contact", label: "Questions" },
];

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy." lastUpdated={LEGAL.LAST_UPDATED} toc={TOC}>
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* Refund policy matching the on-page "leave with complete clarity"
          promise. Confirm timelines, method, and the clarity-guarantee window
          with the owner. Constants live in lib/legal.ts. */}
      <p className="type-lead text-secondary">
        Clear terms. No surprises. I stand behind the discovery consultation —
        if you finish it without real clarity on what to change and in what
        order, you get your money back. Here&apos;s exactly how that works.
      </p>

      <h2 id="consultation" className="scroll-mt-28">
        1. The {LEGAL.CONSULT_PRICE} discovery consultation — clarity guarantee
      </h2>
      <p>
        The consultation exists to give you one thing:{" "}
        <strong>complete clarity</strong> on your lifestyle, your health and the
        exact order of changes to make. That&apos;s the promise.
      </p>
      <p>
        If you attend your full {LEGAL.CONSULT_PRICE} consultation, engage
        honestly, and still leave{" "}
        <strong>
          without that clarity, I&apos;ll refund the {LEGAL.CONSULT_PRICE} in
          full.
        </strong>{" "}
        No hard feelings. I only want your money if I earned it.
      </p>
      <ul>
        <li>
          <strong>Who qualifies:</strong> you attended the full session and
          answered the intake honestly.
        </li>
        <li>
          {/* [review] guarantee window — confirm with owner */}
          <strong>When to ask:</strong> within <strong>48 hours</strong> of your
          consultation.
        </li>
        <li>
          <strong>What you&apos;ll be asked:</strong> a quick note on what
          stayed unclear — so I can genuinely improve, and so the guarantee
          stays fair to both of us.
        </li>
      </ul>
      <p className="type-small text-muted">
        This guarantee covers the discovery consultation fee only. It is not a
        guarantee of any physical result — results depend on the work you put in
        afterward (see our <Link href="/terms">Terms</Link>).
      </p>

      <h2 id="how" className="scroll-mt-28">
        2. How, when and where to request a refund
      </h2>
      <div className="card flex flex-col gap-4" style={{ padding: 24 }}>
        <p>
          <strong>Step 1 — Reach out.</strong> Email{" "}
          <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
          message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a> within the
          window above.
        </p>
        <p>
          <strong>Step 2 — Tell me what was unclear.</strong> One or two honest
          lines is enough.
        </p>
        <p>
          {/* [review] acknowledgement window — confirm with owner */}
          <strong>Step 3 — I confirm.</strong> I&apos;ll acknowledge your
          request within <strong>2 business days</strong>.
        </p>
        <p>
          <strong>Step 4 — You get your money back.</strong> Refund issued to
          your original payment method.
        </p>
      </div>

      <h2 id="method-timeline" className="scroll-mt-28">
        3. Refund method and timeline
      </h2>
      <ul>
        <li>
          <strong>Method:</strong> refunds go back to your{" "}
          <strong>original payment method</strong> (card / UPI / netbanking) via
          our payment processor, Razorpay. I can&apos;t refund to a different
          account.
        </li>
        <li>
          {/* [review] initiation window — confirm with owner */}
          <strong>Our side:</strong> once approved, I initiate the refund within{" "}
          <strong>3–5 business days</strong>.
        </li>
        <li>
          {/* [review] bank-side window — confirm with owner */}
          <strong>Bank side:</strong> after that, your bank or card provider
          typically takes <strong>5–7 business days</strong> to reflect it.
          Total time depends on your bank.
        </li>
        <li>You&apos;ll get a confirmation once the refund is initiated.</li>
      </ul>

      <h2 id="reschedule" className="scroll-mt-28">
        4. Rescheduling and cancellation
      </h2>
      <ul>
        <li>
          {/* [review] reschedule notice period — confirm with owner */}
          <strong>Need to reschedule?</strong> No problem — give me at least{" "}
          <strong>24 hours&apos;</strong> notice on WhatsApp and we&apos;ll find
          a new slot at no extra cost.
        </li>
        <li>
          {/* [review] cancellation notice period — confirm with owner */}
          <strong>Cancel before your session:</strong> if you cancel at least{" "}
          <strong>24 hours</strong> before your booked consultation and
          haven&apos;t yet taken it, you can choose a{" "}
          <strong>full refund</strong> or keep the credit for a future date.
        </li>
        <li>
          {/* [review] no-show handling — confirm with owner */}
          <strong>No-shows:</strong> if you don&apos;t show up and didn&apos;t
          give notice, the session is treated as delivered and the clarity
          guarantee (Section 1) no longer applies. Message me and we&apos;ll
          sort it out fairly.
        </li>
      </ul>

      <h2 id="coaching" className="scroll-mt-28">
        5. Monthly Coaching and Online Plans
      </h2>
      <p>
        Because coaching programs and written plans are personalised and
        delivered as work is done, they are handled differently from the
        discovery consultation:
      </p>
      <ul>
        <li>
          {/* [confirm — review] */}
          <strong>Custom Online Plans</strong> are built specifically for you.
          Once I&apos;ve started building or delivered your plan, that work is{" "}
          <strong>non-refundable</strong>.
        </li>
        <li>
          {/* [confirm cancellation terms — review] */}
          <strong>Monthly Coaching</strong> can be stopped before your next
          cycle so you&apos;re not charged again; the current month, once
          started, isn&apos;t refundable.
        </li>
        <li>
          The specific terms for any program are confirmed with you in writing
          before you pay.
        </li>
      </ul>

      <h2 id="exceptions" className="scroll-mt-28">
        6. Fair use of this policy
      </h2>
      <p>
        This guarantee is offered in good faith. It doesn&apos;t cover cases
        where you didn&apos;t attend, didn&apos;t engage, or are simply
        requesting a refund after receiving and using the guidance. If something
        genuinely went wrong, talk to me — I&apos;d rather make it right than
        argue.
      </p>

      <h2 id="contact" className="scroll-mt-28">
        7. Questions
      </h2>
      <p>
        Anything unclear about refunds? Email{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a> before you
        book. This Refund Policy forms part of our{" "}
        <Link href="/terms">Terms of Service</Link>.
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
