import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import PriceTicker from "@/components/programs/PriceTicker";
import TiltCard from "@/components/TiltCard";
import JsonLd from "@/components/JsonLd";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import CtaLink from "@/components/programs/CtaLink";
import OfferGlyph from "@/components/programs/OfferGlyph";
import FaqItem from "@/components/programs/FaqItem";
import { waLink } from "@/lib/config";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { CONSULT_INCLUDES, LEGAL } from "@/lib/legal";

// ===== Page-level config (swappable constants) =====
// PHASE-2 STUBS — waLink/track come from the ONE global config block (lib/config.ts).
const PRICE_CONSULT = LEGAL.CONSULT_PRICE; // single source of truth (lib/legal.ts); reused in the Audit card, comparison table + reassurance line
const BOOK_URL = "/book";
// One WhatsApp prefill per program (the Transformation Audit uses /book, not WhatsApp).
const WA_LIFESTYLE = waLink("Hi Aditya, I'd like to apply for Lifestyle Coaching.");
const WA_PRESENCE = waLink(
    "Hi Aditya, I'd like to apply for Personality & Presence Coaching."
);
const WA_COMPLETE = waLink(
    "Hi Aditya, I'd like to apply for the Complete Transformation."
);

// ---- Offer emblems (64×64) ----
// Inline gold line-work (components/programs/OfferGlyph.tsx),
// not photography — a portrait cropped to 64px read as an error, and the art
// direction wants tailoring marks here.

export const metadata: Metadata = pageMetadata({
    title: "Programs for Men | Coaching with Aditya, Kolkata",
    /* [review] — description repositioned around complete transformation + the new 3-program lineup */
    description:
        `Complete transformation coaching for men in Kolkata and online — lifestyle coaching, personality & presence coaching, or the complete transformation. Every path starts with a ${PRICE_CONSULT} Transformation Audit.`,
    path: "/programs",
});

// ===== FAQ — single source of truth for visible copy AND FAQPage JSON-LD =====
/* [review] — Q&A in Aditya's voice; the edits below rename the old "Discovery Consultation"
   to "Transformation Audit" and drop the standalone "written plan" reference (that scope now
   folds into the coaching programs). The refund answer keeps its meaning. JSON-LD mirrors this. */
const faqs: { q: string; a: string; aJsx?: ReactNode }[] = [
    {
        q: "Is this online, or do I have to be in Kolkata?",
        /* [review] — renamed Discovery Consultation → Transformation Audit */
        a: "Both work. I'm based in Kolkata and coach men in person and worldwide online. The Transformation Audit is a 45-minute call over WhatsApp, so it doesn't matter where you are.",
    },
    {
        q: "Do you take international clients?",
        /* [review] — "your written plan" → "your plan" (standalone written plans dropped) */
        a: "Yes. I coach men worldwide online. The call, the check-ins and your plan all run remotely — nothing about the process needs you in the same city.",
    },
    {
        q: "What's your refund policy?",
        /* [review] — renamed to Transformation Audit; meaning unchanged */
        a: `Clear terms, no surprises. The ${PRICE_CONSULT} Transformation Audit and coaching are covered by a written refund policy — read it in full on the refund page before you book.`,
        aJsx: (
            <>
                Clear terms, no surprises. The {PRICE_CONSULT} Transformation Audit and coaching
                are covered by a written refund policy — read it in full on the{" "}
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

/* [review] — Service schema descriptions for the audit + three programs invented;
   provider references the global Person node by @id (never redefined here). The Transformation
   Audit keeps its priced Offer node — it is the entry every program starts with. */
const providerRef = { "@id": `${SITE_ORIGIN}/#person` };
const areaServed = ["Kolkata", "Worldwide"];
const serviceSchemas = [
    {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Transformation Audit",
        provider: providerRef,
        areaServed,
        description:
            "A 45-minute online audit via WhatsApp analysing your lifestyle, health, fitness, nutrition, energy, habits, confidence and presence — ending with what is actually holding you back and what needs to be fixed first." /* [review] */,
        offers: {
            "@type": "Offer",
            name: "Transformation Audit",
            price: String(LEGAL.CONSULT_PRICE_INR),
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
            "Monthly one-to-one lifestyle coaching for men — habit building, nutrition guidance, fat loss and muscle gain, workout and fitness protocols, better energy, sleep and recovery, stress management, supplement guidance and overall health optimisation. Pricing disclosed after a Transformation Audit." /* [review] */,
    },
    {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Personality & Presence Coaching",
        provider: providerRef,
        areaServed,
        description:
            "Monthly one-to-one coaching in personality and presence for men — body language, social confidence, communication and networking, style, grooming, dressing for your body type and colours for Indian skin tones, plus the mindset and emotional intelligence underneath it. Pricing disclosed after a Transformation Audit." /* [review] */,
    },
    {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Complete Transformation",
        provider: providerRef,
        areaServed,
        description:
            "The flagship program for men who want a complete transformation — not just a better body or a better wardrobe. It combines both pillars: body, lifestyle, mindset, confidence, personality, presence, style and grooming. Pricing disclosed after a Transformation Audit." /* [review] */,
    },
];

// ===== Comparison table data (the three programs; the Transformation Audit is the entry for all) =====
const CHECK = "__included__";
const HIGHLIGHT = 2; // Complete Transformation column — flagship tint
/* [review] — all comparison cells (row labels + values) reworked for the 3-program lineup */
const compareRows: { label: string; cells: ReactNode[] }[] = [
    {
        label: "Focus",
        cells: ["Body & lifestyle", "Personality & presence", "The complete system"],
    },
    {
        label: "Format",
        cells: ["Monthly coaching", "Monthly coaching", "Monthly coaching"],
    },
    { label: "Weekly check-ins", cells: [CHECK, CHECK, CHECK] },
    { label: "WhatsApp access", cells: [CHECK, CHECK, CHECK] },
    {
        label: `Starts with the ${PRICE_CONSULT} Transformation Audit`,
        cells: [CHECK, CHECK, CHECK],
    },
];

const cellBase = "p-4 border-b border-hairline-soft align-top type-small";
const goldTint = "bg-[rgba(201,162,75,0.06)]";

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
                            {/* [review] — hero sub repositioned around the one complete-transformation system */}
                            <p className="type-lead text-secondary mt-6">
                                Three ways in. One system — body, lifestyle, mindset,
                                personality, presence. Start with the audit, then we build.
                            </p>
                        </Reveal>
                        <div className="gold-line max-w-[220px] mx-auto mt-8" aria-hidden="true" />
                        <Reveal delayMs={140}>
                            {/* [review] */}
                            <p className="type-caption text-muted mt-6">
                                Kolkata · Coaching worldwide online · Every transformation starts
                                with the Transformation Audit.
                            </p>
                        </Reveal>
                        <Reveal delayMs={200} className="mt-10">
                            {/* [review] — hero CTA pair */}
                            <div className="flex flex-col items-center gap-5">
                                <CtaLink
                                    href={BOOK_URL}
                                    className="btn-gold shine-loop w-full sm:w-auto"
                                    data={{ page: "programs", cta: "hero_book", target: BOOK_URL }}
                                >
                                    Book Your Transformation Audit
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

            {/* Decorative ticker — the three program names + the audit, verbatim */}
            <div className="border-y border-hairline-soft bg-void py-5 md:py-7">
                <Marquee
                    items={[
                        "Lifestyle Coaching",
                        "Personality & Presence Coaching",
                        "Complete Transformation",
                        "Transformation Audit",
                    ]}
                    speedS={38}
                />
            </div>

            {/* ============ 2. THE OFFER — AUDIT BAND + THREE PROGRAMS ============ */}
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
                        {/* [review] — the audit band header */}
                        <p className="eyebrow text-center">Every Transformation Starts Here</p>
                    </Reveal>

                    {/* --- Transformation Audit — the entry gate, centered dominant band --- */}
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
                                                <OfferGlyph kind="audit" />
                                            </div>
                                            <h2 className="type-h3 text-primary mt-5">
                                                Transformation Audit
                                            </h2>
                                            {/* the number the whole page exists to sell — let it carry weight */}
                                            <p className="font-display text-gold-grad mt-3 text-[clamp(2.1rem,3.2vw,2.8rem)] leading-none">
                                                <PriceTicker value={LEGAL.CONSULT_PRICE_INR} />
                                            </p>
                                            <p className="type-small text-muted mt-1">
                                                45 minutes · online via WhatsApp
                                            </p>
                                            {/* [review] — audit body copy */}
                                            <p className="type-body text-secondary mt-5">
                                                We analyse your lifestyle, health, fitness, nutrition,
                                                energy, habits, confidence and presence — and identify
                                                what is actually holding you back and what needs to be
                                                fixed first.
                                            </p>
                                        </div>
                                        {/* Right — what you leave with */}
                                        <div className="flex flex-col md:border-l md:border-hairline-soft md:pl-10">
                                            <p className="type-caption uppercase tracking-[0.12em] text-muted">
                                                What you leave with
                                            </p>
                                            {/* [review] — bullets reframed to the audit (analysis areas + what to fix first) */}
                                            <ul className="mt-4 flex flex-col gap-3">
                                                {/* each takeaway lands on its own beat */}
                                                <Reveal as="li" index={0} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>
                                                        A full analysis of your lifestyle, health, fitness and
                                                        nutrition
                                                    </span>
                                                </Reveal>
                                                <Reveal as="li" index={1} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>
                                                        A clear read on your energy, habits, confidence and
                                                        presence
                                                    </span>
                                                </Reveal>
                                                <Reveal as="li" index={2} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>What is actually holding you back, named out loud</span>
                                                </Reveal>
                                                <Reveal as="li" index={3} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>
                                                        Exactly what needs to be fixed first — in the right
                                                        order
                                                    </span>
                                                </Reveal>
                                                <Reveal as="li" index={4} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>
                                                        A realistic picture of what&apos;s possible in the next
                                                        3–6 months
                                                    </span>
                                                </Reveal>
                                                <Reveal as="li" index={5} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>
                                                        Complete clarity on whether coaching is right for you —
                                                        zero pressure
                                                    </span>
                                                </Reveal>
                                                {/* Confirmed inclusions 6 Aug 2026 — copy lives in
                            lib/legal.ts (CONSULT_INCLUDES), not here. */}
                                                <Reveal as="li" index={6} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>{CONSULT_INCLUDES.GIFT_CARD}</span>
                                                </Reveal>
                                                <Reveal as="li" index={7} className="flex gap-3 type-small text-secondary">
                                                    <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                    <span>{CONSULT_INCLUDES.BLUEPRINT}</span>
                                                </Reveal>
                                            </ul>
                                            {/* The fee credit — set apart from the takeaways because
                          it is the money argument, not a deliverable. */}
                                            <p className="type-small text-gold-300 border-l border-hairline-gold mt-5 pl-4">
                                                {CONSULT_INCLUDES.CREDIT}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-8 w-full max-w-[440px] md:mx-auto">
                                        <CtaLink
                                            href={BOOK_URL}
                                            className="btn-gold w-full"
                                            data={{ page: "programs", cta: "audit_book_now", target: BOOK_URL }}
                                        >
                                            Book Your Transformation Audit
                                        </CtaLink>
                                        {/* [review] */}
                                        <p className="type-caption text-muted text-center mt-3">
                                            Every transformation begins here. Refundable per our{" "}
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

                    {/* --- The three programs: stacked (mobile) / 3-up (nav ≥900px) --- */}
                    <div className="mt-10 grid grid-cols-1 nav:grid-cols-3 gap-6 nav:gap-7 items-stretch">
                        {/* --- Lifestyle Coaching --- */}
                        <Reveal delayMs={0} className="h-full">
                            <TiltCard className="h-full">
                                <article className="card-dark-gold h-full">
                                    <div className="spot flex flex-col h-full">
                                        <div className="float-idle self-start" style={{ animationDelay: "0.6s" }}>
                                            <OfferGlyph kind="lifestyle" />
                                        </div>
                                        <h2 className="card-head type-h3 mt-5">Lifestyle Coaching</h2>
                                        <p className="type-body font-medium text-secondary mt-3">
                                            Monthly · price disclosed after your Transformation Audit
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
                                        {/* [review] — scope bullets condensed from the lifestyle brief */}
                                        <ul className="mt-4 flex flex-col gap-3">
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Habit building and lifestyle improvement that holds</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Nutrition guidance built around how you actually eat</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Fat loss, muscle gain and the workout protocols to get
                                                    there
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Better energy, sleep and recovery</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Stress management and supplement guidance</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Overall health optimisation, tracked with weekly
                                                    check-ins
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
                                                Starts after a Transformation Audit so we both know
                                                it&apos;s the right fit.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </TiltCard>
                        </Reveal>

                        {/* --- Personality & Presence Coaching --- */}
                        <Reveal delayMs={90} className="h-full">
                            <TiltCard className="h-full">
                                <article className="card-dark-gold h-full">
                                    <div className="spot flex flex-col h-full">
                                        <div className="float-idle self-start" style={{ animationDelay: "0.9s" }}>
                                            <OfferGlyph kind="presence" />
                                        </div>
                                        <h2 className="card-head type-h3 mt-5">
                                            Personality &amp; Presence Coaching
                                        </h2>
                                        <p className="type-body font-medium text-secondary mt-3">
                                            Monthly · price disclosed after your Transformation Audit
                                        </p>
                                        {/* [review] — punchy body line in Aditya's voice */}
                                        <p className="type-body text-secondary mt-5">
                                            How you stand. How you speak. How you dress. How you show up in
                                            any room.
                                        </p>
                                        <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                                            What we work on
                                        </p>
                                        {/* [review] — bullets condensed from the personality & presence brief */}
                                        <ul className="mt-4 flex flex-col gap-3">
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Body language and presence — how you carry yourself in any
                                                    room
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Social confidence, communication and networking that lands
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Style and grooming: hairstyle, haircut and beard for your
                                                    face
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Skincare basics and personal presentation</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Dressing for your body type, in colours that suit Indian
                                                    skin tones
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>The psychology of attraction</span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>Mindset and emotional intelligence underneath it all</span>
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
                                                <span className="sr-only"> for Personality &amp; Presence Coaching</span>
                                            </CtaLink>
                                            {/* [review] */}
                                            <p className="type-caption text-muted text-center mt-3">
                                                Starts after a Transformation Audit, like every path here.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </TiltCard>
                        </Reveal>

                        {/* --- Complete Transformation (flagship — strongest weight among the programs) --- */}
                        <Reveal delayMs={180} className="h-full">
                            <TiltCard className="h-full">
                                <article
                                    className="card-dark-gold h-full"
                                    style={{
                                        borderColor: "rgba(201,162,75,0.5)",
                                        borderTopWidth: 2,
                                        borderTopColor: "var(--gold-500)",
                                    }}
                                >
                                    <div className="spot flex flex-col h-full">
                                        {/* [review] — flagship eyebrow (the Transformation Audit keeps the featured glow) */}
                                        <p className="eyebrow text-gold-300">Flagship</p>
                                        <div
                                            className="float-idle self-start mt-2"
                                            style={{ animationDelay: "1.2s" }}
                                        >
                                            <OfferGlyph kind="complete" />
                                        </div>
                                        <h2 className="card-head type-h3 mt-5">
                                            Complete Transformation
                                        </h2>
                                        <p className="type-body font-medium text-secondary mt-3">
                                            Both pillars · price disclosed after your Transformation Audit
                                        </p>
                                        {/* verbatim flagship line — do not reword */}
                                        <p className="type-body text-secondary mt-5">
                                            For men who want a complete transformation — not just a better
                                            body or a better wardrobe. A strong body should be matched with
                                            a strong presence.
                                        </p>
                                        <p className="type-caption uppercase tracking-[0.12em] text-muted mt-6">
                                            What&apos;s included
                                        </p>
                                        {/* [review] — bullets combining both pillars */}
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
                                                    Everything in Personality &amp; Presence Coaching — style,
                                                    grooming and communication
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Mindset and confidence built alongside a stronger body
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>
                                                    Weekly check-ins and full accountability across both
                                                    pillars
                                                </span>
                                            </li>
                                            <li className="flex gap-3 type-small text-secondary">
                                                <CheckIcon className="w-4 h-4 mt-1 shrink-0 text-gold-500" />
                                                <span>One coach, one plan, both halves of the man together</span>
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
                                                <span className="sr-only"> for the Complete Transformation</span>
                                            </CtaLink>
                                            {/* [review] */}
                                            <p className="type-caption text-muted text-center mt-3">
                                                The full rebuild. Still starts with a Transformation Audit.
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
                            {/* [review] — the audit is the entry for all, said here instead of a column */}
                            <p className="type-small text-secondary mt-4">
                                Every program starts with the {PRICE_CONSULT} Transformation Audit
                                — it decides which of these is right for you.
                            </p>
                        </Reveal>
                    </div>

                    {/* [review] — mobile treatment: single semantic table kept scrollable inside .table-scroll (never page-level horizontal scroll at 375px) */}
                    <Reveal className="mt-10 reveal-scale">
                        <div className="table-scroll rounded-2xl border border-hairline-soft bg-surface-1">
                            <table className="w-full min-w-[720px] border-collapse text-left">
                                <caption className="sr-only">
                                    {/* [review] */}
                                    Comparison of the three programs you can work with Aditya on
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
                                                Personality &amp; Presence Coaching
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
                                                Complete Transformation
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
                                                    {cell === CHECK ? <Included /> : cell}
                                                </td>
                                            ))}
                                        </Reveal>
                                    ))}
                                    {/* CTA row — second conversion surface, same three targets */}
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
                                                <span className="sr-only"> for Personality &amp; Presence Coaching</span>
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
                                                <span className="sr-only"> for the Complete Transformation</span>
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
                            The Transformation Audit is the only price you decide
                            on today.
                        </p>
                        {/* [review] */}
                        <p className="type-small text-secondary mt-5 max-w-[62ch] mx-auto">
                            Coaching pricing is shared after we talk — once I understand your
                            goals, I quote what actually fits. No packages pushed on you. No
                            pressure. Refundable per our{" "}
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
          band + overshoot pop on the gold button. */}
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
                        {/* [review] — "book a consultation" → "book your Transformation Audit" */}
                        <p className="type-lead text-secondary mt-4 max-w-xl mx-auto">
                            Start with a free blueprint. Or book your Transformation Audit
                            today. Either way — start now.
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
                                Book Your Transformation Audit
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
