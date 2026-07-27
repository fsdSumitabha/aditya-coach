import { WHATSAPP_NUMBER } from "@/lib/config";

// Swappable legal facts (0.5) — edit once, propagates through all legal prose.
export const LEGAL = {
  OWNER_NAME: "Aditya Kumar Upadhyay",
  BUSINESS_NAME: "Aditya Kumar Upadhyay Coaching",
  LEGAL_BASIS_NOTE: "sole proprietor" /* [entity type — review] */,
  CONTACT_EMAIL: "hello@example.com" /* [review] */,
  GRIEVANCE_NAME: "Aditya Kumar Upadhyay", // Grievance Officer
  GRIEVANCE_EMAIL: "grievance@example.com" /* [review] */,
  GRIEVANCE_ADDRESS:
    "[Full postal address, Kolkata, West Bengal, India]" /* [review] */,
  WHATSAPP_E164: `+${WHATSAPP_NUMBER}` /* [review] */,
  WHATSAPP_WA_LINK: `https://wa.me/${WHATSAPP_NUMBER}` /* [review] */,
  JURISDICTION_CITY: "Kolkata",
  JURISDICTION_STATE: "West Bengal, India",
  // Consultation fee. Single source of truth — read this everywhere, never hardcode a price in copy.
  // The fee is credited in full against the program price when a client joins any coaching program.
  CONSULT_PRICE: "₹500", // display string
  CONSULT_PRICE_INR: 500, // numeric — for schema price, CountUp, payment paise (×100)
  LAST_UPDATED: "9 July 2026", // render human-readable
  EFFECTIVE_DATE: "9 July 2026",
};
