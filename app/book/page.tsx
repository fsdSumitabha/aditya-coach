import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import BookingFlow from "@/components/book/BookingFlow";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { LEGAL } from "@/lib/legal";

// /book — the single terminal conversion node. The entire body between header
// and footer is the 3-state booking machine (client island). This page links
// only laterally (/programs, /refund, /privacy) — never back up the funnel.
//
// Indexable + follow (primary conversion landing page despite nav:false) —
// pageMetadata defaults to index/follow; do NOT set noindex here.

export const metadata: Metadata = pageMetadata({
  // [review] reframed to the Transformation Audit; supersedes the A6 sitemap title (≤60 chars)
  title: `Book Your ${LEGAL.CONSULT_PRICE} Transformation Audit | Aditya`,
  // [review] description reframed to the audit scope (what we analyse → what to fix first)
  description: `45 minutes, online via WhatsApp. We audit your lifestyle, health, fitness and habits — then pinpoint what to fix first. Book your ${LEGAL.CONSULT_PRICE} Transformation Audit.`,
  path: "/book",
  ogType: "website",
});

// ---- Page-level structured data (Service + BreadcrumbList) ----
// Provider references the global LocalBusiness/Person nodes emitted in the
// root layout by @id (geo Kolkata, serviceArea worldwide) — never duplicated.

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_ORIGIN}/book#service`,
  name: "Transformation Audit",
  serviceType: "Men's lifestyle transformation audit",
  description:
    "A 45-minute one-to-one Transformation Audit on WhatsApp with men's lifestyle coach Aditya Kumar Upadhyay.",
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_ORIGIN,
    },
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
      <JsonLd data={[serviceSchema, breadcrumbSchema]} />
      <BookingFlow />
    </>
  );
}
