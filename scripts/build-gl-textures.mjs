/**
 * Pre-bakes the two proof portraits into WebGL-ready textures.
 *
 * The 3D gallery (components/experience/chapters.tsx) draws each portrait onto
 * a 768px canvas and uploads it as a CanvasTexture. It used to fetch the raw
 * sources through /_next/image?w=750, which meant the first visitor waited on
 * the server resizing a 10-megapixel JPEG on demand, and the whole 3D scene
 * depended on the image optimizer being reachable.
 *
 * This bakes the same cover-crop ahead of time so the browser downloads a file
 * that is already the exact size the texture needs.
 *
 * Run after replacing either source photo:
 *   node scripts/build-gl-textures.mjs
 *
 * sharp is not a direct dependency — it arrives with Next's image optimizer.
 * If this ever fails with "Cannot find module 'sharp'", install it as a
 * devDependency.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";

// Must match PORTRAIT_ASPECT and the high-tier width in chapters.tsx.
const W = 768;
const H = Math.round(W / (1.32 / 1.72)); // 1001

const JOBS = [
  {
    src: "public/aditya/before/before_transformation.png",
    out: "public/aditya/before/before_transformation_gl.jpg",
  },
  {
    src: "public/aditya/after/after_transformation.jpg",
    out: "public/aditya/after/after_transformation_gl.jpg",
  },
];

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

for (const { src, out } of JOBS) {
  const before = (await stat(src)).size;
  await sharp(src)
    // "cover" + centre reproduces the crop the canvas was doing at runtime,
    // so the framing is unchanged.
    .resize(W, H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);
  const after = (await stat(out)).size;
  console.log(`${src}\n  → ${out}  ${W}×${H}  ${kb(before)} → ${kb(after)}`);
}
