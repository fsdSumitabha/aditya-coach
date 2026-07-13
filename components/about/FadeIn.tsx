"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * /about hero "slow fade" — ON LOAD, not on scroll (the shared Reveal covers
 * scroll reveals). Progressive enhancement mirrors Reveal: server HTML is
 * visible by default; JS hides + animates only when motion is allowed.
 * Only opacity/transform animate. NEVER wraps the hero H1 — the LCP headline
 * paints at final state on frame 1 per the site-wide hard rule.
 */
export default function FadeIn({
  as = "div",
  className,
  delayMs = 0,
  durationMs = 700,
  scaleFrom,
  y = 14,
  children,
  style,
}: {
  as?: ElementType;
  className?: string;
  /** transition-delay in ms (stagger: portrait first, then text lines) */
  delayMs?: number;
  /** fade duration — hero portrait uses ~900ms for the signature slow fade */
  durationMs?: number;
  /** optional starting scale, e.g. 1.02 → settles to 1 */
  scaleFrom?: number;
  /** starting translateY in px (0 to disable the rise) */
  y?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion → element stays at final state, no fade, no scale.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = [
      scaleFrom !== undefined ? `scale(${scaleFrom})` : "",
      y ? `translateY(${y}px)` : "",
    ]
      .join(" ")
      .trim();

    el.style.opacity = "0";
    if (from) el.style.transform = from;

    // Double rAF so the hidden state commits before the transition starts.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `opacity ${durationMs}ms var(--ease-out-expo) ${delayMs}ms, transform ${durationMs}ms var(--ease-out-expo) ${delayMs}ms`;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [delayMs, durationMs, scaleFrom, y]);

  const Tag = as as unknown as React.FC<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
