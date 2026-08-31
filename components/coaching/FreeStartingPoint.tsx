import Reveal from "@/components/Reveal";
import CtaLink from "@/components/coaching/CtaLink";
import { BLUEPRINT_URL } from "@/components/coaching/coaching-data";

/**
 * §7 — the catch-net. For the man who is interested but not paying today.
 *
 * Deliberately quiet: one line, one outline button, hairline rules top and
 * bottom. It must not compete with the Audit — it is the second-best outcome
 * on this page, and it should look like it.
 */
export default function FreeStartingPoint() {
  return (
    <section className="bg-alt border-hairline-soft border-b">
      <div className="container-site py-14 md:py-16">
        <Reveal className="reveal-blur mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:gap-10 md:text-left">
          <div>
            <p className="font-display text-primary text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug">
              Not ready to start with the Audit?
            </p>
            <p className="type-small text-secondary mt-2">
              {/* [review] */}
              Start with the Blueprint. Read it, run it, then decide.
            </p>
          </div>
          <CtaLink
            href={BLUEPRINT_URL}
            className="btn-outline w-full shrink-0 md:w-auto"
            data={{ page: "coaching", cta: "free_blueprint", target: BLUEPRINT_URL }}
          >
            Get the Free Blueprint
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
