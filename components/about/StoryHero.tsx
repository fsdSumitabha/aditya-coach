import Image from "next/image";

import FadeIn from "@/components/about/FadeIn";
import Reveal from "@/components/Reveal";
import { PinIcon } from "@/components/icons";

/**
 * /about — "My Story" hero.
 *
 * Replaces the old short hero + the separate §01 THE STORY block: the full
 * founder story now lives here, paced as an editorial spread so most of it
 * lands inside the opening screenful instead of a second section further down.
 *
 * COPY IS VERBATIM from docs/aditya_personal_story.md — every word and every
 * mark of punctuation is the owner's. The only liberty taken is line WRAPPING:
 * the source is hard-wrapped to a narrow column, so sentences that the source
 * broke mid-clause are joined here and re-broken by the browser. Stanza breaks
 * in the source become paragraph breaks. Do not reword, trim or "tighten" any
 * of it — re-sync from the doc if it changes.
 *
 * Layout: text/portrait spread → pull-quote → portrait/text spread (mirrored)
 * → the five-noun gold line → close + signature.
 *
 * H1 rule: the headline paints at final state on frame 1 — never wrapped in
 * FadeIn/Reveal, never given an opacity or transform entrance.
 */

// ---- Image constants (explicit dims match the files on disk → zero CLS) ----
// Present-day portrait: the man speaking, top of the spread.
const IMG_STORY_PORTRAIT = {
  src: "/aditya/img_about_hero_cropped.jpg",
  w: 385,
  h: 633,
  blurDataURL:
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQMEBf/EAB8QAAICAgIDAQAAAAAAAAAAAAECAxEABBIhBRMxcf/EABQBAQAAAAAAAAAAAAAAAAAAAAT/xAAWEQEBAQAAAAAAAAAAAAAAAAABABH/2gAMAwEAAhEDEQA/ADt7EuqF5RtIK7awB+Yldssoa1Fi6JHWWza0cvkTFKOSBAQPneZ8mlH7G4l1FmhfzC7IAv/Z",
} as const;

// The self-testing years — grain, black and white, shot by himself. Sits
// against the "I taught myself everything" beat, where it is evidence rather
// than physique display.
const IMG_STORY_WORK = {
  src: "/aditya/aditya_07.jpg",
  w: 465,
  h: 691,
  blurDataURL:
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQMG/8QAJRAAAQMCAwkAAAAAAAAAAAAAAQIDBAAREjFhBRMUFSFRU6HR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AM4lqOuIo7wBxBGKyMwddK+civR+FZu2gnAm5sO1FbQlIEhKIzYZaBGIBI6kHOr84j+FPv5Qf/9k=",
} as const;

/** Framed portrait — the page's one restrained gold moment, reused for both
 *  shots: 1px gold hairline, inner clip, slow settle-zoom on scroll. */
function FramedPortrait({
  img,
  alt,
  className,
  fadeDelayMs = 0,
}: {
  img: typeof IMG_STORY_PORTRAIT | typeof IMG_STORY_WORK;
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

      <div className="container-site section-lg relative z-10">
        {/* ---- Spread 1: the opening + the present-day portrait ---- */}
        <div className="grid items-start gap-10 nav:grid-cols-[minmax(0,1fr)_minmax(0,340px)] nav:gap-16">
          {/* Text — mobile: after the portrait; desktop: left column */}
          <div className="order-2 nav:order-1">
            <FadeIn className="flex items-center gap-4" delayMs={120}>
              <span aria-hidden="true" className="h-px w-10 bg-hairline-gold" />
              <p className="eyebrow">MY STORY{/* [review] */}</p>
            </FadeIn>

            {/* Hero H1 — LCP text, paints at final state frame 1. Never animated.
                Sized down from the old hero so the story itself carries the
                section instead of the headline. */}
            <h1 className="font-display mt-5 max-w-[16ch] text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-primary">
              I did not choose this path. This path chose me.
            </h1>

            <FadeIn
              as="p"
              className="type-lead text-primary mt-8 max-w-[54ch] leading-[1.7]"
              delayMs={200}
            >
              I was sixteen years old when I lost my father.
            </FadeIn>
            <FadeIn
              as="p"
              className="type-body text-secondary mt-5 max-w-[54ch] leading-[1.8]"
              delayMs={260}
            >
              In the years that followed, I watched my family be looked down
              upon by the world around us. I watched my mother carry weight no
              person should carry alone.
            </FadeIn>
            <FadeIn
              as="p"
              className="type-body text-secondary mt-5 max-w-[54ch] leading-[1.8]"
              delayMs={320}
            >
              That was the day I made a silent decision — I would figure this
              out myself.
            </FadeIn>
            <FadeIn
              as="p"
              className="type-body text-primary mt-5 max-w-[54ch] leading-[1.8]"
              delayMs={380}
            >
              I started with the only thing I could control.
              <span className="font-display mt-2 block text-[1.35em] leading-tight text-gold-300">
                My body.
              </span>
            </FadeIn>

            <FadeIn
              as="p"
              className="type-small text-muted mt-8 flex items-center gap-2"
              delayMs={440}
            >
              <PinIcon className="h-4 w-4 shrink-0 text-gold-500" />
              Kolkata · Coaching worldwide online
            </FadeIn>
            {/* No hero buttons — the persistent header [Book] gold button covers
                instant conversion. */}
          </div>

          {/* Portrait — mobile: leads (face builds trust fastest); desktop: right */}
          {/* Width caps set the rendered height: 385×633 (0.608), so 340px wide
              → ~559px tall. */}
          <FramedPortrait
            img={IMG_STORY_PORTRAIT}
            alt="Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata — present-day portrait, composed and direct to camera"
            className="order-1 mx-auto w-full max-w-[280px] nav:order-2 nav:mx-0 nav:max-w-[340px] nav:justify-self-end"
          />
        </div>

        {/* ---- The middle of the story: heaviest point, then the self-testing ---- */}
        <div className="mt-16 max-w-[60ch] nav:mt-20">
          <Reveal as="p" index={0} className="reveal-blur type-body text-secondary leading-[1.8]">
            At my heaviest, I was close to 100 kilograms. No confidence. No
            direction. The kid who sat at the back of every room and hoped
            nobody noticed him.
          </Reveal>
        </div>

        {/* ---- Spread 2 (mirrored): the work shot + the years of self-testing ---- */}
        <div className="mt-12 grid items-start gap-10 nav:grid-cols-[minmax(0,300px)_minmax(0,1fr)] nav:gap-16">
          {/* Plain Reveal (no reveal-scale): the portrait already carries
              sd-zoom, and nesting two scale animations reads as a wobble. */}
          <Reveal className="order-1 mx-auto w-full max-w-[240px] nav:mx-0 nav:max-w-[300px]">
            <FramedPortrait
              img={IMG_STORY_WORK}
              alt="Aditya during the self-testing years — training alone, documenting his own transformation"
            />
          </Reveal>

          <div className="order-2 max-w-[54ch]">
            <Reveal as="p" index={0} className="reveal-blur type-body text-secondary leading-[1.8]">
              I taught myself everything. Through trial. Through failure.
              Through testing every method, every approach, every philosophy —
              on myself first.
            </Reveal>
            <Reveal as="p" index={1} className="reveal-blur type-body text-secondary mt-5 leading-[1.8]">
              I went from 100 kilograms to a completely transformed body — not
              through a coach, not through a program — but through years of
              relentless self-education and self-testing.
            </Reveal>
            <Reveal as="p" index={2} className="reveal-blur type-body text-secondary mt-5 leading-[1.8]">
              Along the way I discovered something nobody was talking about.
            </Reveal>
          </div>
        </div>

        {/* ---- The turn — the loudest line in the story ---- */}
        <Reveal delayMs={120} className="reveal-blur mt-14 nav:mt-16">
          <p className="font-display border-l-2 border-gold-500 pl-6 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.25] text-gold-300">
            The body transformation was the easy part.
          </p>
        </Reveal>

        {/* ---- What the harder work actually was ---- */}
        <div className="mt-12 max-w-[62ch]">
          <Reveal as="p" index={0} className="reveal-blur type-lead text-primary leading-[1.7]">
            The harder work was becoming the man who could walk into any room
            and belong there. Who could speak with conviction. Who could carry
            himself with presence. Who could lead, connect and command respect
            not through aggression — but through becoming genuinely
            unignorable.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-body text-secondary mt-6 leading-[1.8]">
            I went from the kid who could not make eye contact to standing in
            front of rooms, leading people, building businesses and eventually
            coaching some of the most successful men in Kolkata — businessmen,
            entrepreneurs, hotel owners — men who had built empires but
            somewhere along the way had lost themselves.
          </Reveal>
          <Reveal as="p" index={2} className="reveal-blur type-body text-secondary mt-6 leading-[1.8]">
            I became COO of an IT company. I earned the money. I bought the
            things.
          </Reveal>
          <Reveal as="p" index={3} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
            And I had never felt more empty in my life.
          </Reveal>
          <Reveal as="p" index={4} className="reveal-blur type-body text-secondary mt-6 leading-[1.8]">
            That emptiness led me to the Bhagavad Gita. To Chanakya. To a
            deeper understanding of what a man is actually here to do.
          </Reveal>
          <Reveal as="p" index={5} className="reveal-blur type-body text-primary mt-6 leading-[1.8]">
            And that is when everything clicked.
          </Reveal>
        </div>

        {/* ---- The five nouns — the page's second and last gold moment ---- */}
        <Reveal delayMs={150} className="reveal-blur mt-12">
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.3] text-gold-300">
            The body. The mind. The presence. The discipline. The purpose.
          </p>
        </Reveal>

        {/* ---- The close ---- */}
        <div className="mt-10 max-w-[58ch]">
          <Reveal as="p" index={0} className="reveal-blur type-lead text-primary leading-[1.7]">
            These are not separate things. They are one thing.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
            And when a man works on all of them together — he becomes someone
            the world cannot ignore.
          </Reveal>
          <Reveal as="p" index={2} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
            That is what I am here to help you build.
          </Reveal>

          <Reveal delayMs={200} className="mt-12">
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
