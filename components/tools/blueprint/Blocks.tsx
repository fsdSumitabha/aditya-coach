import Reveal from "@/components/Reveal";
import PlaceholderImage from "@/components/PlaceholderImage";
import { CheckIcon } from "@/components/icons";
import type { Block } from "./content";

/* ------------------------------------------------------------------ *
 * Presentational renderers for the Blueprint's verbatim body content.
 * Every block animates in on scroll (Reveal), staggered for rhythm.
 * These add design only — they never alter the words passed in.
 * ------------------------------------------------------------------ */

const toneClass: Record<string, string> = {
  lead: "type-lead text-secondary",
  strong: "type-lead text-primary font-medium",
  muted: "type-small text-muted",
};

function paraClass(tone?: string) {
  return tone ? toneClass[tone] : "type-body text-secondary";
}

/** A document sub-heading (e.g. "THE MORNING PROTOCOL"), stitched with a rule. */
function SubHeading({ text }: { text: string }) {
  return (
    <Reveal className="reveal-left flex items-center gap-3 pt-2">
      <span aria-hidden="true" className="thread-h sd-draw h-px w-8 shrink-0" />
      <h3 className="type-step font-display text-gold-200 tracking-tight">
        {text}
      </h3>
    </Reveal>
  );
}

function Stack({
  items,
  tone,
}: {
  items: string[];
  tone?: string;
}) {
  return (
    <div className="space-y-1.5">
      {items.map((line, i) => (
        <Reveal
          as="p"
          key={i}
          delayMs={i * 70}
          className={`reveal-left ${paraClass(tone)}`}
        >
          {line}
        </Reveal>
      ))}
    </div>
  );
}

function Steps({
  items,
}: {
  items: { n: string; title: string; body: string }[];
}) {
  return (
    <div className="relative">
      {/* the gold thread runs down the numbered steps */}
      <div
        aria-hidden="true"
        className="thread-v sd-draw absolute bottom-6 left-[19px] top-3 z-0"
      />
      <ol className="relative flex list-none flex-col gap-6">
        {items.map((step, i) => (
          <Reveal
            as="li"
            key={step.n}
            delayMs={i * 90}
            className="reveal-right grid grid-cols-[40px_minmax(0,1fr)] gap-x-4"
          >
            <span
              aria-hidden="true"
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-hairline-gold bg-surface-1 type-small font-semibold text-gold-300"
            >
              {step.n}
            </span>
            <div className="min-w-0 pt-1">
              <p className="type-body font-semibold text-primary">
                {step.title}
              </p>
              <p className="type-body text-secondary mt-2">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function Defs({
  items,
}: {
  items: { term: string; body: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((row, i) => (
        <Reveal
          key={i}
          delayMs={i * 80}
          className="reveal-blur border-l-2 border-hairline-gold pl-4 md:pl-5"
        >
          <p className="type-body font-semibold text-primary">{row.term}</p>
          <p className="type-body text-secondary mt-1.5">{row.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

function CheckList({
  label,
  items,
}: {
  label?: string;
  items: string[];
}) {
  return (
    <div>
      {label && (
        <Reveal
          as="p"
          className="eyebrow text-gold-300 mb-4"
        >
          {label}
        </Reveal>
      )}
      <ul className="flex list-none flex-col gap-3">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={i}
            delayMs={i * 60}
            className="reveal-left flex items-start gap-3"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-gold-500"
            >
              <CheckIcon width={18} height={18} />
            </span>
            <span className="type-body text-secondary">{item}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function Callout({
  label,
  lines,
}: {
  label: string;
  lines: string[];
}) {
  return (
    <Reveal className="reveal-scale">
      <div className="card spot relative overflow-hidden border-l-4 border-l-[var(--gold-500)]">
        {/* a quiet gold wash from the accent edge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(201,162,75,0.10)] to-transparent"
        />
        <div className="relative">
          <p className="eyebrow text-gold-300">{label}</p>
          <div className="mt-3 space-y-1.5">
            {lines.map((line, i) => (
              <p key={i} className="type-lead text-primary">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Renders a full Block[] stream. */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "p":
            return (
              <Reveal
                as="p"
                key={i}
                className={`reveal-blur ${paraClass(block.tone)}`}
              >
                {block.text}
              </Reveal>
            );
          case "stack":
            return <Stack key={i} items={block.items} tone={block.tone} />;
          case "h":
            return <SubHeading key={i} text={block.text} />;
          case "steps":
            return <Steps key={i} items={block.items} />;
          case "defs":
            return <Defs key={i} items={block.items} />;
          case "list":
            return <CheckList key={i} label={block.label} items={block.items} />;
          case "callout":
            return <Callout key={i} label={block.label} lines={block.lines} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/** Branded, zero-CLS image placeholder framed for the document. */
export function DocImage({
  label,
  alt,
  variant = "portrait",
  className,
}: {
  label: string;
  alt: string;
  variant?: "portrait" | "photo" | "cover" | "square";
  className?: string;
}) {
  const dims =
    variant === "photo"
      ? { w: 1000, h: 667 }
      : variant === "cover"
        ? { w: 900, h: 1200 }
        : { w: 720, h: 900 };
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-hairline-gold ${className ?? ""}`}
    >
      <PlaceholderImage
        label={label}
        alt={alt}
        w={dims.w}
        h={dims.h}
        variant={variant}
        className="sd-zoom"
      />
    </div>
  );
}
