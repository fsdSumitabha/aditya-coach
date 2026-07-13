"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "./store";

/**
 * The signature device in 3D: a 1-finger-thick golden thread winding through
 * every chapter, drawing itself in as the visitor travels (drawRange scrubbed
 * by journey progress) with a slow emissive breathe.
 */
export default function GoldenThread() {
  const mesh = useRef<THREE.Mesh>(null);

  const { geometry, indexCount } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [0, 0.25, 4.5],
        [1.6, 0.5, -3],
        [-1.4, 0.35, -10],
        [1.8, 0.8, -16],
        [-2.2, 0.5, -23],
        [2.4, 0.4, -30],
        [0, 0.3, -37],
        [-2.6, 0.9, -44],
        [2.2, 1.1, -52],
        [-2.0, 0.6, -60],
        [0, 0.35, -66],
        [0, 0.8, -71.5],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    const geo = new THREE.TubeGeometry(curve, 360, 0.016, 6, false);
    return { geometry: geo, indexCount: geo.index ? geo.index.count : 0 };
  }, []);

  useFrame((state, delta) => {
    const { progress } = useExperience.getState();
    if (!mesh.current) return;
    const geo = mesh.current.geometry as THREE.TubeGeometry;
    // the thread leads the visitor slightly (progress + 0.08)
    const drawn = Math.min(1, progress * 1.12 + 0.08);
    geo.setDrawRange(0, Math.floor(indexCount * drawn));
    const m = mesh.current.material as THREE.MeshStandardMaterial;
    const target = 1.6 + Math.sin(state.clock.elapsedTime * 1.4) * 0.5;
    m.emissiveIntensity += (target - m.emissiveIntensity) * (1 - Math.exp(-3 * delta));
  });

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        color="#c9a24b"
        emissive="#c9a24b"
        emissiveIntensity={1.8}
        roughness={0.3}
        metalness={0.9}
      />
    </mesh>
  );
}
