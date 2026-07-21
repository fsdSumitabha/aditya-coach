import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import ArticleCard from "@/components/blog/ArticleCard";
import { BLUEPRINT_PDF } from "@/lib/config";
import { posts } from "@/lib/blog";
import { sameAsLinks } from "@/lib/schema";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ---- A0. Per-page SEO (A6 verbatim) ----
export const metadata: Metadata = pageMetadata({
  title: "Blog | Lifestyle & Fitness Advice for Men | Kolkata",
  description:
    "Direct, no-fluff articles on lifestyle, nutrition, sleep and discipline for men who want their drive and confidence back.",
  path: "/blog",
  ogType: "website",
  ogImage: "/img/og/blog-index.jpg" /* TODO: replace — 1200×630 OG image */,
});

// ---- A0. JSON-LD: Blog (with BlogPosting stubs) + BreadcrumbList ----
const authorPerson = {
  "@type": "Person",
  name: "Aditya Kumar Upadhyay",
  url: `${SITE_ORIGIN}/about`,
  sameAs: sameAsLinks,
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_ORIGIN}/blog#blog`,
  name: "Articles for Men Who Want More.",
  url: `${SITE_ORIGIN}/blog`,
  description:
    "Direct, no-fluff articles on lifestyle, nutrition, sleep and discipline for men who want their drive and confidence back.",
  publisher: {
    "@type": "Organization",
    name: "Aditya Kumar Upadhyay Coaching",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/icon-512.png`,
    },
  },
  blogPost: posts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${SITE_ORIGIN}/blog/${post.slug}`,
    datePublished: post.datePublished,
    author: authorPerson,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${SITE_ORIGIN}/blog`,
    },
  ],
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={[blogSchema, breadcrumbSchema]} />

      {/* 1. HERO — compact dark text band (LCP is the H1 text node).
             aurora = drifting gold atmosphere, grain = material; H1 static.
             overflow-hidden contains the aurora bleed (no horizontal scroll). */}
      <section className="aurora grain relative overflow-hidden">
        <div className="container-site pt-16 pb-10 md:pt-24 md:pb-14">
          <Reveal className="flex items-center gap-4">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
            <p className="eyebrow">THE BLOG {/* [review] */}</p>
          </Reveal>
          {/* Hero H1 — LCP: never animated, paints at final state frame 1 */}
          <h1 className="font-display mt-5 max-w-[16ch] text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.025em] text-primary">
            Articles for Men Who Want More.
          </h1>
          <Reveal
            as="p"
            delayMs={120}
            className="type-lead mt-5 max-w-[60ch] text-secondary"
          >
            {
              "No theory for the sake of theory. Direct, no-fluff writing on lifestyle, nutrition, sleep and discipline — for men who want their drive and confidence back. Read one. Then go do the work."
            }{" "}
            {/* [review] */}
          </Reveal>
          <div className="thread-h sd-draw mt-10 h-px" aria-hidden="true" />
        </div>
      </section>

      {/* 2. ARTICLE GRID — 1 col ≤600px, 2 col 600–1000px, 3 col ≥1000px */}
      <section aria-label="All articles" className="pb-16 md:pb-24">
        <div className="container-site">
          {posts.length === 0 ? (
            <p className="type-lead text-muted">
              New articles coming soon. {/* [review] */}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3 md:gap-8">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delayMs={i * 80} className="h-full">
                  {/* TiltCard = desktop-only ≤3° cursor tilt (no-op on touch) */}
                  <TiltCard className="h-full">
                    <ArticleCard post={post} headingLevel="h2" />
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FOOTER EMAIL CAPTURE — sits directly above the global footer;
             the real lead magnets live on /tools (this routes there) */}
      <section
        aria-labelledby="blog-blueprint-heading"
        className="cv-auto aurora relative overflow-hidden border-t border-hairline-gold bg-void"
      >
        <div className="container-site section" style={{ paddingBottom: 112 }}>
          <div className="mx-auto max-w-2xl text-center">
            {/* [review] copy — SplitHeading word-mask rise (replaces Reveal) */}
            <SplitHeading
              as="h2"
              id="blog-blueprint-heading"
              text="Get the free blueprint."
              className="type-h2 text-primary"
            />
            <Reveal index={1}>
              <p className="type-lead mt-4 text-secondary">
                10 lifestyle changes that rebuild a man completely — body, mind
                and hormones. Start tonight.
              </p>
            </Reveal>
            <Reveal index={2} className="mt-8 text-left">
              <LeadMagnetForm
                source="blog-index"
                buttonLabel="Get My Free Blueprint"
                pdfHref={BLUEPRINT_PDF}
                pdfLabel="Download the Lifestyle Blueprint"
                successTitle="You're in." /* [review] */
                successBody="Check your email — your blueprint is on the way." /* [review] */
              >
                <Link
                  href="/tools"
                  className="type-small font-semibold text-gold-500 hover:text-gold-300"
                >
                  Explore all the free tools → {/* [review] */}
                </Link>
                <Link
                  href="/book"
                  className="type-small font-semibold text-gold-500 hover:text-gold-300"
                >
                  Book Your Transformation Audit →
                </Link>
              </LeadMagnetForm>
            </Reveal>
            <Reveal index={3}>
              <p className="type-small mt-6 text-muted">
                {
                  "Everything free — the blueprint, the calculator, the guides — lives on the "
                }
                <Link
                  href="/tools"
                  className="text-gold-500 underline underline-offset-2 hover:text-gold-300"
                >
                  Tools page
                </Link>
                . {/* [review] */}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
