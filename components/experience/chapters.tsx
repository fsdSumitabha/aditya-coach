"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import Hotspot from "./Hotspot";
import { useExperience } from "./store";
import { ChapterAlive, useChapterAlive, useChapterVisibility } from "./visibility";
import { LEGAL } from "@/lib/legal";

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
 * every panel that shows it. Chapter 1 (Aditya's own before/after) and
 * chapter 3 (the proof gallery) draw the same two files, so a per-instance
 * cache would have put four ~3MB textures on the GPU for two images.
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

/* ================= CHAPTER 0 — ARRIVAL: the gold seal ================= */

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
        {/* the centerpiece: a brilliant-cut diamond — a man, cut and polished */}
        <group ref={inner}>
          {/* crown (table → girdle) */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.17, 0.48, 0.28, 8, 1]} />
            <meshStandardMaterial
              color={GOLD}
              metalness={0.95}
              roughness={0.22}
              emissive={GOLD}
              emissiveIntensity={0.55}
              flatShading
            />
          </mesh>
          {/* pavilion (girdle → culet) */}
          <mesh position={[0, -0.26, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.48, 0.56, 8]} />
            <meshStandardMaterial
              color={GOLD_LIGHT}
              metalness={0.95}
              roughness={0.18}
              emissive={GOLD}
              emissiveIntensity={0.4}
              flatShading
            />
          </mesh>
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
 * The whole frame — a hairline rectangle plus four corner brackets — is twelve
 * rectangles merged into ONE ShapeGeometry, so it is a single draw call of
 * ~24 triangles rather than twelve meshes. Built once and shared by both
 * panels; only the material colour differs.
 */
let frameGeometry: THREE.ShapeGeometry | null = null;

function rect(cx: number, cy: number, w: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(cx - w / 2, cy - h / 2);
  s.lineTo(cx + w / 2, cy - h / 2);
  s.lineTo(cx + w / 2, cy + h / 2);
  s.lineTo(cx - w / 2, cy + h / 2);
  s.closePath();
  return s;
}

function getFrameGeometry() {
  if (frameGeometry) return frameGeometry;
  const rx = PANEL_W / 2 + MAT;
  const ry = PANEL_H / 2 + MAT;
  const shapes = [
    rect(0, ry, rx * 2 + LINE, LINE), // top
    rect(0, -ry, rx * 2 + LINE, LINE), // bottom
    rect(-rx, 0, LINE, ry * 2 + LINE), // left
    rect(rx, 0, LINE, ry * 2 + LINE), // right
  ];
  const bx = rx + TICK_OUT;
  const by = ry + TICK_OUT;
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      shapes.push(rect(sx * (bx - TICK / 2), sy * by, TICK, LINE));
      shapes.push(rect(sx * bx, sy * (by - TICK / 2), LINE, TICK));
    }
  }
  frameGeometry = new THREE.ShapeGeometry(shapes);
  return frameGeometry;
}

/** One unlit material per frame colour, shared across panels. */
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
  hotspot,
  floating,
}: {
  after: boolean;
  caption: string;
  hotspot: string;
  floating: boolean;
}) {
  const tex = usePortraitTexture(after);
  const calm = useExperience((s) => s.calm);
  // Gold is spent on the rebuild; the starting point gets a dim hairline.
  // The photographs themselves are never tinted or graded — "no filters".
  const line = after ? GOLD : "#4d483f";
  const side = after ? 1 : -1;

  return (
    <group position={[side * PANEL_X, 0, 0]}>
      <Float
        speed={1.05}
        rotationIntensity={0.05}
        floatIntensity={0.3}
        enabled={floating && !calm}
      >
        {/* the diptych opens toward the camera path */}
        <group position={[0, PANEL_Y, 0]} rotation={[0, -side * 0.22, 0]}>
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
            material={getFrameMaterial(line)}
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
          <Hotspot id={hotspot} position={[-side * 0.86, 0.45, 0.22]} size={0.07} />
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
        <ManPortrait after={false} caption="BEFORE" hotspot="man-before" floating={visible} />
        <ManPortrait after caption="AFTER" hotspot="man-after" floating={visible} />
      </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 2 — THE ORDER: the foundation assembles itself ====== */

// THE COMPLETE REBUILD (Aditya's framework, direction doc §6)
const SLABS = [
  { label: "LIFESTYLE", num: "01", w: 4.0, d: 2.6, id: "order-1" },
  { label: "BODY", num: "02", w: 3.4, d: 2.25, id: "order-2" },
  { label: "NUTRITION", num: "03", w: 2.8, d: 1.9, id: "order-3" },
  { label: "PERFORMANCE", num: "04", w: 2.2, d: 1.55, id: "order-4" },
  { label: "PRESENCE", num: "05", w: 1.6, d: 1.2, id: "order-5" },
];
const SLAB_H = 0.48;

function Slab({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const s = SLABS[index];
  const finalY = SLAB_H / 2 + index * (SLAB_H + 0.06);
  const side = index % 2 === 0 ? 1 : -1;
  const alive = useChapterAlive();

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
    <group ref={group} position={[0, finalY + 6, 0]}>
      <mesh>
        <boxGeometry args={[s.w, SLAB_H, s.d]} />
        <meshStandardMaterial color={STONE} roughness={0.55} metalness={0.35} />
      </mesh>
      {/* gold edge trim */}
      <mesh position={[0, -SLAB_H / 2 + 0.02, 0]}>
        <boxGeometry args={[s.w + 0.035, 0.03, s.d + 0.035]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.25}
          emissive={GOLD}
          emissiveIntensity={0.9}
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
      <Hotspot id={s.id} position={[s.w / 2 + 0.22, 0, 0.2]} size={0.07} />
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
        EVERYTHING SITS ON THIS
      </Text>
    </group>
    </ChapterAlive.Provider>
  );
}

/* ========= CHAPTER 3 — THE PROOF: floating gallery frames ========= */

// PLACEHOLDER CONTENT. These two frames are meant to carry a *client's*
// before/after, but no cleared client photo exists yet, so they borrow
// Aditya's — the same pair chapter 1 shows. Swap PORTRAIT_SRC's targets (or
// give this chapter its own pair) once the client images are edited and
// consent is on file. The museum-box frame here is deliberately left as-is.

function GalleryFrame({
  position,
  rotationY,
  after,
  hotspot,
  caption,
  floating,
}: {
  position: [number, number, number];
  rotationY: number;
  after: boolean;
  hotspot?: string;
  caption: string;
  floating: boolean;
}) {
  const tex = usePortraitTexture(after);
  const calm = useExperience((s) => s.calm);
  return (
    <Float
      speed={1.1}
      rotationIntensity={0.06}
      floatIntensity={0.35}
      enabled={floating && !calm}
    >
      <group position={position} rotation={[0, rotationY, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 1.9, 0.07]} />
          <meshStandardMaterial color="#0e0d0b" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[1.32, 1.72]} />
          <meshBasicMaterial map={tex} />
        </mesh>
        {/* gold frame lip */}
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[1.58, 1.98, 0.045]} />
          <meshStandardMaterial
            color={GOLD}
            metalness={1}
            roughness={0.28}
            emissive={GOLD}
            emissiveIntensity={0.22}
          />
        </mesh>
        <Text
          font={INTER}
          fontSize={0.085}
          letterSpacing={0.24}
          color={after ? GOLD : "#8a847a"}
          position={[0, -1.14, 0.05]}
          anchorX="center"
        >
          {caption}
        </Text>
        {hotspot && <Hotspot id={hotspot} position={[0.85, 0.6, 0.25]} size={0.07} />}
      </group>
    </Float>
  );
}

export function Proof() {
  const { alive, visible } = useChapterVisibility(-52);
  return (
    <ChapterAlive.Provider value={alive}>
    <group position={[0, 0, -52]}>
      <GalleryFrame
        position={[-1.9, 1.8, 0]}
        rotationY={0.32}
        after={false}
        caption="BEFORE"
        hotspot="proof-client"
        floating={visible}
      />
      <GalleryFrame
        position={[1.9, 1.8, 0]}
        rotationY={-0.32}
        after
        caption="AFTER"
        hotspot="proof-truth"
        floating={visible}
      />
      <BlobShadow position={[-1.9, 0.012, 0]} scale={3} />
      <BlobShadow position={[1.9, 0.012, 0]} scale={3} />
      <pointLight position={[0, 3.4, 2.2]} intensity={5} color={GOLD_LIGHT} distance={9} />
    </group>
    </ChapterAlive.Provider>
  );
}

/* ====== CHAPTER 4 — THE DECISION: three stelae + the blueprint ====== */

function Stele({
  position,
  height,
  featured,
  label,
  sub,
  id,
}: {
  position: [number, number, number];
  height: number;
  featured?: boolean;
  label: string;
  sub: string;
  id: string;
}) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const setFocus = useExperience((s) => s.setFocus);
  const focused = useExperience((s) => s.focus === id);
  const alive = useChapterAlive();

  useFrame((_, delta) => {
    if (alive && !alive.current) return;
    if (!group.current) return;
    const damp = 1 - Math.exp(-7 * delta);
    const lift = hover || focused ? 0.14 : 0;
    group.current.position.y += (position[1] + lift - group.current.position.y) * damp;
  });

  return (
    <group
      ref={group}
      position={position}
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
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.45, height, 0.26]} />
        <meshStandardMaterial
          color={featured ? "#161206" : STONE}
          roughness={featured ? 0.35 : 0.6}
          metalness={featured ? 0.7 : 0.35}
        />
      </mesh>
      {/* gold rim */}
      <mesh position={[0, height / 2, -0.02]}>
        <boxGeometry args={[1.53, height + 0.08, 0.18]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.3}
          emissive={GOLD}
          emissiveIntensity={featured ? (hover || focused ? 2.6 : 1.5) : hover || focused ? 1.2 : 0.35}
        />
      </mesh>
      <Text
        font={FRAUNCES}
        fontSize={0.155}
        letterSpacing={0.06}
        color={featured ? GOLD_LIGHT : IVORY}
        position={[0, height - 0.42, 0.145]}
        anchorX="center"
        maxWidth={1.2}
        textAlign="center"
      >
        {label}
      </Text>
      <Text
        font={INTER}
        fontSize={0.075}
        letterSpacing={0.14}
        color={featured ? GOLD : "#8a847a"}
        position={[0, height - 0.85, 0.145]}
        anchorX="center"
        maxWidth={1.2}
        textAlign="center"
      >
        {sub}
      </Text>
      {featured && (
        <Text
          font={INTER}
          fontSize={0.07}
          letterSpacing={0.3}
          color={GOLD}
          position={[0, 0.3, 0.145]}
          anchorX="center"
        >
          RECOMMENDED
        </Text>
      )}
      <BlobShadow position={[0, 0.012 - position[1], 0]} scale={2.4} />
    </group>
  );
}

export function Decision() {
  const book = useRef<THREE.Group>(null);
  const { alive, visible } = useChapterVisibility(-70);
  const calm = useExperience((s) => s.calm);

  useFrame((state) => {
    if (!alive.current) return;
    // Reduced motion: the folio stops turning.
    if (useExperience.getState().calm) return;
    if (book.current) book.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <ChapterAlive.Provider value={alive}>
    <group position={[0, 0, -70]}>
      {/* the gate + the three programs (direction doc §4 + §9) */}
      <Stele
        position={[0, 0, 0]}
        height={3.05}
        featured
        label="Transformation Audit"
        sub={`${LEGAL.CONSULT_PRICE} · 45 MINUTES · ONLINE`}
        id="offer-audit"
      />
      <Stele
        position={[-3.4, 0, -0.9]}
        height={2.25}
        label="Lifestyle Coaching"
        sub="MONTHLY · PRICE AFTER YOUR AUDIT"
        id="offer-lifestyle"
      />
      <Stele
        position={[-1.7, 0, -0.4]}
        height={2.45}
        label="Personality & Presence"
        sub="MONTHLY · PRICE AFTER YOUR AUDIT"
        id="offer-presence"
      />
      <Stele
        position={[2.6, 0, -0.5]}
        height={2.85}
        label="Complete Transformation"
        sub="PREMIUM · THE FULL SYSTEM"
        id="offer-complete"
      />

      {/* the free blueprint — a floating golden folio off to the side */}
      <group position={[-1.6, 1.1, 4]}>
        <Float
          speed={1.6}
          rotationIntensity={0.25}
          floatIntensity={0.7}
          enabled={visible && !calm}
        >
          <group ref={book}>
            <mesh>
              <boxGeometry args={[0.5, 0.68, 0.06]} />
              <meshStandardMaterial color="#161206" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[-0.24, 0, 0]}>
              <boxGeometry args={[0.05, 0.68, 0.075]} />
              <meshStandardMaterial
                color={GOLD}
                metalness={1}
                roughness={0.25}
                emissive={GOLD}
                emissiveIntensity={1.1}
              />
            </mesh>
          </group>
        </Float>
        <Hotspot id="blueprint" position={[0.45, 0.35, 0.15]} size={0.07} />
      </group>

      <pointLight position={[0, 4, 2.8]} intensity={8} color={GOLD_LIGHT} distance={12} />
    </group>
    </ChapterAlive.Provider>
  );
}
