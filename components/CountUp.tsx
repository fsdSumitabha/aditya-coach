"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number (calculator results, stats). Animates 0 → value once the
 * element scrolls into view (or immediately when `startOn="mount"`), using
 * rAF + transform-free text swaps. Reduced-motion → jumps straight to value.
 */
export default function CountUp({
  value,
  durationMs = 900,
  startOn = "visible",
  format = (n: number) => Math.round(n).toLocaleString("en-IN"),
  className,
}: {
  value: number;
  durationMs?: number;
  startOn?: "visible" | "mount";
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(value));
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      raf = requestAnimationFrame(() => setDisplay(format(value)));
      return () => cancelAnimationFrame(raf);
    }
    const run = () => {
      if (animated.current) {
        setDisplay(format(value));
        return;
      }
      animated.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setDisplay(format(value * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (startOn === "mount" || typeof IntersectionObserver === "undefined") {
      run();
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, startOn]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
