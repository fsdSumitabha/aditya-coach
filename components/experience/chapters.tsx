"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  CHAPTERS,
  FACTS,
  OFFERS,
  REBUILD_STEPS,
  SCENE,
  type Offer,
} from "./facts";
import { useExperience } from "./store";
import { BTN_SCENE, EYEBROW, requestNavigate } from "./ui";
import { ChapterAlive, useChapterAlive, useChapterVisibility } from "./visibility";
import { CLIENT_SETS, glTexture } from "@/lib/transformations";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FRAUNCES = `${BASE}/fonts/fraunces-500.ttf`;
const INTER = `${BASE}/fonts/inter-500.ttf`;

const GOLD = "#c9a24b";
const GOLD_LIGHT = "#e8d9a8";
const STONE = "#131210";
const IVORY = "#f4f1ea";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------- shared: cheap blob shadow (radial gradient sprite) ---------- */

/**
 * ONE texture, geometry and material for every blob shadow in the scene.
 * useMemo is per component instance, so the previous version built and
 * uploaded ten identical 128×128 textures — one per shadow.
 */
let blobAssets: {
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
} | null = null;

function getBlobAssets() {
  if (blobAssets) return blobAssets;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  blobAssets = {
    geometry: new THREE.PlaneGeometry(1, 1),
    material: new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true,
      depthWrite: false,
    }),
  };
  return blobAssets;
}

function BlobShadow({
  position,
  scale = 2,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const { geometry, material } = getBlobAssets();
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
    />
  );
}

/* ---------- shared: in-scene button ---------- */

/**
 * A real, focusable DOM button anchored to a point in the scene — drei's
 * <Html> projects the anchor and pins the element there at a constant screen
 * size, so the label stays legible on a phone where 3D text at this distance
 * would render about eight pixels tall.
 *
 * It replaces the pulsing gold markers on the two chapters below: those made
 * you find a small sphere and guess that it was clickable, and then the click
 * did two unrelated things at once (moved the camera AND opened copy). Now the
 * objects themselves describe on hover, and one obvious button per chapter
 * goes to the page.
 *
 * Mounted across a window slightly wider than its shown range so the opacity
 * transition has something to animate between; `pointerEvents` stays off until
 * it is fully in.
 */
function SceneButton({
  position,
  label,
  href,
  range,
}: {
  position: [number, number, number];
  label: string;
  href: string;
  /**
   * Progress window in which the button is shown. It starts with the chapter
   * but must END BEFORE the dolly reaches the anchor's own z — the camera
   * flies straight through both of these chapters, and an anchor at or behind
   * the near plane swings across the screen before drei hides it.
   */
  range: readonly [number, number];
}) {
  // Primitive selectors: zustand only re-renders when the boolean flips, so
  // this does NOT re-render on every damped progress write.
  const mounted = useExperience(
    (s) => s.progress > range[0] - 0.05 && s.progress < range[1] + 0.05,
  );
  const shown = useExperience(
    (s) => s.progress > range[0] && s.progress < range[1],
  );
  if (!mounted) return null;

  return (
    <Html
      position={position}
      center
      pointerEvents="none"
      zIndexRange={[8, 0]}
      style={{
        opacity: shown ? 1 : 0,
        transition: "opacity 420ms ease",
      }}
    >
      <button
        type="button"
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
        onClick={() => requestNavigate(href)}
        className={BTN_SCENE}
        style={{ pointerEvents: shown ? "auto" : "none" }}
      >
        {label}
      </button>
    </Html>
  );
}

/** Labels and destinations come from FACTS so the 3D scene, the fact cards and
 *  the server-rendered fallback can never drift apart. */
const METHOD_CTA =
  FACTS["order-1"].cta ?? { label: "See the full method →", href: "/method" };
// The proof gallery's button is deliberately NOT per-client. It used to carry
// the current set's own slug, which meant its destination changed under the
// cursor every second — and a link whose target moves while you are deciding
// whether to press it is a bad link however well it is labelled. One fixed
// door into /results; the individual stories are all reachable from there.
const PROOF_CTA =
  FACTS["proof-client"].cta ?? { label: "See all transformations →", href: "/results" };

/* ---------- shared: pointer-to-describe ---------- */

/**
 * Props that make an object read its own fact out on hover. Touch never fires
 * a hover, so a tap toggles the same state.
 */
function describes(id: string) {
  const set = (next: string | null) => useExperience.getState().setHover(next);
  return {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      set(id);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      if (useExperience.getState().hover === id) set(null);
      document.body.style.cursor = "";
    },
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      set(useExperience.getState().hover === id ? null : id);
    },
  };
}

/* ---------- shared: the transformation portraits ---------- */

// Pre-baked to exactly the size the texture needs — see
// scripts/build-gl-textures.mjs, which must be re-run whenever either source
// photo is replaced. This used to go through /_next/image?w=750, which made
// the first visitor wait on the server resizing a 10-megapixel JPEG and tied
// the 3D scene to the image optimizer being reachable. 4.1MB of sources
// became 309KB of static files.
//
// It also fixes a dead reference: the old BEFORE path ended in .jpg, but the
// file in public/ is .png — the request 404'd and the gallery silently showed
// the silhouette placeholder instead of the real photo.
/** The baked crop is 768×1001 — every panel that shows a portrait must use
 *  this aspect or the photo letterboxes inside its frame. */
const PORTRAIT_ASPECT = 1.32 / 1.72;

/* ---------- shared: file → texture ---------- */

/**
 * Cached by src, and cached at the MODULE level rather than per component: the
 * proof gallery cycles four sets across two panels, so the same file is asked
 * for again every few seconds and must not decode or upload twice. In-flight
 * loads are cached too, or a preload racing a panel's own request would fetch
 * and upload the same photograph twice.
 *
 * Never disposed. These live exactly as long as the canvas does, and surviving
 * a Fast Refresh remount saves re-decoding all of them.
 */
const imageTextures = new Map<string, THREE.Texture>();
const imageLoads = new Map<string, Promise<THREE.Texture>>();

function loadTexture(
  src: string,
  gl: THREE.WebGLRenderer,
  anisotropy: number,
): Promise<THREE.Texture> {
  const hit = imageTextures.get(src);
  if (hit) return Promise.resolve(hit);
  let pending = imageLoads.get(src);
  if (!pending) {
    pending = new Promise<THREE.Texture>((resolve, reject) => {
      new THREE.TextureLoader().load(src, resolve, undefined, reject);
    }).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      // panels sit at up to ±0.32rad — without this the grazing angle smears
      if (anisotropy) {
        t.anisotropy = Math.min(anisotropy, gl.capabilities.getMaxAnisotropy());
      }
      imageTextures.set(src, t);
      return t;
    });
    imageLoads.set(src, pending);
  }
  return pending;
}

/** Returns null until the file has decoded — callers render their mount board
 *  in the meantime rather than a black panel. */
function useImageTexture(src: string, anisotropy = 0) {
  const gl = useThree((s) => s.gl);
  const [tex, setTex] = useState<THREE.Texture | null>(
    () => imageTextures.get(src) ?? null,
  );

  // Render-phase adjustment: a proof panel's src changes every time the set
  // flips, so the initial value is NOT the whole story — swap to whatever that
  // file already has instead of holding the previous man's photograph.
  const [shown, setShown] = useState(src);
  if (shown !== src) {
    setShown(src);
    setTex(imageTextures.get(src) ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    loadTexture(src, gl, anisotropy)
      .then((t) => {
        if (!cancelled) setTex(t);
      })
      .catch(() => {
        /* a missing bake leaves the mount board showing, never a black hole */
      });
    return () => {
      cancelled = true;
    };
  }, [src, anisotropy, gl]);

  return tex;
}

/* ================= CHAPTER 0 — ARRIVAL: the gold seal ================= */

const AKU_MARK = `${BASE}/logo/aku-mark.png`;
const MARK_ASPECT = 480 / 157; // the shipped wordmark's own proportions
const EMBLEM_R = 0.6; // clears the inner ring (r 0.86) with room to spare
const EMBLEM_T = 0.09; // struck thickness
const MARK_W = 0.86;

/**
 * The centrepiece inside the two turning rings: a struck gold medallion
 * carrying the AKU wordmark, replacing the abstract brilliant-cut diamond that
 * used to sit here. It is his mark, not a gem.
 *
 * Built as a rim + two faces rather than a capped cylinder because the caps'
 * generated UVs mirror each other — the wordmark would have read backwards on
 * one side of a spin. Each face is its own group turned 180°, so the mark is
 * the right way round from either side. ~200 triangles.
 */
function AkuEmblem() {
  const mark = useImageTexture(AKU_MARK);

  return (
    <>
      {/* milled rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[EMBLEM_R, EMBLEM_R, EMBLEM_T, 48, 1, true]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.24} />
      </mesh>

      {[1, -1].map((s) => (
        <group key={s} rotation={[0, s > 0 ? 0 : Math.PI, 0]}>
          {/* struck face — dark, so the gold wordmark reads against it */}
          <mesh position={[0, 0, EMBLEM_T / 2]}>
            <circleGeometry args={[EMBLEM_R, 48]} />
            <meshStandardMaterial color="#171308" metalness={0.85} roughness={0.36} />
          </mesh>
          {/* inner bevel line */}
          <mesh position={[0, 0, EMBLEM_T / 2 + 0.002]}>
            <ringGeometry args={[EMBLEM_R - 0.075, EMBLEM_R - 0.055, 48]} />
            <meshStandardMaterial
              color={GOLD_LIGHT}
              metalness={1}
              roughness={0.2}
              emissive={GOLD}
              emissiveIntensity={0.3}
            />
          </mesh>
          {mark && (
            <mesh position={[0, 0, EMBLEM_T / 2 + 0.006]}>
              <planeGeometry args={[MARK_W, MARK_W / MARK_ASPECT]} />
              <meshBasicMaterial map={mark} transparent depthWrite={false} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

export function Arrival() {
  const outer = useRef<THREE.Mesh>(null);
  const mid = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Group>(null);
  // landscape: seal lives right-of-frame so the headline owns the left;
  // portrait: seal centered high above the bottom text block
  const { size } = useThree();
  const landscape = size.width > size.height;
  const sealX = landscape ? 2.35 : 0;
  const sealY = landscape ? 1.55 : 2.6;
  const { alive, visible } = useChapterVisibility(0);
  const calm = useExperience((s) => s.calm);

  useFrame((state, delta) => {
    if (!alive.current) return;
    // Reduced motion: the seal holds its pose instead of turning forever.
    if (useExperience.getState().calm) return;
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.x = t * 0.22;
      outer.current.rotation.y = t * 0.15;
    }
    if (mid.current) {
      mid.current.rotation.x = -t * 0.3;
      mid.current.rotation.z = t * 0.19;
    }
    if (inner.current) {
      inner.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[sealX, sealY, 0]}>
      {/* 12×96 segments on a 0.028-thick ring was ~2,300 triangles of
          tessellation nobody can resolve; 8×64 is visually identical. */}
      <Float
        speed={1.4}
        rotationIntensity={0.15}
        floatIntensity={0.5}
        enabled={visible && !calm}
      >
        <mesh ref={outer}>
          <torusGeometry args={[1.15, 0.028, 8, 64]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
        </mesh>
        <mesh ref={mid} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
          <torusGeometry args={[0.86, 0.022, 8, 64]} />
          <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.18} />
        </mesh>
        {/* the centrepiece: his own mark, struck in gold */}
        <group ref={inner}>
          <AkuEmblem />
        </group>
      </Float>
      <BlobShadow position={[0, -1.53, 0]} scale={3.2} />
      <pointLight position={[0, 0.4, 1.6]} intensity={6} color={GOLD_LIGHT} distance={7} />
    </group>
  );
}

/* ============ shared: the framed photograph ============ */

// "The Man" — Aditya's own before/after diptych — used to stand here at
// z -16 and was removed on 31 Aug 2026 (his call): the homepage opens on
// client proof, and his own story is told in full on /about. What survives is
// the panel geometry it introduced, which the proof gallery and the three
// programme columns all still draw with.

/** Panel size is set by the PORTRAIT frustum, the tight case. The panels
 *  themselves are the same on every screen — what changes is how far apart
 *  they stand and how close the camera gets; see PROOF_X_PORTRAIT below for
 *  why scaling the panel instead would have achieved nothing. Half-panel,
 *  mat, hairline and bracket come to 0.737 either side of centre, which is the
 *  number every framing check in this chapter and in CameraRig is written
 *  against. */
const PANEL_W = 1.24;
const PANEL_H = PANEL_W / PORTRAIT_ASPECT; // 1.616 — matches the baked crop
const MAT = 0.05; // breathing room between the photo edge and the hairline
const LINE = 0.014; // hairline thickness — ~2px at the chapter's camera distance
const TICK = 0.22; // corner bracket arm
const TICK_OUT = 0.06; // how far the brackets sit outside the hairline

/**
 * A hairline rectangle — optionally with four corner brackets — merged into
 * ONE ShapeGeometry, so a whole frame is a single draw call of 8 or 24
 * triangles rather than four or twelve meshes. Cached by size, and used by
 * every framed object in the journey: the proof gallery and the three
 * programme columns.
 */
function rect(cx: number, cy: number, w: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(cx - w / 2, cy - h / 2);
  s.lineTo(cx + w / 2, cy - h / 2);
  s.lineTo(cx + w / 2, cy + h / 2);
  s.lineTo(cx - w / 2, cy + h / 2);
  s.closePath();
  return s;
}

const outlineCache = new Map<string, THREE.ShapeGeometry>();

function getOutline(w: number, h: number, brackets = false) {
  const key = `${w}|${h}|${brackets}`;
  const hit = outlineCache.get(key);
  if (hit) return hit;
  const rx = w / 2;
  const ry = h / 2;
  const shapes = [
    rect(0, ry, w + LINE, LINE), // top
    rect(0, -ry, w + LINE, LINE), // bottom
    rect(-rx, 0, LINE, h + LINE), // left
    rect(rx, 0, LINE, h + LINE), // right
  ];
  if (brackets) {
    const bx = rx + TICK_OUT;
    const by = ry + TICK_OUT;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        shapes.push(rect(sx * (bx - TICK / 2), sy * by, TICK, LINE));
        shapes.push(rect(sx * bx, sy * (by - TICK / 2), LINE, TICK));
      }
    }
  }
  const g = new THREE.ShapeGeometry(shapes);
  outlineCache.set(key, g);
  return g;
}

/** The photo frame: the panel plus its mat, with brackets. */
const getFrameGeometry = () =>
  getOutline(PANEL_W + MAT * 2, PANEL_H + MAT * 2, true);

/** One unlit material per frame colour, shared across every framed object. */
const frameMaterials = new Map<string, THREE.MeshBasicMaterial>();

function getFrameMaterial(color: string) {
  let m = frameMaterials.get(color);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color });
    frameMaterials.set(color, m);
  }
  return m;
}

/* ========= CHAPTER 1 — THE PROOF: the client gallery ========= */

// Two hung frames that step through the FOUR client transformations, the same
// four /results shows — the sets come from lib/transformations.ts so the two
// surfaces can never disagree about who is in a frame or where his story is.
//
// A SET IS ATOMIC. Both frames always carry the same man: they take one index
// between them and there is deliberately no way to give the panels separate
// ones, because pairing client A's before with client B's after would be a
// fabricated result.
//
// ⚠️  CONSENT  ⚠️  client-01 / client-02 are cleared (29 Jul 2026).
// client-03 / client-04 photographs came from the owner 12 Aug 2026 and their
// WRITTEN consent is [review] not yet recorded — the same status they already
// carry on /results. Confirm before launch.
//
// The museum box frame that used to stand here (a 1.5×1.9×0.07 slab behind
// every photo plus a solid gold lip) is gone; these use the same single-draw
// hairline frame as chapter 1.

const PROOF_X = 1.78; // landscape: outer edge 2.52 vs the 3.02 the frame holds
const PROOF_Y = 1.8;
const PROOF_TOE = 0.28; // the gallery opens a little wider than the diptych

/**
 * THE PAIR CLOSES UP ON A PHONE, and this is the only lever that makes the
 * photographs bigger.
 *
 * A portrait frame is about aspect 0.45. Two panels side by side make a group
 * of aspect 2.9. Fitting one inside the other is decided ENTIRELY by width:
 * the camera has to stand far enough back that PROOF_X + 0.737 fits inside the
 * half-width, and at PROOF_X 1.78 that is 11 units — where each photograph is
 * about a quarter of the screen and the frame is nine tenths empty sky. That
 * emptiness and the small photographs are the same fact.
 *
 * SCALING THE PANELS WOULD NOT HAVE HELPED. Multiply the panel by k and the
 * pair widens by k, so the camera has to retreat by k, and the photograph ends
 * up exactly the same size on screen. The on-screen fraction is
 * panelWidth / (2 * (PROOF_X + 0.737)) whatever the panel measures — so the
 * only way to make it bigger is to make PROOF_X smaller. At 0.78 the pair is
 * a diptych with a hairline gap rather than two pictures across a room, the
 * camera comes in from 11 units to 6.95, and each photograph goes from ~27%
 * of the screen width to ~43%. Roughly two and a half times the area.
 *
 * The floor is 0.663 — half a panel with the toe-in foreshortening — where the
 * two boards touch. 0.78 leaves 0.23 of gap, about 29px on a 390px screen:
 * enough to read as two frames, which the before/after depends on.
 *
 * Ramped, not switched, and against the SAME curve CameraRig blends its two
 * key tables with, so the spread and the stand-off can never disagree. At
 * aspect 1.05 and above this is 1.78 and the desktop shot is untouched.
 */
const PROOF_X_PORTRAIT = 0.78;

/** The camera's own ramp, duplicated from CameraRig's portraitBlend so the
 *  scene and the dolly move together. 0 on landscape, 1 on a phone. */
const portraitAmount = (aspect: number) =>
  THREE.MathUtils.clamp((1.05 - aspect) / 0.45, 0, 1);

/** How long each man holds the frames. */
const FLIP_MS = 1000;
/** Crossfade between sets — long enough not to blink, short at this cadence. */
const FADE_MS = 260;

const proofSrc = (setIndex: number, side: "before" | "after") =>
  `${BASE}${glTexture(CLIENT_SETS[setIndex][side]) ?? ""}`;

/**
 * One frame. Two stacked quads: the outgoing man at full opacity underneath,
 * the incoming one fading in over him, so the pair never blinks to black
 * between sets. Opacity is written straight to the material each frame from
 * the shared fade ref — a React state write at 60fps for a crossfade would
 * re-render the chapter on every frame.
 */
function ProofPanel({
  side,
  cur,
  prev,
  fade,
  floating,
}: {
  side: "before" | "after";
  cur: number;
  prev: number;
  fade: MutableRefObject<number>;
  floating: boolean;
}) {
  const after = side === "after";
  // Same ramp the camera uses, so the pair closes exactly as the dolly closes.
  const portrait = useThree((st) =>
    portraitAmount(st.size.width / st.size.height),
  );
  const spread = THREE.MathUtils.lerp(PROOF_X, PROOF_X_PORTRAIT, portrait);
  const front = useImageTexture(proofSrc(cur, side), 8);
  const back = useImageTexture(proofSrc(prev, side), 8);
  const frontMat = useRef<THREE.MeshBasicMaterial>(null);
  const calm = useExperience((s) => s.calm);
  const sign = after ? 1 : -1;

  useFrame(() => {
    if (frontMat.current) frontMat.current.opacity = fade.current;
  });

  return (
    <group position={[sign * spread, 0, 0]}>
      <Float
        speed={1.1}
        rotationIntensity={0.06}
        floatIntensity={0.35}
        enabled={floating && !calm}
      >
        <group position={[0, PROOF_Y, 0]} rotation={[0, -sign * PROOF_TOE, 0]}>
          {/* mount board — also what shows while a photograph is still decoding */}
          <mesh position={[0, 0, -0.006]}>
            <planeGeometry args={[PANEL_W + MAT * 2 + LINE, PANEL_H + MAT * 2 + LINE]} />
            <meshBasicMaterial color="#12100d" />
          </mesh>
          {back && (
            <mesh>
              <planeGeometry args={[PANEL_W, PANEL_H]} />
              <meshBasicMaterial map={back} />
            </mesh>
          )}
          {front && (
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[PANEL_W, PANEL_H]} />
              <meshBasicMaterial
                ref={frontMat}
                map={front}
                transparent
                depthWrite={false}
              />
            </mesh>
          )}
          <mesh
            geometry={getFrameGeometry()}
            material={getFrameMaterial(after ? GOLD : "#4d483f")}
            position={[0, 0, 0.004]}
          />
          <Text
            font={INTER}
            fontSize={0.095}
            letterSpacing={0.26}
            color={after ? GOLD : "#8a847a"}
            position={[0, -(PANEL_H / 2 + MAT + 0.19), 0.01]}
            anchorX="center"
          >
            {after ? SCENE.after : SCENE.before}
          </Text>
        </group>
      </Float>
      <BlobShadow position={[0, 0.012, 0]} scale={2.6} />
    </group>
  );
}

export function Proof() {
  // MOVED from z -52 to z -16 on 31 Aug 2026: the gallery is now the first
  // thing past the seal, in the slot "The Man" used to hold.
  const { alive, visible } = useChapterVisibility(-16);
  const gl = useThree((s) => s.gl);
  // A boolean, so this re-renders on the orientation flip and not on resize.
  const portrait = useThree((s) => s.size.width <= s.size.height);
  const [pair, setPair] = useState({ cur: 0, prev: 0 });
  const fade = useRef(1);
  const clock = useRef(0);
  // Hovering or focusing the button stops the cycle. At a one-second cadence
  // the destination would otherwise change under a reader's cursor between the
  // moment he decides to click and the moment he does.
  const held = useRef(false);

  // Closes before the dolly reaches z -16 and flies through these frames. With
  // the gallery in the first slot that crossing is at ≈0.256 (camera key 1 sits
  // at z -8.5 on progress 1/6, key 2 at z -22 on 2/6), so the button goes out
  // at 0.234 — the same 0.022 of lead it had in the old slot. CHAPTERS[1] is
  // this chapter now; it used to be CHAPTERS[3].
  const shown = useExperience(
    (s) => s.progress > CHAPTERS[1].range[0] && s.progress < 0.234,
  );
  const mounted = useExperience(
    (s) => s.progress > CHAPTERS[1].range[0] - 0.05 && s.progress < 0.27,
  );

  // Eight photographs, warmed as soon as the gallery is within range. In its
  // old fourth slot that bought a deliberate delay — it sat two thirds of the
  // way down the journey, so ~350KB stayed off the homepage's first seconds.
  // From the first slot the fetch starts at canvas boot instead, and it has to:
  // the frames are on screen by progress 0.15, roughly three quarters of a
  // screen of scrolling in. The cost lands after the canvas has already
  // mounted, so it competes with the scene warming up, not with first paint.
  useEffect(() => {
    if (!visible) return;
    for (let i = 0; i < CLIENT_SETS.length; i++) {
      loadTexture(proofSrc(i, "before"), gl, 8).catch(() => {});
      loadTexture(proofSrc(i, "after"), gl, 8).catch(() => {});
    }
  }, [visible, gl]);

  // The crossfade is armed HERE, after the commit that actually puts the new
  // man in the frame — not inside the useFrame that schedules him. React does
  // not commit synchronously from a rAF callback, so zeroing the fade at
  // schedule time can catch a frame that is still holding the previous pair
  // and flash the man from two sets ago.
  useLayoutEffect(() => {
    fade.current = 0;
  }, [pair]);

  useFrame((_, delta) => {
    if (!alive.current) return;
    if (fade.current < 1) {
      fade.current = Math.min(1, fade.current + (delta * 1000) / FADE_MS);
    }
    // Reduced motion holds the first man on the wall; the gallery is proof,
    // not a slideshow, and every set is reachable in full on /results.
    if (useExperience.getState().calm || held.current) return;
    // DO NOT START CYCLING BEFORE THE VISITOR IS NEAR. The chapter gate is a
    // distance test against the 34-unit fog, and from the first slot at z -16
    // that is already true while the camera is still parked on the seal at
    // z +9 — so the cycle would run, and re-render this subtree once a second,
    // through the whole arrival scene, and the visitor would arrive at the
    // gallery mid-rotation on an arbitrary set rather than on set 01. Same
    // threshold the Html gate mounts on.
    if (useExperience.getState().progress < CHAPTERS[1].range[0] - 0.05) return;
    clock.current += delta;
    if (clock.current * 1000 < FLIP_MS) return;
    clock.current = 0;
    setPair((p) => ({ cur: (p.cur + 1) % CLIENT_SETS.length, prev: p.cur }));
  });


  return (
    <ChapterAlive.Provider value={alive}>
      <group position={[0, 0, -16]}>
        <ProofPanel
          side="before"
          cur={pair.cur}
          prev={pair.prev}
          fade={fade}
          floating={visible}
        />
        <ProofPanel
          side="after"
          cur={pair.cur}
          prev={pair.prev}
          fade={fade}
          floating={visible}
        />
        <pointLight position={[0, 3.4, 2.2]} intensity={5} color={GOLD_LIGHT} distance={9} />

        {/* Who this is, and the one fixed way through to the stories. Out by
            0.234 — the dolly crosses this z at progress ≈ 0.256.

            IT MOVES ABOVE THE PAIR ON A PHONE. It sits in the gap between the
            frames on a wide screen, where the gap is 2.2 units across. Once
            PROOF_X_PORTRAIT closes that to 0.23 there is no gap to sit in — it
            would land straight on the photographs — so it goes to y 3.25,
            which clears the top of the frames at 2.66 by about a third of a
            unit and still sits well above the chapter copy at the foot of the
            screen. Below the pair was the other option and is worse: the copy
            block owns the bottom of a phone screen. */}
        {mounted && (
          <Html
            position={[0, portrait ? 3.25 : PROOF_Y, 0.3]}
            center
            pointerEvents="none"
            zIndexRange={[8, 0]}
            style={{ opacity: shown ? 1 : 0, transition: "opacity 420ms ease" }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {/* One fixed label, not the current set's own. These flip every
                  second, so a per-set eyebrow was a caption changing under a
                  reader mid-word — and "CLIENT 01" told him nothing anyway. */}
              <span className={EYEBROW}>{SCENE.proof}</span>
              <button
                type="button"
                tabIndex={shown ? 0 : -1}
                aria-hidden={!shown}
                onClick={() => requestNavigate(PROOF_CTA.href)}
                // The hold lives on the button itself, not on the wrapper: the
                // wrapper inherits pointer-events:none from <Html> so the gap
                // between the frames stays click-through to the canvas.
                onPointerEnter={() => {
                  held.current = true;
                }}
                onPointerLeave={() => {
                  held.current = false;
                }}
                onFocus={() => {
                  held.current = true;
                }}
                onBlur={() => {
                  held.current = false;
                }}
                className={BTN_SCENE}
                style={{ pointerEvents: shown ? "auto" : "none" }}
              >
                {PROOF_CTA.label}
              </button>
            </div>
          </Html>
        )}
      </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 2 — THE ORDER: the foundation assembles itself ====== */

// THE COMPLETE REBUILD (Aditya's framework, direction doc §6).
// Labels, numbers and the taper live in REBUILD_STEPS — facts.ts.
/**
 * THE "SEE THE FULL METHOD" BUTTON: WHERE IT SITS AND HOW LONG IT STAYS.
 *
 * A PHONE GETS A DIFFERENT ONE. The two paths are not a style choice — the
 * lens is genuinely different. Landscape runs at fov 42 (half-fov 21°),
 * portrait at 56 (half-fov 28°), so a phone has seven more degrees of frame
 * above the view axis to spend. That is the whole reason the phone numbers can
 * be this much bolder, and the reason the desktop ones cannot follow.
 *
 * WHAT LIMITS THIS. The dolly flies at the stack, and the button floats above
 * it, so as the camera closes the button climbs the frame and eventually goes
 * out over the TOP — long before the camera actually reaches it (that is not
 * until ≈0.62). Height and duration therefore trade against each other: every
 * unit higher is bought with a slightly earlier exit. Measured, at fov 56:
 *
 *     0.61 above the apex  ->  leaves frame at 0.612
 *     1.11                 ->  0.601
 *     1.61                 ->  0.589      <- the phone setting
 *     2.11                 ->  0.576
 *
 * So on a phone it stands 1.61 clear of the apex (2.6x the desktop gap) and
 * holds to 0.575, with about 5° of frame still to spare at the worst moment.
 * Desktop stays where it was: 0.61 clear, out at 0.55, and only 1.8° of spare
 * — it is the tighter of the two and has no room to be raised.
 *
 * Both RAMP on portraitAmount, the same curve CameraRig blends its two key
 * tables with, rather than switching on an orientation boolean. A boolean
 * would hand the full phone treatment to a nearly-square window that is still
 * flying most of the landscape path at close to the landscape lens, and clip
 * it. Ramped, the height and the window arrive exactly as the wide frame does.
 *
 * If either number is ever pushed further, re-check it against the LAST TWO
 * landscape KEYS in CameraRig — they are what sets the ceiling.
 */
const METHOD_BTN_Y = 3.25; // desktop: 0.61 above the finished apex at 2.64
const METHOD_BTN_Y_PORTRAIT = 4.25; // phone: 1.61 above it
const METHOD_BTN_WINDOW = [0.45, 0.55] as const;
const METHOD_BTN_WINDOW_PORTRAIT = [0.42, 0.575] as const; // 55% longer

const SLABS = REBUILD_STEPS;
const SLAB_H = 0.48;

// --- Face layout: the numeral sits in a left gutter, the label takes the rest.
//
// These used to be two fixed x positions, which only worked on the wide slabs.
// The stack tapers hard — PERFORMANCE is set on a 2.2-wide face and PRESENCE on
// a 1.6 — so at the top the numeral and the word ran straight into each other
// with no air between them. Deriving both from the room each face actually has
// keeps a guaranteed gap, and means a longer word in REBUILD_STEPS re-flows
// instead of colliding.
const NUM_SIZE = 0.16;
const LABEL_SIZE = 0.185; // design size; only ever shrinks from here
const LABEL_TRACK = 0.12; // letterSpacing, em
// Fraunces uppercase advance, measured off a render: ~0.75em. Worth keeping
// slightly generous — the clamp below is the only thing stopping a label
// running off the front of its slab, and it can only do that if this is not
// an under-estimate.
const ADV = 0.75;
const NUM_INSET = 0.22; // numeral's left margin on the face
const TEXT_GAP = 0.18; // the air between numeral and label
const FACE_EDGE = 0.14; // right margin

function faceLayout(w: number, label: string) {
  const numX = -w / 2 + NUM_INSET;
  const start = numX + 2 * NUM_SIZE * ADV + TEXT_GAP; // earliest the label may begin
  const room = w / 2 - FACE_EDGE - start;
  const per = ADV + LABEL_TRACK;
  const labelSize = Math.min(LABEL_SIZE, room / (label.length * per));
  const labelW = label.length * per * labelSize;
  // centre whatever is left over, so short words still sit near the middle
  return { numX, labelSize, labelX: start + Math.max(0, (room - labelW) / 2) };
}

function Slab({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const s = SLABS[index];
  const finalY = SLAB_H / 2 + index * (SLAB_H + 0.06);
  const face = faceLayout(s.w, s.label);
  const side = index % 2 === 0 ? 1 : -1;
  const alive = useChapterAlive();
  const described = useExperience((st) => st.hover === s.id);

  useFrame((_, delta) => {
    // The assembly window (progress 0.30–0.52) sits well inside the visible
    // band, so freezing the slabs when the stack is out of sight never cuts
    // the animation short — it only stops five dampers running for nothing.
    if (alive && !alive.current) return;
    const { progress } = useExperience.getState();
    // staggered assembly window scrubbed by the journey
    const a = 0.3 + index * 0.032;
    const k = smooth(a, a + 0.09, progress);
    if (!group.current) return;
    const targetY = finalY + (1 - k) * (5.5 + index * 1.6);
    const targetX = (1 - k) * side * 3.2;
    const targetR = (1 - k) * side * 0.7;
    const damp = 1 - Math.exp(-6 * delta);
    group.current.position.y += (targetY - group.current.position.y) * damp;
    group.current.position.x += (targetX - group.current.position.x) * damp;
    group.current.rotation.y += (targetR - group.current.rotation.y) * damp;
  });

  return (
    <group ref={group} position={[0, finalY + 6, 0]} {...describes(s.id)}>
      <mesh>
        <boxGeometry args={[s.w, SLAB_H, s.d]} />
        <meshStandardMaterial
          color={described ? "#1d1a14" : STONE}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>
      {/* gold edge trim — the layer being pointed at lights its own seam */}
      <mesh position={[0, -SLAB_H / 2 + 0.02, 0]}>
        <boxGeometry args={[s.w + 0.035, 0.03, s.d + 0.035]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.25}
          emissive={GOLD}
          emissiveIntensity={described ? 2.4 : 0.9}
        />
      </mesh>
      <Text
        font={FRAUNCES}
        fontSize={face.labelSize}
        letterSpacing={LABEL_TRACK}
        color={IVORY}
        anchorX="left"
        anchorY="middle"
        position={[face.labelX, 0, s.d / 2 + 0.012]}
      >
        {s.label}
      </Text>
      <Text
        font={FRAUNCES}
        fontSize={NUM_SIZE}
        color={GOLD}
        anchorX="left"
        anchorY="middle"
        position={[face.numX, 0, s.d / 2 + 0.012]}
      >
        {s.num}
      </Text>
    </group>
  );
}

export function TheOrder() {
  const { alive } = useChapterVisibility(-34);
  // 0 on a wide screen, 1 on a phone — the camera's own curve, so the button
  // and the frame it lives in can never disagree about which lens is running.
  const portrait = useThree((st) =>
    portraitAmount(st.size.width / st.size.height),
  );
  const methodY = THREE.MathUtils.lerp(
    METHOD_BTN_Y,
    METHOD_BTN_Y_PORTRAIT,
    portrait,
  );
  const methodRange = [
    THREE.MathUtils.lerp(
      METHOD_BTN_WINDOW[0],
      METHOD_BTN_WINDOW_PORTRAIT[0],
      portrait,
    ),
    THREE.MathUtils.lerp(
      METHOD_BTN_WINDOW[1],
      METHOD_BTN_WINDOW_PORTRAIT[1],
      portrait,
    ),
  ] as const;
  return (
    <ChapterAlive.Provider value={alive}>
    <group position={[0, 0, -34]}>
      {SLABS.map((_, i) => (
        <Slab key={i} index={i} />
      ))}
      <BlobShadow position={[0, 0.012, 0]} scale={5.4} />
      <pointLight position={[0, 4.2, 2.6]} intensity={7} color={GOLD_LIGHT} distance={11} />
      <Text
        font={INTER}
        fontSize={0.1}
        letterSpacing={0.3}
        color="#8a847a"
        position={[0, 0.12, 1.9]}
        anchorX="center"
      >
        {SCENE.foundation}
      </Text>
      {/* Above the apex — the only clear space in this shot. Below the stack
          the anchor projects past the bottom of a phone screen, and beside it
          the portrait frustum clips at x ±2.7.

          IT ARRIVES WITH THE LAST SLAB, NOT WITH THE CHAPTER. The window used
          to open at 0.36, before the first slab had even landed, and close at
          0.50 — BEFORE the top slab arrives at 0.518 — so the one frame where
          the stack was whole was also the frame with nothing to press. Both
          windows now bracket the settle instead: the phone opens at 0.42, just
          as the last layer starts to fall, and holds to 0.575; desktop runs
          0.45 to 0.55. (Assembly timing is in Slab: layer n runs 0.3 + 0.032n
          to that plus 0.09, so the top lands at 0.518.)

          Height, duration and why the two differ: see METHOD_BTN_Y above. */}
      <SceneButton
        position={[0, methodY, 1.2]}
        label={METHOD_CTA.label}
        href={METHOD_CTA.href}
        range={methodRange}
      />
    </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 3 — THE DECISION: the three programmes ====== */

// ONE ROW, no gateway.
//
// The Transformation Audit used to stand alone in front of these as a gate,
// which cost this scene twice over: the three had to be pushed five units down
// a hall so the camera had somewhere to travel to, and even then only the
// flagship's head cleared the gate on the way past. The audit is still the
// primary action — the gold button on the overlay books it — but it is no
// longer an object in the room. The three are what the visitor came to see, so
// they are all that is standing here.
//
// Every word these show comes from OFFERS in facts.ts.

const PILLAR_Z = -5.0;
/** left · centre · right, matching the order of OFFERS.pillars */
const PILLAR_X = [-1.95, 0, 1.95];
// Wider than they were, which the gateway's removal paid for: the cards now
// carry four bullet lines each and needed the measure. The row ends at x ±2.80
// and a phone's frustum reaches ±2.98 at the final camera stop — that margin
// is the tightest constraint in the scene, so widen these only alongside the
// last KEYS_PORTRAIT entry in CameraRig.
const PILLAR_W = [1.7, 2.1, 1.7];
// The flagship stays the tallest of the three. With no gate to clear that is
// now purely hierarchy, and it is the only signal of it the row has — there is
// no badge, no border and no ornament any more.
const PILLAR_H = [3.4, 4.0, 3.4];

/* ---------- the programme cards: a slab, not a quad ---------- */

// These were flat planes with a hairline drawn on them, which is why they read
// as printed rectangles rather than as objects standing in a room: a plane has
// no edge for the gold light overhead to find. Each is now an extruded rounded
// rectangle with a chamfer all the way round, so the corners catch and the
// card has a visible thickness from the raised camera on the last beat.
//
// Cost is trivial — a few hundred triangles each, built once and cached — and
// it is the only geometry in the scene the visitor gets close enough to judge.
// Corners are SHARP — the radius here is a hair, only so the chamfer does not
// come to a needle where two edges meet. Approved design (option A) takes its
// corners from a printed card, and a rounded card was the first thing rejected.
const CARD_R = 0.02;
const CARD_D = 0.09; // how far the slab stands proud
const CARD_BEVEL = 0.022; // the chamfer that catches the light
// The border is a RAISED FRAME with the face sunk behind it, not a line drawn
// on a flat surface. That is the whole difference between a card that looks
// deep and one that looks printed: a drawn border has no walls, so there is
// nothing for the gold light overhead to rake across. Here the frame's inner
// wall is real geometry, lit on the top edge and in shadow on the bottom, and
// everything the card says sits down inside it.
const CARD_BORDER = 0.085; // width of the raised frame
const CARD_RECESS = 0.055; // how far the face sits below it

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = w / 2;
  const y = h / 2;
  const k = Math.min(r, x, y);
  s.moveTo(-x + k, -y);
  s.lineTo(x - k, -y);
  s.quadraticCurveTo(x, -y, x, -y + k);
  s.lineTo(x, y - k);
  s.quadraticCurveTo(x, y, x - k, y);
  s.lineTo(-x + k, y);
  s.quadraticCurveTo(-x, y, -x, y - k);
  s.lineTo(-x, -y + k);
  s.quadraticCurveTo(-x, -y, -x + k, -y);
  return s;
}

const cardCache = new Map<string, THREE.ExtrudeGeometry>();

function getCardGeometry(w: number, h: number) {
  const key = `${w}|${h}`;
  const hit = cardCache.get(key);
  if (hit) return hit;
  // The bevel grows the silhouette OUTWARD by bevelSize, so the shape is
  // authored inset by that much and the finished slab measures exactly w × h.
  const g = new THREE.ExtrudeGeometry(
    roundedRect(w - CARD_BEVEL * 2, h - CARD_BEVEL * 2, CARD_R),
    {
      depth: CARD_D,
      bevelEnabled: true,
      bevelThickness: CARD_BEVEL,
      bevelSize: CARD_BEVEL,
      bevelSegments: 3,
      curveSegments: 8,
    },
  );
  // Put the front face on z 0 — measured, not assumed, because where the
  // bevel leaves the front face is an implementation detail of three.js.
  // Everything mounted on the card (mandala at 0.008, type at 0.012) keeps
  // its offsets.
  g.computeBoundingBox();
  g.translate(0, 0, -(g.boundingBox?.max.z ?? CARD_D));
  cardCache.set(key, g);
  return g;
}

const frameCache = new Map<string, THREE.ExtrudeGeometry>();

/** The raised frame: the same slab with its middle cut out and extruded. */
function getCardFrame(w: number, h: number) {
  const key = `${w}|${h}`;
  const hit = frameCache.get(key);
  if (hit) return hit;
  const outer = roundedRect(w - CARD_BEVEL * 2, h - CARD_BEVEL * 2, CARD_R);
  const inner = roundedRect(w - CARD_BORDER * 2, h - CARD_BORDER * 2, CARD_R);
  // Sampled to a polyline and reversed: a hole has to wind against its outline
  // or the triangulator fills straight over it.
  outer.holes.push(new THREE.Path(inner.getPoints(8).reverse()));
  const g = new THREE.ExtrudeGeometry(outer, {
    depth: CARD_RECESS,
    bevelEnabled: true,
    bevelThickness: CARD_BEVEL,
    bevelSize: CARD_BEVEL,
    bevelSegments: 2,
    curveSegments: 6,
  });
  g.computeBoundingBox();
  g.translate(0, 0, -(g.boundingBox?.max.z ?? CARD_RECESS));
  frameCache.set(key, g);
  return g;
}

/* ---------- the gloss that follows the cursor ---------- */

// A radial highlight added over the face, positioned from the actual raycast
// hit on the card rather than from the screen-space pointer, so it sits under
// the cursor at any camera angle. A shader rather than a moving sprite because
// the glow has to be clipped by the card it is on: a sprite drifting off the
// edge would put a crescent of light on the floor behind it.
//
// With no cursor on it the spot damps back to the upper left and dims — which
// is the fixed angle the design was approved at, and what a touch device gets.
const GLOSS_IDLE = { x: 0.28, y: 0.72 };

const GLOSS_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const GLOSS_FRAG = `
uniform vec2 uSpot;
uniform float uAmt;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 s = vec2(uSpot.x * uAspect, uSpot.y);
  float g = smoothstep(0.42, 0.0, distance(p, s));
  g *= g;
  gl_FragColor = vec4(vec3(1.0, 0.94, 0.78) * g * uAmt, g * uAmt);
}`;

function makeGlossMaterial(aspect: number) {
  return new THREE.ShaderMaterial({
    vertexShader: GLOSS_VERT,
    fragmentShader: GLOSS_FRAG,
    uniforms: {
      uSpot: { value: new THREE.Vector2(GLOSS_IDLE.x, GLOSS_IDLE.y) },
      uAmt: { value: 0.16 },
      uAspect: { value: aspect },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * ONE PROGRAMME CARD. Three pieces of geometry, no 3D type at all:
 *
 *   1. the slab — extruded, sharp-cornered, chamfered all the way round. The
 *      only lit surface here, and the reason the card has an edge for the gold
 *      light overhead to find. A plane had none, which is why the previous
 *      version read as a printed rectangle rather than an object in a room.
 *   2. the frame — a raised border with the face sunk behind it.
 *   3. the gloss — an additive highlight that follows the cursor across it.
 *   4. the type — name, price line and four bullets, all signed-distance-field
 *      so they stay crisp at any size and can be sized per viewport.
 *
 * There is no ornament. Everything the card says, it says in words; the
 * decoration is depth and the light falling into it.
 */
function ProgrammeCard({
  offer,
  x,
  z,
  w,
  h,
  flagship,
}: {
  offer: Offer;
  x: number;
  z: number;
  w: number;
  h: number;
  /** Complete Transformation: same treatment, larger type, whole disc */
  flagship: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  // Reached through the mesh ref rather than closed over directly: the frame
  // loop writes to these uniforms every frame, and mutating a value produced
  // during render is exactly what the compiler's rule about local variables is
  // there to stop.
  const glossMesh = useRef<THREE.Mesh>(null);
  const spot = useRef(new THREE.Vector2(GLOSS_IDLE.x, GLOSS_IDLE.y));
  const alive = useChapterAlive();
  const described = useExperience((s) => s.hover === offer.id);
  // TYPE SIZE IS PER VIEWPORT. A phone shows this card at roughly the same
  // number of DEVICE pixels as a desktop does, but far fewer CSS pixels, and it
  // is CSS pixels that decide whether a person can read it at arm's length —
  // which is why the price line was legible on a laptop and not on a phone.
  // Same portrait ramp the camera uses, so the two stay in step.
  const aspect = useThree((st) => st.size.width / st.size.height);
  const portrait = THREE.MathUtils.clamp((1.05 - aspect) / 0.45, 0, 1);
  const typeScale = 1 + 0.36 * portrait;
  const nameSize = (flagship ? 0.152 : 0.132) * typeScale;
  const subSize = (flagship ? 0.082 : 0.075) * typeScale;
  // The price line sits below a two-line name rather than at a fixed height:
  // the name grows with the viewport, and a constant would have the two
  // overlapping on a phone at exactly the size that made them readable.
  const subY = h - 0.24 - 2 * nameSize * 1.2 - 0.09;
  // Bullets step up less steeply than the headings — at the full portrait ramp
  // a forty-character line would wrap to three, and four of those runs off the
  // bottom of the short cards.
  const pointSize = (flagship ? 0.086 : 0.08) * (1 + 0.26 * portrait);
  // Clears a two-line price line, then a deliberate gap so the bullets read as
  // a separate block rather than a fourth line of the caption above them.
  //
  // That gap rides the same portrait ramp as the bullets themselves. A fixed
  // one would hold at 0.27 while the type around it grew by a quarter, so the
  // separation the gap exists to create would quietly shrink on exactly the
  // screen where it matters most.
  //
  // Everything on this face is stacked off the thing above it rather than off
  // a constant, so the whole block breathes with the viewport instead of
  // colliding at the size that made it readable.
  const pointsY = subY - 2 * subSize * 1.2 - 0.27 * (1 + 0.26 * portrait);
  const points = offer.points.map((p) => `  ${p}`).join("\n\n");
  // One material per card — each carries its own spot position, and the aspect
  // has to be baked in so the highlight stays round on a card twice as tall as
  // it is wide.
  const gloss = useMemo(() => makeGlossMaterial(w / h), [w, h]);

  useFrame((_, delta) => {
    if (alive && !alive.current) return;
    const damp = 1 - Math.exp(-7 * delta);
    if (group.current) {
      // the card lifts a little under the pointer — 0.12, well inside the
      // kit's "nothing moves more than 4px on hover"
      const lift = described ? 0.12 : 0;
      group.current.position.y += (lift - group.current.position.y) * damp;
    }
    const mat = glossMesh.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;
    // Reduced motion parks the highlight at the angle the design was approved
    // at rather than letting it chase the cursor.
    const to = useExperience.getState().calm || !described ? GLOSS_IDLE : spot.current;
    const u = mat.uniforms.uSpot.value as THREE.Vector2;
    const k = 1 - Math.exp(-11 * delta);
    u.x += (to.x - u.x) * k;
    u.y += (to.y - u.y) * k;
    const amt = described ? 0.5 : 0.16;
    mat.uniforms.uAmt.value += (amt - mat.uniforms.uAmt.value) * damp;
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={group} {...describes(offer.id)}>
        {/* the well floor, sunk behind the frame */}
        <mesh geometry={getCardGeometry(w, h)} position={[0, h / 2, -CARD_RECESS]}>
          <meshStandardMaterial color="#0e0d0a" roughness={0.62} metalness={0.28} />
        </mesh>
        {/* The frame. Darker than the face it surrounds and much more metallic,
            so what reads is not a gold rectangle but a lit edge — the top of
            the border catching the lamp overhead while the bottom stays in
            shadow. A flat gold border here would have been the third gold
            thing on a card that already has two. */}
        <mesh geometry={getCardFrame(w, h)} position={[0, h / 2, 0]}>
          <meshStandardMaterial color="#e99f21" roughness={0.32} metalness={0.75} />
        </mesh>
        {/* The gloss doubles as the pointer target. It is the only surface here
            whose UVs run 0..1 — an extruded shape gets world-space UVs from
            three's default generator, so reading the hit off the slab would
            have handed the shader coordinates in world units. */}
        <mesh
          ref={glossMesh}
          position={[0, h / 2, 0.004 - CARD_RECESS]}
          material={gloss}
          onPointerMove={(e) => {
            if (!e.uv) return;
            spot.current.set(e.uv.x, e.uv.y);
          }}
        >
          <planeGeometry args={[w, h]} />
        </mesh>

        {/* Signed-distance-field type, sitting above the gloss so the highlight
            passes UNDER the words rather than washing them out.

            The halo is a tight dark outline, not an offset shadow: it lifts the
            words off the card wherever the highlight happens to be, and an
            offset would read as a second, blurrier copy at this size. */}
        {/* TWO-TONE GOLD. A light gold face over a deep gold shadow thrown
            down and slightly right — the top and bottom stops of the same
            palette the rest of the scene's gold uses, which is what a gradient
            on a letter this size resolves to anyway. A real per-glyph ramp
            would need a custom shader on the text material, and it would not
            be distinguishable at seventeen pixels tall.

            The deep gold doubles as the separation from the face behind it, so
            this one does not carry the black halo the other two do. */}
        <Text
          font={FRAUNCES}
          fontSize={nameSize}
          letterSpacing={0.02}
          color="#f8e8b6"
          position={[0, h - 0.24, 0.012 - CARD_RECESS]}
          anchorX="center"
          anchorY="top"
          // Any tighter and "Personality &" tips onto a third line at portrait
          // sizes, which would push the bullets into the card below it.
          maxWidth={w - 0.3}
          textAlign="center"
          outlineWidth="3.5%"
          outlineOffsetX="1%"
          outlineOffsetY="-3%"
          outlineBlur="3%"
          outlineColor="#6e5418"
          outlineOpacity={0.95}
        >
          {offer.label}
        </Text>
        <Text
          font={INTER}
          fontSize={subSize}
          letterSpacing={0.16}
          color={GOLD}
          position={[0, subY, 0.012 - CARD_RECESS]}
          anchorX="center"
          anchorY="top"
          // Inside the well, not the card: the frame eats 0.085 a side plus its
          // chamfer, so every measure on this face is 0.21 narrower than the
          // card is wide before any margin of its own.
          maxWidth={w - 0.3}
          textAlign="center"
          outlineWidth="5%"
          outlineBlur="8%"
          outlineColor="#070603"
          outlineOpacity={0.8}
        >
          {offer.sub}
        </Text>
        {/* Left-aligned, because four centred bullets read as a poem. One Text
            block rather than four: troika wraps and breaks it in one pass, so a
            bullet that runs to two lines simply takes two, where four separate
            blocks at fixed offsets would leave uneven gaps between them. */}
        <Text
          font={INTER}
          fontSize={pointSize}
          lineHeight={1.5}
          color="#cbc3b4"
        position={[-(w - 0.38) / 2, pointsY, 0.012 - CARD_RECESS]}
          anchorX="left"
          anchorY="top"
          maxWidth={w - 0.38}
          textAlign="center"
          outlineWidth="5%"
          outlineBlur="8%"
          outlineColor="#070603"
          outlineOpacity={0.8}
        >
          {points}
        </Text>
      </group>
      <BlobShadow position={[0, 0.012, 0]} scale={2.2} />
    </group>
  );
}

export function Decision() {
  // PULLED FORWARD from z -70 to z -52 on 31 Aug 2026. Removing "The Man" and
  // promoting the gallery to z -16 emptied the whole stretch behind the stack;
  // left where it was, the visitor scrolled thirty-six units of dark corridor
  // to reach it. Every camera key for this chapter moved by the same +18, so
  // the framing arithmetic in CameraRig is unchanged.
  const { alive } = useChapterVisibility(-52);

  return (
    <ChapterAlive.Provider value={alive}>
      <group position={[0, 0, -52]}>
        {/* The three programmes, side by side. */}
        {OFFERS.pillars.map((offer, i) => (
          <ProgrammeCard
            key={offer.id}
            offer={offer}
            x={PILLAR_X[i]}
            z={PILLAR_Z}
            w={PILLAR_W[i]}
            h={PILLAR_H[i]}
            flagship={i === 1}
          />
        ))}
        <pointLight
          position={[0, 5.0, PILLAR_Z + 2.4]}
          intensity={7}
          color={GOLD_LIGHT}
          distance={13}
        />

      </group>
    </ChapterAlive.Provider>
  );
}
