"use client";

// ============================================================
// THE COPY PANEL.
//
// A fork of components/experience/Overlay.tsx, and the file where "no overlap"
// is actually enforced. The desktop overlay is an absolutely-positioned layer
// over the canvas: inset-0, pointer-events-none, chapter copy floated at
// bottom-[16svh] with a radial scrim behind it so the words stay legible when
// something gold drifts under them.
//
// None of that is here. This component renders INSIDE its own box, below the
// canvas, in normal flow (see MobileHome3D). There is no scrim because nothing
// is behind the text; there is no pointer-events juggling because the panel
// never covers the scene; and a button cannot end up over a card, because the
// two are not in the same box.
//
// What it keeps from the desktop file: the chapter copy comes from the same
// CHAPTERS entries, the CTAs from the same OVERLAY_CTAS and FACTS entries, and
// the tap-to-describe card renders the same FACTS fields. Nothing here writes
// a user-visible string.
// ============================================================

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "../store";
import { CHAPTERS, FACTS, OVERLAY_CTAS, SCENE } from "../facts";
import { BTN_GOLD, BTN_OUTLINE, EYEBROW } from "../ui";

const easeExpo = [0.16, 1, 0.3, 1] as const;

/** The same CTA sources the desktop scene anchors its in-scene buttons to. */
const METHOD_CTA =
  FACTS["order-1"].cta ?? { label: "See the full method →", href: "/method" };
const PROOF_CTA = FACTS["proof-client"].cta ?? {
  label: "See all transformations →",
  href: "/results",
};

function activeChapter(progress: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [a, b] = CHAPTERS[i].range;
    if (progress >= a && progress <= b) return i;
  }
  return -1;
}

/** Full width on a phone; BTN_GOLD/BTN_OUTLINE already carry the 52px floor. */
const STACKED = "w-full text-[0.95rem]";

export default function MobileOverlay() {
  const chapterIdx = useExperience((s) => activeChapter(s.progress));
  const hover = useExperience((s) => s.hover);
  const nearStart = useExperience((s) => s.progress < 0.035);
  const described = hover ? FACTS[hover] : null;
  const chapter = chapterIdx >= 0 ? CHAPTERS[chapterIdx] : null;

  // No jump() here — the "journey:jump" event MobileHome3D listens for is
  // still wired, it just has nothing firing it now the rail is gone. Anything
  // added later (a "skip to the programmes" link, say) dispatches that event
  // rather than scrolling the window itself, so the damped dolly stays in step.

  return (
    <div className="relative flex h-full min-h-0 flex-col border-t border-[rgba(201,162,75,0.16)] bg-[#08080a]">
      {/* The seam: a short gradient bleeding up out of the panel so the canvas
          band above ends in the same warm black rather than at a hard rule —
          the join should read as one dark room, not two panes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-b from-transparent to-[#08080a]"
      />

      {/* NO JOURNEY RAIL. The desktop overlay carries four jump dots against
          the right edge; they cost ~56px of a 380px panel — a seventh of the
          whole copy area, and more than a CTA — to save a swipe. On a phone
          scroll IS the navigation, so the dots lose their argument. They are
          also, on the right edge at top-1/2, exactly where a right thumb rests
          and exactly where the scene is. */}

      {/* -------- the panel body --------
          overflow-hidden is the backstop, not the plan: the per-chapter budget
          below is sized so nothing has to be clipped even on a 375x667 screen,
          where this band is only ~293px tall. If a chapter ever grows a third
          button or a fourth line of sub, this is what stops it spilling past
          the fold rather than pushing the layout around. */}
      {/* pb-[92px] is FAB CLEARANCE, not styling: the shared WhatsApp button
          is fixed at bottom 20px, is 60px tall and sits at z-120, so anything
          in the bottom 80px of the viewport renders UNDER it. Without this a
          full-width CTA would hand the right-hand 80px of its own tap target
          to WhatsApp — precisely the class of bug this route exists to remove.
          COPY_PANEL_H is sized around this; the two move together. */}
      <div className="flex min-h-0 flex-1 items-start overflow-hidden px-5 pb-[92px] pt-2">
        <AnimatePresence mode="wait">
          {described ? (
            /* Tap-to-describe. Desktop floats this as a card over the scene;
               here it simply takes the panel over from the chapter copy for as
               long as an object is held, which is why it needs no backdrop, no
               blur and no z-index. */
            <motion.div
              key={`d:${described.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.24, ease: easeExpo }}
              className="w-full"
            >
              <p className={EYEBROW}>{described.eyebrow}</p>
              <p className="font-display mt-2 text-[1.15rem] font-medium leading-tight text-[#f4f1ea]">
                {described.title}
              </p>
              <p className="mt-2 line-clamp-5 text-[0.9rem] leading-[1.55] text-[#a7a199]">
                {described.body}
              </p>
              {described.attribution && (
                <p className="mt-2 line-clamp-2 text-[0.75rem] font-medium leading-snug text-[#8a847a]">
                  {described.attribution}
                </p>
              )}
              {described.cta && (
                <Link
                  href={described.cta.href}
                  className={`${BTN_OUTLINE} ${STACKED} mt-4`}
                >
                  {described.cta.label}
                </Link>
              )}
            </motion.div>
          ) : (
            chapter && (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: easeExpo }}
                className="w-full"
              >
                <p className={EYEBROW}>{chapter.eyebrow}</p>

                {/* No copyFrom hold. Desktop delays the closing chapter's
                    headline until 0.93 because it would otherwise lie straight
                    across the cards the visitor is there to read. Nothing is
                    laid across anything here, so holding it back would only
                    leave the panel blank while the truck runs. */}
                <p
                  className={`font-display mt-2 font-medium tracking-[-0.015em] text-[#f4f1ea] ${
                    chapter.id === "arrival"
                      ? "text-[1.6rem] leading-[1.1]"
                      : "text-[1.3rem] leading-[1.15]"
                  }`}
                >
                  {chapter.title}
                </p>
                {/* line-clamp-4 is a backstop, not the plan — the budget in
                    COPY_PANEL_H allows three lines with room to spare, and
                    every chapter sub fits that on a 390px screen. It is here
                    so a narrower phone or a larger system font degrades by
                    trimming this line rather than by pushing a CTA under the
                    WhatsApp button. The full text is always in the DOM, and
                    the page's sr-only block carries it verbatim regardless. */}
                <p className="mt-2 line-clamp-4 text-[0.88rem] leading-[1.5] text-[#a7a199]">
                  {chapter.sub}
                </p>

                {/* ── CTAs, one block per chapter ──
                    Every one of these is a CTA the desktop scene anchors to a
                    3D point with drei's Html, or floats over the canvas. On a
                    phone an anchored button is the worst tap target in the
                    page: it moves while you reach for it, it cannot be full
                    width, and it has to be hidden before the camera flies
                    through its anchor. Down here they are ordinary links with
                    a full-width target and a fixed position. */}
                <div className="mt-4 flex flex-col gap-2.5">
                  {chapter.id === "arrival" && (
                    <>
                      <Link
                        href={OVERLAY_CTAS.book.href}
                        className={`${BTN_GOLD} ${STACKED}`}
                      >
                        {OVERLAY_CTAS.book.label}
                      </Link>
                      <Link
                        href={OVERLAY_CTAS.blueprint.href}
                        className={`${BTN_OUTLINE} ${STACKED}`}
                      >
                        {OVERLAY_CTAS.blueprint.label}
                      </Link>
                    </>
                  )}

                  {chapter.id === "proof" && (
                    <Link
                      href={PROOF_CTA.href}
                      className={`${BTN_OUTLINE} ${STACKED}`}
                    >
                      {PROOF_CTA.label}
                    </Link>
                  )}

                  {chapter.id === "order" && (
                    <>
                      <Link
                        href={METHOD_CTA.href}
                        className={`${BTN_OUTLINE} ${STACKED}`}
                      >
                        {METHOD_CTA.label}
                      </Link>
                      <Link
                        href={OVERLAY_CTAS.coaching.href}
                        className={`${BTN_OUTLINE} ${STACKED}`}
                      >
                        {OVERLAY_CTAS.coaching.label}
                      </Link>
                    </>
                  )}

                  {chapter.id === "decision" && (
                    <>
                      <Link
                        href={OVERLAY_CTAS.book.href}
                        className={`${BTN_GOLD} ${STACKED}`}
                      >
                        {OVERLAY_CTAS.book.label}
                      </Link>
                      <Link
                        href={OVERLAY_CTAS.blueprint.href}
                        className={`${BTN_OUTLINE} ${STACKED}`}
                      >
                        {OVERLAY_CTAS.blueprint.label}
                      </Link>
                    </>
                  )}
                </div>
                {/* The supporting note the desktop panel prints under its
                    second button is deliberately not rendered here. On a 667px
                    screen the closing chapter's budget is eyebrow + three-line
                    title + four-line sub + two stacked buttons, and that is the
                    whole band — the note is the one line that can go without
                    costing an action or a sentence of his copy. */}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* -------- scroll hint -------- */}
      <AnimatePresence>
        {nearStart && !described && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[10px] font-medium tracking-[0.2em] text-[#6f6a65]"
          >
            {SCENE.scrollHint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
