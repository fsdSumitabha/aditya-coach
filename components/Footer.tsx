import Image from "next/image";
import Link from "next/link";
import { BRAND_LINE } from "@/lib/site";
import { IG_URL, YOUTUBE_URL, waLink } from "@/lib/config";
import { LEGAL } from "@/lib/legal";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";

const COLUMNS: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "The Method", href: "/method" },
      { label: "Results", href: "/results" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Coaching",
    links: [
      /* [review] lineup per direction doc 2026-07-21 */
      { label: "Lifestyle Coaching", href: "/programs" },
      { label: "Personality & Presence Coaching", href: "/programs" },
      { label: "Complete Transformation", href: "/programs" },
    ],
  },
  { 
    heading: "Resources",
    links: [
      { label: "Free Lifestyle Blueprint", href: "/tools" },
      { label: "Blogs", href: "/blog" },
    ],
  },
  {
    heading: "Legal",
    // Razorpay merchant review requires all six reachable from every page.
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cancellation & Refund Policy", href: "/refund" },
      { label: "Shipping & Delivery Policy", href: "/shipping" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-void grain border-t border-hairline-soft">
      <div className="container-site pt-16 pb-10 md:pt-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="type-step text-muted mb-5">{col.heading}</h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((l, i) => (
                  <li key={`${l.label}-${i}`}>
                    <Link
                      href={l.href}
                      className="type-small text-secondary hover:text-primary transition-colors inline-block py-1"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-hairline-soft pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-md flex-col gap-5">
            <Link
              href="/"
              aria-label="Aditya Kumar Upadhyay — home"
              className="inline-flex w-fit"
            >
              <Image
                src="/logo/aku-wordmark.png"
                alt=""
                width={960}
                height={321}
                sizes="288px"
                className="h-24 w-auto opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="type-body text-primary font-display">{BRAND_LINE}</p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <InstagramIcon width={20} height={20} />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <YouTubeIcon width={22} height={22} />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <WhatsAppIcon width={20} height={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-hairline-soft pt-6">
          <p className="type-small text-muted">
            © {new Date().getFullYear()} Aditya Kumar Upadhyay. Based in
            Kolkata, coaching worldwide online.
          </p>
          <p className="type-caption text-muted max-w-3xl">
            Aditya is a lifestyle coach, not a doctor or registered dietitian.
            All content, tools and coaching are for general guidance only, are
            not medical advice, and individual results vary. Consult a
            qualified physician before making health, diet or exercise changes.
          </p>
        </div>
      </div>
    </footer>
  );
}
