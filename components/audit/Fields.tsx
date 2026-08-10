"use client";

import { useEffect, useId, useRef, useState } from "react";
import { isVisible, type AuditData, type AuditField, type AuditValue } from "@/lib/audit/schema";

export type SetValue = (key: string, value: AuditValue | undefined) => void;

type FieldProps = {
  field: AuditField;
  data: AuditData;
  set: SetValue;
  errors: Record<string, string>;
};

const fieldId = (key: string) => `aud-${key}`;
const errorId = (key: string) => `aud-${key}-err`;
const infoId = (key: string) => `aud-${key}-info`;

/** Join the ids an input is described by, dropping the ones not in play. */
function describedBy(key: string, info: boolean, error: boolean): string | undefined {
  const ids = [info ? infoId(key) : "", error ? errorId(key) : ""].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

/** Renders one entry from the question bank. Containers recurse. */
export default function Field({ field, data, set, errors }: FieldProps) {
  if (!isVisible(field, data)) return null;

  switch (field.kind) {
    case "text": {
      const error = errors[field.key];
      return (
        <div>
          <FieldLabel
            htmlFor={fieldId(field.key)}
            text={field.label}
            required={field.required}
            info={field.info}
            forKey={field.key}
          />
          <input
            id={fieldId(field.key)}
            className="aud-input"
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            value={String(data[field.key] ?? "")}
            required={field.required}
            aria-required={field.required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(field.key, Boolean(field.info), Boolean(error))}
            onChange={(e) => set(field.key, e.target.value)}
          />
          <FieldError forKey={field.key} message={error} />
        </div>
      );
    }

    case "textarea": {
      const error = errors[field.key];
      return (
        <div>
          <FieldLabel
            htmlFor={fieldId(field.key)}
            text={field.label}
            required={field.required}
            info={field.info}
            forKey={field.key}
          />
          <textarea
            id={fieldId(field.key)}
            className="aud-input"
            style={field.minHeight ? { minHeight: field.minHeight } : undefined}
            value={String(data[field.key] ?? "")}
            aria-required={field.required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(field.key, Boolean(field.info), Boolean(error))}
            onChange={(e) => set(field.key, e.target.value)}
          />
          <FieldError forKey={field.key} message={error} />
        </div>
      );
    }

    case "chips":
      return <ChipGroup field={field} data={data} set={set} error={errors[field.key]} />;

    case "rate":
      return <Rate field={field} data={data} set={set} />;

    case "signature":
      return (
        <SignaturePad
          label={field.label}
          placeholder={field.placeholder}
          value={typeof data[field.key] === "string" ? (data[field.key] as string) : ""}
          onChange={(url) => set(field.key, url)}
        />
      );

    case "row":
      return (
        <div
          className="aud-grid"
          style={field.min ? ({ "--min": `${field.min}px` } as React.CSSProperties) : undefined}
        >
          {field.fields.map((child, i) => (
            <Field key={i} field={child} data={data} set={set} errors={errors} />
          ))}
        </div>
      );

    case "group":
      return (
        <div>
          <div className="aud-group-title">{field.title}</div>
          <div
            className="aud-grid"
            style={{ "--min": `${field.min ?? 200}px` } as React.CSSProperties}
          >
            {field.fields.map((child, i) => (
              <Field key={i} field={child} data={data} set={set} errors={errors} />
            ))}
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="aud-timeline">
          <div className="aud-stops">
            {field.fields.map((stop) => (
              <div className="aud-stop" key={stop.key}>
                <label htmlFor={fieldId(stop.key)}>{stop.label}</label>
                <input
                  id={fieldId(stop.key)}
                  className="aud-input"
                  type="text"
                  value={String(data[stop.key] ?? "")}
                  onChange={(e) => set(stop.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "eyebrow":
      return <div className="aud-group-title">{field.text}</div>;
    case "callout":
      return <div className="aud-callout">{field.text}</div>;
    case "lead":
      return <p className="aud-lead">{field.text}</p>;
    case "note":
      return <p className="aud-note">{field.text}</p>;
    case "quote":
      return <p className="aud-big-quote">{field.text}</p>;
    case "closing":
      return <p className="aud-closing">{field.text}</p>;
    case "divider":
      return <div className="aud-hair" />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Label furniture: the required asterisk and the (i) guidance bubble
// ---------------------------------------------------------------------------

function FieldLabel({
  text,
  forKey,
  htmlFor,
  labelId,
  hint,
  required,
  info,
  strong,
}: {
  text: string;
  forKey: string;
  /** Set for real form controls; omitted for chip groups, which get labelId. */
  htmlFor?: string;
  labelId?: string;
  hint?: string;
  required?: boolean;
  info?: string;
  strong?: boolean;
}) {
  const className = `aud-label${strong ? " strong" : ""}`;
  const body = (
    <>
      {text}
      {hint ? <i> {hint}</i> : null}
      {required ? (
        <>
          <span className="aud-req" aria-hidden="true">
            *
          </span>
          {/* Inputs carry aria-required; a chip group's role="group" cannot,
              so the requirement goes into its accessible name instead. */}
          {htmlFor ? null : <span className="aud-sr"> (required)</span>}
        </>
      ) : null}
    </>
  );
  return (
    <span className="aud-labelrow">
      {htmlFor ? (
        <label className={className} htmlFor={htmlFor}>
          {body}
        </label>
      ) : (
        <span className={className} id={labelId}>
          {body}
        </span>
      )}
      {info ? <InfoTip text={info} id={infoId(forKey)} label={text} /> : null}
    </span>
  );
}

/**
 * Guidance behind an (i). Opens on hover and on keyboard focus, and toggles on
 * click so it also works on touch, where there is no hover.
 */
function InfoTip({ text, id, label }: { text: string; id: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const shown = open || pinned;

  return (
    <span className="aud-tipwrap">
      <button
        type="button"
        className="aud-tipbtn"
        aria-label={`What ${label} means`}
        aria-expanded={shown}
        aria-controls={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setPinned(false);
        }}
        onClick={() => setPinned((p) => !p)}
      >
        i
      </button>
      {/* Always in the DOM so aria-describedby can reach it; only painted when open. */}
      <span className="aud-tip" id={id} data-open={shown ? "1" : undefined} role="note">
        {text}
      </span>
    </span>
  );
}

function FieldError({ forKey, message }: { forKey: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="aud-error" id={errorId(forKey)} role="alert">
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------

function ChipGroup({
  field,
  data,
  set,
  error,
}: {
  field: Extract<AuditField, { kind: "chips" }>;
  data: AuditData;
  set: SetValue;
  error?: string;
}) {
  const current = data[field.key];
  const selected = new Set(
    field.multi ? (Array.isArray(current) ? current : []) : current ? [String(current)] : [],
  );

  const toggle = (value: string) => {
    if (field.multi) {
      const next = new Set(selected);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      set(field.key, field.options.filter((o) => next.has(o)));
    } else {
      set(field.key, selected.has(value) ? "" : value);
    }
  };

  const labelId = field.label ? `${fieldId(field.key)}-label` : undefined;

  return (
    <div>
      {/* A chip group is a set of toggle buttons, not a form control, so the
          caption is a labelled <span> the group points at — not a <label>. */}
      {field.label ? (
        <FieldLabel
          text={field.label}
          forKey={field.key}
          labelId={labelId}
          hint={field.labelHint}
          required={field.required}
          info={field.info}
          strong={Boolean(field.note)}
        />
      ) : null}
      {field.note ? <p className="aud-note">{field.note}</p> : null}
      <div
        className="aud-chips"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy(field.key, Boolean(field.info), Boolean(error))}
      >
        {field.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`aud-chip${field.size === "lg" ? " lg" : ""}`}
            aria-pressed={selected.has(option)}
            onClick={() => toggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <FieldError forKey={field.key} message={error} />
      {field.otherKey ? (
        <input
          className="aud-input"
          style={{ marginTop: 12 }}
          type="text"
          placeholder={field.otherPlaceholder}
          aria-label={field.otherPlaceholder ?? "Anything else"}
          value={String(data[field.otherKey] ?? "")}
          onChange={(e) => set(field.otherKey!, e.target.value)}
        />
      ) : null}
    </div>
  );
}

function Rate({
  field,
  data,
  set,
}: {
  field: Extract<AuditField, { kind: "rate" }>;
  data: AuditData;
  set: SetValue;
}) {
  const raw = data[field.key];
  const touched = raw != null && raw !== "";
  const value = touched ? Number(raw) : 1;
  const pct = ((value - 1) / 9) * 100;

  return (
    <div className="aud-rate">
      <div className="aud-rate-top">
        <span className="aud-labelrow">
          <label htmlFor={fieldId(field.key)}>
            {field.label}
            {field.required ? (
              <span className="aud-req" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
          {field.info ? (
            <InfoTip text={field.info} id={infoId(field.key)} label={field.label} />
          ) : null}
        </span>
        <span className="aud-rate-val">{touched ? value : "—"}</span>
      </div>
      <div className="aud-rate-wrap">
        <div className="aud-rate-bg" />
        <div className="aud-rate-fill" style={{ width: touched ? `${pct}%` : 0 }} />
        <div className="aud-rate-thumb" style={{ left: touched ? `${pct}%` : 0 }} />
        <input
          id={fieldId(field.key)}
          className="aud-range"
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          aria-describedby={field.info ? infoId(field.key) : undefined}
          onChange={(e) => set(field.key, Number(e.target.value))}
        />
        <span className="aud-rate-focus" />
      </div>
      <div className="aud-scale" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function SignaturePad({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [signed, setSigned] = useState(Boolean(value));
  const id = useId();

  // Restore a signature saved on a previous visit (or before navigating away
  // from this step — the canvas is unmounted while other steps are shown).
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !value) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = value;
    // Mount-only: re-running on every stroke would repaint the saved bitmap
    // over live drawing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = ref.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    ref.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
    setSigned(true);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const next = point(e);
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e1b16";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = ref.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = ref.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
    onChange("");
  };

  return (
    <div>
      <span className="aud-label" id={id}>
        {label}
      </span>
      <div className="aud-sig">
        {signed ? null : <span>{placeholder}</span>}
        <canvas
          ref={ref}
          width={640}
          height={170}
          role="img"
          aria-labelledby={id}
          aria-label={`${label} — draw with a finger, stylus or mouse`}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      </div>
      <button type="button" className="aud-linkbtn" onClick={clear}>
        Clear signature
      </button>
    </div>
  );
}
