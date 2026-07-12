import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import { OG_IMAGE } from "@/lib/config";
import { SITE_ORIGIN, pageMetadata } from "@/lib/site";

/* ============================================================
   BUILD SPEC — /results (Transformations)
   Real client transformations + Aditya's own as proof → /book.
   ============================================================ */

// ---- PER-PAGE SEO (§6) ------------------------------------------------------
const base = pageMetadata({
  title: "Transformations | Real Men, Real Results, Kolkata",
  description:
    "No filters. No shortcuts. Real transformations from men who fixed the lifestyle first and let the body follow. See the results.",
  path: "/results",
  ogImage: OG_IMAGE, // TODO: swap to the featured AFTER shot, 1200×630 safe crop
});

export const metadata: Metadata = {
  ...base,
  openGraph: {
    ...(base.openGraph ?? {}),
    title: "Real Men. Real Results. | Aditya Kumar Upadhyay",
    description:
      "Real transformations from men who fixed the lifestyle first and let the body follow.",
  },
};

/* ============================================================
   §1 TOP-LEVEL SWAPPABLE CONSTANTS (single config block)
   Everything the owner will edit lives here. The gallery renders
   by looping TRANSFORMATIONS — adding real entries later = editing
   constants only, no markup changes.
   ============================================================ */

// ---- IMAGE PLACEHOLDERS ---------------------------------------------------
// Every transformation image is an IDENTICAL 4:5 crop. Intrinsic 800 x 1000.
// Phase 1 renders branded <PlaceholderImage> SVGs (zero CLS). To go live:
// replace each PlaceholderImage call with a real <img src={IMG.*.src}
// width={800} height={1000}> of the SAME 4:5 ratio. Featured pair gets
// loading="eager" fetchpriority="high" (likely LCP); all others
// loading="lazy" decoding="async".
type TxImage = {
  src: string; // future real path — swap when photos are ready
  w: number;
  h: number;
  label: string; // PlaceholderImage TODO label shown in Phase 1
};

const IMG = {
  t1_before: {
    src: "/images/transformations/aditya-before.jpg",
    w: 800,
    h: 1000,
    label: "ADITYA BEFORE",
  },
  t1_after: {
    src: "/images/transformations/aditya-after.jpg",
    w: 800,
    h: 1000,
    label: "ADITYA AFTER",
  },
  t2_before: {
    src: "/images/transformations/client-02-before.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 02 BEFORE",
  },
  t2_after: {
    src: "/images/transformations/client-02-after.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 02 AFTER",
  },
  t3_before: {
    src: "/images/transformations/client-03-before.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 03 BEFORE",
  },
  t3_after: {
    src: "/images/transformations/client-03-after.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 03 AFTER",
  },
} satisfies Record<string, TxImage>;

// ---- TRANSFORMATION ENTRIES ----------------------------------------------
// Order = render order. entry[0] is featured (full-width, first).
// To add entries 4–9 later: fill an object below and add its images to IMG.
// Quotes are VERBATIM from the copy bank — do not paraphrase.
type Transformation = {
  id: string;
  featured: boolean;
  eyebrow: string;
  who: string;
  stat: string;
  before: TxImage;
  after: TxImage;
  beforeAlt: string;
  afterAlt: string;
  quote: string;
  attribution: string;
  linkHref: string;
  linkLabel: string;
};

const TRANSFORMATIONS: Transformation[] = [
  {
    id: "coach-aditya",
    featured: true, // full-width, renders first, larger diptych
    eyebrow: "THE COACH",
    who: "Aditya", /* [review] display name */
    stat: "100kg → rebuilt", /* [review] short factual tag, optional */
    before: IMG.t1_before,
    after: IMG.t1_after,
    beforeAlt: "Aditya at 100kg before rebuilding his lifestyle.", /* [review] */
    afterAlt: "Aditya after his own lifestyle transformation.", /* [review] */
    quote:
      "This was me. 100kg. Zero confidence. The decision to change was the hardest part. Everything else followed.",
    attribution: "— Aditya", // his own words about himself
    linkHref: "/method", // featured card points to the method
    linkLabel: "See the exact order of change",
  },
  {
    id: "client-02",
    featured: false,
    eyebrow: "CLIENT",
    who: "Client, 30s", /* [review] anonymized descriptor */
    stat: "", // optional
    before: IMG.t2_before,
    after: IMG.t2_after,
    beforeAlt: "Client before beginning lifestyle coaching.", /* [review] */
    afterAlt: "Same client after a full lifestyle transformation.", /* [review] */
    quote:
      "He did not come to me to lose weight. He came because he did not recognize himself anymore. We did not just change his body. We changed his entire lifestyle.",
    attribution: "— Aditya, on a client", /* [review] coach narration */
    linkHref: "/programs", // client cards → matching program
    linkLabel: "The coaching behind this",
  },
  {
    id: "client-03",
    featured: false,
    eyebrow: "CLIENT",
    who: "Client, 40s", /* [review] */
    stat: "",
    before: IMG.t3_before,
    after: IMG.t3_after,
    beforeAlt: "Client before fixing his daily lifestyle.", /* [review] */
    afterAlt: "Same client after the lifestyle came first.", /* [review] */
    quote:
      "The weight was never the problem. The lifestyle was. Fix that — and the body follows.",
    attribution: "— Aditya, on a client", /* [review] */
    linkHref: "/programs",
    linkLabel: "The coaching behind this",
  },

  // ---- FUTURE SLOTS (scaffolded, currently inactive) ---------------------
  // Uncomment + fill to publish. Grid scales automatically to 6–9 entries.
  // { id:'client-04', featured:false, eyebrow:'CLIENT', who:'', stat:'',
  //   before:IMG.t4_before, after:IMG.t4_after, beforeAlt:'', afterAlt:'',
  //   quote:'', attribution:'— Aditya, on a client', linkHref:'/programs',
  //   linkLabel:'The coaching behind this' },
  // { id:'client-05', ... },
  // { id:'client-06', ... },
];

// ---- GHOST SLOTS ----------------------------------------------------------
// Visible "growing" placeholders shown AFTER real cards so the gallery never
// looks final. Set to 0 to hide. Recommended 1–2 while proof is thin.
const GHOST_SLOTS = 2; // top-level toggle (0–3)
const GHOST_COPY = "More men. More results. Coming soon."; /* [review] */
const GHOST_CTA = { label: "Your transformation could be next", href: "/book" };

/* ============================================================
   Page-level JSON-LD (§6): BreadcrumbList only.
   Global Person + Business schema already emitted in the root
   layout — do NOT redefine here.
   Deliberately NO Review/AggregateRating markup: self-hosted,
   self-serving reviews violate Google's review-snippet
   guidelines and risk a manual action. Testimonials stay
   on-page <blockquote> content only.
   [review — confirm before adding any rating markup]
   ImageObject/ItemList of the transformation photos is optional
   per spec — intentionally omitted while images are placeholders;
   add once real JPGs exist at the IMG.* paths.
   ============================================================ */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Transformations",
      item: `${SITE_ORIGIN}/results`,
    },
  ],
};

/* ============================================================
   §3.2 Card building blocks
   ============================================================ */

/**
 * The before/after pair — two IDENTICAL 4:5 crops split by a 1px gold
 * hairline. Static comparison only: NO slider, no drag, no reveal-on-hover.
 * Stays side-by-side at all breakpoints (preserves the before→after read).
 * [review] optional <340px stacking fallback intentionally NOT implemented —
 * add only if QA shows crowding at 320px (halves are ~140px there, readable).
 *
 * Split + tag micro-motion is pure CSS keyed off the parent Reveal state:
 * `.reveal` (JS-added, motion allowed) primes scaleY(0)/opacity-0; `.is-in`
 * draws the hairline and fades the tags. No JS → base state is fully visible,
 * so reduced-motion / no-IO users see everything instantly.
 */
function TxDiptych({ t }: { t: Transformation }) {
  const tagBase =
    "tx-tag absolute bottom-2 left-2 rounded-[4px] bg-[rgba(8,8,10,0.72)] px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-opacity duration-500 delay-300 ease-[var(--ease-standard)] [.reveal_&]:opacity-0 [.reveal.is-in_&]:opacity-100";
  return (
    <div className="tx-diptych grid grid-cols-[1fr_1px_1fr] overflow-hidden rounded-xl">
      <figure className="tx-half tx-before relative m-0">
        <div className="tx-frame aspect-[4/5] overflow-hidden">
          <PlaceholderImage
            label={t.before.label}
            w={t.before.w}
            h={t.before.h}
            alt={t.beforeAlt}
            variant="portrait"
            style={{ borderRadius: 0, height: "100%" }}
          />
        </div>
        <figcaption className={`${tagBase} text-muted`}>BEFORE</figcaption>
      </figure>
      {/* gold hairline split — draws scaleY(0)→(1) as the card enters view */}
      <span
        className="tx-split w-px origin-center scale-y-100 bg-[var(--gold-500)] transition-transform duration-500 delay-150 ease-[var(--ease-out-expo)] [.reveal_&]:scale-y-0 [.reveal.is-in_&]:scale-y-100"
        aria-hidden="true"
      />
      <figure className="tx-half tx-after relative m-0">
        <div className="tx-frame aspect-[4/5] overflow-hidden">
          <PlaceholderImage
            label={t.after.label}
            w={t.after.w}
            h={t.after.h}
            alt={t.afterAlt}
            variant="portrait"
            style={{ borderRadius: 0, height: "100%" }}
          />
        </div>
        {/* AFTER tinted gold to signal the win */}
        <figcaption className={`${tagBase} text-gold-300`}>AFTER</figcaption>
      </figure>
    </div>
  );
}

function TxCard({ t, delayMs }: { t: Transformation; delayMs: number }) {
  return (
    <Reveal
      as="article"
      id={t.id}
      delayMs={delayMs}
      className="tx-card card"
      // Featured (the coach himself) is visually elevated: warm panel +
      // gold hairline top border. Inline style because .card is unlayered CSS.
      style={
        t.featured
          ? {
              background: "var(--grad-card-warm)",
              borderTopColor: "var(--hairline-gold)",
            }
          : undefined
      }
    >
      <TxDiptych t={t} />
      <div className="tx-body mt-5 md:mt-6">
        <p className="tx-meta flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="tx-eyebrow eyebrow">{t.eyebrow}</span>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <span className="tx-who type-caption text-secondary">{t.who}</span>
          {t.stat ? (
            <>
              <span aria-hidden="true" className="text-muted">
                ·
              </span>
              <span className="tx-stat type-caption text-muted">{t.stat}</span>
            </>
          ) : null}
        </p>
        <blockquote
          className={`tx-quote font-display mt-4 text-primary ${
            t.featured
              ? "max-w-[46ch] text-[1.25rem] leading-[1.55] md:text-[1.5rem]"
              : "text-[1.125rem] leading-[1.6] md:text-[1.25rem]"
          }`}
        >
          {t.quote}
        </blockquote>
        <cite className="tx-attr type-small mt-3 block not-italic text-muted">
          {t.attribution}
        </cite>
        <Link
          href={t.linkHref}
          className="tx-link mt-5 inline-flex min-h-[48px] items-center gap-1.5 text-[0.9375rem] font-medium text-gold-300 underline-offset-4 hover:underline"
        >
          {t.linkLabel}
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </Reveal>
  );
}

/** Ghost slot — dashed, muted, same aspect box so grid height stays stable. */
function GhostCard({ delayMs }: { delayMs: number }) {
  return (
    <Reveal
      as="article"
      delayMs={delayMs}
      className="tx-card tx-ghost card"
      style={{
        borderStyle: "dashed",
        borderColor: "rgba(110, 84, 24, 0.55)", // --gold-900, muted
        boxShadow: "none",
      }}
    >
      {/* Same aspect box as a diptych (8:5) → grid height stays stable */}
      <div className="grid aspect-[8/5] place-items-center rounded-xl bg-surface-1 px-6">
        <div className="text-center">
          <p className="type-small text-muted">{GHOST_COPY}</p>
          <Link href={GHOST_CTA.href} className="btn-outline mt-5">
            {GHOST_CTA.label}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function ResultsPage() {
  const featured = TRANSFORMATIONS.filter((t) => t.featured);
  const standard = TRANSFORMATIONS.filter((t) => !t.featured);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* §3.1 HERO — Real Men. Real Results. */}
      <section className="bg-void glow-top grain border-b border-hairline-soft">
        <div className="container-site section-lg text-center">
          <div className="mx-auto max-w-[760px]">
            <Reveal as="p" delayMs={0} className="eyebrow">
              PROOF{/* [review] optional eyebrow — omit if it competes with the H1 */}
            </Reveal>
            {/* Hero H1 is NEVER animated (LCP rule) — paints at final state frame 1 */}
            <h1 className="type-h1 mt-4 text-primary">Real Men. Real Results.</h1>
            <Reveal
              as="p"
              delayMs={60}
              className="type-lead mx-auto mt-5 max-w-[52ch] text-secondary"
            >
              No filters. No shortcuts. Just discipline and the right guidance.
            </Reveal>
            <Reveal delayMs={120} className="mt-8">
              <hr className="gold-line mx-auto w-16" aria-hidden="true" />
            </Reveal>
          </div>
          {/* No hero CTA — the gallery is the proof; conversion lives at the
              bottom. Persistent header [Book ₹2,000] covers intent. */}
        </div>
      </section>

      {/* §3.2 TRANSFORMATION GALLERY */}
      <section className="bg-base">
        <div className="container-site section">
          {/* [review] sr-only <h2> chosen (spec-preferred) to keep focus on the images */}
          <h2 className="sr-only">Transformations</h2>

          {/* Featured card — full width, always first. Likely LCP: not cv-auto,
              and when real photos land this pair gets loading="eager"
              fetchpriority="high". */}
          {featured.map((t, i) => (
            <TxCard key={t.id} t={t} delayMs={i * 80} />
          ))}

          {/* Standard client cards + ghost slots share one responsive grid.
              [review pick] auto-fit minmax(min(320px,100%),1fr) per spec
              recommendation: 1-col phones, 2-col tablet/desktop, flows to
              2–3 across as entries grow to 6–9. Scales for N = 1…9 with
              zero markup edits. */}
          <div className="cv-auto mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6 md:mt-8 md:gap-8">
            {standard.map((t, i) => (
              <TxCard key={t.id} t={t} delayMs={(featured.length + i) * 80} />
            ))}
            {Array.from({ length: GHOST_SLOTS }).map((_, i) => (
              <GhostCard
                key={`ghost-${i}`}
                delayMs={(featured.length + standard.length + i) * 80}
              />
            ))}
          </div>
        </div>
      </section>

      {/* §3.3 "HOW THESE HAPPENED" — METHOD BRIDGE (+ §3.4 compliance note) */}
      <section className="cv-auto bg-alt border-y border-hairline-soft">
        <div className="container-site section text-center">
          <Reveal as="h2" className="type-h2 text-primary">
            How these happened.{/* [review] */}
          </Reveal>
          <Reveal
            as="p"
            index={1}
            className="type-body mx-auto mt-5 max-w-[60ch] text-secondary"
          >
            {/* [review] method-bridge paragraph, Aditya's voice */}
            None of this was a crash diet. No supplement stack. We fixed the
            lifestyle first — then nutrition, then supplements, medical last.
            The right order of change. That is the only reason it lasted.
          </Reveal>
          <Reveal index={2} className="mt-7">
            <Link
              href="/method"
              className="inline-flex min-h-[48px] items-center gap-2 font-semibold text-gold-300 underline-offset-4 hover:text-gold-200 hover:underline"
            >
              See The Right Order of Change
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* §3.4 COMPLIANCE / RESULTS-VARY NOTE — verbatim, deliberately NOT
              animated. Page-specific results-vary disclaimer only; the broader
              medical disclaimer lives in the global footer (not duplicated). */}
          <p className="disclaimer type-small mx-auto mt-12 max-w-[72ch] rounded-xl border border-hairline-soft px-5 py-4 text-center text-muted md:mt-16 md:px-8 md:py-5">
            Real clients, shared with permission. Individual results depend on
            each person&apos;s starting point, effort, consistency, and health.
            Your results will be your own.
          </p>
        </div>
      </section>

      {/* §3.5 FINAL CTA — shared deep-page closing band → /book (+ /tools) */}
      <FinalCta
        sub="Start with a free blueprint. Or book a consultation today. Either way — start now."
        secondaryHref="/tools"
      />
    </>
  );
}
