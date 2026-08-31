/**
 * Offer glyphs (coaching page) — replaces the photo-in-a-square offer icons.
 *
 * Four hand-authored marks, one per offer, drawn from the site's own art
 * direction ("the tailor's atelier at night"): 1px-feel gold line work inside a
 * hairline medallion, so the mark reads as an emblem rather than an app icon.
 * No dependency — inline SVG only (CONVENTIONS: no new npm packages).
 *
 * Decorative by design: each glyph sits directly above the offer's <h2>, so the
 * name is already in the accessible tree. Marked aria-hidden to avoid a
 * duplicate label.
 */

export type OfferGlyphKind = "audit" | "lifestyle" | "presence" | "complete";

/** Shared line-work attributes — thin, round-capped, currentColor. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Mark({ kind }: { kind: OfferGlyphKind }) {
  switch (kind) {
    // Audit — a plumb line: the tool that tells you what is actually true
    // before you build. Vertical thread, bob, and a level datum.
    case "audit":
      return (
        <>
          <path {...stroke} d="M12 4v9.2" />
          <path {...stroke} d="M9.6 13.2h4.8L12 18.4z" />
          <path {...stroke} d="M6 20.4h12" opacity={0.55} />
          <circle {...stroke} cx={12} cy={4} r={1.1} />
        </>
      );

    // Lifestyle — a continuous loop of thread: the habits that repeat.
    case "lifestyle":
      return (
        <>
          <path
            {...stroke}
            d="M19 12a7 7 0 1 1-2.05-4.95"
          />
          <path {...stroke} d="M17 3.6v3.9h-3.9" />
          <circle {...stroke} cx={12} cy={12} r={2.4} opacity={0.55} />
        </>
      );

    // Presence — a lapel and collar notch: how a man is read before he speaks.
    case "presence":
      return (
        <>
          <path {...stroke} d="M12 4.6 7.2 8.2 5.4 20h13.2L16.8 8.2 12 4.6z" />
          <path {...stroke} d="M12 4.6v15.4" opacity={0.55} />
          <path {...stroke} d="M9.5 9.4 12 12l2.5-2.6" />
        </>
      );

    // Complete — two threads converging into one: lifestyle and personality
    // are a single system, never two services.
    case "complete":
      return (
        <>
          <path {...stroke} d="M7 4.4v6.2a5 5 0 0 0 5 5" />
          <path {...stroke} d="M17 4.4v6.2a5 5 0 0 1-5 5" />
          <path {...stroke} d="M12 15.6v4" />
          <circle {...stroke} cx={12} cy={19.6} r={1.1} />
        </>
      );
  }
}

export default function OfferGlyph({
  kind,
  className = "",
}: {
  kind: OfferGlyphKind;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-xl border border-hairline-gold text-gold-500 ${className}`}
      style={{
        width: 64,
        height: 64,
        background:
          "radial-gradient(120% 120% at 50% 0%, rgba(201,162,75,0.10), rgba(201,162,75,0) 70%)",
      }}
    >
      <svg
        width={30}
        height={30}
        viewBox="0 0 24 24"
        role="presentation"
        focusable="false"
      >
        <Mark kind={kind} />
      </svg>
    </span>
  );
}
