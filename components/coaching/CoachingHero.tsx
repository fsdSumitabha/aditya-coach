import Reveal from "@/components/Reveal";
import CtaLink from "@/components/coaching/CtaLink";
import { BOOK_URL, PATHS } from "@/components/coaching/coaching-data";

/**
 * §1 — the opener. States the offer, names the three paths, points at one door.
 *
 * The device under the sub is the site's gold thread doing narrative work: one
 * horizontal line drops three verticals, one per path. "Three ways in, one
 * system" said with a line instead of a sentence. Each drop is the anchor link
 * to its card, so it doubles as the "Find Your Path" navigation.
 *
 * Server component. The h1 carries no Reveal — LCP paints at final state.
 */
export default function CoachingHero() {
  return (
    <section className="bg-void aurora grain relative overflow-hidden">
      <div className="container-site relative z-10 flex min-h-[calc(56dvh-var(--header-h))] flex-col justify-center py-12 md:py-16">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-8" />
            <p className="eyebrow">THE PROGRAMS</p>
            <span aria-hidden="true" className="thread-h sd-draw h-px w-8" />
          </div>

          {/* Hero H1 — never animated (LCP paints at final state, frame 1) */}
          <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.03em] text-primary">
            Three Paths. One Transformation.{/* [review] */}
          </h1>

          <Reveal delayMs={80}>
            <p className="type-body text-secondary mx-auto mt-4 max-w-[56ch]">
              {/* [review] */}
              Body and lifestyle. Personality and presence. Or both, rebuilt
              together. Every path starts the same way — with a Transformation
              Audit.
            </p>
          </Reveal>

          {/* The gold thread splits: one line, three drops, three paths. */}
          <Reveal delayMs={140} className="mx-auto mt-10 max-w-[520px]">
            <span aria-hidden="true" className="thread-h sd-draw block w-full" />
            <div className="grid grid-cols-3">
              {PATHS.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="group flex min-h-[64px] flex-col items-center pt-0"
                >
                  <span
                    aria-hidden="true"
                    className="thread-v sd-draw h-7 opacity-70 transition-opacity group-hover:opacity-100"
                  />
                  <span className="type-caption text-secondary mt-2 transition-colors group-hover:text-primary">
                    {p.shortName}
                  </span>
                  <span className="sr-only"> — jump to {p.name}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delayMs={220} className="mt-8">
            <div className="flex flex-col items-center gap-3">
              <CtaLink
                href={BOOK_URL}
                className="btn-gold shine-loop w-full sm:w-auto"
                data={{ page: "coaching", cta: "hero_start", target: BOOK_URL }}
              >
                Start Your Transformation
              </CtaLink>
              <a
                href="#paths"
                className="link-draw type-small text-secondary hover:text-primary inline-flex min-h-[48px] items-center transition-colors"
              >
                Find Your Path ↓
              </a>
            </div>
          </Reveal>

          <Reveal delayMs={300}>
            <p className="type-caption text-muted mt-6">
              {/* [review] */}
              Kolkata · Coaching worldwide online
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
