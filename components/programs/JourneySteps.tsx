import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { JOURNEY_STEPS } from "@/components/programs/programs-data";

/**
 * §3 — "What Happens After You Choose."
 *
 * The job of this section is to kill one specific misreading: that the three
 * programs are three separate processes you commit to blind. They aren't —
 * they're three destinations off one starting point.
 *
 * So the gold thread does the arguing. Desktop: one horizontal line runs
 * behind all three nodes, left to right, drawing itself as you scroll.
 * Mobile: the same line turns vertical down the left gutter. Same idea,
 * same primitive, no duplicated markup.
 */
export default function JourneySteps() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-y">
      <div className="container-site section">
        <SplitHeading
          as="h2"
          text="What Happens After You Choose"
          className="type-h2 text-primary mx-auto max-w-[18ch] text-center"
        />
        <Reveal delayMs={120} className="reveal-blur mx-auto mt-5 max-w-[52ch] text-center">
          <p className="type-body text-secondary">
            {/* [review] — the point of the whole section */}
            The three paths are not three separate processes. They are three
            destinations from one starting point.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl">
          {/* The thread: vertical down the gutter on mobile, horizontal across
              the row of numerals from md up. Decorative — the numbers 01/02/03
              already carry the order in the accessible tree. */}
          <span
            aria-hidden="true"
            className="thread-v sd-draw absolute left-[15px] top-2 bottom-2 md:hidden"
          />
          <span
            aria-hidden="true"
            className="thread-h sd-draw absolute left-0 right-0 top-[22px] hidden md:block"
          />

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {JOURNEY_STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.num}
                index={i}
                className="relative flex gap-5 md:flex-col md:gap-0"
              >
                {/* The numeral sits ON the thread — its background masks the
                    line so the digit reads as a node, not an overlap. */}
                {/* self-start is load-bearing: as a stretched flex item this
                    span's bg-alt would mask the whole thread instead of just
                    the node it sits on. */}
                <span
                  className="type-numeral bg-alt shrink-0 self-start text-[1.9rem] leading-none md:px-4 md:text-[2.5rem]"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div className="md:mt-6 md:px-4">
                  <h3 className="type-h3 text-primary text-[1.15rem] md:text-[1.3rem]">
                    <span className="sr-only">Step {step.num}: </span>
                    {step.title}
                  </h3>
                  <p className="type-body text-secondary mt-2 max-w-[34ch]">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
