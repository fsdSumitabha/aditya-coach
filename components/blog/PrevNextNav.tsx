import Link from "next/link";
import CategoryChip from "@/components/blog/CategoryChip";
import type { PostMeta } from "@/lib/blog";

/**
 * Prev/Next article nav (spec B1.8) — computed from the canonical `posts`
 * order via lib/blog prevNext(). Clamped at the ends; the missing side is
 * hidden. [review] — clamp-and-hide chosen over wrap-around.
 * Mini-cards: direction label, category chip, post title; whole card is the
 * link (no nested interactives — chip is a span).
 */
export default function PrevNextNav({
  prev,
  next,
}: {
  prev: PostMeta | null;
  next: PostMeta | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Previous and next articles"
      className="mt-12 grid grid-cols-1 gap-6 min-[600px]:grid-cols-2"
    >
      {prev && <MiniCard post={prev} direction="prev" />}
      {next && <MiniCard post={next} direction="next" />}
    </nav>
  );
}

function MiniCard({
  post,
  direction,
}: {
  post: PostMeta;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`card flex h-full flex-col gap-3 ${
        isNext
          ? "items-end text-right min-[600px]:col-start-2"
          : "items-start text-left min-[600px]:col-start-1"
      }`}
    >
      <span className="type-caption text-muted">
        {isNext ? "Next →" : "← Previous"}
      </span>
      <CategoryChip label={post.category} />
      <span className="type-h3 font-display text-primary">{post.title}</span>
    </Link>
  );
}
