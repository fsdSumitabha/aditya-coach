import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon } from "@/components/icons";
import { WHO_FOR, WHO_HEADING } from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §4 — "Who This Is For" (brief §5A).
 *
 * Qualification, five lines, second person to one male reader (AGENTS.md).
 * The brief strips the age-range cards and demographic segmentation the full
 * site carries — a cold ad visitor should recognise himself in a sentence,
 * not sort himself into a bracket.
 */
export default function WhoThisIsFor() {
  return (
    <section className="bg-base cv-auto">
      <div className={`container-site ${LP_SECTION}`}>
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text={WHO_HEADING}
            className="type-h2 text-primary"
          />

          <ul className="mt-8 flex flex-col gap-3.5">
            {WHO_FOR.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delayMs={Math.min(i, 5) * 70}
                className="flex items-start gap-3.5"
              >
                <CheckIcon
                  aria-hidden="true"
                  className="text-gold-500 mt-1 h-[18px] w-[18px] shrink-0"
                />
                <span className="type-body text-secondary">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
