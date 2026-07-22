"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Scene from "./Scene";

/**
 * First-seconds frame-rate watchdog. In-app browsers (Instagram/WhatsApp
 * WebViews) and weak GPUs often create a WebGL context fine but render the
 * journey at a slideshow pace; below ~12fps scrolling reads as frozen. Rather
 * than leave those visitors on a broken page, bail to the animated 2D journey.
 * Time is accumulated from frame deltas so hidden-tab throttling can't trip
 * it, and automation is exempt (QA screenshots run on SwiftShader at low fps).
 */
function PerfWatchdog({
  onFail,
  onAlive,
  framesRef,
}: {
  onFail: () => void;
  onAlive: () => void;
  framesRef: MutableRefObject<number>;
}) {
  const acc = useRef(0);
  const done = useRef(false);
  useFrame((_, delta) => {
    if (done.current) return;
    if (framesRef.current === 0) onAlive();
    framesRef.current += 1;
    acc.current += Math.min(delta, 0.25);
    if (acc.current >= 4) {
      done.current = true;
      if (framesRef.current / acc.current < 12 && !navigator.webdriver) onFail();
    }
  });
  return null;
}

export default function ExperienceCanvas({
  onPerfFail,
  onAlive,
}: {
  onPerfFail: () => void;
  onAlive: () => void;
}) {
  // Phones get a tighter pixel-ratio cap — the single biggest win against
  // dropped frames and touch-scroll jank on mid-range devices.
  const mobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  const framesRef = useRef(0);

  // A renderer that never produces a single frame (wedged driver, blocked
  // context) would also never run the watchdog — catch that on wall time.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (
        framesRef.current === 0 &&
        document.visibilityState === "visible" &&
        !navigator.webdriver
      ) {
        onPerfFail();
      }
    }, 7000);
    return () => window.clearTimeout(t);
  }, [onPerfFail]);

  return (
    <Canvas
      dpr={mobile ? [1, 1.3] : [1, 1.8]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [0, 1.7, 9] }}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onPerfFail();
        });
      }}
    >
      <PerfWatchdog onFail={onPerfFail} onAlive={onAlive} framesRef={framesRef} />
      <Scene />
    </Canvas>
  );
}
