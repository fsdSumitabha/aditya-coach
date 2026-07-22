import type { Metadata } from "next";

// Final domain TBD — swap at deploy (also drives sitemap/robots/canonicals).
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://adityakumarupadhyay.com"; // TODO: final domain

export const SITE_NAME = "Aditya Kumar Upadhyay — Complete Transformation Coach for Men";
export const BRAND_LINE =
  "Aditya Kumar Upadhyay — Complete Transformation Coach for Men. Become harder to ignore."; /* [review] */

// Header nav — exact order per A5. [Book ₹2,000] is the pinned gold button, NOT a nav item.
// Simplified per direction doc §10 (Blog lives under Resources + footer)
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Method", href: "/method" },
  { label: "Coaching", href: "/programs" },
  { label: "Results", href: "/results" },
  { label: "Resources", href: "/tools" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Per-page metadata helper — canonical + OG/Twitter from one call.
 * metadataBase is set in app/layout.tsx, so `path` stays relative.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/about"
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  ogImage?: string;
}): Metadata {
  const { title, description, path, ogType = "website", noindex, ogImage } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: ogType,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: ogImage || "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
