import type { AuditGlyphKind } from "@/components/book/AuditGlyph";
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
 * rather than a fee you pay. The gift card is a CONFIRMED inclusion
 * (6 Aug 2026) and must appear wherever the audit is sold, so it joins the
 * list from lib/legal.ts rather than being written out here.
 */
export const WHAT_YOU_GET = [
  "Transformation Audit session — 45 minutes, one to one",
  "Personal evaluation of where you actually stand",
  "A direction: the path Aditya recommends for you",
  "The Premium Transformation Blueprint",
  "Clear next steps you can start on immediately",
  CONSULT_INCLUDES.GIFT_CARD,
] as const;

/** §4 — the audit leads somewhere, and the fork is the visitor's to take. */
export const AFTER_STEPS = [
  { num: "01", label: "Audit" },
  { num: "02", label: "Assessment" },
  { num: "03", label: "Recommendation" },
] as const;

export const AFTER_FORK = [
  { label: "Lifestyle Coaching", href: "/programs#lifestyle" },
  { label: "Personality & Presence", href: "/programs#presence" },
  { label: "Complete Transformation", href: "/programs#complete" },
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
    a: `No. ${PRICE} is the Transformation Audit — the 45-minute assessment that comes first. Coaching is priced separately, and I quote it only once I know what you actually need.` /* [review] */,
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
    q: "How long is the Audit?",
    a: "45 minutes, on WhatsApp. I'm based in Kolkata and coach men worldwide — it makes no difference where you are." /* [review] */,
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
