import type { Metadata } from "next";
import Link from "next/link";

import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { BLUEPRINT_PDF } from "@/lib/config";
import { businessSchema, personSchema } from "@/lib/schema";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ============================================================
// BUILD SPEC — HOME (/) — hub of the funnel.
// Global system (header, footer, WhatsApp FAB, cookie banner) is inherited
// from app/layout.tsx. STUBS (sendToEmailProvider, track) live in lib/config
// and are wired inside the shared <LeadMagnetForm>.
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "Men's Lifestyle Coach Kolkata | Aditya Upadhyay",
  description:
    "Rebuild your body, mind and confidence. Men's lifestyle and transformation coaching in Kolkata and worldwide online. Book a ₹2,000 consultation.",
  path: "/",
});

// ---- Single-source link map (spec CONFIG BLOCK) ----
const LINKS = {
  blueprint: "/tools#blueprint",
  book: "/book",
  method: "/method",
  results: "/results",
  tools: "/tools",
  programs: "/programs",
  about: "/about",
} as const;

// ---- Swappable image constants (labels render inside PlaceholderImage;
// swap each call site for a real <img> of the SAME w/h) ----
const IMAGES = {
  heroPortrait: {
    w: 720,
    h: 900,
    alt: "Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata",
  },
  founderPortrait: { w: 560, h: 700, alt: "Aditya Kumar Upadhyay portrait" },
  proof: { w: 480, h: 600 },
} as const;

// ---- Page-level JSON-LD in ONE swappable constant (Person +
// LocalBusiness/Service). Person + LocalBusiness reuse the site-wide
// lib/schema objects (also emitted in the layout — identical @ids merge);
// the Service ties Kolkata locality/geo to a worldwide online service area. ----
const HOME_SCHEMA = [
  personSchema,
  businessSchema,
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_ORIGIN}/#coaching-service`,
    name: "Men's Lifestyle & Transformation Coaching",
    serviceType: "Lifestyle coaching",
    provider: { "@id": `${SITE_ORIGIN}/#business` },
    areaServed: "Worldwide",
    serviceArea: "Worldwide (online)",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_ORIGIN}/book`,
      serviceLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: 22.5726, longitude: 88.3639 },
      },
    },
    offers: {
      "@type": "Offer",
      name: "Discovery Consultation",
      price: "2000",
      priceCurrency: "INR",
      url: `${SITE_ORIGIN}/book`,
    },
  },
];

/* [review] — chip summaries are condensed-in-voice from the verbatim /method
   step copy (full copy lives on /method); owner may want exact wording pulled
   instead. Labels + numerals are per spec. */
const METHOD_STEPS = [
  {
    num: "01",
    label: "LIFESTYLE FIRST",
    body: "Fix how you live first — sleep, waking, movement, daily habits. This alone starts changing your body.",
  },
  {
    num: "02",
    label: "NUTRITION",
    body: "Only once lifestyle is stable do we touch what you eat. Never before.",
  },
  {
    num: "03",
    label: "SUPPLEMENTS",
    body: "Once lifestyle and nutrition work, supplements fill the gaps. They support — never replace.",
  },
  {
    num: "04",
    label: "MEDICAL",
    body: "If needed, always last, always under a doctor. Sustainable change, one layer at a time.",
  },
] as const;

// Lead-magnet strings passed as props (Section 5)
const BLUEPRINT_BUTTON_LABEL = "Send Me the Blueprint"; /* [review] */
const BLUEPRINT_PDF_LABEL = "Download the Lifestyle Blueprint (PDF)"; /* [review] */
const BLUEPRINT_SUCCESS_TITLE = "You're in."; /* [review] */
const BLUEPRINT_SUCCESS_BODY = "Check your inbox for the Lifestyle Blueprint."; /* [review] */

// Teaser cards route to /programs for context; the primary "Apply Now" →
// WhatsApp conversion lives on /programs itself.
const SEE_PROGRAMS_LABEL = "See Programs"; /* [review] */

// Shared inline text-link style (page-scoped)
const TEXT_LINK =
  "inline-block py-2 font-semibold text-gold-300 underline-offset-4 transition-colors hover:text-gold-200 hover:underline";

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />

      {/* ============ SECTION 1 — HERO ============ */}
      <section
        id="hero"
        className="bg-void glow-top grain border-b border-hairline-soft"
      >
        <div className="container-site section-lg grid items-center gap-12 nav:grid-cols-[55fr_45fr] nav:gap-16">
          <div>
            {/* Scripted entrance: above-fold Reveals fire immediately via IO;
                delays ~70ms apart starting ~80ms after paint. */}
            <Reveal as="p" delayMs={80} className="eyebrow">
              {"MEN'S LIFESTYLE COACH · COACHING WORLDWIDE"}
            </Reveal>
            {/* LCP element — NEVER wrapped in Reveal; paints at final state frame 1 */}
            <h1 className="type-h1 text-primary mt-4 max-w-[17ch]">
              Most men are living below their potential. This page changes
              that.
            </h1>
            <Reveal
              as="p"
              delayMs={150}
              className="type-lead text-secondary mt-6 max-w-[46ch]"
            >
              {
                "Men's Lifestyle Coach helping men rebuild their body, mind and confidence."
              }{" "}
              {/* spec's "|" rendered as a visual separator; phrase drops to its own line on mobile */}
              <span className="inline-block">
                <span aria-hidden="true" className="text-muted">
                  |
                </span>{" "}
                Coaching worldwide
              </span>
            </Reveal>
            <Reveal delayMs={220} className="mt-8">
              <div className="cta-stack">
                <Link href={LINKS.blueprint} className="btn-gold">
                  Get My Free Blueprint
                </Link>
                <Link href={LINKS.book} className="btn-outline">
                  Book a Consultation
                </Link>
              </div>
            </Reveal>
            <Reveal as="p" delayMs={290} className="type-caption text-muted mt-4">
              Free blueprint. No spam. Instant download.
            </Reveal>
          </div>

          {/* Portrait — ~600ms fade via the shared 0.6s reveal transition */}
          <Reveal
            delayMs={300}
            className="relative mx-auto w-full max-w-[420px] nav:max-w-none"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(55%_45%_at_50%_38%,rgba(201,162,75,0.16),transparent_70%)]"
            />
            {/* Swap for real <img src={HERO_PORTRAIT} width={720} height={900}
                loading="eager" fetchPriority="high" decoding="async" /> */}
            <PlaceholderImage
              label="HERO PORTRAIT"
              w={IMAGES.heroPortrait.w}
              h={IMAGES.heroPortrait.h}
              variant="portrait"
              alt={IMAGES.heroPortrait.alt}
            />
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 2 — METHOD TEASER ============ */}
      <section id="method-teaser" className="cv-auto bg-base">
        <div className="container-site section">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">THE METHOD</p>
            {/* [review] */}
            <h2 className="type-h2 text-primary mt-3">
              The Right Order of Change. Most coaches get this wrong.
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 nav:grid-cols-4">
            {METHOD_STEPS.map((step, i) => (
              <Reveal as="li" key={step.num} delayMs={i * 60} className="relative">
                <div className="card h-full">
                  <p className="type-numeral" aria-hidden="true">
                    {step.num}
                  </p>
                  <p className="type-step text-primary mt-3">{step.label}</p>
                  <p className="type-small text-secondary mt-2">{step.body}</p>
                </div>
                {/* decorative 01→04 order connector (desktop only) */}
                {i < METHOD_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 -right-5 hidden h-px w-5 bg-hairline-gold nav:block"
                  />
                )}
              </Reveal>
            ))}
          </ol>
          <Reveal delayMs={260} className="mt-8">
            <Link href={LINKS.method} className={TEXT_LINK}>
              {"Read the full method →"}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 3 — TWO AUDIENCE CARDS ============ */}
      <section
        id="audience"
        className="cv-auto bg-alt border-y border-hairline-soft"
      >
        <div className="container-site section">
          <Reveal className="text-center">
            {/* eyebrow doubles as the section heading to keep heading order */}
            <h2 className="eyebrow">WHO THIS IS FOR</h2>
            {/* [review] */}
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <article className="card-light h-full">
                <p className="eyebrow card-gold">THE YOUNG MAN · 22–30</p>
                {/* [review] */}
                <p className="type-body mt-4">
                  You want direction. You want to build yourself the right way
                  from the start. You do not want to waste years figuring out
                  what actually works. This is for you.
                </p>
              </article>
            </Reveal>
            <Reveal delayMs={80} className="h-full">
              <article className="card-dark-gold h-full">
                <p className="eyebrow">THE SUCCESSFUL MAN · 30–50</p>
                {/* [review] */}
                <p className="type-body mt-4">
                  You built the career. You made the money. But somewhere along
                  the way you lost your health, your drive and your confidence.
                  You want it back. This is for you too.
                </p>
              </article>
            </Reveal>
          </div>
          <Reveal delayMs={160} className="mt-10 text-center">
            <p className="type-h3 text-primary">
              Two different men. The same right order of change.
            </p>
            {/* [review] */}
            <p className="mt-3">
              <Link href={LINKS.method} className={TEXT_LINK}>
                {"See the method →"}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 4 — PROOF TEASER ============ */}
      <section id="proof" className="cv-auto bg-base">
        <div className="container-site section">
          <Reveal className="max-w-2xl">
            <h2 className="type-h2 text-primary">Real Men. Real Results.</h2>
            <p className="type-lead text-secondary mt-4">
              No filters. No shortcuts. Just discipline and the right guidance.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <figure className="card h-full">
                {/* static side-by-side pair (no slider — protects first paint).
                    Swap for real <img loading="lazy" width={480} height={600} /> */}
                <div className="grid grid-cols-2 gap-3">
                  <PlaceholderImage
                    label="BEFORE"
                    w={IMAGES.proof.w}
                    h={IMAGES.proof.h}
                    variant="portrait"
                    alt="Aditya before his transformation, 100kg"
                  />
                  <PlaceholderImage
                    label="AFTER"
                    w={IMAGES.proof.w}
                    h={IMAGES.proof.h}
                    variant="portrait"
                    alt="Aditya after his transformation"
                  />
                </div>
                <blockquote className="type-body text-secondary mt-6">
                  This was me. 100kg. Zero confidence. The decision to change
                  was the hardest part. Everything else followed.
                </blockquote>
                <figcaption className="type-caption text-muted mt-4">
                  — Aditya, before coaching
                </figcaption>
                {/* [review] */}
              </figure>
            </Reveal>
            <Reveal delayMs={100} className="h-full">
              <figure className="card h-full">
                <div className="grid grid-cols-2 gap-3">
                  <PlaceholderImage
                    label="BEFORE"
                    w={IMAGES.proof.w}
                    h={IMAGES.proof.h}
                    variant="portrait"
                    alt="Client before his transformation"
                  />
                  <PlaceholderImage
                    label="AFTER"
                    w={IMAGES.proof.w}
                    h={IMAGES.proof.h}
                    variant="portrait"
                    alt="Client after his transformation"
                  />
                </div>
                <blockquote className="type-body text-secondary mt-6">
                  He did not come to me to lose weight. He came because he did
                  not recognize himself anymore. We did not just change his
                  body. We changed his entire lifestyle.
                </blockquote>
                <figcaption className="type-caption text-muted mt-4">
                  — Client transformation
                </figcaption>
                {/* [review] */}
              </figure>
            </Reveal>
          </div>
          <Reveal delayMs={160} className="mt-6">
            <p className="type-caption text-muted">
              Individual results vary. These reflect real clients, not typical
              or guaranteed outcomes.
            </p>
            <p className="mt-4">
              <Link href={LINKS.results} className={TEXT_LINK}>
                {"See all transformations →"}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 5 — LEAD MAGNET (inline) ============ */}
      {/* Owns the #blueprint anchor (hero + final CTA point at /tools#blueprint;
          this inline capture mirrors it on Home). */}
      <section
        id="blueprint"
        className="cv-auto bg-alt border-y border-hairline-soft"
      >
        <div className="container-site section">
          <Reveal className="card glow-top mx-auto max-w-3xl [border-color:var(--hairline-gold)]">
            <p className="eyebrow">FREE DOWNLOAD</p>
            <h2 className="type-h2 text-primary mt-3">The Lifestyle Blueprint</h2>
            <p className="type-lead text-secondary mt-4">
              10 lifestyle changes that rebuild a man completely — body, mind
              and hormones. Start tonight.
            </p>
            {/* Validation, DPDP consent line + /privacy link, pending state,
                sendToEmailProvider({email, source:'home-blueprint'}) stub and
                track('lead_magnet_submit') all live inside LeadMagnetForm.
                Phase 2: real submit could redirect to /thank-you?type=lead. */}
            <LeadMagnetForm
              source="home-blueprint"
              buttonLabel={BLUEPRINT_BUTTON_LABEL}
              pdfHref={BLUEPRINT_PDF}
              pdfLabel={BLUEPRINT_PDF_LABEL}
              successTitle={BLUEPRINT_SUCCESS_TITLE}
              successBody={BLUEPRINT_SUCCESS_BODY}
              className="mt-8"
            >
              {/* success-state cross-sells (internal-linking rule) */}
              <Link href={LINKS.tools} className={TEXT_LINK}>
                {"Get both free guides + the calorie calculator →"}
              </Link>
              <Link href={LINKS.book} className={TEXT_LINK}>
                {"Ready to go further? Book a consultation →"}
              </Link>
            </LeadMagnetForm>
            {/* always-visible cross-sell line (pre-submit too) */}
            <p className="type-small mt-6">
              <Link href={LINKS.tools} className={TEXT_LINK}>
                {"Get both free guides + the calorie calculator →"}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 6 — WORK-WITH-ME TEASER ============ */}
      <section id="programs-teaser" className="cv-auto bg-base">
        <div className="container-site section">
          <Reveal>
            <h2 className="type-h2 text-primary">Work With Me.</h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 pt-2 md:grid-cols-3">
            {/* Card 1 — FEATURED: the single gold CTA in this section → /book */}
            <Reveal as="li" index={0} className="h-full">
              <article className="card card-featured relative flex h-full flex-col">
                <p className="eyebrow absolute -top-3.5 left-6 rounded-full border border-hairline-gold bg-void px-3 py-1.5">
                  RECOMMENDED
                </p>
                <h3 className="type-h3 text-primary mt-2">
                  Discovery Consultation
                </h3>
                <p className="type-price text-gold-300 mt-3">₹2,000</p>
                <p className="type-caption text-muted mt-1">
                  45 minutes · online via WhatsApp
                </p>
                <p className="type-small text-secondary mt-4 mb-6">
                  We go through your current lifestyle, health, habits and
                  goals. I tell you exactly what needs to change and in what
                  order. You leave with complete clarity.
                </p>
                <Link href={LINKS.book} className="btn-gold mt-auto w-full">
                  Book Now
                </Link>
              </article>
            </Reveal>
            {/* Card 2 */}
            <Reveal as="li" index={1} className="h-full">
              <article className="card relative flex h-full flex-col">
                <h3 className="type-h3 text-primary mt-2">Monthly Coaching</h3>
                <p className="type-caption text-muted mt-3">
                  Price disclosed after consultation
                </p>
                <p className="type-small text-secondary mt-4 mb-6">
                  Full lifestyle transformation. Body. Mind. Confidence.
                  Health. Weekly check ins. Full accountability.
                </p>
                <Link
                  href={LINKS.programs}
                  className="btn-outline mt-auto w-full"
                >
                  {SEE_PROGRAMS_LABEL}
                </Link>
              </article>
            </Reveal>
            {/* Card 3 */}
            <Reveal as="li" index={2} className="h-full">
              <article className="card relative flex h-full flex-col">
                <h3 className="type-h3 text-primary mt-2">Online Plan</h3>
                <p className="type-caption text-muted mt-3">
                  Price disclosed after consultation
                </p>
                <p className="type-small text-secondary mt-4 mb-6">
                  A complete written lifestyle, nutrition and training plan
                  built specifically for your body, your goals and your life.
                  No guesswork. Just execution.
                </p>
                <Link
                  href={LINKS.programs}
                  className="btn-outline mt-auto w-full"
                >
                  {SEE_PROGRAMS_LABEL}
                </Link>
              </article>
            </Reveal>
          </ul>
          <Reveal delayMs={300} className="mt-8">
            <Link href={LINKS.programs} className={TEXT_LINK}>
              {"Compare all three ways to work with me →"}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 7 — FOUNDER TEASER ============ */}
      <section
        id="founder"
        className="cv-auto bg-alt grain border-t border-hairline-soft"
      >
        <div className="container-site section grid items-center gap-10 md:grid-cols-[4fr_5fr] md:gap-16">
          <Reveal className="mx-auto w-full max-w-[380px] md:max-w-none">
            {/* Swap for real <img loading="lazy" width={560} height={700}
                decoding="async" /> */}
            <PlaceholderImage
              label="FOUNDER PORTRAIT"
              w={IMAGES.founderPortrait.w}
              h={IMAGES.founderPortrait.h}
              variant="portrait"
              alt={IMAGES.founderPortrait.alt}
            />
          </Reveal>
          <Reveal delayMs={120}>
            <p className="eyebrow">THE COACH</p>
            {/* [review] */}
            <h2 className="type-h2 text-primary mt-3">
              I rebuilt myself from the ground up.
            </h2>
            {/* [review] — pulled from /about H1 voice */}
            <blockquote className="mt-6 border-l-2 border-hairline-gold pl-5">
              <p className="type-body text-secondary">
                I am not a celebrity trainer. I am not a gym influencer. I am
                someone who rebuilt himself completely from the ground up. From
                100kg with zero confidence to coaching some of the most
                successful men in Kolkata.
              </p>
              <p className="type-body text-secondary mt-4">
                I help men get that back. Not with a crash diet. Not with a
                supplement stack. With a complete lifestyle redesign that lasts
                for the rest of their life.
              </p>
            </blockquote>
            <p className="mt-6">
              <Link href={LINKS.about} className={TEXT_LINK}>
                {"My story →"}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 8 — FINAL CTA ============ */}
      {/* Shared FinalCta band (surface-warm, FAB clearance built in);
          wrapper div carries the spec'd #final-cta anchor. */}
      <div id="final-cta">
        <FinalCta
          heading="The man you want to become is waiting for one decision."
          sub="Start with a free blueprint. Or book a consultation today. Either way — start now."
          primaryLabel="Get My Free Blueprint"
          primaryHref={LINKS.blueprint}
          secondaryLabel="Book a Consultation"
          secondaryHref={LINKS.book}
        />
      </div>
    </>
  );
}
