import PlaceholderImage from "@/components/PlaceholderImage";

/**
 * Poster-frame placeholder for the "in my words" film (Phase 1 — no real asset yet).
 *
 * Server Component: this is deliberately NOT an interactive player. It renders a
 * branded poster at an explicit resolution (zero CLS) with a decorative play
 * glyph, so the layout is final before the real footage exists.
 *
 * ---------------------------------------------------------------------------
 * TODO (asset swap) — replace the <PlaceholderImage> below with:
 *
 *   <video
 *     controls
 *     preload="none"
 *     poster="/video/in-my-words-poster.jpg"   // same w/h as the placeholder
 *     className="block h-auto w-full rounded-2xl"
 *     aria-label={alt}
 *   >
 *     <source src="/video/in-my-words.mp4" type="video/mp4" />
 *     <track kind="captions" src="/video/in-my-words.en.vtt" srcLang="en" label="English" default />
 *   </video>
 *
 * Captions are REQUIRED, not optional — most Instagram traffic watches on mute.
 * Keep `preload="none"` so the film never costs mobile users bandwidth on load.
 * When the real <video> lands, drop the decorative glyph below (the player
 * draws its own control) and keep the <figcaption>.
 * ---------------------------------------------------------------------------
 */
export default function VideoFrame({
  label,
  w,
  h,
  alt,
  caption,
  runtime,
}: {
  /** placeholder label, e.g. "FILM — IN MY WORDS" */
  label: string;
  w: number;
  h: number;
  /** descriptive alt/aria-label for the future real footage */
  alt: string;
  /** visible caption under the frame */
  caption: string;
  /** short runtime badge, e.g. "90 SEC" */
  runtime?: string;
}) {
  return (
    <figure className="m-0">
      <div className="relative">
        <PlaceholderImage label={label} w={w} h={h} alt={alt} variant="cover" />

        {/* Decorative play affordance — the real <video> supplies its own control.
            aria-hidden so screen readers get the poster's alt text only. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <svg
            width="84"
            height="84"
            viewBox="0 0 84 84"
            fill="none"
            className="drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
          >
            <circle
              cx="42"
              cy="42"
              r="40"
              fill="rgba(14,13,11,0.55)"
              stroke="rgba(201,162,75,0.55)"
              strokeWidth="1.5"
            />
            <path d="M34 27.5 L59 42 L34 56.5 Z" fill="rgba(201,162,75,0.92)" />
          </svg>
        </span>

        {runtime && (
          <span
            aria-hidden="true"
            className="eyebrow absolute bottom-4 right-4 rounded-full border border-hairline-gold bg-[rgba(14,13,11,0.72)] px-3 py-1 text-gold-300"
          >
            {runtime}
          </span>
        )}
      </div>

      <figcaption className="type-small mt-4 text-muted">{caption}</figcaption>
    </figure>
  );
}
