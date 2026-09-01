import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import { WhatsAppIcon } from "@/components/icons";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { waLink } from "@/lib/config";
import FoundationStack from "@/components/method/FoundationStack";
import { METHOD_STEPS } from "@/components/method/method-steps";
import { OG_METHOD_IMG } from "@/components/method/method-assets";

// ============================================================
// BUILD SPEC — /method — "The Method" (The Complete Rebuild, in the Right Order)
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "The Right Order of Change | Method for Men",
  description:
    // [review] — natural men's-transformation keywords, five-step framing
    "The Complete Rebuild for men: lifestyle, body, nutrition, performance, then presence — built in the exact order that makes change last. Aditya's men's transformation method.",
  path: "/method",
  ogImage: OG_METHOD_IMG,
});


// ---- Page-level JSON-LD ----
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Complete Rebuild — The Right Order of Change",
  description:
    "Lifestyle, then body, then nutrition, then performance, then presence — the exact order Aditya uses to build change in men that actually lasts.",
  // The steps now live inside the pinned stack's detail panel, so there is no
  // per-step anchor to point at — the schema describes the page as a whole.
  step: METHOD_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.body,
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Men's Lifestyle Coaching",
  provider: { "@id": `${SITE_ORIGIN}/#person` },
  areaServed: { "@type": "City", name: "Kolkata" },
  serviceArea: { "@type": "AdministrativeArea", name: "Worldwide (online)" },
  url: `${SITE_ORIGIN}/method`,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: "The Method", item: `${SITE_ORIGIN}/method` },
  ],
};

export default function MethodPage() {
  return (
    <>
      <JsonLd data={[howToSchema, serviceSchema, breadcrumbSchema]} />

      {/* ============ 3. FOUNDATION-STACK VISUAL (pyramid: Presence narrowest on top → Lifestyle widest at the bottom) ============ */}
      <section
        id="foundation-stack"
        className="border-y border-hairline-soft bg-alt"
      >
        {/* Page h1 — the hero that carried it is gone; keep exactly one h1 */}
        <h1 className="sr-only">The Right Order of Change.</h1>
        {/* Real-text equivalent for assistive tech — the stack below is decorative */}
        <p className="sr-only">
          The Complete Rebuild, in order: Lifestyle first, then Body, then
          Nutrition, then Performance, with Presence last.
        </p>
        {/* The five layers, widest last — each box carries its own copy */}
        <FoundationStack />
      </section>

      {/* Decorative ticker — verbatim layer labels closing the stack scene */}
      <div className="border-b border-hairline-soft bg-void py-6 md:py-8">
        <Marquee
          items={["Lifestyle", "Body", "Nutrition", "Performance", "Presence"]}
          speedS={34}
        />
      </div>


      {/* ============ 5b. POSITIONING — WHO THE COMPLETE REBUILD IS FOR ============ */}
      <section className="cv-auto aurora grain relative overflow-hidden border-t border-hairline-soft bg-surface-warm">
        <div className="container-site section text-center">
          <Reveal>
            <p className="eyebrow">WHO THIS IS FOR{/* [review] */}</p>
          </Reveal>
          {/* verbatim from Aditya's brief */}
          <SplitHeading
            as="h2"
            text="A strong body should be matched with a strong presence."
            className="type-h2 text-primary mx-auto mt-4 max-w-[24ch]"
          />
          <Reveal delayMs={150} className="reveal-blur mx-auto mt-6 max-w-[58ch]">
            {/* verbatim from Aditya's brief (§1) */}
            <p className="type-lead text-secondary">
              There is no point in having a six-pack if you still look at your
              shoes when you enter a room.
            </p>
            <p className="type-body text-secondary mt-4">
              {/* [review] — positioning, not a repeat of step 05 */}
              This is for the man who&apos;s done with quick fixes — who wants
              the whole thing rebuilt, in the right order, and built to last.
              Not a workout plan. A different life.
            </p>
          </Reveal>
          <Reveal delayMs={250} className="mt-8">
            <Link href="/results" className="btn-outline">
              See Real Results
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 6. MEDICAL / RESULTS DISCLAIMER STRIP (compliance) ============ */}
      <section className="bg-void">
        <div className="container-site py-8 md:py-10">
          {/* gold thread stitch above the compliance strip */}
          <div
            aria-hidden="true"
            className="thread-h sd-draw mx-auto mb-8 w-full max-w-[88ch]"
          />
          <p className="type-small mx-auto max-w-[88ch] text-center text-muted">
            Aditya is a lifestyle coach, not a doctor or registered dietitian.
            This method is general guidance, not medical advice, and individual
            results vary. Any medical step is taken only under a qualified
            physician. Consult a doctor before changing your health, diet or
            exercise.
          </p>
        </div>
      </section>

      {/* ============ 7. FINAL CTA BLOCK → /book (primary) + /tools (secondary) ============ */}
      <section className="aurora grain relative overflow-hidden border-t border-hairline-gold bg-surface-warm">
        <div
          className="container-site section relative z-10 flex flex-col items-center text-center"
          style={{ paddingBottom: 112 }}
        >
          <Reveal>
            <h2 className="type-h2 max-w-[22ch] text-primary">
              Get your order mapped in one call.
            </h2>{/* [review] */}
          </Reveal>
          <Reveal delayMs={100}>
            <p className="type-lead mt-4 max-w-xl text-secondary">
              Not a plan you&apos;ll quit. The exact order <em>your</em> body
              needs — in the right sequence.
            </p>{/* [review] */}
          </Reveal>
          <Reveal delayMs={200} className="mt-10">
            {/* VERBATIM brand close */}
            <p className="font-display mx-auto max-w-[24ch] text-xl text-primary md:text-2xl">
              The man you want to become is waiting for one decision.
            </p>
            <p className="type-body mx-auto mt-3 max-w-xl text-secondary">
              Start with a free blueprint. Or book your Transformation Audit today. Either
              way — start now.
            </p>
          </Reveal>
          <div className="cta-stack mt-9 justify-center">
            {/* primary lands last with an overshoot pop */}
            <Reveal
              delayMs={450}
              style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
            >
              <Link href="/book" className="btn-gold shine-loop w-full md:w-auto">
                Book Your Transformation Audit
              </Link>{/* [review] */}
            </Reveal>
          </div>
          <Reveal delayMs={550} className="mt-6">
            <a
              href={waLink(
                "Hi Aditya, I read The Right Order of Change and want to map my order." /* [review] */,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="type-small inline-flex min-h-[48px] items-center gap-2 font-medium text-wa transition-colors hover:text-wa-deep"
            >
              <WhatsAppIcon width={18} height={18} />
              Chat with Aditya
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
