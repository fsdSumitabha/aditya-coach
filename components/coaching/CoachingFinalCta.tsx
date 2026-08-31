import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { WhatsAppIcon } from "@/components/icons";
import CtaLink from "@/components/coaching/CtaLink";
import { BOOK_URL, PRICE_CONSULT } from "@/components/coaching/coaching-data";
import { waLink } from "@/lib/config";

/**
 * §8 — the close. One question, one button, one reassurance.
 *
 * Built in-page rather than with <FinalCta> because the band carries the price
 * inside the button label and the fee-credit line beneath it — materially
 * different from the shared component's two-CTA layout.
 *
 * 112px bottom padding keeps the WhatsApp FAB clear of the button.
 */
export default function CoachingFinalCta() {
  return (
    <section className="bg-void aurora grain border-hairline-soft relative overflow-hidden border-t">
      <div
        className="container-site section relative z-10 flex flex-col items-center text-center"
        style={{ paddingBottom: 112 }}
      >
        <SplitHeading
          as="h2"
          text="Ready to start your transformation?"
          className="type-h2 text-primary mx-auto max-w-[18ch]"
        />

        <Reveal
          delayMs={180}
          className="mt-9 w-full sm:w-auto"
          style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
        >
          <CtaLink
            href={BOOK_URL}
            className="btn-gold shine-loop w-full leading-snug sm:w-auto"
            data={{ page: "coaching", cta: "final_book", target: BOOK_URL }}
          >
            Start With Your Transformation Audit — {PRICE_CONSULT}
          </CtaLink>
        </Reveal>

        <Reveal delayMs={260}>
          <p className="type-caption text-muted mt-5 max-w-[42ch]">
            Your Audit fee is adjusted if you continue with coaching.
          </p>
        </Reveal>

        <Reveal delayMs={340} className="mt-7">
          <a
            href={waLink(
              "Hi Aditya, I've read the coaching page and want to know which path fits me." /* [review] */,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="type-small text-wa hover:text-wa-deep inline-flex min-h-[48px] items-center gap-2 font-medium transition-colors"
          >
            <WhatsAppIcon width={18} height={18} />
            Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
