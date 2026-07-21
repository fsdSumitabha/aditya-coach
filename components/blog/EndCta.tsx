import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

/**
 * End-of-article CTA block (spec B1.6) — closes the article, before the
 * author box. Contained (not a full-bleed band — that placement differs
 * materially from the shared FinalCta band, so it's built in-page per
 * CONVENTIONS). Copy is the verbatim final-CTA voice from the copy bank;
 * button order/destination is driven by post.primaryCTA.
 */
const CTA_MAP = {
  blueprint: {
    primaryLabel: "Get My Free Blueprint",
    primaryHref: "/tools#blueprint",
    secondaryLabel: "Book Your Transformation Audit",
    secondaryHref: "/book",
  },
  calculator: {
    primaryLabel: "Try the Calorie Calculator",
    primaryHref: "/tools#calculator",
    secondaryLabel: "Book Your Transformation Audit",
    secondaryHref: "/book",
  },
  book: {
    primaryLabel: "Book Your Transformation Audit",
    primaryHref: "/book",
    secondaryLabel: "Get My Free Blueprint",
    secondaryHref: "/tools#blueprint",
  },
} as const;

export default function EndCta({
  primaryCTA,
}: {
  primaryCTA: PostMeta["primaryCTA"];
}) {
  const cta = CTA_MAP[primaryCTA];
  return (
    <aside
      aria-label="Take the next step"
      className="card card-featured aurora overflow-hidden mt-14 text-center"
    >
      <h2 className="type-h2 mx-auto max-w-[20ch] text-primary">
        The man you want to become is waiting for one decision.
      </h2>
      <p className="type-lead mx-auto mt-4 max-w-xl text-secondary">
        Start with a free blueprint. Or book your Transformation Audit today. Either way
        — start now.
      </p>
      <div className="cta-stack mt-8 md:justify-center">
        <Link href={cta.primaryHref} className="btn-gold shine-loop">
          {cta.primaryLabel}
        </Link>
        <Link href={cta.secondaryHref} className="btn-outline">
          {cta.secondaryLabel}
        </Link>
      </div>
    </aside>
  );
}
