"use client";

import { useEffect, useRef } from "react";

/**
 * Thin gold reading-progress bar pinned to the viewport top (blog articles).
 * rAF-throttled, transform-only. Hidden under reduced motion (it is purely
 * decorative — the scrollbar already communicates position).
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="read-progress" aria-hidden="true" />;
}
