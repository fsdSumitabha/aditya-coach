/**
 * A very small PDF writer, and the Transformation Audit layout built on it.
 *
 * Why hand-rolled: the audit PDF has to be produced in the browser (so the
 * client gets an instant download) and then posted to the server for the
 * coach's copy — one file, two destinations. The project ships no PDF
 * dependency and CONVENTIONS.md fences new packages, so this writes the
 * bytes directly: PDF 1.4, the base-14 Helvetica faces (no font embedding
 * needed) and JPEG images via DCTDecode.
 *
 * Browser-only — it measures nothing via the DOM, but it does re-encode the
 * photo and signature through a <canvas>. Import it from a "use client" file.
 */

import {
  AUDIT_STEPS,
  type AuditData,
  type AuditField,
  clientName,
  flattenFields,
  formatAnswer,
} from "./schema";

// ---------------------------------------------------------------------------
// WinAnsi encoding + Helvetica metrics
// ---------------------------------------------------------------------------

/** Unicode → WinAnsi byte for the punctuation this document actually uses. */
const WIN_ANSI_SPECIALS: Record<string, number> = {
  "…": 0x85, // …
  "‘": 0x91, // ‘
  "’": 0x92, // ’
  "“": 0x93, // “
  "”": 0x94, // ”
  "•": 0x95, // •
  "–": 0x96, // –
  "—": 0x97, // —
  "·": 0xb7, // ·
  " ": 0x20, // nbsp → plain space
};

/** Map a JS string onto WinAnsi code points; anything unmappable becomes "?". */
function toWinAnsi(text: string): number[] {
  const out: number[] = [];
  for (const char of text.replace(/[\r\n\t]+/g, " ")) {
    const special = WIN_ANSI_SPECIALS[char];
    if (special != null) {
      out.push(special);
      continue;
    }
    const code = char.codePointAt(0)!;
    // ₹ has no WinAnsi glyph. Nothing in the audit uses it today, but a future
    // price line would silently vanish — spell it out instead.
    if (char === "₹") {
      out.push(0x52, 0x73, 0x2e);
      continue;
    }
    out.push(code >= 0x20 && code <= 0xff ? code : 0x3f);
  }
  return out;
}

// Adobe's Helvetica / Helvetica-Bold widths for codes 32…126, in 1/1000 em.
// prettier-ignore
const W_REGULAR = [
  278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,
  556,556,556,556,556,556,556,556,556,556,
  278,278,584,584,584,556,1015,
  667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,
  278,278,278,469,556,333,
  556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,
  334,260,334,584,
];
// prettier-ignore
const W_BOLD = [
  278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,
  556,556,556,556,556,556,556,556,556,556,
  333,333,584,584,584,611,975,
  722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,
  333,278,333,584,556,333,
  556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,
  389,280,389,584,
];

/** Widths for the WinAnsi punctuation above, which sits outside 32…126. */
const W_HIGH_REGULAR: Record<number, number> = {
  0x85: 1000, 0x91: 222, 0x92: 222, 0x93: 333, 0x94: 333,
  0x95: 350, 0x96: 556, 0x97: 1000, 0xb7: 278,
};
const W_HIGH_BOLD: Record<number, number> = {
  0x85: 1000, 0x91: 278, 0x92: 278, 0x93: 500, 0x94: 500,
  0x95: 350, 0x96: 556, 0x97: 1000, 0xb7: 278,
};

/** Regular and oblique share metrics; only bold differs. */
export type FontKey = "r" | "b" | "i";

function glyphWidth(code: number, font: FontKey): number {
  const bold = font === "b";
  if (code >= 32 && code <= 126) return (bold ? W_BOLD : W_REGULAR)[code - 32];
  return (bold ? W_HIGH_BOLD : W_HIGH_REGULAR)[code] ?? 556;
}

/** Width of `text` in points at `size`, including letter-spacing `tracking`. */
function measure(text: string, font: FontKey, size: number, tracking = 0): number {
  const codes = toWinAnsi(text);
  let total = 0;
  for (const code of codes) total += glyphWidth(code, font);
  return (total * size) / 1000 + tracking * codes.length;
}

/** Greedy word wrap. Words longer than the column are broken by character. */
function wrap(
  text: string,
  font: FontKey,
  size: number,
  maxWidth: number,
  tracking = 0,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate, font, size, tracking) <= maxWidth || !line) {
        // A single word wider than the column still has to land somewhere.
        if (!line && measure(word, font, size, tracking) > maxWidth) {
          let piece = "";
          for (const char of word) {
            if (measure(piece + char, font, size, tracking) > maxWidth && piece) {
              lines.push(piece);
              piece = char;
            } else {
              piece += char;
            }
          }
          line = piece;
          continue;
        }
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length > 0 ? lines : [""];
}

// ---------------------------------------------------------------------------
// Byte plumbing
// ---------------------------------------------------------------------------

type Chunk = string | Uint8Array;

/** Latin-1: every char code is already one byte, which is what PDF wants. */
function latin1(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 0xff;
  return bytes;
}

/** A PDF literal string: WinAnsi bytes with `(`, `)` and `\` escaped. */
function pdfString(text: string): string {
  let out = "(";
  for (const code of toWinAnsi(text)) {
    const char = String.fromCharCode(code);
    if (char === "(" || char === ")" || char === "\\") out += "\\";
    out += char;
  }
  return `${out})`;
}

/** "#a9832f" → "0.663 0.514 0.184" (PDF wants 0…1 per channel) */
function rgb(hex: string): string {
  const value = hex.replace("#", "");
  return [0, 2, 4]
    .map((i) => (parseInt(value.slice(i, i + 2), 16) / 255).toFixed(3))
    .join(" ");
}

type PdfImage = { name: string; bytes: Uint8Array; w: number; h: number };

// ---------------------------------------------------------------------------
// Page/content builder
// ---------------------------------------------------------------------------

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M_LEFT = 54;
const M_RIGHT = 54;
const M_TOP = 58;
const M_BOTTOM = 62;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;

const INK = "#14120e";
const BODY = "#33302a";
const MUTED = "#8b8375";
const GOLD = "#a9832f";
const GOLD_DEEP = "#6e5418";
const HAIR = "#e4dbc8";
const WASH = "#faf5ea";

class PdfDoc {
  private pages: string[][] = [];
  private ops: string[] = [];
  private images: PdfImage[] = [];
  y = PAGE_H - M_TOP;

  constructor() {
    this.pages.push(this.ops);
  }

  addImage(image: PdfImage) {
    this.images.push(image);
  }

  newPage() {
    this.ops = [];
    this.pages.push(this.ops);
    this.y = PAGE_H - M_TOP;
  }

  /** Break to a new page when `height` would cross the bottom margin. */
  need(height: number) {
    if (this.y - height < M_BOTTOM) this.newPage();
  }

  gap(height: number) {
    this.y -= height;
  }

  rect(x: number, y: number, w: number, h: number, color: string) {
    this.ops.push(`${rgb(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  }

  hairline(x: number, y: number, w: number, color = HAIR) {
    this.rect(x, y, w, 0.7, color);
  }

  /** One line of text at an explicit baseline. Returns the advance width. */
  line(
    text: string,
    x: number,
    baseline: number,
    opts: { font?: FontKey; size?: number; color?: string; tracking?: number } = {},
  ): number {
    const { font = "r", size = 10, color = BODY, tracking = 0 } = opts;
    const fontRef = font === "b" ? "/F2" : font === "i" ? "/F3" : "/F1";
    this.ops.push(
      `BT ${rgb(color)} rg ${fontRef} ${size} Tf ${tracking ? `${tracking} Tc ` : ""}` +
        `1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm ${pdfString(text)} Tj${tracking ? " 0 Tc" : ""} ET`,
    );
    return measure(text, font, size, tracking);
  }

  /**
   * Flowing text from the current cursor. Paginates line by line, so a long
   * answer can straddle a page break without being clipped.
   */
  paragraph(
    text: string,
    opts: {
      x?: number;
      width?: number;
      font?: FontKey;
      size?: number;
      color?: string;
      leading?: number;
      tracking?: number;
    } = {},
  ) {
    const {
      x = M_LEFT,
      width = CONTENT_W,
      font = "r",
      size = 10,
      color = BODY,
      tracking = 0,
    } = opts;
    const leading = opts.leading ?? size * 1.45;
    for (const line of wrap(text, font, size, width, tracking)) {
      this.need(leading);
      this.y -= leading;
      if (line) this.line(line, x, this.y + leading * 0.24, { font, size, color, tracking });
    }
  }

  image(name: string, x: number, y: number, w: number, h: number) {
    this.ops.push(
      `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /${name} Do Q`,
    );
  }

  /** Stamp the running footer on every page, then serialise the file. */
  finish(footerLeft: string): Uint8Array {
    const total = this.pages.length;
    this.pages.forEach((ops, index) => {
      const y = M_BOTTOM - 22;
      ops.push(`${rgb(HAIR)} rg ${M_LEFT} ${y + 14} ${CONTENT_W} 0.7 re f`);
      ops.push(
        `BT ${rgb(MUTED)} rg /F1 8 Tf 1 0 0 1 ${M_LEFT} ${y} Tm ${pdfString(footerLeft)} Tj ET`,
      );
      const page = `Page ${index + 1} of ${total}`;
      const x = PAGE_W - M_RIGHT - measure(page, "r", 8);
      ops.push(`BT ${rgb(MUTED)} rg /F1 8 Tf 1 0 0 1 ${x.toFixed(2)} ${y} Tm ${pdfString(page)} Tj ET`);
    });
    return serialise(this.pages, this.images);
  }
}

function serialise(pages: string[][], images: PdfImage[]): Uint8Array {
  const chunks: Chunk[] = [];
  let length = 0;
  const push = (chunk: Chunk) => {
    chunks.push(chunk);
    length += chunk.length;
  };

  // Object numbering: 1 catalog, 2 pages, 3-5 fonts, then images, then one
  // page + one content stream per page.
  const firstImage = 6;
  const firstPage = firstImage + images.length;
  const pageObj = (i: number) => firstPage + i * 2;
  const contentObj = (i: number) => firstPage + i * 2 + 1;

  const offsets: number[] = [];
  const begin = (number: number) => {
    offsets[number] = length;
    push(`${number} 0 obj\n`);
  };
  const end = () => push("endobj\n");

  push("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n");

  begin(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\n");
  end();

  begin(2);
  const kids = pages.map((_, i) => `${pageObj(i)} 0 R`).join(" ");
  push(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pages.length} >>\n`);
  end();

  const faces = ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique"];
  faces.forEach((face, i) => {
    begin(3 + i);
    push(`<< /Type /Font /Subtype /Type1 /BaseFont /${face} /Encoding /WinAnsiEncoding >>\n`);
    end();
  });

  images.forEach((image, i) => {
    begin(firstImage + i);
    push(
      `<< /Type /XObject /Subtype /Image /Width ${image.w} /Height ${image.h} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`,
    );
    push(image.bytes);
    push("\nendstream\n");
    end();
  });

  const xobjects =
    images.length > 0
      ? ` /XObject << ${images.map((im, i) => `/${im.name} ${firstImage + i} 0 R`).join(" ")} >>`
      : "";

  pages.forEach((ops, i) => {
    const content = `${ops.join("\n")}\n`;
    begin(pageObj(i));
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >>${xobjects} >> ` +
        `/Contents ${contentObj(i)} 0 R >>\n`,
    );
    end();

    begin(contentObj(i));
    push(`<< /Length ${latin1(content).length} >>\nstream\n`);
    push(content);
    push("endstream\n");
    end();
  });

  const size = contentObj(pages.length - 1) + 1;
  const xrefStart = length;
  push(`xref\n0 ${size}\n0000000000 65535 f \n`);
  for (let i = 1; i < size; i++) {
    push(`${String(offsets[i] ?? 0).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let cursor = 0;
  for (const chunk of chunks) {
    const bytes = typeof chunk === "string" ? latin1(chunk) : chunk;
    out.set(bytes, cursor);
    cursor += bytes.length;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Images: everything goes through <canvas> so the PDF only ever sees JPEG
// ---------------------------------------------------------------------------

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image decode failed"));
    img.src = src;
  });
}

/** Re-encode a data URL as baseline JPEG on white (PNG signatures are alpha). */
async function toJpeg(
  dataUrl: string,
  maxDim: number,
): Promise<{ bytes: Uint8Array; w: number; h: number } | null> {
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const base64 = canvas.toDataURL("image/jpeg", 0.86).split(",")[1] ?? "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { bytes, w, h };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// The audit layout
// ---------------------------------------------------------------------------

const LABEL_W = 158;
const VALUE_X = M_LEFT + LABEL_W + 14;
const VALUE_W = CONTENT_W - LABEL_W - 14;

function eyebrowLine(doc: PdfDoc, text: string, color = GOLD) {
  doc.need(22);
  doc.gap(16);
  doc.need(12);
  doc.y -= 10;
  doc.line(text.toUpperCase(), M_LEFT, doc.y, { font: "b", size: 8, color, tracking: 1.1 });
  doc.gap(4);
}

/** Label on the left, answer on the right — the form's default row. */
function answerRow(doc: PdfDoc, label: string, value: string) {
  const labelLines = wrap(label, "r", 9, LABEL_W);
  const valueLines = wrap(value, "b", 10.5, VALUE_W);
  const height = Math.max(labelLines.length * 12.5, valueLines.length * 14) + 9;
  doc.need(height);
  const top = doc.y;
  labelLines.forEach((line, i) => {
    doc.line(line, M_LEFT, top - 10 - i * 12.5, { size: 9, color: MUTED });
  });
  const blank = value === "—";
  valueLines.forEach((line, i) => {
    doc.line(line, VALUE_X, top - 10 - i * 14, {
      font: blank ? "r" : "b",
      size: 10.5,
      color: blank ? "#b9b1a1" : INK,
    });
  });
  doc.y = top - height;
  doc.hairline(M_LEFT, doc.y + 4, CONTENT_W, "#f0e9db");
}

/** Long-form answers get the full column width under their question. */
function stackedRow(doc: PdfDoc, label: string, value: string) {
  const valueLines = wrap(value, "r", 10.5, CONTENT_W - 10);
  doc.need(30 + valueLines.length * 14);
  doc.gap(12);
  doc.need(12);
  doc.y -= 12;
  doc.line(label, M_LEFT, doc.y + 2, { size: 9, color: MUTED });
  const blank = value === "—";
  for (const line of valueLines) {
    doc.need(14);
    doc.y -= 14;
    doc.line(line, M_LEFT + 10, doc.y + 3.5, {
      size: 10.5,
      color: blank ? "#b9b1a1" : INK,
    });
  }
  doc.gap(6);
  doc.hairline(M_LEFT, doc.y + 4, CONTENT_W, "#f0e9db");
}

/** Rating answers carry a 1–10 track so the coach can scan them. */
function rateRow(doc: PdfDoc, label: string, value: string) {
  const score = Number.parseInt(value, 10);
  const height = 26;
  doc.need(height);
  const top = doc.y;
  doc.line(label, M_LEFT, top - 12, { size: 9, color: MUTED });
  const trackX = VALUE_X;
  const trackW = 132;
  doc.rect(trackX, top - 15, trackW, 5, "#eaddc4");
  if (Number.isFinite(score)) {
    doc.rect(trackX, top - 15, (trackW * score) / 10, 5, GOLD);
    doc.line(`${score} / 10`, trackX + trackW + 12, top - 14.5, {
      font: "b",
      size: 10.5,
      color: INK,
    });
  } else {
    doc.line("—", trackX + trackW + 12, top - 14.5, { size: 10.5, color: "#b9b1a1" });
  }
  doc.y = top - height;
  doc.hairline(M_LEFT, doc.y + 4, CONTENT_W, "#f0e9db");
}

function sectionHeader(doc: PdfDoc, eyebrow: string, title: string) {
  // Never orphan a section heading at the foot of a page.
  doc.need(96);
  doc.gap(26);
  doc.need(46);
  doc.y -= 12;
  doc.line(eyebrow.toUpperCase(), M_LEFT, doc.y, {
    font: "b",
    size: 8,
    color: GOLD,
    tracking: 1.4,
  });
  doc.y -= 22;
  doc.line(title, M_LEFT, doc.y, { font: "b", size: 17, color: INK });
  doc.y -= 12;
  doc.rect(M_LEFT, doc.y, 84, 1.4, GOLD);
  doc.gap(6);
}

function renderField(doc: PdfDoc, field: AuditField, data: AuditData) {
  switch (field.kind) {
    case "eyebrow":
      eyebrowLine(doc, field.text, "#a08a55");
      return;
    case "callout":
    case "lead":
    case "closing":
      doc.gap(10);
      doc.paragraph(field.text, { font: "i", size: 10.5, color: GOLD_DEEP });
      doc.gap(4);
      return;
    case "quote":
      doc.gap(12);
      doc.paragraph(field.text, { font: "i", size: 13, color: "#2a251c", leading: 19 });
      doc.gap(6);
      return;
    case "note":
      doc.gap(8);
      doc.paragraph(field.text, { size: 9, color: MUTED });
      return;
    case "divider":
      doc.gap(12);
      doc.need(2);
      doc.hairline(M_LEFT, doc.y, CONTENT_W);
      doc.gap(4);
      return;
    case "textarea":
      stackedRow(doc, field.label, formatAnswer(field, data));
      return;
    case "rate":
      rateRow(doc, field.label, formatAnswer(field, data));
      return;
    case "signature":
      return; // drawn separately — it is an image, not a text answer
    case "chips": {
      const label = field.label
        ? field.labelHint
          ? `${field.label} ${field.labelHint}`
          : field.label
        : "Selected";
      const value = formatAnswer(field, data);
      const other = field.otherKey ? String(data[field.otherKey] ?? "").trim() : "";
      answerRow(doc, label, other ? `${value === "—" ? "" : `${value} · `}${other}` : value);
      return;
    }
    case "text":
      answerRow(doc, field.label, formatAnswer(field, data));
      return;
    default:
      return;
  }
}

function coverPage(
  doc: PdfDoc,
  data: AuditData,
  photo: { w: number; h: number } | null,
  submittedOn: string,
) {
  doc.rect(0, PAGE_H - 8, PAGE_W, 8, GOLD);
  doc.y = PAGE_H - 132;

  doc.line("THE TRANSFORMATION AUDIT", M_LEFT, doc.y, {
    font: "b",
    size: 9,
    color: GOLD,
    tracking: 2.2,
  });
  doc.gap(20);
  doc.paragraph("Lifestyle & Personality Transformation Audit", {
    font: "b",
    size: 27,
    color: INK,
    leading: 32,
    width: CONTENT_W - 40,
  });
  doc.gap(14);
  doc.need(2);
  doc.hairline(M_LEFT, doc.y, 120, GOLD);
  doc.gap(18);
  doc.paragraph("“The better I understand you, the better I can transform you.”", {
    font: "i",
    size: 13,
    color: GOLD_DEEP,
    width: CONTENT_W - 120,
  });

  doc.gap(34);
  const boxTop = doc.y;
  const boxH = 132;
  doc.rect(M_LEFT, boxTop - boxH, CONTENT_W, boxH, WASH);
  doc.rect(M_LEFT, boxTop - boxH, 2.2, boxH, GOLD);

  let cursor = boxTop - 26;
  doc.line("PREPARED FOR", M_LEFT + 22, cursor, {
    font: "b",
    size: 8,
    color: GOLD,
    tracking: 1.4,
  });
  cursor -= 24;
  doc.line(clientName(data), M_LEFT + 22, cursor, { font: "b", size: 17, color: INK });
  cursor -= 20;

  const rows: [string, string][] = [
    ["Email", String(data.email ?? "").trim() || "—"],
    ["Phone", String(data.phone ?? "").trim() || "—"],
    ["Submitted", submittedOn],
  ];
  for (const [label, value] of rows) {
    doc.line(label, M_LEFT + 22, cursor, { size: 8.5, color: MUTED });
    doc.line(value, M_LEFT + 92, cursor, { size: 9.5, color: BODY });
    cursor -= 15;
  }

  if (photo) {
    const size = 92;
    const scale = size / Math.max(photo.w, photo.h);
    const w = photo.w * scale;
    const h = photo.h * scale;
    doc.image("ImPhoto", PAGE_W - M_RIGHT - 22 - w, boxTop - boxH / 2 - h / 2, w, h);
  }

  doc.y = boxTop - boxH;
  doc.gap(30);
  doc.paragraph(
    "Every answer below is the client's own. It is confidential and used only to build the transformation plan.",
    { size: 9.5, color: MUTED, width: CONTENT_W - 80 },
  );
}

/** Format an ISO-ish date for the cover. Falls back to the raw string. */
function readableDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * Render the completed audit. Returns the PDF bytes — the caller decides
 * whether to download them, POST them, or both.
 */
export async function buildAuditPdf(
  data: AuditData,
  opts: { submittedAt?: string } = {},
): Promise<Uint8Array> {
  const doc = new PdfDoc();
  const submittedAt = opts.submittedAt ?? new Date().toISOString();

  const photoSrc = typeof data.photo === "string" ? data.photo : "";
  const signatureSrc = typeof data.sig_client === "string" ? data.sig_client : "";

  const photo = photoSrc ? await toJpeg(photoSrc, 320) : null;
  if (photo) doc.addImage({ name: "ImPhoto", ...photo });
  const signature = signatureSrc ? await toJpeg(signatureSrc, 640) : null;
  if (signature) doc.addImage({ name: "ImSig", ...signature });

  coverPage(doc, data, photo, readableDate(submittedAt));

  for (const step of AUDIT_STEPS) {
    doc.newPage();
    sectionHeader(doc, step.eyebrow, step.title);

    // On the commitment page the signature, its date and the closing line are
    // drawn together at the end, so the generic pass skips them.
    const fields = flattenFields(step.fields);
    const deferred = (field: AuditField) =>
      step.n === 13 &&
      (field.kind === "signature" ||
        field.kind === "closing" ||
        ("key" in field && field.key === "signDate"));

    for (const field of fields) {
      if (!deferred(field)) renderField(doc, field, data);
    }

    if (step.n === 13) {
      doc.gap(16);
      doc.need(120);
      doc.y -= 14;
      doc.line("CLIENT SIGNATURE", M_LEFT, doc.y, {
        font: "b",
        size: 8,
        color: GOLD,
        tracking: 1.4,
      });
      doc.gap(8);
      const boxW = 260;
      const boxH = 74;
      doc.need(boxH + 30);
      doc.y -= boxH;
      doc.rect(M_LEFT, doc.y, boxW, boxH, "#fffdf9");
      doc.hairline(M_LEFT, doc.y, boxW);
      if (signature) {
        const scale = Math.min((boxW - 24) / signature.w, (boxH - 18) / signature.h);
        doc.image(
          "ImSig",
          M_LEFT + 12,
          doc.y + (boxH - signature.h * scale) / 2,
          signature.w * scale,
          signature.h * scale,
        );
      } else {
        doc.line("Not signed", M_LEFT + 14, doc.y + boxH / 2 - 3, {
          font: "i",
          size: 10,
          color: "#c7b59a",
        });
      }
      const signDate = String(data.signDate ?? "").trim();
      doc.line("Date", M_LEFT + boxW + 30, doc.y + boxH - 14, { size: 9, color: MUTED });
      doc.line(signDate || "—", M_LEFT + boxW + 30, doc.y + boxH - 32, {
        font: "b",
        size: 11,
        color: INK,
      });
      doc.gap(22);
      for (const field of fields) {
        if (field.kind === "closing") renderField(doc, field, data);
      }
    }
  }

  return doc.finish(`Transformation Audit · ${clientName(data)}`);
}

/** Trigger the browser download. Keeps the blob URL alive long enough to save. */
export function downloadPdf(bytes: Uint8Array, fileName: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Base64 for the JSON POST — chunked so large PDFs don't blow the arg limit. */
export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** "Transformation-Audit-Rahul-Sharma-2026-08-06.pdf" */
export function auditFileName(data: AuditData, submittedAt = new Date()): string {
  const name = clientName(data)
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const day = submittedAt.toISOString().slice(0, 10);
  return `Transformation-Audit-${name || "Client"}-${day}.pdf`;
}
