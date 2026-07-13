# DESIGN KIT 2.0 — elevation pass contract

Art direction: **"the tailor's atelier at night."** Warm-black surfaces with
material depth; gold behaves like actual metal (catches light, shimmers,
never bounces); one orchestrated scroll moment per page; everything else
quiet and disciplined. The signature site-wide device is **the gold thread**
— 1px gold lines that draw themselves as you scroll, stitching the "right
order of change" through the site.

Hard rules (unchanged from CONVENTIONS.md, re-read it):
- Copy stays VERBATIM — this pass touches presentation only. Never reword,
  add, or remove user-visible text. Decorative repeated phrases (marquee)
  must reuse existing verbatim lines and be aria-hidden.
- Page h1 (LCP) still paints frame 1 — no Reveal/SplitHeading/opacity on it.
- Only transform / opacity / clip-path / filter animate. Reduced motion →
  static everywhere (the kit's classes already handle this — don't invent
  raw keyframes without a no-preference wrap).
- Keep every id/anchor, every link target, one h1, heading order, all
  disclaimers, all form behavior. No new npm deps. Don't touch shared files
  (app/globals.css, app/layout.tsx, root components/*) or other routes.
- No horizontal scroll at 375/768/1280: parallax/ghost elements need an
  `overflow-hidden` ancestor (section-level `relative overflow-hidden`).

## New CSS primitives (app/globals.css — already shipped)

Atmosphere & material:
- `aurora` — slow-drifting gold radial glows behind a section (put on the
  section with `relative`; pairs with `grain`). Use on heroes + final CTAs.
- `ghost-word` (+ `filled` variant) — huge Fraunces watermark word,
  absolutely positioned, aria-hidden. ONE per page maximum, behind the
  showpiece section, combined with `sd-ghost-drift`. Must sit inside an
  `overflow-hidden` section.
- `.card`/`.card-dark-gold` now carry a top-light gradient automatically.
- `spot` — add to a `.card` for a cursor-tracking radial highlight
  (FxController drives it; content is auto-raised above the glow).
- `text-gold-grad` — metallic gradient text for short gold phrases/numerals
  (NOT body copy).

The gold thread:
- `thread-v sd-draw` / `thread-h sd-draw` — 1px gold lines that scale-draw
  keyed to scroll (`view()` timeline). Use as timeline spines, step
  connectors, section stitches.

Scroll-driven depth (all wrapped in @supports + no-preference; base state
is the FINAL state, so non-supporting browsers just see the finished page):
- `sd-parallax` / `sd-parallax-soft` — vertical drift for portraits,
  ornaments, ghost words (±7% / ±3.5%).
- `sd-wipe` — clip-path bottom-up image reveal (before/after photos, covers).
- `sd-zoom` — slow 1.06→1 settle for hero-adjacent imagery.
- `sd-ghost-drift` — horizontal drift for ghost words.

Entrances (IntersectionObserver, works everywhere — keep using `<Reveal>`):
- New modifiers compose on the same element: `reveal-blur`, `reveal-left`,
  `reveal-right`, `reveal-scale`. e.g. `<Reveal className="reveal-blur">`.
- NEVER combine an `sd-*` entrance with `Reveal` on the same element.

Micro-interactions (automatic — do not reimplement):
- `.btn-gold` hover now fires a metal shine sweep.
- `.card-featured` breathes its gold glow.
- `.nav-link` hover draws an underline.
- `link-draw` — gold underline draw-in for inline text links (use on
  "→" text links like "Read the full method →").
- `.tilt` via `<TiltCard>` (below).

Pinned scenes (the per-page showpiece):
- `pin-scene` (tall wrapper, e.g. `min-h-[220vh]`) + `pin-stage` (sticky,
  centers content). Drive child effects with `sd-*` classes keyed to the
  wrapper's scroll, or stagger with plain Reveal. Use ONCE per page, only
  where the narrative earns it. On mobile heights, verify nothing clips.

Other:
- `route-fade` — automatic page-transition (template.tsx). Nothing to do.
- `.read-progress` — used via <ScrollProgress /> (blog article only).
- `stroke-draw` — SVG path draw-in (check marks, decorative strokes;
  set pathLength=60 on the path… or adjust dasharray to your path length).
- Styled scrollbar, header gold hairline on scroll — automatic.

## New shared components

```tsx
import SplitHeading from "@/components/SplitHeading";
// <SplitHeading as="h2" text="Real Men. Real Results." className="type-h2 text-primary" />
// Word-mask staggered rise on scroll-into-view. SECTION headings only, never the h1.
// Takes a plain string — headings with nested markup keep using <Reveal>.

import Marquee from "@/components/Marquee";
// <Marquee items={["Real Men. Real Results."]} speedS={38} className="py-6" />
// Decorative ticker; reuse ONLY verbatim phrases already on the page.

import TiltCard from "@/components/TiltCard";
// <TiltCard className=""><div className="card spot">…</div></TiltCard>
// ≤3° cursor tilt, desktop only. For proof/program/magnet cards.

import ScrollProgress from "@/components/ScrollProgress";
// Blog article template only.
```

## Taste rules (what "perfect" means here)

- Spend boldness in ONE place per page (the pinned scene or the ghost-word
  hero). Everything else: quiet depth (aurora, spot cards, thread stitches).
- Stagger structure: hero elements ~70ms apart; card grids 80–100ms; never
  more than ~500ms total before the last element lands.
- Gold is scarce. If a section has three gold moments, remove one.
- Hover states everywhere something is interactive; nothing moves more than
  4px/4deg on hover.
- Alternate section backgrounds void → base → alt → surface-warm for rhythm;
  stitch adjacent sections with a `thread-h sd-draw` divider where the
  narrative continues.
- Mobile first: pinned scenes shorten (`min-h-[160vh]`), tilt/spot/cursor
  effects are desktop-only by design — mobile gets the aurora, threads,
  wipes, and staggered reveals.
