import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { BOOKING_ANCHOR, FINAL_CTA } from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/**
 * §10 — the close (brief §9, "EXACT FINAL CTA").
 *
 * One statement, one button, nothing else. The Free Lifestyle Blueprint is
 * deliberately NOT offered here: the visitor clicked an ad for the Audit, and
 * a cheaper exit placed immediately before a purchase takes the sale instead
 * of supporting it (brief §9, "For the Meta Ads landing page").
 *
 * The button is a plain in-page anchor rather than a scripted scroll, so it
 * works before hydration — this page takes ad traffic on slow phones.
 */
export default function LandingFinalCta() {
  return (
    <section className="bg-void aurora grain border-hairline-soft relative overflow-hidden border-t">
      <div className={`container-site relative z-10 flex flex-col items-center pb-24 text-center ${LP_SECTION}`}>
        <SplitHeading
          as="h2"
          text={FINAL_CTA.headline}
          className="type-h2 text-primary mx-auto max-w-[18ch]"
        />

        <Reveal delayMs={120}>
          <p className="type-lead text-secondary mt-5">{FINAL_CTA.sub}</p>
        </Reveal>



        <Reveal
          delayMs={280}
          className="mt-6 w-full sm:w-auto"
          style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
        >
          <a
            href={BOOKING_ANCHOR}
            className="btn-gold shine-loop w-full leading-snug sm:w-auto"
          >
            {FINAL_CTA.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
