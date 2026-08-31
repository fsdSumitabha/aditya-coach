import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { LEAVE_WITH, LEAVE_WITH_HEADING } from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §3 — "What You Leave With" (brief §4).
 *
 * The section that makes the fee tangible: four outputs on a ruled list, not
 * four feature cards. A man scanning on a phone reads a list of things he
 * receives; a card grid he has to parse costs him a screen and gives nothing
 * back.
 *
 * The Blueprint is last and visually equal to the rest — never the headline
 * reason to buy. The product is the assessment (brief §4, "Important").
 */
export default function WhatYouLeaveWith() {
  return (
    <section className="bg-surface-warm grain cv-auto relative overflow-hidden">
      <div className={`container-site relative z-10 ${LP_SECTION}`}>
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text={LEAVE_WITH_HEADING}
            className="type-h2 text-primary max-w-[22ch]"
          />

          <ul className="mt-9">
            {LEAVE_WITH.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delayMs={Math.min(i, 4) * 80}
                className="border-hairline-soft border-t py-5 last:border-b"
              >
                <h3 className="type-step text-gold-300">{item.title}</h3>
                <p className="type-body text-secondary mt-2 max-w-[58ch]">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
