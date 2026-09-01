import type { Metadata } from "next";
import Link from "next/link";
import MobileHome3D from "@/components/experience/mobile/MobileHome3D";
import Positioning from "@/components/home/Positioning";
import { FACTS } from "@/components/experience/facts";
import { pageMetadata } from "@/lib/site";
import { LEGAL } from "@/lib/legal";

// ============================================================
// /mobile — THE PHONE-SHAPED JOURNEY.
//
// The same four chapters as the homepage, the same copy out of facts.ts, and
// the same scroll-driven camera — composed for a phone instead of adapted to
// one. What that means in practice is in
// components/experience/mobile/mobile-layout.ts; the short version is that the
// canvas and the chapter copy get separate bands of the screen rather than
// being stacked, so an overlap is structurally impossible rather than tuned
// away.
//
// THIS IS A PREVIEW ROUTE, NOT A SECOND HOMEPAGE. It exists so the mobile
// composition can be judged on a real device next to the current one, and it
// is a fork: components/experience/mobile/ duplicates the desktop journey
// rather than adding conditionals to it, so nothing here can regress /. When
// the composition is signed off, the intended end state is for / to render
// this treatment on small screens and for this route to go away.
//
// NOINDEX, deliberately. Everything below the canvas is the homepage's own
// content, so leaving this crawlable would put a near-duplicate of / into the
// index competing with it.
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "Mobile journey preview | Aditya Kumar Upadhyay",
  description:
    "Preview of the phone-shaped 3D journey. Not a public page — the live homepage is at /.",
  path: "/mobile",
  noindex: true,
});

export default function MobileHome() {
  return (
    <>
      {/* The page's ONE h1 — server-rendered and permanent, exactly as on the
          homepage: the chapter titles inside the journey are visual-only. */}
      <div className="sr-only">
        <h1>Become harder to ignore.</h1>
        <p>
          A complete transformation system for men who want to build a stronger
          body, sharper mind, and undeniable presence.
        </p>
      </div>

      <MobileHome3D />

      {/* Every fact from the journey as real HTML, so keyboard and
          screen-reader users get the full content without touching the canvas.
          Same block the homepage carries. */}
      <section aria-label="What you will find here" className="sr-only">
        {Object.values(FACTS).map((f) => (
          <article key={f.id}>
            <h2>{f.title}</h2>
            <p>{f.eyebrow}</p>
            <p>{f.body}</p>
            {f.attribution && <p>{f.attribution}</p>}
            {f.cta && <Link href={f.cta.href}>{f.cta.label}</Link>}
          </article>
        ))}
      </section>

      {/* The positioning block below the journey, so the preview is the whole
          mobile homepage experience and not just the canvas in isolation. */}
      <Positioning />

      <nav aria-label="Explore the site" className="sr-only">
        <ul>
          <li>
            <Link href="/">The live homepage</Link>
          </li>
          <li>
            <Link href="/method">The Right Order of Change — the method</Link>
          </li>
          <li>
            <Link href="/results">Real Men. Real Results. — transformations</Link>
          </li>
          <li>
            <Link href="/tools">Free tools — the Lifestyle Blueprint</Link>
          </li>
          <li>
            <Link href="/book">
              Book your {LEGAL.CONSULT_PRICE} Transformation Audit
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
