"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Shared reveal-on-scroll primitive (A5).
 * Progressive enhancement: server HTML is VISIBLE by default; the .reveal
 * (hidden) class is added by JS only when IntersectionObserver exists AND
 * motion is allowed. Reveal-once — unobserves after firing.
 *
 * Stagger siblings by passing `index` (delay = index * 100ms) or an exact
 * `delayMs`.
 */
export default function Reveal({
  as = "div",
  className,
  index,
  delayMs,
  children,
  id,
  style,
}: {
  as?: ElementType;
  className?: string;
  /** sibling index — becomes --reveal-delay: index * 100ms */
  index?: number;
  /** exact delay override in ms */
  delayMs?: number;
  children?: ReactNode;
  id?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide only now that we know we can animate it back in.
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delay =
    delayMs !== undefined ? delayMs : index !== undefined ? index * 100 : undefined;
  const mergedStyle: CSSProperties | undefined =
    delay !== undefined
      ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties)
      : style;

  return createElement(
    as,
    { ref, className, id, style: mergedStyle },
    children,
  );
}
