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
const ABOUT_CTA = FACTS["man-after"].cta ?? { label: "My story →", href: "/about" };
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

  // Closes before the dolly reaches z -52 and flies through these frames. That
  // crossing moved to ≈0.694 when the run to the gateway was shortened, so both
  // ends came back with it.
  const shown = useExperience(
    (s) => s.progress > CHAPTERS[3].range[0] && s.progress < 0.672,
  );
  const mounted = useExperience(
    (s) => s.progress > CHAPTERS[3].range[0] - 0.05 && s.progress < 0.7,
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

        {/* In the gap between the frames: who this is, and the one fixed way
            through to the stories. Out by 0.70 — the dolly crosses this z at
            progress ≈ 0.75. */}
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
// The flagship went 1.7 → 2.0 so a whole disc fits inside its frame at the
// same diameter as the two halves either side of it. The outer two are
// untouched, so the row still ends at x ±2.65 — a phone's frustum reaches
// ±2.80 at this depth and that margin is the tightest constraint in the scene.
const PILLAR_W = [1.5, 2.0, 1.5];
// Each card is now tall enough to carry its mandala UNDER its name without the
// ornament dropping into the bottom third of the screen, which the scroll
// overlay owns. The flagship stays the tallest of the three so its head still
// shows over the 2.4 gateway on the first beat — that sliver is the only hint
// the visitor gets that there is more back there.
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

/* ---------- the card face: frame, filigree, arabesque and type, baked ---------- */

// Approved direction, option A: the frame off the reference card — a complete
// outer rule, an inner rule breaking short of every corner with a small square
// terminal, heavy filigree on one diagonal and plain brackets on the other —
// behind it an eight-fold arabesque built entirely from curves.
//
// The whole face is ONE canvas texture: rules, filigree, ornament and type.
//   · Not layered geometry — every element here is a curve, and none of it is
//     worth triangulating for a card that renders about 315 device pixels wide.
//   · Not troika text on top — the type has to run through the same gold
//     gradient as the linework, and troika paints in one flat colour. Canvas
//     also brings measureText, which retires the hand-tuned advance-width
//     constant the 3D type needed to guess its own line breaks.
//
// THE CROP IS THE ARGUMENT, and it survives the redesign:
//
//   Lifestyle Coaching     the RIGHT half of the disc, cut by its own left edge
//   Personality & Presence the LEFT half of the same disc, cut by its right
//   Complete Transformation the WHOLE disc
//
// The two flanking cards are halves of the disc standing complete between them,
// so the flagship reads as the other two joined without a badge saying so.
// Nothing rotates: turn a half and it spins its cut edge into view.

/** which half of the disc survives the card's edge */
type Crop = "left" | "right" | "full";

const CROP: Record<string, Crop> = {
  "offer-lifestyle": "right",
  "offer-complete": "full",
  "offer-presence": "left",
};

// Texture pixels per world unit. The cards land at ~315 device px wide on both
// a phone and a desktop (different distances, different frustums, same result),
// so 256 is a ~1.2x oversample — enough that the hairlines hold, low enough
// that the three faces together stay under about 6MB of VRAM.
const FACE_PPU = 256;

const ARABESQUE_D = 1.84; // disc diameter
const ARABESQUE_Y = 1.5; // its centre, measured up from the card's bottom edge

const GOLD_STOPS: [number, string][] = [
  [0, "#f7e9bd"],
  [0.34, "#c9a24b"],
  [0.56, "#8f6f26"],
  [0.78, "#d8b96a"],
  [1, "#f1dfa6"],
];

/* --- primitives, all authored in world units --- */

/**
 * A logarithmic spiral as a polyline. This is the backbone of every scroll on
 * the card: the reference's ornament is drawn with a pen, not constructed on a
 * grid, and a spiral that tightens as it turns is what a pen actually does.
 */
function spiralTo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rStart: number,
  rEnd: number,
  aStart: number,
  sweep: number,
  steps = 44,
) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = aStart + sweep * t;
    const r = rStart * Math.pow(rEnd / rStart, t);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** a long keeled blade pointing at 12 o'clock, radius a out to b, ±hw wide */
function bladeTo(
  ctx: CanvasRenderingContext2D,
  a: number,
  b: number,
  hw: number,
  bulge = 0.22,
) {
  const L = b - a;
  ctx.beginPath();
  ctx.moveTo(0, -a);
  ctx.bezierCurveTo(hw, -(a + L * bulge), hw * 0.5, -(a + L * 0.72), 0, -b);
  ctx.bezierCurveTo(-hw * 0.5, -(a + L * 0.72), -hw, -(a + L * bulge), 0, -a);
  ctx.closePath();
  ctx.stroke();
}

/* --- the arabesque --- */

function paintArabesque(ctx: CanvasRenderingContext2D, R: number, lw: (n: number) => void) {
  const ring = (count: number, fn: (i: number) => void, offset = 0) => {
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate(((i + offset) / count) * Math.PI * 2);
      fn(i);
      ctx.restore();
    }
  };
  const circle = (r: number, weight: number) => {
    lw(weight);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const dot = (r: number, y: number) => {
    ctx.beginPath();
    ctx.arc(0, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const tick = (a: number, b: number, weight: number) => {
    lw(weight);
    ctx.beginPath();
    ctx.moveTo(0, -a);
    ctx.lineTo(0, -b);
    ctx.stroke();
  };
  /** a leaf hanging off a scroll; sx flips it to the other side of the point */
  const scrollLeaf = (sx: number, x: number, y: number, len: number, wide: number) => {
    lw(1.1);
    ctx.beginPath();
    ctx.moveTo(sx * x, -y);
    ctx.bezierCurveTo(
      sx * (x + wide),
      -(y + len * 0.28),
      sx * (x + wide * 1.05),
      -(y + len * 0.8),
      sx * (x + wide * 0.1),
      -(y + len),
    );
    ctx.bezierCurveTo(
      sx * (x - wide * 0.15),
      -(y + len * 0.62),
      sx * (x - wide * 0.1),
      -(y + len * 0.3),
      sx * x,
      -y,
    );
    ctx.closePath();
    ctx.stroke();
  };

  // --- core ---
  dot(R * 0.018, 0);
  lw(1.5);
  ring(8, () => bladeTo(ctx, R * 0.03, R * 0.098, R * 0.03, 0.4));
  circle(R * 0.116, 1.1);
  ring(24, () => tick(R * 0.124, R * 0.158, 0.8));
  circle(R * 0.168, 1.0);
  // tendrils mirrored in pairs, so the core reads woven rather than spun
  lw(1.5);
  ring(8, () => {
    spiralTo(ctx, 0, -R * 0.235, R * 0.095, R * 0.008, -0.5, Math.PI * 2.2);
    spiralTo(ctx, 0, -R * 0.235, R * 0.095, R * 0.008, Math.PI + 0.5, -Math.PI * 2.2);
  });
  circle(R * 0.298, 1.3);
  circle(R * 0.316, 0.7);
  lw(0.9);
  ring(
    24,
    () => {
      ctx.beginPath();
      ctx.arc(0, -R * 0.326, R * 0.021, Math.PI, 0);
      ctx.stroke();
    },
    0.5,
  );

  // --- the short blades in the bays between the points ---
  ring(
    8,
    () => {
      lw(1.7);
      bladeTo(ctx, R * 0.34, R * 0.63, R * 0.09);
      lw(1.0);
      bladeTo(ctx, R * 0.39, R * 0.58, R * 0.034);
      dot(R * 0.012, -R * 0.365);
      lw(1.2);
      spiralTo(ctx, R * 0.072, -R * 0.38, R * 0.1, R * 0.01, -1.35, Math.PI * 2.15);
      spiralTo(ctx, -R * 0.072, -R * 0.38, R * 0.1, R * 0.01, Math.PI + 1.35, -Math.PI * 2.15);
    },
    0.5,
  );

  // --- the eight long points, each keeled, with scrollwork off its base ---
  ring(8, () => {
    lw(2.0);
    bladeTo(ctx, R * 0.32, R * 0.985, R * 0.155, 0.26);
    lw(1.1);
    bladeTo(ctx, R * 0.42, R * 0.9, R * 0.062);
    tick(R * 0.48, R * 0.86, 0.8);
    lw(1.6);
    spiralTo(ctx, R * 0.1, -R * 0.375, R * 0.175, R * 0.014, -1.15, Math.PI * 2.45);
    spiralTo(ctx, -R * 0.1, -R * 0.375, R * 0.175, R * 0.014, Math.PI + 1.15, -Math.PI * 2.45);
    scrollLeaf(1, R * 0.235, R * 0.5, R * 0.2, R * 0.085);
    scrollLeaf(-1, R * 0.235, R * 0.5, R * 0.2, R * 0.085);
    scrollLeaf(1, R * 0.15, R * 0.72, R * 0.13, R * 0.055);
    scrollLeaf(-1, R * 0.15, R * 0.72, R * 0.13, R * 0.055);
    dot(R * 0.014, -R * 0.995);
  });
}

/* --- corner filigree, authored for a top-left corner --- */

function paintFiligree(ctx: CanvasRenderingContext2D, L: number, lw: (n: number) => void) {
  lw(1.5);
  ctx.beginPath();
  ctx.moveTo(L, L * 0.09);
  ctx.bezierCurveTo(L * 0.5, L * 0.07, L * 0.07, L * 0.5, L * 0.09, L);
  ctx.stroke();
  lw(1.1);
  ctx.beginPath();
  ctx.moveTo(L * 0.86, L * 0.26);
  ctx.bezierCurveTo(L * 0.5, L * 0.24, L * 0.24, L * 0.5, L * 0.26, L * 0.86);
  ctx.stroke();
  lw(1.4);
  spiralTo(ctx, L * 0.82, L * 0.4, L * 0.16, L * 0.015, -Math.PI / 2, Math.PI * 2.3);
  spiralTo(ctx, L * 0.4, L * 0.82, L * 0.16, L * 0.015, 0, -Math.PI * 2.3);
  // the leaf that fills the elbow
  lw(1.3);
  ctx.beginPath();
  ctx.moveTo(L * 0.3, L * 0.3);
  ctx.bezierCurveTo(L * 0.66, L * 0.26, L * 0.74, L * 0.42, L * 0.48, L * 0.48);
  ctx.bezierCurveTo(L * 0.42, L * 0.74, L * 0.26, L * 0.66, L * 0.3, L * 0.3);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(L * 0.55, L * 0.55, L * 0.035, 0, Math.PI * 2);
  ctx.fill();
}

/* --- option A's frame --- */

const F_OUT = 0.055; // outer rule, inset from the card edge
const F_IN = 0.115; // inner rule
const F_GAP = 0.42; // how far short of each corner the inner rule stops
const F_TERM = 0.02; // the square terminal capping every broken end

function paintFrameA(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lw: (n: number) => void,
) {
  lw(1.6);
  ctx.strokeRect(F_OUT, F_OUT, w - F_OUT * 2, h - F_OUT * 2);

  // the inner rule, broken short of every corner
  lw(1.0);
  const seg = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  seg(F_IN + F_GAP, F_IN, w - F_IN - F_GAP, F_IN);
  seg(F_IN + F_GAP, h - F_IN, w - F_IN - F_GAP, h - F_IN);
  seg(F_IN, F_IN + F_GAP, F_IN, h - F_IN - F_GAP);
  seg(w - F_IN, F_IN + F_GAP, w - F_IN, h - F_IN - F_GAP);
  const t = F_TERM / 2;
  for (const [x, y] of [
    [F_IN + F_GAP, F_IN],
    [w - F_IN - F_GAP, F_IN],
    [F_IN + F_GAP, h - F_IN],
    [w - F_IN - F_GAP, h - F_IN],
    [F_IN, F_IN + F_GAP],
    [F_IN, h - F_IN - F_GAP],
    [w - F_IN, F_IN + F_GAP],
    [w - F_IN, h - F_IN - F_GAP],
  ]) {
    ctx.fillRect(x - t, y - t, F_TERM, F_TERM);
  }

  // Heavy filigree on ONE diagonal and plain brackets on the other. The
  // asymmetry is the reference's, and it is what stops the card reading as a
  // certificate: four matching corners would centre it, two do not.
  const L = Math.min(w, h) * 0.2;
  const place = (tx: number, ty: number, sx: number, sy: number, fn: () => void) => {
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(sx, sy);
    fn();
    ctx.restore();
  };
  const filLw = (n: number) => {
    ctx.lineWidth = (n * L) / 150;
  };
  place(w - F_OUT, F_OUT, -1, 1, () => paintFiligree(ctx, L, filLw));
  place(F_OUT, h - F_OUT, 1, -1, () => paintFiligree(ctx, L, filLw));
  const b = L * 0.42;
  const bracket = () => {
    lw(1.4);
    ctx.beginPath();
    ctx.moveTo(b, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, b);
    ctx.stroke();
  };
  place(F_OUT + 0.025, F_OUT + 0.025, 1, 1, bracket);
  place(w - F_OUT - 0.025, h - F_OUT - 0.025, -1, -1, bracket);
}

/* --- type --- */

// The 3D text these replace needed a hand-measured advance-width constant to
// guess its own line breaks. Canvas measures for real, so the wrap is exact and
// a longer programme name in facts.ts re-flows instead of running off the card.
let faceFonts: Promise<void> | null = null;

function loadFaceFonts() {
  if (faceFonts) return faceFonts;
  faceFonts = (async () => {
    await Promise.all(
      [
        new FontFace("AtelierDisplay", `url(${FRAUNCES})`),
        new FontFace("AtelierBody", `url(${INTER})`),
      ].map(async (f) => {
        await f.load();
        document.fonts.add(f);
      }),
    );
  })().catch(() => {
    // A card set in the fallback serif beats a card with no name on it, so a
    // failed font load must not reject the bake.
  });
  return faceFonts;
}

function wrapTo(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && ctx.measureText(next).width > maxW) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Tracked-out caps, drawn a glyph at a time — ctx.letterSpacing is too new. */
function trackedWidth(ctx: CanvasRenderingContext2D, s: string, sp: number) {
  let w = -sp;
  for (const ch of s) w += ctx.measureText(ch).width + sp;
  return w;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  s: string,
  cx: number,
  y: number,
  sp: number,
) {
  let x = cx - trackedWidth(ctx, s, sp) / 2;
  for (const ch of s) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + sp;
  }
}

/* --- the bake --- */

const faceCache = new Map<string, THREE.Texture>();
const faceLoads = new Map<string, Promise<THREE.Texture>>();

async function bakeFace(offer: Offer, w: number, h: number, flagship: boolean) {
  await loadFaceFonts();
  const c = document.createElement("canvas");
  c.width = Math.round(w * FACE_PPU);
  c.height = Math.round(h * FACE_PPU);
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  // Everything below is authored in WORLD UNITS: one scale, then no conversions
  // anywhere in the drawing code. Stroke weights are the exception — they are
  // quoted in reference pixels, hence STROKE.
  ctx.scale(FACE_PPU, FACE_PPU);
  const STROKE = 1 / 240; // the weights were tuned against a 240px/unit proof
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const bg = ctx.createLinearGradient(w * 0.1, 0, w * 0.9, h);
  bg.addColorStop(0, "#1c1913");
  bg.addColorStop(0.5, "#12100c");
  bg.addColorStop(1, "#0c0b08");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // ONE gold gradient across the whole face, shared by the ornament, the frame
  // and the type — so the light reads as a single source crossing the card
  // rather than each element carrying its own private highlight.
  //
  // Rebuilt per use with the current translation cancelled out. A canvas
  // gradient is resolved in user space at PAINT time, not at creation, so the
  // one gradient drawn inside the ornament's own translate would slide with it
  // and put the gradient's dark stop somewhere across the middle of the disc.
  const goldFor = (ox: number, oy: number) => {
    const g = ctx.createLinearGradient(-ox, -oy, w * 0.35 - ox, h - oy);
    for (const [at, col] of GOLD_STOPS) g.addColorStop(at, col);
    return g;
  };

  const R = ARABESQUE_D / 2;
  const crop = CROP[offer.id] ?? "full";
  const discX = crop === "right" ? 0 : crop === "left" ? w : w / 2;
  const discY = h - ARABESQUE_Y;

  // Two passes: a hard shadow down-right, then the metal on top. That is the
  // relief — struck into the card rather than printed on it.
  for (const pass of [
    { d: 1.6 * STROKE, ink: "#000000" as string | null, alpha: 0.85 },
    { d: 0, ink: null, alpha: 1 },
  ]) {
    ctx.save();
    ctx.globalAlpha = pass.alpha;
    ctx.translate(pass.d, pass.d);
    const ink = (ox: number, oy: number) => {
      const paint = pass.ink ?? goldFor(ox, oy);
      ctx.strokeStyle = paint;
      ctx.fillStyle = paint;
    };
    // Frame weights are quoted in reference pixels and stay constant. The
    // ornament's and the filigree's are quoted relative to their OWN size,
    // exactly as the approved proof authored them — a constant weight there
    // would come out about twice as heavy as what was signed off.
    const lw = (n: number) => {
      ctx.lineWidth = n * STROKE;
    };

    ctx.save();
    ctx.globalAlpha = pass.alpha * 0.9;
    ctx.translate(discX, discY);
    ink(pass.d + discX, pass.d + discY);
    paintArabesque(ctx, R, (n) => {
      ctx.lineWidth = (n * R) / 260;
    });
    ctx.restore();

    ink(pass.d, pass.d);
    paintFrameA(ctx, w, h, lw);

    // --- the name, then the price line under it ---
    const nameSize = flagship ? 0.152 : 0.132;
    ctx.font = `${nameSize}px AtelierDisplay, Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    let y = 0.36;
    for (const line of wrapTo(ctx, offer.label, w - F_IN * 2 - 0.16)) {
      ctx.fillText(line, w / 2, y);
      y += nameSize * 1.18;
    }
    const subSize = flagship ? 0.058 : 0.05;
    ctx.font = `${subSize}px AtelierBody, Helvetica, sans-serif`;
    // drawTracked places one glyph at a time from a left edge it computes
    // itself, so the centring must come off — with textAlign still "center"
    // every letter would be centred on its own pen position.
    ctx.textAlign = "left";
    ctx.globalAlpha = pass.alpha * (pass.ink ? 1 : 0.72);
    y += 0.09;
    let sub = offer.sub;
    const room = w - F_IN * 2 - 0.14;
    const track = subSize * 0.16;
    // wrapTo cannot see the tracking, so the price line is split by hand
    const subLines: string[] = [];
    while (sub) {
      const words = sub.split(" ");
      let cur = "";
      while (words.length && trackedWidth(ctx, `${cur} ${words[0]}`.trim(), track) <= room) {
        cur = `${cur} ${words.shift()}`.trim();
      }
      subLines.push(cur || words.shift() || "");
      sub = words.join(" ");
    }
    for (const line of subLines) {
      drawTracked(ctx, line, w / 2, y, track);
      y += subSize * 1.5;
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  faceCache.set(offer.id, tex);
  return tex;
}

function getCardFace(offer: Offer, w: number, h: number, flagship: boolean) {
  const hit = faceLoads.get(offer.id);
  if (hit) return hit;
  const job = bakeFace(offer, w, h, flagship);
  faceLoads.set(offer.id, job);
  return job;
}

function useCardFace(offer: Offer, w: number, h: number, flagship: boolean) {
  const [tex, setTex] = useState<THREE.Texture | null>(
    () => faceCache.get(offer.id) ?? null,
  );
  const [shown, setShown] = useState(offer.id);
  if (shown !== offer.id) {
    setShown(offer.id);
    setTex(faceCache.get(offer.id) ?? null);
  }
  // Held back until the journey is two thirds down. These cards mount at canvas
  // boot, and baking three of them there means three font loads, six ornament
  // passes and about 5MB of texture upload competing with the hero for the
  // first seconds — for a scene the visitor cannot reach yet. 0.5 leaves a
  // quarter of the journey to bake in before the chapter opens at 0.735.
  const warm = useExperience((s) => s.progress > 0.5);
  useEffect(() => {
    if (!warm || faceCache.has(offer.id)) return;
    let live = true;
    getCardFace(offer, w, h, flagship)
      .then((t) => {
        if (live) setTex(t);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [warm, offer, w, h, flagship]);
  return tex;
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
 * THE GATEWAY. Still a flat quad with 3D type on it: it keeps square corners,
 * corner brackets and a gold frame because it is a DOOR, not a card, and the
 * two should not read as the same kind of object. It is also the only thing in
 * this room carrying a price, and the only one whose copy has to stay crisp at
 * the size the camera stops in front of it.
 */
function GatewayPanel({
  offer,
  x,
  z,
  w,
  h,
}: {
  offer: Offer;
  x: number;
  z: number;
  w: number;
  h: number;
}) {
  const group = useRef<THREE.Group>(null);
  const alive = useChapterAlive();
  const described = useExperience((s) => s.hover === offer.id);

  useFrame((_, delta) => {
    if (alive && !alive.current) return;
    if (!group.current) return;
    const damp = 1 - Math.exp(-7 * delta);
    const lift = described ? 0.12 : 0;
    group.current.position.y += (lift - group.current.position.y) * damp;
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={group} {...describes(offer.id)}>
        <mesh position={[0, h / 2, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#191305" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh
          geometry={getOutline(w, h, true)}
          material={getFrameMaterial(described ? GOLD_LIGHT : GOLD)}
          position={[0, h / 2, 0.004]}
        />
        {/* Text sits in the UPPER part of the panel on purpose: the scroll
            overlay owns the bottom third of the screen. Every maxWidth is
            derived from the panel it is on — a fixed 1.9 on a 1.7-wide gateway
            is exactly why its own name once hung over its frame. */}
        {offer.eyebrow && (
          <Text
            font={INTER}
            fontSize={0.066}
            letterSpacing={0.3}
            color={GOLD}
            position={[0, h - 0.22, 0.012]}
            anchorX="center"
            maxWidth={w - 0.2}
            textAlign="center"
          >
            {offer.eyebrow}
          </Text>
        )}
        <Text
          font={FRAUNCES}
          fontSize={0.155}
          letterSpacing={0.04}
          color={GOLD_LIGHT}
          position={[0, h - 0.48, 0.012]}
          anchorX="center"
          anchorY="top"
          maxWidth={w - 0.3}
          textAlign="center"
          outlineWidth="3%"
          outlineOffsetX="2%"
          outlineOffsetY="-2%"
          outlineBlur="4%"
          outlineColor="#000000"
          outlineOpacity={0.7}
        >
          {offer.label}
        </Text>
        <Text
          font={INTER}
          fontSize={0.072}
          letterSpacing={0.13}
          color={GOLD}
          // clears two wrapped lines of the name above it
          position={[0, h - 0.95, 0.012]}
          anchorX="center"
          anchorY="top"
          maxWidth={w - 0.2}
          textAlign="center"
          outlineWidth="4%"
          outlineOffsetX="2%"
          outlineOffsetY="-2%"
          outlineBlur="5%"
          outlineColor="#000000"
          outlineOpacity={0.6}
        >
          {offer.sub}
        </Text>
      </group>
      <BlobShadow position={[0, 0.012, 0]} scale={2.8} />
    </group>
  );
}

/**
 * ONE PROGRAMME CARD. Three pieces of geometry, no 3D type at all:
 *
 *   1. the slab — extruded, sharp-cornered, chamfered all the way round. The
 *      only lit surface here, and the reason the card has an edge for the gold
 *      light overhead to find. A plane had none, which is why the previous
 *      version read as a printed rectangle rather than an object in a room.
 *   2. the face — one baked texture: frame, filigree, arabesque, name, price.
 *   3. the gloss — an additive highlight that follows the cursor across it.
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
  const face = useCardFace(offer, w, h, flagship);
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
        <mesh geometry={getCardGeometry(w, h)} position={[0, h / 2, 0]}>
          {/* Less rough and more metal than the flat version was: the chamfer
              needs something to reflect or it is just a fold. */}
          <meshStandardMaterial color={STONE} roughness={0.48} metalness={0.45} />
        </mesh>
        {face && (
          <mesh
            position={[0, h / 2, 0.004]}
            // The spot is taken from the raycast hit rather than from the
            // screen-space pointer, so it lands under the cursor whatever
            // angle the card is seen at. Touch never fires this and gets the
            // parked highlight instead.
            onPointerMove={(e) => {
              if (!e.uv) return;
              spot.current.set(e.uv.x, e.uv.y);
            }}
          >
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial map={face} toneMapped={false} />
          </mesh>
        )}
        <mesh ref={glossMesh} position={[0, h / 2, 0.01]} material={gloss}>
          <planeGeometry args={[w, h]} />
        </mesh>
      </group>
      <BlobShadow position={[0, 0.012, 0]} scale={2.2} />
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

        {/* LEVEL 1 — the gateway, in front and lit hardest */}
        <GatewayPanel offer={OFFERS.gate} x={0} z={GATE_Z} w={GATE_W} h={GATE_H} />
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
