"use client";

import { useEffect, useRef } from "react";

/**
 * The /about timeline's gold spine — "draws" top-to-bottom (scaleY 0→1,
 * transform-only) as the timeline scrolls into view, so the journey builds
 * as you read it. Progressive enhancement: the full spine is visible by
 * default; JS collapses + draws it only when IntersectionObserver exists AND
 * motion is allowed. Reduced motion → full spine, instantly, no draw.
 */
export default function TimelineSpine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transformOrigin = "top";
    el.style.transform = "scaleY(0)";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.transition = "transform 1400ms var(--ease-out-expo)";
            el.style.transform = "scaleY(1)";
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        background:
          "linear-gradient(180deg, var(--hairline-gold), var(--gold-500) 25%, var(--gold-500) 75%, var(--hairline-gold))",
      }}
    />
  );
}
