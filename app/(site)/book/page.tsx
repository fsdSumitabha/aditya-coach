import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import BookingFlow from "@/components/book/BookingFlow";
import AuditExplainer from "@/components/book/AuditExplainer";
import WhatYouGet from "@/components/book/WhatYouGet";
import AfterTheAudit from "@/components/book/AfterTheAudit";
import WhyStartWithAudit from "@/components/book/WhyStartWithAudit";
import WhoIsThisFor from "@/components/book/WhoIsThisFor";
import BookFaq from "@/components/book/BookFaq";
import BookFinalCta from "@/components/book/BookFinalCta";
import { BOOK_FAQS } from "@/components/book/book-data";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { LEGAL } from "@/lib/legal";
import TransformationStage from "@/components/results/TransformationStage";


import AuditLandingFlow from "@/components/landing/AuditLandingFlow";
import WhatYouLeaveWith from "@/components/landing/WhatYouLeaveWith";
import WhoThisIsFor from "@/components/landing/WhoThisIsFor";
import WhatWeAssess from "@/components/landing/WhatWeAssess";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import { LANDING_FAQS } from "@/components/landing/landing-data";
import TransformationShowcase from "@/components/landing/TransformationShowcase";
// ============================================================
// /book — the single terminal conversion node, and the page ads point at.
//
// Built in three bands, top to bottom:
//   TOP     §1  the decision — price, what it is, WhatsApp, pay. Above the fold.
//   MIDDLE  §2–§6  the case, for the man who arrived unconvinced.
//   BOTTOM  §7–§8  objections answered, then back up to the decision.
//
// §1 and the post-payment states are the client island (BookingFlow); §2–§8
// are Server Components passed to it as children, so they carry zero JS and
// still hide with STATE A once payment succeeds.
//
// This page links only laterally (/coaching, /refund, /privacy) — never back
// up the funnel.
//
// Indexable + follow (primary conversion landing page despite nav:false) —
// pageMetadata defaults to index/follow; do NOT set noindex here.
// ============================================================

export const metadata: Metadata = pageMetadata({
  // [review] reframed to the Transformation Audit (≤60 chars)
  title: `Book Your ${LEGAL.CONSULT_PRICE} Transformation Audit | Aditya`,
  // [review] description carries the assessment framing + the fee credit
  description: `One to one, online on WhatsApp. Aditya assesses where you stand, names the gaps and recommends your path. ${LEGAL.CONSULT_PRICE}, adjusted against your program price if you continue with coaching.`,
  path: "/book",
  ogType: "website",
});

// ---- Page-level structured data (Service + FAQPage + BreadcrumbList) ----
// Provider references the global LocalBusiness/Person nodes emitted in the
// root layout by @id (geo Kolkata, serviceArea worldwide) — never duplicated.

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_ORIGIN}/book#service`,
  name: "Transformation Audit",
  serviceType: "Men's lifestyle transformation audit",
  description:
    "A one-to-one Transformation Audit held online on WhatsApp with men's lifestyle coach Aditya Kumar Upadhyay — a personal assessment of where you stand, the gaps holding you back, and the coaching path he recommends.",
  url: `${SITE_ORIGIN}/book`,
  provider: { "@id": `${SITE_ORIGIN}/#business` },
  areaServed: "Worldwide",
  duration: "PT45M",
  offers: {
    "@type": "Offer",
    price: String(LEGAL.CONSULT_PRICE_INR),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_ORIGIN}/book`,
  },
};

// Mirrors the visible §7 accordion exactly — both read BOOK_FAQS.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BOOK_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
    {
      "@type": "ListItem",
      position: 2,
      name: "Book Transformation Audit",
      item: `${SITE_ORIGIN}/book`,
    },
  ],
};

export default function BookPage() {
  return (
    <>
      <JsonLd data={[serviceSchema, faqSchema, breadcrumbSchema]} />

        <AuditLandingFlow
            middle={
            <>
                {/* 03 — the outputs, so the price reads as concrete */}
                <TransformationShowcase />
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
