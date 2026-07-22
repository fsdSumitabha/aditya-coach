import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CookieBanner from "@/components/CookieBanner";
import TrackPageview from "@/components/TrackPageview";
import FxController from "@/components/FxController";
import JsonLd from "@/components/JsonLd";
import { businessSchema, personSchema } from "@/lib/schema";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // "optional": headlines are the LCP on most pages — never re-paint them on
  // font swap (A2 LCP < 2.5s). Slow first visits get the metric-matched
  // serif fallback; cached/fast visits render Fraunces.
  display: "optional",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Transformation Coach for Men in Kolkata | Aditya Upadhyay",
    template: "%s",
  },
  description:
    "Rebuild your body, mind and confidence. Men's lifestyle and transformation coaching in Kolkata and worldwide online.",
  applicationName: SITE_NAME,
  icons: {
    // explicit metadata URLs don't get basePath'd automatically
    icon: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg`,
        type: "image/svg+xml",
      },
    ],
    apple: [
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/apple-touch-icon.png` },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-primary">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={[personSchema, businessSchema]} />
        <TrackPageview />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <CookieBanner />
        <FxController />
      </body>
    </html>
  );
}
