"use client";

import { useEffect, useState } from "react";

/**
 * Desktop-only sticky rail for the four step sections: the active step's
 * numeral lights gold as it enters view; clicking jumps to it. Progressive
 * enhancement — renders nothing until mounted, decorative for keyboard/AT
 * (the step headings remain the semantic structure).
 */
const STEPS = [
  { id: "step-1", num: "01" },
  { id: "step-2", num: "02" },
  { id: "step-3", num: "03" },
  { id: "step-4", num: "04" },
];

export default function StepRail() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = STEPS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px" },
    );
    sections.forEach((el) => io.observe(el));

    // rail shows only while the steps block is on screen
    const wrap = sections[0].closest("section");
    let wrapIo: IntersectionObserver | null = null;
    if (wrap) {
      wrapIo = new IntersectionObserver(
        (entries) => setVisible(entries.some((e) => e.isIntersecting)),
        { rootMargin: "-15% 0px -15% 0px" },
      );
      wrapIo.observe(wrap);
    }
    return () => {
      io.disconnect();
      wrapIo?.disconnect();
    };
  }, []);

  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

  return (
    <div
      aria-hidden="true"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 transition-opacity duration-500 lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center">
          {i > 0 && (
            <span className="mb-1 block h-6 w-px bg-[rgba(201,162,75,0.25)]" />
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => jump(s.id)}
            className={`font-display cursor-pointer text-[15px] leading-none transition-all duration-300 ${
              active === s.id
                ? "scale-125 text-gold-300 [text-shadow:0_0_14px_rgba(201,162,75,0.6)]"
                : "text-muted hover:text-gold-500"
            }`}
          >
            {s.num}
          </button>
        </div>
      ))}
    </div>
  );
}
