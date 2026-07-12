# CONVENTIONS — Aditya Kumar Upadhyay website (Phase 1)

Contract for every page builder. The global system (design tokens, header,
footer, WhatsApp FAB, cookie banner, reveal primitive, config stubs) is DONE —
inherit it, never redefine it. Your job is ONE route built on top of it.

## Stack facts (Next.js 16 — differs from your training data)

- Next 16.2 App Router, TypeScript, Tailwind v4, `output: "export"` (fully static).
- **`params` is a `Promise` in Next 16.** Dynamic routes must
  `const { slug } = await params;` and type it `{ params: Promise<{ slug: string }> }`.
- Per-page SEO via the Metadata API — use the `pageMetadata()` helper (below).
  Do NOT hand-write `<head>` tags, do NOT export `viewport` (root layout owns
  themeColor/viewport).
- Pages are Server Components by default. Add `"use client"` ONLY for real
  interactivity (forms, calculator, state machines). Split interactive islands
  into their own component file so the page itself stays a Server Component.
- No new npm packages. No server code, no API routes, no payment/email SDKs
  (Phase-2 fence, A4). All integration seams already exist in `lib/config.ts`.
- ESLint: unescaped `'` / `"` in JSX text will fail the build — use `&apos;`
  `&ldquo;` etc. or wrap in `{"…"}`. em-dashes and ₹ are fine.

## File ownership (write ONLY your assigned files)

- Your route: `app/<route>/page.tsx` (+ `app/not-found.tsx` / `app/thank-you/page.tsx` for the utility agent).
- Page-specific interactive components: `components/<route>/*.tsx`
  (e.g. `components/book/BookingFlow.tsx`, `components/tools/Calculator.tsx`).
- Blog post bodies: `components/blog/posts/<Name>.tsx` (assigned per agent).
- NEVER edit: `app/layout.tsx`, `app/globals.css`, `lib/*`, `components/*.tsx`
  (root-level shared), `app/sitemap.ts|robots.ts|manifest.ts`, another route's files.
  If a shared piece seems missing, build the piece inside your own folder.

## Shared modules — import, don't reinvent

```ts
// lib/config.ts
import {
  WHATSAPP_NUMBER, COACH_WHATSAPP, CONTACT_EMAIL, IG_URL, YOUTUBE_URL,
  LEAD_ENDPOINT, BLUEPRINT_PDF, SPLIT_PDF, OG_IMAGE,
  waLink,                 // waLink(text?, number?) → wa.me URL with encoded prefill
  startPayment,           // Promise<{ok:true}> stub — falls through to success
  sendToEmailProvider,    // ({email, source, ...}) => Promise<{ok:true}> stub
  notifyCoach,            // no-op stub
  track,                  // (event, data?) no-op until IDs exist
} from "@/lib/config";

// lib/site.ts
import { SITE_ORIGIN, SITE_NAME, NAV_LINKS, pageMetadata } from "@/lib/site";

// lib/blog.ts — posts metadata (SEO titles/descriptions/covers/dates are here)
import { posts, getPost, relatedPosts, prevNext, blogAuthor, type PostMeta } from "@/lib/blog";

// lib/schema.ts — site-wide Person/Business JSON-LD (already emitted in layout).
// Pages add their OWN page-level schema (Service, FAQPage, BlogPosting, …) on top.
```

## Metadata pattern (every page)

```ts
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Aditya | Men's Transformation Coach Kolkata", // A6 verbatim
  description: "…A6/PART B verbatim…",
  path: "/about",
  ogType: "profile",        // "website" default; "article" for blog posts
  noindex: false,            // true ONLY for /thank-you and not-found
});
```

Blog `[slug]` uses `generateMetadata` + `generateStaticParams` (slugs from
`posts`), remember `await params`.

## Shared components (exact APIs)

```tsx
import Reveal from "@/components/Reveal";
// <Reveal as="div" className index delayMs id style> — scroll-reveal wrapper.
// Server HTML stays visible (progressive enhancement); reveal-once; reduced-motion safe.
// Stagger siblings: <Reveal index={i}> → delay i*100ms; or delayMs={80}.
// HARD RULE: never wrap a hero H1 (LCP) in Reveal — H1 paints at final state frame 1.

import CountUp from "@/components/CountUp";
// <CountUp value durationMs startOn="visible"|"mount" format className>

import PlaceholderImage from "@/components/PlaceholderImage";
// <PlaceholderImage label="HERO PORTRAIT" w={720} h={900}
//    alt="Aditya Kumar Upadhyay, men's lifestyle coach, Kolkata"
//    variant="portrait"|"photo"|"cover"|"square" className style />
// Renders a branded inline-SVG placeholder with the TODO label. Zero CLS.

import JsonLd from "@/components/JsonLd";
// <JsonLd data={objOrArray} /> — safe application/ld+json script.

import LeadMagnetForm from "@/components/LeadMagnetForm";
// <LeadMagnetForm source="home-blueprint" buttonLabel="Send Me the Blueprint"
//    pdfHref={BLUEPRINT_PDF} pdfLabel successTitle successBody className>
//    {crossSellLinksShownOnSuccess}
// </LeadMagnetForm>
// Includes visible label, validation, aria-live errors, pending state,
// DPDP consent line + /privacy link, stub submit + track('Lead').

import MidCta from "@/components/blog/MidCta";     // blog posts only
import FinalCta from "@/components/FinalCta";
// <FinalCta heading sub primaryLabel primaryHref secondaryLabel secondaryHref primaryFirst />
// Default: heading="The man you want to become is waiting for one decision."
// primary → /book, secondary → /tools#blueprint. Use for end-of-page CTA bands
// unless your spec's band differs materially — then build it in-page.

import { WhatsAppIcon, InstagramIcon, YouTubeIcon, PinIcon, CheckIcon, ArrowRightIcon } from "@/components/icons";

// Legal pages ONLY (/privacy /terms /refund):
import LegalShell from "@/components/legal/LegalShell";
// <LegalShell title lastUpdated effectiveDate toc={[{id,label}]}>{prose}</LegalShell>
// 720px dark single-column frame + back-link + stamp + TOC + lawyer-review
// template comment. Body renders inside .article-prose — write semantic
// h2 (with id for TOC anchors), p, ul/ol.
import { LEGAL } from "@/lib/legal";
// Swappable legal facts: OWNER_NAME, BUSINESS_NAME, CONTACT_EMAIL,
// GRIEVANCE_*, JURISDICTION_*, CONSULT_PRICE, LAST_UPDATED, EFFECTIVE_DATE …
// Reference these in prose — never hardcode emails/addresses/dates.
```

## CSS system (globals.css — use these, no ad-hoc styles for covered cases)

- Layout: `container-site` (max 1160px + gutters) · `section` (64/112px) ·
  `section-lg` (64/128px) · `cv-auto` (content-visibility) · `grain` ·
  `glow-top` (radial gold) · `gold-line` (hr divider) · `table-scroll`.
- Type: `type-h1 type-h2 type-h3 type-step type-lead type-body type-small
  type-caption eyebrow type-price type-numeral` (mobile-first, desktop at 768px).
- Buttons: `btn-gold` · `btn-outline` · `btn-wa` · `btn-compact` (header-size) ·
  `cta-stack` (full-width stacked mobile → inline desktop).
- Cards: `card` · `card-light` (ivory, Young Man; heads auto-dark; gold words
  get `card-gold` class → #6E5418) · `card-dark-gold` (Successful Man, corner
  bracket built in) · `card-featured` (add to `card` for the ₹2,000 offer:
  persistent gold border + glow).
- Forms: `input-dark` · `field-label` · `field-error`.
- Prose: `article-prose` (blog bodies + legal pages) — semantic h2/h3/p/ul/
  blockquote/table styled already.
- Tailwind token utilities: `bg-void bg-base bg-alt bg-surface-1 bg-surface-2
  bg-surface-warm`, `text-primary text-secondary text-muted text-on-gold`,
  `text-gold-100…gold-900`, `border-hairline border-hairline-soft
  border-hairline-gold`, `text-error text-success`, `bg-wa`, `font-display
  font-body`, breakpoint `nav:` = 900px. Arbitrary `var(--…)` values allowed
  for anything else.

## Copy rules (A0 — the most-checked acceptance criterion)

- Quoted copy in your spec is VERBATIM — including fragments and deliberate
  line breaks ("Not before. Never before."). Do not reword or "improve" it.
- Copy your spec marks `[review]` you write yourself in Aditya's voice (short
  sentences, fragments allowed, direct, no fluff) and tag the JSX/TS line with
  a `{/* [review] */}` or `/* [review] */` comment so the owner can audit it.
- Prices: `₹2,000` in copy, `₹2000` only where a spec says so. Every "Book Now"
  → `/book`. All WhatsApp actions → `waLink(...)` with spec'd prefill text.

## Non-negotiables (A2/A9 — QA will diff against these)

- Exactly one `<h1>` per page; semantic `<section>`/landmarks; heading order.
- Hero H1 paints at final state frame 1 (no Reveal, no opacity/transform).
  Hero images: `variant` placeholder, above-the-fold, never lazy concerns.
- Below-fold sections: wrap in `<Reveal>`; stagger children with `index`.
  Only transform/opacity animate anywhere.
- No horizontal scroll at 375/768/1280 — wide tables get `table-scroll`.
- Mobile CTAs: use `cta-stack` (full-width, ≥52px). Tap targets ≥48px.
- Every interactive element keyboard-reachable; inputs have visible labels;
  errors via `aria-live`, never color-only.
- Final CTA sections keep ~88px bottom clearance (FinalCta handles it) so the
  WhatsApp FAB never covers a button.
- Below-fold heavy sections: add `cv-auto`.
- Never set long body copy in gold; on ivory `card-light`, gold-toned words use
  the `card-gold` class (#6E5418) — bright gold on ivory fails contrast.

## Funnel wiring (A5 — internal-linking is checked link-by-link)

Deep pages funnel IN → `/book` (primary) + `/tools` (secondary). `/book` links
only laterally (/programs, /refund, /privacy). Home is the hub. Follow your
spec's LINK MAP / INTERNAL LINKING section exactly.
