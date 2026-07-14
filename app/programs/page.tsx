import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import PriceTicker from "@/components/programs/PriceTicker";
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
// One WhatsApp prefill per program (Discovery uses /book, not WhatsApp).
const WA_LIFESTYLE = waLink("Hi Aditya, I'd like to apply for Lifestyle Coaching.");
const WA_PRESENCE = waLink(
  "Hi Aditya, I want to know more about Presence & Personality Coaching."
);
const WA_COMPLETE = waLink(
  "Hi Aditya, I'd like to apply for the Complete Transformation Program."
);
const WA_WRITTEN = waLink("Hi Aditya, tell me more about Personalized Written Plans.");

// ---- Swappable emblem placeholders (~64×64) — set to a real asset path to swap ----
const IMG_OFFER_ICON_DISCOVERY = ""; /* TODO: real 64×64 emblem — compass/clarity motif */
const IMG_OFFER_ICON_LIFESTYLE = ""; /* TODO: real 64×64 emblem — recurring/loop motif */
const IMG_OFFER_ICON_PRESENCE = ""; /* TODO: real 64×64 emblem — presence/style motif */
const IMG_OFFER_ICON_COMPLETE = ""; /* TODO: real 64×64 emblem — two-pillars/union motif */
const IMG_OFFER_ICON_WRITTEN = ""; /* TODO: real 64×64 emblem — document/plan motif */

export const metadata: Metadata = pageMetadata({
  title: "Programs for Men | Coaching with Aditya, Kolkata",
  /* [review] — description updated to the new lineup (old names removed) */
  description:
    "Lifestyle coaching, presence & personality coaching, a complete transformation program and personalized written plans for men — every path starts with a ₹2,000 Discovery Consultation. Kolkata or online.",
  path: "/programs",
});

// ===== FAQ — single source of truth for visible copy AND FAQPage JSON-LD =====
/* [review] — all 5 Q&A invented in Aditya's voice; JSON-LD mirrors this verbatim.
   No answer names a specific program tier, so none needed editing for the new lineup. */
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

// ===== Structured data: FAQPage + Service nodes =====
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* [review] — Service schema descriptions for the four coaching/plan programs invented;
   provider references the global Person node by @id (never redefined here). Discovery keeps
   its priced Offer node — it is the entry consultation every program starts with. */
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
    serviceType: "Lifestyle Coaching",
    provider: providerRef,
    areaServed,
    description:
      "Ongoing one-to-one lifestyle transformation coaching for men — body, mind, confidence and health — with weekly check-ins, full accountability and complete guidance at every step. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Presence & Personality Coaching",
    provider: providerRef,
    areaServed,
    description:
      "Monthly one-to-one coaching in presence and personality for men — body language and executive presence, confidence, communication, grooming, dressing for your body type and the mindset underneath it all. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Complete Transformation Program",
    provider: providerRef,
    areaServed,
    description:
      "The flagship program combining both pillars — the full lifestyle rebuild of body, health and training together with the full presence rebuild of style, grooming and communication. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Personalized Written Plans",
    provider: providerRef,
    areaServed,
    description:
      "A complete written lifestyle, nutrition and training plan built specifically for your body, your goals and your life. Pricing disclosed after a Discovery Consultation." /* [review] */,
  },
];

// ===== Comparison table data (the four programs; Discovery is the entry for all) =====
const DASH = "__not_included__";
const CHECK = "__included__";
const HIGHLIGHT = 2; // Complete Transformation column — flagship tint
/* [review] — all comparison cells invented (row labels + values) */
const compareRows: { label: string; cells: ReactNode[] }[] = [
  {
    label: "Focus",
    cells: ["Body & lifestyle", "Presence & style", "Both pillars", "Written plan"],
  },
  {
    label: "Format",
    cells: [
      "Monthly coaching",
      "Monthly coaching",
      "Monthly coaching",
      "One-time written plan",
    ],
  },
  { label: "Weekly check-ins", cells: [CHECK, CHECK, CHECK, DASH] },
  { label: "WhatsApp access", cells: [CHECK, CHECK, CHECK, DASH] },
  { label: "Personalized plan", cells: [CHECK, CHECK, CHECK, CHECK] },
  {
    label: `Starts with ${PRICE_CONSULT} Discovery`,
    cells: [CHECK, CHECK, CHECK, CHECK],
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

function Included() {
  return (
    <>
      <CheckIcon className="w-4 h-4 text-gold-500" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <JsonLd data={[faqSchema, ...serviceSchemas]} />
      {/* Page-scoped CSS: the sanctioned grid-template-rows accordion
          transition + reduced-motion guard used by <FaqItem>. */}
      <style>{`
        .faq-panel { transition: grid-template-rows 0.35s var(--ease-out-expo); }
        @media (prefers-reduced-motion: reduce) { .faq-panel { transition: none; } }
      `}</style>

      {/* ============ 1. HERO — "Work With Me." ============ */}
      <section className="bg-void aurora grain relative overflow-hidden">
        {/* Full-viewport opener — a short H1 earns a commanding scale */}
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16">
          <div className="max-w-[820px] mx-auto text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
              <p className="eyebrow">THE PROGRAMS{/* [review] */}</p>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            </div>
            {/* Hero H1 — never animated (LCP paints at final state frame 1) */}
            <h1 className="font-display text-[clamp(3rem,7vw,5.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-primary">
              Work With Me.
            </h1>
            <Reveal delayMs={80}>
              {/* [review] */}
              <p className="type-lead text-secondary mt-6">
                Start with a conversation. Then we build — the body, the presence,
                or the whole man you&apos;re capable of being.
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
                  className="btn-gold shine-loop w-full sm:w-auto"
                  data={{ page: "programs", cta: "hero_book", target: BOOK_URL }}
                >
                  Book the {PRICE_CONSULT} Consultation
                </CtaLink>
                <a
                  href="#compare"
                  className="link-draw type-small text-secondary hover:text-primary transition-colors min-h-[48px] inline-flex items-center"
                >
                  Compare the programs ↓
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Decorative ticker — the four program names, verbatim */}
      <div className="border-y border-hairline-soft bg-void py-5 md:py-7">
        <Marquee
          items={[
            "Lifestyle Coaching",
            "Presence & Personality Coaching",
            "Complete Transformation Program",
            "Personalized Written Plans",
          ]}
          speedS={38}
        />
      </div>

      {/* ============ 2. THE OFFER — DISCOVERY BAND + FOUR PROGRAMS ============ */}
      <section className="bg-base aurora relative overflow-hidden isolate">
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
            <p className="eyebrow text-center">Every Plan Starts Here</p>
          </Reveal>

          {/* --- Discovery Consultation — the entry gate, centered dominant band --- */}
          <div className="mt-10 max-w-[840px] mx-auto">
            <Reveal
              delayMs={80}
              style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
            >
              <article
                className="card card-featured relative"
                style={{ background: "var(--surface-warm)" }}
              >
                <span
                  className="shine-loop absolute -top-3.5 right-6 z-10 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-gold"
                  style={{ background: "var(--grad-gold)", boxShadow: "var(--glow-gold)" }}
                >
                  Recommended
                </span>
                {/* Inner .spot carries the cursor glow (kept off the article so
                    the badge can straddle the top edge un-clipped). */}
                <div className="spot flex flex-col">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    {/* Left — identity + body */}
                    <div className="flex flex-col">
                      <div className="float-idle self-start">
                        <OfferIcon
                          src={IMG_OFFER_ICON_DISCOVERY}
                          alt="Discovery Consultation"
                        />
                      </div>
                      <h2 className="type-h3 text-primary mt-5">
                        Discovery Consultation
                      </h2>
                      {/* the number the whole page exists to sell — let it carry weight */}
                      <p className="font-display text-gold-grad mt-3 text-[clamp(2.1rem,3.2vw,2.8rem)] leading-none">
                        <PriceTicker value={2000} />
                      </p>
                      <p className="type-small text-muted mt-1">
                        45 minutes · online via WhatsApp
                      </p>
                      <p className="type-body text-secondary mt-5">
                        We go through your current lifestyle, health, habits and
                        goals. I tell you exactly what needs to change and in what
                        order. You leave with complete clarity.
                      </p>
                    </div>
                    {/* Right — what you leave with */}
                    <div className="flex flex-col md:border-l md:border-hairline-soft md:pl-10">
                      <p className="type-caption uppercase tracking-[0.12em] text-muted">
                        What you leave with
                      </p>
                      {/* [review] — bullet list invented in Aditya's voice */}
                      <ul className="mt-4 flex flex-col gap-3">
                        {/* each takeaway lands on its own beat */}
                        <Reveal as="li" index={0} className="flex gap-3 type-small text-secondary">
                          <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                          <span>
                            A clear read on where your lifestyle, health and habits
                            actually stand
                          </span>
                        </Reveal>
                        <Reveal as="li" index={1} className="flex gap-3 type-small text-secondary">
                          <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                          <span>The exact order of what to change first — no guessing</span>
                        </Reveal>
                        <Reveal as="li" index={2} className="flex gap-3 type-small text-secondary">
                          <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                          <span>
                            Your biggest blocker named out loud, and how to move past it
                          </span>
                        </Reveal>
                        <Reveal as="li" index={3} className="flex gap-3 type-small text-secondary">
                          <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                          <span>
                            A realistic picture of what&apos;s possible in the next 3–6
                            months
                          </span>
                        </Reveal>
                        <Reveal as="li" index={4} className="flex gap-3 type-small text-secondary">
                          <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                          <span>
                            Complete clarity on whether coaching is right for you — zero
                            pressure
                          </span>
                        </Reveal>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 w-full max-w-[440px] md:mx-auto">
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
          </div>

          {/* Gold-thread stitch between the entry gate and the programs */}
          <div className="thread-h sd-draw w-24 mx-auto my-14" aria-hidden="true" />

          <Reveal>
            {/* [review] */}
            <p className="eyebrow text-center">Then We Build</p>
          </Reveal>

          {/* --- The four programs: 2×2 (md) / 4-up (xl) --- */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-7 items-stretch">
            {/* --- Lifestyle Coaching --- */}
            <Reveal delayMs={0} className="h-full">
              <TiltCard className="h-full">
                <article className="card-dark-gold h-full">
                  <div className="spot flex flex-col h-full">
                    <div className="float-idle self-start" style={{ animationDelay: "0.6s" }}>
                      <OfferIcon src={IMG_OFFER_ICON_LIFESTYLE} alt="Lifestyle Coaching" />
                    </div>
                    <h2 className="card-head type-h3 mt-5">Lifestyle Coaching</h2>
                    <p className="type-body font-medium text-secondary mt-3">
                      Monthly · price disclosed after your consultation
                    </p>
                    {/* verbatim body — do not reword */}
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
                        href={WA_LIFESTYLE}
                        className="btn-wa w-full"
                        data={{ page: "programs", cta: "lifestyle_apply_now", target: "whatsapp" }}
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        Apply Now<span className="sr-only"> for Lifestyle Coaching</span>
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

            {/* --- Presence & Personality Coaching (NEW) --- */}
            <Reveal delayMs={90} className="h-full">
              <TiltCard className="h-full">
                <article className="card-dark-gold h-full">
                  <div className="spot flex flex-col h-full">
                    <div className="float-idle self-start" style={{ animationDelay: "0.9s" }}>
                      <OfferIcon
                        src={IMG_OFFER_ICON_PRESENCE}
                        alt="Presence & Personality Coaching"
                      />
                    </div>
                    <h2 className="card-head type-h3 mt-5">
                      Presence &amp; Personality Coaching
                    </h2>
                    <p className="type-body font-medium text-secondary mt-3">
                      Monthly · price disclosed after your consultation
                    </p>
                    {/* [review] — punchy body line in Aditya's voice */}
                    <p className="type-body text-secondary mt-5">
                      How you stand. How you speak. How you dress. How you show up in
                      any room.
                    </p>
                    <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                      What we work on
                    </p>
                    {/* [review] — bullets in Aditya's voice from his brief */}
                    <ul className="mt-4 flex flex-col gap-3">
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Body language and executive presence — how you carry
                          yourself in any room
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>Confidence in social situations, not just in the gym</span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>Communication and networking that actually lands</span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Grooming done right — hairstyle and beard for your face
                          shape, plus skincare fundamentals
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Dressing for your body type, in colours that complement
                          Indian skin tones
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Mindset and emotional intelligence underneath all of it
                        </span>
                      </li>
                    </ul>
                    <div className="mt-auto pt-8">
                      <CtaLink
                        external
                        href={WA_PRESENCE}
                        className="btn-wa w-full"
                        data={{ page: "programs", cta: "presence_apply_now", target: "whatsapp" }}
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        Apply Now
                        <span className="sr-only"> for Presence &amp; Personality Coaching</span>
                      </CtaLink>
                      {/* [review] */}
                      <p className="type-caption text-muted text-center mt-3">
                        Starts after a Discovery Consultation, like every path here.
                      </p>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>

            {/* --- Complete Transformation Program (NEW · flagship) --- */}
            <Reveal delayMs={180} className="h-full">
              <TiltCard className="h-full">
                <article className="card-dark-gold h-full">
                  <div className="spot flex flex-col h-full">
                    {/* [review] — flagship mini-eyebrow (no gold border; that stays on ₹2,000) */}
                    <p className="eyebrow text-gold-300">Flagship</p>
                    <div
                      className="float-idle self-start mt-2"
                      style={{ animationDelay: "1.2s" }}
                    >
                      <OfferIcon
                        src={IMG_OFFER_ICON_COMPLETE}
                        alt="Complete Transformation Program"
                      />
                    </div>
                    <h2 className="card-head type-h3 mt-5">
                      Complete Transformation Program
                    </h2>
                    <p className="type-body font-medium text-secondary mt-3">
                      Both pillars · price disclosed after your consultation
                    </p>
                    {/* [review] — his verbatim line kept: "A strong body should be matched with a strong presence." */}
                    <p className="type-body text-secondary mt-5">
                      Both pillars in one program — the full lifestyle rebuild and the
                      full presence rebuild. A strong body should be matched with a
                      strong presence.
                    </p>
                    <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                      What&apos;s included
                    </p>
                    {/* [review] — bullets in Aditya's voice */}
                    <ul className="mt-4 flex flex-col gap-3">
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Everything in Lifestyle Coaching — body, health, training
                          and nutrition
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Everything in Presence &amp; Personality Coaching — style,
                          grooming and communication
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          Weekly check-ins and full accountability across both pillars
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>
                          One coach, one plan, both halves of the man moving together
                        </span>
                      </li>
                      <li className="flex gap-3 type-small text-secondary">
                        <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                        <span>Direct access to me between sessions on WhatsApp</span>
                      </li>
                    </ul>
                    <div className="mt-auto pt-8">
                      <CtaLink
                        external
                        href={WA_COMPLETE}
                        className="btn-wa w-full"
                        data={{ page: "programs", cta: "complete_apply_now", target: "whatsapp" }}
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        Apply Now
                        <span className="sr-only"> for the Complete Transformation Program</span>
                      </CtaLink>
                      {/* [review] */}
                      <p className="type-caption text-muted text-center mt-3">
                        The full rebuild. Still starts with a Discovery Consultation.
                      </p>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>

            {/* --- Personalized Written Plans --- */}
            <Reveal delayMs={270} className="h-full">
              <TiltCard className="h-full">
                <article className="card-dark-gold h-full">
                  <div className="spot flex flex-col h-full">
                    <div className="float-idle self-start" style={{ animationDelay: "1.5s" }}>
                      <OfferIcon
                        src={IMG_OFFER_ICON_WRITTEN}
                        alt="Personalized Written Plans"
                      />
                    </div>
                    {/* [review] — retitled from "Online Plan" */}
                    <h2 className="card-head type-h3 mt-5">Personalized Written Plans</h2>
                    <p className="type-body font-medium text-secondary mt-3">
                      Online · price disclosed after your consultation
                    </p>
                    {/* verbatim body — do not reword */}
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
                        href={WA_WRITTEN}
                        className="btn-wa w-full"
                        data={{ page: "programs", cta: "written_learn_more", target: "whatsapp" }}
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        Learn More<span className="sr-only"> about Personalized Written Plans</span>
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
              {/* [review] — Discovery is the entry for all, said here instead of a column */}
              <p className="type-small text-secondary mt-4">
                Every program starts with the {PRICE_CONSULT} Discovery Consultation
                — it decides which of these is right for you.
              </p>
            </Reveal>
          </div>

          {/* [review] — mobile treatment: single semantic table kept scrollable
              inside .table-scroll (never page-level horizontal scroll at 375px) */}
          <Reveal className="mt-10 reveal-scale">
            <div className="table-scroll rounded-2xl border border-hairline-soft bg-surface-1">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <caption className="sr-only">
                  {/* [review] */}
                  Comparison of the four programs you can work with Aditya on
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="font-display text-[1.125rem] font-medium text-primary">
                        Lifestyle Coaching
                      </span>
                    </th>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="font-display text-[1.125rem] font-medium text-primary">
                        Presence &amp; Personality Coaching
                      </span>
                    </th>
                    <th
                      scope="col"
                      className={`p-4 border-b border-hairline border-t-2 border-t-gold-500 ${goldTint} align-bottom`}
                    >
                      <span className="eyebrow block text-[0.625rem] mb-1">
                        Flagship{/* [review] */}
                      </span>
                      <span className="font-display text-[1.125rem] font-medium text-gold-300">
                        Complete Transformation Program
                      </span>
                    </th>
                    <th scope="col" className="p-4 border-b border-hairline align-bottom">
                      <span className="font-display text-[1.125rem] font-medium text-primary">
                        Personalized Written Plans
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, ri) => (
                    <Reveal
                      as="tr"
                      key={row.label}
                      delayMs={ri * 60}
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
                          className={`${cellBase} text-secondary ${i === HIGHLIGHT ? goldTint : ""}`}
                        >
                          {cell === DASH ? (
                            <NotIncluded />
                          ) : cell === CHECK ? (
                            <Included />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </Reveal>
                  ))}
                  {/* CTA row — second conversion surface, same four targets */}
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-primary align-middle type-small">
                      CTA
                    </th>
                    <td className="p-4">
                      <CtaLink
                        external
                        href={WA_LIFESTYLE}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_lifestyle_apply", target: "whatsapp" }}
                      >
                        Apply Now<span className="sr-only"> for Lifestyle Coaching</span>
                      </CtaLink>
                    </td>
                    <td className="p-4">
                      <CtaLink
                        external
                        href={WA_PRESENCE}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_presence_apply", target: "whatsapp" }}
                      >
                        Apply Now
                        <span className="sr-only"> for Presence &amp; Personality Coaching</span>
                      </CtaLink>
                    </td>
                    <td className={`p-4 ${goldTint}`}>
                      <CtaLink
                        external
                        href={WA_COMPLETE}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_complete_apply", target: "whatsapp" }}
                      >
                        Apply Now
                        <span className="sr-only"> for the Complete Transformation Program</span>
                      </CtaLink>
                    </td>
                    <td className="p-4">
                      <CtaLink
                        external
                        href={WA_WRITTEN}
                        className="btn-wa"
                        data={{ page: "programs", cta: "compare_written_learn", target: "whatsapp" }}
                      >
                        Learn More<span className="sr-only"> about Personalized Written Plans</span>
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
          <Reveal className="reveal-blur text-center">
            {/* [review] */}
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug tracking-[-0.01em] text-primary max-w-[34ch] mx-auto">
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
