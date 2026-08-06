import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service | Aditya Upadhyay Coaching",
  description:
    "The terms that govern consultations, coaching programs and use of this website. Please read before booking.",
  path: "/terms",
});

const TOC = [
  { id: "what-this-is", label: "What you're getting — coaching, not medical care" },
  { id: "no-guarantee", label: "No guaranteed results" },
  { id: "eligibility", label: "Eligibility" },
  { id: "booking", label: "Consultations, programs and payment" },
  { id: "your-responsibilities", label: "Your responsibilities" },
  { id: "ip", label: "Intellectual property" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "tools", label: "Free tools and estimates" },
  { id: "third-party", label: "Third-party links and services" },
  { id: "liability", label: "Limitation of liability" },
  { id: "indemnity", label: "Indemnity" },
  { id: "law", label: "Governing law and jurisdiction" },
  { id: "changes", label: "Changes and contact" },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service."
      lastUpdated={LEGAL.LAST_UPDATED}
      effectiveDate={LEGAL.EFFECTIVE_DATE}
      toc={TOC}
    >
      {/* TEMPLATE: review with a lawyer before going live */}
      {/* Coaching/education terms. Emphasises: not medical care, no guaranteed
          results, IP, acceptable use, limitation of liability, Indian law /
          Kolkata jurisdiction. Constants live in lib/legal.ts — have an
          advocate review. */}
      <p className="type-lead text-secondary">
        Straight talk before we work together. These terms govern this website,
        the {LEGAL.CONSULT_PRICE} discovery consultation, and any coaching
        program you buy from {LEGAL.OWNER_NAME} (&quot;I&quot;, &quot;me&quot;,
        &quot;we&quot;), a {LEGAL.LEGAL_BASIS_NOTE} based in{" "}
        {LEGAL.JURISDICTION_CITY}, {LEGAL.JURISDICTION_STATE}. By using this
        site or booking a
        consultation, you agree to them. If you don&apos;t, please don&apos;t
        use the site or book.
      </p>

      <h2 id="what-this-is" className="scroll-mt-28">
        1. What you&apos;re getting — coaching, not medical care
      </h2>
      <p>
        I am a <strong>men&apos;s lifestyle coach</strong>. I am{" "}
        <strong>
          not a doctor, not a registered dietitian, and not a licensed medical
          or mental-health professional.
        </strong>{" "}
        Everything I provide — consultations, plans, tools, articles and
        coaching — is{" "}
        <strong>
          education and general lifestyle guidance only. It is not medical
          advice, diagnosis or treatment.
        </strong>{" "}
        Always consult a qualified physician before starting or changing any
        diet, exercise, supplement or lifestyle program, especially if you have
        a medical condition, take medication, or are unsure whether something is
        safe for you. If you feel unwell, stop and seek medical help.
      </p>

      <h2 id="no-guarantee" className="scroll-mt-28">
        2. No guaranteed results
      </h2>
      <p>
        I&apos;ll give you the right order of change and hold you accountable.
        But your results depend on you — your effort, consistency, honesty,
        genetics, health and circumstances.{" "}
        <strong>I do not and cannot guarantee any specific result</strong> — a
        certain weight, body, energy level, income or outcome. Testimonials and
        transformations shown on this site are real individual results and are{" "}
        <strong>not a promise that you will get the same.</strong> Individual
        results vary.
      </p>

      <h2 id="eligibility" className="scroll-mt-28">
        3. Eligibility
      </h2>
      <p>
        You must be at least 18 years old and able to enter a binding agreement
        to book a consultation or coaching. By booking, you confirm the
        information you give me is true and complete.
      </p>

      <h2 id="booking" className="scroll-mt-28">
        4. Consultations, programs and payment
      </h2>
      <ul>
        <li>
          The <strong>discovery consultation</strong> is {LEGAL.CONSULT_PRICE}{" "}
          for a ~45-minute online session via WhatsApp, where we map your
          lifestyle, health, habits and goals.
        </li>
        <li>
          <strong>Monthly Coaching</strong> and <strong>Online Plan</strong>{" "}
          pricing is disclosed after the consultation and confirmed with you
          before any payment.
        </li>
        <li>
          Payments are processed securely by our payment provider (Razorpay). By
          paying, you agree to their terms as well as these.
        </li>
        <li>
          Refunds are governed by our <Link href="/refund">Refund Policy</Link>,
          which forms part of these terms.
        </li>
      </ul>

      <h2 id="your-responsibilities" className="scroll-mt-28">
        5. Your responsibilities
      </h2>
      <ul>
        <li>
          Give me honest, accurate information about your health, lifestyle and
          goals.
        </li>
        <li>
          Get medical clearance where appropriate before acting on any guidance.
        </li>
        <li>
          Follow guidance sensibly and listen to your own body — never push
          through pain or warning signs.
        </li>
        <li>
          Show up and do the work. Coaching is a partnership, not a purchase of
          results.
        </li>
      </ul>

      <h2 id="ip" className="scroll-mt-28">
        6. Intellectual property
      </h2>
      <p>
        All content on this site and in my programs — the method, the
        &quot;Right Order of Change&quot; framework, written plans, blueprints,
        training splits, calculators, text, images and branding — is owned by{" "}
        {LEGAL.OWNER_NAME} and protected by law. It is provided for{" "}
        <strong>your personal use only.</strong> You may not copy, resell,
        republish, share your plan or paid materials with others, or use any of
        it to build a competing service, without my written permission.
      </p>

      <h2 id="acceptable-use" className="scroll-mt-28">
        7. Acceptable use
      </h2>
      <p>When using this site you agree not to:</p>
      <ul>
        <li>Break any law or infringe anyone&apos;s rights.</li>
        <li>
          Attempt to hack, disrupt, overload or reverse-engineer the site or its
          tools.
        </li>
        <li>Submit false, abusive, or someone else&apos;s personal information.</li>
        <li>Scrape, copy or redistribute content beyond normal personal use.</li>
      </ul>
      <p>
        I may suspend or end your access, consultation or program if you breach
        these terms or act abusively toward me or others.
      </p>

      <h2 id="tools" className="scroll-mt-28">
        8. Free tools and estimates
      </h2>
      <p>
        The calorie calculator and free resources give{" "}
        <strong>general starting estimates</strong>, not prescriptions. They are
        not medical or nutritional advice and don&apos;t account for your full
        health picture. Use them as a starting point and confirm anything
        important with a qualified professional.
      </p>

      <h2 id="third-party" className="scroll-mt-28">
        9. Third-party links and services
      </h2>
      <p>
        This site may link to third-party services (e.g. WhatsApp, payment and
        email providers). I&apos;m not responsible for their content,
        availability or practices — their own terms and privacy policies apply.
      </p>

      <h2 id="liability" className="scroll-mt-28">
        10. Limitation of liability
      </h2>
      <p>
        To the fullest extent permitted by law: I provide the site, tools and
        coaching &quot;as is&quot;, and you use them at your own risk. I am{" "}
        <strong>not liable for any injury, loss, damage or outcome</strong>{" "}
        arising from your use of, or reliance on, any guidance, tool, plan or
        content — including any decision you make about your health, diet,
        exercise or finances. Where liability cannot be excluded by law, my
        total liability to you is limited to the amount you actually paid me for
        the specific service in question. Nothing in these terms limits any
        liability that cannot lawfully be limited.
      </p>

      <h2 id="indemnity" className="scroll-mt-28">
        11. Indemnity
      </h2>
      {/* [confirm scope with advocate — review] */}
      <p>
        You agree to cover me for any claim, loss or cost arising from your
        breach of these terms or your misuse of the site, tools or coaching.
      </p>

      <h2 id="law" className="scroll-mt-28">
        12. Governing law and jurisdiction
      </h2>
      <p>
        These terms are governed by the laws of <strong>India</strong>. Any
        dispute relating to these terms, the site or your coaching will be
        subject to the{" "}
        <strong>
          exclusive jurisdiction of the courts of {LEGAL.JURISDICTION_CITY},{" "}
          {LEGAL.JURISDICTION_STATE}
        </strong>
        .
      </p>

      <h2 id="changes" className="scroll-mt-28">
        13. Changes and contact
      </h2>
      <p>
        I may update these terms from time to time; the current version always
        lives on this page with the date above. Continued use after a change
        means you accept it. Questions? Email{" "}
        <a href={`mailto:${LEGAL.CONTACT_EMAIL}`}>{LEGAL.CONTACT_EMAIL}</a> or
        message me on <a href={LEGAL.WHATSAPP_WA_LINK}>WhatsApp</a>.
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
