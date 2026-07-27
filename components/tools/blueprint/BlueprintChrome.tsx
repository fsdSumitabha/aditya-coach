"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Interactive reading chrome for the Blueprint document:
 *  1. a thin gold reading-progress bar under the header, and
 *  2. a desktop scroll-spy chapter rail (01–10) whose active change lights
 *     gold and reveals its label; clicking a numeral jumps to that change.
 *
 * Progressive enhancement — fully decorative (aria-hidden); the change <h2>
 * headings remain the semantic structure. All of it is keyboard-inert
 * (tabIndex -1) so it never traps focus. Initial state matches the server
 * render (progress 0, rail hidden), so there is no hydration mismatch.
 */
export default function BlueprintChrome({
  changes,
}: {
  changes: { id: string; num: string; short: string }[];
}) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [railVisible, setRailVisible] = useState(false);
  const frame = useRef<number | null>(null);

  // Reading progress — throttled to one update per animation frame.
  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  // Scroll-spy over the change sections + rail visibility.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = changes
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((el) => spy.observe(el));

    // Rail appears only while the changes block is on screen.
    const first = sections[0];
    const last = sections[sections.length - 1];
    const bounds = new IntersectionObserver(
      () => {
        const top = first.getBoundingClientRect().top;
        const bottom = last.getBoundingClientRect().bottom;
        setRailVisible(top < window.innerHeight * 0.6 && bottom > 0);
      },
      { rootMargin: "0px", threshold: [0, 1] },
    );
    bounds.observe(first);
    bounds.observe(last);

    return () => {
      spy.disconnect();
      bounds.disconnect();
    };
  }, [changes]);

  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

  return (
    <>
      {/* 1. Reading-progress bar — pinned just under the sticky header. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 z-30 h-[2px] bg-transparent"
        style={{ top: "var(--header-h)" }}
      >
        <div
          className="h-full origin-left bg-[linear-gradient(90deg,var(--gold-700),var(--gold-300),var(--gold-500))] shadow-[0_0_12px_rgba(201,162,75,0.5)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* 2. Chapter rail — desktop only, decorative. */}
      <div
        aria-hidden="true"
        className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 transition-opacity duration-500 lg:flex ${
          railVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {changes.map((c, i) => {
          const isActive = active === c.id;
          return (
            <div key={c.id} className="flex flex-col items-end">
              {i > 0 && (
                <span className="mb-1 mr-[9px] block h-5 w-px bg-[rgba(201,162,75,0.25)]" />
              )}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => jump(c.id)}
                className="group flex cursor-pointer items-center gap-2"
              >
                <span
                  className={`whitespace-nowrap type-caption tracking-[0.14em] transition-all duration-300 ${
                    isActive
                      ? "text-gold-200 opacity-100"
                      : "text-muted opacity-0 group-hover:opacity-70"
                  }`}
                >
                  {c.short}
                </span>
                <span
                  className={`font-display text-[15px] leading-none transition-all duration-300 ${
                    isActive
                      ? "scale-125 text-gold-300 [text-shadow:0_0_14px_rgba(201,162,75,0.6)]"
                      : "text-muted group-hover:text-gold-500"
                  }`}
                >
                  {c.num}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
