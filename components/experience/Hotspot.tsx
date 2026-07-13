"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "./store";

/**
 * A small pulsing gold marker anchored to an object. Hover: brightens and
 * swells; click: focuses the camera on its fact and opens the info card.
 * The invisible hit sphere is oversized so it stays tappable on touch.
 */
export default function Hotspot({
  id,
  position,
  size = 0.09,
}: {
  id: string;
  position: [number, number, number];
  size?: number;
}) {
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const setFocus = useExperience((s) => s.setFocus);
  const focused = useExperience((s) => s.focus === id);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const active = hover || focused;
    const k = 1 - Math.exp(-8 * delta);
    if (core.current) {
      const target = active ? 1.5 : 1 + Math.sin(t * 2.2) * 0.08;
      const s = core.current.scale.x + (target - core.current.scale.x) * k;
      core.current.scale.setScalar(s);
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity += ((active ? 3.4 : 1.5) - m.emissiveIntensity) * k;
    }
    if (ring.current) {
      const pulse = ((t * 0.55) % 1 + 1) % 1;
      ring.current.scale.setScalar(1 + pulse * 2.2);
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - pulse) * (active ? 0.5 : 0.28);
    }
  });

  return (
    <group position={position}>
      {/* generous invisible hit target */}
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setFocus(focused ? null : id);
        }}
      >
        <sphereGeometry args={[size * 4.5, 12, 12]} />
      </mesh>

      <mesh ref={core}>
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial
          color="#e8d9a8"
          emissive="#c9a24b"
          emissiveIntensity={1.5}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.35, size * 1.55, 40]} />
        <meshBasicMaterial
          color="#c9a24b"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
