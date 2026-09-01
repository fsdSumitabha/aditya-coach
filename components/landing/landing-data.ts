import { LEGAL } from "@/lib/legal";

/**
 * /landing-page — copy constants for the Meta-ads landing page.
 *
 * SOURCE OF TRUTH: "Transformation Audit Landing Page — Conversion & Meta Ads
 * Developer Brief". Everything here marked VERBATIM is the brief's "EXACT
 * COPY" and must not be reworded. Headline CASING is presentation: the brief
 * sets headings in caps, this site sets display headings in sentence case
 * (brief §11 P2 — "keep typography consistent with the main site"), so the
 * words are the brief's and the case is the site's.
 *
 * THREE HARD RULES THIS FILE ENFORCES:
 *   1. NO DURATION. Every public reference to "45 minutes" is gone, and is not
 *      replaced by "60 minutes" or "1 hour". This page sells diagnosis and
 *      direction, never time with Aditya (brief §1). /book still names a
 *      duration — that is the full site, not this page.
 *   2. NO GIFT CARD. Removed from this page entirely (brief §7, §10).
 *   3. NO COMPETING OFFER. No free-resource CTA, no programme comparison, no
 *      second price. One action: pay for the Audit.
 *
 * The price is not a literal here either — it reads from lib/legal.ts, so a
 * price change stays a one-line edit (AGENTS.md).
 */

export const PRICE = LEGAL.CONSULT_PRICE;

/** Every CTA on this page points at the one booking section (brief §1). */
export const BOOKING_ANCHOR = "#book";

/** Analytics + booking-mail tag, so ad bookings are told apart from /book. */
export const LANDING_SOURCE = "transformation-audit-landing";

// ---------------------------------------------------------------------------
// §2 HERO — VERBATIM (brief §3, "EXACT HERO COPY")
// ---------------------------------------------------------------------------
export const HERO = {
  eyebrow: "TRANSFORMATION AUDIT",
  headline: "Find what is actually holding you back.",
  body: "A private 1:1 assessment to understand where you are, what needs to change, and what deserves your attention first",
  meta: `${PRICE} · Online via WhatsApp`,
  cta: "Book Your Transformation Audit",
  microproof: ["Personal assessment", "Clear priorities", "No generic plan"],
} as const;

// ---------------------------------------------------------------------------
// §3 WHAT YOU LEAVE WITH — VERBATIM (brief §4).
// The Blueprint is deliberately LAST and framed as an included post-Audit
// resource: the product is the assessment, not the download.
// ---------------------------------------------------------------------------
export const LEAVE_WITH_HEADING = "You leave with clarity, not more information.";

export const LEAVE_WITH: { title: string; body: string }[] = [
  {
    title: "Your real bottleneck",
    body: "Understand what is actually preventing progress.",
  },
  {
    title: "Your three priorities",
    body: "Know what needs attention first instead of trying to fix everything.",
  },
  {
    title: "The Complete Lifestyle Blueprint",
    body: "My full lifestyle framework, provided after your Audit to help you implement the foundations we discuss.",
  },
];

// ---------------------------------------------------------------------------
// §4 WHO THIS IS FOR — VERBATIM (brief §5A). Five bullets. No age-range cards,
// no demographic segmentation.
// ---------------------------------------------------------------------------
export const WHO_HEADING = "This Audit is for you if…";

export const WHO_FOR = [
  "You know you need to change but do not know what to fix first.",
  "You have tried diets, workouts or routines but struggle to make them last.",
  "Your body, energy, habits or confidence no longer reflect your standards.",
  "You want personalised direction rather than another generic plan.",
] as const;

// ---------------------------------------------------------------------------
// §5 WHAT WE ASSESS — VERBATIM (brief §5B). FIVE categories, hard cap. Do not
// expand this back into a 15–30 item checklist.
// ---------------------------------------------------------------------------
export const ASSESS_HEADING = "We look at the whole picture.";

export const ASSESS: { title: string; body: string }[] = [
  { title: "Lifestyle", body: "Sleep, routine, habits, energy and stress." },
  { title: "Body", body: "Training, movement, fitness and physical goals." },
  { title: "Nutrition", body: "Eating structure, food choices and consistency." },
  {
    title: "Mindset",
    body: "Discipline, behaviour and the patterns that keep you stuck.",
  },
  {
    title: "Presence",
    body: "Confidence, communication, body language and presentation - where relevant.",
  },
];

export const ASSESS_FOOTNOTE =
  "We do not spend equal time on every area. The Audit focuses on what is most relevant to you.";

// ---------------------------------------------------------------------------
// CLIENT PROOF — REMOVED at the owner's instruction (31 Aug 2026).
//
// The brief called for one before/after block before the payment section
// (§6A, and P0 in §11). It is not on this page: no client photograph, no
// client name, no testimonial. Proof lives on /results, which this page does
// not link to. If it is ever restored, it needs a man whose WRITTEN consent
// is on file — client-03's is still not recorded (lib/transformations.ts) —
// and a real quote. Never an invented one (AGENTS.md).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// §7 HOW IT WORKS — VERBATIM (brief §6B). Five steps, payment → deliverable.
// (Section numbers below stay the brief's, so this file still maps to it.)
// ---------------------------------------------------------------------------
export const HOW_HEADING = "How the Audit works";

export const HOW_STEPS: { num: string; title: string; body: string }[] = [
  {
    num: "01",
    title: "Book your Audit",
    body: `Complete the ${PRICE} payment.`,
  },
  {
    num: "02",
    title: "Complete your pre-assessment",
    body: "You will receive a short form so I can understand your goals and situation before we speak.",
  },
  {
    num: "03",
    title: "We conduct your Transformation Audit",
    body: "We identify the real problems, priorities and correct order of change.",
  },
  {
    num: "04",
    title: "Receive your direction",
    body: "You receive your key priorities and Complete Lifestyle Blueprint, along with a clear recommendation for your next step. There is no obligation to continue.",
  },
];

// ---------------------------------------------------------------------------
// §8 BOOKING — three fields before payment, and no more (brief §7). The full
// pre-assessment is a Google Form sent on WhatsApp AFTER payment clears.
// ---------------------------------------------------------------------------
export const GOAL_OPTIONS = [
  "Lifestyle Coaching",
  "Personality & Presence Coaching",
  "Complete Transformation Coaching",
] as const;

/**
 * The second line under each option — three coaching paths, not five symptoms.
 *
 * /book asks this same question from this same list (GOAL_CHOICES below), so
 * both forms feed one inbox with one vocabulary. Add an option above without a
 * hint here and the build fails, which is the point.
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

export const PAY_CTA = `Book My Transformation Audit — ${PRICE}`;

/**
 * The fee credit. Shown because the policy IS confirmed — 6 Aug 2026, "the
 * consultation fee is credited … deducted from the program price" (AGENTS.md).
 * The brief gates this line on exactly that confirmation (§7).
 */
export const CREDIT_LINE = `If you continue into private coaching, your ${PRICE} Audit fee will be adjusted against your coaching fee.`;

// ---------------------------------------------------------------------------
// §9 FAQ — EXACTLY these five, VERBATIM (brief §8). Do not add a sixth: the
// brief forbids questions that raise objections the visitor did not arrive
// with. Also emitted as FAQPage JSON-LD by the page, from this same array.
// ---------------------------------------------------------------------------
export const LANDING_FAQS: { q: string; a: string }[] = [
  {
    q: "Is the Transformation Audit online?",
    a: "Yes. The Audit is conducted privately online via WhatsApp.",
  },
  {
    q: "What happens after I book?",
    a: "You will receive confirmation and a short Pre-Assessment Form. Complete it before your Audit so I can review your situation beforehand.",
  },
  {
    q: "What should I expect from the Audit?",
    a: "We will identify the areas most relevant to your goals, understand what is holding you back, and establish the first priorities you should address.",
  },
  {
    q: "Will I receive a plan?",
    a: "You will receive your key priorities and the Complete Lifestyle Blueprint. The Audit is designed to give you direction; full personalised implementation is part of private coaching.",
  }
];

// ---------------------------------------------------------------------------
// §10 FINAL CTA — VERBATIM (brief §9). No free-resource link anywhere near it:
// the visitor clicked an ad for the Audit, so nothing cheaper is offered
// immediately before the purchase.
// ---------------------------------------------------------------------------
export const FINAL_CTA = {
  headline: "You do not need to fix everything.",
  sub: "You need to know what to fix first.",
  meta: `${PRICE} · Private Transformation Audit`,
  cta: "Book Your Transformation Audit",
} as const;
