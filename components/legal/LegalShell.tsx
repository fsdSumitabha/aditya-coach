import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { ReactNode } from "react";

/**
 * Shared frame for /privacy, /terms, /refund (spec §0):
 * dark single column, 720px measure, back-link above H1, updated/effective
 * stamp, optional "On this page" TOC, quiet single reveal on the intro.
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

          <Reveal>
            <h1 className="type-h1 text-primary mt-6">{title}</h1>
            <p className="type-caption text-muted mt-3">
              Last updated: {lastUpdated}
              {effectiveDate ? ` · Effective: ${effectiveDate}` : null}
            </p>
          </Reveal>

          {toc && toc.length > 0 && (
            <nav
              aria-label="On this page"
              className="card mt-8"
              style={{ padding: 20 }}
            >
              <p className="type-step text-muted mb-3">On this page</p>
              <ol className="flex flex-col gap-2 list-decimal pl-5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="type-small text-secondary hover:text-primary transition-colors"
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
