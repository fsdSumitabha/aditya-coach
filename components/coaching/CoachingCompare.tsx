import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon } from "@/components/icons";
import { COMPARE_ROWS, PATHS } from "@/components/coaching/coaching-data";

/**
 * §5 — "What's Included in the Coaching."
 *
 * A real semantic table (th scope=col / scope=row, sr-only caption), because
 * that is what this is. Columns are generated from PATHS, so the matrix never
 * drifts out of sync with the cards above it.
 *
 * The flagship column carries a permanent gold tint — on a comparison grid,
 * the tier you want chosen should be the one the eye lands on first.
 *
 * Narrow screens: the sanctioned .table-scroll wrapper contains the overflow,
 * so the page itself never scrolls sideways at 375px. Column headers use the
 * short path names to keep that scroll as short as possible.
 */

const cellBase = "border-hairline-soft border-b p-4 align-middle";
const goldTint = "bg-[rgba(201,162,75,0.06)]";

function Cell({ included }: { included: boolean }) {
  return included ? (
    <>
      <CheckIcon aria-hidden="true" className="text-gold-500 mx-auto h-4 w-4" />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <span aria-hidden="true" className="text-muted">
        —
      </span>
      <span className="sr-only">Not included</span>
    </>
  );
}

export default function CoachingCompare() {
  return (
    <section id="compare" className="bg-base cv-auto scroll-mt-24">
      <div className="container-site section">
        <SplitHeading
          as="h2"
          text="What's Included in the Coaching"
          className="type-h2 text-primary mx-auto max-w-[20ch] text-center"
        />
        <Reveal delayMs={120} className="reveal-blur mx-auto mt-5 max-w-[50ch] text-center">
          <p className="type-body text-secondary">
            {/* [review] */}
            Same coach, same standard. What changes is how much of the system we
            rebuild.
          </p>
        </Reveal>

        <Reveal delayMs={180} className="mx-auto mt-12 max-w-3xl">
          <div className="table-scroll">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">
                What each coaching program includes
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="type-caption text-muted p-4 font-medium">
                    <span className="sr-only">Included in</span>
                  </th>
                  {PATHS.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={`font-display text-primary border-hairline-soft border-b p-4 text-center text-[1rem] font-medium ${
                        p.flagship ? `${goldTint} rounded-t-lg` : ""
                      }`}
                    >
                      {p.shortName}
                      <span className="sr-only"> — {p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className={`${cellBase} type-small text-secondary font-normal`}
                    >
                      {row.label}
                    </th>
                    {PATHS.map((p) => (
                      <td
                        key={p.id}
                        className={`${cellBase} text-center ${p.flagship ? goldTint : ""}`}
                      >
                        <Cell included={row.cells[p.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
