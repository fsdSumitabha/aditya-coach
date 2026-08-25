import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { PRICE } from "@/components/book/book-data";

/**
 * §5 — "Why Start With an Audit?" The sales argument, made as a contrast.
 *
 * Two panels: what buying blind costs you, and what getting assessed first
 * buys you. Setting it side by side does the arguing faster than a paragraph
 * — and the muted panel next to the gold one makes the choice obvious without
 * a single urgency device.
 */
export default function WhyStartWithAudit() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-y">
      <div className="container-site section">
        <div className="mx-auto max-w-[820px] text-center">
          <Reveal>
            <p className="eyebrow">Why Start Here{/* [review] */}</p>
          </Reveal>
          <SplitHeading
            as="h2"
            text="You shouldn't have to guess which coaching you need."
            className="type-h2 text-primary mx-auto mt-4 max-w-[22ch]"
          />
          <Reveal delayMs={120} className="reveal-blur">
            <p className="type-lead text-secondary mx-auto mt-6 max-w-[54ch]">
              Instead of immediately buying an expensive program, you first get
              assessed by Aditya.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          <Reveal index={0} className="h-full">
            <div className="card h-full">
              <p className="type-caption text-muted uppercase tracking-[0.12em]">
                Without an audit
              </p>
              <p className="font-display text-secondary mt-4 text-[1.2rem] leading-snug">
                {/* [review] */}
                You pick a program by guessing.
              </p>
              <p className="type-body text-muted mt-4">
                {/* [review] */}
                You spend more, on the wrong thing, in the wrong order — and
                quit in six weeks believing the problem was you.
              </p>
            </div>
          </Reveal>

          <Reveal index={1} className="h-full">
            <div className="card-dark-gold h-full">
              <div className="spot">
                <p className="eyebrow">With an audit</p>
                <p className="font-display text-primary mt-4 text-[1.2rem] leading-snug">
                  {/* [review] */}
                  You get assessed first.
                </p>
                <p className="type-body text-secondary mt-4">
                  {/* [review] */}
                  {PRICE} tells you exactly what needs to change and in what
                  order — before you spend anything on coaching.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
