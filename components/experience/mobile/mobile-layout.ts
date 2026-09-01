/**
 * EVERY NUMBER THAT DIFFERS BETWEEN THE DESKTOP JOURNEY AND THIS ONE.
 *
 * This folder is a deliberate FORK of components/experience/, not a refactor
 * of it: the desktop files are untouched, and each Mobile* file here started
 * as a byte-for-byte copy of its sibling so a diff between the two shows
 * exactly what "phone-shaped" means. Copy still comes from the shared
 * facts.ts — nothing here invents a string — and the shared store, flags and
 * visibility gate are imported, not duplicated.
 *
 * ── THE ONE IDEA ──────────────────────────────────────────────────────────
 * The desktop journey paints the canvas full-bleed and floats the chapter copy
 * over the bottom third of it. On a phone that is the whole problem: a 390x844
 * viewport is aspect 0.46, the copy block eats ~40% of it, and the 3D subject
 * and the words end up fighting for the same pixels — which is what produces
 * every overlap and every "why is the card off the edge".
 *
 * So this version does not overlay at all. The canvas gets a band at the TOP
 * and the copy gets its own band BELOW it. Two boxes, no z-stacking, so an
 * overlap is not something to tune — it is structurally impossible.
 */

/**
 * THE COPY PANEL'S HEIGHT, and the most load-bearing number in this folder.
 * It is a CSS length rather than a percentage on purpose: it must not change
 * between chapters, because the canvas takes whatever is left over and a
 * canvas that resizes mid-journey re-derives its projection, re-lays the SDF
 * type on the cards, and hitches the frame it happens on.
 *
 * The floor of 380px is not taste, it is the sum of what has to fit on the
 * tallest chapter, measured against a 375x667 screen:
 *
 *     8px   top padding
 *    15px   eyebrow
 *    56px   two lines of chapter title
 *    63px   three lines of chapter sub
 *    32px   the gaps between those
 *   114px   two stacked CTAs (52px each — the kit's tap-target floor — plus
 *           the 10px between them)
 *    92px   bottom padding, which is FAB CLEARANCE: the shared WhatsApp
 *           button is fixed at bottom 20px and is 60px tall, at z-120, so
 *           anything in the bottom 80px of the viewport sits UNDER it. A
 *           full-width CTA there would hand the right-hand 80px of its tap
 *           target to WhatsApp — the exact class of bug this route exists to
 *           remove. Reclaim this by giving the route its own layout without
 *           the FAB (see app/landing-page for the pattern) if the canvas ever
 *           needs the height back.
 *   ─────
 *   380px
 */
export const COPY_PANEL_H = "clamp(380px, 50svh, 420px)";

/**
 * The frustum this journey is composed for. fov is VERTICAL, so:
 *   halfHeight = distance * tan(fov/2)
 *   halfWidth  = halfHeight * aspect
 */
export const MOBILE_FOV = 56;

/**
 * THE NARROWEST CANVAS ANY PHONE PRODUCES, which is the case every distance
 * has to clear. The canvas is whatever is left after the header (68px) and the
 * copy panel above, so its aspect is width / (100svh - 68 - COPY_PANEL_H):
 *
 *   375 x 667  ->  219px tall  ->  aspect 1.71
 *   390 x 844  ->  388px tall  ->  aspect 1.01
 *   430 x 932  ->  444px tall  ->  aspect 0.97
 *
 * Composing against 0.95 means every real phone only ever adds margin. Note
 * how far this is from the 0.46 the desktop KEYS_PORTRAIT table has to serve —
 * that gap is the entire reason this journey can stand 4 to 5 units off its
 * subjects where the desktop portrait path stands 11 to 13.
 *
 * Vertical framing is aspect-independent (halfHeight is a function of distance
 * alone), so only widths move between devices. Every check written into
 * MobileCameraRig is therefore a WIDTH check, except the flagship card, where
 * height is what binds.
 */
export const DESIGN_ASPECT = 0.95;

export const halfHeightAt = (d: number) =>
  d * Math.tan((MOBILE_FOV * Math.PI) / 360);
export const halfWidthAt = (d: number, aspect = DESIGN_ASPECT) =>
  halfHeightAt(d) * aspect;

// ── Chapter arrangement ───────────────────────────────────────────────────

/**
 * THE PROOF GALLERY, TIGHTENED. Desktop spreads the pair to x ±1.78 and leaves
 * a 2.2-unit gap down the middle for the in-scene button. Nothing lives in
 * that gap here — every CTA moved to the copy panel — and the spread was only
 * ever that wide because the desktop camera stands 7.5 units back.
 *
 * At ±0.85 the pair's outer edge lands at 1.60: 0.85, plus 0.69 of
 * half-panel-and-frame, plus 0.06 of bracket. The camera can then come to 4.2
 * units instead of the desktop portrait path's 11, and the two photographs
 * fill roughly a third of the frame width EACH instead of about an eighth.
 * That is the difference between a before/after you can read on a phone and
 * two stamps in the middle distance.
 */
export const PROOF_X_M = 0.85;

/**
 * THE PROGRAMME ROW, RE-SPACED — the one mobile-only idea in the scene rather
 * than a re-framing of the desktop one.
 *
 * Three cards side by side cannot be read on a phone at any distance. The
 * desktop file says so itself, in the note under KEYS_PORTRAIT: fitting the
 * row's ±2.80 across a phone frustum forces the camera so far back that the
 * bullet type lands near 6px. A wider canvas alone does not fix it — it takes
 * 6px to about 8px.
 *
 * So the row is not framed as a row here. The cards are uniform 2.2 wide and
 * the camera TRUCKS ALONG THE ROW, left to right, across the whole closing
 * chapter. One card fills the frame at a time and scroll is what moves between
 * them. At the 4.5-unit stand-off a card is about half the frame width — some
 * 200px on a 390px screen, against 60px in a three-across row — and the
 * bullets land near 11px.
 *
 * The ±3.3 spread is derived from that stand-off, not chosen: at 4.5 units the
 * frame reaches 2.27 either side of the card it is centred on, and a card is
 * 1.1 wide, so the next card's near edge has to sit past 2.27 + nothing and
 * before 2.27 + a readable sliver. 3.3 - 1.1 = 2.20 leaves 0.07 of the
 * neighbour showing: enough to say another card is coming, not enough for two
 * of them to share the screen.
 */
export const PILLAR_X_M = [-3.3, 0, 3.3];
/** Uniform. Width signalled hierarchy in a row; nothing is side by side now. */
export const PILLAR_W_M = [2.2, 2.2, 2.2];
/**
 * Height still does: the flagship stays the tallest of the three. Deliberately
 * IDENTICAL to the desktop heights — the card lays its own type out against
 * `h` (name, then price line, then four bullets, each stacked off the one
 * above), so shrinking these to buy camera distance would risk running the
 * bullets off the bottom of the short cards. The distance was found by moving
 * the camera instead.
 */
export const PILLAR_H_M = [3.4, 4.0, 3.4];
