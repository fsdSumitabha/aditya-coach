// ===== CONFIG / PHASE 2 STUBS (single source of truth, imported by every page) =====
// Every value is env-backed (NEXT_PUBLIC_*) with the Phase-1 placeholder as fallback.
// Phase 2 turns startPayment / sendToEmailProvider / notifyCoach into app/api/*/route.ts
// Route Handlers. Do NOT install payment/email SDKs or add server code in Phase 1.

// Contact + social truth. All CONFIRMED 6 Aug 2026 (Karthik, relaying Aditya).
// Fallbacks are the real values so a missing env var can never ship a broken link.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918420707031"; // digits only, no + / spaces / dashes
export const COACH_WHATSAPP =
  process.env.NEXT_PUBLIC_COACH_WHATSAPP || "918420707031"; // same number for booking notifications
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "adityaupadhyaycoach@gmail.com";
export const IG_URL =
  process.env.NEXT_PUBLIC_IG_URL ||
  "https://www.instagram.com/adityakumarupadhyay_"; // confirmed handle (trailing underscore)
export const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ||
  "https://youtube.com/@Adityakumarupadhyaymindset"; // confirmed channel
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

/**
 * THE FILM — "in my words", the section directly below the 3D journey.
 *
 * `FILM.src` is null until the footage exists, and while it is null the
 * section renders its branded poster placeholder instead. Drop the three files
 * into public/video/, fill this in, and the section starts playing itself the
 * moment the journey scrolls off the top — no other change needed.
 *
 * Captions are REQUIRED, not optional: most Instagram traffic watches on mute,
 * and the film is muted for its first play by definition (browsers do not let
 * an unattended video make noise).
 */
export const FILM: {
  src: string | null;
  poster: string;
  captions: string;
} = {
  src: null /* TODO: `${BASE_PATH}/video/in-my-words.mp4` */,
  poster: `${BASE_PATH}/video/in-my-words-poster.jpg`,
  captions: `${BASE_PATH}/video/in-my-words.en.vtt`,
};

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
  /* Legacy stub kept for any remaining callers (e.g. BookingFlow intake).
     Lead-magnet forms now use sendLeadMagnet() → app/api/lead-magnet. */
  console.log("stub sendToEmailProvider", payload);
  return Promise.resolve({ ok: true });
}

// ===== LIVE: lead-magnet submission (email capture → PDF delivery) =====

export type LeadMagnetPayload = {
  /** lead's full name — required, stored on the admin notification */
  name: string;
  /** lead's phone number as typed (E.164 or local) — required, for follow-up */
  phone: string;
  email: string;
  /** analytics/source tag, e.g. "tools-blueprint" */
  source: string;
  /** optional explicit resource id (else the server resolves from source) */
  resource?: string;
  /** on-site PDF href, forwarded so the email can link an online copy */
  pdfHref?: string;
};

/** Per-field messages from server-side validation (422). */
export type LeadMagnetErrors = Partial<
  Record<"name" | "phone" | "email", string>
>;

export type LeadMagnetResult = {
  ok: boolean;
  errors?: LeadMagnetErrors;
  error?: string;
};

/**
 * POST a lead-magnet capture (name + phone + email) to the route handler, which
 * emails the guide (PDF attached) to the subscriber and notifies the admin with
 * the full contact record so the lead can be followed up and tracked.
 * The API path stays behind this helper so components never hardcode it.
 */
export async function sendLeadMagnet(
  payload: LeadMagnetPayload,
): Promise<LeadMagnetResult> {
  try {
    const res = await fetch(`${BASE_PATH}/api/lead-magnet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as LeadMagnetResult;
    return { ...data, ok: res.ok && data.ok !== false };
  } catch {
    return { ok: false, error: "network" };
  }
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

// ===== LIVE: /book submission (audit booking + UPI payment claim) =====

export type BookingPayload = {
  /** "paid" = the booking itself, sent the moment he claims payment (critical).
      "intake" = his optional pre-call answers, sent afterwards. */
  stage: "paid" | "intake";
  name: string;
  email: string;
  phone: string;
  age: string;
  goal: string;
  /** UPI reference (UTR) he copied from his app. Unverified by anything. */
  upiReference: string;
  submittedAt: string;
  // --- stage "intake" only ---
  occupation?: string;
  lifestyle?: string;
  training?: string;
  blocker?: string;
  success?: string;
};

/**
 * POST a /book submission to app/api/booking, which emails Aditya over SMTP.
 *
 * This is the ONLY record a booking leaves — there is no CRM and no gateway
 * webhook, so a failure here means a man has paid ₹999 that can never be
 * matched to him. Callers MUST await this and surface a failure to the user
 * (with the UTR and a WhatsApp fallback) rather than showing a success screen.
 *
 * Note: the amount and payee are NOT sent — the server reads them from
 * lib/legal so a tampered client can't misrepresent what was paid.
 * `basePath` is not applied to fetch() by Next, so prefix it manually.
 */
export async function sendBooking(
  payload: BookingPayload,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_PATH}/api/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return { ok: res.ok && data.ok !== false, error: data.error };
  } catch {
    // Network/offline — never report a fake success on a paid booking.
    return { ok: false, error: "network" };
  }
}

export function track(event: string, data?: Record<string, unknown>): void {
  /* PHASE 2: fire GA4 + Meta Pixel when IDs present. */
  if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) return;
  console.log("stub track", event, data);
}
