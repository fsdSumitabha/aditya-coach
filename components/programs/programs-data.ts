import type { OfferGlyphKind } from "@/components/programs/OfferGlyph";
import { LEGAL } from "@/lib/legal";

/**
 * /programs — single source of truth for the three coaching paths.
 *
 * One entry here drives ALL of it: the path cards (§2), the "diverging thread"
 * device in the hero, the comparison table columns (§5) and the Service JSON-LD
 * on the page. Adding a fourth path is a new entry in PATHS — not a redesign.
 *
 * Page flow this data serves:
 *   Programs (choose a path) → /book → Transformation Audit ₹999 → payment.
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
    who: "The man whose body, energy and health have slipped — and who wants them back." /* [review] */,
    outcome: "A body and a daily life that finally work in your favour." /* [review] */,
    pricing: "Monthly · price disclosed after your Transformation Audit",
    includes: [
      "Habit building and daily structure that holds",
      "Nutrition guidance built around how you actually eat",
      "Fat loss, muscle gain and the training to get there",
      "Energy, sleep and stress under control — checked every week",
    ] /* [review] — condensed from the lifestyle brief; recovery + weekly
         accountability merged into the fourth line to hold the four-point cap */,
    schemaDescription:
      "Monthly one-to-one lifestyle coaching for men — habit building, nutrition guidance, fat loss and muscle gain, workout and fitness protocols, better energy, sleep and recovery, stress management and overall health optimisation. Pricing disclosed after a Transformation Audit.",
  },
  {
    id: "presence",
    name: "Personality & Presence Coaching",
    shortName: "Presence",
    glyph: "presence",
    who: "The man who is capable, but does not yet come across that way." /* [review] */,
    outcome: "You walk into a room and people notice. Nothing forced." /* [review] */,
    pricing: "Monthly · price disclosed after your Transformation Audit",
    includes: [
      "Body language and presence — how you carry yourself",
      "Social confidence, communication and networking",
      "Style, grooming and dressing for your body type — in colours that work with Indian skin tones",
      "Mindset and emotional intelligence underneath it all",
    ] /* [review] — condensed from the personality & presence brief; the skin-tone
         line folded into the style point to hold the four-point cap */,
    schemaDescription:
      "Monthly one-to-one coaching in personality and presence for men — body language, social confidence, communication and networking, style, grooming, dressing for your body type and colours for Indian skin tones, plus the mindset and emotional intelligence underneath it. Pricing disclosed after a Transformation Audit.",
  },
  {
    id: "complete",
    name: "Complete Transformation",
    shortName: "Complete",
    glyph: "complete",
    flagship: true,
    who: "The man who wants the whole thing rebuilt — not one half of it." /* [review] */,
    // verbatim from Aditya's brief — do not reword
    outcome: "A strong body should be matched with a strong presence.",
    pricing: "Both pillars · price disclosed after your Transformation Audit",
    includes: [
      "Everything in Lifestyle Coaching — body, health, training, nutrition",
      "Everything in Personality & Presence — style, grooming, communication",
      "Mindset and confidence built alongside a stronger body",
      "One coach, one plan, weekly check-ins across both pillars",
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
    body: "Understand where you are now.",
  },
  {
    num: "02",
    title: "Personal Assessment",
    body: "Aditya identifies what actually needs work.",
  },
  {
    num: "03",
    title: "Your Transformation Path",
    body: "You move into the coaching approach that fits you.",
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
