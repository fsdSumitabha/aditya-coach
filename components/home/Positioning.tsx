import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import FinalCta from "@/components/FinalCta";
import VideoFrame from "@/components/VideoFrame";

// ============================================================
// HOME — positioning block, rendered BELOW the 3D journey.
//
// Answers the brief's §1 in plain HTML: what he actually works on is the man
// people meet — grooming, style and appearance, body language, presence,
// communication, social skill, etiquette, confidence, charisma,
// self-presentation.
//
// Order: THE WORK (what it is, the positive core) → the film → conversion.
//
// This used to open with a correction section — "I'm not a gym coach. I'm not
// a nutritionist." over a struck-through list of training plans, diet charts,
// supplement stacks and motivation. Removed at the owner's request, 13 Aug
// 2026: the page now leads with what the work IS rather than spending the
// first screen after the journey on what it is not. The same reconciliation
// still happens below, in one line, at the end of THE WORK.
//
// All copy is written in Aditya's voice and tagged [review] for his audit.
// ============================================================

/* [review] — THE POSITIVE CORE. Every discipline he actually coaches,
   grouped so the list reads as one system instead of a word cloud.

   A tag earns its place only by naming something the card title does not
   already say. The first pass listed four per card, but most of them were
   the heading rephrased — "Confidence & Charisma" sat above the tags
   "Confidence" and "Charisma" — so a reader met the same idea twice per
   card, the second time in smaller type. Trimmed 19 Aug 2026 to the
   distinct ones; card 04 needs none, and its pill row is dropped rather
   than padded out. */
const DISCIPLINES = [
  {
    num: "01",
    title: "Grooming, Style & Appearance",
    line: "How you are put together before you have said a word.",
    tags: ["Self-presentation", "Lifestyle grooming"],
  },
  {
    num: "02",
    title: "Presence & Body Language",
    line: "How you occupy a room, and whether it holds after you sit down.",
    tags: ["Masculine presence", "Executive presence"],
  },
  {
    num: "03",
    title: "Communication & Social Skill",
    line: "How you handle people — one across a table, or forty across a room.",
    tags: ["Etiquette"],
  },
  {
    num: "04",
    title: "Confidence & Charisma",
    line: "Why people remember the conversation a week later.",
    tags: [],
  },
];

export default function Positioning() {
  return (
    <>
      {/* ============ A. IN MY WORDS — the film ============
          FIRST section under the journey, and it starts itself the moment it
          arrives: the 3D track is a 7.2-viewport sticky, so the instant this
          section is half on screen is the instant the animation ended. The
          footage is never inside the canvas — see VideoFrame for why, and for
          the autoplay rules it obeys.
          NOTE: no `cv-auto` here. content-visibility would skip this section's
          layout while it is off screen, and its intersection observer needs it
          measured to fire on time. */}
      

      {/* ============ B. THE WORK — the positive core (showpiece) ============ */}
      <section className="cv-auto relative overflow-hidden border-t border-hairline-soft bg-base">
        {/* ONE ghost watermark for the block */}
        <span
          aria-hidden="true"
          className="ghost-word sd-ghost-drift right-[-4%] top-[8%] md:right-[1%]"
        >
          PRESENCE
        </span>

        <div className="container-site section relative z-10">
          <Reveal className="max-w-[760px]">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
              <p className="eyebrow">THE WORK{/* [review] */}</p>
            </div>
            <SplitHeading
              as="h2"
              text="What I actually build."
              className="type-h2 text-primary mt-4"
            />
            <p className="type-lead mt-5 text-secondary">
              Everything that decides how a man is received — before he speaks,
              while he speaks, and after he has left.
            </p>{/* [review] */}
          </Reveal>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {DISCIPLINES.map((d, i) => (
              <Reveal key={d.num} index={i} className="reveal-blur">
                <div className="card spot h-full">
                  <p aria-hidden="true" className="type-numeral text-gold-grad">
                    {d.num}
                  </p>
                  <h3 className="type-h3 mt-3 text-primary">{d.title}</h3>
                  <p className="type-body mt-3 text-secondary">{d.line}</p>
                  {d.tags.length > 0 && (
                    <ul className="mt-6 flex list-none flex-wrap gap-2">
                      {d.tags.map((t) => (
                        <li
                          key={t}
                          className="type-caption rounded-full border border-hairline-gold px-3 py-1 text-gold-300"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* reconciles this page with /method + /programs — the body work still
              exists, it is simply the floor rather than the product */}
          <Reveal index={2} className="mx-auto mt-12 max-w-[58ch] text-center">
            <p className="type-lead text-primary">
              The training and the food still happen. They are the floor, not
              the ceiling.
            </p>{/* [review] */}
            <p className="mt-5">
              <Link href="/method" className="link-draw font-medium text-gold-300">
                The order I work through it in →{/* [review] */}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ C. CONVERSION ============ */}
      <FinalCta
        heading="Build the presence people take seriously."
        sub="Forty-five minutes on WhatsApp. We find what is actually holding you back, and the order to fix it in."
        primaryLabel="Book Your Transformation Audit"
        primaryHref="/book"
        secondaryLabel="See the Programs"
        secondaryHref="/programs"
      />
      {/* [review] — CTA band copy in his voice */}

    </>
  );
}
