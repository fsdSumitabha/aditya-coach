"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

/**
 * Subtle 3D tilt toward the cursor (≤ maxDeg), springs back on leave.
 * Desktop only (pointer events with fine pointers); no-op under reduced
 * motion or touch. Wrap a .card — the wrapper carries the transform.
 */
export default function TiltCard({
  children,
  className,
  maxDeg = 3,
}: {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * maxDeg * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * maxDeg * 2).toFixed(2)}deg`);
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
