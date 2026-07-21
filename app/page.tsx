import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Home3D from "@/components/experience/Home3D";
import { FACTS } from "@/components/experience/facts";
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
  title: "Complete Transformation Coach for Men | Aditya Upadhyay" /* [review] §3 */,
  description:
    "Become harder to ignore. Complete transformation for men — body, lifestyle, mindset, personality, presence. Kolkata & worldwide. Book a ₹2,000 Transformation Audit." /* [review] 154 chars */,
  path: "/",
});

const HOME_SCHEMA = [
  personSchema,
  businessSchema,
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_ORIGIN}/#coaching-service`,
    name: "Complete Transformation Coaching for Men",
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
      name: "Transformation Audit",
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

      {/* The page's ONE h1 — server-rendered and permanent, independent of
          scroll state or WebGL (the 3D overlay shows the same line visually
          as a styled <p>). Also gives crawlers/AT the hero copy the canvas
          can't carry. */}
      <div className="sr-only">
        <h1>Become harder to ignore.</h1>
        <p>
          A complete transformation system for men who want to build a
          stronger body, sharper mind, and undeniable presence.
        </p>
      </div>

      <Home3D />

      {/* Every fact from the 3D journey, as real HTML — keyboard and
          screen-reader users get the full content without touching the
          canvas, and crawlers get the body copy. */}
      <section aria-label="What you will find here" className="sr-only">
        {Object.values(FACTS).map((f) => (
          <article key={f.id}>
            <h2>{f.title}</h2>
            <p>{f.eyebrow}</p>
            <p>{f.body}</p>
            {f.attribution && <p>{f.attribution}</p>}
            {f.cta && <Link href={f.cta.href}>{f.cta.label}</Link>}
          </article>
        ))}
      </section>

      {/* Crawlable funnel map (visually hidden). */}
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
            <Link href="/tools">Free tools — Lifestyle Blueprint, Fat Loss Training Split, Personality Audit Blueprint, calorie calculator</Link>
          </li>
          <li>
            <Link href="/programs">Coaching — Transformation Audit ₹2,000, Lifestyle Coaching, Personality &amp; Presence Coaching, Complete Transformation</Link>
          </li>
          <li>
            <Link href="/book">Book your ₹2,000 Transformation Audit</Link>
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
