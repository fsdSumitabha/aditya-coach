import { IG_URL, YOUTUBE_URL, WHATSAPP_NUMBER } from "@/lib/config";
import { SITE_ORIGIN } from "@/lib/site";

// ---- Site-wide JSON-LD (A7): Person + LocalBusiness, geo Kolkata, serviceArea worldwide ----
// Kept in ONE swappable constant module. Rendered via <JsonLd /> (components/JsonLd.tsx).

export const sameAsLinks = [
  IG_URL,
  YOUTUBE_URL, // placeholder handle until the real channel exists (lib/config.ts)
  `https://wa.me/${WHATSAPP_NUMBER}`,
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#person`,
  name: "Aditya Kumar Upadhyay",
  jobTitle: "Men's Lifestyle Coach",
  url: SITE_ORIGIN,
  image: `${SITE_ORIGIN}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  knowsAbout: [
    "lifestyle transformation",
    "men's fitness",
    "nutrition coaching",
    "habit change",
  ],
  sameAs: sameAsLinks,
};

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": `${SITE_ORIGIN}/#business`,
  name: "Aditya Kumar Upadhyay — Men's Lifestyle Coach",
  url: SITE_ORIGIN,
  image: `${SITE_ORIGIN}/og-image.jpg`,
  founder: { "@id": `${SITE_ORIGIN}/#person` },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.5726,
    longitude: 88.3639,
  },
  areaServed: "Worldwide",
  priceRange: "₹₹",
  sameAs: sameAsLinks,
};
