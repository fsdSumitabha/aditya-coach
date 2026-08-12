// ---- CLIENT STORY SHARED DATA MODEL (single source of truth) ----
//
// One entry per published client story. Adding a story is a new entry here —
// the /results/[slug] route, its metadata, its JSON-LD, the sitemap and the
// "other stories" rail all read from this array. No markup changes required.
//
// Source copy: docs/client_story/client_0N_story.html. The first line of each
// document is the story's title; the remaining lines are its three beats and
// the disclaimer. Copy is VERBATIM — never reworded, reordered or trimmed.
// It lives in this .ts module rather than in JSX so the typographic
// apostrophes and em-dashes survive without HTML entities.
//
// ⚠️  CONSENT — every story here publishes a real man's photographs and, for
// two of them, his first name. client-01 is explicitly anonymous at his own
// request; his photographs are framed below the neck and his disclaimer says
// so. [review] Written consent for client-03 and client-04 is not yet recorded
// — confirm before launch. A story whose consent is withdrawn comes out of
// this array; there is no draft flag, because a draft in the array is a
// published page.

export type StoryImage = {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** object-position in the 3:4 well. Omit for the default. */
  pos?: string;
};

export type StoryBlock = {
  /** Small gold label above the paragraph — the case-study beat it carries. */
  label: string;
  body: string;
};

export type ClientStory = {
  slug: string;
  /** Ties the story back to its set in <TransformationStage>. */
  clientId: string;
  eyebrow: string;
  /** The document's first line. Doubles as the page <h1> and the slug source. */
  head: string;
  /** Who he is, when the head does not already say it. Sits under the h1. */
  descriptor?: string;
  /** A hook line the document carries above the body. Omitted when the head
   *  already does that job — never a repeat of the first paragraph. */
  standfirst?: string;
  seoTitle: string; // ≤60 chars  [review]
  metaDescription: string; // ≤155 chars  [review]
  before: StoryImage;
  after: StoryImage;
  /** problem → what we changed → result, in that order (see CLAUDE.md). */
  blocks: StoryBlock[];
  /** Rendered under the story, verbatim. */
  disclaimer: string;
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** The standard results disclaimer. Verbatim — client-01 carries his own
 *  variant, which adds the privacy line. */
const DISCLAIMER =
  "— Client transformation · Individual results vary. These reflect real clients, not typical or guaranteed outcomes.";

/* The three beat labels. Presentation, not client copy — they impose the
   problem → what we changed → result order CLAUDE.md requires of a case
   study on paragraphs that already follow it. [review] */
const PROBLEM = "THE PROBLEM";
const CHANGED = "WHAT WE CHANGED";
const RESULT = "THE RESULT";

export const stories: ClientStory[] = [
  {
    slug: "client-transformation-entrepreneur-fashion-industry",
    clientId: "client-01",
    eyebrow: "CLIENT 01",
    head: "Client Transformation — Entrepreneur, Fashion Industry",
    seoTitle: "Client Story — Entrepreneur, Fashion Industry",
    metaDescription:
      "He runs one of the biggest names in Indian fashion. Stress had quietly taken over. We rebuilt the habits underneath the weight — and the clarity followed.",
    before: {
      src: `${BASE}/client/client-01-before.jpg`,
      w: 1094,
      h: 1584,
      // Photographed below the neck — his identity is private at his request.
      alt: "The client before coaching, photographed below the neck.",
      pos: "50% 30%",
    },
    after: {
      src: `${BASE}/client/client-01-after.jpg`,
      w: 490,
      h: 594,
      alt: "The same client after coaching, leaner and visibly stronger.",
    },
    blocks: [
      {
        label: PROBLEM,
        body: "He runs one of the biggest names in Indian fashion. Successful by every visible measure. Underneath it, stress had quietly taken over — the kind that shows up as low energy, a body that stopped responding the way it used to, and a mind that never fully switched off.",
      },
      {
        label: CHANGED,
        body: "We didn’t just rebuild his training and nutrition. We rebuilt the habits underneath the weight — sleep, recovery, and the lifestyle factors that support real energy and hormonal health. And we talked. About what was actually driving the stress, and what a straighter path looked like.",
      },
      {
        label: RESULT,
        body: "He’ll tell you the physical change mattered less than the clarity that came with it. Not a client anymore — but someone who still checks in, because what changed for him wasn’t just his body.",
      },
    ],
    disclaimer:
      "— Client transformation · Identity kept private at his request. Individual results vary. These reflect real clients, not typical or guaranteed outcomes.",
  },
  {
    slug: "success-had-already-found-him-presence-hadnt",
    clientId: "client-02",
    eyebrow: "CLIENT 02",
    head: "Success had already found him. Presence hadn’t.",
    seoTitle: "Success Found Him. Presence Didn’t. | Client Story",
    metaDescription:
      "An established man with nothing left to prove on paper — and no presence to match it. Fat loss, posture, grooming and wardrobe, rebuilt in order.",
    before: {
      src: `${BASE}/client/client-02-before.jpg`,
      w: 445,
      h: 791,
      alt: "The client before coaching, seated at a family function.",
      // Taller than 3:4 — hold him in frame rather than cropping to the sofa.
      pos: "50% 18%",
    },
    after: {
      src: `${BASE}/client/client-02-after.jpg`,
      w: 768,
      h: 1024,
      alt: "The same client after coaching, lighter and dressed to fit his frame.",
    },
    blocks: [
      {
        label: PROBLEM,
        body: "He came to me an established, successful man — nothing left to prove on paper. What he didn’t have was a presence that matched it.",
      },
      {
        label: CHANGED,
        body: "We rebuilt it from the ground up. The fat loss, and the posture that comes back once real weight comes off. A grooming routine built for his skin and his hair — not a generic one pulled off the internet. A complete wardrobe direction: what actually fits his frame and suits him, not what’s trending.",
      },
      {
        label: RESULT,
        body: "He didn’t just get lighter. He became a man who walks into a room the way his success already said he should.",
      },
    ],
    disclaimer: DISCLAIMER,
  },
  {
    slug: "he-built-companies-on-discipline-hed-just-never-turned-it-on-himself",
    clientId: "client-03",
    eyebrow: "CLIENT 03",
    head: "He built companies on discipline. He’d just never turned it on himself.",
    descriptor: "Client Transformation — Tushar, Real Estate & Business Owner",
    seoTitle: "Tushar’s Transformation | Real Estate Owner",
    metaDescription:
      "He built companies on discipline and never turned it on himself. How Tushar applied the same standard to his own body — and what people started noticing.",
    before: {
      src: `${BASE}/client/client-03-before.jpg`,
      w: 546,
      h: 959,
      alt: "Tushar before coaching.",
      pos: "52% 8%",
    },
    after: {
      src: `${BASE}/client/client-03-after.jpg`,
      w: 2924,
      h: 3899,
      alt: "Tushar after coaching, out with friends.",
    },
    blocks: [
      {
        label: PROBLEM,
        body: "Tushar built and runs companies most men only dream of owning. Malls. Real estate. Decades of discipline, applied to everything except his own body.",
      },
      {
        label: CHANGED,
        body: "That changed once he decided to apply the same standard to himself that he applies to his business — consistency over intensity, the process over the excuse. The weight came off because the habits held, week after week, not because of one dramatic push.",
      },
      {
        label: RESULT,
        body: "What changed wasn’t just his body. People who’ve known him for years now read him differently — more composed, more deliberate, carrying himself like a man who’s spent years in structure and discipline. That’s not an accident. That’s what happens when the same rigor he runs his companies with finally gets pointed at himself.",
      },
    ],
    // [review] The source document is truncated mid-sentence at "not typic" —
    // completed here to the standard line used by the other three.
    disclaimer: DISCLAIMER,
  },
  {
    slug: "client-transformation-jeet-corporate-professional",
    clientId: "client-04",
    eyebrow: "CLIENT 04",
    head: "Client Transformation — Jeet, Corporate Professional",
    standfirst: "Most men wait until something forces the change. Jeet didn’t wait.",
    seoTitle: "Jeet’s Transformation | Corporate Professional",
    metaDescription:
      "A demanding corporate schedule is most men’s excuse. Jeet didn’t take it. Structured training, nutrition built around his real schedule, and the presence that followed.",
    before: {
      src: `${BASE}/client/client-04-before.png`,
      w: 896,
      h: 1195,
      alt: "Jeet before beginning training and nutrition coaching.",
      pos: "50% 30%",
    },
    after: {
      src: `${BASE}/client/client-04-after.png`,
      w: 768,
      h: 1384,
      alt: "Jeet after a structured muscle-building protocol.",
      // Taller than 3:4 — centre on the back, not the ceiling.
      pos: "50% 55%",
    },
    blocks: [
      {
        label: PROBLEM,
        body: "Jeet came to me already busy — a demanding corporate schedule, the kind of life that gives most men an easy excuse to put this off. He didn’t take it.",
      },
      {
        label: CHANGED,
        body: "We rebuilt his training and nutrition from the ground up. A structured muscle-building protocol. Eating built around his actual schedule, not a generic plan off the internet. Habits that support real hormonal health — sleep, training load, recovery — the lifestyle factors that let a young man’s body do what it’s naturally capable of.",
      },
      {
        label: RESULT,
        body: "The result wasn’t just size. It was a body that finally matched the effort he was putting in everywhere else — and a level of presence most men don’t build until years later, if they ever do.",
      },
    ],
    disclaimer: DISCLAIMER,
  },
];

export function getStory(slug: string): ClientStory | undefined {
  return stories.find((s) => s.slug === slug);
}

/** The story for a <TransformationStage> set, if one is published. */
export function getStoryByClient(clientId: string): ClientStory | undefined {
  return stories.find((s) => s.clientId === clientId);
}

export function otherStories(slug: string): ClientStory[] {
  return stories.filter((s) => s.slug !== slug);
}
