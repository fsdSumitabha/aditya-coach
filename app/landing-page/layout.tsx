import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import WhatsAppFab from "@/components/WhatsAppFab";

/**
 * /landing-page — the paid-traffic layout.
 *
 * Deliberately outside app/(site), so it inherits none of the site chrome: no
 * sticky nav, no four-column footer. A Meta visitor who clicked an ad for one
 * offer must not be handed eight nav links to leak out through
 * (Transformation Audit brief §1, "Meta landing-page behaviour").
 *
 * What it gets instead is the minimum a page that takes money must carry: the
 * logo, one discreet way back to the full site, and the legal footer.
 *
 * The WhatsApp FAB is here by explicit instruction (31 Aug 2026). It is the
 * one deliberate exception to "no exits": the Audit is delivered on WhatsApp,
 * so a man who wants to ask before he pays is not leaving the funnel — he is
 * entering it through the other door. It owns the bottom-right corner, which
 * is why this page carries no sticky booking bar.
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
      <WhatsAppFab />
    </>
  );
}
