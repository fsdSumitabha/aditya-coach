import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Shared end-of-page conversion band (internal-linking funnel, A5).
 * Deep pages end with this → /book primary, /tools secondary by default.
 * Reserves FAB clearance (pb ≥ 88px) so the WhatsApp button never covers a CTA.
 */
export default function FinalCta({
  heading = "The man you want to become is waiting for one decision.",
  sub,
  primaryLabel = "Book Your Transformation Audit",
  primaryHref = "/book",
  secondaryLabel = "Get My Free Blueprint",
  secondaryHref = "/tools#blueprint",
  primaryFirst = true,
}: {
  heading?: string;
  sub?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string;
  primaryFirst?: boolean;
}) {
  const primary = (
    <Link key="p" href={primaryHref} className="btn-gold shine-loop">
      {primaryLabel}
    </Link>
  );
  const secondary = secondaryLabel ? (
    <Link key="s" href={secondaryHref} className="btn-outline">
      {secondaryLabel}
    </Link>
  ) : null;

  return (
    <section className="bg-surface-warm glow-top grain aurora relative overflow-hidden border-t border-hairline-soft">
      <div
        className="container-site section flex flex-col items-center text-center"
        style={{ paddingBottom: 112 }}
      >
        <Reveal>
          <h2 className="type-h2 text-primary max-w-[18ch] mx-auto">{heading}</h2>
        </Reveal>
        {sub && (
          <Reveal index={1}>
            <p className="type-lead text-secondary mt-4 max-w-xl mx-auto">{sub}</p>
          </Reveal>
        )}
        <Reveal index={2} className="mt-8 w-full sm:w-auto">
          <div className="cta-stack justify-center">
            {primaryFirst ? [primary, secondary] : [secondary, primary]}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
