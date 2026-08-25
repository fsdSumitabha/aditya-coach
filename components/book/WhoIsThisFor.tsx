import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon } from "@/components/icons";
import { AUDIT_IS_FOR, AUDIT_IS_NOT_FOR } from "@/components/book/book-data";

/**
 * §6 — "Who Is This For?" A qualification filter, which matters most on the
 * traffic this page is built for: cold visitors arriving straight from an ad.
 *
 * Written second person to one male reader (AGENTS.md), so the list reads as
 * a stem sentence continued by each item. The disqualifier gets its own rule
 * and its own mark — it is doing real work, not softening the section.
 */
export default function WhoIsThisFor() {
  return (
    <section className="bg-base cv-auto">
      <div className="container-site section">
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text="Who Is This For?"
            className="type-h2 text-primary text-center"
          />

          <Reveal delayMs={100} className="mt-10">
            <p className="type-lead text-primary text-center">
              This is for you if you{/* [review] */}
            </p>
          </Reveal>

          <ul className="mx-auto mt-8 flex max-w-[36rem] flex-col gap-4">
            {AUDIT_IS_FOR.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                index={i}
                className="border-hairline-soft flex items-center gap-4 border-b pb-4"
              >
                <CheckIcon
                  aria-hidden="true"
                  className="text-gold-500 h-5 w-5 shrink-0"
                />
                <span className="type-body text-primary">{item}</span>
              </Reveal>
            ))}
          </ul>

          {/* The disqualifier — deliberately not softened */}
          <Reveal delayMs={420} className="mx-auto mt-10 max-w-[36rem]">
            <p className="type-body text-muted flex items-center gap-4">
              <span
                aria-hidden="true"
                className="border-hairline-soft text-muted inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[13px] leading-none"
              >
                ×
              </span>
              <span>{AUDIT_IS_NOT_FOR}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
