"use client";

import {
  useEffect,
  useLayoutEffect,
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
const ABOUT_CTA = FACTS["man-after"].cta ?? { label: "My story →", href: "/about" };
const METHOD_CTA =
  FACTS["order-1"].cta ?? { label: "See the full method →", href: "/method" };

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
const PORTRAIT_SRC = {
  before: `${BASE}/aditya/before/before_transformation_gl.jpg`,
  after: `${BASE}/aditya/after/after_transformation_gl.jpg`,
};

/** The baked crop is 768×1001 — every panel that shows a portrait must use
 *  this aspect or the photo letterboxes inside its frame. */
const PORTRAIT_ASPECT = 1.32 / 1.72;

/**
 * ONE decode, ONE cover-crop bake and ONE upload per photograph, shared by
 * both panels of chapter 1. (The proof gallery has its own eight files and
 * goes through loadTexture below, which needs no canvas step because those
 * bakes already come out at the panel aspect.)
 *
 * Never disposed: two textures live exactly as long as the canvas does, and
 * surviving a Fast Refresh remount saves re-baking them.
 */
const portraitCache = new Map<string, THREE.Texture>();
const silhouetteCache = new Map<string, THREE.Texture>();

/** Shown until the photo decodes, and kept as the floor if it never does. */
function getSilhouette(after: boolean) {
  const key = after ? "after" : "before";
  const hit = silhouetteCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 320);
  g.addColorStop(0, "#1a1712");
  g.addColorStop(1, "#0e0d0b");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 320);
  ctx.fillStyle = after ? "rgba(201,162,75,0.34)" : "rgba(201,162,75,0.14)";
  // head
  ctx.beginPath();
  ctx.arc(128, 118, after ? 40 : 46, 0, Math.PI * 2);
  ctx.fill();
  // shoulders
  ctx.beginPath();
  ctx.moveTo(30, 320);
  ctx.quadraticCurveTo(128, after ? 168 : 186, 226, 320);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  silhouetteCache.set(key, tex);
  return tex;
}

/**
 * Real transformation portrait, baked to a cover-cropped, downscaled
 * CanvasTexture. The source files are up to 2887×3608 — uploaded raw that is
 * ~40MB of VRAM per frame, which is exactly what tips a mid-range phone into
 * the perf watchdog. Decode failure leaves the silhouette in place rather
 * than a black panel.
 *
 * The bake width is read once, from whatever tier is active when the first
 * panel asks for the photo; Home3D pins phones to the low tier before the
 * canvas mounts, so that decision is already made by then.
 */
function usePortraitTexture(after: boolean) {
  const gl = useThree((s) => s.gl);
  const key = after ? "after" : "before";
  const [tex, setTex] = useState<THREE.Texture>(
    () => portraitCache.get(key) ?? getSilhouette(after),
  );

  // Render-phase adjustment, not an effect: should a panel ever be pointed at
  // the other photograph, swap to whatever that key already has instead of
  // holding the wrong face until the effect runs.
  const [shown, setShown] = useState(key);
  if (shown !== key) {
    setShown(key);
    setTex(portraitCache.get(key) ?? getSilhouette(after));
  }

  useEffect(() => {
    if (portraitCache.has(key)) return; // already baked — nothing to fetch
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      // the other panel showing this photo may have won the race
      const won = portraitCache.get(key);
      if (won) {
        setTex(won);
        return;
      }
      const w = useExperience.getState().quality === "low" ? 512 : 768;
      const h = Math.round(w / PORTRAIT_ASPECT);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      // cover fit — crop the long axis, never letterbox inside the frame
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const next = new THREE.CanvasTexture(c);
      next.colorSpace = THREE.SRGBColorSpace;
      // panels sit at up to ±0.32rad — without this the grazing angle smears
      next.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      portraitCache.set(key, next);
      setTex(next);
    };
    img.src = PORTRAIT_SRC[key];
    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [key, after, gl]);

  return tex;
}

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

/* ========== CHAPTER 1 — THE MAN: his own before / after, framed ========== */

// This chapter used to be an abstract stand-in: a rough boulder on a pedestal
// facing a carved gold column. It read as a black gem next to a trophy, which
// is not what the fact cards say — "man-before" and "man-after" are Aditya's
// own words about his own transformation. So it now shows the photographs.
//
// The abstraction also cost ~2,000 triangles (two 40-segment pedestals, a
// 24×24 sphere) plus two per-frame rotations. What replaces it is two quads
// and one frame geometry.

/** Panel size and spread are set by the PORTRAIT frustum, the tight case: the
 *  portrait camera key sits 9.5 units back at 56° fov, so on the narrowest
 *  common phone (aspect ~0.45) nothing may pass x ≈ ±2.27. Centre 1.50 plus
 *  0.74 of half-panel-and-frame lands at 2.24 — inside it, brackets included.
 *  The old boulder-and-pedestal pair reached 2.55 and clipped there. */
const PANEL_W = 1.24;
const PANEL_H = PANEL_W / PORTRAIT_ASPECT; // 1.616 — matches the baked crop
const PANEL_X = 1.5;
const PANEL_Y = 1.62;
const MAT = 0.05; // breathing room between the photo edge and the hairline
const LINE = 0.014; // hairline thickness — ~2px at the chapter's camera distance
const TICK = 0.22; // corner bracket arm
const TICK_OUT = 0.06; // how far the brackets sit outside the hairline

/**
 * A hairline rectangle — optionally with four corner brackets — merged into
 * ONE ShapeGeometry, so a whole frame is a single draw call of 8 or 24
 * triangles rather than four or twelve meshes. Cached by size, and used by
 * every framed object in the journey: both photo diptychs, the audit gateway
 * and the three programme columns.
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

function ManPortrait({
  after,
  caption,
  factId,
  floating,
}: {
  after: boolean;
  caption: string;
  /** the fact this panel reads out while it is pointed at */
  factId: string;
  floating: boolean;
}) {
  const tex = usePortraitTexture(after);
  const calm = useExperience((s) => s.calm);
  const described = useExperience((s) => s.hover === factId);
  // Gold is spent on the rebuild; the starting point gets a dim hairline.
  // The photographs themselves are never tinted or graded — "no filters".
  // Pointing at a panel lifts its frame rather than its photograph.
  const line = after ? GOLD : "#4d483f";
  const frameColor = described ? (after ? GOLD_LIGHT : "#8a847a") : line;
  const side = after ? 1 : -1;

  return (
    <group position={[side * PANEL_X, 0, 0]}>
      <Float
        speed={1.05}
        rotationIntensity={0.05}
        floatIntensity={0.3}
        enabled={floating && !calm}
      >
        {/* the diptych opens toward the camera path; the whole panel is the
            hit target now, so there is nothing small to find */}
        <group
          position={[0, PANEL_Y, 0]}
          rotation={[0, -side * 0.22, 0]}
          {...describes(factId)}
        >
          {/* mount board — one quad, so the hairline reads as a frame around
              a print rather than a rectangle drawn on the void */}
          <mesh position={[0, 0, -0.006]}>
            <planeGeometry args={[PANEL_W + MAT * 2 + LINE, PANEL_H + MAT * 2 + LINE]} />
            <meshBasicMaterial color="#12100d" />
          </mesh>
          <mesh>
            <planeGeometry args={[PANEL_W, PANEL_H]} />
            <meshBasicMaterial map={tex} />
          </mesh>
          <mesh
            geometry={getFrameGeometry()}
            material={getFrameMaterial(frameColor)}
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
            {caption}
          </Text>
        </group>
      </Float>
      <BlobShadow position={[0, 0.011, 0]} scale={2.4} />
      {after && (
        <pointLight position={[0, 2.4, 1.4]} intensity={4} color={GOLD_LIGHT} distance={6} />
      )}
    </group>
  );
}

export function TheMan() {
  const { alive, visible } = useChapterVisibility(-16);

  return (
    <ChapterAlive.Provider value={alive}>
      <group position={[0, 0, -16]}>
        <ManPortrait after={false} caption={SCENE.before} factId="man-before" floating={visible} />
        <ManPortrait after caption={SCENE.after} factId="man-after" floating={visible} />
        {/* Dead centre of the diptych, in the gap between the two frames.
            Out by 0.225: the dolly crosses this z at progress ≈ 0.25. */}
        <SceneButton
          position={[0, PANEL_Y, 0.3]}
          label={ABOUT_CTA.label}
          href={ABOUT_CTA.href}
          range={[CHAPTERS[1].range[0], 0.225]}
        />
      </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 2 — THE ORDER: the foundation assembles itself ====== */

// THE COMPLETE REBUILD (Aditya's framework, direction doc §6).
// Labels, numbers and the taper live in REBUILD_STEPS — facts.ts.
const SLABS = REBUILD_STEPS;
const SLAB_H = 0.48;

function Slab({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const s = SLABS[index];
  const finalY = SLAB_H / 2 + index * (SLAB_H + 0.06);
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
        fontSize={0.185}
        letterSpacing={0.12}
        color={IVORY}
        anchorX="center"
        anchorY="middle"
        position={[0.14, 0, s.d / 2 + 0.012]}
      >
        {s.label}
      </Text>
      <Text
        font={FRAUNCES}
        fontSize={0.16}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        position={[-s.w / 2 + 0.32, 0, s.d / 2 + 0.012]}
      >
        {s.num}
      </Text>
    </group>
  );
}

export function TheOrder() {
  const { alive } = useChapterVisibility(-34);
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
          the portrait frustum clips at x ±2.7. Out by 0.50: the dolly crosses
          this z at progress ≈ 0.56 on its way to the gallery. */}
      <SceneButton
        position={[0, 3.05, 1.2]}
        label={METHOD_CTA.label}
        href={METHOD_CTA.href}
        range={[CHAPTERS[2].range[0], 0.5]}
      />
    </group>
    </ChapterAlive.Provider>
  );
}

/* ========= CHAPTER 3 — THE PROOF: the client gallery ========= */

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

const PROOF_X = 1.78; // outer edge lands at 2.52 vs the 2.63 a phone can see
const PROOF_Y = 1.8;
const PROOF_TOE = 0.28; // the gallery opens a little wider than the diptych

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
  const front = useImageTexture(proofSrc(cur, side), 8);
  const back = useImageTexture(proofSrc(prev, side), 8);
  const frontMat = useRef<THREE.MeshBasicMaterial>(null);
  const calm = useExperience((s) => s.calm);
  const sign = after ? 1 : -1;

  useFrame(() => {
    if (frontMat.current) frontMat.current.opacity = fade.current;
  });

  return (
    <group position={[sign * PROOF_X, 0, 0]}>
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
  const { alive, visible } = useChapterVisibility(-52);
  const gl = useThree((s) => s.gl);
  const [pair, setPair] = useState({ cur: 0, prev: 0 });
  const fade = useRef(1);
  const clock = useRef(0);
  // Hovering or focusing the button stops the cycle. At a one-second cadence
  // the destination would otherwise change under a reader's cursor between the
  // moment he decides to click and the moment he does.
  const held = useRef(false);

  const shown = useExperience(
    (s) => s.progress > CHAPTERS[3].range[0] && s.progress < 0.7,
  );
  const mounted = useExperience(
    (s) => s.progress > CHAPTERS[3].range[0] - 0.05 && s.progress < 0.75,
  );

  // Eight photographs, warmed once the gallery is within range rather than at
  // canvas boot — it sits two thirds of the way down the journey, so this
  // keeps ~350KB off the homepage's first seconds while still leaving about
  // twenty units of scroll to decode in.
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
    clock.current += delta;
    if (clock.current * 1000 < FLIP_MS) return;
    clock.current = 0;
    setPair((p) => ({ cur: (p.cur + 1) % CLIENT_SETS.length, prev: p.cur }));
  });

  const set = CLIENT_SETS[pair.cur];
  const href = set.href;

  return (
    <ChapterAlive.Provider value={alive}>
      <group position={[0, 0, -52]}>
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

        {/* In the gap between the frames: who this is, and the way into his
            story. Out by 0.70 — the dolly crosses this z at progress ≈ 0.75. */}
        {mounted && (
          <Html
            position={[0, PROOF_Y, 0.3]}
            center
            pointerEvents="none"
            zIndexRange={[8, 0]}
            style={{ opacity: shown ? 1 : 0, transition: "opacity 420ms ease" }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className={EYEBROW}>{set.eyebrow}</span>
              {href && (
                <button
                  type="button"
                  tabIndex={shown ? 0 : -1}
                  aria-hidden={!shown}
                  onClick={() => requestNavigate(href)}
                  // The hold lives on the button itself, not on the wrapper:
                  // the wrapper inherits pointer-events:none from <Html> so the
                  // gap between the frames stays click-through to the canvas.
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
                  {set.linkLabel}
                </button>
              )}
            </div>
          </Html>
        )}
      </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 4 — THE DECISION: the gateway, then the three ====== */

// TWO LEVELS IN DEPTH, because that is the actual shape of the offer.
//
//   LEVEL 1 · z +1.6 — the Transformation Audit, alone at the front, lit,
//     gold-framed, the only object here carrying a price. It is not one of
//     four choices; it is the way in to all of them.
//   LEVEL 2 · z -1.4 — the three programmes it routes a man into. Lifestyle
//     Coaching and Personality & Presence flank. Complete Transformation
//     stands between them and is the ONLY column tall enough to clear the
//     gateway, which is how the flagship reads as the flagship — by rising
//     over the gate rather than by wearing a badge.
//
// The four steles this replaces stood in one scattered row at a single depth,
// so the gateway looked like a fourth product. Each was also two boxes plus a
// rim (24 triangles and two standard materials apiece); these are a single
// quad plus the shared hairline outline — 10 triangles, one material each.
//
// Every word here comes from OFFERS in facts.ts.

const GATE_Z = 1.6;
const GATE_W = 1.7;
const GATE_H = 2.4;

// The programmes stand a full FIVE units behind the gateway, not one. At the
// old spacing the journey ended on the gateway with the three crowded right
// up against its back, and there was no room left to travel: the camera could
// not come forward without being on top of them. The room is now long enough
// that the last stretch of scroll is a real move — over the gate and down the
// hall to the three. See the last two KEYS in CameraRig.
const PILLAR_Z = -5.0;
/** left · centre · right, matching the order of OFFERS.pillars */
const PILLAR_X = [-1.9, 0, 1.9];
const PILLAR_W = [1.5, 1.7, 1.5];
// Each card is now tall enough to carry its mandala UNDER its name without the
// ornament dropping into the bottom third of the screen, which the scroll
// overlay owns. The flagship stays the tallest of the three so its head still
// shows over the 2.4 gateway on the first beat — that sliver is the only hint
// the visitor gets that there is more back there.
const PILLAR_H = [3.4, 4.0, 3.4];

/* ---------- the programme mandalas ---------- */

// Each of the three programme cards carries its own mandala, drawn on a 2D
// canvas and uploaded as a single texture. Procedural rather than a shipped
// PNG for three reasons: nothing new to download, the line weight can be tuned
// for the size these actually render at (~200px on a desktop, ~100px on a
// phone), and the flagship's mandala can be built from the OTHER TWO cards'
// motifs — Complete Transformation alternates the lotus of Lifestyle Coaching
// with the leaf of Personality & Presence in the same ring, because it is the
// two of them together. That is the whole idea, drawn.
//
// The gateway deliberately has none. It is not one of the three.

type Motif = "lotus" | "leaf";

/** id → [inner-ring motif, outer-ring motif], petal count */
const MANDALAS: Record<string, { motifs: [Motif, Motif]; petals: number }> = {
  "offer-lifestyle": { motifs: ["lotus", "lotus"], petals: 12 },
  "offer-complete": { motifs: ["lotus", "leaf"], petals: 16 },
  "offer-presence": { motifs: ["leaf", "leaf"], petals: 14 },
};

const MANDALA_PX = 512;
const mandalaCache = new Map<string, THREE.Texture>();

function drawMandala(
  ctx: CanvasRenderingContext2D,
  size: number,
  motifs: [Motif, Motif],
  petals: number,
) {
  const R = size / 2;
  const u = size / 512; // stroke widths are authored at 512 and scale from there
  ctx.translate(R, R);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;

  const ring = (n: number, fn: (i: number) => void, offset = 0) => {
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate(((i + offset) / n) * Math.PI * 2);
      fn(i);
      ctx.restore();
    }
  };

  const circle = (r: number, lw: number, color = GOLD) => {
    ctx.beginPath();
    ctx.lineWidth = lw * u;
    ctx.strokeStyle = color;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = GOLD;
  };

  const dot = (r: number, y: number) => {
    ctx.beginPath();
    ctx.arc(0, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  /**
   * Half-width at the base, derived from the arc a petal is allowed to occupy
   * at radius `a` when `n` of them share the circle. Petals sized this way sit
   * shoulder to shoulder instead of leaving a wheel's worth of gap between
   * them — that difference is most of what separates a mandala from a cog.
   */
  const spreadFor = (a: number, n: number, k: number) => a * Math.tan(Math.PI / n) * k;

  /** one petal pointing at 12 o'clock, from radius a out to radius b */
  const petal = (a: number, b: number, s: number, motif: Motif, lw: number) => {
    const L = b - a;
    ctx.beginPath();
    ctx.lineWidth = lw * u;
    ctx.moveTo(0, -a);
    if (motif === "lotus") {
      // wide shoulders closing to a soft point — the flower
      ctx.bezierCurveTo(s, -(a + L * 0.52), s * 0.32, -b, 0, -b);
      ctx.bezierCurveTo(-s * 0.32, -b, -s, -(a + L * 0.52), 0, -a);
    } else {
      // narrow, sharp at both ends — the leaf
      ctx.bezierCurveTo(s, -(a + L * 0.3), s, -(a + L * 0.72), 0, -b);
      ctx.bezierCurveTo(-s, -(a + L * 0.72), -s, -(a + L * 0.3), 0, -a);
    }
    ctx.closePath();
    ctx.stroke();
  };

  /** the motif plus the detail that tells the two apart at a glance */
  const petalDetailed = (a: number, b: number, n: number, motif: Motif, lw: number) => {
    const L = b - a;
    const s = spreadFor(a, n, motif === "lotus" ? 1.12 : 0.8);
    petal(a, b, s, motif, lw);
    petal(a + L * 0.16, b - L * 0.2, s * 0.55, motif, lw * 0.62);
    if (motif === "lotus") {
      dot(L * 0.055, -(a + L * 0.3));
    } else {
      ctx.beginPath();
      ctx.lineWidth = lw * 0.55 * u;
      ctx.moveTo(0, -(a + L * 0.18));
      ctx.lineTo(0, -(b - L * 0.22));
      ctx.stroke();
    }
  };

  // ---- centre ----
  dot(R * 0.02, 0);
  ctx.strokeStyle = GOLD_LIGHT;
  ring(8, () => petal(R * 0.042, R * 0.165, spreadFor(R * 0.042, 8, 3.4), "lotus", 1.5));
  ctx.strokeStyle = GOLD;
  circle(R * 0.178, 1.1, GOLD_LIGHT);
  ring(8, () => petal(R * 0.182, R * 0.275, spreadFor(R * 0.182, 8, 1.15), "leaf", 1.3), 0.5);
  circle(R * 0.295, 1.5);
  circle(R * 0.318, 0.9);

  // ---- bead ring ----
  ring(28, () => dot(R * 0.0105, -R * 0.34));
  circle(R * 0.362, 0.9);

  // ---- ray band ----
  ring(petals * 3, () => {
    ctx.beginPath();
    ctx.lineWidth = 1.1 * u;
    ctx.moveTo(0, -R * 0.372);
    ctx.lineTo(0, -R * 0.408);
    ctx.stroke();
  });
  circle(R * 0.418, 1.6);

  // ---- MAIN RING — the card's identity ----
  ring(petals, (i) => petalDetailed(R * 0.428, R * 0.69, petals, motifs[i % 2], 2.2));
  circle(R * 0.705, 1.9);
  circle(R * 0.732, 0.9);

  // ---- scalloped collar ----
  // The arc radius is the BAND it has to live in (0.732R → 0.782R), not the
  // gap between neighbours: sized to the gap it swells straight through the
  // crown outside it.
  ring(
    petals * 2,
    () => {
      ctx.beginPath();
      ctx.lineWidth = 1.2 * u;
      ctx.arc(0, -R * 0.746, R * 0.028, Math.PI, 0);
      ctx.stroke();
    },
    0.5,
  );
  circle(R * 0.782, 1.2);

  // ---- outer crown, interleaved with the main ring ----
  ring(
    petals,
    (i) => {
      const m = motifs[(i + 1) % 2];
      const s = spreadFor(R * 0.782, petals, m === "lotus" ? 0.8 : 0.62);
      petal(R * 0.782, R * 0.988, s, m, 2.0);
      petal(R * 0.818, R * 0.945, s * 0.5, m, 1.1);
    },
    0.5,
  );
  ring(petals, () => dot(R * 0.014, -R * 0.805));
}

function getMandala(id: string) {
  const hit = mandalaCache.get(id);
  if (hit) return hit;
  const spec = MANDALAS[id];
  if (!spec) return null;
  const c = document.createElement("canvas");
  c.width = c.height = MANDALA_PX;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  drawMandala(ctx, MANDALA_PX, spec.motifs, spec.petals);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  mandalaCache.set(id, tex);
  return tex;
}

/** Turns about a minute and a half per revolution — present, never a spinner. */
const MANDALA_RPS = 0.045;

function CardMandala({
  id,
  size,
  y,
  lit,
  spin,
}: {
  id: string;
  size: number;
  y: number;
  lit: boolean;
  /** +1 / -1 so the pair either side of the flagship turn against each other */
  spin: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const alive = useChapterAlive();
  const tex = getMandala(id);

  useFrame((_, delta) => {
    if (alive && !alive.current) return;
    if (useExperience.getState().calm) return; // reduced motion: it holds still
    if (mesh.current) mesh.current.rotation.z += delta * MANDALA_RPS * spin;
  });

  if (!tex) return null;
  return (
    <mesh ref={mesh} position={[0, y, 0.008]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={tex} transparent opacity={lit ? 1 : 0.78} depthWrite={false} />
    </mesh>
  );
}

/**
 * One standing panel — the gateway or a programme. A flat quad rather than a
 * box: the camera never leaves the front of this room, so the sides of a box
 * were geometry nobody could see.
 */
function OfferPanel({
  offer,
  x,
  z,
  w,
  h,
  featured = false,
}: {
  offer: Offer;
  x: number;
  z: number;
  w: number;
  h: number;
  featured?: boolean;
}) {
  /** left card turns one way, right card the other, flagship the slow way */
  const spin = x === 0 ? 0.6 : x < 0 ? 1 : -1;
  const group = useRef<THREE.Group>(null);
  const alive = useChapterAlive();
  const described = useExperience((s) => s.hover === offer.id);

  useFrame((_, delta) => {
    if (alive && !alive.current) return;
    if (!group.current) return;
    // the panel lifts a little under the pointer — 0.12, well inside the
    // kit's "nothing moves more than 4px on hover"
    const damp = 1 - Math.exp(-7 * delta);
    const lift = described ? 0.12 : 0;
    group.current.position.y += (lift - group.current.position.y) * damp;
  });

  const line = featured ? (described ? GOLD_LIGHT : GOLD) : described ? GOLD : "#4d483f";

  return (
    <group position={[x, 0, z]}>
      <group ref={group} {...describes(offer.id)}>
        <mesh position={[0, h / 2, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            color={featured ? "#191305" : STONE}
            roughness={featured ? 0.4 : 0.62}
            metalness={featured ? 0.6 : 0.32}
          />
        </mesh>
        <mesh
          geometry={getOutline(w, h, featured)}
          material={getFrameMaterial(line)}
          position={[0, h / 2, 0.004]}
        />

        {/* The mandala sits under the card's own name, filling the face below
            it. Sized to the card, so the flagship's is the largest of the
            three. The gateway gets none — see MANDALAS. */}
        {!featured && (
          <CardMandala
            id={offer.id}
            size={w * 0.9}
            y={h - 1.45}
            lit={described}
            spin={spin}
          />
        )}

        {/* Text sits in the UPPER part of every panel on purpose. The scroll
            overlay owns the bottom third of the screen, so anything set low on
            these panels ends up reading through its scrim. */}
        {offer.eyebrow && (
          <Text
            font={INTER}
            fontSize={0.066}
            letterSpacing={0.3}
            color={GOLD}
            position={[0, h - 0.22, 0.012]}
            anchorX="center"
          >
            {offer.eyebrow}
          </Text>
        )}
        <Text
          font={FRAUNCES}
          fontSize={featured ? 0.155 : 0.13}
          letterSpacing={0.04}
          color={featured ? GOLD_LIGHT : IVORY}
          position={[0, h - (featured ? 0.48 : 0.26), 0.012]}
          anchorX="center"
          anchorY="top"
          // The gateway's own name may overhang its frame by a hair rather
          // than break across two lines; the programmes wrap inside theirs.
          maxWidth={featured ? 1.9 : 1.5}
          textAlign="center"
        >
          {offer.label}
        </Text>
        <Text
          font={INTER}
          fontSize={featured ? 0.072 : 0.062}
          letterSpacing={0.13}
          color={featured ? GOLD : "#8a847a"}
          // clears two wrapped lines of label above it
          position={[0, h - (featured ? 0.82 : 0.62), 0.012]}
          anchorX="center"
          anchorY="top"
          maxWidth={1.9}
          textAlign="center"
        >
          {offer.sub}
        </Text>
      </group>
      <BlobShadow position={[0, 0.012, 0]} scale={featured ? 2.8 : 2.2} />
    </group>
  );
}

export function Decision() {
  const { alive } = useChapterVisibility(-70);

  return (
    <ChapterAlive.Provider value={alive}>
      <group position={[0, 0, -70]}>
        {/* LEVEL 2 — the three programmes, down the hall */}
        {OFFERS.pillars.map((offer, i) => (
          <OfferPanel
            key={offer.id}
            offer={offer}
            x={PILLAR_X[i]}
            z={PILLAR_Z}
            w={PILLAR_W[i]}
            h={PILLAR_H[i]}
          />
        ))}
        <pointLight
          position={[0, 5.0, PILLAR_Z + 2.4]}
          intensity={7}
          color={GOLD_LIGHT}
          distance={13}
        />

        {/* LEVEL 1 — the gateway, in front and lit hardest */}
        <OfferPanel
          offer={OFFERS.gate}
          x={0}
          z={GATE_Z}
          w={GATE_W}
          h={GATE_H}
          featured
        />
        <pointLight
          position={[0, 1.9, GATE_Z + 2.4]}
          intensity={7}
          color={GOLD_LIGHT}
          distance={8}
        />
      </group>
    </ChapterAlive.Provider>
  );
}
