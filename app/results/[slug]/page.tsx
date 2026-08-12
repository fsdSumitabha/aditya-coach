import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { ArrowRightIcon } from "@/components/icons";
import { getStory, otherStories, stories, type ClientStory } from "@/lib/stories";
import { SITE_NAME, SITE_ORIGIN, pageMetadata } from "@/lib/site";

/* ============================================================
   /results/[slug] — ONE CLIENT STORY
   The read-through from <TransformationStage>: the diptych a
   second time at full size, then problem → what we changed →
   result in his own section beats, then the funnel to /book.
   All content comes from lib/stories.ts — this file is layout.
   ============================================================ */

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  const base = pageMetadata({
    title: story.seoTitle,
    description: story.metaDescription,
    path: `/results/${story.slug}`,
    ogType: "article",
    ogImage: story.after.src,
  });
  return {
    ...base,
    openGraph: {
      title: story.seoTitle,
      description: story.metaDescription,
      type: "article",
      url: `/results/${story.slug}`,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        { url: story.after.src, width: story.after.w, height: story.after.h },
      ],
    },
  };
}

// ---- Page-scoped FX. globals.css is shared and never edited; these classes
// mirror the frame treatment in <TransformationStage> so a reader arriving
// from the stage lands on the same material.
const STORY_FX_CSS = `
.story-frame {
  background: var(--grad-card-warm);
  border: 1px solid var(--hairline-gold);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
}
.story-well {
  border: 1px solid rgba(201, 162, 75, 0.16);
  background: var(--surface-2);
}
.story-seam {
  background: linear-gradient(180deg, transparent, var(--gold-500) 12%, var(--gold-500) 88%, transparent);
}
`;

/** One hung frame — same 3:4 well, mat and plate as the stage. */
function StoryPanel({
  shot,
  side,
  eager,
}: {
  shot: ClientStory["before"];
  side: "BEFORE" | "AFTER";
  eager: boolean;
}) {
  return (
    <figure className="story-frame m-0 rounded-[8px] p-1.5 nav:p-3">
      <div className="story-well relative aspect-[3/4] w-full overflow-hidden rounded-[4px]">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 900px) 440px, 46vw"
          // Eager, not priority: the h1 above is the LCP, and preloading here
          // would compete with it.
          loading={eager ? "eager" : "lazy"}
          style={{ objectPosition: shot.pos ?? "50% 22%" }}
          className="sd-wipe object-cover"
        />
      </div>
      <figcaption className="pt-1.5 text-center nav:pt-2.5">
        <span className="eyebrow text-gold-300">{side}</span>
      </figcaption>
    </figure>
  );
}

export default async function ClientStoryPage({ params }: Params) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const more = otherStories(story.slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformations",
        item: `${SITE_ORIGIN}/results`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: story.head,
        item: `${SITE_ORIGIN}/results/${story.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <style>{STORY_FX_CSS}</style>

      <article>
        {/* ---- HERO — the head is the h1 and paints at final state frame 1 ---- */}
        <section className="bg-void aurora grain relative overflow-hidden border-b border-hairline-soft">
          <div className="container-site section relative z-10 text-center">
            <Link
              href="/results"
              className="link-draw type-small inline-flex min-h-[48px] items-center gap-2 text-muted"
            >
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4 rotate-180" />
              All transformations
            </Link>

            <div className="mx-auto mt-2 max-w-[900px]">
              <div className="mb-5 flex items-center justify-center gap-4">
                <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
                <p className="eyebrow">{story.eyebrow}</p>
                <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
              </div>

              <h1 className="font-display text-[clamp(2.1rem,5.2vw,3.9rem)] font-medium leading-[1.06] tracking-[-0.03em] text-primary">
                {story.head}
              </h1>

              {story.descriptor && (
                <Reveal
                  as="p"
                  delayMs={70}
                  className="type-small mt-5 text-muted"
                >
                  {story.descriptor}
                </Reveal>
              )}

              {story.standfirst && (
                <Reveal
                  as="p"
                  delayMs={story.descriptor ? 140 : 70}
                  className="type-lead mx-auto mt-6 max-w-[54ch] text-secondary"
                >
                  {story.standfirst}
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* ---- THE DIPTYCH — the page's one showpiece ---- */}
        <section className="bg-base grain cv-auto relative overflow-hidden border-b border-hairline-soft">
          <div className="container-site section">
            <div className="relative mx-auto grid max-w-[980px] grid-cols-2 gap-2.5 nav:gap-[140px]">
              <StoryPanel shot={story.before} side="BEFORE" eager />
              <StoryPanel shot={story.after} side="AFTER" eager={false} />

              {/* The seam: gold thread through a before → after badge. Bottom
                  padding lifts it off the plates so it centres on the photos. */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-12 -translate-x-1/2 flex-col items-center pb-[34px] nav:pb-[50px]">
                <span aria-hidden="true" className="story-seam w-px flex-1" />
                <span
                  aria-hidden="true"
                  className="my-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.8)] shadow-[0_6px_20px_rgba(0,0,0,0.5)] backdrop-blur-[4px] nav:h-11 nav:w-11"
                >
                  <ArrowRightIcon className="h-4 w-4 text-gold-300" />
                </span>
                <span aria-hidden="true" className="story-seam w-px flex-1" />
              </div>
            </div>
          </div>
        </section>

        {/* ---- THE STORY — problem → what we changed → result ---- */}
        <section className="bg-alt cv-auto border-b border-hairline-soft">
          <div className="container-site section">
            <div className="mx-auto max-w-[64ch]">
              {story.blocks.map((block, i) => (
                <Reveal
                  as="div"
                  key={block.label}
                  index={i}
                  className={i === 0 ? "" : "mt-12 nav:mt-16"}
                >
                  <div className="flex items-center gap-4">
                    <p className="eyebrow shrink-0">{block.label}</p>
                    <span aria-hidden="true" className="thread-h sd-draw h-px flex-1" />
                  </div>
                  <p className="type-lead mt-4 text-secondary">{block.body}</p>
                </Reveal>
              ))}

              <Reveal as="p" index={3} className="type-small mt-14 text-muted">
                {story.disclaimer}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- MORE STORIES — only rendered once a second one is published ---- */}
        {more.length > 0 && (
          <section className="bg-surface-1 cv-auto border-b border-hairline-soft">
            <div className="container-site section">
              <SplitHeading
                as="h2"
                text="Real Men. Real Results."
                className="type-h2 text-center text-primary"
              />
              <ul className="mx-auto mt-10 grid max-w-[980px] list-none grid-cols-1 gap-6 p-0 nav:grid-cols-2">
                {more.map((other, i) => (
                  <Reveal as="li" key={other.slug} index={i}>
                    <Link
                      href={`/results/${other.slug}`}
                      className="card spot flex h-full flex-col gap-4 no-underline nav:flex-row"
                    >
                      <span className="story-well relative block aspect-[3/4] w-full shrink-0 overflow-hidden rounded-[4px] nav:w-[124px]">
                        <Image
                          src={other.after.src}
                          alt=""
                          fill
                          sizes="(min-width: 900px) 124px, 90vw"
                          className="object-cover"
                          style={{ objectPosition: other.after.pos ?? "50% 22%" }}
                        />
                      </span>
                      <span className="block">
                        <span className="eyebrow block">{other.eyebrow}</span>
                        <span className="font-display mt-2 block text-[1.15rem] leading-[1.3] text-primary">
                          {other.head}
                        </span>
                        <span className="type-small mt-3 inline-flex items-center gap-1.5 text-gold-300">
                          Read his story
                          <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        <FinalCta
          sub="Start with a free blueprint. Or book your Transformation Audit today. Either way — start now."
          secondaryHref="/tools"
        />
      </article>
    </>
  );
}
