/**
 * Audit glyphs (/book §2) — four hand-authored marks, one per stage of the
 * Transformation Audit.
 *
 * Same house style as components/programs/OfferGlyph.tsx: 1px-feel gold line
 * work inside a hairline medallion, so the mark reads as an emblem from the
 * tailor's atelier rather than an app icon. Inline SVG only — no new packages.
 *
 * Decorative by design: each glyph sits directly above its <h3>, so the stage
 * name is already in the accessible tree. aria-hidden avoids a duplicate label.
 */

export type AuditGlyphKind = "understand" | "assess" | "gaps" | "next";

/** Shared line-work attributes — thin, round-capped, currentColor. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Mark({ kind }: { kind: AuditGlyphKind }) {
  switch (kind) {
    // Understand you — two arcs turned toward each other: a conversation,
    // not a questionnaire. The dot is the man being listened to.
    case "understand":
      return (
        <>
          <path {...stroke} d="M8.4 5.6a8 8 0 0 0 0 12.8" />
          <path {...stroke} d="M15.6 5.6a8 8 0 0 1 0 12.8" opacity={0.55} />
          <circle {...stroke} cx={12} cy={12} r={1.6} />
        </>
      );

    // Assess — a plumb line: the tool that tells you what is actually true
    // before you build anything on top of it.
    case "assess":
      return (
        <>
          <path {...stroke} d="M12 4v9.2" />
          <path {...stroke} d="M9.6 13.2h4.8L12 18.4z" />
          <path {...stroke} d="M6 20.4h12" opacity={0.55} />
          <circle {...stroke} cx={12} cy={4} r={1.1} />
        </>
      );

    // Identify gaps — a measured line with the break made visible, both
    // edges marked. The gap is the finding.
    case "gaps":
      return (
        <>
          <path {...stroke} d="M4.4 12h4.2" />
          <path {...stroke} d="M15.4 12h4.2" />
          <path {...stroke} d="M8.6 8.8v6.4" />
          <path {...stroke} d="M15.4 8.8v6.4" />
          <path {...stroke} d="M10.6 12h2.8" opacity={0.35} strokeDasharray="1 2.2" />
        </>
      );

    // Build your next step — the thread rises off the datum and keeps going.
    case "next":
      return (
        <>
          <path {...stroke} d="M4.6 19.4h14.8" opacity={0.55} />
          <path {...stroke} d="M7.4 16.2V12h4.2V7.8h4.2V4.4" />
          <path {...stroke} d="M13.6 6.8 15.8 4.4 18 6.8" />
        </>
      );
  }
}

export default function AuditGlyph({
  kind,
  className = "",
}: {
  kind: AuditGlyphKind;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`border-hairline-gold text-gold-500 inline-flex items-center justify-center rounded-xl border ${className}`}
      style={{
        width: 52,
        height: 52,
        background:
          "radial-gradient(120% 120% at 50% 0%, rgba(201,162,75,0.10), rgba(201,162,75,0) 70%)",
      }}
    >
      <svg width={26} height={26} viewBox="0 0 24 24" role="presentation" focusable="false">
        <Mark kind={kind} />
      </svg>
    </span>
  );
}
