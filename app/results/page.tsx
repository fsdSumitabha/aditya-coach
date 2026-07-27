import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import PlaceholderImage from "@/components/PlaceholderImage";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
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
    src: "/aditya/before/before_transformation.jpg",
    w: 800,
    h: 800,
    label: "ADITYA BEFORE",
  },
  t1_after: {
    src: "/aditya/after_transformation_01.jpg",
    w: 800,
    h: 800,
    label: "ADITYA AFTER",
  },
  t2_before: {
    src: "/client/client-01-before.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 02 BEFORE",
  },
  t2_after: {
    src: "/client/client-01-after.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 02 AFTER",
  },
  t3_before: {
    src: "/client/client-02-before.jpg",
    w: 800,
    h: 1000,
    label: "CLIENT 03 BEFORE",
  },
  t3_after: {
    src: "/client/client-02-after.jpg",
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
 * The before/after pair — two IDENTICAL 4:5 crops split by a gold thread.
 * Static comparison only: NO slider, no drag, no reveal-on-hover.
 * Stays side-by-side at all breakpoints (preserves the before→after read).
 * [review] optional <340px stacking fallback intentionally NOT implemented —
 * add only if QA shows crowding at 320px (halves are ~140px there, readable).
 *
 * Motion (all transform/opacity/clip-path, all reduced-motion safe):
 * - each crop gets `sd-wipe` — a scroll-keyed bottom-up clip reveal (view()
 *   timeline; base/final state is the full image, so no-JS / non-supporting
 *   browsers see everything instantly).
 * - the split is a `thread-v sd-draw` gold thread that scale-draws on scroll.
 * - BEFORE / AFTER become gold-hairline chips that fade+rise via <Reveal>,
 *   offset from each other by different reveal indexes for a hand-built feel.
 */
function TxDiptych({ t }: { t: Transformation }) {
  const chipBase =
    "tx-tag absolute bottom-2 left-2 rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.72)] px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]";
  return (
    <div className="tx-diptych grid grid-cols-[1fr_1px_1fr] overflow-hidden rounded-xl">
      <figure className="tx-half tx-before relative m-0">
        {/* square viewport over a 4:5 source — center-crop, never squash */}
        <div className="tx-frame relative aspect-square overflow-hidden">
          <Image
            src={t.before.src}
            width={t.before.w}
            height={t.before.h}
            alt={t.beforeAlt}
            className="sd-wipe absolute inset-0 h-full w-full object-cover object-center"
            style={{ borderRadius: 0 }}
          />
        </div>
        <Reveal as="figcaption" index={0} className={`${chipBase} text-muted`}>
          BEFORE
        </Reveal>
      </figure>
      {/* gold thread split — scale-draws top→bottom as the card enters view */}
      <span className="tx-split thread-v sd-draw" aria-hidden="true" />
      <figure className="tx-half tx-after relative m-0">
        {/* same square center-crop as BEFORE — identical framing both halves */}
        <div className="tx-frame relative aspect-square overflow-hidden">
          <Image
            src={t.after.src}
            width={t.after.w}
            height={t.after.h}
            alt={t.afterAlt}
            className="sd-wipe absolute inset-0 h-full w-full object-cover object-center"
            style={{ borderRadius: 0 }}
          />
        </div>
        {/* AFTER tinted gold to signal the win; offset from BEFORE via index */}
        <Reveal as="figcaption" index={2} className={`${chipBase} text-gold-300`}>
          AFTER
        </Reveal>
      </figure>
    </div>
  );
}

function TxCard({ t }: { t: Transformation }) {
  // The featured card is the coach himself — its one factual number (already
  // in the copy, e.g. "100kg → rebuilt") is elevated with CountUp + metallic
  // gradient. No card is wrapped in <Reveal>: its `sd-wipe` crops must not sit
  // inside a Reveal (kit rule), so each body block reveals on its own instead.
  const statMatch = t.featured ? t.stat.match(/^(\d[\d,]*)(.*)$/) : null;
  return (
    <TiltCard className="tx-tilt">
      <article
        id={t.id}
        className="tx-card card spot"
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
          <Reveal
            as="p"
            index={0}
            className="tx-meta flex flex-wrap items-baseline gap-x-2 gap-y-1"
          >
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
                {statMatch ? (
                  <span className="tx-stat type-caption font-semibold">
                    <CountUp
                      value={Number(statMatch[1].replace(/,/g, ""))}
                      className="text-gold-grad"
                    />
                    <span className="text-gold-grad">{statMatch[2]}</span>
                  </span>
                ) : (
                  <span className="tx-stat type-caption text-muted">
                    {t.stat}
                  </span>
                )}
              </>
            ) : null}
          </Reveal>
          <Reveal
            as="blockquote"
            index={1}
            className={`tx-quote reveal-blur font-display mt-4 text-primary ${
              t.featured
                ? "max-w-[46ch] text-[1.25rem] leading-[1.55] md:text-[1.5rem]"
                : "text-[1.125rem] leading-[1.6] md:text-[1.25rem]"
            }`}
          >
            {t.quote}
          </Reveal>
          <Reveal as="div" index={2}>
            <cite className="tx-attr type-small mt-3 block not-italic text-muted">
              {t.attribution}
            </cite>
            <Link
              href={t.linkHref}
              className="tx-link link-draw mt-5 inline-flex min-h-[48px] items-center gap-1.5 text-[0.9375rem] font-medium text-gold-300"
            >
              {t.linkLabel}
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </article>
    </TiltCard>
  );
}

/** Ghost slot — dashed, muted, same aspect box so grid height stays stable. */
function GhostCard({ delayMs }: { delayMs: number }) {
  return (
    <Reveal
      as="article"
      delayMs={delayMs}
      className="tx-card tx-ghost reveal-scale card"
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
          <Link href={GHOST_CTA.href} className="btn-outline shine-loop mt-5">
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
      <section className="bg-void aurora grain relative overflow-hidden border-b border-hairline-soft">
        {/* Full-viewport gallery entrance — the wall of proof deserves a lobby */}
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16 text-center">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
              <p className="eyebrow">
                PROOF{/* [review] optional eyebrow — omit if it competes with the H1 */}
              </p>
              <span aria-hidden="true" className="thread-h sd-draw h-px w-12" />
            </div>
            {/* Hero H1 is NEVER animated (LCP rule) — paints at final state frame 1 */}
            <h1 className="font-display text-[clamp(2.8rem,6.5vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-primary">
              Real Men. Real Results.
            </h1>
            <Reveal
              as="p"
              delayMs={60}
              className="type-lead mx-auto mt-6 max-w-[52ch] text-secondary"
            >
              No filters. No shortcuts. Just discipline and the right guidance.
            </Reveal>
          </div>

          {/* quiet scroll cue at the lobby's base */}
          <Reveal
            delayMs={500}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 motion-safe:animate-[wa-breathe_2.4s_ease-in-out_infinite]"
            >
              <span className="type-caption tracking-[0.24em] text-muted">
                THE WALL IS BELOW{/* [review] */}
              </span>
              <span className="block h-9 w-px bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
            </div>
          </Reveal>
          {/* No hero CTA — the gallery is the proof; conversion lives at the
              bottom. Persistent header [Book] gold button covers intent. */}
        </div>
      </section>

      {/* Decorative ticker directly under the hero — verbatim page phrase,
          aria-hidden internally by <Marquee>; stitched down by a gold thread. */}
      <section className="bg-void">
        <Marquee
          items={["Real Men. Real Results."]}
          speedS={38}
          className="py-6 md:py-8"
        />
        <div className="container-site">
          <div className="thread-h sd-draw" aria-hidden="true" />
        </div>
      </section>

      {/* §3.2 TRANSFORMATION GALLERY */}
      <section className="bg-base relative overflow-hidden">
        {/* ONE ghost watermark behind the proof wall (aria-hidden, drifts on
            scroll; the overflow-hidden section clips its bleed). */}
        <span
          className="ghost-word filled sd-ghost-drift"
          aria-hidden="true"
          style={{ top: "4%", left: "-3%" }}
        >
          PROOF
        </span>
        <div className="container-site section relative z-10">
          {/* [review] sr-only <h2> chosen (spec-preferred) to keep focus on the images */}
          <h2 className="sr-only">Transformations</h2>

          {/* Featured card — full width, always first. Likely LCP: not cv-auto,
              and when real photos land this pair gets loading="eager"
              fetchpriority="high". */}
          {featured.map((t) => (
            <TxCard key={t.id} t={t} />
          ))}

          {/* Standard client cards + ghost slots share one responsive grid.
              [review pick] auto-fit minmax(min(320px,100%),1fr) per spec
              recommendation: 1-col phones, 2-col tablet/desktop, flows to
              2–3 across as entries grow to 6–9. Scales for N = 1…9 with
              zero markup edits. */}
          <div className="cv-auto mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6 md:mt-8 md:gap-8">
            {standard.map((t) => (
              <TxCard key={t.id} t={t} />
            ))}
            {Array.from({ length: GHOST_SLOTS }).map((_, i) => (
              <GhostCard key={`ghost-${i}`} delayMs={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* §3.3 "HOW THESE HAPPENED" — METHOD BRIDGE (+ §3.4 compliance note) */}
      <section className="cv-auto bg-alt border-b border-hairline-soft">
        <div className="container-site section text-center">
          {/* gold-thread stitch carrying the gallery into the method */}
          <div className="thread-h sd-draw mb-12 md:mb-16" aria-hidden="true" />
          {/* [review] */}
          <SplitHeading
            as="h2"
            text="How these happened."
            className="type-h2 text-primary"
          />
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
              className="link-draw inline-flex min-h-[48px] items-center gap-2 font-semibold text-gold-300 hover:text-gold-200"
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
        sub="Start with a free blueprint. Or book your Transformation Audit today. Either way — start now."
        secondaryHref="/tools"
      />
    </>
  );
}
