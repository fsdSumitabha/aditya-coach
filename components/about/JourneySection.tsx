import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";

/**
 * /about — §02 MY JOURNEY.
 *
 * Replaces the old biographical timeline (four dated nodes + the 100kg photo).
 * No imagery here now: the section is pure argument — the work was earned, not
 * learned — so the type does the whole job.
 *
 * COPY IS VERBATIM from docs/aditya_journey.md. Every word and every mark of
 * punctuation is the owner's. The only liberty is line WRAPPING: the source is
 * hard-wrapped to a narrow column, so sentences it broke mid-clause are joined
 * here and re-broken by the browser. Stanza breaks become paragraph breaks.
 * Do not reword, trim or "tighten" any of it — re-sync from the doc if it
 * changes. The document's own title line ("My journey") is the chapter label.
 *
 * The gold thread survives from the old timeline, but it now runs the
 * iteration loop (failed → adjusted → tried again → refined → tested more)
 * instead of a biography. That keeps the .tl-dot ignite CSS in ABOUT_FX_CSS
 * doing real work.
 */

/* The refinement loop — five beats, each its own sentence in the source. */
const LOOP = [
  "I failed at it.",
  "I adjusted.",
  "I tried again.",
  "I refined.",
  "I tested more.",
] as const;

/* The two men the work is for. Deliberately NOT cards: §04 below already
   spends the two-card pattern, and repeating it here flattens both. */
const THE_TWO_MEN = [
  "The successful man above 30 who had built the career, made the money, earned the status — and somewhere along the way lost his health, his drive, his confidence and his presence.",
  "And the young man above 22 who wanted to build himself right from the very beginning — so he would never have to spend years rebuilding what he never built properly in the first place.",
] as const;

/* The closing ledger — the two spans of time, side by side. */
const LEDGER = [
  "Two years of professional coaching.",
  "Eight years of personal mastery.",
] as const;

export default function JourneySection() {
  return (
    // overflow-hidden pens the reveal-left/right entries so their transient
    // ±28px offset can never trip horizontal scroll.
    <section className="bg-base cv-auto overflow-hidden">
      <div className="container-site section">
        {/* ---- Header: the thesis ---- */}
        <div className="max-w-3xl">
          <Reveal className="mb-5">
            <div className="flex items-center gap-4">
              <span className="font-display text-[1.5rem] leading-none text-gold-500">
                02
              </span>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
              {/* the doc's own title line; .eyebrow does the uppercasing */}
              <span className="eyebrow">My journey</span>
            </div>
          </Reveal>

          <SplitHeading
            as="h2"
            text="Everything I teach — I have tested on myself first."
            className="type-h2 text-primary"
          />

          <Reveal as="p" delayMs={150} className="type-lead text-secondary mt-6 max-w-[54ch] leading-[1.7]">
            That is not a line. That is the only way I know how to work.
          </Reveal>
        </div>

        {/* ---- Eight years of testing ---- */}
        <div className="mt-12 max-w-[62ch] nav:mt-16">
          <Reveal as="p" index={0} className="reveal-blur type-body text-secondary leading-[1.8]">
            For the past eight years — every method, every protocol, every
            lifestyle change, every training principle, every mindset shift —
            has been tested on my own body and my own life before it ever
            reached a single client.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-body text-secondary mt-5 leading-[1.8]">
            I did not read this in a book. I did not learn it in a
            certification course.
          </Reveal>
        </div>

        {/* ---- The punch ---- */}
        <Reveal delayMs={120} className="reveal-blur mt-10">
          <p className="font-display border-l-2 border-gold-500 pl-6 text-[clamp(1.75rem,3.6vw,2.9rem)] leading-[1.2] text-gold-300">
            I lived it.
          </p>
        </Reveal>

        {/* ---- The loop — the gold thread, inherited from the old timeline ---- */}
        <div className="relative mt-12 nav:mt-14">
          {/* draws itself (scaleY) as the loop scrolls in */}
          <div
            aria-hidden="true"
            className="thread-v sd-draw absolute bottom-1 left-[11px] top-1"
          />
          <ol className="space-y-5">
            {LOOP.map((step, i) => (
              <Reveal
                as="li"
                key={step}
                index={i}
                className="reveal-left relative pl-12 nav:pl-16"
              >
                <span
                  aria-hidden="true"
                  className="tl-dot absolute left-[7px] top-[0.6em] h-[9px] w-[9px] rounded-full bg-gold-500 shadow-[0_0_12px_rgba(201,162,75,0.5)]"
                />
                <p className="type-lead text-primary leading-snug">{step}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ---- What eight years actually bought ---- */}
        <div className="mt-14 max-w-[62ch]">
          <Reveal as="p" index={0} className="reveal-blur type-body text-secondary leading-[1.8]">
            Eight years of building and rebuilding myself — my body, my
            presence, my communication, my mindset, my discipline, my purpose —
            as a continuous, relentless, daily practice.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
            Because I believe perfection is not a destination.
          </Reveal>
        </div>

        {/* ---- The section's single loudest line ---- */}
        <Reveal delayMs={150} className="reveal-blur mt-8">
          <p className="font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] text-gold-grad">
            It is a direction.
          </p>
        </Reveal>

        {/* ---- The daily question ---- */}
        <div className="mt-12 max-w-[58ch]">
          <Reveal className="reveal-blur">
            <blockquote className="font-display text-[clamp(1.25rem,2.4vw,1.7rem)] leading-[1.5] text-primary">
              Every single morning the only question I ask myself is — how can
              I be slightly better today than I was yesterday?
            </blockquote>
          </Reveal>
          <Reveal as="p" delayMs={150} className="reveal-blur type-lead mt-5 text-gold-300">
            Not perfect. Better.
          </Reveal>
        </div>

        {/* ---- Turning it professional ---- */}
        <div className="mt-14 max-w-[62ch]">
          <Reveal as="p" index={0} className="reveal-blur type-body text-secondary leading-[1.8]">
            Two years ago — after eight years of this work on myself — I made
            it professional.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-body text-secondary mt-5 leading-[1.8]">
            Because I had learned enough. I had tested enough. I had
            transformed enough of my own life to know with complete confidence
            that what I was doing worked.
          </Reveal>
          <Reveal as="p" index={2} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
            And that other men needed it.
          </Reveal>
          <Reveal as="p" index={3} className="reveal-blur type-body text-secondary mt-6 leading-[1.8]">
            Not just the men trying to lose weight. Not just the men trying to
            build muscle.
          </Reveal>
        </div>

        {/* ---- Who those men are — indented, gold-ruled, not carded ---- */}
        <div className="mt-10 grid max-w-4xl gap-8 nav:grid-cols-2 nav:gap-10">
          {THE_TWO_MEN.map((man, i) => (
            <Reveal
              key={man}
              index={i}
              className={i === 0 ? "reveal-left" : "reveal-right"}
            >
              <p className="type-body text-primary border-l border-hairline-gold pl-6 leading-[1.8]">
                {man}
              </p>
            </Reveal>
          ))}
        </div>

        {/* ---- The ledger: the two spans of time ---- */}
        <div className="mt-14 grid max-w-3xl gap-6 border-y border-hairline-soft py-8 sm:grid-cols-2">
          {LEDGER.map((line, i) => (
            <Reveal key={line} index={i}>
              <p className="font-display text-[clamp(1.15rem,2.2vw,1.5rem)] leading-snug text-primary">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        {/* ---- The close ---- */}
        <div className="mt-12 max-w-[56ch]">
          <Reveal as="p" index={0} className="reveal-blur type-lead text-primary leading-[1.7]">
            Every single thing I teach has been earned — not learned.
          </Reveal>
          <Reveal as="p" index={1} className="reveal-blur type-lead text-gold-300 mt-6">
            That is the difference.
          </Reveal>
          <Reveal as="p" index={2} className="reveal-blur type-lead text-gold-300 mt-2">
            And that is why it works.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
