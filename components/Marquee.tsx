/**
 * Decorative ticker for verbatim brand phrases. Pure CSS animation
 * (translateX loop, paused on hover, static under reduced motion).
 * Content is duplicated for the seamless loop — duplicate is aria-hidden;
 * screen readers get the plain text once via the sr-only span.
 */
export default function Marquee({
  items,
  speedS = 42,
  className,
}: {
  /** phrases to cycle — rendered with gold tick separators */
  items: string[];
  speedS?: number;
  className?: string;
}) {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex">
      {items.map((t, i) => (
        <span key={i} className="marquee-item">
          {t}
          <span className="tick" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className ?? ""}`} role="presentation">
      <span className="sr-only">{items.join(" · ")}</span>
      <div
        className="marquee-track"
        style={{ "--marquee-s": `${speedS}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
