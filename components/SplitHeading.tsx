"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * Word-mask headline reveal: each word rises out of its own overflow mask,
 * staggered left-to-right, once, when the heading scrolls into view.
 * Progressive enhancement — SSR renders plain visible text; JS splits and
 * animates only when IO exists and motion is allowed.
 *
 * NEVER use on a page's hero h1 (LCP paints frame 1) — section headings only.
 */
export default function SplitHeading({
  as = "h2",
  text,
  className,
  id,
  staggerMs = 50,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  id?: string;
  staggerMs?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Split into word masks (static page content — never re-rendered by React)
    const words = text.split(/\s+/);
    el.textContent = "";
    words.forEach((w, i) => {
      const mask = document.createElement("span");
      mask.className = "split-mask";
      const word = document.createElement("span");
      word.className = "split-word";
      word.textContent = w;
      word.style.setProperty("--w-delay", `${i * staggerMs}ms`);
      mask.appendChild(word);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.classList.add("split-ready");

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("split-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, staggerMs]);

  const Tag = as as unknown as React.FC<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    id?: string;
    "aria-label"?: string;
    children?: React.ReactNode;
  }>;

  return (
    <Tag ref={ref} className={className} id={id} aria-label={text}>
      {text}
    </Tag>
  );
}
