"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useExperience } from "./store";
import { CHAPTERS, FACTS } from "./facts";

const easeExpo = [0.16, 1, 0.3, 1] as const;

// The museum carries its own night palette — explicit literals so global
// theme experiments (e.g. the daylight refresh) never break legibility here.
const EYEBROW =
  "font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c9a24b]";
const BTN_GOLD =
  "inline-flex min-h-[52px] items-center justify-center rounded-[10px] px-7 font-semibold text-[#0b0b0c] [background:linear-gradient(180deg,#e6d19a_0%,#c9a24b_45%,#a9832f_100%)] shadow-[0_8px_30px_rgba(201,162,75,0.25)] transition-transform duration-200 hover:-translate-y-0.5";
const BTN_OUTLINE =
  "inline-flex min-h-[52px] items-center justify-center rounded-[10px] border-[1.5px] border-[rgba(244,241,234,0.6)] px-7 font-semibold text-[#f4f1ea] transition-colors duration-200 hover:bg-[rgba(244,241,234,0.08)]";

function activeChapter(progress: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [a, b] = CHAPTERS[i].range;
    if (progress >= a && progress <= b) return i;
  }
  return -1;
}

export default function Overlay() {
  const chapterIdx = useExperience((s) => activeChapter(s.progress));
  const nearStart = useExperience((s) => s.progress < 0.035);
  const focus = useExperience((s) => s.focus);
  const setFocus = useExperience((s) => s.setFocus);
  const fact = focus ? FACTS[focus] : null;
  const chapter = chapterIdx >= 0 ? CHAPTERS[chapterIdx] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setFocus]);

  const jump = (p: number) =>
    window.dispatchEvent(new CustomEvent("journey:jump", { detail: p }));

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* -------- chapter titles -------- */}
      <AnimatePresence mode="wait">
        {chapter && !fact && (
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
                  "absolute inset-x-0 bottom-[14dvh] flex flex-col items-center px-5 text-center sm:inset-x-auto sm:left-[7vw] sm:bottom-[16dvh] sm:max-w-[620px] sm:items-start sm:text-left"
                : "absolute inset-x-0 bottom-[16dvh] flex flex-col items-center px-5 text-center sm:bottom-[12dvh]"
            }
          >
            <p className={EYEBROW}>{chapter.eyebrow}</p>
            {chapter.id === "arrival" ? (
              <h1 className="font-display mt-3 max-w-[19ch] text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[#f4f1ea] [text-shadow:0_2px_24px_rgba(8,8,10,0.9)]">
                {chapter.title}
              </h1>
            ) : (
              <p className="font-display mt-3 max-w-[22ch] text-[clamp(1.6rem,3.6vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.015em] text-[#f4f1ea] [text-shadow:0_2px_24px_rgba(8,8,10,0.9)]">
                {chapter.title}
              </p>
            )}
            <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-[#a7a199] [text-shadow:0_1px_12px_rgba(8,8,10,0.9)]">
              {chapter.sub}
            </p>
            {chapter.id === "arrival" && (
              <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools#blueprint" className={BTN_GOLD}>
                  Get My Free Blueprint
                </Link>
                <Link href="/book" className={BTN_OUTLINE}>
                  Book a Consultation
                </Link>
              </div>
            )}
            {chapter.id === "decision" && (
              <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/book" className={BTN_GOLD}>
                  Book ₹2,000 Consultation
                </Link>
                <Link href="/tools#blueprint" className={BTN_OUTLINE}>
                  Get My Free Blueprint
                </Link>
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
                SCROLL TO EXPLORE
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

      {/* -------- fact card -------- */}
      <AnimatePresence>
        {fact && (
          <motion.aside
            key={fact.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.55, ease: easeExpo }}
            className="pointer-events-auto absolute inset-x-3 bottom-3 max-h-[62dvh] overflow-y-auto rounded-2xl border border-[rgba(201,162,75,0.25)] bg-[rgba(11,11,12,0.9)] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(201,162,75,0.12)] backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:w-[380px] sm:-translate-y-1/2 sm:p-7"
            role="dialog"
            aria-label={fact.title}
          >
            <button
              type="button"
              onClick={() => setFocus(null)}
              aria-label="Close"
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
