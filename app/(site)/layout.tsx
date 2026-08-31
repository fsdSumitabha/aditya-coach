import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

/**
 * The site layout — every route the visitor can browse to.
 *
 * This is where the shared chrome lives: sticky header with the full nav,
 * four-column footer, WhatsApp FAB. It is deliberately NOT in the root
 * layout, because one route does not want any of it: /landing-page is a paid
 * -traffic destination that ships its own minimal header and legal footer
 * (see app/landing-page/layout.tsx). Two layouts, no conditionals — a route
 * gets this chrome by living in this group, and opts out by living outside it.
 *
 * "(site)" is a route group: the parentheses keep it out of the URL, so
 * app/(site)/about/page.tsx still serves /about.
 *
 * The root layout (app/layout.tsx) keeps only what is genuinely global —
 * <html>/<body>, fonts, the site-wide JSON-LD, pageview tracking, the cookie
 * banner and the FX controller.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
