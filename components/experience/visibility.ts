"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Per-chapter animation gate.
 *
 * The journey is 52 units deep, but the scene's fog closes at 30 units
 * (Scene.tsx) and the camera only ever looks down -z — every CameraRig lookAt
 * key sits further back than its position key, so nothing is ever framed
 * behind the camera. A chapter that is behind the visitor, or past the fog,
 * therefore cannot be seen, so animating it is pure waste.
 *
 * Before this gate every chapter ran its useFrame work every frame
 * regardless of position — standing at the arrival seal, the decision cards
 * 52 units away were still damping their hover lift and their hotspots were
 * still pulsing.
 *
 * This gates ANIMATION ONLY, never rendering. Setting a chapter group's
 * `visible` to false would also switch off its local pointLight, and those
 * lights reach further than the chapter does: Decision's sits 2.8 units
 * forward with distance 12, so it still lights floor ~3 units IN FRONT of the
 * camera at the moment this gate closes. Hiding the group would pop that
 * patch of floor dark. Frustum culling already skips geometry behind the
 * visitor, and drawing a fogged-out chapter is cheap — the per-frame
 * JavaScript is what actually cost something.
 */

const BEHIND = -6; // chapter groups are a few units deep — don't cut early
const FOGGED = 34; // fog far (30) plus margin

/** Positive distance = the chapter is ahead of the camera. */
export function inView(camZ: number, chapterZ: number) {
  const d = camZ - chapterZ;
  return d >= BEHIND && d <= FOGGED;
}

/**
 * Ref carrying the enclosing chapter's live gate. Children read it inside
 * their own useFrame to skip work without re-rendering.
 */
export const ChapterAlive = createContext<MutableRefObject<boolean> | null>(
  null,
);

export function useChapterAlive() {
  return useContext(ChapterAlive);
}

/**
 * Drives one chapter's gate. `alive` is read inside useFrame (never triggers a
 * render); `visible` drives the group's render flag and flips only a handful
 * of times across the whole journey, so the re-render cost is negligible.
 */
export function useChapterVisibility(chapterZ: number) {
  const alive = useRef(true);
  const [visible, setVisible] = useState(true);

  useFrame((state) => {
    const v = inView(state.camera.position.z, chapterZ);
    if (v !== alive.current) {
      alive.current = v;
      setVisible(v);
    }
  });

  return { alive, visible };
}
