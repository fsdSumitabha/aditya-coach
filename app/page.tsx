import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Home3D from "@/components/experience/Home3D";
import { businessSchema, personSchema } from "@/lib/schema";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ============================================================
// HOME (/) — the immersive atelier. One explorable 3D space:
// scroll drives a cinematic camera through five chapters; every
// fact is anchored to an object and revealed on touch. WebGL-less
// visitors and reduced-motion users get the same verbatim facts
// as a calm static page (components/experience/StaticFallback).
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "Men's Lifestyle Coach Kolkata | Aditya Upadhyay",
  description:
    "Rebuild your body, mind and confidence. Men's lifestyle and transformation coaching in Kolkata and worldwide online. Book a ₹2,000 consultation.",
  path: "/",
});

const HOME_SCHEMA = [
  personSchema,
  businessSchema,
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_ORIGIN}/#coaching-service`,
    name: "Men's Lifestyle & Transformation Coaching",
    serviceType: "Lifestyle coaching",
    provider: { "@id": `${SITE_ORIGIN}/#business` },
    areaServed: "Worldwide",
    serviceArea: "Worldwide (online)",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_ORIGIN}/book`,
      serviceLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: 22.5726, longitude: 88.3639 },
      },
    },
    offers: {
      "@type": "Offer",
      name: "Discovery Consultation",
      price: "2000",
      priceCurrency: "INR",
      url: `${SITE_ORIGIN}/book`,
    },
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <Home3D />

      {/* Crawlable funnel map (visually hidden; the 3D overlay owns the
          visible h1 — this block deliberately uses list semantics only). */}
      <nav aria-label="Explore the site" className="sr-only">
        <ul>
          <li>
            <Link href="/about">About Aditya — My story</Link>
          </li>
          <li>
            <Link href="/method">The Right Order of Change — the method</Link>
          </li>
          <li>
            <Link href="/results">Real Men. Real Results. — transformations</Link>
          </li>
          <li>
            <Link href="/tools">Free tools — Lifestyle Blueprint, Fat Loss Training Split, calorie calculator</Link>
          </li>
          <li>
            <Link href="/programs">Programs — Discovery Consultation ₹2,000, Monthly Coaching, Online Plan</Link>
          </li>
          <li>
            <Link href="/book">Book your ₹2,000 consultation</Link>
          </li>
          <li>
            <Link href="/blog">Articles for men who want more</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
