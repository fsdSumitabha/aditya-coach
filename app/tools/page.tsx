import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
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
  "tools-chip inline-flex min-h-[48px] items-center justify-center rounded-full border border-hairline px-5 type-small text-secondary transition-colors hover:border-hairline-gold hover:text-primary";

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={toolsSchema} />
      {/* smooth in-page anchor scroll for the micro-nav chips; motion-safe only.
          The anchor chips are links → a gold "metal shine" sweeps across on
          hover (same material language as .btn-gold; motion-safe + desktop). */}
      <style>{`@media (prefers-reduced-motion: no-preference){html{scroll-behavior:smooth}}
.tools-chip{position:relative;overflow:hidden}
.tools-chip::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-40%;width:45%;pointer-events:none;background:linear-gradient(105deg,transparent,rgba(240,230,200,0.26) 50%,transparent);transform:translateX(-160%) skewX(-18deg)}
@media (hover:hover) and (prefers-reduced-motion: no-preference){.tools-chip:hover::after{animation:tools-chip-shine .8s var(--ease-standard)}}
@keyframes tools-chip-shine{to{transform:translateX(320%) skewX(-18deg)}}`}</style>

      {/* ---- 1. HERO — no photo, no CTA button; the tools below ARE the CTAs ---- */}
      <section className="bg-void grain aurora relative overflow-hidden">
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            <p className="eyebrow">FREE TOOLS{/* [review] */}</p>
            <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
          </div>
          <h1 className="font-display mx-auto max-w-[15ch] text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.03em] text-primary">
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

          {/* quiet cue at the panel's base */}
          <Reveal
            delayMs={500}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 motion-safe:animate-[wa-breathe_2.4s_ease-in-out_infinite]"
            >
              <span className="type-caption tracking-[0.24em] text-muted">
                PICK YOUR TOOL{/* [review] */}
              </span>
              <span className="block h-9 w-px bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
            </div>
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

      {/* gold-thread stitch: the give-first magnets draw down into the payoff.
          Static (full) on non-supporting browsers; scale-draws on scroll. */}
      <div className="container-site" aria-hidden="true">
        <div className="thread-h sd-draw" />
      </div>

      {/* ---- 4. THE CALORIE CALCULATOR — the hero tool ---- */}
      <section
        id="calculator"
        className="bg-alt cv-auto aurora relative overflow-hidden"
      >
        {/* extra bottom padding keeps ~88px+ clearance under the WhatsApp FAB */}
        <div className="container-site section" style={{ paddingBottom: 112 }}>
          <div className="text-center max-w-[720px] mx-auto">
            <SplitHeading
              as="h2"
              text="Get a Starting Estimate of How Much You Should Be Eating."
              className="type-h2 text-primary"
            />
            <Reveal
              as="p"
              delayMs={120}
              className="type-lead text-secondary mt-5"
            >
              Most men are eating for the body they currently have. You should
              be eating for the body you want to have. This calculator shows
              you the difference.
            </Reveal>
          </div>
          <Reveal index={1} className="max-w-[880px] mx-auto mt-10">
            <Calculator />
          </Reveal>
        </div>
      </section>
    </>
  );
}
