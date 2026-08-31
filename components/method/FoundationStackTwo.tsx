import { Fragment } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { METHOD_STEPS as TIERS } from "@/components/method/method-steps";

/**
 * The Complete Rebuild as one plain column of layers, widest first: Lifestyle
 * at the top (100%) narrowing to Presence at the bottom (40%).
 *
 * Each box carries its own copy — no hover state, no side panel, no pinned
 * scene. Engagement comes from the scroll itself: boxes rise in sequence as
 * you reach them, a gold thread draws down the spine, and a connector arrow
 * between each pair walks the eye 01 → 02 → 03 → 04 → 05.
 *
 * Server component: nothing here needs JS beyond the shared Reveal primitive,
 * which is progressive (server HTML paints visible, reveal-once, reduced-motion
 * safe). Copy lives in components/method/method-steps.ts — `body` is VERBATIM.
 */
export default function FoundationStack() {
  return (
    <div className="container-site section relative">
      <p
        aria-hidden="true"
        className="type-caption mb-8 text-center tracking-[0.16em] text-gold-500 md:mb-10"
      >
        EVERYTHING SITS ON THIS ↓
      </p>{/* [review] */}

      <div className="relative flex flex-col items-center">
        {/* the gold thread — draws itself down the layers as you scroll */}
        <div
          aria-hidden="true"
          className="thread-v sd-draw absolute bottom-10 left-1/2 top-10 z-0 hidden md:block"
        />

        {TIERS.map((tier, i) => {
          const Icon = tier.Icon;
          return (
            <Fragment key={tier.num}>
              {i > 0 && (
                <Reveal
                  as="span"
                  delayMs={60}
                  className="relative z-10 my-3 block text-gold-500 md:my-4"
                >
                  <svg
                    width="18"
                    height="11"
                    viewBox="0 0 16 10"
                    fill="none"
                    aria-hidden="true"
                    className="float-idle"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <path
                      d="M1 1L8 8L15 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Reveal>
              )}

              {/* Width tapers on md+ only — on a phone every box is full width
                  so the copy inside stays readable. */}
              <Reveal
                className="reveal-scale relative z-10 w-full"
                style={{ maxWidth: `min(100%, ${tier.width})` }}
              >
                <article
                  className="@container group h-full rounded-lg border border-hairline-soft px-5 py-5 transition-transform duration-300 hover:-translate-y-1 md:px-7 md:py-6"
                  style={{
                    background: tier.bg,
                    borderLeft: `3px solid ${tier.edge}`,
                    boxShadow: "0 14px 40px -24px rgba(0,0,0,0.8)",
                  }}
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <span
                      aria-hidden="true"
                      className="float-idle inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-hairline-gold text-gold-500"
                      style={{ animationDelay: `${i * 0.55}s` }}
                    >
                      <Icon width={30} height={30} />
                    </span>
                    <div className="min-w-0">
                      <p aria-hidden="true" className="eyebrow">
                        Step {tier.num}
                      </p>
                      <h2 className="type-h3 mt-1 text-primary">
                        <span className="sr-only">Step {i + 1} — </span>
                        {tier.name}
                      </h2>
                    </div>
                    <span className="type-caption ml-auto hidden shrink-0 text-muted @md:block">
                      {tier.label}
                    </span>
                  </div>

                  {/* VERBATIM step copy — do not alter */}
                  <p className="type-lead mt-4 text-primary">{tier.body}</p>

                  {/* Columns follow the BOX's width, not the viewport's, so the
                      narrow lower layers keep a readable measure. */}
                  <div className="mt-4 grid gap-x-8 gap-y-3 border-t border-hairline-soft pt-4 @lg:grid-cols-2 @3xl:grid-cols-3">
                    {tier.depth.map((d) => (
                      <p key={d.lead} className="type-small text-secondary">
                        <strong className="font-semibold text-primary">
                          {d.lead}
                        </strong>{" "}
                        {d.text}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            </Fragment>
          );
        })}
      </div>

      <Reveal className="mt-12 flex flex-col items-center gap-6 md:mt-16">
        <p className="type-body mx-auto max-w-[48ch] text-center text-secondary">
          Everyone wants to live at the top. But the top only holds if the
          bottom is built first.
        </p>{/* [review] */}
        <Link
          href="/coaching"
          className="type-small inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline-gold px-6 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
        >
          See the coaching that builds this →{/* [review] */}
        </Link>
      </Reveal>
    </div>
  );
}
