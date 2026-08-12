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

  useFrame((state, delta) => {
    if (!alive.current) return;
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
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5} enabled={visible}>
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

/* ============ CHAPTER 1 — THE MAN: rough stone vs carved gold ============ */

function Pedestal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 0.6, 40]} />
        <meshStandardMaterial color="#1a1712" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.045, 40]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
      </mesh>
      <BlobShadow position={[0, 0.011, 0]} scale={2.6} />
    </group>
  );
}

export function TheMan() {
  const rough = useRef<THREE.Mesh>(null);
  const carved = useRef<THREE.Group>(null);
  const { alive } = useChapterVisibility(-16);

  useFrame((state) => {
    if (!alive.current) return;
    const t = state.clock.elapsedTime;
    if (rough.current) rough.current.rotation.y = t * 0.1;
    if (carved.current) carved.current.rotation.y = -t * 0.14;
  });

  return (
    <ChapterAlive.Provider value={alive}>
    <group position={[0, 0, -16]}>
      {/* BEFORE — the unshaped boulder */}
      <group position={[-1.7, 0, 0]}>
        <Pedestal position={[0, 0, 0]} />
        <mesh ref={rough} position={[0, 1.35, 0]}>
          <icosahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial color="#232019" roughness={0.95} metalness={0.05} flatShading />
        </mesh>
        <Text
          font={INTER}
          fontSize={0.11}
          letterSpacing={0.28}
          color="#8a847a"
          position={[0, 0.15, 0.95]}
          anchorX="center"
        >
          BEFORE
        </Text>
        <Hotspot id="man-before" position={[0.75, 1.55, 0.3]} />
      </group>

      {/* AFTER — the carved golden column */}
      <group position={[1.7, 0, 0]}>
        <Pedestal position={[0, 0, 0]} />
        <group ref={carved} position={[0, 1.42, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.42, 1.15, 8]} />
            <meshStandardMaterial
              color={GOLD}
              metalness={1}
              roughness={0.2}
              emissive={GOLD}
              emissiveIntensity={0.16}
            />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.15} />
          </mesh>
        </group>
        <Text
          font={INTER}
          fontSize={0.11}
          letterSpacing={0.28}
          color={GOLD}
          position={[0, 0.15, 0.95]}
          anchorX="center"
        >
          AFTER
        </Text>
        <Hotspot id="man-after" position={[-0.75, 1.7, 0.3]} />
        <pointLight position={[0, 2.6, 1.2]} intensity={4} color={GOLD_LIGHT} distance={6} />
      </group>
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

/** canvas plane is 1.32 × 1.72 — portraits are cover-cropped to match it */
const PORTRAIT_ASPECT = 1.32 / 1.72;

/** Shown until the photo decodes, and kept as the floor if it never does. */
function makeSilhouette(after: boolean) {
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
  return tex;
}

/**
 * Real proof portrait, baked to a cover-cropped, downscaled CanvasTexture.
 * The source files are up to 2887×3608 — uploaded raw that is ~40MB of VRAM
 * per frame, which is exactly what tips a mid-range phone into the perf
 * watchdog. Decode failure leaves the silhouette in place rather than a
 * black panel.
 */
function usePortraitTexture(after: boolean) {
  const gl = useThree((s) => s.gl);
  const [tex, setTex] = useState<THREE.Texture>(() => makeSilhouette(after));
  const live = useRef<THREE.Texture | null>(null);
  if (live.current === null) live.current = tex;

  useEffect(() => () => live.current?.dispose(), []);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      const w = useExperience.getState().quality === "low" ? 512 : 768;
      const h = Math.round(w / PORTRAIT_ASPECT);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      // cover fit — crop the long axis, never letterbox inside the gold frame
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const next = new THREE.CanvasTexture(c);
      next.colorSpace = THREE.SRGBColorSpace;
      // frames sit at ±0.32rad — without this the grazing angle smears
      next.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      const prev = live.current;
      live.current = next;
      setTex(next);
      prev?.dispose();
    };
    img.src = PORTRAIT_SRC[after ? "after" : "before"];
    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [after, gl]);

  return tex;
}

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
  return (
    <Float
      speed={1.1}
      rotationIntensity={0.06}
      floatIntensity={0.35}
      enabled={floating}
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

  useFrame((state) => {
    if (!alive.current) return;
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
        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7} enabled={visible}>
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
