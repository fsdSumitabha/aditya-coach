import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import PathCard from "@/components/coaching/PathCard";
import { PATHS } from "@/components/coaching/coaching-data";

/**
 * §2 — the showpiece. Two paths side by side, the flagship full-width beneath:
 *
 *   ┌──────────────┬──────────────┐
 *   │  Lifestyle   │  Presence    │
 *   └──────────────┴──────────────┘
 *   ┌─────────────────────────────┐
 *   │   Complete Transformation   │
 *   └─────────────────────────────┘
 *
 * Layout comes from the data: anything not flagged `flagship` joins the row,
 * the flagship takes the band. The page's single ghost word sits here — this is
 * the section that earns the boldness.
 */
export default function PathGrid() {
  const standard = PATHS.filter((p) => !p.flagship);
  const flagship = PATHS.filter((p) => p.flagship);

  return (
    <section
      id="paths"
      className="bg-base relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        {/* reuses the h1's own word — decorative, aria-hidden */}
        <span className="ghost-word sd-ghost-drift">PATHS</span>
      </div>

      <div className="container-site section relative z-10">
        <SplitHeading
          as="h2"
          text="The Three Coaching Paths"
          className="type-h2 text-primary mx-auto mt-4 max-w-[20ch] text-center"
        />
        <Reveal delayMs={120} className="reveal-blur mx-auto mt-5 max-w-[54ch] text-center">
          <p className="type-body text-secondary">
            {/* [review] */}
            Two halves of the same system, or the whole thing at once. Pick the
            one that matches where you are — the Audit confirms it.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7">
          {standard.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 90} className="h-full">
              <PathCard path={p} />
            </Reveal>
          ))}
        </div>

        {flagship.map((p) => (
          <Reveal
            key={p.id}
            delayMs={180}
            className="mt-6 md:mt-7"
            style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
          >
            <PathCard path={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
