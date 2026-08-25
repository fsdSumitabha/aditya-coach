import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon } from "@/components/icons";
import CtaLink from "@/components/programs/CtaLink";
import OfferGlyph from "@/components/programs/OfferGlyph";
import PriceTicker from "@/components/programs/PriceTicker";
import { AUDIT_UNCOVERS, BOOK_URL } from "@/components/programs/programs-data";
import { CONSULT_INCLUDES, LEGAL } from "@/lib/legal";

/**
 * §4 — "Why the Audit Comes First."
 *
 * The only price on this page, and the only decision the visitor is asked to
 * make today. Two columns: the argument on the left, the transaction on the
 * right in a warm gold-framed panel so the eye lands on the number.
 *
 * Price and the fee-credit promise both come from lib/legal.ts — a price
 * change is a one-line edit there, never a find-and-replace through JSX.
 */
export default function WhyAuditFirst() {
  return (
    <section className="bg-surface-warm aurora grain cv-auto relative overflow-hidden">
      <div className="container-site section relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ---- Left: why you don't have to work this out alone ---- */}
          <div>
            <Reveal>
              <p className="eyebrow">The Starting Point{/* [review] */}</p>
            </Reveal>
            <SplitHeading
              as="h2"
              text="Why the Audit Comes First"
              className="type-h2 text-primary mt-4 max-w-[16ch]"
            />
            <Reveal delayMs={120} className="reveal-blur mt-6">
              <p className="type-lead text-secondary max-w-[46ch]">
                You don&apos;t need to figure everything out yourself.
              </p>
            </Reveal>

            <Reveal delayMs={180} className="mt-8">
              <p className="type-caption text-muted uppercase tracking-[0.12em]">
                The Audit is where Aditya understands
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {AUDIT_UNCOVERS.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    index={i}
                    className="border-hairline-soft flex items-center gap-4 border-b pb-4"
                  >
                    <CheckIcon
                      aria-hidden="true"
                      className="text-gold-500 h-4 w-4 shrink-0"
                    />
                    <span className="type-body text-primary">{item}</span>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---- Right: the transaction ---- */}
          <Reveal
            delayMs={100}
            className="reveal-scale"
            style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
          >
            <div className="card card-featured">
              <div className="spot flex flex-col">
                <div className="float-idle self-start">
                  <OfferGlyph kind="audit" />
                </div>
                <h3 className="type-h3 text-primary mt-5">Transformation Audit</h3>

                {/* the one number this page exists to sell */}
                <p className="font-display text-gold-grad mt-3 text-[clamp(2.4rem,4vw,3.2rem)] leading-none">
                  <PriceTicker value={LEGAL.CONSULT_PRICE_INR} />
                </p>
                <p className="type-small text-muted mt-2">
                  45 minutes · online via WhatsApp
                </p>

                <div className="gold-line my-6" aria-hidden="true" />

                {/* The fee credit — the money argument, set apart from the
                    deliverables. Copy lives in lib/legal.ts. */}
                <p className="type-small text-gold-300 border-hairline-gold border-l pl-4">
                  {CONSULT_INCLUDES.CREDIT}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {[CONSULT_INCLUDES.GIFT_CARD, CONSULT_INCLUDES.BLUEPRINT].map(
                    (item) => (
                      <li
                        key={item}
                        className="type-small text-secondary flex gap-3"
                      >
                        <CheckIcon
                          aria-hidden="true"
                          className="text-gold-500 mt-1 h-4 w-4 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-8">
                  <CtaLink
                    href={BOOK_URL}
                    className="btn-gold w-full"
                    data={{ page: "programs", cta: "audit_start", target: BOOK_URL }}
                  >
                    Start Your Audit
                  </CtaLink>
                  <p className="type-caption text-muted mt-3 text-center">
                    {/* [review] */}
                    Every transformation begins here.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
