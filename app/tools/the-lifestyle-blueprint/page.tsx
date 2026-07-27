import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import FinalCta from "@/components/FinalCta";
import { ArrowRightIcon } from "@/components/icons";
import { OG_IMAGE } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";
import BlueprintChrome from "@/components/tools/blueprint/BlueprintChrome";
import { Prose, DocImage } from "@/components/tools/blueprint/Blocks";
import { META, INTRO, PULL_QUOTE, CHANGES, START, FINAL, COLOPHON, } from "@/components/tools/blueprint/content";

// ============================================================
// /tools/the-lifestyle-blueprint — "The Lifestyle Blueprint"
// The Blueprint as a full on-site reading experience: the author's verbatim
// document, rendered in the site's atelier-at-night language — cover hero,
// a reading-progress bar + scroll-spy chapter rail, ten changes that draw in
// on scroll with sticky imagery, one pinned pull-quote, and a single CTA out.
// Body text lives verbatim in ./content.ts — this file is presentation only.
// ============================================================

const TITLE = "The Lifestyle Blueprint | 10 Changes That Rebuild a Man";
const DESCRIPTION =
  "The Lifestyle Blueprint by Aditya Kumar Upadhyay — 10 lifestyle changes that rebuild a man completely: mornings, sleep, protein, sugar, movement, water, stress, gut, supplements and identity.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/the-lifestyle-blueprint",
  ogType: "article",
});

// Page-level schema — an Article node referencing the global Person/Business.
const blueprintSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_ORIGIN}/tools/the-lifestyle-blueprint#article`,
    headline: "The Lifestyle Blueprint — 10 Changes That Rebuild a Man",
    description: DESCRIPTION,
    url: `${SITE_ORIGIN}/tools/the-lifestyle-blueprint`,
    isAccessibleForFree: true,
    image: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}${OG_IMAGE}`,
      width: 1200,
      height: 630,
    },
    author: { "@id": `${SITE_ORIGIN}/#person` },
    publisher: { "@id": `${SITE_ORIGIN}/#business` },
    mainEntityOfPage: `${SITE_ORIGIN}/tools/the-lifestyle-blueprint`,
  },
];

const railItems = CHANGES.map((c) => ({
  id: c.id,
  num: c.num,
  short: c.short,
}));

export default function LifestyleBlueprintPage() {
  return (
    <>
      <JsonLd data={blueprintSchema} />
      <BlueprintChrome changes={railItems} />

      {/* ============ COVER ============ */}
      <section className="bg-void grain aurora relative overflow-hidden">
        {/* the one ghost word on the page — drifts behind the cover */}
        <span
          aria-hidden="true"
          className="ghost-word filled sd-ghost-drift left-0 right-0 top-[24%] text-center"
        >
          Rebuild
        </span>
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16">
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
              <p className="eyebrow">Free Digital Product</p>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            </div>
            {/* Hero H1 — LCP element; paints at final state frame 1, never animated */}
            <h1 className="font-display mx-auto max-w-[16ch] text-[clamp(2.8rem,7vw,5.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-primary">
              {META.docTitle}
            </h1>
            <Reveal as="p" delayMs={100} className="type-lead text-gold-300 mt-5">
              {META.author}
            </Reveal>
            <Reveal
              as="p"
              delayMs={160}
              className="reveal-blur type-h3 font-display text-secondary mt-6 mx-auto max-w-[24ch]"
            >
              {META.subtitle}
            </Reveal>

            {/* cover artwork — branded placeholder, swap for the real cover */}
            <Reveal delayMs={240} className="reveal-scale mx-auto mt-10 max-w-[300px]">
              <DocImage
                variant="cover"
                label={META.coverImage.label}
                alt={META.coverImage.alt}
              />
            </Reveal>

            <Reveal as="p" delayMs={320} className="type-small text-muted mt-8">
              {META.coverTag}
            </Reveal>
          </div>

          {/* quiet scroll cue */}
          <Reveal
            delayMs={520}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 motion-safe:animate-[wa-breathe_2.4s_ease-in-out_infinite]"
            >
              <span className="type-caption tracking-[0.24em] text-muted">
                START READING
              </span>
              <span className="block h-9 w-px bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* decorative ticker — the ten changes, verbatim titles */}
      <div className="border-y border-hairline-soft bg-base py-6 md:py-8">
        <Marquee items={CHANGES.map((c) => c.title)} speedS={44} />
      </div>

      {/* ============ BEFORE YOU BEGIN ============ */}
      <section className="bg-alt cv-auto">
        <div className="container-site section">
          <div className="mx-auto max-w-[720px]">
            <Reveal className="mb-8">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
                <p className="eyebrow">{INTRO.kicker}</p>
              </div>
              <SplitHeading
                as="h2"
                text="Most coaches give you a diet. I give you this first."
                className="type-h2 text-primary mt-4"
              />
            </Reveal>
            <Prose blocks={INTRO.blocks} />
          </div>
        </div>
      </section>

      {/* ============ PINNED PULL-QUOTE — the one bold moment ============ */}
      <section className="bg-void grain aurora relative overflow-hidden border-t border-hairline-soft">
        <div className="pin-scene min-h-[150vh] md:min-h-[190vh]">
          <div className="pin-stage">
            <div className="container-site text-center">
              <Reveal className="mx-auto max-w-[900px]">
                <p
                  className="font-display text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.06] tracking-[-0.02em] text-primary"
                >
                  {PULL_QUOTE.lines[0]}
                </p>
                <p className="font-display mt-2 text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.06] tracking-[-0.02em]">
                  <span className="text-gold-grad">{PULL_QUOTE.lines[1]}</span>
                </p>
              </Reveal>
              <div aria-hidden="true" className="mx-auto mt-10 w-40 max-w-full">
                <span className="thread-h sd-draw block h-px w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE TEN CHANGES ============ */}
      {CHANGES.map((change, i) => {
        const imageLeft = i % 2 === 1;
        return (
          <section
            key={change.id}
            id={change.id}
            className={`cv-auto border-t border-hairline-soft ${
              i % 2 === 0 ? "bg-base" : "bg-alt"
            }`}
          >
            <div className="container-site section">
              {/* change header — oversized gold numeral + animated title */}
              <div className="mb-10 flex items-center gap-5 md:mb-14 md:gap-8">
                <span
                  aria-hidden="true"
                  className="type-numeral text-gold-grad shrink-0 leading-none"
                  style={{ fontSize: "clamp(52px, 9vw, 108px)" }}
                >
                  {change.num}
                </span>
                <div className="min-w-0">
                  <p className="eyebrow text-gold-300">
                    Change {change.num}
                  </p>
                  <SplitHeading
                    as="h2"
                    text={change.title}
                    className="type-h2 text-primary mt-1"
                  />
                </div>
              </div>

              <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
                {/* imagery — sticks alongside the copy on desktop, parallax drift */}
                <div className={imageLeft ? "md:order-1" : "md:order-2"}>
                  <Reveal
                    className={`${imageLeft ? "reveal-left" : "reveal-right"} md:sticky md:top-[calc(var(--header-h)+2rem)]`}
                  >
                    <DocImage
                      variant="portrait"
                      label={change.image.label}
                      alt={change.image.alt}
                      className="mx-auto max-w-[420px]"
                    />
                  </Reveal>
                </div>

                {/* the verbatim body */}
                <div className={imageLeft ? "md:order-2" : "md:order-1"}>
                  <Reveal
                    as="p"
                    className="reveal-blur type-lead text-primary font-medium"
                  >
                    {change.lead}
                  </Reveal>
                  <div className="mt-8">
                    <Prose blocks={change.blocks} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ============ HOW TO START TONIGHT ============ */}
      <section className="bg-void grain aurora relative overflow-hidden border-t border-hairline-soft">
        <div className="container-site section">
          <div className="mx-auto mb-12 max-w-[720px] text-center md:mb-16">
            <Reveal className="mb-4 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
              <p className="eyebrow">{START.kicker}</p>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            </Reveal>
            <SplitHeading
              as="h2"
              text="Start with three things only."
              className="type-h2 text-primary"
            />
            <Reveal as="p" delayMs={100} className="type-lead text-secondary mt-5">
              {START.lead}
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-7">
            {START.phases.map((phase, i) => (
              <Reveal
                key={phase.title}
                delayMs={i * 100}
                className="reveal-scale"
              >
                <div className="card spot flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="type-numeral text-gold-grad leading-none"
                      style={{ fontSize: "34px" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="type-step font-display text-primary">
                      {phase.title}
                    </h3>
                  </div>
                  <ul className="mt-5 flex list-none flex-col gap-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="type-body text-secondary flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {phase.time && (
                    <p className="type-caption text-gold-300 mt-6 border-t border-hairline-soft pt-4 tracking-[0.12em]">
                      {phase.time}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-[640px] space-y-5 text-center md:mt-16">
            <Prose blocks={START.close} />
          </div>
        </div>
      </section>

      {/* ============ FINAL NOTE FROM ADITYA ============ */}
      <section className="bg-surface-warm glow-top cv-auto border-t border-hairline-soft">
        <div className="container-site section">
          <div className="grid items-center gap-10 md:grid-cols-[340px_minmax(0,1fr)] md:gap-16">
            <Reveal className="reveal-scale order-1">
              <DocImage
                variant="portrait"
                label={FINAL.image.label}
                alt={FINAL.image.alt}
                className="mx-auto max-w-[340px]"
              />
            </Reveal>
            <div className="order-2">
              <Reveal className="mb-8">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
                  <p className="eyebrow">{FINAL.kicker}</p>
                </div>
              </Reveal>
              <Prose blocks={FINAL.blocks} />
              <Reveal delayMs={120}>
                <Link
                  href="/book"
                  className="btn-gold mt-9 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  Book a Consultation
                  <ArrowRightIcon width={18} height={18} />
                </Link>
              </Reveal>
            </div>
          </div>

          {/* colophon — the document's own footer, verbatim */}
          <div
            aria-hidden="false"
            className="mx-auto mt-16 max-w-[640px] border-t border-hairline-soft pt-8 text-center md:mt-20"
          >
            {COLOPHON.map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "type-small text-secondary"
                    : "type-caption text-muted mt-1.5"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ONE DOMINANT PATH OUT ============ */}
      <FinalCta
        heading="You've read it. Now build it."
        sub="This is the foundation. The complete version of you is one decision away."
        primaryLabel="Book a Consultation"
        primaryHref="/book"
        secondaryLabel="Back to Free Tools"
        secondaryHref="/tools"
      />
    </>
  );
}
