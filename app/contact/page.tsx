import type { Metadata } from "next";
import type { ReactNode, SVGProps } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
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
import {
  ADDRESS,
  ADDRESS_FULL,
  LEGAL,
  MAP_DIRECTIONS_LINK,
  MAP_EMBED_SRC,
} from "@/lib/legal";

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
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline-gold text-secondary transition-[color,border-color,transform] duration-200 ease-out hover:text-primary hover:border-[var(--gold-500)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-500)]";

export const metadata: Metadata = pageMetadata({
  title: "Contact Aditya | Transformation Coach for Men" /* [review] repositioned */,
  description:
    "Talk to Aditya Kumar Upadhyay. Message on WhatsApp, email, or send a quick enquiry. Coaching from Kolkata and worldwide online.",
  path: "/contact",
});

// LocalBusiness JSON-LD — geo Kolkata, areaServed worldwide. Contact-route
// schema only; the sitewide Person/Business schema is emitted in the layout.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Aditya Kumar Upadhyay — Complete Transformation Coach for Men",
  image: `${SITE_ORIGIN}${OG_IMAGE}`,
  url: `${SITE_ORIGIN}/contact`,
  email: EMAIL,
  // [review] — confirm the WhatsApp number is a callable telephone number, and
  // keep openingHours aligned with the HOURS constant.
  telephone: `+${WHATSAPP_NUMBER}`,
  priceRange: "₹₹",
  founder: { "@type": "Person", name: COACH_NAME },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${ADDRESS.STREET}, ${ADDRESS.LOCALITY}`,
    addressLocality: ADDRESS.CITY,
    postalCode: ADDRESS.POSTAL_CODE,
    addressRegion: ADDRESS.REGION,
    addressCountry: ADDRESS.COUNTRY_CODE,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ADDRESS.LAT,
    longitude: ADDRESS.LNG,
  },
  hasMap: MAP_DIRECTIONS_LINK,
  areaServed: [
    { "@type": "City", name: "Kolkata" },
    { "@type": "AdministrativeArea", name: "Worldwide (online coaching)" },
  ],
  openingHours: "Mo-Sa 10:00-19:00",
  sameAs: [SOCIAL.instagram, SOCIAL.youtube, SOCIAL.whatsapp].filter(Boolean),
};

// ---- Small line icons for the Direct Contact rows (decorative, aria-hidden).
// Line style + strokeWidth 1.6 to match the shared PinIcon set. ----
const rowIconProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};
function PersonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    </svg>
  );
}
function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z" />
    </svg>
  );
}
function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}
function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...rowIconProps} {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

/**
 * One contact fact, as a tile in the Direct Contact grid.
 *
 * Alignment is structural, not eyeballed: every tile is this same component
 * with the same three slots — icon+label rule, value, optional caption pinned
 * to the bottom (`mt-auto`). Grid rows stretch, so a two-line address and a
 * one-line phrase still produce a flush row. Nothing here can drift.
 */
function ContactFact({
  label,
  icon,
  index,
  note,
  children,
}: {
  label: string;
  icon: ReactNode;
  /** sibling position — drives the 70ms reveal stagger */
  index: number;
  note?: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="div" delayMs={index * 70} className="card flex h-full flex-col">
      <dt className="eyebrow flex items-center gap-2.5">
        <span aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className="mt-3 flex flex-1 flex-col">
        {children}
        {note ? <p className="type-caption text-muted mt-auto pt-3">{note}</p> : null}
      </dd>
    </Reveal>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />

      {/* 1) HERO — text LCP; H1 paints at final state frame 1 (never animated) */}
      <section className="bg-void aurora grain relative overflow-hidden">
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            <p className="eyebrow">CONTACT{/* [review] */}</p>
            <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
          </div>
          <h1 className="font-display text-[clamp(3rem,7vw,5.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-primary">
            Let&apos;s Talk.
          </h1>
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
              <Link href="/book" className="btn-gold shine-loop">
                Book Your Transformation Audit
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
          <SplitHeading as="h2" text="Reach Me Directly." className="type-h2 text-primary" />
          <Reveal index={1}>
            <p className="type-lead text-secondary mt-4 max-w-2xl">
              {"The fastest way is WhatsApp. Everything below is a real, monitored channel — no bots, no call centre."}
              {/* [review] */}
            </p>
          </Reveal>
          {/* Primary channel gets its own panel so the WhatsApp button is a
              flex sibling of the number, never an inline box inside a text
              row. Gold hairline border reads as the concierge desk. */}
          <Reveal index={2} className="mt-10">
            <div
              className="card spot flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
              style={{ borderColor: "var(--hairline-gold)" }}
            >
              <div className="min-w-0">
                <p className="eyebrow flex items-center gap-2.5">
                  <span aria-hidden="true">
                    <ChatIcon width={15} height={15} />
                  </span>
                  Phone &amp; WhatsApp
                </p>
                {/* Dialable tel: link — Razorpay merchant review wants a
                    working phone number, not only a chat deep-link.
                    [review] confirm the number takes voice calls. */}
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="text-primary hover:text-gold-200 mt-2 inline-flex min-h-12 items-center text-[1.375rem] font-medium tracking-[0.005em] transition-colors sm:text-2xl"
                  aria-label={`Call Aditya on +${WHATSAPP_NUMBER}`}
                >
                  +{WHATSAPP_NUMBER}
                </a>
                <p className="type-caption text-muted mt-1">
                  Same number for calls and WhatsApp. Quickest reply.
                  {/* [review] */}
                </p>
              </div>
              <a
                href={WA_CONTACT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full shrink-0 sm:w-auto"
                aria-label="Message Aditya on WhatsApp"
              >
                <WhatsAppIcon width={18} height={18} />
                Message on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Every remaining fact is one uniform tile — same slots, stretched
              rows. Razorpay-visible details stay real selectable text. */}
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-3">
            <ContactFact
              label="Coach"
              index={0}
              icon={<PersonIcon width={15} height={15} />}
            >
              <p className="type-body text-primary">{COACH_NAME}</p>
            </ContactFact>

            <ContactFact
              label="Email"
              index={1}
              icon={<MailIcon width={15} height={15} />}
              note="For detailed enquiries and documents." /* [review] */
            >
              <a
                href={`mailto:${EMAIL}`}
                className="type-body text-gold-300 hover:text-gold-100 inline-flex min-h-12 items-center break-all underline underline-offset-4"
                aria-label={`Email Aditya at ${EMAIL}`}
              >
                {EMAIL}
              </a>
            </ContactFact>

            <ContactFact
              label="Response time"
              index={2}
              icon={<ClockIcon width={15} height={15} />}
            >
              <p className="type-body text-primary">Typically {RESPONSE_TIME}</p>
            </ContactFact>

            <ContactFact
              label="Location"
              index={3}
              icon={<PinIcon width={15} height={15} />}
            >
              {/* Full operational address as selectable text — Razorpay
                  merchant review asks for exactly this. */}
              <address className="type-body text-primary not-italic">
                {ADDRESS.STREET}, {ADDRESS.LOCALITY}
                <br />
                {ADDRESS.CITY} {ADDRESS.POSTAL_CODE}, {ADDRESS.REGION},{" "}
                {ADDRESS.COUNTRY}
              </address>
            </ContactFact>

            <ContactFact
              label="Availability"
              index={4}
              icon={<GlobeIcon width={15} height={15} />}
            >
              <p className="type-body text-primary">{SERVICE_AREA}</p>
            </ContactFact>

            <ContactFact
              label="Hours"
              index={5}
              icon={<CalendarIcon width={15} height={15} />}
            >
              {/* [review]: confirm actual working hours */}
              <p className="type-body text-primary">{HOURS}</p>
            </ContactFact>
          </dl>
          {/* gold-thread stitch — draws on scroll, leading the eye into the enquiry form */}
          <div className="thread-h sd-draw mt-14 md:mt-16" aria-hidden="true" />
        </div>
      </section>

      {/* 3) CONTACT FORM — client island, Phase-1 stubbed submit */}
      <section className="bg-void cv-auto" id="enquiry">
        <div className="container-site section">
          <SplitHeading as="h2" text="Send a Quick Enquiry." className="type-h2 text-primary" />
          <Reveal index={1}>
            <p className="type-lead text-secondary mt-4 max-w-2xl">
              {`Not ready to message yet? Leave a note and I'll come back to you ${RESPONSE_TIME}.`}
              {/* [review] */}
            </p>
          </Reveal>
          <Reveal index={2} className="mt-10 max-w-2xl">
            <div className="card spot">
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

      {/* 5) MAP — live Google Maps embed pinned to the operational address.
          Keyless (output=embed), lazy-loaded so it costs nothing above the
          fold. Address stays selectable text beneath the frame for Razorpay
          merchant review — never trapped inside the image. */}
      <section className="bg-void cv-auto">
        <div className="container-site section">
          <Reveal as="h3" className="type-h3 text-primary text-center">
            Based in Kolkata. Coaching everywhere.
          </Reveal>
          <Reveal index={1} className="mx-auto mt-8 max-w-4xl">
            <div className="card spot overflow-hidden" style={{ padding: 0 }}>
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[1200/480]">
                <iframe
                  src={MAP_EMBED_SRC}
                  title={`Map showing ${ADDRESS_FULL}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              {/* Address block — selectable, and the tap target that opens Maps. */}
              <div className="border-t border-hairline-soft flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <PinIcon
                    width={20}
                    height={20}
                    className="text-gold-500 mt-0.5 shrink-0"
                  />
                  <address className="type-small text-secondary not-italic">
                    <span className="text-primary block font-semibold">
                      {ADDRESS.STREET}
                    </span>
                    {ADDRESS.LOCALITY}, {ADDRESS.CITY} {ADDRESS.POSTAL_CODE}
                    <br />
                    {ADDRESS.REGION}, {ADDRESS.COUNTRY}
                  </address>
                </div>
                {/* Text link, not a button — the CTA vocabulary is reserved
                    for funnel actions and this is wayfinding. [review] */}
                <a
                  href={MAP_DIRECTIONS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw type-small text-gold-500 hover:text-gold-300 inline-flex shrink-0 items-center gap-1 self-start font-semibold sm:self-auto"
                >
                  Open in Google Maps <span aria-hidden="true">→</span>
                </a>
              </div>
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
      <section className="bg-surface-1 aurora grain relative overflow-hidden border-t border-hairline-soft">
        <div
          className="container-site section flex flex-col items-center text-center"
          style={{ paddingBottom: 112 }}
        >
          {/* [review] — in Aditya's voice; alt: "Ready when you are." */}
          <SplitHeading
            as="h2"
            text="Done talking yourself out of it?"
            className="type-h2 text-primary mx-auto max-w-[18ch]"
          />
          <Reveal index={1}>
            <p className="type-lead text-secondary mx-auto mt-4 max-w-xl">
              {`Book the ${LEGAL.CONSULT_PRICE} consultation. 45 minutes, and you'll leave knowing exactly what to change and in what order.`}
              {/* [review] — echoes /book copy */}
            </p>
          </Reveal>
          <Reveal index={2} className="mt-8 w-full sm:w-auto">
            <div className="cta-stack justify-center">
              <Link href="/book" className="btn-gold">
                Book Your Transformation Audit
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
