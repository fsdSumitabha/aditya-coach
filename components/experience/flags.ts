"use client";

/**
 * URL escape hatches for the homepage journey, read once per page load.
 *
 *   ?three=1   force the 3D journey AND disable every automatic demotion —
 *              nothing can swap the page out afterwards. Use this to prove a
 *              visitor's hardware is fine when they only ever see 2D.
 *   ?flat=1    force the 2D journey on any device.
 *   ?stats     show the frame-rate overlay in a production build.
 */

let cache: { three: boolean; flat: boolean; stats: boolean } | null = null;

function flags() {
  if (cache) return cache;
  if (typeof window === "undefined") {
    // Don't cache a server-side read — the client must parse for itself.
    return { three: false, flat: false, stats: false };
  }
  let q: URLSearchParams | null = null;
  try {
    q = new URLSearchParams(window.location.search);
  } catch {
    /* malformed query string — treat every flag as absent */
  }
  cache = {
    three: !!q?.has("three"),
    flat: !!q?.has("flat"),
    stats: !!q?.has("stats"),
  };
  return cache;
}

export const forceThree = () => flags().three;
export const forceFlat = () => flags().flat;
export const wantsStats = () => flags().stats;

/**
 * Every path that gives up on the 3D journey routes its reason through here,
 * so a visitor who only sees the 2D page can read one console line and say
 * exactly which check sent them there — no profiler, no screen share.
 */
export function reportFallback(reason: string) {
  console.warn(
    `[atelier] Showing the 2D journey because ${reason}.\n` +
      `[atelier] Add ?three=1 to the URL to force the 3D journey and disable ` +
      `all automatic switching.`,
  );
}
