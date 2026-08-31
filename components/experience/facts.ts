// ============================================================
// THE 3D JOURNEY — ALL OF ITS COPY, IN ONE FILE.
//
// Every word the homepage canvas shows a visitor is in here. Nothing below
// components/experience/ hardcodes a user-visible string; the .tsx files hold
// geometry, camera and behaviour only. To change a label, change it HERE and
// nothing else.
//
//   CHAPTERS      the four scroll chapters — eyebrow, title, sub, and the
//                 progress window each one owns
//   FACTS         the copy an object reads out when it is pointed at
//   OFFERS        the final scene — the three programmes and their bullets
//   REBUILD_STEPS the five stacking slabs
//   SCENE         one-off labels (BEFORE / AFTER / the loader / the rail)
//   OVERLAY_CTAS  the buttons the scroll overlay puts on screen
//
// The one exception is the price, which is never written out anywhere: it is
// read from LEGAL.CONSULT_PRICE so a change is a single edit in lib/legal.ts.
//
// Repositioned per Aditya's direction doc (2026-07-21): Complete
// Transformation Coach for Men — "harder to ignore". His verbatim lines are
// used untouched; copy written in his voice is marked [review].
// ============================================================

import { LEGAL } from "@/lib/legal";

export type Fact = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  attribution?: string;
  cta?: { label: string; href: string };
  /**
   * Close-up camera pose for this object. Read by CameraRig when a fact is
   * FOCUSED — which nothing in the scene currently does: every object now
   * describes itself on hover instead, and the actions are explicit buttons.
   * Kept so click-to-focus can be switched back on without re-deriving ten
   * camera poses; harmless while unused.
   */
  cam: [number, number, number];
  look: [number, number, number];
};

export const FACTS: Record<string, Fact> = {
  // RETAINED, NOT RENDERED. "The Man" chapter was removed from the journey on
  // 31 Aug 2026 — the homepage now runs seal → proof → rebuild → decision, and
  // Aditya's own before/after lives on /about instead. These two entries stay
  // because they are his own words about his own transformation and /about is
  // sourced from them; nothing on the homepage reads them any more. Delete
  // only with the owner's say-so.
  //
  // Both figures read from docs/aditya_personal_story.md and
  // docs/aditya_journey.md — his own words, kept as close to verbatim as a
  // hover card allows. The joins between his lines are mine. [review]
  //
  // The two titles are a matched pair and should stay one: the before is the
  // back of the room, the after is walking into any room and belonging there.
  // That contrast IS the scene. Do not rewrite one without the other.
  "man-before": {
    id: "man-before",
    eyebrow: "The starting point",
    title: "The kid at the back of every room.",
    body: "I was sixteen when I lost my father. That was the day I made a silent decision — I would figure this out myself. I started with the only thing I could control: my body. At my heaviest, close to 100 kilograms.",
    attribution: "— Aditya, before coaching",
    // Dead poses: the chapter these framed was removed on 31 Aug 2026, and
    // the panel constants they were derived from went with it.
    cam: [-0.37, 1.5, -12.5],
    look: [-1.15, 1.5, -16],
  },
  "man-after": {
    id: "man-after",
    eyebrow: "The rebuild",
    title: "The man who walks in and belongs there.",
    body: "Eight years of testing every method on myself before it ever reached a client. The body transformation was the easy part. The harder work was becoming the man who could walk into any room and belong there — from the kid who could not make eye contact to coaching some of the most successful men in Kolkata. Everything I teach has been tested in real life before it reaches a client." /* [review] — aditya_personal_story.md + aditya_journey.md */,
    cta: { label: "My story →", href: "/about" },
    cam: [1.07, 1.5, -12.5],
    look: [1.85, 1.5, -16],
  },
  // ---- THE COMPLETE REBUILD (his framework, §6 — step lines verbatim) ----
  "order-1": {
    id: "order-1",
    eyebrow: "Step 01 · Lifestyle",
    title: "LIFESTYLE",
    body: "Fix how you live. Sleep, waking, daily habits, stress, recovery — the layer everything else is built on." /* first line verbatim §6; expansion [review] */,
    cta: { label: "See the full method →", href: "/method" },
    cam: [3.0, 0.9, -31.0],
    look: [0, 0.4, -34],
  },
  "order-2": {
    id: "order-2",
    eyebrow: "Step 02 · Body",
    title: "BODY",
    body: "Build strength, fitness, and physical confidence.",
    cta: { label: "See the full method →", href: "/method" },
    cam: [3.0, 1.3, -31.2],
    look: [0, 0.95, -34],
  },
  "order-3": {
    id: "order-3",
    eyebrow: "Step 03 · Nutrition",
    title: "NUTRITION",
    body: "Fuel your body properly.",
    cta: { label: "See the full method →", href: "/method" },
    cam: [3.0, 1.8, -31.4],
    look: [0, 1.5, -34],
  },
  "order-4": {
    id: "order-4",
    eyebrow: "Step 04 · Performance",
    title: "PERFORMANCE",
    body: "Improve training, recovery, energy, and performance.",
    cta: { label: "See the full method →", href: "/method" },
    cam: [3.0, 2.3, -31.6],
    look: [0, 2.05, -34],
  },
  "order-5": {
    id: "order-5",
    eyebrow: "Step 05 · Presence",
    title: "PRESENCE",
    body: "Improve how you communicate, carry yourself, and show up.",
    cta: { label: "See the full method →", href: "/method" },
    cam: [3.0, 2.8, -31.8],
    look: [0, 2.6, -34],
  },
  "proof-client": {
    id: "proof-client",
    eyebrow: "Client transformation",
    title: "He changed his entire lifestyle.",
    body: "He did not come to me to lose weight. He came because he did not recognize himself anymore. We did not just change his body. We changed his entire lifestyle.",
    attribution:
      "— Client transformation · Individual results vary. These reflect real clients, not typical or guaranteed outcomes.",
    cta: { label: "See all transformations →", href: "/results" },
    cam: [-3.2, 1.9, -13.4],
    look: [-1.9, 1.8, -16],
  },
  "proof-truth": {
    id: "proof-truth",
    eyebrow: "The truth",
    title: "The weight was never the problem.",
    body: "The weight was never the problem. The lifestyle was. Fix that — and the body follows.",
    attribution: "— Aditya",
    cta: { label: "See all transformations →", href: "/results" },
    cam: [3.2, 1.9, -13.4],
    look: [1.9, 1.8, -16],
  },
  // ---- THE OFFERS (§4 + §9) ----
  // "offer-audit" no longer has an object in the scene — the gateway card was
  // removed — but the entry stays: it is the copy the /book funnel and the
  // server-rendered fallback read, and the audit is still the primary action.
  "offer-audit": {
    id: "offer-audit",
    eyebrow: `Transformation Audit · ${LEGAL.CONSULT_PRICE} · 45 minutes · online via WhatsApp`,
    title: "Transformation Audit",
    body: "We analyse your lifestyle, health, fitness, nutrition, energy, habits, confidence and presence — and identify what is actually holding you back and what needs to be fixed first." /* [review] built from §9 */,
    cta: { label: "Book Your Transformation Audit", href: "/book" },
    cam: [0, 1.9, -48.4],
    look: [0, 1.5, -52],
  },
  "offer-lifestyle": {
    id: "offer-lifestyle",
    eyebrow: "Lifestyle Coaching · Your Body",
    title: "Lifestyle Coaching",
    body: "Habits, nutrition, training, sleep, stress, supplements — full health optimisation. Better energy, fat loss, muscle gain, discipline that holds." /* [review] scope per §4.1 */,
    cta: { label: "See Coaching", href: "/programs" },
    cam: [-3.6, 1.8, -48.5],
    look: [-3.4, 1.4, -52],
  },
  "offer-presence": {
    id: "offer-presence",
    eyebrow: "Personality & Presence Coaching · Monthly · Price disclosed after your audit",
    title: "Personality & Presence Coaching",
    body: "Body language. Social confidence. Communication. Style, grooming, skincare — dressing for your body type and colours that suit Indian skin tones. Mindset and emotional intelligence." /* [review] scope per §4.2 */,
    cta: { label: "See Coaching", href: "/programs" },
    cam: [-1.85, 1.8, -48.3],
    look: [-1.7, 1.4, -52],
  },
  "offer-complete": {
    id: "offer-complete",
    eyebrow: "Complete Transformation · Premium · Price disclosed after your audit",
    title: "Complete Transformation",
    body: "For men who want a complete transformation — not just a better body or a better wardrobe. Both pillars in one system: body, lifestyle, mindset, personality, presence.",
    cta: { label: "See Coaching", href: "/programs" },
    cam: [2.85, 1.85, -48.4],
    look: [2.6, 1.5, -52],
  },
  blueprint: {
    id: "blueprint",
    eyebrow: "Free download · The Lifestyle Blueprint",
    title: "The Lifestyle Blueprint",
    body: "10 lifestyle changes that rebuild a man completely — body, mind and hormones. Start tonight.",
    cta: { label: "Get My Free Blueprint", href: "/tools#blueprint" },
    cam: [-1.2, 1.5, -45.2],
    look: [-1.6, 1.0, -48],
  },
};

// ============================================================
// THE FINAL SCENE — three programmes, side by side.
//
// The Transformation Audit used to stand in front of these as a gateway card,
// which is why the three were pushed back down a long hall and only the
// flagship's head cleared the gate. It has been taken out of the scene: the
// three are what the visitor came to see, and the audit is still the primary
// action on the way out — the gold button on the overlay books it.
//
// Depth, height and width are in chapters.tsx — THIS FILE IS THE WORDING.
// Every line the cards show is below; change it here and nowhere else.
// ============================================================

export type Offer = {
  /** matches a FACTS key — that entry is what it says on hover */
  id: string;
  label: string;
  /** the line under the name */
  sub: string;
  /**
   * What the programme actually gets him, on the face of the card. Four lines
   * each, kept short enough to survive a phone: each one wraps to at most two
   * lines at the largest type size, and a fifth entry would push the block off
   * the bottom of the shorter cards. Add one and check the card at 375px.
   */
  points: string[];
};

export const OFFERS: { pillars: Offer[] } = {
  // Order is left → centre → right on the floor. Changing the order here
  // changes where a programme stands.
  pillars: [
    {
      id: "offer-lifestyle",
      label: "Lifestyle Coaching",
      sub: "YOUR BODY",
      points: [
        "Fat loss that actually holds",
        "Training built around your real schedule",
        "Energy that doesn't crash by 4pm",
        "Sleep and recovery, fixed for good",
      ],
    },
    {
      id: "offer-complete",
      label: "Complete Transformation",
      sub: "PREMIUM · THE FULL SYSTEM",
      points: [
        "Everything in Lifestyle and Presence, combined",
        "Body, energy, and presence — rebuilt together",
        "One coach. One system. No gaps.",
        "The full transformation, start to finish",
      ],
    },
    {
      id: "offer-presence",
      label: "Personality & Presence",
      sub: "YOUR CONFIDENCE",
      points: [
        "Grooming and style built for your face and frame",
        "The way you carry yourself, corrected",
        "Wardrobe direction, sorted for good",
        "Presence that doesn't need to perform",
      ],
    },
  ],
};


// ---- THE COMPLETE REBUILD — the five slabs that stack (his framework, §6) --
// `w` and `d` are the slab's width and depth in world units, not copy: they
// taper so the stack reads as a pyramid with lifestyle carrying everything.
//
// The taper is 0.45 per layer, not the 0.6 it used to be. PERFORMANCE is the
// longest word in the set and it sits on the second-narrowest slab, so a
// steeper taper ran it off the front of its own face. The base stays 4.0 —
// the stack's footprint and its framing are unchanged — and only the upper
// layers widen, which is enough for every label to set at the same size.
// If a longer word than PERFORMANCE (11 characters) is ever added here,
// widen from the top down rather than letting faceLayout shrink it.
export const REBUILD_STEPS = [
  { id: "order-1", num: "01", label: "LIFESTYLE", w: 4.0, d: 2.6 },
  { id: "order-2", num: "02", label: "BODY", w: 3.55, d: 2.35 },
  { id: "order-3", num: "03", label: "NUTRITION", w: 3.1, d: 2.1 },
  { id: "order-4", num: "04", label: "PERFORMANCE", w: 2.65, d: 1.85 },
  { id: "order-5", num: "05", label: "PRESENCE", w: 2.2, d: 1.6 },
];

// ---- One-off labels rendered inside the canvas or over it ----
export const SCENE = {
  /** plates under the two photographs of the proof gallery */
  before: "BEFORE",
  after: "AFTER",
  /** over the flipping client gallery */
  proof: "Client Transformations",
  /** engraved in front of the stack */
  foundation: "EVERYTHING SITS ON THIS",
  /** while the three.js chunk downloads */
  loading: "ENTERING THE ATELIER",
  /** the first-screen scroll hint */
  scrollHint: "SCROLL TO EXPLORE",
  /** aria-label on the close control of a focused fact card */
  close: "Close",
};

// ---- Buttons the scroll overlay puts on screen, per chapter ----
// Labels come from the CTA vocabulary in AGENTS.md; invent nothing new here.
export const OVERLAY_CTAS = {
  book: { label: "Book Your Transformation Audit", href: "/book" },
  blueprint: {
    label: "Get My Free Blueprint",
    href: "/tools#blueprint",
    // Rendered under the button on the closing chapter, where the free
    // resource is now the second action. [review]
    note: "The long-form Lifestyle Blueprint. Sent to your inbox, free.",
  },
  // The label stays inside the CTA vocabulary in AGENTS.md; the note under it
  // is what tells a visitor the page goes into detail, rather than inventing a
  // longer button string.
  programs: {
    label: "See the Programs",
    href: "/programs",
    note: "What each programme covers, how it runs, and who it is for.",
  },
};

// Chapter overlay copy + progress windows on the journey [0..1]
export type Chapter = {
  id: string;
  /** the stretch of the journey this chapter owns — drives the side rail too */
  range: readonly [number, number];
  eyebrow: string;
  title: string;
  sub: string;
  /**
   * Hold the eyebrow/title/sub back until this point, while the chapter's
   * BUTTONS stay up for its whole range. Only the decision chapter uses it:
   * its copy used to appear the moment the chapter opened, which laid a
   * two-line headline straight across the gateway card — the one object the
   * visitor is there to read. Now the card gets the screen to itself and the
   * headline arrives once the camera has risen and the three programmes are
   * in frame, where there is empty floor beneath them to sit on.
   */
  copyFrom?: number;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "arrival",
    range: [0, 0.1] as const,
    eyebrow: "COMPLETE TRANSFORMATION COACH FOR MEN" /* [review] §3 */,
    title: "Become harder to ignore." /* his core brand line, §1-2 */,
    sub: "A complete transformation system for men who want to build a stronger body, sharper mind, and undeniable presence." /* his hero direction, verbatim §2 */,
  },
  {
    id: "proof",
    // MOVED UP from the fourth slot (31 Aug 2026). The gallery now stands at
    // z -16, immediately after the seal, so the first thing a visitor meets is
    // other men's results rather than the coach's own story. Closes as the
    // dolly reaches the frames at ≈0.256 and flies through them.
    range: [0.15, 0.27] as const,
    eyebrow: "THE PROOF" /* [review] */,
    title: "Real Men. Real Results.",
    sub: "No filters. No shortcuts. Just discipline and the right guidance.",
  },
  {
    id: "order",
    range: [0.36, 0.53] as const,
    eyebrow: "THE COMPLETE REBUILD" /* his framework name, §6 */,
    title: "Body. Lifestyle. Mindset. Personality. Presence." /* his five words, §16 */,
    sub: "The rebuild assembles in the right order. Touch a layer to read it." /* [review] */,
  },
  {
    id: "decision",
    // Opens just before the three arrive at 0.80 — see the stops in CameraRig.
    range: [0.77, 1] as const,
    // Held later than it used to be. The cards now carry four bullets each,
    // and that is the thing worth reading in this chapter — the headline can
    // wait until the reader has had the row to himself.
    copyFrom: 0.93,
    eyebrow: "ONE DECISION" /* [review] */,
    title: "The man you want to become is waiting for one decision.",
    sub: "There is no point in having a six-pack if you still look at your shoes when you enter a room." /* his line, verbatim §1 */,
  },
];
