import Link from "next/link";
import Image from "next/image";
import PlaceholderImage from "@/components/PlaceholderImage";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import TiltCard from "@/components/TiltCard";
import { LEGAL } from "@/lib/legal";

/**
 * /tools lead-magnet card (spec §2 + §3) — one parametrised card rendered
 * three times (Lifestyle Blueprint + Fat Loss Training Split + Personality
 * Audit Blueprint). Server Component;
 * the form/success swap lives in the shared <LeadMagnetForm> client island.
 */
export default function LeadMagnetCard({
  title,
  description,
  imageLabel,
  imageAlt,
  source,
  imageSrc,
  pdfHref,
  pdfLabel,
  buttonLabel,
  successBody,
}: {
  title: string;
  /** verbatim COPY BANK description — do not edit */
  description: string;
  imageLabel: string;
  imageAlt: string;
  /** lead identifier passed to the capture form (analytics/source tag) */
  source: string;
  /** real cover image path (must start with "/" or "http"); falls back to the
   *  branded PlaceholderImage when absent or not yet supplied */
  imageSrc?: string;
  pdfHref: string;
  pdfLabel: string;
  buttonLabel: string;
  successBody: string;
}) {
  const hasImage =
    !!imageSrc && (imageSrc.startsWith("/") || imageSrc.startsWith("http"));
  return (
    <TiltCard>
      <div className="card spot">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:items-center">
          {/* IMG placeholder — swap for a real <img loading="lazy" width={480}
              height={600}> of the PDF cover when the asset exists. Above text on
              mobile (first in DOM), right-aligned on desktop (md:order-2). The
              overflow-hidden frame lets the cover settle-zoom on scroll. */}
          <div className="float-idle w-full max-w-[280px] mx-auto md:order-2 md:max-w-none overflow-hidden rounded-2xl">
            {hasImage ? (
              <Image
                src={imageSrc as string}
                width={480}
                height={600}
                alt={imageAlt}
                className="sd-zoom"
              />
            ) : (
              <PlaceholderImage
                label={imageLabel}
                w={480}
                h={600}
                alt={imageAlt}
                variant="cover"
                className="sd-zoom"
              />
            )}
          </div>

          <div className="md:order-1">
          <p className="eyebrow">FREE DOWNLOAD</p>
          {/* [review] eyebrow label — non-heading so the card title outranks it */}
          <h2 className="type-h2 text-primary mt-3">{title}</h2>
          <p className="type-lead text-secondary mt-4">{description}</p>

          <LeadMagnetForm
            className="mt-7 min-h-[220px]"
            source={source}
            buttonLabel={buttonLabel}
            pdfHref={pdfHref}
            pdfLabel={pdfLabel}
            successTitle={"Check your inbox. It's on the way." /* [review] */}
            successBody={successBody}
            label="Your email"
            consent={
              /* [review] tools-spec DPDP consent — asset-neutral wording */
              <p className="type-caption text-muted mt-3">
                By entering your email you agree to receive this guide and
                occasional emails from Aditya Kumar Upadhyay. Your data is
                handled under India&apos;s{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-secondary"
                >
                  DPDP Act 2023
                </Link>
                . Unsubscribe anytime.
              </p>
            }
          >
            <p className="type-small text-secondary">
              Read it tonight. When you&apos;re ready to build the full system
              around your life —{/* [review] */}
            </p>
            <Link href="/book" className="btn-gold w-full sm:w-auto sm:self-start">
              Book My {LEGAL.CONSULT_PRICE} Transformation Audit
            </Link>
          </LeadMagnetForm>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
