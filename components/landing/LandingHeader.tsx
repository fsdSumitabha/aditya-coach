import Image from "next/image";
import Link from "next/link";

/**
 * §1 — the minimal header (brief §2, §10 "Minimise navigation for paid
 * traffic").
 *
 * Logo and one discreet way back to the full site. No nav, no menu, no second
 * CTA: every exit added here is ad spend leaking out of a page that has one
 * job. The logo is deliberately NOT a link to "/" — that would make the
 * largest element on the first screen an exit. The way back is the small text
 * link, where a man has to mean it.
 *
 * Not sticky: a fixed bar costs 68px of the first screen on a phone, and the
 * CTA has to be visible without scrolling (AGENTS.md, mobile first).
 */
export default function LandingHeader() {
  return (
    <header className="border-hairline-soft border-b">
      <div className="container-site flex h-[68px] items-center justify-between gap-4">
        <span className="flex items-center" aria-label="Aditya Kumar Upadhyay">
          <Image
            src="/logo/aku-wordmark.png"
            alt="Aditya Kumar Upadhyay"
            width={960}
            height={321}
            priority
            sizes="168px"
            className="h-[48px] w-auto sm:h-[56px]"
          />
        </span>

        <Link
          href="/"
          className="link-draw type-caption text-muted hover:text-secondary inline-flex min-h-[44px] items-center transition-colors"
        >
          Back to website
        </Link>
      </div>
    </header>
  );
}
