import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon } from "@/components/icons";
import { PRICE, WHAT_YOU_GET } from "@/components/book/book-data";
import { CONSULT_INCLUDES } from "@/lib/legal";

/**
 * §3 — "What You Get."
 *
 * The job here is to make ₹999 concrete, so it is set as a manifest: the
 * deliverables listed like line items, ruled off, and the total stated at the
 * bottom — the tailor's invoice, not a features grid. The fee-credit promise
 * sits directly under the total, because that is where a man reading a total
 * is looking.
 */
export default function WhatYouGet() {
  return (
    <section className="bg-surface-warm grain cv-auto relative overflow-hidden">
      <div className="container-site section relative z-10">
        <div className="mx-auto max-w-[720px]">
          <Reveal>
            <p className="eyebrow text-center">Included{/* [review] */}</p>
          </Reveal>
          <SplitHeading
            as="h2"
            text="What You Get"
            className="type-h2 text-primary mx-auto mt-4 text-center"
          />

          <Reveal delayMs={120} className="mt-12">
            <div className="card">
              <ul className="flex flex-col">
                {WHAT_YOU_GET.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    delayMs={Math.min(i, 4) * 70}
                    className="border-hairline-soft flex items-start gap-4 border-b py-4 first:pt-0"
                  >
                    <CheckIcon
                      aria-hidden="true"
                      className="text-gold-500 mt-1 h-4 w-4 shrink-0"
                    />
                    <span className="type-body text-primary">{item}</span>
                  </Reveal>
                ))}
              </ul>

              {/* The total, ruled off like a line on an invoice */}
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="type-caption text-muted uppercase tracking-[0.12em]">
                  Today
                </span>
                <span className="font-display text-gold-grad text-[clamp(1.9rem,3.4vw,2.4rem)] leading-none">
                  {PRICE}
                </span>
              </div>
              <p className="type-small text-gold-300 border-hairline-gold mt-5 border-l pl-4">
                {CONSULT_INCLUDES.CREDIT}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
