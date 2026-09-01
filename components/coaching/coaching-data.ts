import type { OfferGlyphKind } from "@/components/coaching/OfferGlyph";
import { LEGAL } from "@/lib/legal";

/**
 * /coaching — single source of truth for the three coaching paths.
 *
 * One entry here drives ALL of it: the path cards (§2), the "diverging thread"
 * device in the hero, the comparison table columns (§5) and the Service JSON-LD
 * on the page. Adding a fourth path is a new entry in PATHS — not a redesign.
 *
 * Page flow this data serves:
 *   Coaching (choose a path) → /book → Transformation Audit ₹999 → payment.
 * Every path CTA therefore points at /book. The audit fee is credited against
 * the program price — that promise lives in CONSULT_INCLUDES, never inline.
 */

export const BOOK_URL = "/book";
export const BLUEPRINT_URL = "/tools#blueprint";

/** Display price — read from lib/legal.ts, never hardcoded in JSX. */
export const PRICE_CONSULT = LEGAL.CONSULT_PRICE;

export type PathId = "lifestyle" | "presence" | "complete";

export type CoachingPath = {
  id: PathId;
  /** Full name — card heading + comparison-table column header (desktop). */
  name: string;
  /** One word for tight spots: hero thread device, mobile table header. */
  shortName: string;
  glyph: OfferGlyphKind;
  /** The premium tier gets the featured frame + full-width row. */
  flagship?: boolean;
  /** "Who it's for" — the qualifying line. */
  who: string;
  /** "Main outcome" — set in display type, the reason to pick this path. */
  outcome: string;
  /** Pricing indication. Only the audit fee is ever public. */
  pricing: string;
  /**
   * "What's included" — FOUR points, hard cap. At five the path cards ran
   * taller than a phone screen and the CTA fell below the fold. A fifth point
   * gets merged into an existing line, never appended.
   */
  includes: string[];
  /** Service JSON-LD description for this path. */
  schemaDescription: string;
};

export const PATHS: CoachingPath[] = [
  {
    id: "lifestyle",
    name: "Lifestyle Coaching",
    shortName: "Lifestyle",
    glyph: "lifestyle",
    who: "For men who want their body, energy and daily structure working again. Build a stronger body and a lifestyle you can actually sustain." /* [review] */,
    outcome: "A body and a daily life that finally work in your favour." /* [review] */,
    pricing: "Private 1:1 coaching Investment discussed after your Audit",
    includes: [
      "Training & body composition",
      "Nutrition & daily structure",
      "Energy, sleep & recovery",
      "Weekly accountability",
    ] /* [review] — condensed from the lifestyle brief; recovery + weekly
         accountability merged into the fourth line to hold the four-point cap */,
    schemaDescription:
      "Private 1:1 coaching Investment discussed after your Audit",
  },
  {
    id: "presence",
    name: "Personality & Presence Coaching",
    shortName: "Presence",
    glyph: "presence",
    who: "For men who know they are capable but do not yet come across that way. Carry yourself with more confidence, clarity and intention - without forcing it." /* [review] */,
    outcome: "You walk into a room and people notice. Nothing forced." /* [review] */,
    pricing: "Private 1:1 coaching Investment discussed after your Audit",
    includes: [
      "Body language & presence",
      "Communication & social confidence",
      "Grooming & personal style",
      "Mindset & emotional intelligence",
    ] /* [review] — condensed from the personality & presence brief; the skin-tone
         line folded into the style point to hold the four-point cap */,
    schemaDescription:
      "Private 1:1 coaching Investment discussed after your Audit",
  },
  {
    id: "complete",
    name: "Complete Transformation",
    shortName: "Complete",
    glyph: "complete",
    flagship: true,
    who: "For the man who does not want to improve one part of himself while ignoring the rest. Build the body, lifestyle and presence to match your standards." /* [review] */,
    // verbatim from Aditya's brief — do not reword
    outcome: "A strong body should be matched with a strong presence.",
    pricing: "Flagship private coaching Investment discussed after your Audit",
    includes: [
      "Everything in Lifestyle Coaching",
      "Everything in Personality & Presence Coaching",
      "One integrated transformation plan",
      "Weekly review, accountability and adjustment across the whole system",
    ] /* [review] — both pillars, in one list; accountability and the
         one-coach line merged to hold the four-point cap */,
    schemaDescription:
      "The flagship program for men who want a complete transformation — not just a better body or a better wardrobe. It combines both pillars: body, lifestyle, mindset, confidence, personality, presence, style and grooming. Pricing disclosed after a Transformation Audit.",
  },
];

/** §3 — what happens after you choose. Copy per the 2026-08-25 direction. */
export const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Transformation Audit",
    body: "We understand where you are, what you want and what is currently holding you back.",
  },
  {
    num: "02",
    title: "Your Recommendation",
    body: "I identify what needs attention first and which coaching path best fits your priorities.",
  },
  {
    num: "03",
    title: "Your Coaching Begins",
    body: "We build the appropriate plan and start working through your priorities in the right order.",
  },
] as const;

/** §4 — what the Audit is for. Copy per the 2026-08-25 direction. */
export const AUDIT_UNCOVERS = [
  "Your current situation",
  "Your goals",
  "Your gaps",
  "What needs to change",
  "Which coaching path makes sense",
] as const;

/**
 * §5 — comparison matrix. `cells` is keyed by PathId, so a new path in PATHS
 * becomes a new column the moment its key is added here.
 */
export type CompareRow = { label: string; cells: Record<PathId, boolean> };

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Lifestyle", cells: { lifestyle: true, presence: false, complete: true } },
  { label: "Personality", cells: { lifestyle: false, presence: true, complete: true } },
  { label: "Personal guidance", cells: { lifestyle: true, presence: true, complete: true } },
  {
    label: "Complete transformation",
    cells: { lifestyle: false, presence: false, complete: true },
  },
  // NOTE: there is deliberately no "starts with the Audit" row. Every path
  // starts with the Audit, so the row was true in all three columns — it
  // differentiated nothing and read as a feature one path might lack. The
  // shared entry point is stated in JourneySteps and on /book instead.
];

/** §6 — outcomes, not features. Copy per the 2026-08-25 direction. */
export const EXPECTED_OUTCOMES = [
  "Better physical presence",
  "Stronger confidence",
  "Better habits",
  "Improved communication",
  "Better personal style",
  "More control over daily life",
  "Greater self-awareness",
] as const;
