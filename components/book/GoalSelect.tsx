"use client";

/**
 * /book — the "which path" field: a select that can carry a second line.
 *
 * A native <select> cannot show a description under each option, and a radio
 * stack costs three cards of vertical space in the middle of the form. This
 * is the ARIA 1.2 combobox-with-listbox pattern instead: a button that looks
 * like the form's other fields, and a popup where each option is a title plus
 * a one-line hint (capped at 40 characters — see GOAL_CHOICES in book-data).
 *
 * Focus never leaves the button; the active option is pointed at with
 * aria-activedescendant, which is what makes the keyboard behaviour match a
 * real select. Keys: Enter/Space/Arrow open, Arrows move, Home/End jump,
 * Enter/Space pick, Escape or Tab or an outside click close.
 *
 * The value lives in the parent's form state (BookingFlow), so there is no
 * hidden input and nothing to keep in sync.
 */

import { useEffect, useId, useRef, useState, type RefObject } from "react";

export type GoalChoice = { value: string; hint: string };

export default function GoalSelect({
  id,
  labelId,
  describedById,
  choices,
  value,
  onChange,
  invalid,
  buttonRef,
  placeholder = "Select one",
}: {
  id: string;
  labelId: string;
  describedById: string;
  choices: readonly GoalChoice[];
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  /** So the form can focus this field when submit finds it empty. */
  buttonRef: RefObject<HTMLButtonElement | null>;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = choices.findIndex((c) => c.value === value);
  const selected = selectedIndex >= 0 ? choices[selectedIndex] : null;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  // Open on the current selection, not on the top of the list.
  function openList(from = selectedIndex >= 0 ? selectedIndex : 0) {
    setActiveIndex(from);
    setOpen(true);
  }

  function commit(i: number) {
    onChange(choices[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  // Close on an outside press. pointerdown rather than click, so the list is
  // gone before the thing underneath reacts.
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const last = choices.length - 1;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        // Let focus leave, but don't leave the popup hanging open behind it.
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        id={id}
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${id}`}
        aria-describedby={describedById}
        aria-required="true"
        aria-invalid={invalid ? true : undefined}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="input-dark flex items-center justify-between gap-3 text-left"
      >
        <span className={selected ? "text-primary" : "text-muted"}>
          {selected ? selected.value : placeholder}
        </span>
        <ChevronIcon
          aria-hidden="true"
          className={`text-gold-500 h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="border-hairline-gold bg-surface-2 absolute top-[calc(100%+6px)] right-0 left-0 z-30 overflow-hidden rounded-[10px] border shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        >
          {choices.map((choice, i) => {
            const isSelected = choice.value === value;
            return (
              <li
                key={choice.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(i)}
                onPointerMove={() => setActiveIndex(i)}
                className={`flex min-h-[56px] cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                  i === activeIndex ? "bg-surface-1" : ""
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="type-small text-primary block font-medium">
                    {choice.value}
                  </span>
                  <span className="type-caption text-muted mt-0.5 block">
                    {choice.hint}
                  </span>
                </span>
                {isSelected && (
                  <CheckMark aria-hidden="true" className="text-gold-500 mt-1 h-4 w-4 shrink-0" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
