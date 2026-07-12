import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import Calculator from "@/components/tools/Calculator";
import LeadMagnetCard from "@/components/tools/LeadMagnetCard";
import { BLUEPRINT_PDF, SPLIT_PDF, OG_IMAGE } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

const TITLE = "Free Tools for Men | Calorie Calculator & Blueprint";
const DESCRIPTION =
  "Free lifestyle blueprint, a 3-day fat-loss training split and a calorie calculator that shows how much a man should really be eating.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools",
});

// Page-level schema: WebPage referencing the global Person/Business nodes
// (emitted in layout — referenced by @id, not redefined) + a free
// WebApplication node for the calculator. Descriptive only — no medical claims.
const toolsSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_ORIGIN}/tools#webpage`,
    name: TITLE,
    url: `${SITE_ORIGIN}/tools`,
    description: DESCRIPTION,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}${OG_IMAGE}`,
      width: 1200,
      height: 630,
    },
    about: { "@id": `${SITE_ORIGIN}/#person` },
    provider: { "@id": `${SITE_ORIGIN}/#business` },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calorie & Protein Calculator",
    url: `${SITE_ORIGIN}/tools#calculator`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@id": `${SITE_ORIGIN}/#business` },
  },
];

const chipClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-hairline px-5 type-small text-secondary transition-colors hover:border-hairline-gold hover:text-primary";

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={toolsSchema} />
      {/* smooth in-page anchor scroll for the micro-nav chips; motion-safe only */}
      <style>{`@media (prefers-reduced-motion: no-preference){html{scroll-behavior:smooth}}`}</style>

      {/* ---- 1. HERO — no photo, no CTA button; the tools below ARE the CTAs ---- */}
      <section className="bg-void glow-top grain">
        <div className="container-site section-lg text-center">
          <h1 className="type-h1 text-primary max-w-[14ch] mx-auto">
            Start Here. Completely Free.
          </h1>
          <Reveal
            as="p"
            delayMs={100}
            className="type-lead text-secondary mt-5 max-w-[52ch] mx-auto"
          >
            Three free tools to start rebuilding your body and your discipline
            today — no payment, no catch.{/* [review] */}
          </Reveal>
          <Reveal delayMs={200} className="mt-8">
            {/* [review] micro-nav anchor chips */}
            <nav
              aria-label="Free tools on this page"
              className="flex flex-wrap justify-center gap-3"
            >
              <a href="#blueprint" className={chipClass}>
                Lifestyle Blueprint
              </a>
              <a href="#training-split" className={chipClass}>
                Training Split
              </a>
              <a href="#calculator" className={chipClass}>
                Calorie Calculator
              </a>
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ---- 2. LEAD MAGNET 1 — The Lifestyle Blueprint ---- */}
      <section
        id="blueprint"
        className="bg-alt cv-auto border-t border-hairline-soft"
      >
        <div className="container-site section">
          <Reveal className="max-w-[720px] mx-auto">
            <LeadMagnetCard
              title="The Lifestyle Blueprint"
              description="10 lifestyle changes that rebuild a man completely — body, mind and hormones. Start tonight."
              imageLabel="IMG-BLUEPRINT"
              imageAlt="Cover of the free Lifestyle Blueprint PDF"
              source="tools-blueprint"
              pdfHref={BLUEPRINT_PDF}
              pdfLabel={"Open the Blueprint now" /* [review] */}
              buttonLabel={"Send Me the Blueprint" /* [review] */}
              successBody={
                "Your Lifestyle Blueprint has been emailed to you." /* [review] */
              }
            />
          </Reveal>
        </div>
      </section>

      {/* ---- 3. LEAD MAGNET 2 — The Fat Loss Training Split ---- */}
      <section
        id="training-split"
        className="bg-base cv-auto border-t border-hairline-soft"
      >
        <div className="container-site section">
          <Reveal className="max-w-[720px] mx-auto">
            <LeadMagnetCard
              title="The Fat Loss Training Split"
              description="The exact 3 day training plan I use with every client for fat loss and muscle building together."
              imageLabel="IMG-SPLIT"
              imageAlt="Cover of the free 3-day Fat Loss Training Split PDF"
              source="tools-split"
              pdfHref={SPLIT_PDF}
              pdfLabel={"Open the Training Split now" /* [review] */}
              buttonLabel={"Send Me the Split" /* [review] */}
              successBody={
                "Your Fat Loss Training Split has been emailed to you." /* [review] */
              }
            />
          </Reveal>
        </div>
      </section>

      {/* ---- 4. THE CALORIE CALCULATOR — the hero tool ---- */}
      <section
        id="calculator"
        className="bg-alt cv-auto border-t border-hairline-soft"
      >
        {/* extra bottom padding keeps ~88px+ clearance under the WhatsApp FAB */}
        <div className="container-site section" style={{ paddingBottom: 112 }}>
          <Reveal className="text-center max-w-[720px] mx-auto">
            <h2 className="type-h2 text-primary">
              Get a Starting Estimate of How Much You Should Be Eating.
            </h2>
            <p className="type-lead text-secondary mt-5">
              Most men are eating for the body they currently have. You should
              be eating for the body you want to have. This calculator shows
              you the difference.
            </p>
          </Reveal>
          <Reveal index={1} className="max-w-[880px] mx-auto mt-10">
            <Calculator />
          </Reveal>
        </div>
      </section>
    </>
  );
}
