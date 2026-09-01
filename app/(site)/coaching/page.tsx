import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CoachingHero from "@/components/coaching/CoachingHero";
import PathGrid from "@/components/coaching/PathGrid";
import JourneySteps from "@/components/coaching/JourneySteps";
import ExpectedTransformation from "@/components/coaching/ExpectedTransformation";
import FreeStartingPoint from "@/components/coaching/FreeStartingPoint";
import CoachingFinalCta from "@/components/coaching/CoachingFinalCta";
import { PATHS, PRICE_CONSULT } from "@/components/coaching/coaching-data";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { LEGAL } from "@/lib/legal";
import TransformationStage from "@/components/results/TransformationStage";

// ============================================================
// /coaching — sells the three coaching paths. It does NOT take money.
//
//   Coaching (choose a path) → /book → Transformation Audit ₹999 → payment
//
// Every CTA on this page lands on /book. The page answers three questions and
// nothing else: what can I get from Aditya, which path is right for me, and
// what happens if I want to start?
//
// Sections (direction 2026-08-25):
//   1 hero — three paths      5 comparison table
//   2 the three paths         6 expected transformation
//   3 what happens next       7 free starting point
//   4 why the audit first     8 final CTA
//
// The FAQ that used to live here is NOT lost — /book carries the same answers
// verbatim (components/book/BookingFlow.tsx §7), at the point of decision.
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "Coaching for Men | Transformation with Aditya, Kolkata", /* [review] */
  /* [review] — three paths + the one entry point */
  description: `Three coaching paths for men in Kolkata and online — Lifestyle Coaching, Personality & Presence Coaching, or the Complete Transformation. Every path starts with a ${PRICE_CONSULT} Transformation Audit, credited against your program.`,
  path: "/coaching",
});

// ---- Page-level structured data ----
// Provider references the global Person node by @id — never redefined here.
// The Audit keeps the only priced Offer: it is the one thing sold on-site.
const providerRef = { "@id": `${SITE_ORIGIN}/#person` };
const areaServed = ["Kolkata", "Worldwide"];

const auditSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Transformation Audit",
  provider: providerRef,
  areaServed,
  description:
    "A 45-minute online audit via WhatsApp covering your current situation, goals, gaps, what needs to change and which coaching path makes sense. The fee is credited against your program price if you continue with coaching." /* [review] */,
  offers: {
    "@type": "Offer",
    name: "Transformation Audit",
    price: String(LEGAL.CONSULT_PRICE_INR),
    priceCurrency: "INR",
    url: `${SITE_ORIGIN}/book`,
  },
};

// One Service node per coaching path — generated from the same data the cards
// render, so the two can never disagree.
const pathSchemas = PATHS.map((p) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: p.name,
  provider: providerRef,
  areaServed,
  description: p.schemaDescription,
}));

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: "Coaching", item: `${SITE_ORIGIN}/coaching` },
  ],
};

export default function CoachingPage() {
  return (
    <>
      <JsonLd data={[auditSchema, ...pathSchemas, breadcrumbSchema]} />

      {/* 1 — three paths, one door */}
      <CoachingHero />

      {/* 2 — three destinations, one starting point */}
      <JourneySteps />

      {/* 3 — the showpiece: two paths + the flagship band */}
      <PathGrid />

      {/* 4 — why the audit first */}
      <TransformationStage />

      {/* 8 — the close */}
      <CoachingFinalCta />
      
      {/* 7 — the catch-net for men who aren't paying today */}
      <FreeStartingPoint />

    </>
  );
}
