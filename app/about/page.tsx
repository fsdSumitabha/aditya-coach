// /about — About / My Story ("The Deep-Trust Page")
// Sells the man, not the offer. No pricing, no program menus. Terminal action:
// Book a Consultation (→ /book) with the free Blueprint fallback (→ /tools).

import type { Metadata } from "next";
import Image from "next/image";
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

// ---- Image constants (top-level, swappable; explicit dims reserve aspect-ratio → CLS < 0.1) ----
const IMG_TL_BEFORE = {
  src: "/aditya/before/before_transformation.png",
  // true file ratio is 4:5 (800×1000) — declared dims must match or the
  // reserved box has the wrong shape and the layout jumps when it loads
  w: 480,
  h: 600,
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQME/8QAHxAAAgIBBQEBAAAAAAAAAAAAAQIDEQAEBRIiMSFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAABADH/2gAMAwEAAhEDEQA/AMGzIYtWkgsEAvdfALq8YfXbiXbhOnC+tuPMhMxj3bTQLRRhZse1eIovRfzGUQb/2Q==",
 } as const;


// ---- §5 credibility strip ("Why men trust the work") ----
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

      {/* ============ Section 0 — THE SPLIT (before | after opener) ============ */}
      {/* Sits above the hero: the proof lands before the claim. Carries no
          heading — the page's single <h1> is the hero below, and a heading
          here would put an <h2> ahead of it. Its bridge control scrolls to
          #story (Section 1). ⚠️ still wired to /public/demo stock frames —
          see the DEMO ASSETS note in the component. */}
      <TransformationSplit />

      {/* ============ Section 1 — MY STORY (hero + the full founder story) ============ */}
      {/* Owns the page's single <h1> and carries id="story", the landing point
          for the opener's bridge control. Copy is verbatim from
          docs/aditya_personal_story.md — see the component header. */}
      <StoryHero />

      {/* ============ Section 2 — THE FOUNDER STORY ("The Centerpiece") ============ */}
      {/* id="story" moved to <StoryHero /> above, which now tells this story in
          full — an id can only exist once per document. */}
      

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
                  <Image
                    src={IMG_TL_BEFORE.src}
                    width={IMG_TL_BEFORE.w}
                    height={IMG_TL_BEFORE.h}
                    alt="Aditya at his 100kg starting point, before the transformation"
                    placeholder="blur"
                    blurDataURL={IMG_TL_BEFORE.blurDataURL}
                    className="rounded-2xl"
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

              {/* Node 3 — The rebuild. (the Right Order of Change, now taught
                  only on /method — the philosophy section here was removed) */}
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

      {/* ============ Section 5 — WHY MEN TRUST THE WORK (credibility strip) ============ */}
      {/* Restrained trust rows — no invented stats/credentials. Carries the proof
          job now that the before/after section is gone; links out to /results
          where the client transformations live. [review] framing throughout. */}
      {/* bg-alt: §4 above is bg-surface-1, so this keeps the alternation. */}
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

      {/* ============ Section 6 — FOLLOW THE WORK ("Social Proof, Live") ============ */}
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

      {/* ============ Section 7 — FINAL CTA BAND ("One Decision") ============ */}
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
