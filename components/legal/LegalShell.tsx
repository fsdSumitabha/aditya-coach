import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared frame for /privacy, /terms, /refund (spec §0):
 * dark single column, 720px measure, back-link above H1, updated/effective
 * stamp, optional "On this page" TOC.
 *
 * Elevation (Design Kit 2.0), kept sober: a `thread-h` gold stitch draws in
 * under the stamp on scroll, and the TOC card is a `spot` (cursor-tracked
 * glow) with `link-draw` anchors. Aurora is deliberately skipped here — it is
 * built for section-height bands, not a full-page scroll wrapper, and the kit
 * marks it optional for legal ("otherwise skip"). The H1 (LCP) is
 * intentionally NOT wrapped in Reveal — it paints frame 1.
 */
export default function LegalShell({
  title,
  lastUpdated,
  effectiveDate,
  toc,
  children,
}: {
  title: string;
  lastUpdated: string;
  effectiveDate?: string;
  toc?: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div className="bg-void grain">
      <div
        className="mx-auto"
        style={{ maxWidth: 720, paddingInline: "clamp(20px, 5vw, 32px)" }}
      >
        <div className="pt-10 pb-16 md:pt-14 md:pb-24">
          <Link
            href="/"
            className="type-small text-secondary hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            ← Back to home
          </Link>

          <h1 className="type-h1 text-primary mt-6">{title}</h1>
          <p className="type-caption text-muted mt-3">
            Last updated: {lastUpdated}
            {effectiveDate ? ` · Effective: ${effectiveDate}` : null}
          </p>

          {/* Gold-thread stitch: draws itself in under the stamp on scroll. */}
          <div aria-hidden="true" className="thread-h sd-draw mt-6" />

          {toc && toc.length > 0 && (
            <nav
              aria-label="On this page"
              className="card spot mt-8"
              style={{ padding: 20 }}
            >
              <p className="type-step text-muted mb-3">On this page</p>
              <ol className="flex flex-col gap-2 list-decimal pl-5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="link-draw type-small text-secondary hover:text-primary transition-colors"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* TEMPLATE: review with a lawyer before going live.
              Starter prose in Aditya's voice; not legal advice. Replace LEGAL
              constants (lib/legal.ts) and have a qualified Indian advocate
              review DPDP-2023 / consumer-law specifics. */}
          <article className="article-prose mt-10">{children}</article>
          {/* END TEMPLATE */}
        </div>
      </div>
    </div>
  );
}
