import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { HOW_HEADING, HOW_STEPS } from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §7 — "How the Audit Works" (brief §6B), five steps from payment to
 * deliverable.
 *
 * This is what removes the "what am I actually buying" hesitation a cold
 * visitor brings to a paid first call: every step named, including the last
 * one — that continuing into coaching is optional. Step 05 does more
 * conversion work than any other line on the page, so it is not softened.
 *
 * Set on the gold thread: one 1px line drawing itself down the numerals as you
 * scroll. Decorative, reduced-motion safe (kit classes handle both).
 */
export default function HowItWorks() {
  return (
    <section className="bg-base cv-auto">
      <div className={`container-site ${LP_SECTION}`}>
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text={HOW_HEADING}
            className="type-h2 text-primary"
          />

          <ol className="relative mt-10">
            {/* the thread runs behind the numerals, inset to their centre */}
            <span
              aria-hidden="true"
              className="thread-v sd-draw absolute bottom-4 left-[17px] top-3"
            />
            {HOW_STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.num}
                delayMs={Math.min(i, 5) * 80}
                className="relative flex gap-5 pb-7 last:pb-0"
              >
                {/* bg mask so the numeral reads as a node ON the thread */}
                <span
                  aria-hidden="true"
                  className="type-numeral bg-base h-fit shrink-0 py-1 text-[1.375rem] leading-none"
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="type-step text-primary">
                    <span className="sr-only">{`Step ${step.num}: `}</span>
                    {step.title}
                  </h3>
                  <p className="type-body text-secondary mt-1.5 max-w-[54ch]">
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
