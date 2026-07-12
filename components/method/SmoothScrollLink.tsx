"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Hero micro-CTA: an in-page anchor that smooth-scrolls to a target section.
 * Progressive enhancement — works as a plain #hash link without JS.
 * Respects prefers-reduced-motion (instant jump instead of smooth scroll).
 * html { scroll-padding-top } (globals) keeps the target clear of the header.
 */
export default function SmoothScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <a href={`#${targetId}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
