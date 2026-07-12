import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 1 is 100% static — export plain HTML deployable to any static host.
  // Phase 2 (Razorpay/Brevo Route Handlers) will switch this to the default runtime.
  output: "export",
  images: {
    // All Phase-1 images are inline SVG placeholders; no optimizer needed for export.
    unoptimized: true,
  },
  experimental: {
    // Inline the (small) global stylesheet — removes a render-blocking
    // round-trip on 4G, protecting the LCP < 2.5s target (A2).
    inlineCss: true,
  },
};

export default nextConfig;
