// ===== CONFIG / PHASE 2 STUBS (single source of truth, imported by every page) =====
// Every value is env-backed (NEXT_PUBLIC_*) with the Phase-1 placeholder as fallback.
// Phase 2 turns startPayment / sendToEmailProvider / notifyCoach into app/api/*/route.ts
// Route Handlers. Do NOT install payment/email SDKs or add server code in Phase 1.

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX"; // TODO real number, digits only, no + / spaces / dashes
export const COACH_WHATSAPP =
  process.env.NEXT_PUBLIC_COACH_WHATSAPP || "91XXXXXXXXXX"; // TODO
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""; // TODO
export const IG_URL =
  process.env.NEXT_PUBLIC_IG_URL ||
  "https://www.instagram.com/adityakumarupadhyay_"; // confirmed handle (trailing underscore)
export const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@__REPLACE__"; // TODO [review] real handle — single placeholder shared by footer/header/about/schema
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || ""; // TODO Phase 2
export const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY || ""; // TODO Phase 2
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || ""; // empty => skip network, just show success
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""; // TODO Phase 2 — empty => tracking no-op
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""; // TODO Phase 2 — empty => tracking no-op

// Subpath-hosting support (GitHub Pages): Next prefixes routes/_next
// automatically via basePath, but hardcoded public/ asset URLs need it too.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ---- Swappable asset constants (A10) ----
export const BLUEPRINT_PDF = `${BASE_PATH}/downloads/lifestyle-blueprint.pdf`; /* TODO: replace with the real Lifestyle Blueprint PDF */
export const SPLIT_PDF = `${BASE_PATH}/downloads/fat-loss-training-split.pdf`; /* TODO: replace with the real Fat Loss Training Split PDF */
export const PERSONALITY_PDF = `${BASE_PATH}/downloads/personality-audit-blueprint.pdf`; /* TODO: replace with the real Personality Audit Blueprint PDF */
export const OG_IMAGE = `${BASE_PATH}/og-image.jpg`; /* TODO: replace — 1200×630, <300KB, face + tagline */

// ---- WhatsApp deep-link helper (wa.me cannot auto-send; user taps send) ----
export function waLink(
  text = "Hi Aditya, I found your page and want to know more about your coaching.",
  number: string = WHATSAPP_NUMBER,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// ===== PHASE 2 STUB FUNCTIONS (named seams — currently no-ops) =====

export type LeadPayload = {
  email: string;
  source: string;
  [key: string]: unknown;
};

export function startPayment(payload: Record<string, unknown>): Promise<{ ok: boolean }> {
  /* PHASE 2: Razorpay checkout (amount = LEGAL.CONSULT_PRICE_INR × 100 paise) → verify
     signature server-side → submit form + notifyCoach. */
  void payload;
  return Promise.resolve({ ok: true }); // no-op → falls through to success
}

export function sendToEmailProvider(payload: LeadPayload): Promise<{ ok: boolean }> {
  /* PHASE 2: POST to Brevo; auto-send lead-magnet PDF; welcome email w/ founder story. */
  console.log("stub sendToEmailProvider", payload);
  return Promise.resolve({ ok: true });
}

export function notifyCoach(payload: Record<string, unknown>): void {
  /* PHASE 2: Twilio WhatsApp Business API (wa.me CANNOT auto-send).
     Note: /contact enquiries no longer need this — sendEnquiry() posts to
     app/api/contact/route.ts, which emails the coach over SMTP. */
  console.log("stub notifyCoach", payload);
}

// ===== LIVE: /contact enquiry submission =====

export type EnquiryPayload = {
  name: string;
  email: string;
  message: string;
  source: string;
};

export type EnquiryResult = {
  ok: boolean;
  /** Per-field messages from server-side validation (422). */
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Human-readable failure reason for everything else. */
  error?: string;
};

/**
 * POST an enquiry to the contact Route Handler, which sends the coach
 * notification + the enquirer auto-reply via SMTP (nodemailer).
 * `basePath` is not applied to fetch() by Next, so prefix it manually.
 */
export async function sendEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  try {
    const res = await fetch(`${BASE_PATH}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as EnquiryResult;
    return { ...data, ok: res.ok && data.ok !== false };
  } catch {
    // Network/offline — surface the fallback channels rather than a fake success.
    return { ok: false, error: "network" };
  }
}

export function track(event: string, data?: Record<string, unknown>): void {
  /* PHASE 2: fire GA4 + Meta Pixel when IDs present. */
  if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) return;
  console.log("stub track", event, data);
}
