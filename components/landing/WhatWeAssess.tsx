import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import {
  ASSESS,
  ASSESS_FOOTNOTE,
  ASSESS_HEADING,
} from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §5 — "What We Assess" (brief §5B).
 *
 * FIVE categories, set as a compact label/line list rather than a card grid.
 * Cards here cost roughly a screen of phone scroll to say five short things,
 * and this section only has to establish scope before the visitor reaches the
 * price. The full site's exhaustive checklist is deliberately absent — the
 * brief caps this at five and forbids listing 15–30 subtopics.
 *
 * The footnote does real work: it answers "so you'll waste my time on things
 * I've already sorted" before the money is asked for.
 */
export default function WhatWeAssess() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-t">
      <div className={`container-site ${LP_SECTION}`}>
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text={ASSESS_HEADING}
            className="type-h2 text-primary"
          />

          <dl className="mt-9">
            {ASSESS.map((item, i) => (
              <Reveal
                as="div"
                key={item.title}
                delayMs={Math.min(i, 5) * 70}
                className="border-hairline-soft grid gap-1 border-t py-4 last:border-b sm:grid-cols-[9rem_1fr] sm:gap-6 sm:py-4"
              >
                <dt className="type-step text-gold-300">{item.title}</dt>
                <dd className="type-body text-secondary m-0">{item.body}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delayMs={420}>
            <p className="type-small text-muted border-hairline-gold mt-8 max-w-[58ch] border-l pl-4">
              {ASSESS_FOOTNOTE}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
