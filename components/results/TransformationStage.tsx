"use client";

// /results §2 — THE STAGE (one man at a time).
//
// A one-viewport showcase that steps through complete transformation SETS.
// A SET is atomic and never splits: one man's BEFORE and his AFTER move
// together, always. There is no independent before-index and after-index in
// this component by design — pairing client A's before with client B's after
// would be a fabricated result, and the type makes that unrepresentable.
//
// Five sets: Aditya's own, then four clients. Both panels crossfade on the
// same beat; prev/next and the dots move the WHOLE set. Under the panels sits
// that man's headline, which is the link through to his page.
//
// Every set now reads through to its story at /results/[slug]; the headline is
// the link. The sets themselves — photographs, headlines, consent status —
// live in lib/transformations.ts, because the 3D proof gallery on the homepage
// shows the same men and the two must never disagree about who is in a frame.

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ArrowRightIcon } from "@/components/icons";
import { TX_SETS as SETS } from "@/lib/transformations";

/** Autoplay frequency. Each set carries a headline to read, so this is slower
 *  than the /about opener. Pass intervalMs={0} to turn autoplay off entirely. */
const STAGE_MS = 2000;

/** Each panel is ~450px at its widest, ~46vw below the breakpoint. */
const PANEL_SIZES = "(min-width: 900px) 450px, 46vw";

// ---- Component-scoped FX (globals.css is a shared file — never edited).
// Transform/opacity only, inside a prefers-reduced-motion guard, so reduced
// motion and no-JS both land on the finished frame.
const STAGE_FX_CSS = `
.stage-slide { opacity: 0; }
.stage-slide[data-active="true"] { opacity: 1; }

/* The pair is HEIGHT-budgeted, not width-budgeted. The wells are a fixed 3:4,
   so their height follows their width — which means the only way to guarantee
   the section stays inside one viewport on every screen is to cap how wide the
   pair may grow, derived from the height actually available:
     usable height  ≈ 100dvh − 340px  (header, padding, controls, and a story
                                       row allowed to wrap to two lines)
     frame width    ≤ usable × 3/4    (the 3:4 ratio)
     pair width     ≤ 2 × frame + gap
   Hence 1.5 × usable + gap. On a tall screen the 1096px container cap wins and
   the frames simply stop growing; on a short one the height cap wins and they
   narrow instead of overflowing. */
.stage-pair {
  --stage-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--stage-gap);
  margin-inline: auto;
  max-width: min(100%, max(320px, calc(1.5 * (100dvh - 340px) + var(--stage-gap))));
}
@media (min-width: 900px) {
  .stage-pair {
    --stage-gap: 180px;
    max-width: min(1096px, max(340px, calc(1.5 * (100dvh - 340px) + var(--stage-gap))));
  }
}

/* Frame treatment, matching the /about diptych: gold hairline, warm mat,
   plate below the well — hung, not collaged. */
.stage-frame {
  background: var(--grad-card-warm);
  border: 1px solid var(--hairline-gold);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
}
.stage-well {
  border: 1px solid rgba(201, 162, 75, 0.16);
  background: var(--surface-2);
}

.stage-empty { background: var(--grad-card-warm); }

.stage-thread {
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--gold-500) 12%, var(--gold-500) 88%, transparent);
  transform-origin: top center;
}

/* The seam CTA — the badge on the gold thread is the read-through to this
   man's story. It carries its label at every size rather than revealing it on
   hover, because the primary device is a phone and a phone never hovers. The
   label sits UNDER the badge, not through the middle of the pair: on mobile the
   gap between the panels is 10px, so a horizontal pill would lie across both
   photographs. */
.stage-seam-cta { text-decoration: none; }
.stage-seam-badge {
  position: relative;
  border: 1px solid var(--hairline-gold);
  background: rgba(8, 8, 10, 0.8);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
/* Resting ring pulse — the only cue a touch device gets that this is tappable.
   A pseudo-element so transform/opacity animate, never box-shadow. */
.stage-seam-badge::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 999px;
  border: 1px solid var(--gold-500);
  opacity: 0;
}
.stage-seam-label {
  white-space: nowrap;
  border: 1px solid var(--hairline-gold);
  border-radius: 999px;
  background: rgba(8, 8, 10, 0.8);
  backdrop-filter: blur(4px);
  color: var(--gold-300);
  padding: 4px 10px;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.stage-seam-cta:hover .stage-seam-badge,
.stage-seam-cta:focus-visible .stage-seam-badge {
  border-color: var(--gold-300);
  background: rgba(201, 162, 75, 0.18);
}
.stage-seam-cta:hover .stage-seam-label,
.stage-seam-cta:focus-visible .stage-seam-label {
  border-color: var(--gold-300);
  color: var(--gold-100);
}

.stage-nav:hover:not(:disabled) { border-color: var(--gold-500); color: var(--gold-200); }
.stage-nav:disabled { opacity: 0.35; cursor: default; }

.stage-dot-bar { transform: scaleX(0.55); background: rgba(244, 241, 234, 0.3); }
.stage-dot[aria-current="true"] .stage-dot-bar { transform: scaleX(1); background: var(--gold-300); }
.stage-dot:hover .stage-dot-bar { background: var(--gold-500); }

.stage-toggle:hover .stage-toggle-ring,
.stage-toggle:focus-visible .stage-toggle-ring,
.stage-toggle[aria-pressed="true"] .stage-toggle-ring {
  border-color: var(--gold-500);
  color: var(--gold-200);
  opacity: 1;
}

.stage-headline-link:hover .stage-headline { color: var(--gold-200); }
.stage-headline-link:hover .stage-cta { color: var(--gold-200); }

@media (prefers-reduced-motion: no-preference) {
  /* Both panels cross on the SAME beat — the pair is never mid-swap. */
  .stage-slide { transition: opacity 700ms var(--ease-standard); }

  .stage-thread { animation: stage-draw 900ms var(--ease-out-expo) both; }

  /* The story slides in from whichever way the reader travelled. */
  .stage-story { animation: stage-enter 520ms var(--ease-out-expo) both; }

  .stage-nav,
  .stage-headline,
  .stage-cta { transition: color 300ms var(--ease-standard), border-color 300ms var(--ease-standard), transform 300ms var(--ease-out-expo); }
  .stage-nav:hover:not(:disabled) { transform: scale(1.06); }
  .stage-headline-link:hover .stage-cta-arrow { transform: translateX(3px); }
  .stage-cta-arrow { transition: transform 300ms var(--ease-out-expo); }

  .stage-dot-bar { transition: transform 400ms var(--ease-out-expo), background-color 300ms var(--ease-standard); }
  .stage-toggle-ring { transition: border-color 300ms var(--ease-standard), color 300ms var(--ease-standard), opacity 300ms var(--ease-standard); }

  .stage-seam-badge,
  .stage-seam-label,
  .stage-seam-arrow {
    transition: transform 320ms var(--ease-out-expo),
      border-color 300ms var(--ease-standard),
      background-color 300ms var(--ease-standard),
      color 300ms var(--ease-standard);
  }
  /* Only the interactive badge pulses. The placeholder mark stays still. */
  .stage-seam-cta .stage-seam-badge::after { animation: stage-seam-ring 2.9s var(--ease-out-expo) infinite; }
  .stage-seam-cta:hover .stage-seam-badge,
  .stage-seam-cta:focus-visible .stage-seam-badge { transform: scale(1.1); }
  .stage-seam-cta:hover .stage-seam-arrow { transform: translateX(2px); }
  .stage-seam-cta:hover .stage-seam-label,
  .stage-seam-cta:focus-visible .stage-seam-label { transform: translateY(2px); }
  /* The pulse is an invitation, not a nag — it stops once he is already here. */
  .stage-seam-cta:hover .stage-seam-badge::after { animation: none; }
}

@keyframes stage-draw { from { transform: scaleY(0); } }
@keyframes stage-seam-ring {
  0% { transform: scale(1); opacity: 0.5; }
  70%, 100% { transform: scale(1.6); opacity: 0; }
}
@keyframes stage-enter {
  from { opacity: 0; transform: translateX(calc(var(--stage-dir, 1) * 18px)); }
}
`;

function ChevronIcon({ dir, ...props }: { dir: "left" | "right" } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d={dir === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}
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

/**
 * One hung frame: gold hairline surround, warm mat, a 3:4 photo well holding
 * every set's photograph for this side (stacked, one visible), and a plate.
 */
function Panel({
  side,
  index,
}: {
  side: "before" | "after";
  index: number;
}) {
  const isBefore = side === "before";
  return (
    <figure className="stage-frame m-0 rounded-[8px] p-1.5 nav:p-3">
      <div className="stage-well relative aspect-[3/4] w-full overflow-hidden rounded-[4px]">
      {SETS.map((set, i) => {
        const shot = set[side];
        return (
          <div
            key={set.id}
            data-active={i === index}
            aria-hidden={i !== index}
            className="stage-slide absolute inset-0"
          >
            {shot.kind === "photo" ? (
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes={PANEL_SIZES}
                loading={i === 0 ? "eager" : "lazy"}
                style={{ objectPosition: shot.pos ?? "50% 22%" }}
                className="object-cover"
              />
            ) : (
              <div className="stage-empty grid h-full w-full place-items-center px-4 text-center">
                <div>
                  <p className="type-caption font-semibold tracking-[0.14em] text-secondary">
                    {shot.label}
                  </p>
                  <p className="eyebrow mt-1.5">AWAITING CONSENT</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>

      {/* Museum plate on the mat — not stamped over the photograph. */}
      <figcaption className="pt-1.5 text-center nav:pt-2.5">
        <span className="eyebrow text-gold-300">
          {isBefore ? "BEFORE" : "AFTER"}
        </span>
      </figcaption>
    </figure>
  );
}

export default function TransformationStage({
  intervalMs = STAGE_MS,
}: {
  /** Autoplay frequency in ms. 0 turns autoplay (and the pause control) off. */
  intervalMs?: number;
} = {}) {
  const [index, setIndex] = useState(0);
  /** +1 travelling forward, -1 back — drives the story block's entrance. */
  const [dir, setDir] = useState(1);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  // WCAG 2.2.2 stop mechanism — the explicit toggle, NOT a side effect of
  // using prev/next. Manual navigation leaves autoplay running.
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const autoplays = intervalMs > 0;
  const paused = hovering || focused || userPaused || !inView;

  const goTo = useCallback((next: number, direction: 1 | -1) => {
    setDir(direction);
    setIndex(((next % SETS.length) + SETS.length) % SETS.length);
  }, []);

  const prev = useCallback(
    () => goTo(index - 1, -1),
    [goTo, index],
  );
  const next = useCallback(
    () => goTo(index + 1, 1),
    [goTo, index],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // threshold 0 — ANY sliver on screen counts as in view. A threshold means the
  // observer reports against the SECTION's own box, and this section is a full
  // viewport tall, so a fractional threshold could read "out of view" while the
  // photographs were plainly on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The dwell is BANKED, not restarted. Pausing stores how much of the beat is
  // left; resuming continues from there. Starting a fresh full interval on every
  // resume was the subtle half of the bug: a cursor crossing the photographs a
  // few times reset the countdown each pass, so the set never turned and
  // autoplay looked broken even though the timer was running the whole time.
  const remainingRef = useRef(intervalMs);
  const startedAtRef = useRef(0);

  // A new set always earns a full beat. Declared BEFORE the timer effect so it
  // runs first when `index` changes.
  useEffect(() => {
    remainingRef.current = intervalMs;
  }, [index, intervalMs]);

  useEffect(() => {
    if (!autoplays || reducedMotion || paused) return;
    startedAtRef.current = Date.now();
    const t = window.setTimeout(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SETS.length);
    }, remainingRef.current);
    return () => {
      window.clearTimeout(t);
      // Only time the timer actually RAN is spent; paused time is not.
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current),
      );
    };
  }, [index, paused, reducedMotion, intervalMs, autoplays]);

  // Hover-pause is scoped to the photographs, not the section. The section is
  // a full viewport tall, so listening there meant a cursor resting anywhere on
  // screen — which is exactly where a reading cursor sits — held autoplay off
  // indefinitely. Pointer events, filtered to a real mouse: a tap on a touch
  // screen also raises enter, and whether a matching leave follows is browser-
  // dependent — filtering on pointerType keeps a phone out of this path
  // entirely rather than relying on that.
  const onPointerEnter = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") setHovering(true);
  }, []);
  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") setHovering(false);
  }, []);

  // Only a KEYBOARD walk-through pauses. Clicking prev/next also focuses the
  // button it hit, and a plain focus check left autoplay paused from that click
  // until the reader happened to click somewhere else on the page.
  const onFocusCapture = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const el = e.target as HTMLElement | null;
    let keyboard = false;
    try {
      keyboard = !!el?.matches?.(":focus-visible");
    } catch {
      keyboard = false; // no :focus-visible support — fall back to not pausing
    }
    setFocused(keyboard);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  const set = SETS[index];

  // One line, not a stack: the headline links through. Everything the vertical
  // budget can give goes to the photographs instead.
  const story = (
    <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1">

      <span className="stage-headline font-display text-[clamp(1.05rem,2vw,1.5rem)] font-medium leading-[1.25] tracking-[-0.015em] text-primary">
        {set.headline}
      </span>
      {set.href !== null ? (
        <span className="stage-cta inline-flex shrink-0 translate-y-[1px] items-center text-gold-300">
          <ArrowRightIcon className="stage-cta-arrow h-4 w-4" />
        </span>
      ) : (
        <span className="eyebrow">{"— REPLACE"}</span>
      )}
    </span>
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Transformations, one man at a time"
      onFocusCapture={onFocusCapture}
      onBlurCapture={() => setFocused(false)}
      onKeyDown={onKeyDown}
      className="bg-alt grain aurora relative overflow-hidden border-b border-hairline-soft"
    >
      <style>{STAGE_FX_CSS}</style>

      {/* No section eyebrow: the hero above already says PROOF, and the row it
          would occupy is worth more as photograph. */}
      <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-8 nav:py-10">
        {/* ---- The pair. Both panels cross on the same beat. ----
             This is the ONLY hover-pause region: a mouse resting on the
             photographs (or on the seam CTA inside them) holds the set. */}
        <div
          className="stage-pair relative w-full"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <Panel side="before" index={index} />
          <Panel side="after" index={index} />

          {/* The seam: gold thread through a small before → after badge, which
              is also the way in to this man's story. The bottom padding lifts
              it off the plates so it centres on the photographs, not on the
              figures. */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-12 -translate-x-1/2 flex-col items-center pb-[34px] nav:pb-[50px]">
            <span aria-hidden="true" className="stage-thread flex-1" />

            {set.href !== null ? (
              <Link
                href={set.href}
                aria-label={`${set.linkLabel} — ${set.headline}`}
                className="stage-seam-cta pointer-events-auto my-2 flex shrink-0 flex-col items-center gap-2"
              >
                <span className="stage-seam-badge grid h-11 w-11 place-items-center rounded-full nav:h-12 nav:w-12">
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="stage-seam-arrow h-4 w-4 text-gold-300"
                  />
                </span>
                <span className="stage-seam-label">{set.linkLabel}</span>
              </Link>
            ) : (
              // No story published for this man yet — the badge stays a mark.
              <span
                aria-hidden="true"
                className="stage-seam-badge my-2 grid h-9 w-9 shrink-0 place-items-center rounded-full nav:h-11 nav:w-11"
              >
                <ArrowRightIcon className="h-4 w-4 text-gold-300" />
              </span>
            )}

            <span aria-hidden="true" className="stage-thread flex-1" />
          </div>
        </div>

        {/* ---- One line: who, which, and the headline that links through ---- */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mx-auto mt-5 w-full max-w-[60ch] text-center nav:mt-6"
        >
          <div
            key={set.id}
            style={{ "--stage-dir": dir } as CSSProperties}
            className="stage-story"
          >
            {set.href !== null ? (
              <Link
                href={set.href}
                className="stage-headline-link block"
                aria-label={`${set.headline} — ${set.linkLabel}`}
              >
                {story}
              </Link>
            ) : (
              <div>{story}</div>
            )}
          </div>
        </div>

        {/* ---- Set navigation: prev / dots / next move the WHOLE set ----
             Also a hover-pause region, so the set cannot turn under a cursor
             that is on its way to a dot. */}
        <div
          className="mt-3 flex items-center justify-center gap-1.5 nav:mt-4"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous transformation"
            className="stage-nav grid h-12 w-12 place-items-center rounded-full border border-hairline-gold text-gold-300"
          >
            <ChevronIcon dir="left" className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            {SETS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i >= index ? 1 : -1)}
                aria-current={i === index}
                aria-label={`Show ${s.eyebrow.toLowerCase()}, transformation ${
                  i + 1
                } of ${SETS.length}`}
                className="stage-dot grid h-12 w-8 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className="stage-dot-bar block h-[2px] w-5 rounded-full"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next transformation"
            className="stage-nav grid h-12 w-12 place-items-center rounded-full border border-hairline-gold text-gold-300"
          >
            <ChevronIcon dir="right" className="h-5 w-5" />
          </button>

          {/* The stop mechanism. Absent when there is nothing auto-updating. */}
          {autoplays && !reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={
                userPaused
                  ? "Play the transformation slideshow"
                  : "Pause the transformation slideshow"
              }
              className="stage-toggle ml-1 grid h-12 w-12 place-items-center"
            >
              <span className="stage-toggle-ring grid h-9 w-9 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.6)] text-gold-300 opacity-70 backdrop-blur-[4px]">
                <PauseGlyph playing={!userPaused} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
