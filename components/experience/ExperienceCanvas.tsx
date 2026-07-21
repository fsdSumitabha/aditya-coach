"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function ExperienceCanvas() {
  // Phones get a tighter pixel-ratio cap — the single biggest win against
  // dropped frames and touch-scroll jank on mid-range devices.
  const mobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
  return (
    <Canvas
      dpr={mobile ? [1, 1.3] : [1, 1.8]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [0, 1.7, 9] }}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
