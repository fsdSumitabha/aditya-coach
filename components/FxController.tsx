"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide pointer effects (desktop, pointer:fine, motion-allowed only):
 * 1. Cursor glow — a faint gold halo that lags the pointer (lerped rAF).
 * 2. Card spotlight — sets --mx/--my on any `.spot` element under the pointer
 *    so its radial highlight tracks the cursor.
 * One delegated listener; transform-only writes; zero layout reads per frame.
 */
export default function FxController() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = glowRef.current;
    let tx = innerWidth / 2;
    let ty = innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;
    let active = false;

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (glow) glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        active = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (glow && glow.style.opacity !== "1") glow.style.opacity = "1";
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
      // Card spotlight vars — only for the card actually under the pointer
      const card = (e.target as Element | null)?.closest?.(".spot");
      if (card instanceof HTMLElement) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
