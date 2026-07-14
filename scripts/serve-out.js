// Minimal, robust static server for the exported site (clean URLs like
// Netlify: /about → about.html, /404.html fallback). No deps.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "out");
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const safe = path.normalize(clean).replace(/^(\.\.[/\\])+/, "");
  const candidates =
    safe === "/" || safe === "\\"
      ? ["index.html"]
      : [safe, `${safe}.html`, path.join(safe, "index.html")];
  for (const c of candidates) {
    const p = path.join(ROOT, c);
    if (p.startsWith(ROOT) && fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

http
  .createServer((req, res) => {
    try {
      const file = resolve(req.url || "/");
      if (!file) {
        const nf = path.join(ROOT, "404.html");
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "Not found");
        return;
      }
      res.writeHead(200, {
        "content-type": MIME[path.extname(file)] || "application/octet-stream",
        "cache-control": "no-cache",
      });
      fs.createReadStream(file).pipe(res);
    } catch (e) {
      res.writeHead(500);
      res.end("error");
    }
  })
  .listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}`));
