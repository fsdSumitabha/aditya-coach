import Link from "next/link";

/**
 * Mid-article CTA card — identical styling across all three posts.
 * Sits inside .article-prose flow.
 */
export default function MidCta({
  eyebrow = "Free Resource",
  heading,
  body,
  label,
  href,
}: {
  eyebrow?: string;
  heading: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <aside className="card card-featured my-10 not-prose" aria-label={heading}>
      <p className="eyebrow">{eyebrow}</p>
      <p className="type-h3 text-primary mt-2">{heading}</p>
      <p className="type-body text-secondary mt-2">{body}</p>
      <Link href={href} className="btn-gold mt-5">
        {label}
      </Link>
    </aside>
  );
}
