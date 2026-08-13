"use client";

import { useEffect, useRef, useState } from "react";
import PlaceholderImage from "@/components/PlaceholderImage";
import { FILM } from "@/lib/config";

/**
 * The "in my words" film, in the section directly below the 3D journey.
 *
 * IT STARTS ITSELF WHEN THE JOURNEY ENDS. Not by listening to the canvas —
 * the film must never be coupled to WebGL, because the 2D fallback has no
 * journey to end — but by watching for its own arrival on screen. The section
 * is the next thing under a 7.2-viewport sticky track, so "half of me is in
 * view" and "the animation just finished" are the same instant, and it still
 * behaves correctly for a visitor who lands mid-page or gets the flat page.
 *
 * The footage is NEVER in the canvas. A texture-mapped video would decode
 * every frame into VRAM for the whole journey, on phones already running a
 * fps watchdog. It is a plain <video> in a plain section, and it costs nothing
 * until it is reached: preload="none" while it waits, "auto" once it is close.
 *
 * Autoplay rules this obeys, all of them non-negotiable:
 *   · muted + playsInline, or a phone refuses to start it at all
 *   · `controls` always, so the visitor can stop it — WCAG 2.2.2
 *   · prefers-reduced-motion never autoplays; it gets the poster and the
 *     controls and starts only when he asks
 *   · it pauses itself when scrolled away, and resumes on the way back unless
 *     he paused it himself, in which case it stays paused for good
 *
 * With no `FILM.src` yet, this renders the branded poster placeholder at the
 * same explicit resolution, so the layout is final before the footage exists.
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
  /** descriptive alt/aria-label for the footage */
  alt: string;
  /** visible caption under the frame */
  caption: string;
  /** short runtime badge, e.g. "90 SEC" */
  runtime?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** he pressed pause himself — from then on, we never start it again */
  const handedOver = useRef(false);
  const [near, setNear] = useState(false);

  const src = FILM.src;

  useEffect(() => {
    const el = wrapRef.current;
    if (!src || !el || typeof IntersectionObserver === "undefined") return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        // "close enough to be worth downloading" is a wider net than "playing"
        if (entry.isIntersecting) setNear(true);
        if (!video || calm || handedOver.current) return;
        if (entry.intersectionRatio >= 0.5) {
          // A rejected play() is normal — an autoplay policy said no. Leave the
          // poster and the controls; do not retry, and never throw.
          void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <figure className="m-0">
      <div ref={wrapRef} className="relative">
        {src ? (
          <video
            ref={videoRef}
            controls
            muted
            playsInline
            loop={false}
            preload={near ? "auto" : "none"}
            poster={FILM.poster}
            width={w}
            height={h}
            aria-label={alt}
            onPause={() => {
              // Distinguish HIS pause from ours: ours only ever happens while
              // the section is off screen, and this fires on the scroll-away
              // too, so only count it while he can actually see the thing.
              const el = videoRef.current;
              if (el && !el.ended && isMostlyOnScreen(wrapRef.current)) {
                handedOver.current = true;
              }
            }}
            className="block h-auto w-full rounded-2xl"
          >
            <source src={src} type="video/mp4" />
            <track
              kind="captions"
              src={FILM.captions}
              srcLang="en"
              label="English"
              default
            />
          </video>
        ) : (
          <>
            <PlaceholderImage label={label} w={w} h={h} alt={alt} variant="cover" />

            {/* Decorative play affordance — the real <video> supplies its own
                control, so this only exists while the poster does.
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
          </>
        )}
      </div>

      <figcaption className="type-small mt-4 text-muted">{caption}</figcaption>
    </figure>
  );
}

function isMostlyOnScreen(el: HTMLElement | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return visible > r.height * 0.5;
}
