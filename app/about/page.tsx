// /about — About / My Story ("The Deep-Trust Page")
// Sells the man, not the offer. No pricing, no program menus. Terminal action:
// Book a Consultation (→ /book) with the free Blueprint fallback (→ /tools).

import type { Metadata } from "next";
import Link from "next/link";

import StoryHero from "@/components/about/StoryHero";
import TransformationSplit from "@/components/about/TransformationSplit";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import { ArrowRightIcon, CheckIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { IG_URL, YOUTUBE_URL, waLink } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ---- Per-page SEO (A6 verbatim) ----
// og:image stays the default OG card: the hero portrait is a 3:4 upright and
// social cards want 1.91:1 — swap via pageMetadata({ ogImage }) once a
// landscape cut exists.
export const metadata: Metadata = pageMetadata({
  title: "About Aditya | Men's Transformation Coach Kolkata",
  // [review] description refreshed 2026-07-21 — complete-transformation keywords
  // (men's transformation coach, confidence, personal development for men).
  description:
    "From 100kg with zero confidence to a men's transformation coach in Kolkata. The story behind coaching that changes how a man looks — and how he shows up: confidence, discipline and presence.",
  path: "/about",
  ogType: "profile",
});

// ---- Social / WhatsApp URL constants (top-level, swappable) ----
const SOCIAL_INSTAGRAM_URL = IG_URL; // confirmed handle (lib/config.ts)
const SOCIAL_YOUTUBE_URL = YOUTUBE_URL; // confirmed channel (lib/config.ts)
const WHATSAPP_URL = waLink(
  "Hi Aditya, I read your story on your site and want to talk.",
);


// ---- §4 credibility strip ("Why men trust the work") ----
// [review] No invented stats or credentials — the only figure is the
// client-supplied 100kg. Restrained trust rows, shown before /results link-out.
const TRUST_POINTS = [
  {
    title: "Eight years in the work.",
    // [review] Matches the timeline copy on this page: two years coaching men,
    // eight years testing every method on himself. No invented figure.
    body: "Two years coaching men. Eight years testing every method on his own body first.",
    href: "/programs",
    linkLabel: "See the programs",
    external: false,
  },
  {
    title: "Real results, real photos.",
    body: "Client transformations shared with permission — no stock photos, no borrowed proof.",
    href: "/results",
    linkLabel: "See the transformations",
    external: false,
  },
  {
    title: "Direct WhatsApp access.",
    body: "Coaching happens with Aditya himself — never handed off to an assistant.",
    href: WHATSAPP_URL,
    linkLabel: "Chat with Aditya",
    external: true,
  },
] as const; // [review]

// Page-local scroll-FX styles used to live here (the .tl-dot timeline-node
// ignite). They came out with §02 MY JOURNEY on 2026-08-31 — the only element
// carrying .tl-dot was that section's refinement loop. Everything this page
// animates now is covered by the shipped kit classes.

// ---- Page-level structured data: this page owns the rich Person entity + nested Service ----
// Geo stays Kolkata; serviceArea worldwide — consistent with the site schema strategy.
const KOLKATA_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Kolkata",
  addressRegion: "West Bengal",
  addressCountry: "IN",
};

const aboutPersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#person`,
  name: "Aditya Kumar Upadhyay",
  jobTitle: "Complete Transformation Coach for Men" /* [review] repositioned 2026-07-21 */,
  url: `${SITE_ORIGIN}/about`,
  image: `${SITE_ORIGIN}/aditya/img_about_hero.jpg`, // real portrait — Person.image wants the man, not the OG card
  address: KOLKATA_ADDRESS,
  homeLocation: {
    "@type": "Place",
    address: KOLKATA_ADDRESS,
  },
  knowsAbout: [
    "lifestyle transformation",
    "men's fitness",
    "nutrition coaching",
    "habit change",
  ],
  sameAs: [SOCIAL_INSTAGRAM_URL, SOCIAL_YOUTUBE_URL],
};

const coachingServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_ORIGIN}/about#service`,
  name: "Men's Lifestyle Transformation Coaching",
  serviceType: "Lifestyle coaching for men",
  description:
    "Lifestyle-first transformation coaching for men — lifestyle, nutrition, supplements and medical guidance, built in the right order. Based in Kolkata, delivered online worldwide.",
  provider: { "@id": `${SITE_ORIGIN}/#person` },
  areaServed: "Worldwide",
  url: `${SITE_ORIGIN}/about`,
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[aboutPersonJsonLd, coachingServiceJsonLd]} />

      {/* ============ Section 0 — THE SPLIT (before | after opener) ============ */}
      {/* Sits above the hero: the proof lands before the claim. Carries no
          heading — the page's single <h1> is the hero below, and a heading
          here would put an <h2> ahead of it. Its bridge control scrolls to
          #story (Section 1). Wired to Aditya's own before/after frames under
          /public/aditya — see the ASSETS note in the component. */}
      <TransformationSplit />

      {/* ============ Section 1 — MY STORY (hero + the short founder story) ============ */}
      {/* Owns the page's single <h1> and carries id="story", the landing point
          for the opener's bridge control. Shortened 2026-08-31 to one spread
          and three paragraphs — /about has to build trust in 60 seconds, not
          five minutes of reading. Copy is still verbatim from
          docs/aditya_personal_story.md — see the component header. */}
      <StoryHero />

      {/* ============ Section 2 — MY JOURNEY — REMOVED 2026-08-31 ============ */}
      {/* <JourneySection /> retold the same narrative as StoryHero above — the
          100kg story, the years of self-testing, becoming a coach — so the page
          told one story twice. Its one unique point, "Every single thing I
          teach has been earned — not learned.", now closes <StoryHero />.
          components/about/JourneySection.tsx is left on disk unreferenced: it
          holds docs/aditya_journey.md verbatim and is the starting point for
          the long-form blog post. Do not re-mount it here. */}

      {/* ============ Section 3 — WHY MEN TRUST THE WORK (credibility strip) ============ */}
      {/* Restrained trust rows — no invented stats/credentials. Carries the proof
          job now that the before/after section is gone; links out to /results
          where the client transformations live. [review] framing throughout. */}
      {/* bg-alt: StoryHero above is bg-void, so this keeps the alternation. */}
      <section className="bg-alt cv-auto border-y border-hairline-soft">
        <div className="container-site section">
          <div className="text-center">
            <SplitHeading
              as="h2"
              text="Why men trust the work."
              className="type-h2 text-primary"
            />
            {/* [review] */}
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {TRUST_POINTS.map((pt, i) => {
              const inner = (
                <div className="card spot flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    {/* [review] */}
                    <CheckIcon
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                    />
                    <div>
                      <h3 className="font-display text-lg font-medium text-primary">
                        {pt.title}
                      </h3>
                      <p className="type-small text-secondary mt-2">{pt.body}</p>
                    </div>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 pl-8 font-medium text-gold-300">
                    {pt.linkLabel}
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              );

              return (
                <Reveal key={pt.title} index={i}>
                  <TiltCard className="h-full">
                    {pt.external ? (
                      <a
                        href={pt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full rounded-[14px] transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        href={pt.href}
                        className="block h-full rounded-[14px] transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        {inner}
                      </Link>
                    )}
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============ Section 4 — FINAL CTA BAND ("One Decision") ============ */}
      {/* Shared closer — copy verbatim from bank; routes only (no email field → no consent line needed).
          FinalCta already carries the aurora + grain atmosphere for this band. */}
      <FinalCta
        heading="The man you want to become is waiting for one decision."
        sub="Start with a free blueprint. Or book your Transformation Audit today. Either way — start now."
        primaryLabel="Book Your Transformation Audit" /* [review] repositioned CTA 2026-07-21 */
        primaryHref="/book"
        secondaryLabel="Get My Free Blueprint"
        secondaryHref="/tools"
      />
    </>
  );
}
