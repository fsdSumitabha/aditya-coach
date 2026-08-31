import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { AFTER_FORK, AFTER_STEPS } from "@/components/book/book-data";

/**
 * §4 — "What Happens After the Audit?"
 *
 *   Audit → Assessment → Recommendation
 *                              ↓
 *        Lifestyle · Presence · Complete
 *
 * Three nodes on the gold thread, then the thread forks. The fork is the
 * point: the audit ends in a recommendation, not in a contract. The line
 * under the fork says so in words, because this is the objection men bring
 * to a paid first call — that it is a sales trap.
 *
 * The three fork links are lateral (/coaching), which is the only direction
 * /book is allowed to link (CONVENTIONS funnel discipline).
 */
export default function AfterTheAudit() {
  return (
    <section className="bg-base cv-auto">
      <div className="container-site section">
        <SplitHeading
          as="h2"
          text="What Happens After the Audit?"
          className="type-h2 text-primary mx-auto max-w-[18ch] text-center"
        />

        {/* ---- The three sequential steps ---- */}
        <div className="relative mx-auto mt-14 max-w-3xl">
          <span
            aria-hidden="true"
            className="thread-v sd-draw absolute bottom-2 left-[13px] top-2 sm:hidden"
          />
          <span
            aria-hidden="true"
            className="thread-h sd-draw absolute left-0 right-0 top-[19px] hidden sm:block"
          />
          <ol className="grid gap-8 sm:grid-cols-3 sm:gap-4">
            {AFTER_STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.num}
                delayMs={i * 90}
                className="relative flex items-center gap-4 sm:flex-col sm:gap-0 sm:text-center"
              >
                {/* self-start / bg mask: the numeral is a node ON the thread,
                    so it must size to its own content, not stretch. */}
                <span
                  aria-hidden="true"
                  className="type-numeral bg-base shrink-0 self-start text-[1.6rem] leading-none sm:px-4 sm:text-[2rem]"
                >
                  {step.num}
                </span>
                <span className="font-display text-primary text-[1.15rem] sm:mt-4">
                  <span className="sr-only">Step {step.num}: </span>
                  {step.label}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ---- The fork ---- */}
        <Reveal delayMs={260} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col items-center">
            <span aria-hidden="true" className="thread-v sd-draw h-10" />
            <p className="type-caption text-muted mt-4 uppercase tracking-[0.12em]">
              Then one of three
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {AFTER_FORK.map((fork) => (
              <li key={fork.label}>
                <Link
                  href={fork.href}
                  className="card-dark-gold hover:border-hairline-gold flex min-h-[76px] items-center justify-center px-4 text-center transition-colors"
                >
                  <span className="font-display text-primary text-[1.0625rem] leading-snug">
                    {fork.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delayMs={340} className="reveal-blur mx-auto mt-12 max-w-[52ch] text-center">
          <p className="font-display text-primary text-[clamp(1.2rem,2.2vw,1.5rem)] leading-snug">
            {/* [review] — the objection this section exists to answer */}
            The Audit does not put you into a program.
          </p>
          <p className="type-body text-secondary mt-4">
            {/* [review] */}
            It tells you which one is appropriate — or whether you need one at
            all. What you do with that is your call.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
