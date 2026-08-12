"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { METHOD_STEPS as TIERS } from "@/components/method/method-steps";

/**
 * The page's showpiece: a sticky-pinned scene where the Complete Rebuild
 * assembles top-down (Lifestyle first → Presence last) as the user scrolls
 * through the tall wrapper. Scroll-linked scrubbing so the motion feels
 * physical.
 *
 * - Transform/opacity only, one rAF-throttled scroll value drives every tier.
 * - Progressive enhancement: SSR paints the FINISHED, seated stack. JS only
 *   moves to the pre-assembly state (and attaches the scrubber) once we know
 *   motion is allowed — reduced motion / no-JS keep the static finished stack.
 * - Each tier is a real button: hover or focus (desktop) swaps the detail
 *   panel beside the stack; tap (mobile) opens the same detail over the stack.
 *   The detail copy IS the five expanded step sections that used to sit below
 *   this scene — see components/method/method-steps.ts.
 */

// Index of the base layer — the detail panel opens on it, and it is the tier
// that is already seated when the scene arrives. Lifestyle now leads the DOM.
const BASE_INDEX = 0;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function FoundationStack() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tierRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  // null = nothing hovered: the scene stays pure animation, no copy revealed.
  const [active, setActive] = useState<number | null>(null);
  // Mobile has no hover — a tap raises the same detail over the stack.
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const tiers = tierRefs.current;
    const ghosts = ghostRefs.current;
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
        const k = i; // Lifestyle(i=0) → first; Presence(i=N-1) → last
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
      if (cueRef.current) {
        cueRef.current.style.opacity = String(clamp01((0.8 - progress) / 0.25));
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

  // Falls back to the base layer only so the crossfading panel keeps its text
  // during the fade-out — it is never shown while `active` is null.
  const tier = TIERS[active ?? BASE_INDEX];
  const TierIcon = tier.Icon;

  // The shared detail body — same markup desktop panel / mobile sheet.
  const detail = (
    <>
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline-gold text-gold-500"
      >
        <TierIcon width={26} height={26} />
      </span>
      <p className="type-caption mt-4 tracking-[0.16em] text-gold-500">
        STEP {tier.num} — {tier.name}
      </p>
      {/* VERBATIM step copy — do not alter */}
      <p className="type-lead mt-2 text-primary">{tier.body}</p>
      <div className="mt-4 space-y-2.5 border-t border-hairline-soft pt-4">
        {tier.depth.map((d) => (
          <p key={d.lead} className="type-small text-secondary">
            <strong className="font-semibold text-primary">{d.lead}</strong>{" "}
            {d.text}
          </p>
        ))}
      </div>
      <Link
        href="/programs"
        className="type-small mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline-gold px-5 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
      >
        See the coaching that builds this →{/* [review] */}
      </Link>
    </>
  );

  return (
    <div ref={sceneRef} className="pin-scene min-h-[160vh] md:min-h-[220vh]">
      <div className="pin-stage">
        <div className="container-site w-full">
          <div
            onMouseLeave={() => setActive(null)}
            className="mx-auto grid max-w-[1080px] items-center gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] md:gap-12"
          >
            {/* ---- the stack ---- */}
            <div className="relative">
              <p
                aria-hidden="true"
                className="type-caption mb-4 text-center tracking-[0.16em] text-gold-500 md:mb-6"
              >
                EVERYTHING SITS ON THIS ↓
              </p>{/* [review] */}
              <div className="flex flex-col items-center gap-1.5 md:gap-2.5">
                {TIERS.map((t, i) => (
                  <button
                    key={t.num}
                    type="button"
                    aria-expanded={active === i}
                    aria-controls="foundation-detail"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i);
                      setSheetOpen(true);
                    }}
                    className="relative block rounded-md transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
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
                        className="flex flex-col items-center gap-0.5 rounded-md border border-hairline-soft px-4 py-2.5 text-center shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] md:py-5"
                        style={{
                          background: t.bg,
                          borderLeft: `3px solid ${t.edge}`,
                          boxShadow:
                            active === i
                              ? "0 10px 30px -18px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(201,162,75,0.35)"
                              : undefined,
                        }}
                      >
                        <span className="type-caption text-gold-500">{t.num}</span>
                        <span className="font-display text-[0.9375rem] tracking-[0.08em] text-primary md:text-lg">
                          {t.name}
                        </span>
                        <span className="type-caption text-muted">{t.label}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* assembly progress — gold thread draws + layer counter climbs */}
              <div
                aria-hidden="true"
                className="mt-6 flex w-full items-center gap-4 md:mt-8"
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

              {/* mobile: tapped layer detail rises over the stack (no reflow) */}
              {sheetOpen && (
                <div
                  className="absolute inset-0 z-20 flex flex-col justify-center overflow-y-auto rounded-lg border border-hairline-gold p-5 md:hidden"
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

            {/* ---- desktop: icon stickers, crossfading to the layer copy ---- */}
            <div
              id="foundation-detail"
              className="relative hidden min-h-[440px] border-l border-hairline-soft pl-8 md:block"
            >
              {/* resting state — the five layers as gold badges, no copy */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col justify-center gap-3 pl-8 transition-opacity duration-300"
                style={{
                  opacity: active === null ? 1 : 0,
                  pointerEvents: active === null ? undefined : "none",
                }}
              >
                {TIERS.map((t, i) => {
                  const Sticker = t.Icon;
                  return (
                    <span
                      key={t.num}
                      className="float-idle inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-hairline-gold text-gold-500"
                      style={{
                        // steps inward going down, mirroring the inverted stack
                        marginLeft: `${i * 22}px`,
                        opacity: 0.87 - i * 0.13,
                        animationDelay: `${i * 0.4}s`,
                        background: "var(--surface-1)",
                      }}
                    >
                      <Sticker width={26} height={26} />
                    </span>
                  );
                })}
                <p className="type-caption mt-3 tracking-[0.18em] text-muted">
                  HOVER A LAYER{/* [review] */}
                </p>
              </div>
              {/* revealed state — the layer's detail + the way into coaching */}
              <div
                className="absolute inset-0 flex flex-col justify-center overflow-y-auto pl-8 transition-opacity duration-300"
                style={{
                  opacity: active === null ? 0 : 1,
                  pointerEvents: active === null ? "none" : undefined,
                }}
                aria-hidden={active === null}
              >
                {detail}
              </div>
            </div>
          </div>

          <p className="type-body mx-auto mt-6 max-w-[48ch] text-center text-secondary md:mt-8">
            Everyone wants to live at the top. But the top only holds if the
            bottom is built first.
          </p>{/* [review] */}

          {/* scroll guide — fading chevron trail + prompt, retires once built */}
          <div
            ref={cueRef}
            aria-hidden="true"
            className="mt-5 flex flex-col items-center gap-1.5"
            style={{ opacity: 0 }}
          >
            <p className="type-caption tracking-[0.18em] text-muted">
              SCROLL TO BUILD IT{/* [review] */}
            </p>
            <span className="flex flex-col items-center -space-y-1.5">
              {[0, 1, 2].map((n) => (
                <svg
                  key={n}
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  className="float-idle text-gold-500"
                  style={{ opacity: 0.9 - n * 0.28, animationDelay: `${n * 0.18}s` }}
                >
                  <path
                    d="M1 1L8 8L15 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
