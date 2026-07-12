// Workaround for a Next.js 16.2.10 static-export bug: the client segment
// cache requests dot-joined RSC payload filenames
// (`__next.about.__PAGE__.txt` — segment-value-encoding.js uses a GLOBAL
// slash→dot replace) but the exporter only replaces the FIRST slash and
// emits nested directories (`__next.about/__PAGE__.txt`). Every prefetch
// then 404s on a plain static host and navigation falls back to full page
// loads. This flattens the nested dirs to the dot-joined filenames the
// client actually requests. Drop this script once Next fixes the exporter.
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

let moved = 0;

function collectFiles(dir, rel = []) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) files.push(...collectFiles(p, [...rel, entry]));
    else files.push({ path: p, parts: [...rel, entry] });
  }
  return files;
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (!statSync(p).isDirectory()) continue;
    if (entry.startsWith("__next")) {
      for (const f of collectFiles(p)) {
        const flat = [entry, ...f.parts].join(".");
        renameSync(f.path, join(dir, flat));
        moved++;
      }
      rmSync(p, { recursive: true, force: true });
    } else {
      walk(p);
    }
  }
}

walk(OUT);
console.log(`fix-segment-export: flattened ${moved} RSC payload file(s)`);
