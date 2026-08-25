import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import AuditGlyph from "@/components/book/AuditGlyph";
import { AUDIT_STAGES } from "@/components/book/book-data";

/**
 * §2 — "What Exactly Is the Transformation Audit?"
 *
 * The first section a man reads if the price alone didn't convince him.
 * Kept short on purpose: one framing line, four moves, nothing else. The
 * detail belongs on the call, not on the page.
 */
export default function AuditExplainer() {
  return (
    <section className="bg-alt border-hairline-soft cv-auto border-t">
      <div className="container-site section">
        <div className="mx-auto max-w-[900px]">
          <Reveal className="flex items-center gap-3">
            <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
            <p className="eyebrow">THE AUDIT{/* [review] */}</p>
          </Reveal>
          <SplitHeading
            as="h2"
            text="What Exactly Is the Transformation Audit?"
            className="type-h2 text-primary mt-4 max-w-[20ch]"
          />
          <Reveal delayMs={100} className="reveal-blur">
            <p className="type-lead text-secondary mt-5 max-w-[54ch]">
              This is where Aditya gets to know you before recommending what you
              actually need.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
            {AUDIT_STAGES.map((stage, i) => (
              <Reveal
                key={stage.title}
                delayMs={i * 80}
                className="reveal-left border-hairline-soft border-t pt-6"
              >
                <AuditGlyph kind={stage.glyph} />
                <h3 className="type-h3 text-primary mt-4 text-[1.15rem]">
                  {stage.title}
                </h3>
                <p className="type-body text-secondary mt-2 max-w-[42ch]">
                  {stage.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
