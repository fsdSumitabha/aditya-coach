"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "./store";
import { FACTS } from "./facts";

/**
 * Scroll drives the camera along a keyframed dolly path; the pointer adds a
 * damped look-around offset (drag or move); clicking a hotspot overrides the
 * pose with that fact's framed close-up until dismissed.
 * Everything is exponential-damped — no instant snaps anywhere.
 */

// [position, lookAt] keyframes distributed evenly across progress 0..1
const KEYS: { p: THREE.Vector3; t: THREE.Vector3 }[] = [
  { p: v(0, 1.7, 9), t: v(0, 1.5, 0) }, // arrival — the seal
  { p: v(2.4, 1.6, -8.5), t: v(-0.4, 1.2, -16) }, // drift toward the two figures
  { p: v(-2.6, 1.9, -24.5), t: v(0.6, 1.4, -34) }, // approach the foundation from the left
  { p: v(0, 2.7, -29.5), t: v(0, 1.4, -34) }, // front-on: the stack assembled
  { p: v(2.8, 1.9, -44.5), t: v(-0.6, 1.8, -52) }, // sweep the proof gallery
  { p: v(-2.4, 1.8, -59), t: v(0.4, 1.5, -70) }, // approach the offers
  { p: v(0, 2.0, -63.5), t: v(0, 1.4, -70) }, // the decision, front and centre
];

function v(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function CameraRig() {
  const pos = useRef(KEYS[0].p.clone());
  const look = useRef(KEYS[0].t.clone());
  const lookOffset = useRef({ yaw: 0, pitch: 0 });
  const tmpP = useRef(new THREE.Vector3());
  const tmpT = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { progress, focus } = useExperience.getState();

    // -- 1. resolve the desired pose --
    if (focus && FACTS[focus]) {
      const f = FACTS[focus];
      tmpP.current.set(...f.cam);
      tmpT.current.set(...f.look);
    } else {
      const segs = KEYS.length - 1;
      const s = Math.min(progress * segs, segs - 1e-4);
      const i = Math.floor(s);
      const local = easeInOut(s - i);
      tmpP.current.lerpVectors(KEYS[i].p, KEYS[i + 1].p, local);
      tmpT.current.lerpVectors(KEYS[i].t, KEYS[i + 1].t, local);
    }

    // -- 2. damp toward it (slower while focusing for a cinematic settle) --
    const lambda = focus ? 2.4 : 3.2;
    const k = 1 - Math.exp(-lambda * delta);
    pos.current.lerp(tmpP.current, k);
    look.current.lerp(tmpT.current, k);

    // -- 3. pointer look-around (damped, bounded) --
    const px = state.pointer.x;
    const py = state.pointer.y;
    const range = focus ? 0.035 : 0.09;
    const kl = 1 - Math.exp(-2.5 * delta);
    lookOffset.current.yaw += (px * range - lookOffset.current.yaw) * kl;
    lookOffset.current.pitch += (py * range * 0.6 - lookOffset.current.pitch) * kl;

    state.camera.position.copy(pos.current);
    lookTarget.current.copy(look.current);
    const dist = pos.current.distanceTo(look.current) || 1;
    lookTarget.current.x += Math.sin(lookOffset.current.yaw) * dist;
    lookTarget.current.y += Math.sin(lookOffset.current.pitch) * dist * 0.5;
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}
