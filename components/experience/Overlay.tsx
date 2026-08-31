"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useExperience } from "./store";
import { CHAPTERS, FACTS, OVERLAY_CTAS, SCENE } from "./facts";

import { BTN_GOLD, BTN_OUTLINE, EYEBROW } from "./ui";

const easeExpo = [0.16, 1, 0.3, 1] as const;

function activeChapter(progress: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [a, b] = CHAPTERS[i].range;
    if (progress >= a && progress <= b) return i;
  }
  return -1;
}

export default function Overlay() {
  const chapterIdx = useExperience((s) => activeChapter(s.progress));
  // A boolean, not the raw progress: this component would otherwise re-render
  // on every frame of the scroll instead of on the one frame the copy turns on.
  const copyShown = useExperience((s) => {
    const i = activeChapter(s.progress);
    const from = i >= 0 ? CHAPTERS[i].copyFrom : undefined;
    return from == null || s.progress >= from;
  });
  const nearStart = useExperience((s) => s.progress < 0.035);
  const focus = useExperience((s) => s.focus);
  const setFocus = useExperience((s) => s.setFocus);
  const hover = useExperience((s) => s.hover);
  const fact = focus ? FACTS[focus] : null;
  // The described object's copy, shown while it is pointed at. Non-modal and
  // click-through: it is a label on the thing under the cursor, not a dialog,
  // so it never steals focus and never needs dismissing.
  const described = !fact && hover ? FACTS[hover] : null;
  const chapter = chapterIdx >= 0 ? CHAPTERS[chapterIdx] : null;

  const cardRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocus(null);
        return;
      }
      // simple focus trap while a fact card is open
      if (e.key === "Tab" && useExperience.getState().focus && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setFocus]);

  // dialog focus: move to the close button on open, restore on close
  const factId = fact?.id ?? null;
  useEffect(() => {
    if (factId) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      // wait one frame so framer-motion has mounted the card
      const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    prevFocusRef.current?.focus?.();
    prevFocusRef.current = null;
  }, [factId]);

  const jump = (p: number) =>
    window.dispatchEvent(new CustomEvent("journey:jump", { detail: p }));

  const copyStyle = {
    opacity: copyShown ? 1 : 0,
    transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1)",
  } as const;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* -------- chapter titles -------- */}
      <AnimatePresence mode="wait">
        {chapter && !fact && !described && (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: easeExpo }}
            className={
              chapter.id === "arrival"
                ? // arrival: left-composed against the seal on the right (landscape);
                  // centered above the fold on portrait
                  "absolute inset-x-0 bottom-[14svh] flex flex-col items-center px-5 text-center sm:inset-x-auto sm:left-[7vw] sm:bottom-[16svh] sm:max-w-[620px] sm:items-start sm:text-left"
                : "absolute inset-x-0 bottom-[16svh] flex flex-col items-center px-5 text-center sm:bottom-[12svh]"
            }
          >
            {/* feathered scrim — guarantees contrast for the text block even
                when a bright gold object drifts behind it (no hard edges).
                It fades with the copy: a scrim left up over held-back text is
                just an unexplained dark patch over the scene. */}
            <div
              aria-hidden="true"
              style={copyStyle}
              className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 bg-[radial-gradient(70%_90%_at_50%_55%,rgba(8,8,10,0.78),rgba(8,8,10,0.35)_60%,transparent_78%)]"
            />
            {/* Held-back copy keeps its layout box while it is invisible, so
                the buttons below do not jump when it arrives. */}
            <p className={EYEBROW} style={copyStyle}>
              {chapter.eyebrow}
            </p>
            {/* the page's semantic h1 lives server-side in app/page.tsx —
                these chapter titles are visual-only */}
            {chapter.id === "arrival" ? (
              <p
                style={copyStyle}
                className="font-display mt-3 max-w-[19ch] text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[#f4f1ea] [text-shadow:0_2px_24px_rgba(8,8,10,0.9)]"
              >
                {chapter.title}
              </p>
            ) : (
              /* The closing chapter inverts the usual weighting. Everywhere
                 else the title is the statement and the sub is a stage
                 direction ("Touch a layer to read it"). Here the sub IS the
                 statement — his own line, verbatim — and the title is only the
                 setup, so the title steps down and the line under it steps up. */
              <p
                style={copyStyle}
                className={`font-display mt-3 font-medium tracking-[-0.015em] text-[#f4f1ea] [text-shadow:0_2px_24px_rgba(8,8,10,0.9)] ${
                  chapter.id === "decision"
                    ? "max-w-[26ch] text-[clamp(1.25rem,2.6vw,1.95rem)] leading-[1.16]"
                    : "max-w-[22ch] text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.12]"
                }`}
              >
                {chapter.title}
              </p>
            )}
            {/* Every utility the two branches disagree on — size, leading,
                colour, measure — lives INSIDE the branches and never split
                between base and branch: two Tailwind classes setting the same
                property on one element resolve by stylesheet order, not by the
                order they appear in the string. */}
            <p
              style={copyStyle}
              className={`mt-3 [text-shadow:0_1px_12px_rgba(8,8,10,0.9)] ${
                chapter.id === "decision"
                  ? "max-w-[38ch] text-[clamp(1.02rem,1.9vw,1.34rem)] leading-[1.5] text-[#d3ccc1]"
                  : "max-w-md text-[0.9rem] leading-relaxed text-[#a7a199]"
              }`}
            >
              {chapter.sub}
            </p>
            {chapter.id === "arrival" && (
              /* Booking is the gold slab and the blueprint the outline, in that
                 order — matching the 2D hero in StaticFallback and the brief’s
                 homepage hierarchy (paid audit primary, free resource second).
                 This pair used to be reversed, so the same hero pushed a
                 different action depending on whether WebGL ran. */
              <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={OVERLAY_CTAS.book.href} className={BTN_GOLD}>
                  {OVERLAY_CTAS.book.label}
                </Link>
                <Link href={OVERLAY_CTAS.blueprint.href} className={BTN_OUTLINE}>
                  {OVERLAY_CTAS.blueprint.label}
                </Link>
              </div>
            )}
            {/* THE METHOD chapter carries the coaching link (31 Aug 2026).
                It used to sit on the closing chapter; the closing chapter now
                offers the free blueprint instead, and this is the better place
                for it anyway — a visitor who has just watched the rebuild
                assemble is being shown what delivers it. */}
            {chapter.id === "order" && (
              <div className="pointer-events-auto mt-6 flex flex-col items-center gap-3">
                <Link href={OVERLAY_CTAS.coaching.href} className={BTN_OUTLINE}>
                  {OVERLAY_CTAS.coaching.label}
                </Link>
                {/* Says what is on the other side of the button. The label
                    itself stays inside the CTA vocabulary in AGENTS.md rather
                    than growing into a sentence. */}
                <p className="max-w-[34ch] text-center text-[0.8rem] leading-snug text-[#8f887c]">
                  {OVERLAY_CTAS.coaching.note}
                </p>
              </div>
            )}
            {/* The closing chapter's two buttons are the two ways to start:
                book the audit, or take the free blueprint. The coaching link
                moved up to the method chapter — see above.
                These live here rather than anchored in the scene because the
                overlay owns the bottom third of the screen and the header the
                top tenth, leaving no band inside the render where a button
                clears the flagship column on a phone. */}
            {chapter.id === "decision" && (
              <div className="pointer-events-auto mt-6 flex flex-col items-center gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={OVERLAY_CTAS.book.href} className={BTN_GOLD}>
                    {OVERLAY_CTAS.book.label}
                  </Link>
                  <Link href={OVERLAY_CTAS.blueprint.href} className={BTN_OUTLINE}>
                    {OVERLAY_CTAS.blueprint.label}
                  </Link>
                </div>
                <p className="max-w-[34ch] text-center text-[0.8rem] leading-snug text-[#8f887c]">
                  {OVERLAY_CTAS.blueprint.note}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- scroll hint -------- */}
      <AnimatePresence>
        {nearStart && !fact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#8a847a]">
                {SCENE.scrollHint}
              </span>
              <span className="block h-8 w-px bg-gradient-to-b from-[#c9a24b] to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- journey rail -------- */}
      <div className="pointer-events-auto absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            aria-label={`Go to: ${c.eyebrow}`}
            onClick={() => jump((c.range[0] + c.range[1]) / 2)}
            className="group flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === chapterIdx
                  ? "h-2.5 w-2.5 bg-[#c9a24b] shadow-[0_0_12px_rgba(201,162,75,0.8)]"
                  : "h-1.5 w-1.5 bg-[rgba(244,241,234,0.3)] group-hover:bg-[rgba(201,162,75,0.7)]"
              }`}
            />
          </button>
        ))}
      </div>

      {/* -------- description, while an object is pointed at -------- */}
      <AnimatePresence>
        {described && (
          <motion.div
            key={described.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: easeExpo }}
            className="absolute inset-x-4 bottom-6 rounded-2xl border border-[rgba(201,162,75,0.22)] bg-[rgba(11,11,12,0.86)] p-5 backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:w-[350px] sm:-translate-y-1/2 sm:p-6"
          >
            <p className={EYEBROW}>{described.eyebrow}</p>
            <p className="font-display mt-2 text-[1.25rem] font-medium leading-tight text-[#f4f1ea]">
              {described.title}
            </p>
            <p className="mt-2 text-[0.92rem] leading-[1.6] text-[#a7a199]">
              {described.body}
            </p>
            {described.attribution && (
              <p className="mt-2 text-[0.78rem] font-medium leading-snug text-[#8a847a]">
                {described.attribution}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- fact card -------- */}
      <AnimatePresence>
        {fact && (
          <motion.aside
            ref={cardRef}
            key={fact.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.55, ease: easeExpo }}
            className="pointer-events-auto absolute inset-x-3 bottom-3 max-h-[62svh] overflow-y-auto rounded-2xl border border-[rgba(201,162,75,0.25)] bg-[rgba(11,11,12,0.9)] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(201,162,75,0.12)] backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:w-[380px] sm:-translate-y-1/2 sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-label={fact.title}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setFocus(null)}
              aria-label={SCENE.close}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] text-[#a7a199] transition-colors hover:border-[rgba(201,162,75,0.4)] hover:text-[#f4f1ea]"
            >
              ✕
            </button>
            <p className={`${EYEBROW} pr-10`}>{fact.eyebrow}</p>
            <p className="font-display mt-3 text-[1.45rem] font-medium leading-tight text-[#f4f1ea]">{fact.title}</p>
            <p className="mt-3 text-[0.98rem] leading-[1.65] text-[#a7a199]">{fact.body}</p>
            {fact.attribution && (
              <p className="mt-3 text-[0.8rem] font-medium leading-snug text-[#8a847a]">{fact.attribution}</p>
            )}
            {fact.cta && (
              <Link
                href={fact.cta.href}
                className={`mt-5 ${
                  fact.id === "offer-discovery" || fact.id === "blueprint"
                    ? BTN_GOLD
                    : BTN_OUTLINE
                } w-full`}
              >
                {fact.cta.label}
              </Link>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
