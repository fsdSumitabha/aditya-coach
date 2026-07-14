import Link from "next/link";
import { FACTS } from "./facts";

/**
 * Content-first fallback when WebGL is unavailable or the visitor prefers
 * reduced motion: the same verbatim facts as the 3D journey, as a calm page.
 */
export default function StaticFallback() {
  const cards = [
    FACTS["man-after"],
    FACTS["order-1"],
    FACTS["order-2"],
    FACTS["order-3"],
    FACTS["order-4"],
    FACTS["proof-client"],
    FACTS["offer-discovery"],
    FACTS["blueprint"],
  ];

  return (
    <div className="bg-void grain">
      <section className="container-site section-lg text-center">
        <p className="eyebrow">
          MEN&apos;S LIFESTYLE COACH · COACHING WORLDWIDE
        </p>
        {/* visually the hero headline — the page's real h1 is the permanent
            sr-only one in app/page.tsx (exactly one h1 in every mode) */}
        <p className="type-h1 text-primary mx-auto mt-4 max-w-[19ch]">
          Most men are living below their potential. This page changes that.
        </p>
        <p className="type-lead text-secondary mx-auto mt-5 max-w-xl">
          Men&apos;s Lifestyle Coach helping men rebuild their body, mind and
          confidence. <span className="text-muted">|</span> Coaching worldwide
        </p>
        <div className="cta-stack mt-8 justify-center">
          <Link href="/tools#blueprint" className="btn-gold">
            Get My Free Blueprint
          </Link>
          <Link href="/book" className="btn-outline">
            Book a Consultation
          </Link>
        </div>
      </section>

      <section className="container-site section">
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((f) => (
            <article key={f.id} className="card">
              <p className="eyebrow">{f.eyebrow}</p>
              <h2 className="type-h3 text-primary mt-2">{f.title}</h2>
              <p className="type-body text-secondary mt-2">{f.body}</p>
              {f.attribution && (
                <p className="type-caption text-muted mt-2">{f.attribution}</p>
              )}
              {f.cta && (
                <Link
                  href={f.cta.href}
                  className="link-draw type-small mt-4 inline-block font-semibold text-gold-300"
                >
                  {f.cta.label}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
