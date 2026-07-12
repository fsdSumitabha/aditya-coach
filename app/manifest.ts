import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aditya Kumar Upadhyay — Men's Lifestyle Coach",
    short_name: "Aditya Coach",
    description:
      "Men's lifestyle and transformation coaching in Kolkata and worldwide online.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080A",
    theme_color: "#0B0B0C",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
