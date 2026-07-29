import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set NEXT_PUBLIC_BASE_PATH (e.g. "/aditya-coach") to build for subpath
  // hosting like GitHub Pages. Unset for root-domain hosts and localhost.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Phase 2: the site now ships a Node Route Handler (app/api/contact — SMTP
  // mail via nodemailer), which `output: "export"` cannot serve — a static
  // export only supports GET handlers with no Request access. So the default
  // server runtime is used and the site needs a Node host (Vercel/Render/VPS),
  // not a plain static host like GitHub Pages.
  images: {
    formats: ["image/webp"],
    contentDispositionType: "inline",
  },
  experimental: {
    // Inline the (small) global stylesheet — removes a render-blocking
    // round-trip on 4G, protecting the LCP < 2.5s target (A2).
    inlineCss: true,
  },
};

export default nextConfig;
