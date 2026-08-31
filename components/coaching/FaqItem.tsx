"use client";

import { useId, useState, type ReactNode, type SVGProps } from "react";

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Accessible disclosure (ARIA button + controlled panel) with a buttery
 * grid-template-rows collapse (0fr↔1fr). The panel content stays in the DOM
 * so both open AND close animate; when collapsed it is `inert` so nothing
 * inside (e.g. the refund link) is focusable or read by AT.
 *
 * The 0.35s grid-template-rows transition + its reduced-motion guard live in a
 * page-level <style> (class `.faq-panel`) so this stays presentation-only.
 * Keyboard/focus come free from the native <button>.
 */
export default function FaqItem({
  question,
  defaultOpen = false,
  children,
}: {
  question: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-hairline-soft">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 min-h-[56px] py-4 cursor-pointer text-left"
      >
        <span className="font-display text-[1.125rem] md:text-[1.25rem] font-medium text-primary">
          {question}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 shrink-0 text-gold-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={panelId}
        inert={open ? undefined : true}
        className="faq-panel grid"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="type-body text-secondary pb-6 max-w-[64ch]">{children}</p>
        </div>
      </div>
    </div>
  );
}
