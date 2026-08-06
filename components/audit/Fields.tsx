"use client";

import { useEffect, useRef, useState } from "react";
import type { AuditData, AuditField, AuditValue } from "@/lib/audit/schema";

export type SetValue = (key: string, value: AuditValue | undefined) => void;

type FieldProps = {
  field: AuditField;
  data: AuditData;
  set: SetValue;
  errors: Record<string, string>;
};

const fieldId = (key: string) => `aud-${key}`;

/** Renders one entry from the question bank. Containers recurse. */
export default function Field({ field, data, set, errors }: FieldProps) {
  switch (field.kind) {
    case "text": {
      const error = errors[field.key];
      return (
        <div>
          <label className="aud-label" htmlFor={fieldId(field.key)}>
            {field.label}
          </label>
          <input
            id={fieldId(field.key)}
            className="aud-input"
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            value={String(data[field.key] ?? "")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId(field.key)}-err` : undefined}
            onChange={(e) => set(field.key, e.target.value)}
          />
          {error ? (
            <p className="aud-error" id={`${fieldId(field.key)}-err`} role="alert">
              {error}
            </p>
          ) : null}
        </div>
      );
    }

    case "textarea":
      return (
        <div>
          <label className="aud-label" htmlFor={fieldId(field.key)}>
            {field.label}
          </label>
          <textarea
            id={fieldId(field.key)}
            className="aud-input"
            style={field.minHeight ? { minHeight: field.minHeight } : undefined}
            value={String(data[field.key] ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
          />
        </div>
      );

    case "chips":
      return <ChipGroup field={field} data={data} set={set} />;

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

function ChipGroup({
  field,
  data,
  set,
}: {
  field: Extract<AuditField, { kind: "chips" }>;
  data: AuditData;
  set: SetValue;
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
        <span className={`aud-label${field.note ? " strong" : ""}`} id={labelId}>
          {field.label} {field.labelHint ? <i>{field.labelHint}</i> : null}
        </span>
      ) : null}
      {field.note ? <p className="aud-note">{field.note}</p> : null}
      <div className="aud-chips" role="group" aria-labelledby={labelId}>
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
        <label htmlFor={fieldId(field.key)}>{field.label}</label>
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
      <span className="aud-label">{label}</span>
      <div className="aud-sig">
        {signed ? null : <span>{placeholder}</span>}
        <canvas
          ref={ref}
          width={640}
          height={170}
          role="img"
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
