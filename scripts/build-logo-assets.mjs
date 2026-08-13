/**
 * Bake the brand logo assets from the master file.
 *
 * `design/aku_logo-master.svg` is not really a vector: it is a 1600x900 PNG
 * painted through a second PNG used as a luminance mask, wrapped in SVG
 * (~410 KB). Shipping that into the header would cost half a megabyte for a
 * 30px-tall mark, and it carries two things we never want on the site: the
 * "02." option label from the designer's sheet and the decorative outer frame.
 * That is why it lives in design/ and is never served.
 *
 * So we flatten mask -> alpha once, un-premultiply the black matte off the
 * edges (so the gold stays clean on light surfaces too, e.g. e-mail clients),
 * crop the pieces we actually use, and write:
 *
 *   public/logo/aku-mark.png     AKU monogram          -> header, footer, overlay
 *   public/logo/aku-wordmark.png AKU + name, no tagline -> header, overlay, footer
 *   public/logo/aku-lockup.png   full stacked lockup   -> large uses
 *   public/logo/aku-lockup.svg   full lockup as SVG    -> hand-off / print / e-mail
 *   public/apple-touch-icon.png  180x180 on warm black -> iOS home screen
 *   public/icon-512.png          512x512 on warm black -> PWA manifest
 *
 * The served aku_logo.svg is the cleaned lockup (no "02.", no frame) and is
 * ~1/8th the master's weight, but it is still a raster in an SVG wrapper, so
 * next/image cannot optimise it — prefer the PNGs in the app.
 *
 * Run after the master logo changes:  node scripts/build-logo-assets.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "design", "aku_logo-master.svg");

/** Content boxes measured off the master (1600x900 user space). */
const MARK = { left: 321, top: 162, width: 947, height: 310 };
const NAME = { left: 223, top: 527, width: 1167, height: 46 };
const LOCKUP = { left: 223, top: 162, width: 1167, height: 543 };

/**
 * Gap between monogram and name in the wordmark variant. The master leaves 56
 * units of air there, which is right for a poster and too loose at nav size —
 * tightening it buys back height that goes into the name instead of whitespace.
 */
const WORDMARK_GAP = 34;

/** Warm black behind the app icons — matches --bg-void. */
const VOID = { r: 11, g: 11, b: 12, alpha: 1 };

function extractEmbeddedPngs(svg) {
  const found = [...svg.matchAll(/xlink:href="data:image\/png;base64,([^"]+)"/g)];
  if (found.length !== 2) {
    throw new Error(`expected 2 embedded PNGs in the master logo, found ${found.length}`);
  }
  // Document order: [0] is the luminance mask, [1] is the colour artwork.
  return found.map((m) => Buffer.from(m[1], "base64"));
}

/** mask luminance -> alpha, and divide the black matte back out of the RGB. */
async function flatten(maskPng, colourPng) {
  const mask = await sharp(maskPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const colour = await sharp(colourPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = mask.info;
  if (colour.info.width !== width || colour.info.height !== height) {
    throw new Error("mask and artwork dimensions differ");
  }

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    const lum =
      0.2126 * mask.data[p] + 0.7152 * mask.data[p + 1] + 0.0722 * mask.data[p + 2];
    const a = Math.round((lum * mask.data[p + 3]) / 255);
    out[p + 3] = a;
    if (a === 0) continue;
    const k = 255 / a; // un-premultiply: the artwork is composited on black
    out[p] = Math.min(255, Math.round(colour.data[p] * k));
    out[p + 1] = Math.min(255, Math.round(colour.data[p + 1] * k));
    out[p + 2] = Math.min(255, Math.round(colour.data[p + 2] * k));
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

/** Centre `png` on a warm-black square with ~12% breathing room. */
async function appIcon(markPng, size, file) {
  const inner = Math.round(size * 0.76);
  const art = await sharp(markPng)
    .resize({ width: inner, fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });
  await sharp({ create: { width: size, height: size, channels: 4, background: VOID } })
    .composite([
      {
        input: art.data,
        left: Math.round((size - art.info.width) / 2),
        top: Math.round((size - art.info.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, "public", file));
  return file;
}

const svg = readFileSync(SRC, "utf8");
const [maskPng, colourPng] = extractEmbeddedPngs(svg);
const flat = await flatten(maskPng, colourPng);
const flatPng = await flat.png().toBuffer();

const markPng = await sharp(flatPng)
  .extract(MARK)
  .resize({ width: 480 })
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

const lockupPng = await sharp(flatPng)
  .extract(LOCKUP)
  .resize({ width: 760 })
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

/**
 * The wordmark: monogram + name, nothing else. The "LIFESTYLE & PERSONALITY
 * COACH" tagline and the diamond rule above it are dropped — at nav size they
 * collapse into a grey smudge. The two blocks are recomposed over a tighter
 * gap rather than cropped as one band, so none of the master's internal
 * whitespace is carried along; every pixel of height goes to artwork.
 */
const wordmarkPng = await (async () => {
  const mark = await sharp(flatPng).extract(MARK).png().toBuffer();
  const name = await sharp(flatPng).extract(NAME).png().toBuffer();
  const width = Math.max(MARK.width, NAME.width);
  const height = MARK.height + WORDMARK_GAP + NAME.height;
  // Compose at full size and resize in a second pass — sharp runs resize
  // before composite within one pipeline, which would shrink the canvas out
  // from under the layers.
  const composed = await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: mark, left: Math.round((width - MARK.width) / 2), top: 0 },
      {
        input: name,
        left: Math.round((width - NAME.width) / 2),
        top: MARK.height + WORDMARK_GAP,
      },
    ])
    .png()
    .toBuffer();

  return sharp(composed)
    .resize({ width: 960 })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
})();
const wordmarkMeta = await sharp(wordmarkPng).metadata();

const { writeFileSync } = await import("node:fs");
writeFileSync(path.join(ROOT, "public", "logo", "aku-mark.png"), markPng);
writeFileSync(path.join(ROOT, "public", "logo", "aku-lockup.png"), lockupPng);
writeFileSync(path.join(ROOT, "public", "logo", "aku-wordmark.png"), wordmarkPng);

// The cleaned lockup re-wrapped as SVG, so the brand file that ships is the
// same artwork minus the "02." label and the frame. Alpha is already baked in,
// so no mask/filter plumbing is needed this time.
const lockupSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
  `viewBox="0 0 ${LOCKUP.width} ${LOCKUP.height}" width="${LOCKUP.width}" height="${LOCKUP.height}" ` +
  `role="img" aria-label="AKU — Aditya Kumar Upadhyay, Lifestyle &amp; Personality Coach">` +
  `<image x="0" y="0" width="${LOCKUP.width}" height="${LOCKUP.height}" ` +
  `xlink:href="data:image/png;base64,${lockupPng.toString("base64")}"/></svg>`;
writeFileSync(path.join(ROOT, "public", "logo", "aku-lockup.svg"), lockupSvg);

// Icons get the un-scaled crop so the downscale happens once, from full res.
const markFull = await sharp(flatPng).extract(MARK).png().toBuffer();
await appIcon(markFull, 180, "apple-touch-icon.png");
await appIcon(markFull, 512, "icon-512.png");

const kb = (b) => `${(b.length / 1024).toFixed(1)} KB`;
console.log(`logo/aku-mark.png      ${kb(markPng)}`);
console.log(`logo/aku-lockup.png    ${kb(lockupPng)}`);
console.log(
  `logo/aku-wordmark.png  ${kb(wordmarkPng)}  ` +
    `${wordmarkMeta.width}x${wordmarkMeta.height}  ` +
    `<Image width={${wordmarkMeta.width}} height={${wordmarkMeta.height}}>`,
);
console.log(`apple-touch-icon.png + icon-512.png rebuilt`);
