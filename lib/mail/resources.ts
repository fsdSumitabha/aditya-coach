import "server-only";

import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * The free lead-magnet resources, and how to resolve one from a form's
 * `source` tag and attach its PDF. Adding a new resource = one entry here
 * (no route changes): point `file` at a path under /public.
 */

export type ResourceId =
  | "lifestyle-blueprint"
  | "fat-loss-training-split"
  | "personality-audit";

export type Resource = {
  id: ResourceId;
  /** human title used in the email subject/body */
  title: string;
  /** short line describing what they just got */
  summary: string;
  /** path under /public (the file actually shipped to the inbox) */
  file: string;
  /** filename the recipient sees on the attachment */
  downloadName: string;
};

export const RESOURCES: Record<ResourceId, Resource> = {
  "lifestyle-blueprint": {
    id: "lifestyle-blueprint",
    title: "The Lifestyle Blueprint",
    summary:
      "10 lifestyle changes that rebuild a man completely — body, mind and hormones.",
    file: "resources/docs/the-lifestyle-blueprint-aditya-kumar-upadhyay.pdf",
    downloadName: "The Lifestyle Blueprint — Aditya Kumar Upadhyay.pdf",
  },
  "fat-loss-training-split": {
    id: "fat-loss-training-split",
    title: "The Fat Loss Training Split",
    summary:
      "The exact 3-day training plan for fat loss and muscle building together.",
    file: "downloads/fat-loss-training-split.pdf",
    downloadName: "The Fat Loss Training Split — Aditya Kumar Upadhyay.pdf",
  },
  "personality-audit": {
    id: "personality-audit",
    title: "The Personality Audit Blueprint",
    summary:
      "Body language, grooming and style — where you stand today, and the first fixes.",
    file: "downloads/personality-audit-blueprint.pdf",
    downloadName: "The Personality Audit Blueprint — Aditya Kumar Upadhyay.pdf",
  },
};

// Explicit map for the source tags used across the site's forms.
const SOURCE_MAP: Record<string, ResourceId> = {
  "home-blueprint": "lifestyle-blueprint",
  "tools-blueprint": "lifestyle-blueprint",
  "blog-index": "lifestyle-blueprint",
  "tools-training-split": "fat-loss-training-split",
  "home-split": "fat-loss-training-split",
  "tools-personality-audit": "personality-audit",
  "home-personality-audit": "personality-audit",
};

/**
 * Resolve which resource to deliver. Prefers an explicit id, then the known
 * source map, then a keyword heuristic; defaults to the flagship Blueprint so
 * a lead always receives *something* sensible (the choice is logged upstream).
 */
export function resolveResource(opts: {
  resource?: string;
  source?: string;
}): Resource {
  const explicit = opts.resource as ResourceId | undefined;
  if (explicit && RESOURCES[explicit]) return RESOURCES[explicit];

  const src = (opts.source ?? "").toLowerCase();
  if (SOURCE_MAP[src]) return RESOURCES[SOURCE_MAP[src]];
  if (src.includes("split") || src.includes("fat-loss"))
    return RESOURCES["fat-loss-training-split"];
  if (src.includes("personality")) return RESOURCES["personality-audit"];

  return RESOURCES["lifestyle-blueprint"];
}

/**
 * Absolute path + attachability of a resource's PDF. A placeholder stub (a
 * few dozen bytes) is treated as "not ready" so we never mail a broken file;
 * the delivery email still sends, just without the attachment.
 */
export function resolveAttachment(resource: Resource): {
  absPath: string;
  ready: boolean;
} {
  const absPath = join(process.cwd(), "public", resource.file);
  try {
    const stat = statSync(absPath);
    // Real guides are tens of KB+; the seeded placeholders are < 1 KB.
    return { absPath, ready: stat.isFile() && stat.size > 1024 };
  } catch {
    return { absPath, ready: false };
  }
}
