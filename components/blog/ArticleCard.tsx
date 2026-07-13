import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import CategoryChip from "@/components/blog/CategoryChip";
import { ArrowRightIcon } from "@/components/icons";
import type { PostMeta } from "@/lib/blog";

/**
 * Article Card (spec A2) — whole card is a link to /blog/[slug] via the
 * stretched-link pattern: the title anchor's ::after covers the card, so the
 * category chip stays non-interactive text and no interactives are nested.
 * Card lift + gold border glow come from the shared `.card` hover styles;
 * the arrow nudges right on hover (transform only).
 */
export default function ArticleCard({
  post,
  headingLevel = "h2",
}: {
  post: PostMeta;
  /** "h2" on the index grid; "h3" under the article page's "Keep reading" h2 */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    // .spot glow lives on the card; the single inner wrapper is the only
    // .spot>* child (raised above the glow) AND the stretched link's
    // containing block — so the title anchor's ::after still covers the whole
    // face without .spot forcing every child into its own stacking context.
    <article className="card spot group relative flex h-full flex-col">
      <div className="relative flex flex-1 flex-col">
        {/* Cover placeholder — 16:9, explicit w/h (zero CLS); sd-zoom settles
            it 1.06→1 on scroll, clipped by the figure so nothing overflows */}
        <figure className="overflow-hidden rounded-[12px]">
          <PlaceholderImage
            label="BLOG COVER"
            w={post.cover.w}
            h={post.cover.h}
            alt={post.cover.alt}
            variant="cover"
            className="sd-zoom"
            style={{
              aspectRatio: "16 / 9",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </figure>

        {/* Meta row: non-interactive category chip · read time */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CategoryChip label={post.category} />
          <span className="type-caption text-muted">{post.readTime}</span>
        </div>

        {/* Title — the accessible (stretched) anchor */}
        <Heading className="type-h3 mt-3 line-clamp-3 text-primary">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-[16px] after:content-['']"
          >
            {post.title}
          </Link>
        </Heading>

        <p className="type-body mt-3 line-clamp-3 text-secondary">
          {post.excerpt}
        </p>

        {/* Affordance — decorative duplicate of the link, hidden from AT */}
        <span
          aria-hidden="true"
          className="type-small mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-gold-500"
        >
          Read article
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-standard)] group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
