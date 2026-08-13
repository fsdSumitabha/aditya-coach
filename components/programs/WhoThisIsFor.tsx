"use client"
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import { CheckIcon } from "@/components/icons";


function Chapter({
    num,
    label,
    center,
}: {
    num: string;
    label: string;
    center?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}
        >
            <span className="font-display text-[1.5rem] leading-none text-gold-500">
                {num}
            </span>
            {/* the rule draws itself in as the chapter scrolls into view */}
            <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
            <span className="eyebrow">{label}</span>
        </div>
    );
}

const AUDIENCE_CHECKLIST = [
  "Improve their body and physique",
  "Build better energy and daily habits",
  "Become genuinely more confident",
  "Command a stronger presence",
  "Show up better socially",
  "Sharpen their style and grooming",
  "Build real discipline",
  "Master their mindset and emotions",
  "Transform completely — not just train",
] as const; // [review]

export default function WhoThisIsFor() {
    return (
        <section className="bg-surface-1 border-y border-hairline-soft cv-auto">
        <div className="container-site section">
          <Reveal className="mb-5">
            <Chapter num="03" label="WHO THIS IS FOR" center />
          </Reveal>
          <SplitHeading
            as="h2"
            text="Who This Is For."
            className="type-h2 text-primary text-center"
          />
          {/* [review] */}

          {/* Section-opening thesis — existing verbatim line, relocated to the top
              of §4 (companion to the convergence closer below; text unchanged). */}
          <Reveal delayMs={120} className="reveal-blur mx-auto mt-6 max-w-[60ch] text-center">
            <p className="type-lead text-secondary">
              The goal isn&apos;t only to change how you look. It&apos;s to
              change how you carry yourself, how you communicate, how you
              think, and how you show up in every area of life.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {/* Card A — The Young Man (22–30) — informational, no per-card buttons */}
            <Reveal index={0}>
              <TiltCard className="h-full">
                <div className="card-light h-full">
                  <p className="eyebrow card-gold">22–30</p>
                  <h3 className="type-h3 mt-3">The Young Man</h3>
                  <p className="type-body mt-4">
                    You want direction. You want to build yourself the right way
                    from the start. You do not want to waste years figuring out
                    what actually works. This is for you.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            {/* Card B — The Successful Man (30–50) */}
            <Reveal index={1}>
              <TiltCard className="h-full">
                <div className="card-dark-gold h-full">
                  {/* Inner spot wrapper: the card's own ::before draws the corner
                      bracket, so the cursor glow rides a nested .spot instead. */}
                  <div className="spot">
                    <p className="eyebrow">30–50</p>
                    <h3 className="type-h3 mt-3">The Successful Man</h3>
                    <p className="type-body mt-4">
                      You built the career. You made the money. But somewhere along
                      the way you lost your health, your drive and your confidence.
                      You want it back. This is for you too.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* "This is for men who want to…" — compact two-column checklist with
              gold ticks. Single Reveal (calm — all ticks land together, no
              9-item stagger cascade). Stacks to one column on mobile. */}
          <Reveal className="mx-auto mt-16 max-w-3xl">
            <h3 className="type-h3 text-primary text-center">
              This is for men who want to…{/* [review] */}
            </h3>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {AUDIENCE_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* [review] */}
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-gold-500"
                  />
                  <span className="type-body text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Convergence closer — core message VERBATIM from Aditya's direction
              (2026-07-21). Companion to the thesis line at the top of §4. */}
          <Reveal delayMs={150} className="reveal-blur mx-auto mt-16 max-w-[46ch] text-center">
            <p className="font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-snug text-primary">
              I do not just change how a man looks. I help change how he shows
              up in every area of his life.
            </p>
          </Reveal>
        </div>
      </section>
    )
}