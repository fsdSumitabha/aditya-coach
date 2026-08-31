import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

/**
 * /landing-page — the paid-traffic layout.
 *
 * Deliberately outside app/(site), so it inherits none of the site chrome:
 * no sticky nav, no four-column footer, no WhatsApp FAB. A Meta visitor who
 * clicked an ad for one offer must not be handed eight nav links and a chat
 * button to leak out through (Transformation Audit brief §1, "Meta
 * landing-page behaviour").
 *
 * What it gets instead is the minimum a page that takes money must carry: the
 * logo, one discreet way back to the full site, and the legal footer.
 *
 * The root layout still supplies <html>/<body>, the fonts, the site-wide
 * JSON-LD, pageview tracking, the cookie banner and the FX controller.
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </>
  );
}
