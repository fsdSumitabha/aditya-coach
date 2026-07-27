import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import FinalCta from "@/components/FinalCta";
import { ArrowRightIcon } from "@/components/icons";
import { OG_IMAGE } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ============================================================
// /tools/the-lifestyle-blueprint — "The Lifestyle Blueprint"
// The Blueprint as a full on-site reading experience (not a PDF download):
// a document rendered with the site's atelier-at-night design language —
// ghost-word hero, a gold-thread spine, ten changes that draw in on scroll,
// one pinned showpiece, and a single dominant CTA out to /book.
// ============================================================

const TITLE = "The Lifestyle Blueprint | 10 Changes That Rebuild a Man";
const DESCRIPTION =
  "The free Lifestyle Blueprint: 10 lifestyle changes that rebuild a man completely — body, mind and hormones. Read it tonight, start tomorrow."; /* [review] */

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

// ---- The ten changes (copy authored in his voice — audit before launch) ----
type Change = {
  num: string;
  title: string;
  /** why it matters — body, mind, hormones */
  why: string;
  /** the smallest first move a man can make tonight */
  tonight: string;
};

const CHANGES: Change[] = [
  {
    num: "01",
    title: "Anchor your sleep.",
    why: "Same wake time, every day — weekends included. Your body, your mind and your hormones all run off one clock. Fix the clock first and everything downstream gets easier.",
    tonight: "Set one wake time you can keep seven days a week. Start there.",
  } /* [review] */,
  {
    num: "02",
    title: "Own the first hour.",
    why: "The first hour sets the day. Light, water and movement before the phone. Reach for the screen first and you hand your focus away before you've used any of it.",
    tonight: "Leave your phone out of reach overnight. Deal with the morning before it deals with you.",
  } /* [review] */,
  {
    num: "03",
    title: "Walk every single day.",
    why: "Not a workout — a baseline. Daily walking moves your blood, clears your head and keeps the machine running. Miss the gym and you still walk. No exceptions.",
    tonight: "Block twenty minutes tomorrow and put it in the calendar tonight.",
  } /* [review] */,
  {
    num: "04",
    title: "Cut what you drink, not just what you eat.",
    why: "Most men fix the plate and ignore the glass. Liquid sugar and alcohol are the quietest way to undo a good week. This is the easiest weight you'll ever drop.",
    tonight: "Pick one liquid — the soda, the beer, the third coffee — and cut it starting tomorrow.",
  } /* [review] */,
  {
    num: "05",
    title: "Protein at every meal.",
    why: "Protein builds the body you're training for, keeps you full, and steadies the hormones behind your energy. Skip it and you stay hungry and soft no matter how hard you train.",
    tonight: "Plan tomorrow's breakfast around protein. Decide it now, not at 8am.",
  } /* [review] */,
  {
    num: "06",
    title: "Lift heavy, three times a week.",
    why: "Strength is the fastest lever a man has. Heavy, simple, consistent — that's what changes your shape, your posture and the way you carry yourself. Three sessions. That's the standard.",
    tonight: "Choose the three days. Write them down. They're appointments now.",
  } /* [review] */,
  {
    num: "07",
    title: "Kill the midnight screen.",
    why: "Late screens wreck the sleep you just fixed and burn the dopamine you need for tomorrow. The scroll feels like rest. It isn't. It's the thing keeping you tired.",
    tonight: "Set a hard cut-off — screens down an hour before bed. Tonight is the first night.",
  } /* [review] */,
  {
    num: "08",
    title: "Get sun on your skin.",
    why: "Daylight isn't decoration. It anchors your body clock, lifts your mood and feeds the hormones that drive a man's energy and drive. Ten minutes outside beats any supplement for this.",
    tonight: "Plan to step outside within an hour of waking. Coffee on the balcony counts.",
  } /* [review] */,
  {
    num: "09",
    title: "Train your recovery.",
    why: "You don't grow in the session — you grow in the recovery. Breathing, downtime, real rest. A man who can't switch off stays stuck in the same stress that's aging him.",
    tonight: "Take five slow minutes before bed. No phone, just breathing. Prove to yourself you can stop.",
  } /* [review] */,
  {
    num: "10",
    title: "Shut the day down on purpose.",
    why: "The day doesn't end on its own — you end it. A short shutdown routine tells your body the work is done, protects your sleep, and hands tomorrow a clean start.",
    tonight: "Pick three things that close your day. Do them in the same order every night.",
  } /* [review] */,
];

// Decorative marquee — the transformation chain, verbatim from positioning.
const CHAIN = [
  "Body",
  "Health",
  "Energy",
  "Mindset",
  "Confidence",
  "Presence",
  "Personality",
];

export default function LifestyleBlueprintPage() {
  return (
    <>
      <JsonLd data={blueprintSchema} />

      {/* ============ 1. HERO — ghost-word showpiece, no photo ============ */}
      <section className="bg-void grain aurora relative overflow-hidden">
        {/* The one ghost word on the page — huge watermark, drifts on scroll. */}
        <span
          aria-hidden="true"
          className="ghost-word filled sd-ghost-drift left-0 right-0 top-[28%] text-center"
        >
          Rebuild
        </span>
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16">
          <div className="mx-auto max-w-[880px] text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
              <p className="eyebrow">THE LIFESTYLE BLUEPRINT{/* [review] */}</p>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            </div>
            {/* Hero H1 — LCP element; paints at final state, never animated. */}
            <h1 className="font-display mx-auto max-w-[18ch] text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.03em] text-primary">
              Ten changes that rebuild a man.
            </h1>
            <Reveal
              as="p"
              delayMs={100}
              className="reveal-blur type-lead text-secondary mt-6 max-w-[54ch] mx-auto"
            >
              Not a diet. Not a workout plan. The ten things that fix a man from
              the ground up — body, mind and hormones. Read it tonight. Start
              tomorrow.{/* [review] */}
            </Reveal>
            <Reveal
              as="p"
              delayMs={200}
              className="type-small text-muted mt-5"
            >
              Free. No email, no catch. Just the standard.{/* [review] */}
            </Reveal>
          </div>

          {/* quiet scroll cue at the panel base */}
          <Reveal
            delayMs={500}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 motion-safe:animate-[wa-breathe_2.4s_ease-in-out_infinite]"
            >
              <span className="type-caption tracking-[0.24em] text-muted">
                START READING{/* [review] */}
              </span>
              <span className="block h-9 w-px bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Decorative ticker — the transformation chain, in order. */}
      <div className="border-y border-hairline-soft bg-base py-6 md:py-8">
        <Marquee items={CHAIN} speedS={40} />
      </div>

      {/* ============ 2. FRAMING — why this order, why free ============ */}
      <section className="bg-alt cv-auto">
        <div className="container-site section">
          <div className="mx-auto max-w-[720px]">
            <Reveal>
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
                <p className="eyebrow">HOW TO READ THIS{/* [review] */}</p>
              </div>
              <SplitHeading
                as="h2"
                text="Fix the right things, in the right order."
                className="type-h2 text-primary mt-4"
              />
            </Reveal>
            <Reveal delayMs={100} className="reveal-blur mt-6 space-y-4">
              <p className="type-lead text-secondary">
                Most men change everything at once, burn out in three weeks, and
                blame themselves. That was never the problem. The problem was the
                order.{/* [review] */}
              </p>
              <p className="type-lead text-secondary">
                These ten changes stack. Start at the top and work down. You
                don&apos;t need all ten this week — you need the first one, done
                properly, tonight.{/* [review] */}
              </p>
              <p className="type-lead text-primary">
                This is the foundation every one of my clients starts on. I&apos;m
                giving it to you in full.{/* [review] */}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 3. THE TEN CHANGES — the document core ============ */}
      <section className="bg-base cv-auto border-t border-hairline-soft">
        <div className="container-site section">
          <Reveal className="mb-12 max-w-[720px] md:mb-16">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
              <p className="eyebrow">THE BLUEPRINT{/* [review] */}</p>
            </div>
            <SplitHeading
              as="h2"
              text="Ten changes. One order."
              className="type-h2 text-primary mt-4"
            />
          </Reveal>

          <div className="relative mx-auto max-w-[820px]">
            {/* the gold thread — draws itself down the ten changes on scroll */}
            <div
              aria-hidden="true"
              className="thread-v sd-draw absolute bottom-6 left-[30px] top-4 z-0 md:left-[52px]"
            />
            <ol className="relative flex list-none flex-col gap-10 md:gap-14">
              {CHANGES.map((change, i) => (
                <li
                  key={change.num}
                  className="grid grid-cols-[60px_minmax(0,1fr)] gap-x-3 md:grid-cols-[104px_minmax(0,1fr)] md:gap-x-8"
                >
                  {/* oversized numeral — a gold bead on the thread. Outer span
                      masks the line behind the glyph; inner is metallic text. */}
                  <div
                    aria-hidden="true"
                    className="relative z-10 self-start justify-self-center"
                  >
                    <span className="block bg-base px-1 py-2">
                      <span
                        className="type-numeral text-gold-grad block text-center"
                        style={{ fontSize: "clamp(44px, 7vw, 84px)", lineHeight: 1 }}
                      >
                        {change.num}
                      </span>
                    </span>
                  </div>
                  <Reveal
                    delayMs={80}
                    className={`min-w-0 ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
                  >
                    <article
                      className="card spot"
                      style={
                        i % 2 === 1 ? { background: "var(--surface-2)" } : undefined
                      }
                    >
                      <h3 className="type-h3 text-primary">
                        <span className="sr-only">Change {i + 1} — </span>
                        {change.title}
                      </h3>
                      <p className="type-body text-secondary mt-4">{change.why}</p>
                      <p className="type-small text-gold-300 mt-5 flex items-start gap-2 border-t border-hairline-soft pt-4">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 font-semibold tracking-[0.14em] text-gold-500"
                        >
                          TONIGHT
                        </span>
                        <span className="text-secondary">{change.tonight}</span>
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ 4. PINNED SHOWPIECE — the single bold moment ============ */}
      <section className="bg-void grain aurora relative overflow-hidden border-t border-hairline-soft">
        <div className="pin-scene min-h-[200vh] md:min-h-[220vh]">
          <div className="pin-stage">
            <div className="container-site text-center">
              <Reveal className="mx-auto max-w-[900px]">
                <p className="eyebrow">THE STANDARD{/* [review] */}</p>
                <p className="font-display mt-6 text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.08] tracking-[-0.02em] text-primary">
                  You don&apos;t need more information.
                </p>
                <p className="font-display mt-2 text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.08] tracking-[-0.02em] text-secondary">
                  You need the first change,{" "}
                  <span className="text-gold-grad">done tonight.</span>
                </p>
              </Reveal>
              <Reveal delayMs={200} className="reveal-blur mx-auto mt-8 max-w-[52ch]">
                <p className="type-lead text-secondary">
                  Read it once and nothing changes. Do change one and you&apos;ve
                  already started. That&apos;s the whole difference.{/* [review] */}
                </p>
              </Reveal>
              {/* thread stitch under the statement */}
              <div
                aria-hidden="true"
                className="mx-auto mt-10 h-px w-40 max-w-full"
              >
                <span className="thread-h sd-draw block h-px w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. WHERE THIS LEADS — full-system bridge ============ */}
      <section className="bg-surface-warm cv-auto border-t border-hairline-soft">
        <div className="container-site section">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_360px] md:gap-16">
            <Reveal className="reveal-left order-2 md:order-1">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
                <p className="eyebrow">WHEN YOU&apos;RE READY FOR MORE{/* [review] */}</p>
              </div>
              <SplitHeading
                as="h2"
                text="The Blueprint is the start. Not the whole system."
                className="type-h2 text-primary mt-4"
              />
              <p className="type-lead text-secondary mt-5">
                These ten changes rebuild your foundation. When you want the full
                system built around your life — the training, the nutrition, the
                presence — that&apos;s what the coaching is for.{/* [review] */}
              </p>
              <Link
                href="/book"
                className="link-draw mt-7 inline-flex min-h-[48px] items-center gap-2 font-medium text-gold-300 transition-colors hover:text-gold-200"
              >
                See how the full rebuild works
                <ArrowRightIcon width={18} height={18} />
              </Link>
            </Reveal>

            {/* Portrait — parallax drift inside a fixed-ratio frame (zero CLS) */}
            <Reveal className="reveal-scale order-1 md:order-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-2xl border border-hairline-gold">
                <Image
                  src="/aditya/aditya_02.jpg"
                  alt="Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata"
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  className="sd-parallax-soft object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 6. FINAL CTA — one dominant path out ============ */}
      <FinalCta
        heading="You've read it. Now build it."
        sub="The man you want to become is one decision from starting."
        primaryLabel="Book Your Transformation Audit"
        primaryHref="/book"
        secondaryLabel="Back to Free Tools"
        secondaryHref="/tools"
      />
    </>
  );
}
