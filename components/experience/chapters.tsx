"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import Hotspot from "./Hotspot";
import { useExperience } from "./store";

const FRAUNCES = "/fonts/fraunces-500.ttf";
const INTER = "/fonts/inter-500.ttf";

const GOLD = "#c9a24b";
const GOLD_LIGHT = "#e8d9a8";
const STONE = "#131210";
const IVORY = "#f4f1ea";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------- shared: cheap blob shadow (radial gradient sprite) ---------- */

function useBlobShadow() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function BlobShadow({
  position,
  scale = 2,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const tex = useBlobShadow();
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

/* ================= CHAPTER 0 — ARRIVAL: the gold seal ================= */

export function Arrival() {
  const outer = useRef<THREE.Mesh>(null);
  const mid = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  // landscape: seal lives right-of-frame so the headline owns the left;
  // portrait: seal centered high above the bottom text block
  const { size } = useThree();
  const landscape = size.width > size.height;
  const sealX = landscape ? 2.35 : 0;
  const sealY = landscape ? 1.55 : 2.35;

  useFrame((state, delta) => {
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
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <mesh ref={outer}>
          <torusGeometry args={[1.15, 0.028, 12, 96]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
        </mesh>
        <mesh ref={mid} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
          <torusGeometry args={[0.86, 0.022, 12, 96]} />
          <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.18} />
        </mesh>
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color={GOLD}
            metalness={0.95}
            roughness={0.25}
            emissive={GOLD}
            emissiveIntensity={0.55}
            flatShading
          />
        </mesh>
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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rough.current) rough.current.rotation.y = t * 0.1;
    if (carved.current) carved.current.rotation.y = -t * 0.14;
  });

  return (
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
  );
}

/* ====== CHAPTER 2 — THE ORDER: the foundation assembles itself ====== */

const SLABS = [
  { label: "LIFESTYLE FIRST", num: "01", w: 3.7, d: 2.5, id: "order-1" },
  { label: "NUTRITION", num: "02", w: 3.0, d: 2.05, id: "order-2" },
  { label: "SUPPLEMENTS", num: "03", w: 2.35, d: 1.6, id: "order-3" },
  { label: "MEDICAL", num: "04", w: 1.7, d: 1.15, id: "order-4" },
];
const SLAB_H = 0.52;

function Slab({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const s = SLABS[index];
  const finalY = SLAB_H / 2 + index * (SLAB_H + 0.06);
  const side = index % 2 === 0 ? 1 : -1;

  useFrame((_, delta) => {
    const { progress } = useExperience.getState();
    // staggered assembly window scrubbed by the journey
    const a = 0.3 + index * 0.038;
    const k = smooth(a, a + 0.1, progress);
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
  return (
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
  );
}

/* ========= CHAPTER 3 — THE PROOF: floating gallery frames ========= */

function usePortraitTexture(after: boolean) {
  return useMemo(() => {
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
  }, [after]);
}

function GalleryFrame({
  position,
  rotationY,
  after,
  hotspot,
  caption,
}: {
  position: [number, number, number];
  rotationY: number;
  after: boolean;
  hotspot?: string;
  caption: string;
}) {
  const tex = usePortraitTexture(after);
  return (
    <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.35}>
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
  return (
    <group position={[0, 0, -52]}>
      <GalleryFrame
        position={[-1.9, 1.8, 0]}
        rotationY={0.32}
        after={false}
        caption="BEFORE"
        hotspot="proof-client"
      />
      <GalleryFrame
        position={[1.9, 1.8, 0]}
        rotationY={-0.32}
        after
        caption="AFTER"
        hotspot="proof-truth"
      />
      <BlobShadow position={[-1.9, 0.012, 0]} scale={3} />
      <BlobShadow position={[1.9, 0.012, 0]} scale={3} />
      <pointLight position={[0, 3.4, 2.2]} intensity={5} color={GOLD_LIGHT} distance={9} />
    </group>
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

  useFrame((_, delta) => {
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
  useFrame((state) => {
    if (book.current) book.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <group position={[0, 0, -70]}>
      <Stele
        position={[0, 0, 0]}
        height={3.1}
        featured
        label="Discovery Consultation"
        sub="45 MINUTES · ONLINE VIA WHATSAPP"
        id="offer-discovery"
      />
      {/* four-program lineup flanking the Discovery gate (Aditya's brief 2026-07-14) */}
      <Stele
        position={[-3.5, 0, -1.1]}
        height={2.2}
        label="Lifestyle Coaching"
        sub="MONTHLY · PRICE AFTER CONSULTATION"
        id="offer-lifestyle"
      />
      <Stele
        position={[-1.85, 0, -0.5]}
        height={2.45}
        label="Presence & Personality"
        sub="MONTHLY · PRICE AFTER CONSULTATION"
        id="offer-presence"
      />
      <Stele
        position={[1.85, 0, -0.5]}
        height={2.45}
        label="Complete Transformation"
        sub="BOTH PILLARS · PRICE AFTER CONSULTATION"
        id="offer-complete"
      />
      <Stele
        position={[3.5, 0, -1.1]}
        height={2.2}
        label="Written Plans"
        sub="ONLINE · PRICE AFTER CONSULTATION"
        id="offer-written"
      />

      {/* the free blueprint — a floating golden folio off to the side */}
      <group position={[-1.6, 1.1, 4]}>
        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
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
  );
}
