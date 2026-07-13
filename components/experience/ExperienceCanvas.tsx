"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function ExperienceCanvas() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [0, 1.7, 9] }}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
