import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { LANDING_FAQS } from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §9 — the FAQ, capped at the five approved questions (brief §8).
 *
 * Not the site's seven. The brief forbids adding a sixth: an extra question
 * on a landing page raises an objection the visitor did not arrive with, and
 * costs more conversions than it saves. Nothing here explains the coaching
 * programmes and nothing makes a medical claim.
 *
 * Native <details>/<summary> — keyboard, screen readers and no-JS all work for
 * free, and the section stays a Server Component. The same array is emitted as
 * FAQPage JSON-LD by the page, so the two can never disagree.
 */
export default function LandingFaq() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-t">
      <div className={`container-site ${LP_SECTION}`}>
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text="Questions."
            className="type-h2 text-primary"
          />

          <div className="mt-8 grid gap-3">
            {LANDING_FAQS.map((faq, i) => (
              <Reveal key={faq.q} delayMs={Math.min(i, 5) * 60}>
                <details className="card group spot">
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="type-h3 text-primary text-[1.0625rem] md:text-[1.15rem]">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-gold-300 text-xl leading-none transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="type-body text-secondary mt-3 max-w-[64ch]">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
