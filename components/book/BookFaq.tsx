import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { BOOK_FAQS } from "@/components/book/book-data";

/**
 * §7 — the objection band, at the bottom where objections actually surface.
 *
 * Native <details>/<summary>: keyboard, screen readers and no-JS all work
 * for free, and it stays a Server Component. Same card design the page
 * already used for its FAQ, so the swap in content is not a swap in look.
 *
 * The answers are also emitted as FAQPage JSON-LD from app/book/page.tsx,
 * from this same array — the two can never disagree.
 */
export default function BookFaq() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-t">
      <div className="container-site section">
        <div className="mx-auto max-w-[720px]">
          <SplitHeading
            as="h2"
            text="Quick questions."
            className="type-h2 text-primary"
          />

          <div className="mt-8 grid gap-4">
            {BOOK_FAQS.map((faq, i) => (
              <Reveal key={faq.q} delayMs={Math.min(i, 5) * 60}>
                <details className="card group spot">
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="type-h3 text-primary text-[1.0625rem] md:text-[1.15rem]">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-gold-300 text-xl leading-none transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="type-body text-secondary mt-3 max-w-[64ch]">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          {/* ONE lateral context link — funnel discipline keeps /book pointing
              only sideways (/programs, /refund, /privacy), never back up. */}
          <Reveal delayMs={420}>
            <p className="type-small text-muted mt-10 text-center">
              Wondering what comes after the call?{" "}
              <Link
                href="/programs"
                className="underline underline-offset-2 hover:text-secondary"
              >
                See the full coaching programs
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
