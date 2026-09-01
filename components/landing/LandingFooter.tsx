import Link from "next/link";
import { LEGAL } from "@/lib/legal";

/**
 * §11 — the minimal footer (brief §9, "minimal but complete").
 *
 * Two jobs, and nothing else:
 *   1. The legal layer. Privacy, Terms, Cancellation & Refund, Shipping &
 *      Delivery and Pricing all have to be reachable from any page that takes
 *      money — that is the merchant-review requirement the main footer exists
 *      to satisfy, and this page takes money.
 *   2. The health/coaching disclaimer, carried down here rather than as a
 *      warning block interrupting the sales page (brief §9, MEDICAL/SCOPE).
 *
 * No nav columns, no social icons, no resource links — every one of those is
 * an exit, and paid traffic has one thing to do on this page.
 */
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cancellation & Refund Policy", href: "/refund" },
];

export default function LandingFooter() {
  return (
    <footer className="bg-void border-hairline-soft border-t">
      <div className="container-site py-10">
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="type-small text-secondary hover:text-primary inline-flex min-h-[44px] items-center transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-hairline-soft mt-6 flex flex-col gap-4 border-t pt-6">
          <p className="type-small text-muted">
            © {new Date().getFullYear()} {LEGAL.OWNER_NAME}. Based in{" "}
            {LEGAL.JURISDICTION_CITY}, coaching worldwide online.
          </p>
          {/* Health / coaching disclaimer — same wording as the site footer. */}
          <p className="type-caption text-muted max-w-3xl">
            Aditya is a lifestyle coach, not a doctor or registered dietitian.
            All content, tools and coaching are for general guidance only, are
            not medical advice, and individual results vary. Consult a
            qualified physician before making health, diet or exercise changes.
          </p>
          <p className="type-caption text-muted">
            Questions before you book?{" "}
            <a
              href={`mailto:${LEGAL.CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-secondary"
            >
              {LEGAL.CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
