import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Aditya Kumar Upadhyay Coaching",
  description:
    "How we collect, use and protect your data under India's DPDP Act 2023. Read the privacy policy for Aditya Kumar Upadhyay coaching.",
  path: "/privacy",
});

const TOC = [
  { id: "who", label: "Who this policy is from" },
  { id: "collect", label: "What data I collect" },
  { id: "why", label: "Why I collect it (purposes)" },
  { id: "consent", label: "Your consent" },
  { id: "processors", label: "Who else touches your data (processors)" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "retention", label: "How long I keep your data" },
  { id: "rights", label: "Your rights under the DPDP Act" },
  { id: "security", label: "How I protect your data" },
  { id: "children", label: "Children's data" },
  { id: "medical", label: "A note on health information" },
  { id: "changes", label: "Changes to this policy" },
  { id: "grievance", label: "Grievance Officer & contact" },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy."
      lastUpdated={LEGAL.LAST_UPDATED}
      toc={TOC}
    >
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* DPDP Act 2023-aware starter. Constants live in lib/legal.ts. Have an
          Indian advocate confirm retention periods, entity status, and
          Grievance Officer details. */}
      <p className="type-lead text-primary">
        Your data is yours. I collect only what I need to coach you well and to
        run this business honestly. No selling your information. No games. This
        page explains exactly what I collect, why, and the control you have
        over it &mdash; in plain language, and in line with India&apos;s
        Digital Personal Data Protection Act, 2023 (the &quot;DPDP Act&quot;).
      </p>

      <h2 id="who" className="scroll-mt-24">
        1. Who this policy is from
      </h2>
      <p>
        This website and coaching service are operated by{" "}
        <strong>{LEGAL.OWNER_NAME}</strong> (&quot;I&quot;, &quot;me&quot;,
        &quot;we&quot;, &quot;{LEGAL.BUSINESS_NAME}&quot;), based in{" "}
        {LEGAL.JURISDICTION_CITY}, {LEGAL.JURISDICTION_STATE}. For the purposes
        of the DPDP Act, I am the <strong>Data Fiduciary</strong> &mdash; the
        person who decides why and how your personal data is handled. You are
        the <strong>Data Principal</strong>. If you have any question about
        your data, contact details are at the end of this page.
      </p>

      <h2 id="collect" className="scroll-mt-24">
        2. What data I collect
      </h2>
      <p>
        I only collect what you choose to give me through the forms and tools
        on this site:
      </p>
      <ul>
        <li>
          <strong>Your name</strong> &mdash; so I know who I&apos;m speaking
          with.
        </li>
        <li>
          <strong>Email address</strong> &mdash; to send your free resources
          and coaching updates.
        </li>
        <li>
          <strong>WhatsApp / phone number</strong> &mdash; the main way we
          actually talk and run consultations.
        </li>
        <li>
          <strong>Age</strong> &mdash; to make sure guidance is appropriate for
          you.
        </li>
        <li>
          <strong>Your main goal</strong> (fat loss, muscle gain, energy,
          confidence, overall lifestyle change).
        </li>
        <li>
          <strong>Your intake answers</strong> &mdash; occupation, current
          lifestyle, exercise routine, what has stopped you until now, and what
          success looks like for you. You provide these so I can build the
          right plan.
        </li>
      </ul>
      <p>
        I also receive limited technical data automatically (see &quot;Cookies
        and analytics&quot; below), such as your device type, approximate
        location and how you use the site. Payment card details are handled
        entirely by my payment processor &mdash;{" "}
        <strong>I never see or store your full card or bank details.</strong>
      </p>

      <h2 id="why" className="scroll-mt-24">
        3. Why I collect it (purposes)
      </h2>
      <ul>
        <li>
          To deliver the free tools you request (Lifestyle Blueprint, Training
          Split, calorie estimate).
        </li>
        <li>
          To respond to enquiries and run your {LEGAL.CONSULT_PRICE} discovery
          consultation.
        </li>
        <li>
          To build and deliver your coaching plan and stay in touch during your
          program.
        </li>
        <li>
          To take and confirm payment for the consultation and any program you
          choose.
        </li>
        <li>
          To send updates, resources and offers you&apos;ve agreed to receive
          (you can opt out any time).
        </li>
        <li>
          To keep records I&apos;m legally required to keep, and to keep the
          site secure.
        </li>
      </ul>
      <p>
        I use your data only for the purpose you gave it for. I do not use your
        intake answers for advertising.
      </p>

      <h2 id="consent" className="scroll-mt-24">
        4. Your consent
      </h2>
      <p>
        When you submit a form on this site, you are giving{" "}
        <strong>free, specific, informed and clear consent</strong> for me to
        use your data for the purpose stated next to that form. A short consent
        line sits beside every email/phone field so you always know what
        you&apos;re agreeing to before you submit. You can{" "}
        <strong>withdraw your consent at any time</strong> (see &quot;Your
        rights&quot;). Withdrawing consent won&apos;t affect anything lawfully
        done before you withdrew it, and it may mean I can no longer provide a
        service that depends on that data.
      </p>

      <h2 id="processors" className="scroll-mt-24">
        5. Who else touches your data (processors)
      </h2>
      <p>
        I use a small number of trusted third-party services (Data Processors)
        to run this business. They act on my instructions and only for the
        purposes above:
      </p>
      <ul>
        <li>
          <strong>Email delivery &mdash; Brevo and/or Mailchimp:</strong> to
          store your name and email and send your free resources, welcome
          emails and updates. [Confirm which provider is live &mdash; review]
        </li>
        <li>
          <strong>Payments &mdash; Razorpay:</strong> to securely process your{" "}
          {LEGAL.CONSULT_PRICE} consultation payment and any program payments.
          Razorpay handles your card/UPI/bank details directly under its own
          privacy policy; I receive only a confirmation and basic transaction
          record.
        </li>
        <li>
          <strong>
            Analytics & advertising &mdash; Google Analytics 4 and Meta
            (Facebook) Pixel:
          </strong>{" "}
          to understand how the site is used and measure marketing (see next
          section).
        </li>
        <li>
          <strong>Website hosting / infrastructure:</strong> [hosting provider
          &mdash; review], which stores the site and data securely.
        </li>
      </ul>
      <p>
        Some of these providers may process data on servers outside India.
        Where that happens, it is done in line with the DPDP Act and the
        provider&apos;s own safeguards. [Confirm cross-border transfer basis
        &mdash; review]
      </p>

      <h2 id="cookies" className="scroll-mt-24">
        6. Cookies and analytics
      </h2>
      <p>This site uses cookies and similar technologies:</p>
      <ul>
        <li>
          <strong>Essential cookies</strong> &mdash; needed for the site to
          work (e.g. remembering form state). These are always on.
        </li>
        <li>
          <strong>Analytics &mdash; Google Analytics 4 (GA4)</strong> &mdash;
          to see which pages help and which don&apos;t, so I can improve the
          site.
        </li>
        <li>
          <strong>Advertising &mdash; Meta Pixel</strong> &mdash; to measure
          and, where relevant, show ads to people who might benefit from this
          coaching.
        </li>
      </ul>
      <p>
        You can control or block non-essential cookies through your browser
        settings, and you can opt out of personalised ads via your Google and
        Meta ad settings.{" "}
        {/* [review] — describes the site's cookie-consent banner */}
        On your first visit, this site shows a small cookie banner. Analytics
        and advertising cookies stay off until you accept. Decline, and you can
        still use every page. [review]
      </p>

      <h2 id="retention" className="scroll-mt-24">
        7. How long I keep your data
      </h2>
      <p>I keep your data only as long as I need it:</p>
      <ul>
        <li>
          <strong>Enquiry / lead-magnet data:</strong> until you unsubscribe or
          ask me to delete it, or after a reasonable period of inactivity.
          [e.g. 24 months &mdash; review]
        </li>
        <li>
          <strong>Coaching client records:</strong> for the duration of your
          program and a reasonable period after, to support you and handle any
          follow-up. [e.g. 3 years &mdash; review]
        </li>
        <li>
          <strong>Payment and tax records:</strong> for as long as Indian tax
          and accounting law requires me to keep them. [confirm statutory
          period &mdash; review]
        </li>
      </ul>
      <p>When I no longer need your data, I delete or anonymise it.</p>

      <h2 id="rights" className="scroll-mt-24">
        8. Your rights under the DPDP Act
      </h2>
      <p>As a Data Principal, you have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> &mdash; ask what personal data of yours I
          hold and how it&apos;s used.
        </li>
        <li>
          <strong>Correction and erasure</strong> &mdash; ask me to correct
          wrong data or delete data I no longer need.
        </li>
        <li>
          <strong>Withdraw consent</strong> &mdash; at any time, as easily as
          you gave it.
        </li>
        <li>
          <strong>Grievance redressal</strong> &mdash; raise a complaint and
          get a response (see below).
        </li>
        <li>
          <strong>Nominate</strong> &mdash; nominate another person to exercise
          your rights if you are unable to.
        </li>
      </ul>
      <p>
        To exercise any of these, email me at{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        contact the Grievance Officer below. I&apos;ll respond within a
        reasonable time. If you&apos;re not satisfied, you may escalate to the{" "}
        <strong>Data Protection Board of India</strong>.
      </p>

      <h2 id="security" className="scroll-mt-24">
        9. How I protect your data
      </h2>
      <p>
        I take reasonable technical and organisational steps to keep your data
        safe and to prevent loss or misuse. No system is ever 100% secure, but
        I limit who can access your data and use reputable providers who do the
        same.
      </p>

      <h2 id="children" className="scroll-mt-24">
        10. Children&apos;s data
      </h2>
      <p>
        This coaching is for adults. I do not knowingly collect data from
        anyone under 18. If you are under 18, please don&apos;t submit your
        details without a parent or guardian&apos;s consent. If I learn
        I&apos;ve collected a child&apos;s data without proper consent,
        I&apos;ll delete it.
      </p>

      <h2 id="medical" className="scroll-mt-24">
        11. A note on health information
      </h2>
      <p>
        Your intake answers may describe your lifestyle, habits and goals. I am
        a <strong>lifestyle coach, not a doctor or registered dietitian.</strong>{" "}
        I treat what you share as confidential and use it only to coach you.
        Nothing here is medical advice &mdash; always consult a qualified
        physician before making health, diet or exercise changes.
      </p>

      <h2 id="changes" className="scroll-mt-24">
        12. Changes to this policy
      </h2>
      <p>
        If I change how I handle data, I&apos;ll update this page and the
        &quot;Last updated&quot; date above. Significant changes will be
        communicated where appropriate.
      </p>

      <h2 id="grievance" className="scroll-mt-24">
        13. Grievance Officer & contact
      </h2>
      <div className="card !mt-6" style={{ padding: 24 }}>
        <p>
          <strong>Grievance Officer:</strong> {LEGAL.GRIEVANCE_NAME}
        </p>
        <p className="mt-2">
          <strong>Email:</strong>{" "}
          <a href={`mailto:${LEGAL.GRIEVANCE_EMAIL}`}>
            {LEGAL.GRIEVANCE_EMAIL}
          </a>
        </p>
        <p className="mt-2">
          <strong>WhatsApp:</strong>{" "}
          <a href={LEGAL.WHATSAPP_WA_LINK} rel="noopener noreferrer">
            {LEGAL.WHATSAPP_E164}
          </a>
        </p>
        <p className="mt-2">
          <strong>Address:</strong> {LEGAL.GRIEVANCE_ADDRESS}
        </p>
        <p className="type-small text-muted mt-4">
          For any privacy question, correction, deletion or complaint, this is
          your point of contact.
        </p>
      </div>
      {/* END TEMPLATE */}

      <p className="!mt-12">
        <Link
          href="/"
          className="type-small !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] !no-underline transition-colors inline-flex items-center gap-2"
        >
          &larr; Back to home
        </Link>
      </p>
    </LegalShell>
  );
}
