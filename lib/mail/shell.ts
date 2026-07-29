import "server-only";

import { SITE_ORIGIN } from "@/lib/site";
import { IG_URL } from "@/lib/config";

/**
 * Shared, premium email chrome + safe HTML primitives — the single template
 * core every transactional mail (contact, lead magnets, admin notices) is
 * built on, so they all read as one brand. Inline styles only (email clients
 * strip <style>/external CSS). Every interpolated user value MUST pass through
 * `escapeHtml` first.
 */

const BRAND = {
  name: "Aditya Kumar Upadhyay",
  tagline: "Men's Lifestyle & Personality Coach · Kolkata",
  site: SITE_ORIGIN,
  ig: IG_URL,
};

const C = {
  bg: "#0b0b0c",
  card: "#ffffff",
  ink: "#1b1b1f",
  soft: "#6c6c76",
  hair: "#ececf0",
  gold: "#c9a227",
  goldSoft: "#f0d67a",
  goldInk: "#8a6d1f",
  wash: "#faf7ee",
  onGold: "#141416",
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

// ---- HTML-safety helpers (shared) ----

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Newlines/carriage returns in a header value enable header injection. */
export function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function istTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

// ---- Reusable content pieces (callers pass already-escaped/trusted HTML) ----

/** Render blank-line-separated user text into safe paragraphs. */
export function paragraphs(text: string): string {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px">${block.replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

/** A gold call-to-action button. */
export function button(href: string, label: string): string {
  return (
    `<a href="${escapeHtml(href)}" style="display:inline-block;background:${C.gold};color:${C.onGold};` +
    `text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:15px">${escapeHtml(label)}</a>`
  );
}

/** A label→value metadata table (values may be pre-built HTML like links). */
export function infoTable(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;color:${C.soft};width:96px;vertical-align:top;font-size:14px">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:${C.ink};font-size:14px">${value}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">${body}</table>`;
}

/** A gold-edged highlight box (inner HTML is trusted/pre-escaped). */
export function calloutBox(innerHtml: string): string {
  return (
    `<div style="background:${C.wash};border-left:3px solid ${C.gold};border-radius:6px;padding:14px 16px;margin:0 0 18px">` +
    innerHtml +
    "</div>"
  );
}

/** Small uppercase eyebrow label. */
export function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${C.goldInk}">${escapeHtml(text)}</p>`;
}

/**
 * Wrap body HTML in the branded shell (hidden preheader, gold rule, header
 * wordmark, content, footer). `bodyHtml` is trusted — build it with the
 * helpers above so user input is already escaped.
 */
export function renderEmail(opts: {
  /** inbox-preview line, hidden in the body */
  preheader?: string;
  bodyHtml: string;
}): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(opts.preheader)}</div>`
    : "";

  return (
    `<div style="background:${C.bg};padding:28px 16px;font-family:${FONT}">` +
    preheader +
    `<div style="max-width:560px;margin:0 auto;background:${C.card};border-radius:14px;overflow:hidden">` +
    `<div style="height:3px;background:linear-gradient(90deg,${C.gold},${C.goldSoft},${C.gold})"></div>` +
    // header wordmark
    `<div style="padding:22px 26px 0">` +
    `<p style="margin:0;font-size:15px;font-weight:700;letter-spacing:.02em;color:${C.ink}">${BRAND.name}</p>` +
    `<p style="margin:2px 0 0;font-size:12px;color:${C.soft}">${BRAND.tagline}</p>` +
    `</div>` +
    // content
    `<div style="padding:22px 26px 6px;color:${C.ink};font-size:15px;line-height:1.6">` +
    opts.bodyHtml +
    `</div>` +
    // footer
    `<div style="padding:18px 26px 26px">` +
    `<div style="border-top:1px solid ${C.hair};padding-top:16px">` +
    `<p style="margin:0;color:${C.soft};font-size:13px">${BRAND.name} · ${BRAND.tagline}</p>` +
    `<p style="margin:6px 0 0;font-size:13px">` +
    `<a href="${escapeHtml(BRAND.site)}" style="color:${C.goldInk};text-decoration:none">${escapeHtml(BRAND.site.replace(/^https?:\/\//, ""))}</a>` +
    `&nbsp;·&nbsp;<a href="${escapeHtml(BRAND.ig)}" style="color:${C.goldInk};text-decoration:none">Instagram</a>` +
    `</p>` +
    `</div>` +
    `</div>` +
    `</div></div>`
  );
}
