// ---- BLOG SHARED DATA MODEL (single source of truth) ----
// Order in the array = canonical blog order (drives prev/next).

export type PostCover = {
  src: string;
  w: number;
  h: number;
  alt: string;
};

export type PostMeta = {
  slug: string;
  category: string;
  title: string; // card + H1 title
  seoTitle: string; // ≤60 chars, A6 canonical
  metaDescription: string; // ≤155 chars
  excerpt: string;
  readTime: string;
  datePublished: string; // [review]
  dateModified: string; // [review — "reviewed" date]
  cover: PostCover;
  primaryCTA: "blueprint" | "calculator" | "book";
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const blogAuthor = {
  name: "Aditya Kumar Upadhyay",
  shortName: "Aditya",
  role: "Complete Transformation Coach for Men" /* [review] */,
  url: "/about",
  portrait: {
    src: `${BASE}/aditya/aditya_portrait.jpg`, /* TODO: replace */
    w: 160,
    h: 160,
    alt: "Aditya Kumar Upadhyay, men's lifestyle coach in Kolkata" /* [review] */,
  },
};

export const posts: PostMeta[] = [
  {
    slug: "lifestyle-first-why-most-diets-fail-men",
    category: "Lifestyle",
    title: "Fix Your Lifestyle First: Why Most Diets Fail Men.",
    seoTitle: "Why Most Diets Fail Men (Fix Lifestyle First)",
    metaDescription:
      "Most men diet before fixing how they live. That's why it never lasts. Here's the right order of change for real transformation.",
    excerpt:
      "Most men diet before fixing how they live. That's why it never lasts. Here's the right order of change.",
    readTime: "6 min read",
    datePublished: "2026-06-10", // [review]
    dateModified: "2026-06-10", // [review — "reviewed" date]
    cover: {
      src: `${BASE}/aditya/aditya_05.jpg`, /* TODO: replace */
      w: 1200,
      h: 675,
      alt: "Sunrise over a made bed and running shoes — a man's morning routine" /* [review] */,
    },
    primaryCTA: "blueprint",
  },
  {
    slug: "how-much-should-a-man-eat-to-lose-fat",
    category: "Nutrition",
    title: "How Much Should a Man Actually Eat to Lose Fat?",
    seoTitle: "How Much Should a Man Eat to Lose Fat?",
    metaDescription:
      "Most men eat for the body they have, not the body they want. Here's a simple starting framework for calories and protein.",
    excerpt:
      "Most men eat for the body they have, not the body they want. Here's a simple starting framework for calories and protein.",
    readTime: "7 min read",
    datePublished: "2026-06-24", // [review]
    dateModified: "2026-06-24", // [review]
    cover: {
      src: `${BASE}/aditya/aditya_02.jpg`, /* TODO: replace */
      w: 1200,
      h: 675,
      alt: "A balanced plate and a set of kitchen scales on a dark counter" /* [review] */,
    },
    primaryCTA: "calculator",
  },
  {
    slug: "sleep-habits-drive-men-30-50",
    category: "Mindset & Drive",
    title: "Sleep, Habits and Drive: Getting It Back at 30-50.",
    seoTitle: "Sleep, Habits & Drive: A Man's Guide (30-50)",
    metaDescription:
      "You built the career but lost the drive. How men aged 30-50 rebuild energy, focus and confidence by fixing sleep and daily habits.",
    excerpt:
      "You built the career but lost the drive. How men aged 30-50 rebuild energy, focus and confidence by fixing sleep and daily habits.",
    readTime: "8 min read",
    datePublished: "2026-07-01", // [review]
    dateModified: "2026-07-01", // [review]
    cover: {
      src: `${BASE}/aditya/aditya_04.jpg`, /* TODO: replace */
      w: 1200,
      h: 675,
      alt: "A composed man in his forties at a window at dusk, city lights behind" /* [review] */,
    },
    primaryCTA: "book",
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string): PostMeta[] {
  return posts.filter((p) => p.slug !== slug);
}

export function prevNext(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  };
}
