import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

/**
 * /tools — the Lifestyle Blueprint's bespoke card.
 *
 * Unlike the other two lead magnets (email-gated PDF downloads via
 * <LeadMagnetCard>), the Blueprint is now a full on-site reading experience.
 * This card is a single <Link> to /tools/the-lifestyle-blueprint and wears
 * `card-featured` (persistent gold border + breathing glow) so it reads as the
 * one premium, unique item on the page. Server Component — the whole surface is
 * one navigation target, no client state.
 */
export default function BlueprintFeatureCard({
  href,
  title,
  description,
  imageAlt,
  source,
  eyebrow,
  ctaLabel,
}: {
  href: string;
  title: string;
  /** verbatim COPY BANK description — do not edit */
  description: string;
  imageAlt: string;
  source: string;
  eyebrow: string;
  ctaLabel: string;
}) {
  return (
    <Link
      href={href}
      className="card card-featured group relative block no-underline transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-500)]"
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:items-center">
        {/* Cover — settle-zooms on scroll, lifts a touch on hover. */}
        <div className="w-full max-w-[280px] mx-auto md:order-2 md:max-w-none overflow-hidden rounded-2xl">
          <Image
            src={source}
            width={480}
            height={600}
            alt={imageAlt}
            className="sd-zoom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="md:order-1">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
          <h2 className="type-h2 text-primary mt-3">{title}</h2>
          <p className="type-lead text-secondary mt-4">{description}</p>

          {/* Not a form — a doorway. The arrow draws its underline on hover. */}
          <span className="link-draw mt-7 inline-flex min-h-[48px] items-center gap-2 font-medium text-gold-300 transition-colors group-hover:text-gold-200">
            {ctaLabel}
            <ArrowRightIcon
              width={18}
              height={18}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
