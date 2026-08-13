/**
 * Pre-bakes every photograph the 3D journey shows into WebGL-ready textures.
 *
 * The canvas uploads these straight to the GPU, so each file is baked to the
 * exact panel aspect and the exact size the texture needs. Raw sources run up
 * to 2924×3899 — uploaded as-is that is ~45MB of VRAM apiece, which is what
 * tips a mid-range phone into the frame-rate watchdog. The sources also used
 * to be fetched through /_next/image?w=750, which made the first visitor wait
 * on the server resizing a 10-megapixel JPEG and tied the whole 3D scene to
 * the image optimizer being reachable.
 *
 * Run after replacing ANY source photograph:
 *   node scripts/build-gl-textures.mjs
 *
 * sharp is not a direct dependency — it arrives with Next's image optimizer.
 * If this ever fails with "Cannot find module 'sharp'", install it as a
 * devDependency.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";

/** Every panel in the journey is this aspect — see PORTRAIT_ASPECT. */
const ASPECT = 1.32 / 1.72;

// Chapter 1 shows Aditya's own pair large and close; the proof gallery sits
// further back and cycles four sets, so its panels render at roughly 355 CSS
// px on a capped-DPR phone. 448 covers that without eight oversized uploads.
const HERO_W = 768;
const PROOF_W = 448;

/**
 * `pos` mirrors the CSS object-position in lib/transformations.ts, so a
 * photograph is framed identically on /results and inside the canvas. Keep the
 * two tables in step — this is a build script and cannot import the TS module.
 */
const JOBS = [
  // ---- chapter 1: the coach's own transformation ----
  // Centre-cropped, which is how these two were already framed — the 50% 22%
  // default belongs to the /results wells, not here.
  { src: "public/aditya/before/before_transformation.png", w: HERO_W, pos: "50% 50%" },
  { src: "public/aditya/after/after_transformation.jpg", w: HERO_W, pos: "50% 50%" },

  // ---- chapter 3: the proof gallery ----
  { src: "public/client/client-01-before.jpg", w: PROOF_W },
  { src: "public/client/client-01-after.jpg", w: PROOF_W },
  { src: "public/client/client-02-before.jpg", w: PROOF_W },
  { src: "public/client/client-02-after.jpg", w: PROOF_W },
  { src: "public/client/client-03-before.jpg", w: PROOF_W, pos: "52% 8%" },
  { src: "public/client/client-03-after.jpg", w: PROOF_W },
  { src: "public/client/client-04-before.png", w: PROOF_W, pos: "50% 30%" },
  { src: "public/client/client-04-after.png", w: PROOF_W, pos: "50% 55%" },
];

/** Same rule as `glTexture()` in lib/transformations.ts. */
const outPath = (src) => src.replace(/\.(jpe?g|png)$/i, "_gl.jpg");

/** "52% 8%" → [0.52, 0.08]; the CSS default for these wells is 50% 22%. */
function parsePos(pos = "50% 22%") {
  const [x, y] = pos.trim().split(/\s+/).map((v) => parseFloat(v) / 100);
  return [x, y];
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

for (const { src, w, pos } of JOBS) {
  const W = w;
  const H = Math.round(W / ASPECT);
  const sizeBefore = (await stat(src)).size;
  const out = outPath(src);

  // sharp's `position` only takes gravities, so the object-position crop is
  // done by hand: scale to cover, then extract the window those percentages
  // pick out. Rounding is clamped so a 1px overshoot can never throw.
  const meta = await sharp(src).metadata();
  const scale = Math.max(W / meta.width, H / meta.height);
  const sw = Math.max(W, Math.round(meta.width * scale));
  const sh = Math.max(H, Math.round(meta.height * scale));
  const [px, py] = parsePos(pos);

  await sharp(src)
    .resize(sw, sh)
    .extract({
      left: Math.min(sw - W, Math.max(0, Math.round((sw - W) * px))),
      top: Math.min(sh - H, Math.max(0, Math.round((sh - H) * py))),
      width: W,
      height: H,
    })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);

  const sizeAfter = (await stat(out)).size;
  console.log(
    `${src}\n  → ${out}  ${W}×${H}  ${kb(sizeBefore)} → ${kb(sizeAfter)}`,
  );
}
