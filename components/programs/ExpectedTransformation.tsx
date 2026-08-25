import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { EXPECTED_OUTCOMES } from "@/components/programs/programs-data";

/**
 * §6 — "The Expected Transformation." Outcomes, not features.
 *
 * Set as a ledger rather than a card grid: a hairline rule per line, a small
 * gold index, the outcome in display type. Quiet and editorial — the boldness
 * budget for this page was spent on the path cards, and a second loud section
 * would flatten both.
 *
 * Seven outcomes leave an eighth cell on a four-up grid; that cell takes the
 * closing line instead of an orphan gap.
 */
export default function ExpectedTransformation() {
  return (
    <section className="bg-surface-1 border-hairline-soft cv-auto border-y">
      <div className="container-site section">
        <Reveal>
          <p className="eyebrow text-center">The Outcome{/* [review] */}</p>
        </Reveal>
        <SplitHeading
          as="h2"
          text="The Expected Transformation"
          className="type-h2 text-primary mx-auto mt-4 max-w-[18ch] text-center"
        />
        <Reveal delayMs={120} className="reveal-blur mx-auto mt-5 max-w-[50ch] text-center">
          <p className="type-body text-secondary">
            {/* [review] */}
            Not what you get. What changes.
          </p>
        </Reveal>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
          {EXPECTED_OUTCOMES.map((outcome, i) => (
            <Reveal
              as="li"
              key={outcome}
              // capped stagger — 8 items at index*100ms would run 700ms, well
              // past the kit's ~500ms ceiling for a grid landing
              delayMs={Math.min(i, 4) * 70}
              className="border-hairline-soft flex items-baseline gap-4 border-t py-6"
            >
              <span
                aria-hidden="true"
                className="font-display text-gold-500 shrink-0 text-[0.8125rem] leading-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-primary text-[1.0625rem] leading-snug">
                {outcome}
              </span>
            </Reveal>
          ))}

          {/* Eighth cell — the closer, not an empty slot */}
          <Reveal
            as="li"
            delayMs={350}
            className="border-hairline-gold flex items-baseline border-t py-6"
          >
            <span className="font-display text-gold-300 text-[1.0625rem] leading-snug">
              {/* [review] */}
              All of it. In the right order.
            </span>
          </Reveal>
        </ul>

        <Reveal delayMs={200}>
          <p className="type-caption text-muted mt-10 text-center">
            Individual results vary. Aditya is a lifestyle coach, not a doctor or
            registered dietitian — see the disclaimer in the footer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
