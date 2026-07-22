import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return {
    name: "Aditya Kumar Upadhyay — Complete Transformation Coach for Men",
    short_name: "Aditya Coach",
    description:
      "Men's lifestyle and transformation coaching in Kolkata and worldwide online.",
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#08080A",
    theme_color: "#0B0B0C",
    icons: [
      {
        src: `${base}/favicon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: `${base}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
