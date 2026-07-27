// /about — About / My Story ("The Deep-Trust Page")
// Sells the man, not the offer. No pricing, no program menus. Terminal action:
// Book a Consultation (→ /book) with the free Blueprint fallback (→ /tools).

import type { Metadata } from "next";
import Link from "next/link";

import FadeIn from "@/components/about/FadeIn";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import { ArrowRightIcon, CheckIcon, InstagramIcon, PinIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { IG_URL, YOUTUBE_URL, waLink } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ---- Per-page SEO (A6 verbatim) ----
// og:image stays the default OG placeholder until the real IMG_ABOUT_HERO
// asset exists — swap via pageMetadata({ ogImage }) then.
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
const SOCIAL_INSTAGRAM_URL = IG_URL; // [review] real handle
const SOCIAL_YOUTUBE_URL = YOUTUBE_URL || "https://youtube.com/@__REPLACE__"; // [review] real handle
const WHATSAPP_URL = waLink(
  "Hi Aditya, I read your story on your site and want to talk.",
);

// ---- Image placeholder constants (top-level, swappable; explicit dims reserve aspect-ratio → CLS < 0.1) ----
const IMG_ABOUT_HERO = { label: "IMG_ABOUT_HERO", w: 720, h: 900 } as const;
const IMG_TL_BEFORE = { label: "IMG_TL_BEFORE", w: 480, h: 360 } as const;
const IMG_ABOUT_BEFORE = { label: "IMG_ABOUT_BEFORE", w: 640, h: 800 } as const;
const IMG_ABOUT_AFTER = { label: "IMG_ABOUT_AFTER", w: 640, h: 800 } as const;

// ---- §5 audience checklist ("This is for men who want to…") ----
// [review] Aditya's voice, from the 2026-07-21 direction (complete transformation,
// not just a gym program). Two-column checklist with gold ticks; stacks on mobile.
const AUDIENCE_CHECKLIST = [
  "Improve their body and physique",
  "Build better energy and daily habits",
  "Become genuinely more confident",
  "Command a stronger presence",
  "Show up better socially",
  "Sharpen their style and grooming",
  "Build real discipline",
  "Master their mindset and emotions",
  "Transform completely — not just train",
] as const; // [review]

// ---- §8 credibility strip ("Why men trust the work") ----
// [review] No invented stats or credentials — the only figure is the
// client-supplied 100kg. Restrained trust rows, shown before /results link-out.
const TRUST_POINTS = [
  {
    title: "He lived it first.",
    body: "100kg to coach. Every method was tested on his own body before it reached yours.",
  },
  {
    title: "Real men, real results.",
    body: "Client transformations shared with permission — no stock photos, no borrowed proof.",
  },
  {
    title: "One system, not recycled plans.",
    body: "Every man is audited first. Your plan is built for your life, never copied from someone else's.",
  },
  {
    title: "Direct access.",
    body: "Coaching happens with Aditya on WhatsApp — never handed off to an assistant.",
  },
] as const; // [review]

// ---- Page-local scroll-FX styles (scoped to /about via static export) ----
// One thing the shipped kit classes can't express on their own:
// the timeline node dots ignite (scale + opacity) the moment their entry
//     reveals. Base state stays fully lit for no-JS / reduced-motion — the
//     dimmed state only applies while the entry carries the JS-added .reveal.
const ABOUT_FX_CSS = `
.reveal .tl-dot { transform: scale(0.2); opacity: 0; }
.reveal.is-in .tl-dot {
  transform: none;
  opacity: 1;
  transition:
    transform 0.6s var(--ease-out-expo) 0.15s,
    opacity 0.5s var(--ease-standard) 0.15s;
}
`;

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
  image: `${SITE_ORIGIN}/og-image.jpg`, // TODO: swap for the real IMG_ABOUT_HERO portrait URL
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

/* Chapter marker — the page reads as a numbered narrative (a real sequence:
   story → journey → belief → who → proof), so the numbering encodes order.
   Plain markup: wrap in <Reveal> where it stands alone. [review] framing. */
function Chapter({
  num,
  label,
  center,
}: {
  num: string;
  label: string;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}
    >
      <span className="font-display text-[1.5rem] leading-none text-gold-500">
        {num}
      </span>
      {/* the rule draws itself in as the chapter scrolls into view */}
      <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[aboutPersonJsonLd, coachingServiceJsonLd]} />
      {/* Page-authored FX CSS — see ABOUT_FX_CSS note above */}
      <style>{ABOUT_FX_CSS}</style>

      {/* ============ Section 1 — HERO ("The Fade-In") ============ */}
      {/* aurora + grain atmosphere; overflow-hidden pens the drifting ghost word. */}
      <section className="bg-void glow-top grain aurora relative overflow-hidden">
        {/* ONE ghost word, low behind the hero — from the H1's own vocabulary. */}
        <span
          aria-hidden="true"
          className="ghost-word sd-ghost-drift -bottom-6 left-0 right-0 text-center"
        >
          REBUILT
        </span>

        {/* Full-viewport cinematic open — the page breathes before it speaks */}
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16 nav:py-20">
          <div className="grid items-center gap-10 nav:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] nav:gap-16">
            {/* Text block — mobile: after the portrait; desktop: left column */}
            <div className="order-2 nav:order-1">
              <FadeIn className="flex items-center gap-4" delayMs={120}>
                <span aria-hidden="true" className="h-px w-10 bg-hairline-gold" />
                <p className="eyebrow">MY STORY{/* [review] */}</p>
              </FadeIn>
              {/* Hero H1 — LCP text, paints at final state frame 1. Never animated. */}
              <h1 className="font-display mt-5 max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.025em] text-primary">
                I rebuilt myself from the ground up. Now I do it for other men.
              </h1>
              <FadeIn as="p" className="type-lead text-secondary mt-6 max-w-[48ch]" delayMs={200}>
                {/* [review] — sharpened 2026-07-21 to the complete-transformation
                    identity; the "Not a celebrity trainer. Not an influencer." opening stays. */}
                Not a celebrity trainer. Not an influencer. A man who rebuilt his
                own body, discipline and confidence — and now does the same for
                other men.
              </FadeIn>
              <FadeIn
                as="p"
                className="type-small text-muted mt-6 flex items-center gap-2"
                delayMs={280}
              >
                <PinIcon className="h-4 w-4 shrink-0 text-gold-500" />
                Kolkata · Coaching worldwide online
              </FadeIn>
              {/* No hero buttons — the persistent header [Book] gold button covers instant conversion. */}
            </div>

            {/* Portrait — mobile: leads (face builds trust fastest); desktop: right column.
                The portrait is this page's LCP element, so it paints statically
                (A2 LCP < 2.5s beats the 900ms fade); the "slow fade" entrance
                survives on the gold hairline frame only. */}
            <div className="order-1 relative mx-auto w-full max-w-[320px] nav:order-2 nav:mx-0 nav:max-w-[420px] nav:justify-self-end">
              <FadeIn
                className="pointer-events-none absolute inset-0 rounded-[18px] border border-hairline-gold"
                durationMs={900}
                y={0}
              >
                <span aria-hidden="true" />
              </FadeIn>
              {/* One restrained gold moment: 1px gold hairline frame.
                  Inner clip lets the portrait settle-zoom on scroll (transform
                  only — the LCP still paints frame 1). */}
              <div className="overflow-hidden rounded-[16px] p-1.5">
                <PlaceholderImage
                  label={IMG_ABOUT_HERO.label}
                  w={IMG_ABOUT_HERO.w}
                  h={IMG_ABOUT_HERO.h}
                  alt="Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata — present-day portrait, composed and direct to camera"
                  variant="portrait"
                  className="sd-zoom"
                />
              </div>
            </div>
          </div>

          {/* quiet scroll cue, pinned to the hero's base */}
          <FadeIn
            delayMs={700}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 motion-safe:animate-[wa-breathe_2.4s_ease-in-out_infinite]"
            >
              <span className="type-caption tracking-[0.24em] text-muted">
                THE STORY BEGINS BELOW
                {/* [review] */}
              </span>
              <span className="block h-9 w-px bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ Section 2 — THE FOUNDER STORY ("The Centerpiece") ============ */}
      <section className="bg-surface-1 grain aurora relative overflow-hidden border-y border-hairline-soft">
        <div className="container-site section-lg">
          <h2 className="sr-only">The Founder Story</h2>

          {/* Editorial column: left-aligned prose so the drop cap reads as a
              magazine opening. Copy VERBATIM — paragraph breaks pace it, words
              unchanged; each body line blurs up on its own beat. */}
          <div className="mx-auto max-w-[60ch]">
            <Reveal>
              <Chapter num="01" label="THE STORY" />
            </Reveal>

            <Reveal
              as="p"
              index={0}
              className="reveal-blur type-lead text-primary mt-10 leading-[1.7] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.2em] first-letter:leading-[0.8] first-letter:text-gold-300"
            >
              I am not a celebrity trainer. I am not a gym influencer. I am
              someone who rebuilt himself completely from the ground up.
            </Reveal>
            <Reveal as="p" index={1} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
              From 100kg with zero confidence to coaching some of the most
              successful men in Kolkata.
            </Reveal>
            <Reveal as="p" index={2} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
              I have sat with businessmen, entrepreneurs and professionals who
              had everything — and still felt like something was missing.
            </Reveal>
            <Reveal as="p" index={3} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
              That missing thing is always the same.
            </Reveal>

            {/* The four-noun punch — the page's loudest typographic moment */}
            <Reveal delayMs={450} className="reveal-blur mt-10">
              <p className="font-display border-l-2 border-gold-500 pl-6 text-[clamp(1.75rem,3.6vw,2.9rem)] leading-[1.25] text-gold-300">
                Their health. Their drive. Their confidence. Their discipline.
              </p>
            </Reveal>

            <Reveal delayMs={150} className="reveal-blur mt-8">
              <p className="type-lead text-primary leading-[1.7]">
                I help men get that back. Not with a crash diet. Not with a
                supplement stack. With a complete lifestyle redesign that lasts
                for the rest of their life.
              </p>
              <div className="mt-12">
                <p className="font-display text-2xl italic text-gold-300">
                  — Aditya{/* [review] */}
                </p>
                <p className="type-caption mt-2 uppercase tracking-[0.18em] text-muted">
                  Aditya Kumar Upadhyay
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Decorative reprise of the four-noun line — the chant between chapters */}
      <div className="border-b border-hairline-soft bg-void py-5 md:py-7">
        <Marquee
          items={[
            "Their health.",
            "Their drive.",
            "Their confidence.",
            "Their discipline.",
          ]}
          speedS={40}
        />
      </div>

      {/* ============ Section 3 — THE TIMELINE ("The Journey") ============ */}
      {/*
        [review] REVIEWER NOTE: no hard numbers were invented beyond the
        client-supplied "100kg" (no kg-loss figures, ages, client counts,
        years elapsed, or credentials). If the owner wants "lost 40kg" /
        "over X years" / "coached 100+ men", he supplies the real figures —
        this timeline stays qualitative on purpose. Node labels marked
        [review] are editorial framing for his approval.
      */}
      {/* overflow-hidden pens the alternating reveal-left/right entries so the
          transient ±28px offset can never trip horizontal scroll. */}
      <section className="bg-base cv-auto overflow-hidden">
        <div className="container-site section">
          <div className="max-w-2xl">
            <Reveal className="mb-5">
              <Chapter num="02" label="THE JOURNEY" />
            </Reveal>
            <SplitHeading
              as="h2"
              text="The Long Way Back."
              className="type-h2 text-primary"
            />
            {/* [review] */}
            <Reveal as="p" delayMs={150} className="type-lead text-secondary mt-4">
              {/* [review] */}
              Nobody handed me this. I built it one decision at a time.
            </Reveal>
          </div>

          <div className="relative mt-12 nav:mt-16">
            {/* The gold thread — draws itself (scaleY) as the journey scrolls in. */}
            <div
              aria-hidden="true"
              className="thread-v sd-draw absolute bottom-1 left-[11px] top-1"
            />

            <ol className="space-y-12 nav:space-y-16">
              {/* Node 1 — 100kg. Zero confidence. */}
              <Reveal as="li" index={0} className="reveal-left relative pl-12 nav:pl-16">
                <span
                  aria-hidden="true"
                  className="tl-dot absolute left-[7px] top-1.5 h-[9px] w-[9px] rounded-full bg-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.5)]"
                />
                <p className="eyebrow">THE STARTING POINT{/* [review] */}</p>
                <h3 className="type-h3 text-primary mt-2">100kg. Zero confidence.</h3>
                <p className="type-body text-primary mt-3 max-w-[58ch]">
                  This was me. 100kg. Zero confidence.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] */}
                  Out of breath on the stairs. Avoiding the mirror. Telling
                  myself I&apos;d start Monday — every Sunday.
                </p>
                {/* wipes itself open as the node scrolls in (sd-wipe on the
                    frame — the Reveal owns the parent li, never this element) */}
                <div className="sd-wipe mt-5 max-w-[280px]">
                  <PlaceholderImage
                    label={IMG_TL_BEFORE.label}
                    w={IMG_TL_BEFORE.w}
                    h={IMG_TL_BEFORE.h}
                    alt="Aditya at his 100kg starting point, before the transformation"
                    variant="photo"
                  />
                </div>
              </Reveal>

              {/* Node 2 — The decision. */}
              <Reveal as="li" index={1} className="reveal-right relative pl-12 nav:pl-16">
                <span
                  aria-hidden="true"
                  className="tl-dot absolute left-[7px] top-1.5 h-[9px] w-[9px] rounded-full bg-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.5)]"
                />
                <p className="eyebrow">THE TURN{/* [review] */}</p>
                <h3 className="type-h3 text-primary mt-2">The decision.</h3>
                <p className="type-body text-primary mt-3 max-w-[58ch]">
                  The decision to change was the hardest part. Everything else
                  followed.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] */}
                  No dramatic rock bottom. Just one morning I decided I was
                  done living below what I knew I could be.
                </p>
              </Reveal>

              {/* Node 3 — The rebuild. (previews the Right Order of Change → Section 4) */}
              <Reveal as="li" index={2} className="reveal-left relative pl-12 nav:pl-16">
                <span
                  aria-hidden="true"
                  className="tl-dot absolute left-[7px] top-1.5 h-[9px] w-[9px] rounded-full bg-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.5)]"
                />
                <p className="eyebrow">THE REBUILD{/* [review] */}</p>
                <h3 className="type-h3 text-primary mt-2">The rebuild.</h3>
                <p className="type-body text-primary mt-3 max-w-[58ch]">
                  {/* [review] */}
                  I didn&apos;t start with a diet. I started with how I lived.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] */}
                  When I woke up. How I slept. How I moved. The habits I ran
                  every day. The body followed the lifestyle — never the other
                  way round.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] — added 2026-07-21: the change was never only the body */}
                  And the body was only half of it. The discipline held. The
                  confidence followed. I started carrying myself like a
                  different man.
                </p>
              </Reveal>

              {/* Node 4 — Coaching successful men in Kolkata. */}
              <Reveal as="li" index={3} className="reveal-right relative pl-12 nav:pl-16">
                <span
                  aria-hidden="true"
                  className="tl-dot absolute left-[7px] top-1.5 h-[9px] w-[9px] rounded-full bg-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.5)]"
                />
                <p className="eyebrow">WHERE IT LED{/* [review] */}</p>
                <h3 className="type-h3 text-primary mt-2">
                  Coaching successful men in Kolkata.
                </h3>
                <p className="type-body text-primary mt-3 max-w-[58ch]">
                  From there to coaching some of the most successful men in
                  Kolkata.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] */}
                  Businessmen. Entrepreneurs. Professionals who had everything
                  — and still felt something was missing. I help them get it
                  back.
                </p>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {/* [review] — added 2026-07-21: not just the body, how he shows up */}
                  And what I rebuild with them isn&apos;t only the body. It&apos;s
                  how they carry themselves, how they lead, how they show up in
                  every room they walk into.
                </p>
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      {/* ============ Section 4 — THE PHILOSOPHY ("In Brief") ============ */}
      <section className="bg-surface-1 border-y border-hairline-soft cv-auto">
        <div className="container-site section">
          {/* Gold-thread stitch — carries the line language in from the timeline. */}
          <div aria-hidden="true" className="thread-h sd-draw mb-8 w-24" />

          <Reveal className="max-w-2xl">
            <Chapter num="03" label="WHAT I BELIEVE" />
            <h2 className="type-h2 text-primary mt-5">
              Change has a right order. Most men do it backwards.{/* [review] */}
            </h2>
            <p className="type-body text-secondary mt-5 max-w-[62ch]">
              {/* [review] */}
              Men chase the diet, the supplement, the quick fix — and wonder
              why nothing lasts. It never lasts because the foundation was
              never built. Fix how you live first. Then nutrition. Then
              supplements. Medical last, always under a doctor. Build it in
              that order and it holds for the rest of your life.
            </p>
          </Reveal>

          {/* Mini-strip teaser — the 4 layers, one word each (taught in full on /method) */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {["Lifestyle", "Nutrition", "Supplements", "Medical"].map(
              (label, i) => (
                <Reveal
                  key={label}
                  as="span"
                  index={i}
                  className="inline-flex items-center gap-3"
                >
                  <span className="spot type-caption inline-flex min-h-[36px] items-center rounded-full border border-hairline-gold px-4 uppercase tracking-[0.08em] text-gold-300">
                    <span>{label}</span>
                  </span>
                  {i < 3 && (
                    <span aria-hidden="true" className="thread-h sd-draw hidden h-px w-6 md:block" />
                  )}
                </Reveal>
              ),
            )}
          </div>

          <Reveal delayMs={200} className="mt-10">
            <Link href="/method" className="btn-outline">
              See The Right Order of Change
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ Section 5 — WHO I HELP ("Two Men") ============ */}
      <section className="bg-base cv-auto">
        <div className="container-site section">
          <Reveal className="mb-5">
            <Chapter num="04" label="WHO THIS IS FOR" center />
          </Reveal>
          <SplitHeading
            as="h2"
            text="Who This Is For."
            className="type-h2 text-primary text-center"
          />
          {/* [review] */}

          {/* Section-opening thesis — existing verbatim line, relocated to the top
              of §5 (companion to the convergence closer below; text unchanged). */}
          <Reveal delayMs={120} className="reveal-blur mx-auto mt-6 max-w-[60ch] text-center">
            <p className="type-lead text-secondary">
              The goal isn&apos;t only to change how you look. It&apos;s to
              change how you carry yourself, how you communicate, how you
              think, and how you show up in every area of life.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {/* Card A — The Young Man (22–30) — informational, no per-card buttons */}
            <Reveal index={0}>
              <TiltCard className="h-full">
                <div className="card-light h-full">
                  <p className="eyebrow card-gold">22–30</p>
                  <h3 className="type-h3 mt-3">The Young Man</h3>
                  <p className="type-body mt-4">
                    You want direction. You want to build yourself the right way
                    from the start. You do not want to waste years figuring out
                    what actually works. This is for you.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            {/* Card B — The Successful Man (30–50) */}
            <Reveal index={1}>
              <TiltCard className="h-full">
                <div className="card-dark-gold h-full">
                  {/* Inner spot wrapper: the card's own ::before draws the corner
                      bracket, so the cursor glow rides a nested .spot instead. */}
                  <div className="spot">
                    <p className="eyebrow">30–50</p>
                    <h3 className="type-h3 mt-3">The Successful Man</h3>
                    <p className="type-body mt-4">
                      You built the career. You made the money. But somewhere along
                      the way you lost your health, your drive and your confidence.
                      You want it back. This is for you too.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* "This is for men who want to…" — compact two-column checklist with
              gold ticks. Single Reveal (calm — all ticks land together, no
              9-item stagger cascade). Stacks to one column on mobile. */}
          <Reveal className="mx-auto mt-16 max-w-3xl">
            <h3 className="type-h3 text-primary text-center">
              This is for men who want to…{/* [review] */}
            </h3>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {AUDIENCE_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* [review] */}
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-gold-500"
                  />
                  <span className="type-body text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Convergence closer — core message VERBATIM from Aditya's direction
              (2026-07-21). Companion to the thesis line at the top of §5. */}
          <Reveal delayMs={150} className="reveal-blur mx-auto mt-16 max-w-[46ch] text-center">
            <p className="font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-snug text-primary">
              I do not just change how a man looks. I help change how he shows
              up in every area of his life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ Section 6 — HIS OWN BEFORE / AFTER ("Proof On His Own Body") ============ */}
      <section className="bg-alt border-y border-hairline-soft cv-auto">
        <div className="container-site section">
          <div className="text-center">
            <Reveal className="mb-5">
              <Chapter num="05" label="THE PROOF" center />
            </Reveal>
            <SplitHeading
              as="h2"
              text="Proof. On my own body."
              className="type-h2 text-primary"
            />
            {/* [review] */}
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div>
              <Reveal as="p" className="eyebrow mb-3">BEFORE</Reveal>
              {/* sd-wipe reveals the photo bottom-up as it scrolls in (not wrapped
                  in Reveal — an sd-* entrance never shares an element with one). */}
              <div className="sd-wipe">
                <PlaceholderImage
                  label={IMG_ABOUT_BEFORE.label}
                  w={IMG_ABOUT_BEFORE.w}
                  h={IMG_ABOUT_BEFORE.h}
                  alt="Before — Aditya at 100kg, his starting point"
                  variant="portrait"
                />
              </div>
            </div>
            <div>
              <Reveal as="p" className="eyebrow mb-3">AFTER</Reveal>
              <div className="sd-wipe">
                <PlaceholderImage
                  label={IMG_ABOUT_AFTER.label}
                  w={IMG_ABOUT_AFTER.w}
                  h={IMG_ABOUT_AFTER.h}
                  alt="After — Aditya today, rebuilt through his own lifestyle-first method"
                  variant="portrait"
                />
              </div>
            </div>
          </div>

          <Reveal delayMs={200} className="reveal-blur mt-12 text-center">
            <blockquote className="font-display mx-auto max-w-[40ch] text-2xl leading-snug text-primary md:text-[1.75rem]">
              This was me. 100kg. Zero confidence. The decision to change was
              the hardest part. Everything else followed.
            </blockquote>
            <p className="type-small mt-4 text-gold-300">
              — Aditya, on his own transformation{/* [review] */}
            </p>
            {/* Contextual individual-results disclaimer (site compliance rule; global medical disclaimer lives in the footer) */}
            <p className="type-caption mt-6 text-muted">
              {/* [review] */}
              Individual results vary. This is one man&apos;s journey, not a
              guarantee of yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ Section 6.5 — WHY MEN TRUST THE WORK (credibility strip) ============ */}
      {/* Restrained trust rows — no invented stats/credentials. Placed after the
          proof section; links out to /results. [review] framing throughout. */}
      <section className="bg-surface-1 cv-auto border-y border-hairline-soft">
        <div className="container-site section">
          <div className="text-center">
            <SplitHeading
              as="h2"
              text="Why men trust the work."
              className="type-h2 text-primary"
            />
            {/* [review] */}
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {TRUST_POINTS.map((pt, i) => (
              <Reveal key={pt.title} index={i}>
                <div className="card spot h-full">
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
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={200} className="mt-10 text-center">
            <Link
              href="/results"
              className="link-draw inline-flex items-center gap-1.5 font-medium text-gold-300"
            >
              See the transformations
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ Section 7 — FOLLOW THE WORK ("Social Proof, Live") ============ */}
      <section className="bg-void cv-auto">
        <div className="container-site section text-center">
          <Reveal>
            <h2 className="type-h3 text-primary">
              See The Work In Real Time.{/* [review] */}
            </h2>
            <p className="type-small mt-2 text-muted">
              {/* [review] */}
              The training. The clients. The daily standard.
            </p>
          </Reveal>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center">
            <Reveal index={1} className="sm:w-auto">
              <a
                href={SOCIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-hairline-soft px-6 font-medium text-secondary transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-hairline-gold hover:text-primary sm:w-auto"
              >
                <span className="float-idle inline-flex"><InstagramIcon className="h-5 w-5" /></span>
                Instagram
              </a>
            </Reveal>
            <Reveal index={2} className="sm:w-auto">
              <a
                href={SOCIAL_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-hairline-soft px-6 font-medium text-secondary transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-hairline-gold hover:text-primary sm:w-auto"
              >
                <span className="float-idle inline-flex" style={{ animationDelay: "0.5s" }}><YouTubeIcon className="h-5 w-5" /></span>
                YouTube
              </a>
            </Reveal>
            <Reveal index={3} className="sm:w-auto">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full sm:w-auto"
              >
                <span className="float-idle inline-flex" style={{ animationDelay: "1s" }}><WhatsAppIcon className="h-5 w-5" /></span>
                Chat with Aditya
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Section 8 — FINAL CTA BAND ("One Decision") ============ */}
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
