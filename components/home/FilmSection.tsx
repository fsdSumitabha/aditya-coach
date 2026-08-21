import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import VideoFrame from "@/components/VideoFrame";

/**
 * HOME — "IN MY WORDS", the film band.
 *
 * Self-contained section, parked here until the footage exists. To put it back
 * on the page, add ONE line inside the fragment in components/home/
 * Positioning.tsx, as the FIRST child (above the "THE WORK" section):
 *
 *     <FilmSection />
 *
 * …plus its import:
 *
 *     import FilmSection from "@/components/home/FilmSection";
 *
 * WHERE IT GOES AND WHY: first section under the 3D journey. The film starts
 * itself the moment it arrives — the 3D track is a 7.2-viewport sticky, so the
 * instant this section is half on screen is the instant the animation ended.
 * The footage is never inside the canvas; see components/VideoFrame.tsx for
 * why, and for the autoplay rules it obeys.
 *
 * NOTE: no `cv-auto` on the section. content-visibility would skip its layout
 * while it is off screen, and VideoFrame's intersection observer needs the
 * section measured to fire on time.
 *
 * UNTIL THE FILM IS ATTACHED: `FILM.src` in lib/config.ts is null, so
 * VideoFrame renders the branded poster placeholder at the final 1280×720
 * resolution — zero CLS when the real file lands. Attaching the film is a
 * one-line edit to `FILM.src`; nothing here changes.
 */
export default function FilmSection() {
  return (
    <section className="border-t border-hairline-soft bg-alt">
      <div className="container-site section">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">IN MY WORDS{/* [review] */}</p>
          <SplitHeading
            as="h2"
            text="Ninety seconds. No slides."
            className="type-h2 text-primary mt-4"
          />
          <p className="type-lead mt-5 text-secondary">
            If you would rather hear this from me than read it, start here.
          </p>{/* [review] */}
        </Reveal>

        <Reveal index={1} className="reveal-blur mx-auto mt-10 max-w-[900px] md:mt-14">
          {/* Shared film frame — label/size/runtime/alt are the asset's own
              defaults (components/VideoFrame.tsx); only the caption is written
              for this page. */}
          <VideoFrame caption="Shot in one take. No script, no slides — what the work is, in his own words." />
        </Reveal>
      </div>
    </section>
  );
}
