// Shared chrome for the atelier's DOM layer — the scroll overlay and the
// in-scene buttons that drei's <Html> anchors to 3D points.
//
// The museum carries its own night palette in explicit literals so global
// theme experiments (e.g. a daylight refresh) can never break legibility here.

export const EYEBROW =
  "font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c9a24b]";

export const BTN_GOLD =
  "inline-flex min-h-[52px] items-center justify-center rounded-[10px] px-7 font-semibold text-[#0b0b0c] [background:linear-gradient(180deg,#e6d19a_0%,#c9a24b_45%,#a9832f_100%)] shadow-[0_8px_30px_rgba(201,162,75,0.25)] transition-transform duration-200 hover:-translate-y-0.5";

export const BTN_OUTLINE =
  "inline-flex min-h-[52px] items-center justify-center rounded-[10px] border-[1.5px] border-[rgba(244,241,234,0.6)] px-7 font-semibold text-[#f4f1ea] transition-colors duration-200 hover:bg-[rgba(244,241,234,0.08)]";

/**
 * In-scene button. Quieter than BTN_GOLD — these float inside the render at
 * mid-journey, where a filled gold slab would be the loudest thing on screen
 * and gold is supposed to be scarce. Still a real tap target (≥48px) and a
 * real focusable <button>.
 */
export const BTN_SCENE =
  "pointer-events-auto inline-flex min-h-[48px] select-none items-center justify-center whitespace-nowrap rounded-full border border-[rgba(201,162,75,0.45)] bg-[rgba(11,11,12,0.72)] px-5 text-[0.82rem] font-semibold text-[#f4f1ea] shadow-[0_10px_34px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(201,162,75,0.9)] hover:bg-[rgba(201,162,75,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] sm:px-6 sm:text-[0.88rem]";

/**
 * The canvas lives in its own React reconciler root, so the app router's
 * context does not reach components rendered inside <Canvas> — a next/link
 * there would throw. Buttons in the scene raise this instead and Home3D, which
 * sits in the normal tree, does the push. Same shape as the existing
 * "journey:jump" event.
 */
export const NAVIGATE_EVENT = "journey:navigate";

export function requestNavigate(href: string) {
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: href }));
}
