import { WHATSAPP_NUMBER } from "@/lib/config";

// ---- Operational address (confirmed 6 Aug 2026) ----
// One string, reused for the DPDP grievance address, the /contact block and
// the LocalBusiness JSON-LD. Razorpay's merchant review wants this as
// selectable text, not baked into an image.
export const ADDRESS = {
  STREET: "23/A Bankim Mukherjee Sarani",
  LOCALITY: "New Alipore",
  CITY: "Kolkata",
  POSTAL_CODE: "700053",
  REGION: "West Bengal",
  COUNTRY: "India",
  COUNTRY_CODE: "IN",
  // Owner-supplied pin. Drives the /contact map embed and the schema geo.
  LAT: 22.5123171,
  LNG: 88.3260714,
};

export const ADDRESS_FULL = `${ADDRESS.STREET}, ${ADDRESS.LOCALITY}, ${ADDRESS.CITY} ${ADDRESS.POSTAL_CODE}, ${ADDRESS.REGION}, ${ADDRESS.COUNTRY}`;

/** Google Maps deep link — opens the pin in the user's Maps app. */
export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${ADDRESS.LAT},${ADDRESS.LNG}`;

/** Turn-by-turn directions to the pin. */
export const MAP_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS.LAT},${ADDRESS.LNG}`;

/** Keyless Google Maps embed (no API key, no billing account needed). */
export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${ADDRESS.LAT},${ADDRESS.LNG}&z=16&output=embed`;

// Swappable legal facts (0.5) — edit once, propagates through all legal prose.
// All owner-supplied facts below CONFIRMED 6 Aug 2026 (Karthik, relaying Aditya).
export const LEGAL = {
  OWNER_NAME: "Aditya Kumar Upadhyay",
  // Sole proprietor trading under his own name — there is no separate firm name.
  BUSINESS_NAME: "Aditya Kumar Upadhyay",
  LEGAL_BASIS_NOTE: "sole proprietor",
  CONTACT_EMAIL: "adityau78@gmail.com",
  GRIEVANCE_NAME: "Aditya Kumar Upadhyay", // Grievance Officer
  GRIEVANCE_EMAIL: "adityau78@gmail.com",
  GRIEVANCE_ADDRESS: ADDRESS_FULL,
  WHATSAPP_E164: `+${WHATSAPP_NUMBER}`,
  WHATSAPP_WA_LINK: `https://wa.me/${WHATSAPP_NUMBER}`,
  JURISDICTION_CITY: "Kolkata",
  JURISDICTION_STATE: "West Bengal, India",
  // Consultation fee. Single source of truth — read this everywhere, never hardcode a price in copy.
  // ₹999 confirmed 6 Aug 2026. Supersedes ₹500 (29 Jul) and ₹2,000 (original brief).
  CONSULT_PRICE: "₹999", // display string
  CONSULT_PRICE_INR: 999, // numeric — for schema price, CountUp, payment paise (×100)
  LAST_UPDATED: "6 August 2026", // render human-readable
  EFFECTIVE_DATE: "9 July 2026" /* [review] set to the actual launch date before go-live */,
};

// ---- Delivery facts (Razorpay merchant review: "Shipping & Delivery") ----
// Nothing physical ships. These are the service-delivery windows quoted on
// /shipping and /pricing. Edit here, never in JSX.
// [review] Only CONFIRM_WINDOW is site-confirmed (the /book page already
// promises "WhatsApp confirmation within 24h"). Every other window below is a
// sensible default awaiting the owner's written confirmation.
export const DELIVERY = {
  /** Booking acknowledged on WhatsApp after payment. Confirmed — matches /book. */
  CONFIRM_WINDOW: "24 hours",
  /** Audit call scheduled and held within this window of booking. [review] */
  AUDIT_WINDOW: "3 business days",
  /** Coaching onboarding begins after the program payment clears. [review] */
  ONBOARDING_WINDOW: "2 business days",
  /** Re-send window if an emailed file never lands. [review] */
  RESEND_WINDOW: "1 business day",
};

// What the Transformation Audit includes beyond the call itself.
// Confirmed 6 Aug 2026. Rendered on /programs and /book — edit here, not in JSX.
export const CONSULT_INCLUDES = {
  /** Fee credited against the program price the moment he joins. */
  CREDIT:
    "Your fee comes straight off your program price the day you join. An instant discount, not a promise.",
  /** Takeaway gift card handed over at the end of the call. */
  GIFT_CARD: "An instant gift card, yours at the end of the call.",
  /** The long-form Lifestyle Blueprint, free with the audit. */
  BLUEPRINT: "The full long-form Lifestyle Blueprint. Free, and yours to keep.",
};
