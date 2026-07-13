import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import JsonLd from "@/components/JsonLd";
import PlaceholderImage from "@/components/PlaceholderImage";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import CtaLink from "@/components/programs/CtaLink";
import FaqItem from "@/components/programs/FaqItem";
import { waLink } from "@/lib/config";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";

// ===== Page-level config (swappable constants) =====
// PHASE-2 STUBS — waLink/track come from the ONE global config block (lib/config.ts).
const PRICE_CONSULT = "₹2,000"; // reused in the Discovery card, comparison table + reassurance line
const BOOK_URL = "/book";
const WA_MONTHLY = waLink("Hi Aditya, I'd like to apply for Monthly Coaching.");
const WA_ONLINE = waLink("Hi Aditya, tell me more about the Online Plan.");

// ---- Swappable emblem placeholders (~64×64) — set to a real asset path to swap ----
const IMG_OFFER_ICON_DISCOVERY = ""; /* TODO: real 64×64 emblem — compass/clarity motif */
const IMG_OFFER_ICON_MONTHLY = ""; /* TODO: real 64×64 emblem — recurring/loop motif */
const IMG_OFFER_ICON_ONLINE = ""; /* TODO: real 64×64 emblem — document/plan motif */

export const metadata: Metadata = pageMetadata({
  title: "Programs for Men | Coaching with Aditya, Kolkata",
  description:
    "Discovery consultation, monthly coaching and custom online plans for men who want their health, drive and confidence back. Start in Kolkata or online.",
  path: "/programs",
});

// ===== FAQ — single source of truth for visible copy AND FAQPage JSON-LD =====
/* [review] — all 5 Q&A invented in Aditya's voice; JSON-LD mirrors this verbatim */
const faqs: { q: string; a: string; aJsx?: ReactNode }[] = [
  {
    q: "Is this online, or do I have to be in Kolkata?",
    a: "Both work. I'm based in Kolkata and coach men in person and worldwide online. The Discovery Consultation is a 45-minute call over WhatsApp, so it doesn't matter where you are.",
  },
  {
    q: "Do you take international clients?",
    a: "Yes. I coach men worldwide online. The call, the check-ins and your written plan all run remotely — nothing about the process needs you in the same city.",
  },
  {
    q: "What's your refund policy?",
    a: "Clear terms, no surprises. The ₹2,000 consultation and coaching are covered by a written refund policy — read it in full on the refund page before you book.",
    aJsx: (
      <>
        Clear terms, no surprises. The ₹2,000 consultation and coaching are
        covered by a written refund policy — read it in full on the{" "}
        <Link
          href="/refund"
          className="underline underline-offset-4 decoration-[var(--hairline-gold)] text-gold-300 hover:text-gold-200"
        >
          refund page
        </Link>{" "}
        before you book.
      </>
    ),
  },
  {
    q: "What if I'm a complete beginner?",
    a: "Good. Beginners get the cleanest results because there's nothing to un-learn. We fix your lifestyle first — how you sleep, wake, move and eat — before anything advanced. You don't need a gym background to start.",
  },
  {
    q: "How soon will I see results?",
    a: "Some things shift in the first two weeks — energy, sleep, focus. Visible body change takes longer and depends on your starting point and how consistently you execute. I don't sell overnight transformations. I build change that lasts. Individual results vary.",
  },
];

// ===== Structured data: FAQPage + 3 Service nodes =====
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* [review] — Service schema descriptions for Monthly/Online invented; provider
   references the global Person node by @id (never redefined here). */
const providerRef = { "@id": `${SITE_ORIGIN}/#person` };
const areaServed = ["Kolkata", "Worldwide"];
const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Discovery Consultation",
    provider: providerRef,
    areaServed,
    description:
      "A 45-minute online consultation via WhatsApp covering your lifestyle, health, habits and goals, ending with a clear plan of what to change and in what order.",
    offers: {
      "@type": "Offer",
      price: "2000",
      priceCurrency: "INR",
      url: `${SITE_ORIGIN}/book`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Monthly Coaching",
    provider: providerRef,
    areaServed,
    description:
      "Ongoing one-to-one lifestyle transformation coaching for men — body, mind, confidence and health — with weekly check-ins, full accountability and complete guidance at every step. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Online Plan",
    provider: providerRef,
    areaServed,
    description:
      "A complete written lifestyle, nutrition and training plan built specifically for your body, your goals and your life. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
];

// ===== Comparison table data =====
const DASH = "__not_included__";
/* [review] — all comparison cells invented (row labels + values) */
const compareRows: { label: string; cells: ReactNode[] }[] = [
  {
    label: "Price",
    cells: [PRICE_CONSULT, "Disclosed after consult", "Disclosed after consult"],
  },
  {
    label: "Format",
    cells: [
      "45-min live call (WhatsApp)",
      "Ongoing 1-to-1 coaching",
      "Complete written plan",
    ],
  },
  {
    label: "Best for",
    cells: [
      "Getting clarity + a plan of attack",
      "Full transformation with support",
      "Self-driven men who want the blueprint",
    ],
  },
  { label: "Weekly check-ins", cells: [DASH, "Yes", DASH] },
  {
    label: "Accountability",
    cells: ["One session", "Full, every week", "You run it yourself"],
  },
  {
    label: "Custom written plan",
    cells: ["Direction, not a full plan", "Yes, evolving", "Yes, one-time build"],
  },
  {
    label: "Access to Aditya",
    cells: ["During the call", "Direct, between sessions", "At handover / questions"],
  },
  {
    label: "Starts with a consult",
    cells: [
      <span key="d">
        This <em>is</em> the consult
      </span>,
      "Yes",
      "Yes",
    ],
  },
];

const cellBase = "p-4 border-b border-hairline-soft align-top type-small";
const goldTint = "bg-[rgba(201,162,75,0.06)]";

function OfferIcon({ src, alt }: { src: string; alt: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="rounded-xl"
      />
    );
  }
  return (
    <PlaceholderImage
      label="ICON"
      w={64}
      h={64}
      alt={alt}
      variant="square"
      style={{ width: 64, height: 64, borderRadius: 12 }}
    />
  );
}

function NotIncluded() {
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not included</span>
    </>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <JsonLd data={[faqSchema, ...serviceSchemas]} />
      {/* Page-scoped CSS: (1) supply the is-in transform reset the shipped kit
          omits for reveal-scale so the table settles at full size; (2) the
          sanctioned grid-template-rows accordion transition + reduced-motion
          guard used by <FaqItem>. Neither touches shared files. */}
      <style>{`
        #compare .reveal-scale.is-in { transform: none; }
        .faq-panel { transition: grid-template-rows 0.35s var(--ease-out-expo); }
        @media (prefers-reduced-motion: reduce) { .faq-panel { transition: none; } }
      `}</style>

      {/* ============ 1. HERO — "Work With Me." ============ */}
      <section className="bg-void aurora grain relative overflow-hidden">
        <div className="container-site section-lg">
          <div className="max-w-[760px] mx-auto text-center">
            {/* Hero H1 — never animated (LCP paints at final state frame 1) */}
            <h1 className="type-h1 text-primary">Work With Me.</h1>
            <Reveal delayMs={80}>
              {/* [review] */}
              <p className="type-lead text-secondary mt-6">
                Three ways in. One direction — the man you&apos;re capable of
                being. Start with a conversation, then we build.
              </p>
            </Reveal>
            <div className="gold-line max-w-[220px] mx-auto mt-8" aria-hidden="true" />
            <Reveal delayMs={140}>
              {/* [review] */}
              <p className="type-caption text-muted mt-6">
                Kolkata · Coaching worldwide online · Every plan starts with the
                Discovery Consultation.
              </p>
            </Reveal>
            <Reveal delayMs={200} className="mt-10">
              {/* [review] — optional hero CTA pair */}
              <div className="flex flex-col items-center gap-5">
                <CtaLink
                  href={BOOK_URL}
                  className="btn-gold w-full sm:w-auto"
                  data={{ page: "programs", cta: "hero_book", target: BOOK_URL }}
                >
                  Book the {PRICE_CONSULT} Consultation
                </CtaLink>
                <a
                  href="#compare"
                  className="type-small text-secondary underline underline-offset-4 decoration-[var(--hairline-gold)] hover:text-primary transition-colors min-h-[48px] inline-flex items-center"
                >
                  Compare the three ways in
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 2. THREE OFFER BLOCKS ============ */}
      <section className="bg-base relative overflow-hidden isolate">
        {/* Ghost watermark — reuses the hero word "Work", decorative, clipped
            to the section; drifts on scroll where supported. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <span className="ghost-word sd-ghost-drift">WORK</span>
        </div>
        <div className="container-site section relative z-10">
          <Reveal>
            {/* [review] */}
            <p className="eyebrow text-center">The Three Ways In</p>
          </Reveal>

          {/* [review] — tablet layout choice: Discovery spans full width on top,
              Monthly + Online 2-up below; 3-up from 900px with Discovery center */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 nav:grid-cols-3 gap-6 nav:gap-7 items-stretch">
            {/* --- 3a. DISCOVERY CONSULTATION — FEATURED (lands last, overshoot pop) --- */}
            <Reveal
              delayMs={180}
              className="h-full md:col-span-2 nav:col-span-1 nav:order-2"
              style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
            >
              <article
                className="card card-featured relative h-full nav:scale-[1.03]"
                style={{ background: "var(--surface-warm)" }}
              >
                <span
                  className="absolute -top-3.5 right-6 z-10 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-gold"
                  style={{ background: "var(--grad-gold)", boxShadow: "var(--glow-gold)" }}
                >
                  Recommended
                </span>
                {/* Inner .spot carries the cursor glow (kept off the article so
                    the badge can straddle the top edge un-clipped). */}
                <div className="spot flex flex-col h-full">
                <OfferIcon src={IMG_OFFER_ICON_DISCOVERY} alt="Discovery Consultation" />
                <h2 className="type-h3 text-primary mt-5">Discovery Consultation</h2>
                <p className="type-price text-gold-grad mt-3">{PRICE_CONSULT}</p>
                <p className="type-small text-muted mt-1">
                  45 minutes · Online via WhatsApp
                </p>
                <p className="type-body text-secondary mt-5">
                  We go through your current lifestyle, health, habits and goals.
                  I tell you exactly what needs to change and in what order. You
                  leave with complete clarity.
                </p>
                <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                  What you leave with
                </p>
                {/* [review] — bullet list invented in Aditya's voice */}
                <ul className="mt-4 flex flex-col gap-3">
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      A clear read on where your lifestyle, health and habits
                      actually stand
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>The exact order of what to change first — no guessing</span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Your biggest blocker named out loud, and how to move past it
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      A realistic picture of what&apos;s possible in the next 3–6
                      months
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Complete clarity on whether coaching is right for you — zero
                      pressure
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <CtaLink
                    href={BOOK_URL}
                    className="btn-gold w-full"
                    data={{ page: "programs", cta: "discovery_book_now", target: BOOK_URL }}
                  >
                    Book Now
                  </CtaLink>
                  {/* [review] */}
                  <p className="type-caption text-muted text-center mt-3">
                    Every coaching path begins here. Refundable per our{" "}
                    <Link
                      href="/refund"
                      className="underline underline-offset-4 decoration-[var(--hairline-gold)] hover:text-primary"
                    >
                      refund policy
                    </Link>
                    .
                  </p>
                </div>
                </div>
              </article>
            </Reveal>

            {/* --- 3b. MONTHLY COACHING --- */}
            <Reveal delayMs={0} className="h-full nav:order-1">
              <TiltCard className="h-full">
              <article className="card-dark-gold h-full">
                <div className="spot flex flex-col h-full">
                <OfferIcon src={IMG_OFFER_ICON_MONTHLY} alt="Monthly Coaching" />
                <h2 className="card-head type-h3 mt-5">Monthly Coaching</h2>
                <p className="type-body font-medium text-secondary mt-3">
                  Price disclosed after your consultation
                </p>
                <p className="type-body text-secondary mt-5">
                  Full lifestyle transformation. Body. Mind. Confidence. Health.
                  Weekly check ins. Full accountability. Complete guidance at
                  every step.
                </p>
                <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                  What&apos;s included
                </p>
                {/* [review] — bullet list invented, anchored to weekly check-ins /
                    accountability / full guidance */}
                <ul className="mt-4 flex flex-col gap-3">
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Weekly check-ins to keep you on track and adjust as you go
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Full accountability — you don&apos;t get to quietly drift
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Complete guidance at every step: lifestyle, nutrition,
                      training
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>Direct access to me between sessions on WhatsApp</span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Your plan evolves month to month as your body and life change
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <CtaLink
                    external
                    href={WA_MONTHLY}
                    className="btn-wa w-full"
                    data={{ page: "programs", cta: "monthly_apply_now", target: "whatsapp" }}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Apply Now
                  </CtaLink>
                  {/* [review] */}
                  <p className="type-caption text-muted text-center mt-3">
                    Starts after a Discovery Consultation so we both know
                    it&apos;s the right fit.
                  </p>
                </div>
                </div>
              </article>
              </TiltCard>
            </Reveal>

            {/* --- 3c. ONLINE PLAN --- */}
            <Reveal delayMs={90} className="h-full nav:order-3">
              <TiltCard className="h-full">
              <article className="card-dark-gold h-full">
                <div className="spot flex flex-col h-full">
                <OfferIcon src={IMG_OFFER_ICON_ONLINE} alt="Online Plan" />
                <h2 className="card-head type-h3 mt-5">Online Plan</h2>
                <p className="type-body font-medium text-secondary mt-3">
                  Price disclosed after your consultation
                </p>
                <p className="type-body text-secondary mt-5">
                  A complete written lifestyle, nutrition and training plan built
                  specifically for your body, your goals and your life. No
                  guesswork. Just execution.
                </p>
                <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                  What you get
                </p>
                {/* [review] — bullet list invented in Aditya's voice */}
                <ul className="mt-4 flex flex-col gap-3">
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      A complete written lifestyle plan built around your real day
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Nutrition targets set for the body you want — not the one
                      you have
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      A training split matched to your goals and your schedule
                    </span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>Built specifically for you — no templates, no guesswork</span>
                  </li>
                  <li className="flex gap-3 type-small text-secondary">
                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                    <span>
                      Yours to execute at your own pace, anywhere in the world
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <CtaLink
                    external
                    href={WA_ONLINE}
                    className="btn-wa w-full"
                    data={{ page: "programs", cta: "online_learn_more", target: "whatsapp" }}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Learn More
                  </CtaLink>
                  {/* [review] */}
                  <p className="type-caption text-muted text-center mt-3">
                    Best for men who want the full plan and prefer to run it
                    themselves.
                  </p>
                </div>
                </div>
              </article>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 3. COMPARISON TABLE ============ */}
      <section id="compare" className="bg-alt cv-auto">
        <div className="container-site section">
          <div className="max-w-[760px] mx-auto text-center">
            {/* [review] */}
            <SplitHeading
              as="h2"
              text="Which One Is You?"
              className="type-h2 text-primary"
            />
            <Reveal delayMs={80}>
              {/* [review] */}
              <p className="type-small text-secondary mt-4">
                Not sure where to start? Start with the consultation. It decides
                the rest.
              </p>
            </Reveal>
          </div>

          {/* [review] — mobile treatment: single semantic table kept scrollable
              inside .table-scroll (never page-level horizontal scroll at 375px) */}
          <Reveal className="mt-10 reveal-scale">
            <div className="table-scroll rounded-2xl border border-hairline-soft bg-surface-1">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">
                  {/* [review] */}
                  Comparison of the three ways to work with Aditya
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th
                      scope="col"
                      className={`p-4 border-b border-hairline border-t-2 border-t-gold-500 ${goldTint} align-bottom`}
                    >
                      <span className="eyebrow block text-[0.625rem] mb-1">
                        Recommended
                      </span>
                      <span className="font-display text-[1.125rem] font-medium text-gold-300">
                        Discovery Consultation
                      </span>
                    </th>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="font-display text-[1.125rem] font-medium text-primary">
                        Monthly Coaching
                      </span>
                    </th>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="font-display text-[1.125rem] font-medium text-primary">
                        Online Plan
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr
                      key={row.label}
                      className="transition-colors hover:bg-[rgba(201,162,75,0.04)]"
                    >
                      <th
                        scope="row"
                        className={`${cellBase} font-semibold text-primary`}
                      >
                        {row.label}
                      </th>
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          className={`${cellBase} text-secondary ${i === 0 ? goldTint : ""}`}
                        >
                          {cell === DASH ? <NotIncluded /> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* CTA row — second conversion surface, same three targets */}
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-primary align-middle type-small">
                      CTA
                    </th>
                    <td className={`p-4 ${goldTint}`}>
                      <CtaLink
                        href={BOOK_URL}
                        className="btn-gold"
                        data={{ page: "programs", cta: "compare_book_now", target: BOOK_URL }}
                      >
                        Book Now
                      </CtaLink>
                    </td>
                    <td className="p-4">
                      <CtaLink
                        external
                        href={WA_MONTHLY}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_apply_now", target: "whatsapp" }}
                      >
                        Apply Now
                      </CtaLink>
                    </td>
                    <td className="p-4">
                      <CtaLink
                        external
                        href={WA_ONLINE}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_learn_more", target: "whatsapp" }}
                      >
                        Learn More
                      </CtaLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 4. PRICE-REASSURANCE LINE ============ */}
      <section className="bg-surface-1 border-y border-hairline-soft">
        <div className="container-site py-12 md:py-16">
          {/* Gold-thread stitches bracket the reassurance line, drawing in on scroll */}
          <div className="thread-h sd-draw w-24 mx-auto mb-10" aria-hidden="true" />
          <Reveal className="text-center">
            {/* [review] */}
            <p className="font-display text-[1.375rem] md:text-[1.75rem] leading-snug tracking-[-0.01em] text-primary max-w-[34ch] mx-auto">
              The {PRICE_CONSULT} consultation is the only price you decide on
              today.
            </p>
            {/* [review] */}
            <p className="type-small text-secondary mt-5 max-w-[62ch] mx-auto">
              Coaching and plan pricing is shared after we talk — once I
              understand your goals, I quote what actually fits. No packages
              pushed on you. No pressure. Refundable per our{" "}
              <Link
                href="/refund"
                className="underline underline-offset-4 decoration-[var(--hairline-gold)] hover:text-primary"
              >
                refund policy
              </Link>
              .
            </p>
          </Reveal>
          <div className="thread-h sd-draw w-24 mx-auto mt-10" aria-hidden="true" />
        </div>
      </section>

      {/* ============ 5. FAQ ============ */}
      <section className="bg-base cv-auto">
        <div className="container-site section">
          <div className="max-w-[760px] mx-auto">
            {/* [review] */}
            <SplitHeading
              as="h2"
              text="Questions Men Ask Before Starting"
              className="type-h2 text-primary text-center"
            />
            <div className="mt-10">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delayMs={i * 60}>
                  <FaqItem question={f.q} defaultOpen={i === 0}>
                    {f.aJsx ?? f.a}
                  </FaqItem>
                </Reveal>
              ))}
            </div>
            <Reveal delayMs={120}>
              <p className="type-caption text-muted mt-8 text-center">
                Individual results vary. Aditya is a lifestyle coach, not a
                doctor or registered dietitian — see the disclaimer in the
                footer.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 6. CTA BAND ============ */}
      {/* Built in-page (not FinalCta) — spec adds a trust micro-line + bg-void
          band + "Book Now" label + overshoot pop on the gold button. */}
      <section className="bg-void aurora grain border-t border-hairline-soft relative overflow-hidden">
        <div
          className="container-site section flex flex-col items-center text-center"
          style={{ paddingBottom: 112 }}
        >
          <SplitHeading
            as="h2"
            text="The man you want to become is waiting for one decision."
            className="type-h2 text-primary max-w-[18ch] mx-auto"
          />
          <Reveal delayMs={100}>
            <p className="type-lead text-secondary mt-4 max-w-xl mx-auto">
              Start with a free blueprint. Or book a consultation today. Either
              way — start now.
            </p>
          </Reveal>
          <Reveal
            delayMs={200}
            className="mt-8 w-full sm:w-auto"
            style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
          >
            <div className="cta-stack justify-center">
              <CtaLink
                href={BOOK_URL}
                className="btn-gold"
                data={{ page: "programs", cta: "band_book_now", target: BOOK_URL }}
              >
                Book Now
              </CtaLink>
              <CtaLink
                href="/tools"
                className="btn-outline"
                data={{ page: "programs", cta: "band_blueprint", target: "/tools" }}
              >
                Get My Free Blueprint
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delayMs={280}>
            {/* [review] */}
            <p className="type-caption text-muted mt-6">
              45 minutes. Complete clarity. {PRICE_CONSULT}.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
