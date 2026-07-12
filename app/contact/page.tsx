import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/contact/ContactForm";
import {
  CheckIcon,
  InstagramIcon,
  PinIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import {
  CONTACT_EMAIL,
  IG_URL,
  OG_IMAGE,
  WHATSAPP_NUMBER,
  YOUTUBE_URL,
  waLink,
} from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

// ---- Contact page constants (swap before launch) ----
// Razorpay note [review]: Razorpay's Contact-Us / merchant policy review
// generally wants business name, email, phone, and an operational address as
// selectable text. City-level ("Kolkata, India") is shown for privacy; if the
// gateway requires a full postal address, add an ADDRESS_FULL constant here and
// surface it in the Direct Contact block and the JSON-LD `address`. Flag to owner.
const EMAIL = CONTACT_EMAIL || "TODO@REPLACE.com"; // TODO: real business email (Razorpay-visible)  [review]
const COACH_NAME = "Aditya Kumar Upadhyay";
const CITY = "Kolkata, India";
const SERVICE_AREA = "Coaching worldwide";
const RESPONSE_TIME = "within 24 hours";
const HOURS = "Mon–Sat, 10:00 AM – 7:00 PM IST"; // [review] — confirm actual hours
// Static map image (~1200×480, no live embed). Set to the real asset path
// (e.g. "/img/placeholder/kolkata-map-static.png") once supplied — the styled
// CSS placeholder below renders while this is empty.  [review]
const MAP_IMAGE_SRC: string = "";

// Social (reuses global social constants; platforms without a real URL are
// hidden in Section 4 rather than linked to "#")
const SOCIAL = {
  instagram: IG_URL, // [review] — confirm live before launch
  youtube: YOUTUBE_URL, // [review] — empty in Phase 1 → hidden below
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
};

// Pre-filled WhatsApp deep link (URL-encoded prefill via the shared waLink helper)
const WA_CONTACT_LINK = waLink(
  "Hi Aditya, I found your site and I'd like to know more about your coaching.",
);

const SOCIAL_ICON_CLASS =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline-gold text-secondary transition-colors hover:text-primary hover:border-[var(--gold-500)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-500)]";

export const metadata: Metadata = pageMetadata({
  title: "Contact Aditya | Men's Lifestyle Coach Kolkata",
  description:
    "Talk to Aditya Kumar Upadhyay. Message on WhatsApp, email, or send a quick enquiry. Coaching from Kolkata and worldwide online.",
  path: "/contact",
});

// LocalBusiness JSON-LD — geo Kolkata, areaServed worldwide. Contact-route
// schema only; the sitewide Person/Business schema is emitted in the layout.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Aditya Kumar Upadhyay — Men's Lifestyle Coach",
  image: `${SITE_ORIGIN}${OG_IMAGE}`,
  url: `${SITE_ORIGIN}/contact`,
  email: EMAIL,
  // [review] — confirm the WhatsApp number is a callable telephone number, and
  // keep openingHours aligned with the HOURS constant. If Razorpay requires a
  // full street address, extend `address` with streetAddress + postalCode.
  telephone: `+${WHATSAPP_NUMBER}`,
  priceRange: "₹₹",
  founder: { "@type": "Person", name: COACH_NAME },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Kolkata" },
    { "@type": "AdministrativeArea", name: "Worldwide (online coaching)" },
  ],
  openingHours: "Mo-Sa 10:00-19:00",
  sameAs: [SOCIAL.instagram, SOCIAL.youtube, SOCIAL.whatsapp].filter(Boolean),
};

/** Label/value row inside the Direct Contact card — stacked on mobile, 2-col ≥768px. */
function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-hairline-soft py-5 first:pt-0 last:border-b-0 last:pb-0 md:grid md:grid-cols-[180px_1fr] md:items-start md:gap-x-10">
      <div className="eyebrow md:pt-1">{label}</div>
      <div className="mt-2 md:mt-0">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />

      {/* 1) HERO — text LCP; H1 paints at final state frame 1 (never animated) */}
      <section className="bg-void glow-top grain">
        <div className="container-site section-lg flex flex-col items-center text-center">
          <h1 className="type-h1 text-primary">Let&apos;s Talk.</h1>
          <Reveal delayMs={60}>
            <p className="type-lead text-secondary mx-auto mt-5 max-w-xl">
              {"Whatever's been holding you back — put it in a message. I read every one."}
              {/* [review] — invented supporting line in Aditya's voice */}
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <p className="type-small text-muted mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <CheckIcon width={15} height={15} className="shrink-0 text-gold-500" />
                Replies {RESPONSE_TIME}
              </span>
              <span aria-hidden="true" className="text-gold-700">
                ·
              </span>
              <span className="inline-flex items-center gap-2">
                <PinIcon width={15} height={15} className="shrink-0 text-gold-500" />
                Kolkata + worldwide online
              </span>
            </p>
          </Reveal>
          <Reveal delayMs={180} className="mt-9 w-full sm:w-auto">
            <div className="cta-stack justify-center">
              <Link href="/book" className="btn-gold">
                Book a Consultation
              </Link>
              <a
                href={WA_CONTACT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
                aria-label="Chat with Aditya on WhatsApp"
              >
                <WhatsAppIcon width={18} height={18} />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
        {/* faint gold hairline divider below the hero */}
        <div className="container-site">
          <div className="gold-line" aria-hidden="true" />
        </div>
      </section>

      {/* 2) DIRECT CONTACT — Razorpay-visible details as real selectable text */}
      <section className="bg-base">
        <div className="container-site section">
          <Reveal>
            <h2 className="type-h2 text-primary">Reach Me Directly.</h2>
          </Reveal>
          <Reveal index={1}>
            <p className="type-lead text-secondary mt-4 max-w-2xl">
              {"The fastest way is WhatsApp. Everything below is a real, monitored channel — no bots, no call centre."}
              {/* [review] */}
            </p>
          </Reveal>
          <Reveal index={2} className="mt-10 max-w-3xl">
            <div className="card">
              <ContactRow label="Coach">
                <p className="type-body text-primary">{COACH_NAME}</p>
              </ContactRow>
              <ContactRow label="Email">
                <a
                  href={`mailto:${EMAIL}`}
                  className="type-body inline-flex min-h-12 items-center text-gold-300 underline underline-offset-4 hover:text-gold-100"
                  aria-label={`Email Aditya at ${EMAIL}`}
                >
                  {EMAIL}
                </a>
                <p className="type-caption text-muted">
                  For detailed enquiries and documents.
                  {/* [review] */}
                </p>
              </ContactRow>
              <ContactRow label="WhatsApp">
                <a
                  href={WA_CONTACT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full sm:w-auto"
                  aria-label="Message Aditya on WhatsApp"
                >
                  <WhatsAppIcon width={18} height={18} />
                  Message on WhatsApp
                </a>
                {/* number as plain text for Razorpay review + manual dial */}
                <p className="type-body text-secondary mt-3">+{WHATSAPP_NUMBER}</p>
                <p className="type-caption text-muted mt-1">
                  Quickest reply.
                  {/* [review] */}
                </p>
              </ContactRow>
              <ContactRow label="Location">
                <p className="type-body text-primary">{CITY}</p>
              </ContactRow>
              <ContactRow label="Availability">
                <p className="type-body text-primary">{SERVICE_AREA}</p>
              </ContactRow>
              <ContactRow label="Response time">
                <p className="type-body text-primary">Typically {RESPONSE_TIME}</p>
              </ContactRow>
              <ContactRow label="Hours">
                {/* [review]: confirm actual working hours */}
                <p className="type-body text-primary">{HOURS}</p>
              </ContactRow>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3) CONTACT FORM — client island, Phase-1 stubbed submit */}
      <section className="bg-void cv-auto" id="enquiry">
        <div className="container-site section">
          <Reveal>
            <h2 className="type-h2 text-primary">Send a Quick Enquiry.</h2>
          </Reveal>
          <Reveal index={1}>
            <p className="type-lead text-secondary mt-4 max-w-2xl">
              {`Not ready to message yet? Leave a note and I'll come back to you ${RESPONSE_TIME}.`}
              {/* [review] */}
            </p>
          </Reveal>
          <Reveal index={2} className="mt-10 max-w-2xl">
            <div className="card">
              <ContactForm
                waHref={WA_CONTACT_LINK}
                responseTime={RESPONSE_TIME}
                contactEmail={EMAIL}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4) SOCIAL LINKS — lighter in-body convenience row (secondary) */}
      <section className="bg-base cv-auto">
        <div className="container-site flex flex-col items-center py-14 text-center md:py-20">
          <Reveal as="h3" className="type-h3 text-primary">
            Follow the work.
          </Reveal>
          {/* [review]: confirm which platforms are live before launch; platforms
              without a real URL are hidden here rather than linked to "#". */}
          <Reveal index={1} className="mt-6">
            <ul className="flex items-center justify-center gap-4">
              {SOCIAL.instagram && (
                <li>
                  <a
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Aditya on Instagram"
                    className={SOCIAL_ICON_CLASS}
                  >
                    <InstagramIcon width={22} height={22} />
                  </a>
                </li>
              )}
              {SOCIAL.youtube && (
                <li>
                  <a
                    href={SOCIAL.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch Aditya on YouTube"
                    className={SOCIAL_ICON_CLASS}
                  >
                    <YouTubeIcon width={24} height={24} />
                  </a>
                </li>
              )}
              <li>
                <a
                  href={SOCIAL.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Aditya on WhatsApp"
                  className={SOCIAL_ICON_CLASS}
                >
                  <WhatsAppIcon width={20} height={20} />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 5) MAP — static placeholder, no live embed / third-party requests */}
      <section className="bg-void cv-auto">
        <div className="container-site section">
          <Reveal as="h3" className="type-h3 text-primary text-center">
            Based in Kolkata. Coaching everywhere.
          </Reveal>
          <Reveal index={1} className="mx-auto mt-8 max-w-4xl">
            <div className="card overflow-hidden" style={{ padding: 0 }}>
              {MAP_IMAGE_SRC ? (
                // eslint-disable-next-line @next/next/no-img-element -- static export; plain <img> with explicit dimensions (CLS-safe)
                <img
                  src={MAP_IMAGE_SRC}
                  width={1200}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  alt="Map showing Kolkata, India — Aditya coaches locally and worldwide online"
                  className="block h-auto w-full max-w-full"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Map showing Kolkata, India — Aditya coaches locally and worldwide online"
                  className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center md:aspect-[1200/480] md:min-h-0"
                >
                  <PinIcon width={40} height={40} className="text-gold-500" />
                  <p className="type-h3 text-primary mt-3">Kolkata, India</p>
                  <p className="type-small text-muted mt-1">Coaching worldwide online</p>
                  <p className="eyebrow mt-5">Placeholder — swap via MAP_IMAGE_SRC</p>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal index={2}>
            <p className="type-caption text-muted mx-auto mt-4 max-w-xl text-center">
              In-person consults by arrangement in Kolkata. Everyone else, we work
              over WhatsApp and video.
              {/* [review] */}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6) FINAL CTA BAND — built in-page (WhatsApp secondary differs from shared FinalCta) */}
      <section className="bg-surface-1 glow-top grain border-t border-hairline-soft">
        <div
          className="container-site section flex flex-col items-center text-center"
          style={{ paddingBottom: 112 }}
        >
          <Reveal>
            <h2 className="type-h2 text-primary mx-auto max-w-[18ch]">
              Done talking yourself out of it?
              {/* [review] — in Aditya's voice; alt: "Ready when you are." */}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="type-lead text-secondary mx-auto mt-4 max-w-xl">
              {"Book the ₹2,000 consultation. 45 minutes, and you'll leave knowing exactly what to change and in what order."}
              {/* [review] — echoes /book copy */}
            </p>
          </Reveal>
          <Reveal index={2} className="mt-8 w-full sm:w-auto">
            <div className="cta-stack justify-center">
              <Link href="/book" className="btn-gold">
                Book a Consultation
              </Link>
              <a
                href={WA_CONTACT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
                aria-label="Message Aditya on WhatsApp first"
              >
                <WhatsAppIcon width={18} height={18} />
                Or message me first
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
