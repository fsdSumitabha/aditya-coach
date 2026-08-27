import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { WhatsAppIcon } from "@/components/icons";
import { CHECKOUT_ANCHOR, PRICE } from "@/components/book/book-data";
import { COACH_WHATSAPP, waLink } from "@/lib/config";

/**
 * §8 — the close. The visitor has read the whole page; send him back up to
 * the decision he scrolled past.
 *
 * The primary button is a plain in-page anchor rather than a scripted scroll,
 * so it works before hydration — this page takes ad traffic on slow phones.
 *
 * 112px bottom padding keeps the WhatsApp FAB clear of the buttons.
 */
export default function BookFinalCta() {
  return (
    <section className="bg-void aurora grain border-hairline-soft relative overflow-hidden border-t">
      <div
        className="container-site section relative z-10 flex flex-col items-center text-center"
        style={{ paddingBottom: 112 }}
      >
        <SplitHeading
          as="h2"
          text="Ready to understand what needs to change?"
          className="type-h2 text-primary mx-auto max-w-[20ch]"
        />

        <Reveal
          delayMs={180}
          className="mt-9 w-full sm:w-auto"
          style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
        >
          <a href={CHECKOUT_ANCHOR} className="btn-gold shine-loop w-full leading-snug sm:w-auto">
            Start Your Transformation Audit — {PRICE}
          </a>
        </Reveal>

        <Reveal delayMs={260}>
          <p className="type-caption text-muted mt-5 max-w-[44ch]">
            {/* [review] */}
            Your Audit fee is adjusted against your program price if you
            continue with coaching.
          </p>
        </Reveal>

        <Reveal delayMs={340} className="mt-7">
          <a
            href={waLink(
              "Hi Aditya, I'd like to book the Transformation Audit." /* [review] */,
              COACH_WHATSAPP,
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
