"use client";

import { useEffect, useRef } from "react";

/**
 * The page's showpiece: a sticky-pinned scene where the Foundation Stack
 * assembles bottom-up (Lifestyle base first → Medical last) as the user
 * scrolls through the tall wrapper. Scroll-linked scrubbing so the motion
 * feels physical.
 *
 * - Transform/opacity only, one rAF-throttled scroll value drives every tier.
 * - Progressive enhancement: SSR paints the FINISHED, seated stack. JS only
 *   moves to the pre-assembly state (and attaches the scrubber) once we know
 *   motion is allowed — reduced motion / no-JS keep the static finished stack.
 * - The visual stack is decorative (aria-hidden); the accessible description
 *   lives in the parent section. Caption + closing line stay readable.
 */

// Visual stack order = DOM top→bottom (Medical on top, Lifestyle at the base).
const TIERS = [
  {
    num: "04",
    name: "MEDICAL",
    label: "Last, if needed" /* [review] */,
    width: "44%",
    bg: "var(--surface-1)",
    edge: "rgba(201, 162, 75, 0.25)",
  },
  {
    num: "03",
    name: "SUPPLEMENTS",
    label: "Fills the gaps" /* [review] */,
    width: "62%",
    bg: "var(--surface-1)",
    edge: "rgba(201, 162, 75, 0.45)",
  },
  {
    num: "02",
    name: "NUTRITION",
    label: "Built on top" /* [review] */,
    width: "81%",
    bg: "var(--surface-2)",
    edge: "rgba(201, 162, 75, 0.7)",
  },
  {
    num: "01",
    name: "LIFESTYLE",
    label: "The Foundation" /* [review] */,
    width: "100%",
    bg: "var(--surface-warm)",
    edge: "var(--gold-500)",
  },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function FoundationStack() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tierRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    const tiers = tierRefs.current;
    if (!scene || tiers.length === 0) return;
    // Reduced motion → leave the SSR default: finished, seated stack.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const N = tiers.length;
    // Each tier gets a scrub window; bottom tier (last in array) leads.
    const step = 0.15;
    const dur = 0.34;

    const apply = (progress: number) => {
      for (let i = 0; i < N; i++) {
        const el = tiers[i];
        if (!el) continue;
        const k = N - 1 - i; // Lifestyle(i=N-1) → k=0 (first); Medical(i=0) → last
        const t = easeOut(clamp01((progress - k * step) / dur));
        const y = (1 - t) * 30;
        const scale = 0.96 + 0.04 * t;
        el.style.transform = `translateY(${y}px) scale(${scale})`;
        el.style.opacity = String(t);
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

  return (
    <div ref={sceneRef} className="pin-scene min-h-[160vh] md:min-h-[220vh]">
      <div className="pin-stage">
        <div className="container-site w-full">
          <div aria-hidden="true" className="mx-auto max-w-[560px]">
            <p className="type-caption mb-6 text-center tracking-[0.16em] text-gold-500">
              EVERYTHING SITS ON THIS ↓
            </p>{/* [review] */}
            <div className="flex flex-col items-center gap-2.5">
              {TIERS.map((tier, i) => (
                <div
                  key={tier.num}
                  ref={(el) => {
                    tierRefs.current[i] = el;
                  }}
                  style={{ width: tier.width, minWidth: "10.5rem" }}
                >
                  <div
                    className="flex flex-col items-center gap-0.5 rounded-md border border-hairline-soft px-4 py-4 text-center shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] md:py-5"
                    style={{
                      background: tier.bg,
                      borderLeft: `3px solid ${tier.edge}`,
                    }}
                  >
                    <span className="type-caption text-gold-500">{tier.num}</span>
                    <span className="font-display text-[0.9375rem] tracking-[0.08em] text-primary md:text-lg">
                      {tier.name}
                    </span>
                    <span className="type-caption text-muted">{tier.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="type-body mx-auto mt-10 max-w-[48ch] text-center text-secondary">
            Everyone wants to live at the top. But the top only holds if the
            bottom is built first.
          </p>{/* [review] */}
        </div>
      </div>
    </div>
  );
}
