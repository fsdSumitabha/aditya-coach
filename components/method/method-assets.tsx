// /method page-scoped swappable assets (BUILD SPEC /method §9).
// Server-safe module — no "use client". Icons are gold line-icons, inline SVG,
// decorative (aria-hidden), explicit 48×48 so nothing shifts on load.
// One icon per layer of THE COMPLETE REBUILD (Lifestyle → Body → Nutrition →
// Performance → Presence).
import type { SVGProps } from "react";

// ---- Swappable asset constants (explicit dimensions protect CLS) ----
export const OG_METHOD_IMG = "/og-method.jpg"; /* TODO: replace — 1200×630, framework title on dark/gold */
export const STACK_FALLBACK_IMG = "/images/method-foundation-stack.jpg"; /* TODO (reserved, 900×720): optional photo/illustration of the Foundation Stack — default build uses the inline CSS/SVG stack, this constant is reserved per spec */

function baseProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 48 48",
    width: 48,
    height: 48,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/** Step 01 — Lifestyle: clock / sunrise (sleep, waking, daily rhythm) */
export function IconSunrise(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M8 36h32" />
      <path d="M14 36a10 10 0 0 1 20 0" />
      <path d="M24 12v6" />
      <path d="M11.3 22.3l4.2 4.2" />
      <path d="M36.7 22.3l-4.2 4.2" />
    </svg>
  );
}

/** Step 02 — Body: dumbbell (strength, fitness, physical confidence) */
export function IconDumbbell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M18 24h12" />
      <rect x="10" y="15" width="8" height="18" rx="2" />
      <rect x="30" y="15" width="8" height="18" rx="2" />
      <path d="M8 20v8" />
      <path d="M40 20v8" />
    </svg>
  );
}

/** Step 03 — Nutrition: plate / leaf (fuel) */
export function IconPlate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="24" cy="24" r="16" />
      <path d="M19 30c0-7 5-11.5 11-12.5-.8 7.2-4.6 11.4-11 12.5Z" />
      <path d="M19 30c3.5-1.4 6-3.6 7.5-6.5" />
    </svg>
  );
}

/** Step 04 — Performance: lightning bolt (energy, recovery, training quality) */
export function IconBolt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M28 5 13 27h10l-2 16 15-22H26l2-16Z" />
    </svg>
  );
}

/** Step 05 — Presence: head & shoulders (how you show up in a room) */
export function IconPresence(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="24" cy="13" r="6" />
      <path d="M12 40c0-8 5.4-13 12-13s12 5 12 13" />
    </svg>
  );
}

// ---- Swappable icon constants (spec: ICON_STEP1…ICON_STEP5) ----
export const ICON_STEP1 = IconSunrise; // Lifestyle
export const ICON_STEP2 = IconDumbbell; // Body
export const ICON_STEP3 = IconPlate; // Nutrition
export const ICON_STEP4 = IconBolt; // Performance
export const ICON_STEP5 = IconPresence; // Presence
