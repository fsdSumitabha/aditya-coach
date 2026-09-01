"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { METHOD_STEPS as STEPS } from "@/components/method/method-steps";

/**
 * The page's showpiece: one full-bleed, sticky-pinned scene where the Complete
 * Rebuild assembles bottom-up (Lifestyle first → Presence last) as the user
 * scrolls through the tall wrapper. Scroll-linked scrubbing so the motion feels
 * physical.
 *
 * Single-column composition, no side panel:
 *   layer bands → foundation caption → progress rail → detail band.
 * The detail band is a FIXED-height slot directly under the pyramid. Resting,
 * it carries the closing line and the scroll guide; hovering (or focusing) a
 * layer crossfades it to that layer's copy. Fixed height means the reveal never
 * reflows the pinned stage.
 *
 * - Transform/opacity only, one rAF-throttled scroll value drives every tier.
 * - Progressive enhancement: SSR paints the FINISHED, seated stack. JS only
 *   moves to the pre-assembly state (and attaches the scrubber) once we know
 *   motion is allowed — reduced motion / no-JS keep the static finished stack.
 * - Mobile has no hover and no room for a reserved band, so a tap dims the
 *   pyramid and raises the same copy over it — still one section, no split.
 * - Detail copy IS the five expanded step sections that used to sit below this
 *   scene — see components/method/method-steps.ts.
 */

// Rendered as a pyramid: Presence at the top (narrowest) down to Lifestyle at
// the bottom (widest, the foundation). METHOD_STEPS stays in logical 01 → 05
// order — the page builds its HowTo schema from it — so the view reverses a
// copy rather than the source.
const TIERS = [...STEPS].reverse();

// Index, in RENDERED order, of the base layer — the bottom band, already seated
// when the scene arrives, and the fallback the detail band holds while it fades
// out.
const BASE_INDEX = TIERS.length - 1;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 16 10"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 1L8 8L15 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FoundationStack() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tierRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  // Two copies of the scroll guide exist (desktop band + mobile block); both
  // are in the DOM at once, so a single ref would only ever drive the last one.
  const cueRefs = useRef<(HTMLDivElement | null)[]>([]);

  // null = nothing hovered: the scene stays pure animation, no copy revealed.
  const [active, setActive] = useState<number | null>(null);
  // Mobile has no hover — a tap raises the same detail over the pyramid.
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const tiers = tierRefs.current;
    const ghosts = ghostRefs.current;
    const arrows = arrowRefs.current;
    if (!scene || tiers.length === 0) return;
    // Reduced motion → leave the SSR default: finished, seated stack.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const N = tiers.length;
    // Each tier gets a scrub window; Lifestyle leads, Presence lands last.
    const step = 0.15;
    const dur = 0.34;

    const apply = (progress: number) => {
      let seated = 0;
      for (let i = 0; i < N; i++) {
        const el = tiers[i];
        // Rendered top→bottom, so the bottom band is the first to seat:
        // Lifestyle(i=N-1) → first; Presence(i=0) → last.
        const k = N - 1 - i;
        // The base layer is never animated away: the scene must never open on
        // an empty screen, and "the foundation is already there" is the point.
        const t = k === 0 ? 1 : easeOut(clamp01((progress - k * step) / dur));
        if (t > 0.6) seated++;
        if (el) {
          const y = (1 - t) * 30;
          el.style.transform = `translateY(${y}px) scale(${0.96 + 0.04 * t})`;
          el.style.opacity = String(t);
        }
        // The empty slot waiting to be built — visible from frame one, so the
        // shape of the whole rebuild is legible before a single layer lands.
        const ghost = ghosts[i];
        if (ghost) ghost.style.opacity = String((1 - t) * 0.85);
        // The connector arrow BELOW this tier — it draws the eye upward,
        // 01 → 02 → 03, and only appears once the layer it points into (this
        // one, the later of the pair) has landed.
        const arrow = arrows[i];
        if (arrow) arrow.style.opacity = String(t);
      }
      // Gold thread under the stack fills as the layers seat.
      if (railRef.current) {
        railRef.current.style.transform = `scaleX(${0.06 + 0.94 * clamp01(progress)})`;
      }
      // Layer counter — the plainest possible "scrolling is doing something".
      if (countRef.current) {
        const label = String(seated).padStart(2, "0");
        if (countRef.current.textContent !== label) {
          countRef.current.textContent = label;
        }
      }
      // Scroll cue retires once the stack is most of the way up.
      const cueOpacity = String(clamp01((0.8 - progress) / 0.25));
      for (const cue of cueRefs.current) {
        if (cue) cue.style.opacity = cueOpacity;
      }
    };

    // Move to the pre-assembly state now that we can animate it back in.
    for (const el of tiers) {
      if (el) el.style.willChange = "transform, opacity";
    }
    apply(0);

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = scene.getBoundingClientRect();
      const denom = rect.height - window.innerHeight;
      if (denom <= 0) {
        apply(1);
        return;
      }
      const scrolled = clamp01(-rect.top / denom);
      // Complete the assembly at ~62% of the scene, then hold the finished
      // stack for the remaining scroll while the stage stays pinned.
      apply(clamp01(scrolled / 0.62));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
      // Scrolling dismisses the mobile detail so it never hides the assembly.
      // Safe to call unconditionally — React bails out when already false.
      setSheetOpen(false);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Falls back to the base layer only so the crossfading band keeps its text
  // during the fade-out — it is never shown while `active` is null.
  const tier = TIERS[active ?? BASE_INDEX];
  const TierIcon = tier.Icon;

  // The shared detail body — same markup in the desktop band and mobile sheet.
  const detail = (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hairline-gold text-gold-500"
          >
            <TierIcon width={26} height={26} />
          </span>
          <div className="min-w-0">
            <p className="type-caption tracking-[0.16em] text-gold-500">
              STEP {tier.num} — {tier.name}
            </p>
            {/* VERBATIM step copy — do not alter */}
            <p className="type-lead mt-1 text-primary">{tier.body}</p>
          </div>
        </div>
        <Link
          href="/coaching"
          className="type-small pointer-events-auto inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full border border-hairline-gold px-5 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
        >
          See the coaching that builds this →{/* [review] */}
        </Link>
      </div>
      <div className="mt-4 grid gap-x-8 gap-y-3 border-t border-hairline-soft pt-4 md:grid-cols-3">
        {tier.depth.map((d) => (
          <p key={d.lead} className="type-small text-secondary">
            <strong className="font-semibold text-primary">{d.lead}</strong>{" "}
            {d.text}
          </p>
        ))}
      </div>
    </>
  );

  // Resting content of the detail band: the closing line + the scroll guide.
  // `slot` keys the cue ref — 0 is the desktop band, 1 the mobile block.
  const resting = (slot: number) => (
    <>
      <p className="type-body mx-auto max-w-[48ch] text-center text-secondary">
        Everyone wants to live at the top. But the top only holds if the bottom
        is built first.
      </p>{/* [review] */}
      <div
        ref={(el) => {
          cueRefs.current[slot] = el;
        }}
        aria-hidden="true"
        className="mt-4 flex flex-col items-center gap-1.5"
        style={{ opacity: 0 }}
      >
        <p className="type-caption tracking-[0.18em] text-muted">
          SCROLL TO BUILD IT{/* [review] */}
        </p>
        <span className="flex flex-col items-center -space-y-1.5">
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              className="float-idle block text-gold-500"
              style={{ opacity: 0.9 - n * 0.28, animationDelay: `${n * 0.18}s` }}
            >
              <Chevron />
            </span>
          ))}
        </span>
      </div>
    </>
  );

  return (
    <div ref={sceneRef} className="pin-scene min-h-[170vh] md:min-h-[230vh]">
      <div className="pin-stage">
        {/* full-bleed: the foundation layer runs the width of the screen */}
        <div
          onMouseLeave={() => setActive(null)}
          className="relative mx-auto w-full max-w-[1320px] px-4 md:px-8 pt-12"
        >
          {/* ---- the pyramid: full-width bands, widest layer last ---- */}
          {/* `sheetOpen` is set only under the md breakpoint, so dimming the
              pyramid behind the raised copy never fires on desktop. */}
          <div
            className="flex flex-col items-center transition-opacity duration-300"
            style={{ opacity: sheetOpen ? 0.15 : 1 }}
          >
            {TIERS.map((t, i) => (
              <Fragment key={t.num}>
                {i > 0 && (
                  <span
                    ref={(el) => {
                      arrowRefs.current[i - 1] = el;
                    }}
                    aria-hidden="true"
                    className="my-0.5 block text-gold-500"
                  >
                    {/* points up: the rebuild climbs 01 → 05 from the base */}
                    <Chevron className="rotate-180" />
                  </span>
                )}
                <button
                  type="button"
                  aria-expanded={active === i}
                  aria-controls="foundation-detail"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => {
                    setActive(i);
                    // Desktop reveals on hover; only the touch layout raises
                    // the copy over the pyramid.
                    if (window.matchMedia("(max-width: 767px)").matches) {
                      setSheetOpen(true);
                    }
                  }}
                  className="group relative block rounded-md transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
                  style={{ width: t.width, minWidth: "10.5rem" }}
                >
                  {/* the empty slot: outline of the layer not yet built */}
                  <div
                    ref={(el) => {
                      ghostRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-md border border-dashed border-[rgba(201,162,75,0.28)]"
                    style={{ opacity: 0 }}
                  />
                  <div
                    ref={(el) => {
                      tierRefs.current[i] = el;
                    }}
                  >
                    <div
                      className="@container flex items-center gap-4 rounded-md border border-hairline-soft px-4 py-2.5 text-left shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] md:gap-8 md:px-7 md:py-3"
                      style={{
                        background: t.bg,
                        borderLeft: `3px solid ${t.edge}`,
                        boxShadow:
                          active === i
                            ? "0 10px 30px -18px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(201,162,75,0.35)"
                            : undefined,
                      }}
                    >
                      <span className="type-caption shrink-0 tabular-nums text-muted">
                        {t.num}
                      </span>
                      {/* Metal, not paint: the gradient catches light on hover
                          via filter only — no repaint of the fill itself. */}
                      <span
                        className="text-gold-grad font-display min-w-0 truncate text-[1.0625rem] font-semibold tracking-[0.08em] transition-[filter] duration-300 group-hover:[filter:brightness(1.28)_drop-shadow(0_0_14px_rgba(201,162,75,0.45))] group-focus-visible:[filter:brightness(1.28)_drop-shadow(0_0_14px_rgba(201,162,75,0.45))] md:text-[1.625rem]"
                      >
                        {t.name}
                      </span>
                      {/* Dropped on the narrow lower bands rather than left to
                          squeeze the name — the label is the least important
                          thing in the row and 04/05 have no width to spare. */}
                      <span className="type-caption hidden truncate text-muted @xl:inline">
                        {t.label}
                      </span>
                      {/* the minute arrow: this band opens something */}
                      <span
                        aria-hidden="true"
                        className="ml-auto shrink-0 text-gold-500 opacity-45 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100"
                      >
                        <Chevron className="-rotate-90" />
                      </span>
                    </div>
                  </div>
                </button>
              </Fragment>
            ))}
          </div>

          {/* Sits under the base band now that the widest layer is the bottom
              one — the caption points back up at the foundation. */}
          <p
            aria-hidden="true"
            className="type-caption mt-3 text-center tracking-[0.16em] text-gold-500 md:mt-4"
          >
            EVERYTHING SITS ON THIS ↑
          </p>{/* [review] */}

          {/* ---- assembly progress: gold thread draws + counter climbs ---- */}
          <div
            aria-hidden="true"
            className="mt-5 flex w-full items-center gap-4 md:mt-6"
          >
            <span className="h-px flex-1 bg-[rgba(244,241,234,0.07)]">
              <span
                ref={railRef}
                className="thread-h block h-px w-full origin-left"
                style={{ transform: "scaleX(1)" }}
              />
            </span>
            <span className="type-caption shrink-0 tabular-nums tracking-[0.16em] text-gold-500">
              <span ref={countRef}>05</span> / 05
            </span>
          </div>

          {/* ---- detail band: reserved height, crossfades on hover ---- */}
          <div
            id="foundation-detail"
            className="relative mt-4 hidden min-h-[176px] md:mt-5 md:block"
          >
            <div
              aria-hidden={active !== null}
              className="absolute inset-0 flex flex-col justify-center transition-opacity duration-300"
              style={{
                opacity: active === null ? 1 : 0,
                pointerEvents: active === null ? undefined : "none",
              }}
            >
              {resting(0)}
            </div>
            <div
              aria-hidden={active === null}
              className="absolute inset-0 flex flex-col justify-center overflow-y-auto transition-opacity duration-300"
              style={{
                opacity: active === null ? 0 : 1,
                pointerEvents: active === null ? "none" : undefined,
              }}
            >
              {detail}
            </div>
          </div>

          {/* ---- mobile: resting copy inline, tapped copy over the pyramid ---- */}
          <div className="mt-5 md:hidden">{resting(1)}</div>
          {sheetOpen && (
            <div
              className="absolute inset-x-4 inset-y-0 z-20 flex flex-col justify-center overflow-y-auto rounded-lg border border-hairline-gold p-5 md:hidden"
              style={{
                background: "var(--surface-1)",
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.85)",
              }}
            >
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-muted"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
                <span className="sr-only">Close layer detail</span>
              </button>
              {detail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
