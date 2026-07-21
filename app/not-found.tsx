import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/config";
import { pageMetadata } from "@/lib/site";

/**
 * /404 — on-brand recovery page for every unmatched route (e.g.
 * /blog/does-not-exist). Static export emits 404.html, which hosts serve with
 * a real HTTP 404 status. No auto-redirect — the user chooses the way back.
 * Global header, footer and WhatsApp FAB still render (extra recovery paths).
 */

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Page Not Found | Aditya Upadhyay Coaching",
    description:
      "This page doesn't exist. Head back to the home page, grab a free tool, or book your consultation.",
    path: "/404",
    noindex: true,
  }),
  // Spec 0.6: /404 is `noindex, follow` — crawlers may follow recovery links.
  robots: { index: false, follow: true },
};

const WA_404_PREFILL =
  "Hi Aditya, I landed on a page that doesn't exist and wanted to reach you.";

export default function NotFound() {
  return (
    <div className="bg-void">
      <section className="section-lg glow-top relative overflow-hidden">
        {/* Oversized ghost "404" drifting behind the content — one showpiece
            watermark, filled + whisper-faint, aria-hidden, clipped by the
            section's overflow-hidden so it never adds horizontal scroll. */}
        <span
          aria-hidden="true"
          className="ghost-word filled sd-ghost-drift"
          style={{ top: "14%", left: 0, right: 0, textAlign: "center" }}
        >
          404
        </span>
        <div className="container-site relative z-10">
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            {/* 1. Restrained 404 glyph — calm soft-focus fade, no bounce
                (Reveal + reveal-blur; reduced-motion safe, H1 stays static). */}
            <Reveal as="div" delayMs={0} className="reveal-blur">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(3.5rem,10vw,5.5rem)] leading-none text-[var(--gold-500)] opacity-90"
              >
                404
              </span>
            </Reveal>

            <h1 className="type-h1 mt-6">This page took the wrong path.</h1>
            <p className="type-lead mt-4 text-secondary">
              Let&apos;s fix the order.
            </p>
            {/* [review] Owner to pick the final H1 — brief line used above;
                approved sitemap alternate: "This page is living below its
                potential." (spec 5.2) */}

            {/* 2. One-line reassurance in Aditya's voice */}
            <Reveal as="p" index={1} className="type-body mt-8 text-secondary">
              {/* [review] */}
              You hit a link that doesn&apos;t exist. No problem — here&apos;s
              the way back.
            </Reveal>

            {/* 3. Primary CTA — the single dominant element */}
            <Reveal index={2} className="mt-10 flex w-full flex-col items-center">
              <div className="cta-stack max-w-[420px] md:max-w-none">
                <Link href="/" className="btn-gold">
                  Back to home
                </Link>
              </div>
            </Reveal>

            {/* 4. Secondary recovery links — back into the funnel */}
            <Reveal index={3} className="mt-9 w-full">
              <nav aria-label="More ways back">
                <ul className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-8">
                  <li>
                    <Link
                      href="/tools"
                      className="type-small inline-flex min-h-[48px] items-center px-3 text-secondary transition-colors hover:text-primary"
                    >
                      <span className="link-draw">Get a Free Tool</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/book"
                      className="type-small inline-flex min-h-[48px] items-center px-3 text-secondary transition-colors hover:text-primary"
                    >
                      <span className="link-draw">Book Your Transformation Audit</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href={waLink(WA_404_PREFILL)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-small inline-flex min-h-[48px] items-center gap-2 px-3 text-[var(--wa-green)] transition-opacity hover:opacity-80"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span className="link-draw">WhatsApp: Chat with Aditya</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
