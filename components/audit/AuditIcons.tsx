import type { AuditIcon } from "@/lib/audit/schema";

const PATHS: Record<AuditIcon, React.ReactNode> = {
  person: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  cross: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  cutlery: (
    <>
      <path d="M8 3v8M6 3v3a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M16 3c1.7 1.2 1.7 6.8 0 8v10" />
    </>
  ),
  dumbbell: <path d="M6.5 8v8M4 9.5v5M17.5 8v8M20 9.5v5M6.5 12h11" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />,
  pulse: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  diamond: <path d="M12 3l7 9-7 9-7-9 7-9Z" />,
  sun: (
    <>
      <circle cx="12" cy="13" r="4" />
      <path d="M12 3.5v2.4M4.6 13H2.5M21.5 13h-2.1M6.4 7.4 5 6M17.6 7.4 19 6" />
    </>
  ),
  checkbox: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  flag: <path d="M6 21V4M6 4h11l-2.5 4L17 12H6" />,
  seal: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12l2.4 2.4 4.6-5.2" />
    </>
  ),
};

/** Section badge glyph. Decorative — the section heading carries the meaning. */
export default function SectionIcon({ name }: { name: AuditIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8.5A2 2 0 0 1 6 6.5h1.4l.9-1.5A1 1 0 0 1 9.1 4.5h5.8a1 1 0 0 1 .9.5l.9 1.5H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="12.4" r="3.1" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="var(--acc)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
