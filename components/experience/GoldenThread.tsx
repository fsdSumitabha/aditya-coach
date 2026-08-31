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
        // Re-strung for the four-chapter journey (31 Aug 2026): the last
        // stop was -71.5 when the decision stood at z -70. It ends at -57.5
        // now, and the waypoints stitch seal (0) → gallery (-16) →
        // stack (-34) → programmes (-52).
        [2.3, 0.25, 4.5],
        [2.0, 0.5, -3],
        [-1.4, 0.35, -10],
        [1.8, 0.8, -16],
        [-2.2, 0.5, -23],
        [2.4, 0.4, -30],
        [0, 0.3, -36],
        [-2.4, 0.9, -42],
        [2.0, 1.1, -47],
        [-1.6, 0.6, -52],
        [0, 0.8, -57.5],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    // 360 segments over a 70-unit curve was a vertex every 0.19 units on a
    // 0.016-radius thread. 170 over the shortened 58-unit curve keeps the same
    // ~0.35-unit spacing, so the draw-range reveal reads exactly as before.
    const geo = new THREE.TubeGeometry(curve, 170, 0.016, 6, false);
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
    // Reduced motion: the thread still draws itself in with scroll (that is
    // the visitor's own action) but holds a steady glow instead of breathing.
    const calm = useExperience.getState().calm;
    const target = calm
      ? 1.6
      : 1.6 + Math.sin(state.clock.elapsedTime * 1.4) * 0.5;
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
