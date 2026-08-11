"use client";

// /about §0 — THE SPLIT ("Before | After", the page opener).
//
// Two halves, one seam. Left half fades through the BEFORE frames, right half
// fades through the AFTER frames, both driven by the SAME index so the pair
// always reads as one man at two points in time. The "swiper fade effect"
// is a 3-frame opacity crossfade — no carousel library needed (the project
// contract forbids new npm packages, and a synchronised crossfade is ~40
// lines of state).
//
// Between them: THE BRIDGE — the site's gold thread runs down the seam,
// through a medallion (the → arrow = before→after, and the control that
// advances the pair), and out of the bottom into the scroll cue that drops
// the reader into the story.
//
// Autoplay and manual drive the SAME index and coexist: the pairs cycle on
// their own every SLIDE_MS, and the arrow / ticks jump the reader wherever he
// wants without ending the cycle — a manual move just restarts the dwell so
// he gets a full beat on the pair he chose. The explicit pause toggle is the
// only thing that stops it (WCAG 2.2.2), alongside the automatic pauses on
// hover, on keyboard focus, and when the section scrolls out of view.
//
// ⚠️  DEMO ASSETS — NOT FOR LAUNCH  ⚠️
// The six files under /public/demo are unrelated stock photographs. They are
// placeholders for layout only. Site rule: no client photo ships without
// written consent, and /about itself promises "no stock photos, no borrowed
// proof". Swap DEMO_PAIRS for consented client frames (or Aditya's own)
// before this section is published.

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ArrowRightIcon } from "@/components/icons";

/** id of the founder-story <section> on /about — the bridge's destination. */
const STORY_ID = "story";

/**
 * Autoplay frequency — how long each pair holds before the crossfade.
 * Also the sweep hand's revolution time, so the ring always reads as a
 * countdown to the next pair. Override per-instance with `intervalMs`.
 */
const SLIDE_MS = 3000;

/** ⚠️ placeholders — see the DEMO ASSETS note above. All frames are 2:3. */
const DEMO_PAIRS = [
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-11795044.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495739.jpg",
  },
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-36148298.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495740.jpg",
  },
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-37196695.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495747.jpg",
  },
] as const;

/** Each half is ~440px at the 880px cap, ~47vw below it. */
const HALF_SIZES = "(min-width: 900px) 440px, 47vw";

// ---- Component-scoped FX (kept out of globals.css — shared file, never edited).
// Every animation is transform/opacity only and lives inside a
// prefers-reduced-motion: no-preference guard, so the reduced-motion and
// no-JS states are the finished frame, not a blank one.
const TSPLIT_FX_CSS = `
.tsplit-slide { opacity: 0; }
.tsplit-slide[data-active="true"] { opacity: 1; }

.tsplit-thread {
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--gold-500) 14%, var(--gold-500) 86%, transparent);
  transform-origin: top center;
}

.tsplit-medallion:hover .tsplit-ring,
.tsplit-medallion:focus-visible .tsplit-ring { border-color: var(--gold-500); }
.tsplit-medallion:active .tsplit-ring { transform: scale(0.96); }

.tsplit-bridge:hover .tsplit-bridge-ring,
.tsplit-bridge:focus-visible .tsplit-bridge-ring { border-color: var(--gold-500); }

/* Slide ticks — scaleX + colour only, so the row never reflows. */
.tsplit-tick-bar { transform: scaleX(0.55); background: rgba(244, 241, 234, 0.3); }
.tsplit-tick[aria-current="true"] .tsplit-tick-bar { transform: scaleX(1); background: var(--gold-300); }
.tsplit-tick:hover .tsplit-tick-bar { background: var(--gold-500); }

.tsplit-toggle:hover .tsplit-toggle-ring,
.tsplit-toggle:focus-visible .tsplit-toggle-ring,
.tsplit-toggle[aria-pressed="true"] .tsplit-toggle-ring {
  border-color: var(--gold-500);
  color: var(--gold-200);
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .tsplit-slide { transition: opacity 900ms var(--ease-standard); }

  .tsplit-thread { animation: tsplit-draw 1100ms var(--ease-out-expo) both; }

  /* Sweep hand: one revolution per dwell — tells you when the pair turns. */
  .tsplit-orbit { animation: tsplit-orbit var(--tsplit-dur) linear infinite; }
  .tsplit-orbit[data-paused="true"] { animation-play-state: paused; }

  .tsplit-arrow { transition: transform 300ms var(--ease-out-expo); }
  .tsplit-medallion:hover .tsplit-arrow,
  .tsplit-medallion:focus-visible .tsplit-arrow { transform: translateX(3px); }

  .tsplit-ring { transition: border-color 300ms var(--ease-standard), transform 200ms var(--ease-out-expo); }
  .tsplit-bridge-ring { transition: border-color 300ms var(--ease-standard), transform 300ms var(--ease-out-expo); }
  .tsplit-bridge:hover .tsplit-bridge-ring { transform: translateY(3px); }

  .tsplit-chevron { animation: tsplit-bob 2400ms ease-in-out infinite; }

  .tsplit-tick-bar { transition: transform 400ms var(--ease-out-expo), background-color 300ms var(--ease-standard); }
  .tsplit-toggle-ring { transition: border-color 300ms var(--ease-standard), color 300ms var(--ease-standard), opacity 300ms var(--ease-standard); }
}

@keyframes tsplit-draw { from { transform: scaleY(0); } }
@keyframes tsplit-orbit { to { transform: rotate(360deg); } }
@keyframes tsplit-bob {
  0%, 100% { transform: translateY(-1px); }
  50% { transform: translateY(2px); }
}
`;

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseGlyph({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
      {playing ? (
        <g fill="currentColor">
          <rect x="8" y="6" width="3" height="12" rx="1.2" />
          <rect x="13" y="6" width="3" height="12" rx="1.2" />
        </g>
      ) : (
        <path fill="currentColor" d="M9 6.2 18 12l-9 5.8V6.2Z" />
      )}
    </svg>
  );
}

/** One half of the split: a fixed frame, three stacked frames, one visible. */
function Half({
  side,
  index,
  eager,
}: {
  side: "before" | "after";
  index: number;
  eager: boolean;
}) {
  const isBefore = side === "before";
  return (
    <figure
      className={`relative m-0 h-[clamp(300px,54vh,430px)] overflow-hidden border-y border-hairline-soft bg-surface-2 nav:h-[min(70vh,620px)] ${
        isBefore
          ? "rounded-l-[20px] border-l"
          : "rounded-r-[20px] border-r"
      }`}
    >
      {DEMO_PAIRS.map((pair, i) => (
        <div
          key={pair[side]}
          data-active={i === index}
          aria-hidden={i !== index}
          className="tsplit-slide absolute inset-0"
        >
          <Image
            src={pair[side]}
            alt={
              isBefore
                ? `Transformation frame ${i + 1} of ${DEMO_PAIRS.length} — before`
                : `Transformation frame ${i + 1} of ${DEMO_PAIRS.length} — after`
            }
            fill
            sizes={HALF_SIZES}
            loading={eager && i === 0 ? "eager" : "lazy"}
            fetchPriority={eager && i === 0 ? "high" : undefined}
            className="object-cover object-[50%_28%]"
          />
        </div>
      ))}

      {/* Bottom scrim — sinks the frame into the void background. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(8,8,10,0.85)] to-transparent"
      />

      <figcaption
        className={`absolute bottom-4 z-10 ${isBefore ? "left-4" : "right-4"}`}
      >
        <span className="eyebrow text-gold-300">
          {isBefore ? "BEFORE" : "AFTER"}
        </span>
      </figcaption>
    </figure>
  );
}

export default function TransformationSplit({
  intervalMs = SLIDE_MS,
}: {
  /** Autoplay frequency in ms — how long each pair holds. */
  intervalMs?: number;
} = {}) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  // WCAG 2.2.2 stop mechanism — the explicit toggle, NOT a side effect of
  // using the arrow or the ticks. Manual navigation leaves autoplay running.
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const paused = hovering || focused || userPaused || !inView;

  // Reduced motion → no autoplay at all (the CSS half is handled by the
  // no-preference guard in TSPLIT_FX_CSS).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Don't burn frames (or advance unseen pairs) once the section is scrolled past.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keyed on `index`, so any manual move also restarts the dwell — the reader
  // gets a full beat on the pair he picked before autoplay takes over again.
  useEffect(() => {
    if (reducedMotion || paused) return;
    const t = window.setTimeout(
      () => setIndex((i) => (i + 1) % DEMO_PAIRS.length),
      intervalMs,
    );
    return () => window.clearTimeout(t);
  }, [index, paused, reducedMotion, intervalMs]);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % DEMO_PAIRS.length),
    [],
  );

  // Progressive enhancement: the bridge is a real in-page anchor, so it works
  // with JS off. JS only upgrades the jump to a smooth scroll + focus move.
  const onBridgeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(STORY_ID);
      if (!target) return; // fall through to the native anchor jump
      e.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [reducedMotion],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="tsplit-label"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      className="bg-void grain aurora relative overflow-hidden border-b border-hairline-soft"
    >
      <style>{TSPLIT_FX_CSS}</style>

      <div className="container-site relative z-10 pb-10 pt-8 nav:pb-14 nav:pt-12">
        {/* No heading here on purpose: the page's single <h1> lives in the hero
            below, and an <h2> above it would break heading order. */}
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-8 bg-hairline-gold" />
          <p id="tsplit-label" className="eyebrow">
            THE TRANSFORMATION{/* [review] */}
          </p>
          <span aria-hidden="true" className="h-px w-8 bg-hairline-gold" />
        </div>

        {/* ---- The split ---- */}
        <div className="relative mx-auto mt-6 max-w-[860px] nav:mt-8">
          <div className="grid grid-cols-2 gap-[3px]">
            <Half side="before" index={index} eager />
            <Half side="after" index={index} eager />
          </div>

          {/* Manual jump — ticks sit clear of the BEFORE/AFTER captions below.
              Using one does not end autoplay, it only restarts the dwell. */}
          <div className="absolute left-2 top-2 z-30 flex items-center nav:left-3 nav:top-3">
            {DEMO_PAIRS.map((pair, i) => (
              <button
                key={pair.before}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={`Show transformation ${i + 1} of ${DEMO_PAIRS.length}`}
                className="tsplit-tick grid h-12 w-8 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className="tsplit-tick-bar block h-[2px] w-5 rounded-full"
                />
              </button>
            ))}
          </div>

          {/* The stop mechanism. Hidden under reduced motion — nothing is
              auto-updating there, so a pause control would be a dead end. */}
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={
                userPaused
                  ? "Play the transformation slideshow"
                  : "Pause the transformation slideshow"
              }
              className="tsplit-toggle absolute right-2 top-2 z-30 grid h-12 w-12 place-items-center nav:right-3 nav:top-3"
            >
              <span className="tsplit-toggle-ring grid h-9 w-9 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.6)] text-gold-300 opacity-70 backdrop-blur-[4px]">
                <PauseGlyph playing={!userPaused} />
              </span>
            </button>
          )}

          {/* The seam: gold thread + medallion, centred on the gap. */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-[84px] -translate-x-1/2 flex-col items-center">
            <span aria-hidden="true" className="tsplit-thread flex-1" />

            <button
              type="button"
              onClick={next}
              aria-label="Show the next transformation"
              className="tsplit-medallion pointer-events-auto relative my-3 grid h-16 w-16 shrink-0 place-items-center rounded-full nav:h-[84px] nav:w-[84px]"
            >
              <span
                aria-hidden="true"
                className="tsplit-ring absolute inset-0 rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.72)] shadow-[0_8px_30px_rgba(0,0,0,0.55)] backdrop-blur-[6px]"
              />
              {/* Sweep hand — remounts each pair so the revolution restarts. */}
              <span
                key={index}
                aria-hidden="true"
                data-paused={paused}
                style={{ "--tsplit-dur": `${SLIDE_MS}ms` } as CSSProperties}
                className="tsplit-orbit absolute inset-0"
              >
                <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-200 shadow-[0_0_8px_rgba(201,162,75,0.9)]" />
              </span>
              {/* The arrow: before → after, and the direction of the control. */}
              <ArrowRightIcon
                aria-hidden="true"
                className="tsplit-arrow relative h-5 w-5 text-gold-300 nav:h-6 nav:w-6"
              />
            </button>

            <span aria-hidden="true" className="tsplit-thread flex-1" />
          </div>
        </div>

        {/* ---- The bridge: the thread leaves the seam and drops into the story ---- */}
        <div className="flex flex-col items-center">
          <span aria-hidden="true" className="tsplit-thread h-8 nav:h-10" />
          <a
            href={`#${STORY_ID}`}
            onClick={onBridgeClick}
            className="tsplit-bridge group flex flex-col items-center gap-2.5 pb-1 pt-2"
          >
            <span className="tsplit-bridge-ring grid h-14 w-14 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.72)]">
              <ChevronDownIcon className="tsplit-chevron h-5 w-5 text-gold-300" />
            </span>
            <span className="eyebrow text-secondary">
              THE STORY{/* [review] */}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
