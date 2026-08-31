import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import FinalCta from "@/components/FinalCta";

// ============================================================
// HOME — positioning block, rendered BELOW the 3D journey.
//
// Answers the brief's §1 in plain HTML: what he actually works on is the man
// people meet — everything that decides how he is received.
//
// Order: THE WORK (two lines, then the /method link) → conversion.
//
// This used to open with a correction section — "I'm not a gym coach. I'm not
// a nutritionist." over a struck-through list of training plans, diet charts,
// supplement stacks and motivation. Removed at the owner's request, 13 Aug
// 2026: the page now leads with what the work IS rather than spending the
// first screen after the journey on what it is not.
//
// THE WORK also carried a four-card discipline grid (Grooming / Presence /
// Communication / Confidence) with tag pills and a separate reconciliation
// paragraph. Removed at the owner's request, 27 Aug 2026: the 3D journey (and
// its static fallback) already establishes the scope, so re-explaining it here
// was a second layer of the same argument. Two sentences and the CTA now.
//
// All copy is written in Aditya's voice and tagged [review] for his audit.
// ============================================================


export default function Positioning() {
  return (
    <>
      {/* ============ THE WORK — the positive core (showpiece) ============ */}
      <section className="cv-auto relative overflow-hidden border-t border-hairline-soft bg-base">
        <div className="container-site section relative z-10">
          <Reveal className="max-w-[760px]">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
              <p className="eyebrow">THE WORK{/* [review] */}</p>
            </div>
            <SplitHeading
              as="h2"
              text="What I actually build."
              className="type-h2 text-primary mt-4"
            />
            <p className="type-lead mt-5 text-secondary">
              Everything that decides how a man is received — before he speaks,
              while he speaks, and after he has left.
            </p>{/* [review] */}
            {/* reconciles this page with /method + /programs — the body work
                still exists, it is simply the floor rather than the product */}
            <p className="type-lead mt-5 text-secondary">
              The training and the food still happen — they are the floor, not
              the ceiling.
            </p>{/* [review] */}
            <p className="mt-6">
              <Link href="/method" className="link-draw font-medium text-gold-300">
                The order I work through it in →{/* [review] */}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CONVERSION ============ */}
      <FinalCta
        heading="Build the presence people take seriously."
        sub="Forty-five minutes on WhatsApp. We find what is actually holding you back, and the order to fix it in."
        primaryLabel="Book Your Transformation Audit"
        primaryHref="/book"
        secondaryLabel="See the Programs"
        secondaryHref="/programs"
      />
      {/* [review] — CTA band copy in his voice */}

    </>
  );
}
