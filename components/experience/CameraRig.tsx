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

// [position, lookAt] keyframes with an EXPLICIT progress stop each.
//
// These used to be distributed evenly, which meant adding one key silently
// moved every other key — and every chapter window in facts.ts, the slab
// assembly window and the in-scene button windows are all tuned against those
// positions. With `at` written down, a new beat only has to claim a slice of
// progress nobody else is using. Stops must be ascending, start at 0 and end
// at 1; KEYS_PORTRAIT is the same length and shares them.
const KEYS: { at: number; p: THREE.Vector3; t: THREE.Vector3 }[] = [
  { at: 0, p: v(0, 1.7, 9), t: v(0, 1.5, 0) }, // arrival — the seal
  // THE GALLERY, PROMOTED. "The Man" used to own this beat, framing his own
  // diptych at z -16 from x 2.4. The proof gallery inherits the slot and the
  // z, and it brings its own framing with it: this is the old gallery key
  // (p 2.8, 1.9, -44.5 → t -0.6, 1.8, -52) translated forward by exactly 36,
  // so the 7.5-unit stand-off that fitted the wider proof panels is unchanged.
  { at: 1 / 6, p: v(2.8, 1.9, -8.5), t: v(-0.6, 1.8, -16) }, // sweep the proof gallery
  { at: 2 / 6, p: v(-3.0, 2.0, -22.0), t: v(0.6, 1.4, -34) }, // approach the foundation from the left
  // Front-on, and standing WELL back. This key used to sit at z -29.5, which
  // is 4.7 units off a stack that is 2.7 tall, 4 wide and 2.6 deep — the
  // pyramid filled ~75% of the frame height and the slabs flew in from x ±3.2
  // and y +11, entirely outside it. You could not watch the thing assemble.
  // At -26.2 the stack reads at ~45% of frame height with the whole approach
  // path visible around it.
  { at: 3 / 6, p: v(0, 2.5, -26.2), t: v(0, 1.35, -34) }, // front-on: the stack assembled
  // --- The final chapter is one arrival and one push-in. ---
  // Removing the man chapter took a whole beat out of the middle of this
  // table. Rather than leave the visitor scrolling a dark corridor from the
  // stack to a decision still parked at z -70, the decision came forward to
  // -52 — and these three keys are the old ones translated by the same +18,
  // so every framing number below still holds exactly.
  //
  // The run from the stack to the offers is now ONE move over 0.212 of
  // progress (it used to be a slow leg to the gallery plus a deliberately
  // fast 0.045 dash to the gateway). Same easing, no dash.
  { at: 0.712, p: v(-2.6, 2.0, -39.0), t: v(0.3, 1.4, -52) }, // approach the offers
  { at: 0.8, p: v(0, 2.4, -48.0), t: v(0, 1.85, -57) }, // all three, in frame
  // 6.5 units out: half-width 4.44 against cards reaching ±2.80, and half-height
  // 2.50 against a flagship 4.0 tall aimed at 1.9 — the vertical is the binding
  // one here, with 0.40 of headroom over the top of the tallest card.
  { at: 1, p: v(0, 2.2, -50.5), t: v(0, 1.9, -57) }, // closer — the cards readable
];

// Portrait art direction: phones lose ~60% of the horizontal frustum, so the
// widescreen path's lateral sweeps frame empty space and crop the subjects
// (slabs 4 units wide, programmes spread ±1.9). These keys go head-on and pull
// back so each chapter's full composition fits upright.
// Same length as KEYS, and it borrows KEYS' progress stops.
const KEYS_PORTRAIT: { p: THREE.Vector3; t: THREE.Vector3 }[] = [
  { p: v(0, 1.7, 10.5), t: v(0, 1.6, 0) }, // arrival — seal recentres via chapters.tsx
  // THE GALLERY COMES IN from 11 units to 6.95, which is the whole of what
  // makes the photographs bigger on a phone. It is not a free choice: the pair
  // has to fit ACROSS, and at the narrowest common phone (aspect 0.44) the
  // half-width here is 1.63 against a pair reaching 1.52 — 0.11 of margin, and
  // more on every wider screen. Move this key any closer and the frames clip
  // the edges; it only moved at all because PROOF_X_PORTRAIT in chapters.tsx
  // pulled the pair in from ±1.78 to ±0.78 on the same blend curve. The two
  // numbers are one decision and have to move together.
  { p: v(0, 1.8, -9.05), t: v(0, 1.7, -16) }, // proof gallery, both frames visible
  { p: v(0, 2.0, -20.5), t: v(0, 1.2, -34) }, // foundation approach, centred
  // Same pull-back as the landscape key. At -25.0 the visible half-width was
  // 2.2 against a bottom slab that reaches ±2.0 — the base was touching both
  // edges of a phone screen. -23.0 gives 2.7 and room to watch it build.
  { p: v(0, 2.9, -23.0), t: v(0, 1.6, -34) }, // the stack — full pyramid in frame
  // Arrival and push-in. PINNED BY ARITHMETIC, NOT TASTE, and this is the one
  // beat in the journey where a phone has almost no room to move.
  //
  // The three cards span x ±2.80 and the frame's half-width is
  // distance * tan(28°) * aspect, so the closest the camera can stop without
  // an outer card running off the screen is 2.80 / (0.5317 * aspect):
  //
  //     aspect 0.45  ->  11.70      aspect 0.50  ->  10.53
  //     aspect 0.46  ->  11.45      aspect 0.53  ->   9.94
  //
  // 12.0 IS THE FLOOR FOR SHOWING ALL THREE WHOLE, and the first of these two
  // stops holds it: at 13.0 the row still has margin on the narrowest phone,
  // so the visitor meets the three complete before anything moves. That beat
  // is the whole reason the crop below is affordable.
  //
  // THE FINAL STOP DELIBERATELY CROPS THE OUTER TWO. Going closer than 12.0
  // cannot be done any other way — see the note below on why the row is
  // width-locked — so the last beat pushes in to 9.2 and lets the frame cut
  // the two flanking cards at the edges. That reads as a row continuing past
  // the screen, which is what it is, and it puts Complete Transformation
  // alone in the middle: the premium tier, framed as the premium tier.
  //
  //     distance   flagship on screen   outer cards visible   (aspect 0.47)
  //       12.0            35%                  100%
  //        9.2            46%                   71%
  //
  // 9.2 is chosen so the flanking cards keep roughly two thirds of their width
  // on the narrowest phone (62% at aspect 0.44) and closer to nine tenths on a
  // short one (88% at 0.53). Push past about 8.6 and they start reading as
  // slivers rather than as cards. The flagship also goes from 31% to 41% of
  // the frame HEIGHT, which is most of what makes the shot feel closer.
  //
  // WHY CROPPING IS THE ONLY WAY IN. A card's share of the screen is
  // cardWidth / (2 * frameHalfWidth), and frameHalfWidth is set by the row.
  // Scale every card by k and the row widens by k and the camera has to
  // retreat by k — the card ends up exactly the same size. Same trap as the
  // proof panels (see PROOF_X_PORTRAIT). Three abreast in a portrait frame is
  // a fixed fraction of the width; only showing fewer of them at once changes
  // it, which is exactly what the crop does.
  //
  // The tall empty band above and below the row is the same fact seen from the
  // side, and cannot be tuned away either: fitting ±2.80 across a 0.46 aspect
  // forces a half-height of 6.09 whatever the lens does, because half-height
  // is half-width over aspect. Only rearranging the row would change it.
  { p: v(0, 1.9, -37.0), t: v(0, 1.4, -52) }, // approach the offers
  { p: v(0, 2.6, -44.0), t: v(0, 1.9, -57) }, // all three, in frame
  { p: v(0, 2.4, -47.8), t: v(0, 1.9, -57) }, // in on the flagship, outer two cropped
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
      // Walk the explicit stops rather than assuming even spacing. Seven keys
      // over a seven-entry table is a handful of comparisons per frame.
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
      if (pf > 0) {
        tmpP2.current.lerpVectors(KEYS_PORTRAIT[i].p, KEYS_PORTRAIT[i + 1].p, local);
        tmpT2.current.lerpVectors(KEYS_PORTRAIT[i].t, KEYS_PORTRAIT[i + 1].t, local);
        tmpP.current.lerp(tmpP2.current, pf);
        tmpT.current.lerp(tmpT2.current, pf);
      }
    }

    // -- 2. damp toward it (slower while focusing for a cinematic settle) --
    //
    // THE DOLLY LAMBDA IS THE SINGLE BIGGEST LEVER ON HOW LONG THE JOURNEY
    // FEELS, and it is why shortening the stops alone did not fix it. An
    // exponential damper trails a moving target by about velocity/lambda, so
    // at 3.2 the camera was still finishing a move roughly a third of a screen
    // after the scroll that caused it had stopped — which reads as "I have to
    // keep scrolling", not as "the camera is easing". At 4.6 it arrives with
    // the scroll and still eases rather than snapping.
    // Lower it back toward 3.2 if the movement starts to feel mechanical; this
    // one number affects every chapter, not just the last two.
    const lambda = focus ? 2.4 : 4.6;
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
