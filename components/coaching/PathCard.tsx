import { CheckIcon } from "@/components/icons";
import CtaLink from "@/components/coaching/CtaLink";
import OfferGlyph from "@/components/coaching/OfferGlyph";
import TiltCard from "@/components/TiltCard";
import { BOOK_URL, type CoachingPath } from "@/components/coaching/coaching-data";

/**
 * One coaching path, rendered two ways from the same data:
 *
 *  - "standard"  — a column in the 2-up row (Lifestyle, Presence).
 *  - "flagship"  — the full-width band below it (Complete Transformation),
 *                  on card-featured so the premium tier reads as premium.
 *                  Its content splits into two columns so the extra width
 *                  buys hierarchy rather than a longer line length.
 *
 * Every CTA lands on /book — choosing a path does not buy the path, it starts
 * the Transformation Audit. That is the whole funnel of this page.
 */

function Included({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="type-small text-secondary flex gap-3">
          <CheckIcon
            aria-hidden="true"
            className="text-gold-500 mt-1 h-4 w-4 shrink-0"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="type-caption text-muted uppercase tracking-[0.12em]">
      {children}
    </p>
  );
}

function Cta({ path }: { path: CoachingPath }) {
  return (
    <CtaLink
      href={BOOK_URL}
      className={`w-full ${path.flagship ? "btn-gold" : "btn-outline"}`}
      data={{ page: "coaching", cta: `${path.id}_start_journey`, target: BOOK_URL }}
    >
      Start This Journey
      <span className="sr-only"> — {path.name}</span>
      <span aria-hidden="true">→</span>
    </CtaLink>
  );
}

export default function PathCard({ path }: { path: CoachingPath }) {
  const glyph = (
    <div className="self-start">
      <OfferGlyph kind={path.glyph} />
    </div>
  );

  // ---- Flagship: full-width, two inner columns, featured gold frame ----
  if (path.flagship) {
    return (
      <article id={path.id} className="card card-featured group relative scroll-mt-28">
        {/* Shine is hover-only: the badge keeps .shine-loop's frame + sweep
            gradient, but the idle loop is switched off and the sweep fires
            once when the card is hovered. */}
        <span
          className="shine-loop text-on-gold absolute -top-3.5 right-6 z-10 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] [&::before]:animate-none motion-safe:group-hover:[&::before]:animate-[shine-sweep_0.8s_var(--ease-standard)]"
          style={{ background: "var(--grad-gold)", boxShadow: "var(--glow-gold)" }}
        >
          Flagship
        </span>
        {/* The cursor glow rides an inner .spot so the badge can straddle the
            card's top edge without being clipped. */}
        <div className="spot">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Left — identity, who it's for, the outcome */}
            <div className="flex flex-col">
              {glyph}
              <h3 className="type-h3 text-primary mt-5">{path.name}</h3>
              <p className="type-small text-secondary mt-4">{path.who}</p>
              <p className="font-display text-primary mt-6 text-[clamp(1.3rem,2.2vw,1.7rem)] leading-snug">
                {path.outcome}
              </p>
              <p className="type-caption text-gold-300 border-hairline-gold mt-6 border-l pl-4">
                {path.pricing}
              </p>
            </div>

            {/* Right — what's included */}
            <div className="md:border-hairline-soft flex flex-col md:border-l md:pl-12">
              <Label>What&apos;s included</Label>
              <Included items={path.includes} />
            </div>
          </div>

          <div className="mt-9 w-full md:mx-auto md:max-w-[420px]">
            <Cta path={path} />
          </div>
        </div>
      </article>
    );
  }

  // ---- Standard: one column of the 2-up row ----
  return (
    <TiltCard className="h-full">
      <article id={path.id} className="card-dark-gold h-full scroll-mt-28">
        <div className="spot flex h-full flex-col">
          {glyph}
          <h3 className="card-head type-h3 mt-5">{path.name}</h3>
          <p className="type-small text-secondary mt-4">{path.who}</p>
          <p className="font-display text-primary mt-5 text-[1.2rem] leading-snug">
            {path.outcome}
          </p>

          <div className="mt-7">
            <Label>What&apos;s included</Label>
            <Included items={path.includes} />
          </div>

          <div className="mt-auto pt-8">
            <p className="type-caption text-gold-300 border-hairline-gold mb-5 border-l pl-4">
              {path.pricing}
            </p>
            <Cta path={path} />
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
