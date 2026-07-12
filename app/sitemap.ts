import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { posts } from "@/lib/blog";

export const dynamic = "force-static";

// All indexable routes from A6. /thank-you and the 404 are noindex → excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/method", priority: 0.8 },
    { path: "/programs", priority: 0.9 },
    { path: "/results", priority: 0.8 },
    { path: "/tools", priority: 0.9 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/book", priority: 1 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/refund", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_ORIGIN}${r.path === "/" ? "" : r.path}`,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...posts.map((p) => ({
      url: `${SITE_ORIGIN}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
