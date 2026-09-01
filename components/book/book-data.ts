import type { AuditGlyphKind } from "@/components/book/AuditGlyph";
import { GOAL_OPTIONS } from "@/components/landing/landing-data";
import { CONSULT_INCLUDES, LEGAL } from "@/lib/legal";

/**
 * /book — copy constants for the persuasion sections (§2–§8).
 *
 * The page is an ad landing page as much as a checkout, so it is built in
 * three bands: the decision at the top for men who already know, the
 * explanation in the middle for men who don't, and objections at the bottom.
 *
 * Everything money-related reads from lib/legal.ts. Never hardcode the price
 * or the fee-credit promise — a price change is a one-line edit there.
 */

export const PRICE = LEGAL.CONSULT_PRICE;
export const CHECKOUT_ANCHOR = "#checkout";

/**
 * §3 — the goal question, as three coaching paths rather than five symptoms.
 *
 * The VALUES are imported, not copied: /landing-page asks the same question
 * (landing-data GOAL_OPTIONS, brief §7), and two forms feeding one inbox with
 * different vocabularies makes the replies unsortable. Change the list there
 * and this follows; add an option there without a hint here and the build
 * fails, which is the point.
 *
 * Each hint is capped at 40 characters so the option reads as one line on a
 * 375px phone. Keep any new one inside that.
 */
const GOAL_HINTS: Record<(typeof GOAL_OPTIONS)[number], string> = {
  "Lifestyle Coaching": "Sleep, energy, habits, food, training." /* [review] */,
  "Personality & Presence Coaching": "Confidence, communication, presence." /* [review] */,
  "Complete Transformation Coaching": "Both, rebuilt in the right order." /* [review] */,
};

export const GOAL_CHOICES = GOAL_OPTIONS.map((value) => ({
  value,
  hint: GOAL_HINTS[value],
}));

/** §2 — what the audit actually is, in four moves. */
export const AUDIT_STAGES: {
  glyph: AuditGlyphKind;
  title: string;
  body: string;
}[] = [
  {
    glyph: "understand",
    title: "Understand you",
    body: "Where you are in life, what your days actually look like, what you have already tried. Context before advice." /* [review] */,
  },
  {
    glyph: "assess",
    title: "Assess your current situation",
    body: "Lifestyle, health, energy, training, food, confidence, presence. All of it, honestly." /* [review] */,
  },
  {
    glyph: "gaps",
    title: "Identify gaps",
    body: "The specific things holding you back — named out loud, not guessed at." /* [review] */,
  },
  {
    glyph: "next",
    title: "Build your next step",
    body: "What to fix first, in what order, and which path you belong on." /* [review] */,
  },
];

/**
 * §3 — the tangible deliverables, so ₹999 reads as a thing you receive
 * rather than a fee you pay.
 *
 * FOUR lines, hard cap. The card had eight stacked items and ran taller than
 * a phone screen, which pushed the total below the fold. The fee-credit
 * promise is now the fourth line rather than a separate rule under the total
 * — same copy, still from lib/legal.ts. The gift card and the Blueprint are
 * CONFIRMED inclusions (6 Aug 2026) and still appear on this page: the §4
 * payment block in BookingFlow states both, next to the credit.
 */
export const WHAT_YOU_GET = [
  "Full analysis of your lifestyle, health and fitness" /* [review] */,
  "What is actually holding you back — named, not guessed at" /* [review] */,
  "The exact order to fix it in" /* [review] */,
  CONSULT_INCLUDES.CREDIT,
] as const;

/** §4 — the audit leads somewhere, and the fork is the visitor's to take. */
export const AFTER_STEPS = [
  { num: "01", label: "Audit" },
  { num: "02", label: "Assessment" },
  { num: "03", label: "Recommendation" },
] as const;

export const AFTER_FORK = [
  { label: "Lifestyle Coaching", href: "/coaching#lifestyle" },
  { label: "Personality & Presence", href: "/coaching#presence" },
  { label: "Complete Transformation", href: "/coaching#complete" },
] as const;

/** §6 — qualification. Second person, one male reader (see AGENTS.md). */
export const AUDIT_IS_FOR = [
  "Feel stuck or inconsistent",
  "Want meaningful personal improvement",
  "Don't know exactly where to start",
  "Want direct guidance rather than generic advice",
] as const;

export const AUDIT_IS_NOT_FOR =
  "Not for you if you are looking for a quick hack or an instant result." /* [review] */;

/**
 * §7 — FAQ. Seven questions per the 2026-08-25 direction, answers in Aditya's
 * voice. Rendered on the page AND emitted as FAQPage JSON-LD from
 * app/book/page.tsx, so this array is the single source for both.
 *
 * Deliberately says NOTHING about refunding the audit fee — refund copy is
 * frozen until the amount and conditions are confirmed in writing (AGENTS.md).
 * The refund policy link lives in the payment block only.
 */
export const BOOK_FAQS: { q: string; a: string }[] = [
  {
    q: `Is ${PRICE} the coaching fee?`,
    a: `No. ${PRICE} is the Transformation Audit — the assessment that comes first. Coaching is priced separately, and I quote it only once I know what you actually need.` /* [review] */,
  },
  {
    q: "What happens after the Audit?",
    a: "I assess what we covered and recommend the path that fits — Lifestyle Coaching, Personality & Presence Coaching, or the Complete Transformation. You decide from there." /* [review] */,
  },
  {
    q: `Is the ${PRICE} adjusted against coaching?`,
    a: `Yes. ${CONSULT_INCLUDES.CREDIT}`,
  },
  {
    q: "Where does the Audit happen?",
    a: "Privately, one to one on WhatsApp. I'm based in Kolkata and coach men worldwide — it makes no difference where you are." /* [review] */,
  },
  {
    q: "What do I receive?",
    a: "The session itself, a personal evaluation, a clear recommendation of your path, the Premium Transformation Blueprint, and the gift card at the end of the call." /* [review] */,
  },
  {
    q: "What if I don't continue with coaching?",
    a: "Then you leave with the assessment, the Blueprint and a clear order of what to fix first — and you run it yourself. No pressure, no chasing." /* [review] */,
  },
  {
    q: "How do I book?",
    a: `Two ways. Message me on WhatsApp and we'll set it up, or pay the ${PRICE} above — I confirm your slot on WhatsApp within 24 hours.` /* [review] */,
  },
];
