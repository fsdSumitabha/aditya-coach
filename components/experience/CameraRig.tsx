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
  { p: v(-3.0, 2.0, -22.0), t: v(0.6, 1.4, -34) }, // approach the foundation from the left
  // Front-on, and standing WELL back. This key used to sit at z -29.5, which
  // is 4.7 units off a stack that is 2.7 tall, 4 wide and 2.6 deep — the
  // pyramid filled ~75% of the frame height and the slabs flew in from x ±3.2
  // and y +11, entirely outside it. You could not watch the thing assemble.
  // At -26.2 the stack reads at ~45% of frame height with the whole approach
  // path visible around it.
  { p: v(0, 2.5, -26.2), t: v(0, 1.35, -34) }, // front-on: the stack assembled
  { p: v(2.8, 1.9, -44.5), t: v(-0.6, 1.8, -52) }, // sweep the proof gallery
  { p: v(-2.6, 2.0, -57.0), t: v(0.3, 1.4, -70) }, // approach the offers
  // The decision, front and centre. The final scene is now TWO levels in
  // depth — the audit gateway at z -68.4 and the three programs behind it at
  // -71.4 — so this key stands back far enough for both to be in one frame
  // and for the flagship column to be seen clearing the gate.
  { p: v(0, 1.95, -62.0), t: v(0, 1.25, -70) },
];

// Portrait art direction: phones lose ~60% of the horizontal frustum, so the
// widescreen path's lateral sweeps frame empty space and crop the subjects
// (figures at x ±1.7, slabs 4 units wide, stelae spread ±3.4). These keys go
// head-on and pull back so each chapter's full composition fits upright.
const KEYS_PORTRAIT: { p: THREE.Vector3; t: THREE.Vector3 }[] = [
  { p: v(0, 1.7, 10.5), t: v(0, 1.6, 0) }, // arrival — seal recentres via chapters.tsx
  { p: v(0, 1.6, -6.5), t: v(0, 1.3, -16) }, // both figures, straight on
  { p: v(0, 2.0, -20.5), t: v(0, 1.2, -34) }, // foundation approach, centred
  // Same pull-back as the landscape key. At -25.0 the visible half-width was
  // 2.2 against a bottom slab that reaches ±2.0 — the base was touching both
  // edges of a phone screen. -23.0 gives 2.7 and room to watch it build.
  { p: v(0, 2.9, -23.0), t: v(0, 1.6, -34) }, // the stack — full pyramid in frame
  { p: v(0, 1.8, -41.0), t: v(0, 1.7, -52) }, // proof gallery, both frames visible
  { p: v(0, 1.9, -55.0), t: v(0, 1.4, -70) }, // approach the offers
  // Decision — the gateway centred, the three programs behind it. Two units
  // further back than the landscape key: the programs sit at x ±1.9 and a
  // phone's frustum only reaches ±2.74 at this depth.
  { p: v(0, 1.95, -60.0), t: v(0, 1.3, -70) },
];

/** 0 on landscape/desktop (path untouched), 1 on narrow portrait. */
function portraitBlend(aspect: number) {
  return THREE.MathUtils.clamp((1.05 - aspect) / 0.45, 0, 1);
}

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
  const tmpP2 = useRef(new THREE.Vector3());
  const tmpT2 = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { progress, focus, calm } = useExperience.getState();
    const aspect = state.size.width / state.size.height;
    const pf = portraitBlend(aspect);

    // widen the lens on portrait so pulled-back keys keep their subjects large
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetFov = 42 + pf * 14;
    if (Math.abs(cam.fov - targetFov) > 0.05) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }

    // -- 1. resolve the desired pose --
    if (focus && FACTS[focus]) {
      const f = FACTS[focus];
      tmpP.current.set(...f.cam);
      tmpT.current.set(...f.look);
      if (pf > 0) {
        // fact close-ups are framed for widescreen — dolly out on portrait
        tmpP.current.sub(tmpT.current).multiplyScalar(1 + 0.45 * pf).add(tmpT.current);
      }
    } else {
      const segs = KEYS.length - 1;
      const s = Math.min(progress * segs, segs - 1e-4);
      const i = Math.floor(s);
      const local = easeInOut(s - i);
      tmpP.current.lerpVectors(KEYS[i].p, KEYS[i + 1].p, local);
      tmpT.current.lerpVectors(KEYS[i].t, KEYS[i + 1].t, local);
      if (pf > 0) {
        tmpP2.current.lerpVectors(KEYS_PORTRAIT[i].p, KEYS_PORTRAIT[i + 1].p, local);
        tmpT2.current.lerpVectors(KEYS_PORTRAIT[i].t, KEYS_PORTRAIT[i + 1].t, local);
        tmpP.current.lerp(tmpP2.current, pf);
        tmpT.current.lerp(tmpT2.current, pf);
      }
    }

    // -- 2. damp toward it (slower while focusing for a cinematic settle) --
    const lambda = focus ? 2.4 : 3.2;
    const k = 1 - Math.exp(-lambda * delta);
    pos.current.lerp(tmpP.current, k);
    look.current.lerp(tmpT.current, k);

    // -- 3. pointer look-around (damped, bounded) --
    // Reduced motion: the camera stops drifting with the pointer. Scroll still
    // drives the dolly — that is the navigation itself, not decoration.
    const px = state.pointer.x;
    const py = state.pointer.y;
    const range = calm ? 0 : focus ? 0.035 : 0.09;
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
