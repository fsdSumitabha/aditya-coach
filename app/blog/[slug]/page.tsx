import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import ArticleCard from "@/components/blog/ArticleCard";
import AuthorBox from "@/components/blog/AuthorBox";
import CategoryChip from "@/components/blog/CategoryChip";
import EndCta from "@/components/blog/EndCta";
import PrevNextNav from "@/components/blog/PrevNextNav";
import { POST_BODIES } from "@/components/blog/post-bodies";
import { blogAuthor, getPost, posts, prevNext, relatedPosts } from "@/lib/blog";
import { sameAsLinks } from "@/lib/schema";
import { SITE_NAME, SITE_ORIGIN, pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

/* Primary + secondary keywords per post (spec Part C) — JSON-LD only. [review] */
const POST_KEYWORDS: Record<string, string[]> = {
  "lifestyle-first-why-most-diets-fail-men": [
    "why diets fail for men",
    "fix lifestyle first",
    "right order of change",
    "lifestyle before diet",
    "sustainable weight loss for men",
    "men's transformation Kolkata",
  ],
  "how-much-should-a-man-eat-to-lose-fat": [
    "how much should a man eat to lose fat",
    "calories to lose fat men",
    "protein intake for fat loss",
    "calorie calculator for men",
    "how many calories to lose weight",
  ],
  "sleep-habits-drive-men-30-50": [
    "how to get your drive back (men 30-50)",
    "rebuild energy and discipline",
    "low energy men over 30",
    "better sleep for men",
    "discipline over motivation",
    "midlife confidence",
    "men's lifestyle coach Kolkata",
  ],
};

/* Approximate word counts (~200 wpm × read time) for BlogPosting.wordCount. [review] */
const POST_WORD_COUNT: Record<string, number> = {
  "lifestyle-first-why-most-diets-fail-men": 1200,
  "how-much-should-a-man-eat-to-lose-fat": 1400,
  "sleep-habits-drive-men-30-50": 1600,
};

/* Author/publisher Person — geo Kolkata, worldwide online coaching (mirrors
   the site-wide Person/LocalBusiness convention in lib/schema.ts). */
const authorPerson = {
  "@type": "Person",
  name: blogAuthor.name,
  jobTitle: blogAuthor.role,
  url: `${SITE_ORIGIN}${blogAuthor.url}`,
  sameAs: sameAsLinks,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  description:
    "Men's lifestyle coach based in Kolkata, coaching men worldwide online.",
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---- B0. Per-page SEO (dynamic, per post) ----
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const base = pageMetadata({
    title: post.seoTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    ogType: "article",
    ogImage: post.cover.src,
  });
  return {
    ...base,
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        { url: post.cover.src, width: post.cover.w, height: post.cover.h },
      ],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [blogAuthor.name],
      section: post.category,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Body = POST_BODIES[post.slug];
  const { prev, next } = prevNext(post.slug);
  const related = relatedPosts(post.slug);
  const canonical = `${SITE_ORIGIN}/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: `${SITE_ORIGIN}${post.cover.src}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    wordCount: POST_WORD_COUNT[post.slug] /* [review] */,
    keywords: POST_KEYWORDS[post.slug],
    articleSection: post.category,
    inLanguage: "en",
    author: authorPerson,
    publisher: authorPerson,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_ORIGIN}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <>
      {/* Reading-progress bar pinned to viewport top (decorative, motion-safe) */}
      <ScrollProgress />
      <JsonLd data={[blogPostingSchema, breadcrumbSchema]} />

      <div className="container-site section">
        <div className="mx-auto max-w-[760px]">
          {/* 1. BREADCRUMB — low visual weight, above the fold */}
          <nav aria-label="Breadcrumb">
            <ol className="type-caption flex flex-wrap items-center gap-2 text-muted">
              <li>
                <Link href="/" className="hover:text-secondary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-secondary">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{post.category}</li>
            </ol>
          </nav>

          <article>
            {/* 2. ARTICLE HERO */}
            <header className="mt-8">
              <Reveal className="flex flex-wrap items-center gap-3">
                <CategoryChip label={post.category} />
                {/* read time as a matching gold-hairline chip */}
                <span className="type-caption inline-flex items-center rounded-full border border-hairline-gold px-3 py-1 text-muted">
                  {post.readTime}
                </span>
              </Reveal>
              {/* Hero H1 — LCP text: never animated, final state frame 1 */}
              <h1 className="type-h1 mt-5 text-primary">{post.title}</h1>
              <Reveal
                as="p"
                delayMs={120}
                className="type-small mt-5 text-muted"
              >
                Published{" "}
                <time dateTime={post.datePublished}>
                  {formatDate(post.datePublished)}
                </time>{" "}
                {/* [review] */}· Reviewed{" "}
                <time dateTime={post.dateModified}>
                  {formatDate(post.dateModified)}
                </time>{" "}
                {/* [review] */}· By{" "}
                <Link
                  href={blogAuthor.url}
                  className="text-gold-500 hover:text-gold-300"
                >
                  Aditya Kumar Upadhyay
                </Link>
              </Reveal>
            </header>

            {/* 3. COVER — the LCP. Inline-SVG placeholder: zero network,
                   explicit w/h, zero CLS (swap for a real eager +
                   fetchpriority="high" <img> of the same w/h). */}
            <figure className="mt-8 overflow-hidden rounded-[16px]">
              <PlaceholderImage
                label="ARTICLE COVER"
                w={post.cover.w}
                h={post.cover.h}
                alt={post.cover.alt}
                variant="cover"
                className="sd-zoom"
              />
            </figure>

            {/* 4–5. PROSE BODY (+ mid-article CTA placed inside the body by
                   its content component). Bodies start at h2 — this template
                   owns the H1/cover/meta/author chrome.
                   Presentation-only, scoped to this wrapper (copy unchanged):
                   • drop cap on the intro paragraph (Fraunces, gold, float)
                   • pull-quotes get a faint gold glow (bg tint + inset shadow) */}
            <div className="article-prose mx-auto mt-10 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:font-display [&>p:first-of-type]:first-letter:text-[3.2em] [&>p:first-of-type]:first-letter:font-medium [&>p:first-of-type]:first-letter:leading-[0.72] [&>p:first-of-type]:first-letter:text-gold-300 [&_blockquote]:rounded-r-[10px] [&_blockquote]:bg-[color:rgba(201,162,75,0.045)] [&_blockquote]:pr-5 [&_blockquote]:shadow-[inset_0_0_44px_-16px_rgba(201,162,75,0.5)]">
              <Body />
            </div>

            {/* 6. END CTA — driven by post.primaryCTA */}
            <Reveal className="cv-auto">
              <EndCta primaryCTA={post.primaryCTA} />
            </Reveal>

            {/* 7. AUTHOR BOX */}
            <Reveal index={1} className="cv-auto">
              <AuthorBox />
            </Reveal>
          </article>
        </div>

        {/* Gold-thread stitch — draws itself as you scroll from the article
            into the "keep reading" zone (base state = fully drawn). */}
        <div
          className="thread-h sd-draw mx-auto mt-16 max-w-[760px]"
          aria-hidden="true"
        />

        {/* 8. RELATED + PREV/NEXT — the other two posts (in-blog cross-links) */}
        <section
          aria-labelledby="keep-reading-heading"
          className="cv-auto mt-16 pb-10"
        >
          <Reveal>
            <h2 id="keep-reading-heading" className="type-h2 text-primary">
              Keep reading
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 min-[600px]:grid-cols-2 md:gap-8">
            {related.map((relatedPost, i) => (
              <Reveal key={relatedPost.slug} delayMs={i * 80} className="h-full">
                <ArticleCard post={relatedPost} headingLevel="h3" />
              </Reveal>
            ))}
          </div>
          <PrevNextNav prev={prev} next={next} />
        </section>
      </div>
    </>
  );
}
