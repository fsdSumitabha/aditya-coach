"use client";

import { useEffect, useRef } from "react";

/**
 * Connector-line fill — the signature motion of /method (BUILD SPEC §4).
 * A vertical rule joining nodes 01→04. Base line is faint gold; a gold fill
 * scales down from the top toward the current scroll position.
 *
 * - Transform-only (scaleY on its own layer) — no reflow of the step cards.
 * - Driven by a single rAF-throttled scroll/resize value.
 * - Decorative: aria-hidden. No-JS and prefers-reduced-motion render the
 *   line fully filled (static gold) — content never depends on the effect.
 */
export default function ConnectorRail({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;
    // Reduced motion → leave the SSR default: fully filled, static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      if (rect.height <= 0) return;
      // Fill up to a reading line ~70% down the viewport.
      const readingLine = window.innerHeight * 0.7;
      const progress = Math.min(1, Math.max(0, (readingLine - rect.top) / rect.height));
      fill.style.transform = `scaleY(${progress})`;
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
    <div
      ref={trackRef}
      aria-hidden="true"
      className={className}
      style={{ contain: "layout paint" }}
    >
      {/* faint base line */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--hairline-gold)" }}
      />
      {/* gold fill — SSR default fully filled (no-JS fallback); JS scales it */}
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top"
        style={{
          background:
            "linear-gradient(180deg, var(--gold-300), var(--gold-500))",
          transform: "scaleY(1)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
