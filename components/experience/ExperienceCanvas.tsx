"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Scene from "./Scene";
import { Stats } from "@react-three/drei";
import { forceThree, wantsStats } from "./flags";

/** Dev has React Strict Mode double-mounts and Fast Refresh remounts, both of
 *  which churn WebGL contexts and produce false failures. Never auto-demote
 *  there — use ?flat=1 to preview the 2D journey instead. */
const DEV = process.env.NODE_ENV !== "production";

/** Remembering that 3D already worked on this machine, so a one-off glitch on
 *  a later visit can't demote a perfectly capable device. */
const OK_KEY = "aku:gl-ok";

export function markGlProven() {
  try {
    localStorage.setItem(OK_KEY, "1");
  } catch {
    /* private mode / storage disabled — just don't remember */
  }
}

export function glProven() {
  try {
    return localStorage.getItem(OK_KEY) === "1";
  } catch {
    return false;
  }
}

// Skip the warm-up entirely before judging anything: shader compilation,
// texture uploads and React hydration all land in the first seconds and say
// nothing about steady-state frame rate. The old watchdog measured straight
// through them, which is why machines that then ran at a locked 60fps could
// still be demoted.
const WARMUP_S = 3;
const SAMPLE_S = 4;
const MIN_FPS = 8; // was 12 — only catch genuinely unusable rendering

/**
 * Frame-rate watchdog. In-app browsers (Instagram/WhatsApp WebViews) and very
 * weak GPUs sometimes create a WebGL context fine but render the journey at a
 * slideshow pace, where scrolling reads as frozen. Rather than leave those
 * visitors on a broken page, bail to the animated 2D journey — but only after
 * the scene has settled, and only when it is genuinely unusable.
 *
 * Time is accumulated from clamped frame deltas, automation is exempt (QA
 * screenshots run on SwiftShader at low fps), and a backgrounded tab is never
 * judged.
 */
function PerfWatchdog({
  onFail,
  onAlive,
  framesRef,
}: {
  onFail: (reason: string) => void;
  onAlive: () => void;
  framesRef: MutableRefObject<number>;
}) {
  const warm = useRef(0);
  const acc = useRef(0);
  const samples = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) return;
    if (framesRef.current === 0) onAlive();
    framesRef.current += 1;

    const d = Math.min(delta, 0.25);
    if (warm.current < WARMUP_S) {
      warm.current += d;
      return;
    }

    acc.current += d;
    samples.current += 1;
    if (acc.current < SAMPLE_S) return;

    done.current = true;
    const fps = samples.current / acc.current;
    if (fps >= MIN_FPS) {
      markGlProven();
      return;
    }
    if (DEV || navigator.webdriver || forceThree()) return;
    if (document.visibilityState !== "visible") return; // throttled, not slow
    if (glProven()) return; // this machine has run the scene before
    onFail(
      `the scene rendered at ${fps.toFixed(1)}fps over ${SAMPLE_S}s, ` +
        `below the ${MIN_FPS}fps floor`,
    );
  });
  return null;
}

export default function ExperienceCanvas({
  onPerfFail,
  onAlive,
}: {
  onPerfFail: (reason: string) => void;
  onAlive: () => void;
}) {
  // Phones get a tighter pixel-ratio cap — the single biggest win against
  // dropped frames and touch-scroll jank on mid-range devices.
  const mobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  const framesRef = useRef(0);

  // Measurement overlay: always on in dev, and available in production via
  // ?stats — so it can be read on a visitor's own machine without shipping a
  // debug HUD to everyone who lands on the homepage.
  const showStats = DEV || wantsStats();

  // A renderer that never produces a single frame (wedged driver, blocked
  // context) would also never run the watchdog — catch that on wall time.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (DEV || navigator.webdriver || forceThree()) return;
      if (
        framesRef.current === 0 &&
        document.visibilityState === "visible" &&
        !glProven()
      ) {
        onPerfFail("the renderer produced no frames at all within 60 seconds");
      }
    }, 60000);
    return () => window.clearTimeout(t);
  }, [onPerfFail]);

  return (
    <Canvas
      dpr={mobile ? [1, 1.3] : [1, 1.8]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [0, 1.7, 9] }}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        // Context loss is usually TEMPORARY: laptop sleep/resume, a GPU driver
        // reset, another app grabbing the GPU, and — in dev — Strict Mode plus
        // Fast Refresh exhausting the browser's per-tab context budget. Chrome
        // restores nearly all of these within a second or two, and three.js
        // rebuilds its resources on `webglcontextrestored` by itself.
        //
        // The old handler condemned the visitor to the 2D page the instant the
        // context dropped, with no attempt to recover. Now we wait.
        const canvas = gl.domElement;
        let condemn = 0;

        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault(); // required, or the context can never come back
          window.clearTimeout(condemn);
          condemn = window.setTimeout(() => {
            if (DEV || navigator.webdriver || forceThree()) return;
            onPerfFail(
              "the WebGL context was lost and did not come back within 8 seconds",
            );
          }, 8000);
        });

        canvas.addEventListener("webglcontextrestored", () => {
          window.clearTimeout(condemn);
        });
      }}
    >
      {showStats && <Stats />}
      <PerfWatchdog onFail={onPerfFail} onAlive={onAlive} framesRef={framesRef} />
      <Scene />
    </Canvas>
  );
}
