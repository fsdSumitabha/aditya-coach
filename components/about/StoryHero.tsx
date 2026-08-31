import Image from "next/image";

import FadeIn from "@/components/about/FadeIn";
import Reveal from "@/components/Reveal";
import { PinIcon } from "@/components/icons";

/**
 * /about — "My Story" hero.
 *
 * SHORTENED 2026-08-31. /about has to build trust in ~60 seconds, not five
 * minutes of reading. The section used to run the full founder story across
 * two zig-zag spreads (~20 paragraphs) — paced for reading, not scanning.
 * It is now ONE spread and THREE paragraphs:
 *   1. where he started  — sixteen, the silent decision, 100kg, no confidence
 *   2. what he learned   — self-testing, and that the body was the easy part
 *   3. why he coaches    — the five are one thing, and that is what he builds
 *
 * COPY IS STILL VERBATIM from docs/aditya_personal_story.md — every sentence
 * kept here is the owner's, unchanged, and in the source's own order. The edit
 * SELECTS sentences; it does not reword, compress or paraphrase a single one.
 * If you need to change what the page says, change which sentences are kept —
 * never how one reads.
 *
 * Merged in from the removed §02 MY JOURNEY (docs/aditya_journey.md):
 * "Everything I teach has been tested in real life before it reaches a client." — that section's
 * one unique point. The rest of it retold this same 100kg / self-testing /
 * became-a-coach story a second time on one page.
 *
 * TODO (owner): the full long-form story — the COO years, the emptiness, the
 * Bhagavad Gita, the Kolkata clients, the eight-year refinement loop — has a
 * home as a blog post. Both source docs are intact; no link is wired here
 * until that post exists. Do not re-inline it on this page.
 *
 * H1 rule: the headline paints at final state on frame 1 — never wrapped in
 * FadeIn/Reveal, never given an opacity or transform entrance.
 */

// ---- Image constant (explicit dims match the file on disk → zero CLS) ----
// Present-day portrait: the man speaking. The second spread's self-testing
// work shot (/aditya/aditya_07.jpg) came out with the second spread — the
// before/after proof now lands entirely in <TransformationSplit /> above.
const IMG_STORY_PORTRAIT = {
  src: "/aditya/img_about_hero_cropped.jpg",
  w: 385,
  h: 633,
  blurDataURL:
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQMEBf/EAB8QAAICAgIDAQAAAAAAAAAAAAECAxEABBIhBRMxcf/EABQBAQAAAAAAAAAAAAAAAAAAAAT/xAAWEQEBAQAAAAAAAAAAAAAAAAABABH/2gAMAwEAAhEDEQA/ADt7EuqF5RtIK7awB+Yldssoa1Fi6JHWWza0cvkTFKOSBAQPneZ8mlH7G4l1FmhfzC7IAv/Z",
} as const;

/** Framed portrait — 1px gold hairline, inner clip, slow settle-zoom on scroll. */
function FramedPortrait({
  img,
  alt,
  className,
  fadeDelayMs = 0,
}: {
  img: typeof IMG_STORY_PORTRAIT;
  alt: string;
  className?: string;
  fadeDelayMs?: number;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <FadeIn
        className="pointer-events-none absolute inset-0 rounded-[18px] border border-hairline-gold"
        durationMs={900}
        delayMs={fadeDelayMs}
        y={0}
      >
        <span aria-hidden="true" />
      </FadeIn>
      <div className="overflow-hidden rounded-[16px] p-1.5">
        <Image
          src={img.src}
          width={img.w}
          height={img.h}
          alt={alt}
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="sd-zoom block h-auto w-full rounded-[16px]"
        />
      </div>
    </div>
  );
}

export default function StoryHero() {
  return (
    // id="story" — the landing point for the opener's bridge control.
    <section
      id="story"
      className="bg-void glow-top grain aurora relative overflow-hidden"
    >
      {/* ONE ghost word, low behind the spread — from the story's vocabulary. */}
      <span
        aria-hidden="true"
        className="ghost-word sd-ghost-drift -bottom-6 left-0 right-0 text-center"
      >
        REBUILT
      </span>

      <div className="container-site section relative z-10">
        {/* ================= The spread · portrait RIGHT =================
            Three paragraphs beside the face. Short enough that the whole
            argument — started here, learned this, so this is what I build —
            is scannable without a second screenful. */}
        <div className="grid items-start gap-10 nav:grid-cols-[minmax(0,1fr)_minmax(0,360px)] nav:gap-14">
          {/* Text — mobile: after the portrait; desktop: left column */}
          <div className="order-2 max-w-[60ch] nav:order-1">
            <FadeIn className="flex items-center gap-4" delayMs={120}>
              <span aria-hidden="true" className="h-px w-10 bg-hairline-gold" />
              <p className="eyebrow">MY STORY{/* [review] */}</p>
            </FadeIn>

            {/* Hero H1 — LCP text, paints at final state frame 1. Never animated. */}
            <h1 className="font-display mt-4 max-w-[16ch] text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-primary">
              I did not choose this path. This path chose me.
            </h1>

            {/* ---- 1 · Where he started ---- */}
            <FadeIn
              as="p"
              className="type-body text-secondary mt-6 leading-[1.8]"
              delayMs={200}
            >
              <span className="type-lead text-primary">
                I was sixteen years old when I lost my father.
              </span>{" "}
              That was the day I made a silent decision — I would figure this
              out myself. I started with the only thing I could control.
              <span className="font-display my-3 block text-[1.45em] leading-tight text-primary">
                My body.
              </span>
              At my heaviest, I was close to 100 kilograms. No confidence. No
              direction. The kid who sat at the back of every room and hoped
              nobody noticed him.
            </FadeIn>

            {/* ---- 2 · What he learned ---- */}
            <FadeIn
              as="p"
              className="type-body text-secondary mt-6 leading-[1.8]"
              delayMs={280}
            >
              I went from 100 kilograms to a completely transformed body — not
              through a coach, not through a program — but through years of
              relentless self-education and self-testing.{" "}
              <span className="text-primary">
                The body transformation was the easy part.
              </span>{" "}
              The harder work was becoming the man who could walk into any room
              and belong there. Who could speak with conviction. Who could carry
              himself with presence.
            </FadeIn>

            {/* ---- 3 · Why he coaches ---- */}
            <Reveal
              as="p"
              delayMs={80}
              className="reveal-blur type-body text-secondary mt-6 leading-[1.8]"
            >
              {/* the page's one big gold moment */}
              <span className="font-display mb-3 block text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.3] text-gold-grad">
                The body. The mind. The presence. The discipline. The purpose.
              </span>
              These are not separate things. They are one thing. And when a man
              works on all of them together — he becomes someone the world
              cannot ignore.{" "}
              <span className="type-lead text-primary">
                That is what I am here to help you build.
              </span>
            </Reveal>
          </div>

          {/* Portrait — mobile: leads (face builds trust fastest); desktop: right.
              Width caps set the rendered height: 385×633 (0.608), so 360px wide
              → ~592px tall. The locator line sits under the face, where it
              reads as a credential rather than interrupting the story. */}
          <div className="order-1 mx-auto w-full max-w-[280px] nav:order-2 nav:mx-0 nav:max-w-[360px] nav:justify-self-end">
            <FramedPortrait
              img={IMG_STORY_PORTRAIT}
              alt="Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata — present-day portrait, composed and direct to camera"
            />
            <FadeIn
              as="p"
              className="type-small text-muted mt-4 flex items-center gap-2"
              delayMs={360}
            >
              <PinIcon className="h-4 w-4 shrink-0 text-gold-500" />
              Kolkata · Coaching worldwide online
            </FadeIn>
            {/* No hero buttons — the persistent header [Book] gold button covers
                instant conversion. */}
          </div>
        </div>

        {/* ---- The close: the one point carried over from the removed
               §02 MY JOURNEY, then the signature. Verbatim from
               docs/aditya_journey.md. ---- */}
        <div className="mt-12 max-w-[58ch] nav:mt-14">
          <Reveal className="reveal-blur">
            <p className="font-display border-l-2 border-gold-500 pl-6 text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.3] text-primary">
              Everything I teach has been tested in real life before it reaches a client.
            </p>
          </Reveal>

          <Reveal delayMs={200} className="mt-8">
            <p className="font-display text-2xl italic text-gold-300">
              — Aditya{/* [review] */}
            </p>
            <p className="type-caption mt-2 uppercase tracking-[0.18em] text-muted">
              Aditya Kumar Upadhyay
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
