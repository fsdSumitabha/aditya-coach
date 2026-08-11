"use client";

// /about §0 — THE SPLIT ("Before | After", the page opener).
//
// Two columns, one seam. Left column holds the BEFORE frames, right column the
// AFTER frames, and every ROW is one matched pair — read across, not down.
// Three rows to a set, so the reader takes in the whole proof sheet at once
// instead of waiting on a carousel.
//
// The seam is the site's gold thread: it runs the full height of the sheet,
// draws itself on load, carries a single travelling spark, and passes through
// a small arrow node at each row (before → after, three times down the page).
// At the bottom it leaves the sheet and becomes THE BRIDGE — the scroll cue
// that drops the reader into the story.
//
// BUILT FOR MORE THAN THREE. The pairs are chunked into sets of ROWS_PER_SET,
// and each grid slot crossfades between its frame in set 1, set 2, set 3…
// With today's three pairs that is a single static sheet and the set controls
// stay out of the DOM. Add a fourth pair and the sheet starts cycling in
// threes on its own, with the ticks and the pause toggle appearing to drive
// it — a new client is a new data entry, never a redesign.
//
// ⚠️  DEMO ASSETS — NOT FOR LAUNCH  ⚠️
// The six files under /public/demo are unrelated stock photographs. They are
// placeholders for layout only. Site rule: no client photo ships without
// written consent, and /about itself promises "no stock photos, no borrowed
// proof". Swap DEMO_PAIRS for consented client frames (or Aditya's own)
// before this section is published.

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ArrowRightIcon } from "@/components/icons";

/** id of the founder-story <section> on /about — the bridge's destination. */
const STORY_ID = "story";

/** Rows per sheet. The client's brief: three frames down each side. */
const ROWS_PER_SET = 3;

/**
 * Autoplay frequency — how long a sheet of three holds before the crossfade
 * to the next three. Inert while there is only one sheet. Override per
 * instance with `intervalMs`.
 */
const SLIDE_MS = 3000;

/** ⚠️ placeholders — see the DEMO ASSETS note above. All frames are 2:3. */
const DEMO_PAIRS = [
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-11795044.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495739.jpg",
  },
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-36148298.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495740.jpg",
  },
  {
    before: "/demo/before/pexels-aysegul-aytoren-46790226-37196695.jpg",
    after: "/demo/after/pexels-ivan-ananiev-737908-16495747.jpg",
  },
];

type Pair = { before: string; after: string };
/** A pair plus its 1-based position in the source list — carried so alt text
 *  still names the right man after a short sheet has been padded. */
type Slot = Pair & { n: number };

/** Chunk the pairs into sheets of three. A short final sheet is padded from
 *  the top of the list, so a sheet is never a ragged half-row. */
function toSheets(pairs: Pair[], per: number): Slot[][] {
  if (pairs.length === 0) return [];
  const numbered: Slot[] = pairs.map((p, i) => ({ ...p, n: i + 1 }));
  const sheets: Slot[][] = [];
  for (let i = 0; i < numbered.length; i += per) {
    const sheet = numbered.slice(i, i + per);
    while (sheet.length < per) sheet.push(numbered[sheet.length % numbered.length]);
    sheets.push(sheet);
  }
  return sheets;
}

/** Each half is ~325px at the 660px cap, ~47vw below it. */
const HALF_SIZES = "(min-width: 900px) 340px, 47vw";

/** Row geometry — one place to retune the sheet's height. */
const ROW_H = "h-[clamp(140px,21vh,180px)] nav:h-[min(25vh,225px)]";

// ---- Component-scoped FX (kept out of globals.css — shared file, never edited).
// Every animation is transform/opacity only and lives inside a
// prefers-reduced-motion: no-preference guard, so the reduced-motion and
// no-JS states are the finished sheet, not a blank one.
//
// The six frames are never faded in: this section is the page's LCP region
// now, so the photographs paint at final state and ALL the motion lives in
// the gold layer — the thread, the spark, the arrow nodes.
const TSPLIT_FX_CSS = `
.tsplit-slide { opacity: 0; }
.tsplit-slide[data-active="true"] { opacity: 1; }

.tsplit-thread {
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--gold-500) 6%, var(--gold-500) 94%, transparent);
  transform-origin: top center;
}

.tsplit-node { border-color: var(--hairline-gold); }
.tsplit-row:hover .tsplit-node,
.tsplit-row:focus-within .tsplit-node { border-color: var(--gold-500); }

.tsplit-bridge:hover .tsplit-bridge-ring,
.tsplit-bridge:focus-visible .tsplit-bridge-ring { border-color: var(--gold-500); }

/* Sheet ticks — scaleX + colour only, so the row never reflows. */
.tsplit-tick-bar { transform: scaleX(0.55); background: rgba(244, 241, 234, 0.3); }
.tsplit-tick[aria-current="true"] .tsplit-tick-bar { transform: scaleX(1); background: var(--gold-300); }
.tsplit-tick:hover .tsplit-tick-bar { background: var(--gold-500); }

.tsplit-toggle:hover .tsplit-toggle-ring,
.tsplit-toggle:focus-visible .tsplit-toggle-ring,
.tsplit-toggle[aria-pressed="true"] .tsplit-toggle-ring {
  border-color: var(--gold-500);
  color: var(--gold-200);
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .tsplit-slide { transition: opacity 900ms var(--ease-standard); }

  .tsplit-thread { animation: tsplit-draw 1200ms var(--ease-out-expo) both; }

  /* One travelling spark stitches the three rows together and leads the eye
     down to the bridge. The wrapper is the full seam height, so translateY
     100% carries the segment exactly from top edge to bottom edge. */
  .tsplit-spark { animation: tsplit-spark 5200ms var(--ease-standard) 1100ms infinite; }
  .tsplit-spark[data-paused="true"] { animation-play-state: paused; }

  /* Arrow nodes ignite top-to-bottom, one row after another. */
  .tsplit-node { animation: tsplit-ignite 620ms var(--ease-out-expo) var(--tsplit-delay, 0ms) both; }
  .tsplit-node-arrow { transition: transform 300ms var(--ease-out-expo); }
  .tsplit-row:hover .tsplit-node-arrow,
  .tsplit-row:focus-within .tsplit-node-arrow { transform: translateX(2px); }

  .tsplit-node,
  .tsplit-bridge-ring { transition: border-color 300ms var(--ease-standard); }
  .tsplit-bridge:hover .tsplit-bridge-ring { transform: translateY(3px); }

  .tsplit-chevron { animation: tsplit-bob 2400ms ease-in-out infinite; }

  .tsplit-tick-bar { transition: transform 400ms var(--ease-out-expo), background-color 300ms var(--ease-standard); }
  .tsplit-toggle-ring { transition: border-color 300ms var(--ease-standard), color 300ms var(--ease-standard), opacity 300ms var(--ease-standard); }
}

@keyframes tsplit-draw { from { transform: scaleY(0); } }
@keyframes tsplit-ignite {
  from { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
}
@keyframes tsplit-spark {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  82% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}
@keyframes tsplit-bob {
  0%, 100% { transform: translateY(-1px); }
  50% { transform: translateY(2px); }
}
`;

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseGlyph({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
      {playing ? (
        <g fill="currentColor">
          <rect x="8" y="6" width="3" height="12" rx="1.2" />
          <rect x="13" y="6" width="3" height="12" rx="1.2" />
        </g>
      ) : (
        <path fill="currentColor" d="M9 6.2 18 12l-9 5.8V6.2Z" />
      )}
    </svg>
  );
}

/**
 * One grid slot — a fixed frame holding this slot's photograph from every
 * sheet, stacked, one visible. With a single sheet it is simply one image.
 */
function Frame({
  frames,
  activeSheet,
  side,
  row,
  eager,
}: {
  /** This slot's photograph in every sheet, in sheet order. */
  frames: { src: string; n: number }[];
  activeSheet: number;
  side: "before" | "after";
  row: number;
  eager: boolean;
}) {
  const isBefore = side === "before";
  return (
    <div
      className={`relative ${ROW_H} overflow-hidden border-y border-hairline-soft bg-surface-2 ${
        isBefore ? "rounded-l-[14px] border-l" : "rounded-r-[14px] border-r"
      }`}
    >
      {frames.map(({ src, n }, sheet) => (
        <div
          key={`${sheet}-${src}`}
          data-active={sheet === activeSheet}
          aria-hidden={sheet !== activeSheet}
          className="tsplit-slide absolute inset-0"
        >
          <Image
            src={src}
            alt={`Transformation ${n} — ${isBefore ? "before" : "after"}`}
            fill
            sizes={HALF_SIZES}
            loading={eager && sheet === 0 ? "eager" : "lazy"}
            fetchPriority={eager && sheet === 0 && row === 0 ? "high" : undefined}
            className="object-cover object-[50%_28%]"
          />
        </div>
      ))}
    </div>
  );
}

export default function TransformationSplit({
  pairs = DEMO_PAIRS,
  intervalMs = SLIDE_MS,
}: {
  /** Before/after pairs, oldest first. Shown three rows at a time. */
  pairs?: Pair[];
  /** Autoplay frequency in ms — how long each sheet of three holds. */
  intervalMs?: number;
} = {}) {
  const sheets = toSheets(pairs, ROWS_PER_SET);
  const cycles = sheets.length > 1;

  const [sheet, setSheet] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  // WCAG 2.2.2 stop mechanism — the explicit toggle, NOT a side effect of
  // using the ticks. Manual navigation leaves autoplay running.
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const paused = hovering || focused || userPaused || !inView;

  // Reduced motion → no autoplay at all (the CSS half is handled by the
  // no-preference guard in TSPLIT_FX_CSS).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Don't burn frames (or turn unseen sheets) once scrolled past.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keyed on `sheet`, so a manual jump also restarts the dwell — the reader
  // gets a full beat on the sheet he picked before autoplay takes over again.
  useEffect(() => {
    if (!cycles || reducedMotion || paused) return;
    const t = window.setTimeout(
      () => setSheet((s) => (s + 1) % sheets.length),
      intervalMs,
    );
    return () => window.clearTimeout(t);
  }, [sheet, paused, reducedMotion, intervalMs, cycles, sheets.length]);

  // Progressive enhancement: the bridge is a real in-page anchor, so it works
  // with JS off. JS only upgrades the jump to a smooth scroll + focus move.
  const onBridgeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(STORY_ID);
      if (!target) return; // fall through to the native anchor jump
      e.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [reducedMotion],
  );

  if (sheets.length === 0) return null;

  /** Every frame for one grid slot, across all sheets. */
  const slot = (row: number, side: "before" | "after") =>
    sheets.map((s) => ({ src: s[row][side], n: s[row].n }));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="tsplit-label"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      className="bg-void grain aurora relative overflow-hidden border-b border-hairline-soft"
    >
      <style>{TSPLIT_FX_CSS}</style>

      <div className="container-site relative z-10 pb-10 pt-8 nav:pb-14 nav:pt-12">
        {/* No heading here on purpose: the page's single <h1> lives in the hero
            below, and a heading here would put an <h2> ahead of it. */}
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-8 bg-hairline-gold" />
          <p id="tsplit-label" className="eyebrow">
            THE TRANSFORMATION{/* [review] */}
          </p>
          <span aria-hidden="true" className="h-px w-8 bg-hairline-gold" />
        </div>

        {/* ---- The sheet: two columns, three rows, one seam ---- */}
        <div className="mx-auto mt-7 max-w-[660px] nav:mt-9">
          {/* Column headers — stated once, not stamped on all six frames. */}
          <div className="grid grid-cols-2 gap-[3px]">
            <p className="eyebrow text-center text-secondary">BEFORE</p>
            <p className="eyebrow text-center text-gold-300">AFTER</p>
          </div>

          <div className="relative mt-3">
            {/* The gold thread — one continuous line down the seam, behind the
                arrow nodes, carrying a single travelling spark. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-6 -translate-x-1/2"
            >
              <span className="tsplit-thread absolute inset-y-0 left-1/2 -translate-x-1/2" />
              <span
                data-paused={paused}
                className="tsplit-spark absolute inset-0"
              >
                <span className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-200 to-transparent" />
              </span>
            </div>

            <ol className="grid gap-y-3">
              {Array.from({ length: ROWS_PER_SET }, (_, row) => (
                <li
                  key={row}
                  className="tsplit-row relative grid grid-cols-2 gap-[3px]"
                >
                  <Frame
                    frames={slot(row, "before")}
                    activeSheet={sheet}
                    side="before"
                    row={row}
                    eager
                  />
                  <Frame
                    frames={slot(row, "after")}
                    activeSheet={sheet}
                    side="after"
                    row={row}
                    eager
                  />

                  {/* The row's own arrow: before → after, sitting on the seam. */}
                  <span
                    aria-hidden="true"
                    style={
                      { "--tsplit-delay": `${240 + row * 130}ms` } as CSSProperties
                    }
                    className="tsplit-node absolute left-1/2 top-1/2 z-30 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-[rgba(8,8,10,0.78)] shadow-[0_6px_20px_rgba(0,0,0,0.5)] backdrop-blur-[4px] nav:h-11 nav:w-11"
                  >
                    <ArrowRightIcon className="tsplit-node-arrow h-4 w-4 text-gold-300" />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* ---- Sheet controls — only exist once there is a second sheet ---- */}
          {cycles && (
            <div className="mt-4 flex items-center justify-center gap-1">
              {sheets.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSheet(i)}
                  aria-current={i === sheet}
                  aria-label={`Show transformation set ${i + 1} of ${sheets.length}`}
                  className="tsplit-tick grid h-12 w-8 place-items-center"
                >
                  <span
                    aria-hidden="true"
                    className="tsplit-tick-bar block h-[2px] w-5 rounded-full"
                  />
                </button>
              ))}

              {/* The stop mechanism. Hidden under reduced motion — nothing is
                  auto-updating there, so a pause control would be a dead end. */}
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-pressed={userPaused}
                  aria-label={
                    userPaused
                      ? "Play the transformation slideshow"
                      : "Pause the transformation slideshow"
                  }
                  className="tsplit-toggle ml-2 grid h-12 w-12 place-items-center"
                >
                  <span className="tsplit-toggle-ring grid h-9 w-9 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.6)] text-gold-300 opacity-70 backdrop-blur-[4px]">
                    <PauseGlyph playing={!userPaused} />
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ---- The bridge: the thread leaves the sheet and drops into the story ---- */}
        <div className="flex flex-col items-center">
          <span aria-hidden="true" className="tsplit-thread h-8 nav:h-10" />
          <a
            href={`#${STORY_ID}`}
            onClick={onBridgeClick}
            className="tsplit-bridge group flex flex-col items-center gap-2.5 pb-1 pt-2"
          >
            <span className="tsplit-bridge-ring grid h-14 w-14 place-items-center rounded-full border border-hairline-gold bg-[rgba(8,8,10,0.72)]">
              <ChevronDownIcon className="tsplit-chevron h-5 w-5 text-gold-300" />
            </span>
            <span className="eyebrow text-secondary">
              THE STORY{/* [review] */}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
