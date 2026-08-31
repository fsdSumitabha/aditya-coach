import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AuditLandingFlow from "@/components/landing/AuditLandingFlow";
import WhatYouLeaveWith from "@/components/landing/WhatYouLeaveWith";
import WhoThisIsFor from "@/components/landing/WhoThisIsFor";
import WhatWeAssess from "@/components/landing/WhatWeAssess";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import { LANDING_FAQS } from "@/components/landing/landing-data";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { LEGAL } from "@/lib/legal";

// ============================================================
// /landing-page — the Meta-ads landing page for the Transformation Audit.
//
// Built to the "Transformation Audit Landing Page — Conversion & Meta Ads
// Developer Brief", in its section order, trimmed at the owner's instruction
// (31 Aug 2026):
//
//   01 minimal header · 02 hero · 03 what you leave with · 04 who this is for
//   05 what we assess · 07 how it works · 08 booking+payment · 09 FAQ
//   10 final CTA · 11 minimal footer
//
// The brief's §06 client-proof block is deliberately NOT here — removed by the
// owner. Nothing on this page shows a client photograph, names a client or
// quotes one. Numbering above stays the brief's so the two still map.
//
// Sections 01 and 11 are the layout (app/landing-page/layout.tsx). This route
// lives OUTSIDE app/(site), so it inherits none of the site chrome — no nav,
// no site footer, no WhatsApp FAB. That is a layout boundary, not a runtime
// condition.
//
// HOW THIS DIFFERS FROM /book, and why:
//   · No duration. Every "45 minutes" reference is gone and is NOT replaced
//     with another number. /book still names one — that is the full site.
//   · No gift card, no free-resource CTA, no programme comparison, no second
//     price. Nothing on this page competes with the Audit.
//   · Three fields before payment (name, WhatsApp, goal). The detailed
//     pre-assessment is a Google Form sent on WhatsApp after payment.
//
// noindex on purpose: this is a paid-traffic destination whose content
// overlaps /book, which IS the indexable booking page. Two near-identical
// pages competing for one query costs /book its ranking and gains nothing —
// ads do not need an index entry. Flip `noindex` here and add the route to
// app/sitemap.ts if the owner ever wants it in search.
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: `Transformation Audit — ${LEGAL.CONSULT_PRICE} | Aditya Upadhyay`,
  // [review] — mirrors the hero, no duration named
  description: `Find what is actually holding you back. A private 1:1 assessment to understand where you are, what needs to change, and what you should focus on first. ${LEGAL.CONSULT_PRICE}, online via WhatsApp.`,
  path: "/landing-page",
  ogType: "website",
  noindex: true,
});

// ---- Page-level structured data ----
// Provider references the global LocalBusiness node emitted in the root layout
// by @id (geo Kolkata, serviceArea worldwide) — never duplicated. No `duration`
// property here either: the offer is an assessment, not a booked hour.

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_ORIGIN}/landing-page#service`,
  name: "Transformation Audit",
  serviceType: "Men's lifestyle and personality assessment",
  description:
    "A private one-to-one Transformation Audit with men's lifestyle coach Aditya Kumar Upadhyay — an assessment of where you are, what is actually holding you back, and the three priorities to address first.",
  url: `${SITE_ORIGIN}/landing-page`,
  provider: { "@id": `${SITE_ORIGIN}/#business` },
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    price: String(LEGAL.CONSULT_PRICE_INR),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_ORIGIN}/landing-page`,
  },
};

// Mirrors the visible §9 accordion exactly — both read LANDING_FAQS.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={[serviceSchema, faqSchema]} />

      <AuditLandingFlow
        middle={
          <>
            {/* 03 — the outputs, so the price reads as concrete */}
            <WhatYouLeaveWith />
            {/* 04 — qualification, five lines */}
            <WhoThisIsFor />
            {/* 05 — scope, five categories */}
            <WhatWeAssess />
            {/* 07 — payment to deliverable, five steps */}
            <HowItWorks />
          </>
        }
        tail={
          <>
            {/* 09 — the five approved questions */}
            <LandingFaq />
            {/* 10 — the close */}
            <LandingFinalCta />
          </>
        }
      />
    </>
  );
}
