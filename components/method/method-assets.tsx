// /method page-scoped swappable assets (BUILD SPEC /method §9).
// Server-safe module — no "use client". Icons are gold line-icons, inline SVG,
// decorative (aria-hidden), explicit 48×48 so nothing shifts on load.
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

/** Step 01 — clock / sunrise */
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

/** Step 02 — plate / leaf */
export function IconPlate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="24" cy="24" r="16" />
      <path d="M19 30c0-7 5-11.5 11-12.5-.8 7.2-4.6 11.4-11 12.5Z" />
      <path d="M19 30c3.5-1.4 6-3.6 7.5-6.5" />
    </svg>
  );
}

/** Step 03 — capsule */
export function IconCapsule(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="16.5" y="7" width="15" height="34" rx="7.5" transform="rotate(45 24 24)" />
      <path d="M16.5 24h15" transform="rotate(45 24 24)" />
    </svg>
  );
}

/** Step 04 — shield / medical cross */
export function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M24 6l14 5v10c0 9.5-5.7 16.6-14 21-8.3-4.4-14-11.5-14-21V11l14-5Z" />
      <path d="M24 18v12" />
      <path d="M18 24h12" />
    </svg>
  );
}

// ---- Swappable icon constants (spec: ICON_STEP1…ICON_STEP4) ----
export const ICON_STEP1 = IconSunrise;
export const ICON_STEP2 = IconPlate;
export const ICON_STEP3 = IconCapsule;
export const ICON_STEP4 = IconShield;
