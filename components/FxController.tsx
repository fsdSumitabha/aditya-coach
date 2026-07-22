"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide pointer effects (desktop, pointer:fine, motion-allowed only):
 * 1. Cursor glow — a faint gold halo that lags the pointer (lerped rAF).
 * 2. Card spotlight — sets --mx/--my on any `.spot` element under the pointer
 *    so its radial highlight tracks the cursor.
 * One delegated listener; transform-only writes; zero layout reads per frame.
 */
export default function FxController() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll-driven-animation fallback: engines without animation-timeline
  // (Safari/iOS < 26) get a one-shot IO-driven draw for the gold threads —
  // the pages' signature motion — instead of a fully static frame. Re-runs
  // per route since the observed elements change with the page.
  useEffect(() => {
    if (
      typeof CSS === "undefined" ||
      CSS.supports("animation-timeline: view()")
    )
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    document.documentElement.classList.add("sdjs");
    // Observe each thread's PARENT, not the thread: the sdjs CSS collapses
    // threads to scaleY(0), which shrinks their observable box to a point —
    // observing them directly would never fire once scrolled past.
    const pending = new Map<Element, Element[]>();
    document.querySelectorAll(".sd-draw:not(.is-in)").forEach((el) => {
      const anchor = el.parentElement ?? el;
      const list = pending.get(anchor) ?? [];
      list.push(el);
      pending.set(anchor, list);
    });

    function mark(anchor: Element) {
      pending.get(anchor)?.forEach((el) => el.classList.add("is-in"));
      pending.delete(anchor);
      io.unobserve(anchor);
      if (!pending.size) window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // top < 0: already scrolled past — settle it drawn, never hidden
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            mark(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((_els, anchor) => io.observe(anchor));

    // Instant jumps (anchor links, momentum flings) can cross an element
    // without an IO threshold event — sweep stragglers on a throttled check.
    let sweeping = false;
    function onScroll() {
      if (sweeping) return;
      sweeping = true;
      window.setTimeout(() => {
        sweeping = false;
        const limit = window.innerHeight * 0.94;
        pending.forEach((_els, anchor) => {
          if (anchor.getBoundingClientRect().top < limit) mark(anchor);
        });
      }, 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

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
