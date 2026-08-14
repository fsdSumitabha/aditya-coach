import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import TransformationStage from "@/components/results/TransformationStage";
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
    src: "/aditya/before/before_transformation.png",
    w: 800,
    h: 1000,
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
    // NOTE: renders the /client/client-01-* photographs, i.e. the set
    // <TransformationStage> labels CLIENT 01. His story is published.
    linkHref: "/results/client-transformation-entrepreneur-fashion-industry",
    linkLabel: "Read his story",
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
    // NOTE: this entry renders the /client/client-02-* photographs, i.e. the
    // set <TransformationStage> labels CLIENT 02. Its story is published.
    linkHref: "/results/success-had-already-found-him-presence-hadnt",
    linkLabel: "Read his story",
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

      {/* Decorative ticker directly under the hero — verbatim page phrase,
          aria-hidden internally by <Marquee>; stitched down by a gold thread. */}
      <section className="bg-void">
        <Marquee
          items={["Real Men. Real Results."]}
          speedS={38}
          className="py-3 md:py-4"
        />
        <div className="container-site">
          <div className="thread-h sd-draw" aria-hidden="true" />
        </div>
      </section>

      {/* §3.15 THE STAGE — one-viewport set-by-set showcase.
          Placed after the hero + its marquee stitch (which are a designed
          pair) and before the gallery, so it is the page's first content
          section. Carries no heading: the page's single <h1> is the hero
          above, and a heading here would land ahead of the gallery's <h2>.
          The full before/after gallery below is untouched. */}
      <TransformationStage />


      {/* §3.5 FINAL CTA — shared deep-page closing band → /book (+ /tools) */}
      <FinalCta
        sub="Start with a free blueprint. Or book your Transformation Audit today. Either way — start now."
        secondaryHref="/tools"
      />
    </>
  );
}
