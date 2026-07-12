"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/config";

/**
 * Tracked CTA link for the /programs page.
 * Fires the no-op `track("cta_click", …)` stub on click (Phase-2 seam).
 * External links (WhatsApp deep links) open in a new tab with rel="noopener";
 * internal links go through next/link.
 */
export default function CtaLink({
  href,
  external = false,
  className,
  data,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  data?: Record<string, unknown>;
  children: ReactNode;
}) {
  const onClick = () => track("cta_click", data);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
