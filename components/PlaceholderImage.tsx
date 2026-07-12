import type { CSSProperties } from "react";

/**
 * Branded placeholder for every Phase-1 photo (A10).
 * Renders an inline SVG (no network, zero CLS — explicit aspect ratio) in the
 * site's charcoal/gold grade with a silhouette motif and a TODO label.
 * Swap by replacing the call site with a real <img>/<Image> of the SAME w/h.
 */
export default function PlaceholderImage({
  label,
  w,
  h,
  alt,
  variant = "photo",
  className,
  style,
}: {
  /** e.g. "HERO PORTRAIT" — dimensions are appended automatically */
  label: string;
  w: number;
  h: number;
  /** descriptive alt for the future real image */
  alt: string;
  variant?: "portrait" | "photo" | "cover" | "square";
  className?: string;
  style?: CSSProperties;
}) {
  const cx = w / 2;
  const headR = Math.min(w, h) * 0.14;
  const headCy = h * 0.36;
  const shoulderY = h * 0.62;
  const fontSize = Math.max(13, Math.min(w, h) * 0.035);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        borderRadius: 16,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`ph-bg-${w}-${h}-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1712" />
          <stop offset="100%" stopColor="#0e0d0b" />
        </linearGradient>
        <radialGradient id={`ph-glow-${w}-${h}-${variant}`} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(201,162,75,0.16)" />
          <stop offset="100%" stopColor="rgba(201,162,75,0)" />
        </radialGradient>
      </defs>

      <rect width={w} height={h} fill={`url(#ph-bg-${w}-${h}-${variant})`} />
      <rect width={w} height={h} fill={`url(#ph-glow-${w}-${h}-${variant})`} />

      {(variant === "portrait" || variant === "square") && (
        <g fill="rgba(201,162,75,0.14)">
          <circle cx={cx} cy={headCy} r={headR} />
          <path
            d={`M ${cx - headR * 2.4} ${h} Q ${cx - headR * 2.2} ${shoulderY} ${cx} ${shoulderY - headR * 0.35} Q ${cx + headR * 2.2} ${shoulderY} ${cx + headR * 2.4} ${h} Z`}
          />
        </g>
      )}

      {(variant === "photo" || variant === "cover") && (
        <g stroke="rgba(201,162,75,0.2)" strokeWidth={1}>
          <line x1={0} y1={h * 0.72} x2={w} y2={h * 0.5} />
          <line x1={0} y1={h * 0.82} x2={w} y2={h * 0.6} />
          <circle
            cx={w * 0.78}
            cy={h * 0.28}
            r={Math.min(w, h) * 0.08}
            fill="rgba(201,162,75,0.1)"
            stroke="none"
          />
        </g>
      )}

      {/* hairline frame */}
      <rect
        x={1}
        y={1}
        width={w - 2}
        height={h - 2}
        rx={15}
        fill="none"
        stroke="rgba(201,162,75,0.25)"
        strokeWidth={1.5}
      />

      {/* TODO label */}
      <text
        x={cx}
        y={h - fontSize * 2.4}
        textAnchor="middle"
        fill="#a7a199"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight={600}
        letterSpacing="0.08em"
      >
        {`${label.toUpperCase()} ${w}×${h}`}
      </text>
      <text
        x={cx}
        y={h - fontSize}
        textAnchor="middle"
        fill="rgba(201,162,75,0.7)"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={fontSize * 0.82}
        fontWeight={500}
        letterSpacing="0.14em"
      >
        REPLACE
      </text>
    </svg>
  );
}
