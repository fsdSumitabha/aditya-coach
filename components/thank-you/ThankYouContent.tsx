"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons";
import { track, waLink } from "@/lib/config";

/**
 * /thank-you client island.
 * Reads ?type= (whitelisted — raw query text is NEVER injected into the DOM),
 * swaps the hero H1 + subline copy only (layout identical), and fires the
 * Phase-1 track() stub exactly once on mount.
 *
 * The page server-renders <ThankYouFallback /> (default copy) inside
 * <Suspense>, so the route always has a stable <h1> before JS runs.
 */

type ThankYouType = "default" | "blueprint" | "split" | "booking";

const COPY: Record<
  ThankYouType,
  { h1: string; subline: string; waText: string }
> = {
  default: {
    h1: "You're In. Now the Work Begins.",
    subline:
      "The decision was the hardest part. Everything else follows. Check your WhatsApp and email for your next step.",
    waText: "Hi Aditya, I just signed up on your site.",
  },
  blueprint: {
    h1: "You're in. Check your inbox — and your WhatsApp.",
    subline:
      "Your free Lifestyle Blueprint is on its way. 10 changes that rebuild a man completely. Start tonight.",
    waText: "Hi Aditya, I just grabbed the free Lifestyle Blueprint.",
  },
  split: {
    h1: "You're in. Your training split is on its way.",
    subline:
      "Check your inbox — the exact 3-day fat-loss + muscle plan I use with every client is landing now. Also saved to your WhatsApp.",
    waText: "Hi Aditya, I just grabbed the free 3-day training split.",
  },
  booking: {
    h1: "You're in. Your consultation is booked.",
    subline:
      "Payment received. Check your WhatsApp and email — that's where we'll confirm your time and next steps. The decision was the hardest part.",
    waText:
      "Hi Aditya, I just booked my ₹2,000 consultation. Looking forward to it.",
  },
};

function sanitizeType(raw: string | null): ThankYouType {
  // Whitelist only — unknown/missing param falls back to the default state.
  return raw === "blueprint" || raw === "split" || raw === "booking"
    ? raw
    : "default";
}

/**
 * Gold check / seal mark. The framing rings paint at final state (visible —
 * progressive enhancement, JS-off safe); the check path draws itself in via
 * the kit's `stroke-draw` primitive (pathLength=60 to match the assumed
 * dasharray). Reduced-motion → the check is simply drawn, no animation.
 */
function SealMark() {
  return (
    <span aria-hidden="true" className="inline-flex">
      <svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <circle
          cx="36"
          cy="36"
          r="34"
          stroke="var(--gold-500)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <circle
          cx="36"
          cy="36"
          r="27.5"
          stroke="var(--gold-500)"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
        <path
          className="stroke-draw"
          pathLength={60}
          d="M24 37.5 32.5 46 48 28"
          stroke="var(--gold-500)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Shared presentational layout — only the copy differs per type. */
function ThankYouView({ type }: { type: ThankYouType }) {
  const copy = COPY[type];

  return (
    <section className="section-lg glow-top aurora grain relative overflow-hidden">
      <div className="container-site">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          {/* 1. Confirmation hero — seal check draws in → H1 (query-swapped,
              static, paints frame 1) → subline reveals a beat later for a
              quiet stagger. min-height reserved so the JS copy swap cannot
              shift layout (CLS < 0.1). */}
          <SealMark />
          <div className="mt-8 flex min-h-[232px] flex-col items-center md:min-h-[248px]">
            <h1 className="type-h1">{copy.h1}</h1>
            <Reveal
              as="p"
              delayMs={140}
              className="type-lead mt-5 text-secondary"
            >
              {copy.subline}
            </Reveal>
          </div>

          {/* 2. What happens next — quiet reassurance in Aditya's voice */}
          <Reveal as="section" index={1} className="mt-4">
            <h2 className="eyebrow">What happens next</h2>
            <ul className="type-body mt-5 space-y-2 text-secondary">
              <li>Watch your WhatsApp. That&apos;s where we actually talk.</li>
              {/* [review] */}
              <li>
                If you don&apos;t see the email in a few minutes, check spam or
                promotions.
              </li>
              {/* [review] */}
              <li>No rush, no pressure — just the next right step.</li>
              {/* [review] */}
            </ul>
          </Reveal>

          {/* 3 + 4. Primary WhatsApp CTA (prefill keyed to type) + back home */}
          <Reveal index={2} className="mt-12 flex w-full flex-col items-center">
            <div className="cta-stack max-w-[420px] md:max-w-none">
              <a
                href={waLink(copy.waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat with Aditya on WhatsApp
              </a>
              <Link href="/" className="btn-outline">
                ← Back to home
              </Link>
            </div>
          </Reveal>

          {/* 5. Soft cross-sell — blueprint/split only, kept secondary */}
          {(type === "blueprint" || type === "split") && (
            <Reveal as="p" index={3} className="type-small mt-10 text-secondary">
              {/* [review] */}
              <Link
                href="/book"
                className="underline decoration-[rgba(201,162,75,0.4)] underline-offset-4 transition-colors hover:text-primary"
              >
                When you&apos;re ready for the full picture, book your ₹2,000
                consultation.
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/** Static default state — rendered server-side as the <Suspense> fallback. */
export function ThankYouFallback() {
  return <ThankYouView type="default" />;
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const safeType = sanitizeType(searchParams.get("type"));

  // Fire the Phase-1 no-op conversion event exactly once (guard double-fire).
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track("thank_you_view", { type: safeType }); // safeType ∈ {default,blueprint,split,booking}
  }, [safeType]);

  return <ThankYouView type={safeType} />;
}
