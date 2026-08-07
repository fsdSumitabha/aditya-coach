import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { DELIVERY, LEGAL } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Delivery Policy | Aditya Upadhyay Coaching",
  description:
    "Nothing here ships. Everything sold on this site is a digital service — delivered by WhatsApp, email and live online calls. Exact delivery timelines, in writing.",
  path: "/shipping",
});

/*
 * RAZORPAY NOTE: the gateway's merchant review expects a reachable
 * "Shipping & Delivery" policy on every merchant site, including services-only
 * businesses. For a digital business the accepted form is an explicit
 * no-physical-goods statement plus concrete delivery methods and timelines —
 * that is exactly what this page is. Linked from the footer on every page.
 *
 * Delivery windows are constants in lib/legal.ts (DELIVERY). Only
 * CONFIRM_WINDOW is confirmed; the rest carry [review] tags there.
 */

const TOC = [
  { id: "no-shipping", label: "Nothing physical is shipped" },
  { id: "what-you-get", label: "What you buy and how it reaches you" },
  { id: "timelines", label: "Delivery timelines" },
  { id: "charges", label: "Delivery charges" },
  { id: "international", label: "Outside India" },
  { id: "not-received", label: "If something doesn't reach you" },
  { id: "cancellation", label: "Cancellation and refunds" },
  { id: "changes", label: "Changes and contact" },
];

const CELL = "p-4 border-b border-hairline-soft align-top type-small";

export default function ShippingPage() {
  return (
    <LegalShell
      title="Shipping & Delivery Policy."
      lastUpdated={LEGAL.LAST_UPDATED}
      effectiveDate={LEGAL.EFFECTIVE_DATE}
      toc={TOC}
    >
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* Digital-services delivery policy. Facts (windows, contact, owner)
          come from lib/legal.ts — never hardcode them here. */}
      <p className="type-lead text-secondary">
        {/* [review] */}
        Nothing here ships. Everything {LEGAL.OWNER_NAME} sells is a service or
        a digital file, delivered online — by WhatsApp, by email, and on live
        one-to-one calls. This page tells you exactly what arrives and when.
      </p>

      <h2 id="no-shipping" className="scroll-mt-28">
        1. Nothing physical is shipped
      </h2>
      <p>
        There are no physical products on this website. No courier, no tracking
        number, no delivery address, no packaging. You will never be asked for a
        shipping address and no consignment is ever dispatched to you.
      </p>

      <h2 id="what-you-get" className="scroll-mt-28">
        2. What you buy and how it reaches you
      </h2>
      <ul>
        <li>
          <strong>Transformation Audit ({LEGAL.CONSULT_PRICE}).</strong> A
          45-minute one-to-one session held online over WhatsApp. After your
          payment you get a confirmation on WhatsApp, and your slot is fixed
          with you directly on the same thread.
        </li>
        <li>
          <strong>The gift card that comes with the audit.</strong> Handed to
          you digitally at the end of the call. Nothing is posted.
        </li>
        <li>
          <strong>The Lifestyle Blueprint and other free resources.</strong>{" "}
          Delivered as a file to the email address you enter on the form,
          straight after you submit it. Check your spam and promotions folders
          if it isn&apos;t in your inbox.
        </li>
        <li>
          <strong>Coaching programs.</strong> Delivered over the length of your
          program through scheduled online calls, weekly check-ins and direct
          WhatsApp access. Onboarding begins once your program payment clears.
        </li>
        <li>
          <strong>Written plans and documents.</strong> Sent to you as files by
          email or WhatsApp. Never printed, never couriered.
        </li>
      </ul>

      <h2 id="timelines" className="scroll-mt-28">
        3. Delivery timelines
      </h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className={CELL}>What you bought</th>
              <th className={CELL}>How it&apos;s delivered</th>
              <th className={CELL}>When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={CELL}>
                Transformation Audit — booking confirmation
              </td>
              <td className={CELL}>WhatsApp message</td>
              <td className={CELL}>
                Within {DELIVERY.CONFIRM_WINDOW} of payment
              </td>
            </tr>
            <tr>
              <td className={CELL}>Transformation Audit — the call itself</td>
              <td className={CELL}>45-minute WhatsApp call, one-to-one</td>
              <td className={CELL}>
                {/* [review] */}
                Scheduled within {DELIVERY.AUDIT_WINDOW} of booking, at a slot
                agreed with you
              </td>
            </tr>
            <tr>
              <td className={CELL}>Gift card included with the audit</td>
              <td className={CELL}>Digital, on the call</td>
              <td className={CELL}>At the end of your session</td>
            </tr>
            <tr>
              <td className={CELL}>Lifestyle Blueprint / free resources</td>
              <td className={CELL}>Email to the address you gave</td>
              <td className={CELL}>Immediately after you submit the form</td>
            </tr>
            <tr>
              <td className={CELL}>Coaching program</td>
              <td className={CELL}>
                Online calls, weekly check-ins, WhatsApp access
              </td>
              <td className={CELL}>
                {/* [review] */}
                Onboarding within {DELIVERY.ONBOARDING_WINDOW} of payment, then
                for the full program term
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="type-small text-muted">
        Business days are Monday to Saturday, excluding public holidays in{" "}
        {LEGAL.JURISDICTION_CITY}, {LEGAL.JURISDICTION_STATE}.
      </p>

      <h2 id="charges" className="scroll-mt-28">
        4. Delivery charges
      </h2>
      <p>
        <strong>There are none.</strong> No shipping fee, no handling fee, no
        delivery charge, no platform charge. The amount shown at checkout is the
        full amount you pay. See{" "}
        <Link href="/pricing">Pricing</Link> for the complete breakdown.
      </p>

      <h2 id="international" className="scroll-mt-28">
        5. Outside India
      </h2>
      <p>
        Coaching is online, so delivery works the same wherever you are.
        Nothing crosses a border, which means no customs, no duties and no
        import charges — there is nothing physical to clear. Calls are scheduled
        in Indian Standard Time; a workable slot is agreed with you before the
        session is fixed.
      </p>

      <h2 id="not-received" className="scroll-mt-28">
        6. If something doesn&apos;t reach you
      </h2>
      <ol>
        <li>
          Check your spam and promotions folders, and confirm the email address
          you entered was correct.
        </li>
        <li>
          Email{" "}
          <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
          message <a href={LEGAL.WHATSAPP_WA_LINK}>{LEGAL.WHATSAPP_E164}</a> on
          WhatsApp with the email address you used and the date you paid.
        </li>
        <li>
          {/* [review] */}
          It gets re-sent within {DELIVERY.RESEND_WINDOW}. If you gave the wrong
          email address, tell me the right one and it goes out again — there is
          no charge for a re-send.
        </li>
      </ol>

      <h2 id="cancellation" className="scroll-mt-28">
        7. Cancellation and refunds
      </h2>
      <p>
        Cancellations, rescheduling and refunds are governed entirely by the{" "}
        <Link href="/refund">Refund Policy</Link>, which forms part of the{" "}
        <Link href="/terms">Terms of Service</Link>. This page covers delivery
        only.
      </p>

      <h2 id="changes" className="scroll-mt-28">
        8. Changes and contact
      </h2>
      <p>
        This policy may be updated; the current version always lives on this
        page with the date above. Questions about delivery? Email{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a>.
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
