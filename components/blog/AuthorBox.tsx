import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import { blogAuthor } from "@/lib/blog";

/**
 * Author box (spec B1.7) — dark `.card`, round portrait placeholder left,
 * name/role/bio right. Stacks vertically on mobile, row ≥600px.
 */
export default function AuthorBox() {
  return (
    <aside
      aria-label="About the author"
      className="card spot mt-10 flex flex-col items-start gap-6 min-[600px]:flex-row min-[600px]:items-center"
    >
      <div className="float-idle w-[120px] shrink-0 min-[600px]:w-[160px]">
        <PlaceholderImage
          label="AUTHOR"
          w={blogAuthor.portrait.w}
          h={blogAuthor.portrait.h}
          alt={blogAuthor.portrait.alt}
          variant="portrait"
          style={{ borderRadius: "9999px" }}
        />
      </div>
      <div>
        <p className="type-h3 font-display text-primary">{blogAuthor.name}</p>
        <p className="type-small mt-1 text-muted">
          {"Complete Transformation Coach for Men — Kolkata & worldwide online." /* [review] */}
        </p>
        <p className="type-body mt-3 text-secondary">
          {
            "Rebuilt himself from 100kg with zero confidence to coaching some of Kolkata's most successful men. Lifestyle first. Always."
          }{" "}
          {/* [review] */}
        </p>
        <Link
          href={blogAuthor.url}
          className="type-small mt-4 inline-flex items-center gap-1 font-semibold text-gold-500 hover:text-gold-300"
        >
          About Aditya <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
