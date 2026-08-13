// THE TRANSFORMATION SETS — one source of truth.
//
// A SET is atomic and never splits: one man's BEFORE and his AFTER move
// together, always. Pairing client A's before with client B's after would be a
// fabricated result, so nothing here exposes an independent before/after index.
//
// Read by BOTH surfaces that show these photographs, so the two can never
// disagree about who is in a frame or where his story lives:
//   · components/results/TransformationStage.tsx — the /results stage (all 5)
//   · components/experience/chapters.tsx        — the 3D proof gallery (clients)
//
// ⚠️  CONSENT  ⚠️
// Aditya's own photographs and client-01 / client-02 are cleared (consent
// confirmed 29 Jul 2026). client-03 / client-04 photographs were supplied by
// the owner 12 Aug 2026 — [review] their WRITTEN consent is not yet recorded,
// and client-03 / client-04 are named in their stories, so confirm before
// launch. No set is ever filled with stock imagery — this is the proof, and
// borrowed proof here is worse than an empty frame.
//
// Headlines are existing VERBATIM lines already published on this site, so no
// new claim is made here. Anything genuinely new is tagged [review].
// Story copy lives in lib/stories.ts, not here.

export type Shot =
  | {
      kind: "photo";
      src: string;
      alt: string;
      /** CSS object-position for the 3:4 well. Omit for the default 50% 22%.
       *  Set it when a photograph is not already 3:4 and its subject would
       *  otherwise crop badly. The WebGL bake reproduces the same framing —
       *  see scripts/build-gl-textures.mjs, which carries a matching table. */
      pos?: string;
    }
  | { kind: "empty"; label: string };

export type TxSet = {
  id: string;
  /** THE COACH / CLIENT 01 … — sits above the headline. */
  eyebrow: string;
  /** The transformation headline. Verbatim site copy wherever one exists. */
  headline: string;
  /** Where the headline points. null → nothing published for this man yet. */
  href: string | null;
  linkLabel: string;
  before: Shot;
  after: Shot;
};

export const TX_SETS: TxSet[] = [
  {
    id: "client-01",
    eyebrow: "CLIENT 01",
    headline: "He did not come to me to lose weight.",
    href: "/results/client-transformation-entrepreneur-fashion-industry",
    linkLabel: "Read his story",
    before: {
      kind: "photo",
      src: "/client/client-01-before.jpg",
      alt: "Client before beginning lifestyle coaching.",
    },
    after: {
      kind: "photo",
      src: "/client/client-01-after.jpg",
      alt: "Same client after a full lifestyle transformation.",
    },
  },
  {
    id: "client-02",
    eyebrow: "CLIENT 02",
    headline: "The weight was never the problem. The lifestyle was.",
    // His story is published — the headline reads through to it rather than to
    // the generic programs page. See lib/stories.ts.
    href: "/results/success-had-already-found-him-presence-hadnt",
    linkLabel: "Read his story",
    before: {
      kind: "photo",
      src: "/client/client-02-before.jpg",
      alt: "Client before fixing his daily lifestyle.",
    },
    after: {
      kind: "photo",
      src: "/client/client-02-after.jpg",
      alt: "Same client after the lifestyle came first.",
    },
  },
  {
    id: "client-03",
    eyebrow: "CLIENT 03",
    headline: "He built companies on discipline. He’d just never turned it on himself.",
    href: "/results/he-built-companies-on-discipline-hed-just-never-turned-it-on-himself",
    linkLabel: "Read his story",
    before: {
      kind: "photo",
      src: "/client/client-03-before.jpg",
      alt: "Client before beginning coaching.",
      // Portrait taller than 3:4 — hold the face inside the well.
      pos: "52% 8%",
    },
    after: {
      kind: "photo",
      src: "/client/client-03-after.jpg",
      alt: "Same client after coaching.",
      // Already 3:4, so the well shows the whole photograph uncropped.
    },
  },
  {
    id: "client-04",
    eyebrow: "CLIENT 04",
    headline: "Most men wait until something forces the change. Jeet didn’t wait.",
    href: "/results/client-transformation-jeet-corporate-professional",
    linkLabel: "Read his story",
    before: {
      kind: "photo",
      src: "/client/client-04-before.png",
      alt: "Client before beginning training and nutrition coaching.",
      pos: "50% 30%",
    },
    after: {
      kind: "photo",
      src: "/client/client-04-after.png",
      alt: "Same client after training and nutrition coaching.",
      // Portrait taller than 3:4 — centre on the back, not the ceiling.
      pos: "50% 55%",
    },
  },
  {
    id: "coach-aditya",
    eyebrow: "THE COACH",
    headline: "This was me. 100kg. Zero confidence.",
    href: "/method",
    linkLabel: "See the exact order of change",
    before: {
      kind: "photo",
      src: "/aditya/before/before_transformation.png",
      alt: "Aditya at 100kg before rebuilding his lifestyle.",
    },
    after: {
      kind: "photo",
      src: "/aditya/after/after_transformation.jpg",
      alt: "Aditya after his own lifestyle transformation.",
    },
  },
];

/**
 * The four clients, in order — what the 3D proof gallery cycles. Aditya's own
 * pair is excluded there on purpose: chapter 1 of the journey already IS his
 * before and after, and showing it twice would read as thin proof.
 */
export const CLIENT_SETS = TX_SETS.filter((s) => s.id.startsWith("client-"));

/**
 * Path to a shot's WebGL-ready bake — pre-cropped to the panel aspect and
 * downscaled, so the canvas uploads a file that is already the exact size the
 * texture needs. Produced by `node scripts/build-gl-textures.mjs`, which must
 * be re-run whenever a source photograph is replaced.
 */
export function glTexture(shot: Shot): string | null {
  if (shot.kind !== "photo") return null;
  return shot.src.replace(/\.(jpe?g|png)$/i, "_gl.jpg");
}
