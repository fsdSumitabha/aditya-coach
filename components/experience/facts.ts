// ---- The museum's fact layer ----
// Repositioned per Aditya's direction doc (2026-07-21): Complete
// Transformation Coach for Men — "harder to ignore". His verbatim lines are
// used untouched; copy written in his voice is marked [review].

export type Fact = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  attribution?: string;
  cta?: { label: string; href: string };
  /** camera pose when focused */
  cam: [number, number, number];
  look: [number, number, number];
};

export const FACTS: Record<string, Fact> = {
  "man-before": {
    id: "man-before",
    eyebrow: "The starting point",
    title: "100kg. Zero confidence.",
    body: "This was me. 100kg. Zero confidence. The decision to change was the hardest part. Everything else followed.",
    attribution: "— Aditya, before coaching",
    cam: [-2.6, 1.7, -12.6],
    look: [-1.7, 1.2, -16],
  },
  "man-after": {
    id: "man-after",
    eyebrow: "The rebuild",
    title: "Rebuilt from the ground up.",
    body: "I am not a celebrity trainer. I am not a gym influencer. I am someone who rebuilt himself completely from the ground up. From 100kg with zero confidence to coaching some of the most successful men in Kolkata. I did not just change how I looked — I changed how I show up." /* [review] final line added per direction doc §7 */,
    cta: { label: "My story →", href: "/about" },
    cam: [2.7, 1.8, -12.7],
    look: [1.7, 1.3, -16],
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
    cam: [-3.2, 1.9, -49.4],
    look: [-1.9, 1.8, -52],
  },
  "proof-truth": {
    id: "proof-truth",
    eyebrow: "The truth",
    title: "The weight was never the problem.",
    body: "The weight was never the problem. The lifestyle was. Fix that — and the body follows.",
    attribution: "— Aditya",
    cta: { label: "See all transformations →", href: "/results" },
    cam: [3.2, 1.9, -49.4],
    look: [1.9, 1.8, -52],
  },
  // ---- THE OFFERS (§4 + §9): Transformation Audit gate + three programs ----
  "offer-audit": {
    id: "offer-audit",
    eyebrow: "Transformation Audit · ₹2,000 · 45 minutes · online via WhatsApp",
    title: "Transformation Audit",
    body: "We analyse your lifestyle, health, fitness, nutrition, energy, habits, confidence and presence — and identify what is actually holding you back and what needs to be fixed first." /* [review] built from §9 */,
    cta: { label: "Book Your Transformation Audit", href: "/book" },
    cam: [0, 1.9, -66.4],
    look: [0, 1.5, -70],
  },
  "offer-lifestyle": {
    id: "offer-lifestyle",
    eyebrow: "Lifestyle Coaching · Monthly · Price disclosed after your audit",
    title: "Lifestyle Coaching",
    body: "Habits, nutrition, training, sleep, stress, supplements — full health optimisation. Better energy, fat loss, muscle gain, discipline that holds." /* [review] scope per §4.1 */,
    cta: { label: "See Coaching", href: "/programs" },
    cam: [-3.6, 1.8, -66.5],
    look: [-3.4, 1.4, -70],
  },
  "offer-presence": {
    id: "offer-presence",
    eyebrow: "Personality & Presence Coaching · Monthly · Price disclosed after your audit",
    title: "Personality & Presence Coaching",
    body: "Body language. Social confidence. Communication. Style, grooming, skincare — dressing for your body type and colours that suit Indian skin tones. Mindset and emotional intelligence." /* [review] scope per §4.2 */,
    cta: { label: "See Coaching", href: "/programs" },
    cam: [-1.85, 1.8, -66.3],
    look: [-1.7, 1.4, -70],
  },
  "offer-complete": {
    id: "offer-complete",
    eyebrow: "Complete Transformation · Premium · Price disclosed after your audit",
    title: "Complete Transformation",
    body: "For men who want a complete transformation — not just a better body or a better wardrobe. Both pillars in one system: body, lifestyle, mindset, personality, presence.",
    cta: { label: "See Coaching", href: "/programs" },
    cam: [2.85, 1.85, -66.4],
    look: [2.6, 1.5, -70],
  },
  blueprint: {
    id: "blueprint",
    eyebrow: "Free download · The Lifestyle Blueprint",
    title: "The Lifestyle Blueprint",
    body: "10 lifestyle changes that rebuild a man completely — body, mind and hormones. Start tonight.",
    cta: { label: "Get My Free Blueprint", href: "/tools#blueprint" },
    cam: [-1.2, 1.5, -63.2],
    look: [-1.6, 1.0, -66],
  },
};

// Chapter overlay copy + progress windows on the journey [0..1]
export const CHAPTERS = [
  {
    id: "arrival",
    range: [0, 0.1] as const,
    eyebrow: "COMPLETE TRANSFORMATION COACH FOR MEN" /* [review] §3 */,
    title: "Become harder to ignore." /* his core brand line, §1-2 */,
    sub: "A complete transformation system for men who want to build a stronger body, sharper mind, and undeniable presence." /* his hero direction, verbatim §2 */,
  },
  {
    id: "man",
    range: [0.15, 0.29] as const,
    eyebrow: "THE MAN" /* [review] */,
    title: "I rebuilt myself from the ground up.",
    sub: "Touch the two figures — the before, and the rebuild." /* [review] */,
  },
  {
    id: "order",
    range: [0.36, 0.53] as const,
    eyebrow: "THE COMPLETE REBUILD" /* his framework name, §6 */,
    title: "Body. Lifestyle. Mindset. Personality. Presence." /* his five words, §16 */,
    sub: "The rebuild assembles in the right order. Touch a layer to read it." /* [review] */,
  },
  {
    id: "proof",
    range: [0.58, 0.72] as const,
    eyebrow: "THE PROOF" /* [review] */,
    title: "Real Men. Real Results.",
    sub: "No filters. No shortcuts. Just discipline and the right guidance.",
  },
  {
    id: "decision",
    range: [0.8, 1] as const,
    eyebrow: "ONE DECISION" /* [review] */,
    title: "The man you want to become is waiting for one decision.",
    sub: "There is no point in having a six-pack if you still look at your shoes when you enter a room." /* his line, verbatim §1 */,
  },
];
