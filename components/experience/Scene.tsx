"use client";

import { useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useExperience } from "./store";
import CameraRig from "./CameraRig";
import GoldenThread from "./GoldenThread";
import { Arrival, Decision, Proof, TheMan, TheOrder } from "./chapters";

/** Damps the raw scroll target into the shared journey progress each frame. */
function ProgressDamper() {
  useFrame((_, delta) => {
    const s = useExperience.getState();
    const k = 1 - Math.exp(-3.4 * delta);
    const next = s.progress + (s.target - s.progress) * k;
    if (Math.abs(next - s.progress) > 1e-5) s.setProgress(next);
  });
  return null;
}

function Floor({ reflective }: { reflective: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -33]}>
      <planeGeometry args={[60, 110]} />
      {reflective ? (
        <MeshReflectorMaterial
          blur={[220, 60]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={0.5}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#0a0908"
          metalness={0.55}
          mirror={0.35}
        />
      ) : (
        <meshStandardMaterial color="#0a0908" roughness={0.9} metalness={0.3} />
      )}
    </mesh>
  );
}

export default function Scene() {
  const quality = useExperience((s) => s.quality);
  const setQuality = useExperience((s) => s.setQuality);
  const setDpr = useThree((s) => s.setDpr);
  const high = quality === "high";

  return (
    <>
      <PerformanceMonitor
        onDecline={() => {
          setQuality("low");
          setDpr(1);
        }}
      />
      <color attach="background" args={["#08080a"]} />
      <fog attach="fog" args={["#08080a", 9, 30]} />

      <ambientLight intensity={0.35} color="#f4f1ea" />
      <directionalLight position={[4, 8, 2]} intensity={0.7} color="#e8d9a8" />

      {/* self-contained studio environment — no external HDR fetches */}
      <Environment frames={1} resolution={128}>
        <Lightformer
          intensity={2.4}
          position={[0, 4, -4]}
          scale={[12, 4, 1]}
          color="#e8d9a8"
        />
        <Lightformer
          intensity={1}
          position={[-6, 2, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 3, 1]}
          color="#c9a24b"
        />
        <Lightformer
          intensity={0.7}
          position={[6, 3, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[8, 3, 1]}
          color="#f4f1ea"
        />
      </Environment>

      <ProgressDamper />
      <CameraRig />
      <Floor reflective={high} />
      <GoldenThread />

      {/* ambient gold dust across the whole journey */}
      <Sparkles
        count={high ? 260 : 120}
        size={high ? 2.4 : 2}
        speed={0.24}
        opacity={0.5}
        color="#e8d9a8"
        scale={[16, 7, 84]}
        position={[0, 3, -32]}
      />

      <Arrival />
      <TheMan />
      <TheOrder />
      <Proof />
      <Decision />

      {high && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={0.75}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.2}
          />
          <Vignette eskil={false} offset={0.22} darkness={0.72} />
        </EffectComposer>
      )}
    </>
  );
}
