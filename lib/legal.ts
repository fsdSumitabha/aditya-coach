import { WHATSAPP_NUMBER } from "@/lib/config";

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
  GRIEVANCE_ADDRESS:
    "23/A Bankim Mukherjee Sarani, New Alipore, Kolkata 700053, West Bengal, India",
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
