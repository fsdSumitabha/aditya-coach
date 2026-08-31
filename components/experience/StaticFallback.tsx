import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "../Reveal";
import Marquee from "../Marquee";
import { FACTS, CHAPTERS } from "./facts";
import { LEGAL } from "@/lib/legal";

/**
 * The 2D journey — served when WebGL is unavailable, the device can't hold a
 * usable frame rate (perf watchdog), or the visitor prefers reduced motion.
 * Mirrors the 3D chapters with the same verbatim facts, animated with CSS
 * keyframes + IntersectionObserver reveals only, so it runs smoothly on any
 * phone, WebView, or in-app browser. All motion sits behind
 * prefers-reduced-motion: no-preference.
 */

function DiamondEmblem() {
  return (
    <div className="fb-diamond fb-enter" aria-hidden="true">
      <div className="fb-diamond-glow" />
      <svg viewBox="0 0 220 220" className="h-full w-full">
        <defs>
          <linearGradient id="fbA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ecd08a" />
            <stop offset="1" stopColor="#c9a24b" />
          </linearGradient>
          <linearGradient id="fbB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9a24b" />
            <stop offset="1" stopColor="#8a6a24" />
          </linearGradient>
          <linearGradient id="fbC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4e7c0" />
            <stop offset="1" stopColor="#c9a24b" />
          </linearGradient>
          <linearGradient id="fbD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a37f2e" />
            <stop offset="1" stopColor="#6b5320" />
          </linearGradient>
        </defs>
        <g className="fb-orbit">
          <ellipse
            cx="110"
            cy="110"
            rx="100"
            ry="34"
            fill="none"
            stroke="rgba(201,162,75,0.45)"
            strokeWidth="1.1"
          />
        </g>
        <g transform="rotate(-30 110 110)">
          <g className="fb-orbit fb-orbit--rev">
            <ellipse
              cx="110"
              cy="110"
              rx="84"
              ry="28"
              fill="none"
              stroke="rgba(201,162,75,0.22)"
              strokeWidth="1"
            />
          </g>
        </g>
        <g className="fb-gem">
          <polygon points="78,88 142,88 156,106 64,106" fill="url(#fbA)" />
          <polygon points="64,106 92,106 110,158" fill="url(#fbB)" />
          <polygon points="92,106 128,106 110,158" fill="url(#fbC)" />
          <polygon points="128,106 156,106 110,158" fill="url(#fbD)" />
          <polygon
            points="95,88 125,88 119,97 101,97"
            fill="rgba(255,246,220,0.5)"
          />
        </g>
        <path
          className="fb-spark"
          d="M164 70l2.2 6.2 6.2 2.2-6.2 2.2-2.2 6.2-2.2-6.2-6.2-2.2 6.2-2.2z"
          fill="#f4e7c0"
        />
      </svg>
    </div>
  );
}

export default function StaticFallback() {
  const steps = [
    FACTS["order-1"],
    FACTS["order-2"],
    FACTS["order-3"],
    FACTS["order-4"],
    FACTS["order-5"],
  ];
  const offers = [
    FACTS["offer-lifestyle"],
    FACTS["offer-audit"],
    FACTS["offer-presence"],
    FACTS["offer-complete"],
  ];
  const decision = CHAPTERS[4];

  return (
    <div className="bg-void grain overflow-hidden">
      {/* ---- Arrival ---- */}
      <section className="aurora relative flex min-h-[92svh] flex-col items-center justify-center px-5 py-20 text-center">
        <DiamondEmblem />
        <p className="eyebrow fb-enter mt-8" style={{ "--fb-delay": "120ms" } as CSSProperties}>
          MEN&apos;S TRANSFORMATION COACH &middot; KOLKATA &amp; WORLDWIDE{/* [review] */}
        </p>
        {/* visually the hero headline — the page's real h1 is the permanent
            sr-only one in app/page.tsx (exactly one h1 in every mode) */}
        <p
          className="type-h1 text-primary fb-enter mx-auto mt-4 max-w-[14ch]"
          style={{ "--fb-delay": "220ms" } as CSSProperties}
        >
          Become harder to ignore.
        </p>
        {/* [review] — replaces the verbatim §2 hero line at his instruction.
            Carries the result AND the mechanism ("in the right order"), which
            the old three-abstraction line did not. Needs Aditya's sign-off. */}
        <p
          className="type-lead text-secondary fb-enter mx-auto mt-5 max-w-xl"
          style={{ "--fb-delay": "340ms" } as CSSProperties}
        >
          I coach men to rebuild their body, presence, and daily habits &mdash;
          in the right order, so the change actually lasts.
        </p>
        {/* [review] — credibility marker. Figures are the ones the repo can
            source (facts.ts "man-after", about/JourneySection): eight years of
            self-testing, two years coaching. No client count is claimed
            because none is confirmed anywhere. */}
        <p
          className="type-small text-muted fb-enter mx-auto mt-4"
          style={{ "--fb-delay": "430ms" } as CSSProperties}
        >
          Eight years of self-testing. Two years coaching men in Kolkata and
          worldwide.
        </p>
        <div
          className="cta-stack fb-enter mt-8 justify-center"
          style={{ "--fb-delay": "520ms" } as CSSProperties}
        >
          <Link href="/book" className="btn-gold shine-loop">
            Book Your Transformation Audit &mdash; {LEGAL.CONSULT_PRICE}
          </Link>
          <Link href="/tools#blueprint" className="btn-outline">
            Get the Free Lifestyle Blueprint
          </Link>
        </div>
        <p
          className="type-caption text-muted fb-enter absolute bottom-6 tracking-[0.24em]"
          style={{ "--fb-delay": "700ms" } as CSSProperties}
        >
          SCROLL
        </p>
      </section>

      <Marquee
        items={["Body", "Lifestyle", "Mindset", "Personality", "Presence"]}
        speedS={30}
        className="border-y border-[rgba(201,162,75,0.14)] py-4"
      />

      {/* ---- The man ---- */}
      {/* Mobile shortens the flat journey to Hero → proof → CTA (rec #3), so
          this chapter is desktop-only. Hidden, not deleted: the desktop flat
          page still mirrors all five 3D chapters. */}
      <section className="container-site section hidden md:block">
        <Reveal className="text-center">
          <p className="eyebrow">{CHAPTERS[1].eyebrow}</p>
          <h2 className="type-h2 text-primary mt-3">{CHAPTERS[1].title}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {[FACTS["man-before"], FACTS["man-after"]].map((f, i) => (
            <Reveal key={f.id} index={i} className="card spot h-full">
              <p className="eyebrow">{f.eyebrow}</p>
              <h3 className="type-h3 text-primary mt-2">{f.title}</h3>
              <p className="type-body text-secondary mt-2">{f.body}</p>
              {f.attribution && (
                <p className="type-caption text-muted mt-3">{f.attribution}</p>
              )}
              {f.cta && (
                <Link
                  href={f.cta.href}
                  className="link-draw type-small mt-4 inline-block font-semibold text-gold-300"
                >
                  {f.cta.label}
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- The Complete Rebuild — narrowing slabs echo the 3D pyramid ---- */}
      {/* Desktop-only for the same reason as "The man" above. The method is
          still reachable on mobile: the hero sub states the right-order
          mechanism, and /method is one tap from the nav. */}
      <section className="container-site section relative hidden md:block">
        <Reveal className="text-center">
          <p className="eyebrow">{CHAPTERS[2].eyebrow}</p>
          <h2 className="type-h2 text-primary mt-3">{CHAPTERS[2].title}</h2>
        </Reveal>
        <div className="mt-12 flex flex-col items-center gap-3">
          {steps.map((f, i) => (
            <Reveal
              key={f.id}
              index={i}
              className="fb-slab"
              style={{ width: `calc(100% - ${i * 7}%)` }}
            >
              <span className="fb-slab-num" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h3 className="type-h3 text-primary tracking-[0.14em]">
                  {f.title}
                </h3>
                <p className="type-small text-secondary mt-1">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/method"
            className="link-draw type-small font-semibold text-gold-300"
          >
            See the full method →
          </Link>
        </Reveal>
      </section>

      {/* ---- The proof ---- */}
      <section className="container-site section">
        <Reveal className="text-center">
          <p className="eyebrow">{CHAPTERS[3].eyebrow}</p>
          <h2 className="type-h2 text-primary mt-3">{CHAPTERS[3].title}</h2>
          <p className="type-lead text-secondary mx-auto mt-4 max-w-xl">
            {CHAPTERS[3].sub}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {[FACTS["proof-client"], FACTS["proof-truth"]].map((f, i) => (
            /* rec #3: mobile shows one proof card, desktop both. */
            <Reveal
              key={f.id}
              index={i}
              className={`card spot h-full ${i === 1 ? "hidden sm:block" : ""}`}
            >
              <p className="eyebrow">{f.eyebrow}</p>
              <h3 className="type-h3 text-primary mt-2">{f.title}</h3>
              <p className="type-body text-secondary mt-2">{f.body}</p>
              {f.attribution && (
                <p className="type-caption text-muted mt-3">{f.attribution}</p>
              )}
              {f.cta && (
                <Link
                  href={f.cta.href}
                  className="link-draw type-small mt-4 inline-block font-semibold text-gold-300"
                >
                  {f.cta.label}
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- One decision ---- */}
      <section className="aurora container-site section-lg text-center">
        <Reveal>
          <p className="eyebrow">{decision.eyebrow}</p>
          <h2 className="type-h2 text-primary mx-auto mt-3 max-w-[22ch]">
            {decision.title}
          </h2>
          <p className="type-lead text-secondary mx-auto mt-4 max-w-xl">
            {decision.sub}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((f, i) => (
            <Reveal
              key={f.id}
              index={i}
              className={`card spot h-full ${
                f.id === "offer-audit" ? "fb-featured" : ""
              }`}
            >
              {f.id === "offer-audit" && (
                <p className="type-caption mb-2 font-semibold tracking-[0.2em] text-gold-300">
                  RECOMMENDED
                </p>
              )}
              <p className="eyebrow">{f.eyebrow}</p>
              <h3 className="type-h3 text-primary mt-2">{f.title}</h3>
              <p className="type-small text-secondary mt-2">{f.body}</p>
              {f.cta && (
                <Link
                  href={f.cta.href}
                  className="link-draw type-small mt-4 inline-block font-semibold text-gold-300"
                >
                  {f.cta.label}
                </Link>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal className="cta-stack mt-12 justify-center">
          <Link href="/book" className="btn-gold shine-loop">
            Book Your Transformation Audit
          </Link>
          <Link href="/tools#blueprint" className="btn-outline">
            {FACTS["blueprint"].cta?.label}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
