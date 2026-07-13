// ---- The museum's fact layer ----
// Every string is verbatim site copy (master spec) — the 3D world is the
// presentation; the words stay exactly as approved.

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
    body: "I am not a celebrity trainer. I am not a gym influencer. I am someone who rebuilt himself completely from the ground up. From 100kg with zero confidence to coaching some of the most successful men in Kolkata.",
    cta: { label: "My story →", href: "/about" },
    cam: [2.7, 1.8, -12.7],
    look: [1.7, 1.3, -16],
  },
  "order-1": {
    id: "order-1",
    eyebrow: "Step 01 · Lifestyle First",
    title: "LIFESTYLE FIRST",
    body: "Fix how you live first — sleep, waking, movement, daily habits. This alone starts changing your body.",
    cta: { label: "Read the full method →", href: "/method" },
    cam: [3.0, 1.1, -31.2],
    look: [0, 0.55, -34],
  },
  "order-2": {
    id: "order-2",
    eyebrow: "Step 02 · Nutrition",
    title: "NUTRITION",
    body: "Only once lifestyle is stable do we touch what you eat. Never before.",
    cta: { label: "Read the full method →", href: "/method" },
    cam: [3.0, 1.6, -31.4],
    look: [0, 1.25, -34],
  },
  "order-3": {
    id: "order-3",
    eyebrow: "Step 03 · Supplements",
    title: "SUPPLEMENTS",
    body: "Once lifestyle and nutrition work, supplements fill the gaps. They support — never replace.",
    cta: { label: "Read the full method →", href: "/method" },
    cam: [3.0, 2.1, -31.6],
    look: [0, 1.85, -34],
  },
  "order-4": {
    id: "order-4",
    eyebrow: "Step 04 · Medical",
    title: "MEDICAL",
    body: "If needed, always last, always under a doctor. Sustainable change, one layer at a time.",
    cta: { label: "Read the full method →", href: "/method" },
    cam: [3.0, 2.6, -31.8],
    look: [0, 2.4, -34],
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
  "offer-discovery": {
    id: "offer-discovery",
    eyebrow: "Discovery Consultation · ₹2,000 · 45 minutes · online via WhatsApp",
    title: "Discovery Consultation",
    body: "We go through your current lifestyle, health, habits and goals. I tell you exactly what needs to change and in what order. You leave with complete clarity.",
    cta: { label: "Book Now", href: "/book" },
    cam: [0, 1.9, -66.4],
    look: [0, 1.5, -70],
  },
  "offer-monthly": {
    id: "offer-monthly",
    eyebrow: "Monthly Coaching · Price disclosed after consultation",
    title: "Monthly Coaching",
    body: "Full lifestyle transformation. Body. Mind. Confidence. Health. Weekly check ins. Full accountability.",
    cta: { label: "See Programs", href: "/programs" },
    cam: [-2.9, 1.8, -66.6],
    look: [-2.3, 1.4, -70],
  },
  "offer-online": {
    id: "offer-online",
    eyebrow: "Online Plan · Price disclosed after consultation",
    title: "Online Plan",
    body: "A complete written lifestyle, nutrition and training plan built specifically for your body, your goals and your life. No guesswork. Just execution.",
    cta: { label: "See Programs", href: "/programs" },
    cam: [2.9, 1.8, -66.6],
    look: [2.3, 1.4, -70],
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

// Chapter overlay copy (verbatim) + progress windows on the journey [0..1]
export const CHAPTERS = [
  {
    id: "arrival",
    range: [0, 0.1] as const,
    eyebrow: "MEN'S LIFESTYLE COACH · COACHING WORLDWIDE",
    title: "Most men are living below their potential. This page changes that.",
    sub: "Men's Lifestyle Coach helping men rebuild their body, mind and confidence. | Coaching worldwide",
  },
  {
    id: "man",
    range: [0.15, 0.29] as const,
    eyebrow: "THE MAN",
    title: "I rebuilt myself from the ground up.",
    sub: "Touch the two figures — the before, and the rebuild.",
  },
  {
    id: "order",
    range: [0.36, 0.53] as const,
    eyebrow: "THE METHOD",
    title: "The Right Order of Change. Most coaches get this wrong.",
    sub: "The foundation builds itself as you move. Touch a layer to read it.",
  },
  {
    id: "proof",
    range: [0.58, 0.72] as const,
    eyebrow: "THE PROOF",
    title: "Real Men. Real Results.",
    sub: "No filters. No shortcuts. Just discipline and the right guidance.",
  },
  {
    id: "decision",
    range: [0.8, 1] as const,
    eyebrow: "ONE DECISION",
    title: "The man you want to become is waiting for one decision.",
    sub: "Start with a free blueprint. Or book a consultation today. Either way — start now.",
  },
];
