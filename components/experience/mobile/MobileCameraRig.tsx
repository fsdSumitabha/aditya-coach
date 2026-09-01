"use client";

// ============================================================
// THE DOLLY, PHONE-SHAPED.
//
// A fork of components/experience/CameraRig.tsx. The desktop rig carries TWO
// key tables and blends between them by aspect, because one page has to serve
// a 16:10 laptop and a 9:19.5 phone. This page only ever renders into one
// shape — the 0.75-to-1.0 canvas band described in mobile-layout.ts — so
// there is a single table, no blend, and a fixed fov.
//
// Losing the blend is what makes the framing here possible. KEYS_PORTRAIT has
// to stand 11 units off the stack and 12.8 off the programme row, because at
// aspect 0.46 that is genuinely how far back you must be to fit them. In the
// canvas band this route composes for they fit at 5.2 and 4.5.
// ============================================================

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "../store";
import { FACTS } from "../facts";
import { DESIGN_ASPECT, MOBILE_FOV, halfWidthAt } from "./mobile-layout";

function v(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

/**
 * [position, lookAt] with an explicit progress stop each, exactly as the
 * desktop table works: stops must be ascending, start at 0 and end at 1.
 *
 * Every entry carries the check it was derived from. Vertical framing does not
 * move between phones — halfHeight depends only on distance — so width is
 * usually the only thing that can clip, and halfWidth is 0.505 * distance at
 * the narrowest canvas this page has to serve. The closing truck is the one
 * exception: there the flagship card's height binds.
 */
const KEYS: { at: number; p: THREE.Vector3; t: THREE.Vector3 }[] = [
  // ARRIVAL — the seal, at z 0. Desktop opens 9 units back, which in a short
  // canvas band leaves the emblem swimming in the middle distance. The ring is
  // 2.3 across and needs halfWidth 1.30, so 2.6 units would clear it; 5.0
  // gives halfWidth 2.53 and puts the seal at about half the frame, with the
  // rest of the band as the air the mark is supposed to sit in.
  { at: 0, p: v(0, 1.75, 5.0), t: v(0, 1.7, 0) },

  // THE PROOF GALLERY, at z -16. The pair's outer edge is at 1.60 (see
  // PROOF_X_M), so the binding distance is 1.60 / 0.505 = 3.17. At 4.2 the
  // halfWidth is 2.12 — half a unit of margin either side at the narrowest
  // canvas any phone produces, and more on every other one.
  { at: 0.17, p: v(0, 1.75, -11.8), t: v(0, 1.72, -16) },

  // THE STACK, approached. Deliberately loose: 9 units out is halfWidth 4.55
  // against a 4.0-wide base, so the pyramid reads small and centred and the
  // visitor watches it assemble from a distance before the close shot.
  { at: 0.36, p: v(0, 2.3, -25.0), t: v(0, 1.4, -34) },

  // THE STACK, close. The base is 4.0 wide and needs halfWidth 2.0, so 3.96 is
  // the floor; 5.2 gives 2.63. Vertically halfHeight is 2.76 against a lookAt
  // of 1.35, so the frame runs y -1.41 to 4.11 and the 2.4-tall stack sits
  // well inside it.
  { at: 0.52, p: v(0, 2.3, -28.8), t: v(0, 1.35, -34) },

  // APPROACHING THE ROW from the left, so the truck below starts where the
  // camera already is rather than cutting to the first card.
  { at: 0.7, p: v(-2.6, 2.2, -45.0), t: v(-3.3, 1.8, -57) },

  // ── THE TRUCK. The three programme cards, one at a time. ──
  // These three hold z, y and pitch DEAD STILL and move only in x, so the row
  // slides past the frame instead of the camera swinging across it. A pan
  // would put the outer two cards at an angle you cannot read type on.
  //
  // 4.5 units out. HEIGHT is what binds here, not width, and it is the
  // tightest number in this file: the flagship is 4.0 tall standing on the
  // floor and the lookAt sits at 1.9, so halfHeight has to clear 2.10 — which
  // needs 3.95 units — and 4.5 gives 2.39, leaving 0.29 of headroom. Raise the
  // flagship or the lookAt and it clips. Width is comfortable by comparison:
  // halfWidth 2.27 against a card reaching 1.10.
  { at: 0.8, p: v(-3.3, 2.2, -52.5), t: v(-3.3, 1.9, -57) }, // Lifestyle
  { at: 0.9, p: v(0, 2.2, -52.5), t: v(0, 1.9, -57) }, // Complete Transformation
  { at: 1, p: v(3.3, 2.2, -52.5), t: v(3.3, 1.9, -57) }, // Personality & Presence
];

if (process.env.NODE_ENV !== "production") {
  for (let i = 1; i < KEYS.length; i++) {
    if (KEYS[i].at <= KEYS[i - 1].at) {
      throw new Error(`MobileCameraRig: stop ${i} is not after stop ${i - 1}`);
    }
  }
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function MobileCameraRig() {
  const pos = useRef(KEYS[0].p.clone());
  const look = useRef(KEYS[0].t.clone());
  const tmpP = useRef(new THREE.Vector3());
  const tmpT = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { progress, focus, calm } = useExperience.getState();

    // Fixed lens. The desktop rig ramps fov with aspect to claw back frame on
    // a phone; the band is already composed for, so a moving lens would only
    // breathe the framing every time the address bar collapses.
    const cam = state.camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - MOBILE_FOV) > 0.05) {
      cam.fov = MOBILE_FOV;
      cam.updateProjectionMatrix();
    }

    if (focus && FACTS[focus]) {
      // Fact close-ups are still framed for a widescreen frustum, so back off
      // by the ratio between that and this band. Nothing sets `focus` today —
      // objects describe themselves on tap instead — but the desktop rig keeps
      // this branch and so does this one, so the two stay mergeable.
      const f = FACTS[focus];
      tmpP.current.set(...f.cam);
      tmpT.current.set(...f.look);
      tmpP.current
        .sub(tmpT.current)
        .multiplyScalar(1 + 0.45)
        .add(tmpT.current);
    } else {
      let i = KEYS.length - 2;
      for (let k = 0; k < KEYS.length - 1; k++) {
        if (progress < KEYS[k + 1].at) {
          i = k;
          break;
        }
      }
      const span = KEYS[i + 1].at - KEYS[i].at;
      const local = easeInOut(
        Math.min(1, Math.max(0, (progress - KEYS[i].at) / span)),
      );
      tmpP.current.lerpVectors(KEYS[i].p, KEYS[i + 1].p, local);
      tmpT.current.lerpVectors(KEYS[i].t, KEYS[i + 1].t, local);
    }

    // Same damping as the desktop rig — see the lambda note there. It is the
    // single biggest lever on how long the journey feels.
    const lambda = focus ? 2.4 : 4.6;
    const k = 1 - Math.exp(-lambda * delta);
    pos.current.lerp(tmpP.current, k);
    look.current.lerp(tmpT.current, k);

    state.camera.position.copy(pos.current);
    state.camera.lookAt(look.current);

    // NO POINTER LOOK-AROUND. The desktop rig drifts the camera with the
    // pointer, which on a touch screen means the scene lurches under the
    // finger that is trying to scroll it — and on the truck it would swing the
    // card being read off-centre. `calm` is read so the dependency on reduced
    // motion is explicit rather than accidental.
    void calm;
  });

  return null;
}

/** Exported for the dev overlay and for anyone re-deriving a stop. */
export const mobileFrameWidthAt = (d: number) => 2 * halfWidthAt(d, DESIGN_ASPECT);
