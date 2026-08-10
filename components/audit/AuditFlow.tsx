"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUDIT_STEPS,
  LAST_STEP,
  NUMBERED_STEPS,
  flattenFields,
  type AuditData,
  type AuditValue,
} from "@/lib/audit/schema";
import { auditFileName, buildAuditPdf, downloadPdf, toBase64 } from "@/lib/audit/pdf";
import { BASE_PATH, IG_URL, track, waLink } from "@/lib/config";
import Field from "./Fields";
import SectionIcon, {
  ArrowLeft,
  ArrowRight,
  CameraIcon,
  ClockIcon,
  DownloadIcon,
  LockIcon,
} from "./AuditIcons";
import { AUDIT_CSS } from "./styles";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";

/** localStorage slot. Bump the suffix if the question keys ever change shape. */
const STORAGE_KEY = "aditya_audit_v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const WA_FALLBACK = waLink(
  "Hi Aditya, I finished the Transformation Audit. Sending the PDF across here.",
);

/** Shown at the foot of every section — the client is handing over health data. */
const PRIVACY_NOTE =
  "Your answers stay private. Only Aditya reads them, and he uses them only to plan your coaching. They are never shared or sold.";

type SaveState = "idle" | "saving" | "saved" | "error";
type Status = { kind: "ok" | "partial" | "error"; message: React.ReactNode } | null;

/**
 * Move the caret to the first thing the client has to fix. Chip groups are
 * buttons, not inputs, so fall back to scrolling their label into view.
 */
function focusFirstError(errors: Record<string, string>) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  requestAnimationFrame(() => {
    const control = document.getElementById(`aud-${first}`);
    if (control instanceof HTMLElement) {
      control.scrollIntoView({ behavior: "smooth", block: "center" });
      control.focus({ preventScroll: true });
      return;
    }
    document
      .getElementById(`aud-${first}-label`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function AuditFlow() {
  const [data, setData] = useState<AuditData>({});
  const [step, setStep] = useState(0);
  const [resumeTo, setResumeTo] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const topRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ---- persistence -------------------------------------------------------
  // Reading localStorage during render would desync the server HTML, so the
  // first paint is always the empty cover and the saved draft arrives after —
  // deferred a frame, matching CookieBanner.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let restored: AuditData = { signDate: today() };
      let at = 0;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { data?: AuditData; step?: number };
          restored = saved.data ?? {};
          if (!restored.signDate) restored.signDate = today();
          at = Number(saved.step ?? 0);
        }
      } catch {
        // storage unavailable or corrupt → start clean
      }
      setData(restored);
      if (at > 0 && at <= LAST_STEP) setResumeTo(at);
      setLoaded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      // Only report the outcome if an edit put us in "saving" — the write that
      // follows the initial load must not flash "✓ Saved" at an untouched form.
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step, ts: Date.now() }));
        setSaveState((s) => (s === "saving" ? "saved" : s));
      } catch {
        setSaveState((s) => (s === "saving" ? "error" : s));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [data, step, loaded]);

  const set = useCallback((key: string, value: AuditValue | undefined) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    setSaveState("saving");
  }, []);

  /** Deliberately does not clear `status` — submit() navigates back to the
   *  section with the missing answers and the banner has to survive the jump. */
  const goTo = useCallback((next: number) => {
    setStep(next);
    setSaveState("saving");
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const navigate = useCallback(
    (next: number) => {
      setStatus(null);
      goTo(next);
    },
    [goTo],
  );

  const reset = () => {
    if (!window.confirm("Clear this form and start over? This cannot be undone.")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode — the in-memory reset below still applies */
    }
    setData({ signDate: today() });
    setResumeTo(0);
    setDone(false);
    setStatus(null);
    setErrors({});
    setStep(0);
  };

  // ---- cover photo -------------------------------------------------------
  const onPhoto = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 440;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        set("photo", canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    input.value = "";
  };

  // ---- chrome ------------------------------------------------------------
  const current = AUDIT_STEPS.find((s) => s.n === step);
  const progress =
    step === 0 ? 0 : step <= NUMBERED_STEPS ? (step / NUMBERED_STEPS) * 100 : 100;
  const counter =
    step === 0
      ? "Welcome"
      : step <= NUMBERED_STEPS
        ? `Section ${String(step).padStart(2, "0")} / ${NUMBERED_STEPS}`
        : "Final · Commitment";

  // ---- PDF ---------------------------------------------------------------
  const makePdf = async (submittedAt: Date) => {
    const bytes = await buildAuditPdf(data, { submittedAt: submittedAt.toISOString() });
    return { bytes, fileName: auditFileName(data, submittedAt) };
  };

  const savePdf = async () => {
    setBusy(true);
    try {
      const { bytes, fileName } = await makePdf(new Date());
      downloadPdf(bytes, fileName);
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be built. Try again." });
    } finally {
      setBusy(false);
    }
  };

  /**
   * The * marks are guidance, not a gate — nothing blocks Continue, and a
   * client can walk the whole audit and come back. Only the two answers the
   * coach cannot act without are enforced, and only at the point of sending.
   */
  const submit = async () => {
    const name = String(data.fullName ?? "").trim();
    const email = String(data.email ?? "").trim();
    const found: Record<string, string> = {};
    if (name.length < 2) found.fullName = "I need your name to open your file.";
    if (!EMAIL_RE.test(email)) found.email = "I need a working email to send your plan to.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      goTo(1);
      setStatus({
        kind: "error",
        message: "Before this can be sent, Section 01 needs your name and a working email.",
      });
      focusFirstError(found);
      return;
    }

    setBusy(true);
    setStatus(null);
    const submittedAt = new Date();
    let fileName = "";
    try {
      const built = await makePdf(submittedAt);
      fileName = built.fileName;
      downloadPdf(built.bytes, fileName);

      // basePath is not applied to fetch() by Next — prefix it manually.
      const res = await fetch(`${BASE_PATH}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone: String(data.phone ?? "").trim(),
          instagram: String(data.instagram ?? "").trim(),
          goals: Array.isArray(data.goals) ? data.goals : [],
          fileName,
          submittedAt: submittedAt.toISOString(),
          pdf: toBase64(built.bytes),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (res.ok && body.ok !== false) {
        track("AuditSubmitted", { source: "audit" });
        setDone(true);
        setStatus(null);
        requestAnimationFrame(() => {
          topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else {
        setStatus({
          kind: "partial",
          message: (
            <>
              Your PDF downloaded, but it did not reach Aditya
              {body.error ? ` (${body.error})` : ""}. Send{" "}
              <strong>{fileName}</strong> to him on{" "}
              <a href={WA_FALLBACK} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              instead.
            </>
          ),
        });
      }
    } catch {
      setStatus({
        kind: "partial",
        message: (
          <>
            {fileName ? "Your PDF downloaded, but the" : "The"} connection dropped before it
            reached Aditya. Send the file to him on{" "}
            <a href={WA_FALLBACK} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            instead.
          </>
        ),
      });
    } finally {
      setBusy(false);
    }
  };

  const photo = typeof data.photo === "string" ? data.photo : "";
  const hasDraft = resumeTo > 0 || Object.keys(data).length > 1;

  return (
    <div className="aud">
      <style dangerouslySetInnerHTML={{ __html: AUDIT_CSS }} />
      <div ref={topRef} />

      <div className="aud-bar">
        <div className="aud-bar-inner">
          {/* The site header directly above already carries the wordmark, so
              this bar only shows what changes as the audit is filled in. */}
          <span className="aud-counter">{counter}</span>
          <div className="aud-bar-right">
            {saveState !== "idle" ? (
              <span className="aud-saved" data-state={saveState} aria-live="polite">
                {saveState === "saving"
                  ? "Saving…"
                  : saveState === "saved"
                    ? "✓ Saved"
                    : "Save failed"}
              </span>
            ) : null}
            {step > 0 && !done ? (
              <button
                type="button"
                className="aud-btn small"
                onClick={savePdf}
                disabled={busy}
              >
                <DownloadIcon size={15} />
                Save PDF
              </button>
            ) : null}
          </div>
        </div>
        <div className="aud-track">
          <div
            className="aud-fill"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Audit progress"
          />
        </div>
      </div>

      <div className="aud-main">
        {done ? (
          <section className="aud-card aud-done">
            <div className="aud-eyebrow">Audit received</div>
            <h1 className="aud-title">Your audit is with Aditya.</h1>
            <p className="aud-quote">
              The PDF is saved on your device. The same file is now in his inbox.
            </p>
            <p className="aud-autosave" style={{ marginTop: 26 }}>
              He reads every audit himself. Expect a reply within 24 hours.
            </p>
            <div className="aud-nav" style={{ justifyContent: "center" }}>
              <Link className="aud-btn" href="/book">
                Book a Consultation
                <ArrowRight />
              </Link>
              <button type="button" className="aud-btn ghost" onClick={savePdf} disabled={busy}>
                <DownloadIcon />
                Save PDF
              </button>
            </div>
            {status ? (
              <p className={`aud-status ${status.kind}`} role="status">
                {status.message}
              </p>
            ) : null}
            <p className="aud-autosave" style={{ marginTop: 22 }}>
              Sharing this device?{" "}
              <button type="button" className="aud-linkbtn" onClick={reset}>
                Clear your answers
              </button>
            </p>
          </section>
        ) : step === 0 ? (
          <section className="aud-cover">
            <div className="aud-eyebrow">The Transformation Audit</div>
            <h1 className="aud-title">Lifestyle &amp; Personality Transformation Audit</h1>
            <p className="aud-quote">
              &ldquo;The better I understand you, the better I can transform you.&rdquo;
            </p>

            <div className="aud-photo-block">
              <button
                type="button"
                className="aud-photo"
                data-has={photo ? "1" : undefined}
                style={photo ? { backgroundImage: `url(${photo})` } : undefined}
                onClick={() => fileRef.current?.click()}
                aria-label={photo ? "Change your photo" : "Add your photo"}
              >
                {photo ? null : (
                  <span>
                    <CameraIcon />
                    Add photo
                  </span>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPhoto(e.currentTarget)}
              />
              {photo ? (
                <button
                  type="button"
                  className="aud-linkbtn"
                  onClick={() => set("photo", undefined)}
                >
                  Remove photo
                </button>
              ) : null}
            </div>

            <div className="aud-meta">
              <ClockIcon />
              <span className="aud-meta-label">Estimated time</span>
              <span className="aud-meta-div" />
              <span className="aud-meta-val">15–20 minutes</span>
            </div>

            <div>
              <button
                type="button"
                className="aud-btn begin"
                onClick={() => navigate(resumeTo > 0 ? resumeTo : 1)}
              >
                {resumeTo > 0 ? "Resume the audit" : "Begin the audit"}
                <ArrowRight />
              </button>
            </div>
            {resumeTo > 0 ? (
              <p className="aud-resume">
                Welcome back — your answers are saved. Pick up where you left off.
              </p>
            ) : null}
            <p className="aud-autosave">Your progress saves automatically on this device.</p>
            {hasDraft ? (
              <div>
                <button type="button" className="aud-linkbtn" onClick={reset}>
                  Start over
                </button>
              </div>
            ) : null}

            <div className="aud-cover-foot">
              <b>Aditya Kumar Upadhyay</b>
              <span className="aud-dot" />
              <span>Lifestyle &amp; Personality Coach</span>
              <span className="aud-dot" />
              <a href={IG_URL} target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
                @adityakumarupadhyay_
              </a>
              <span className="aud-dot" />
              <a href={WA_FALLBACK} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </section>
        ) : current ? (
          <>
            {/* The visible title lives on the cover; once the client is inside
                the form the page still needs exactly one h1. */}
            <h1 className="aud-sr">Lifestyle &amp; Personality Transformation Audit</h1>
            <section className="aud-card" aria-labelledby={`aud-step-${current.n}`}>
              <div className="aud-head">
                <div className="aud-badge">
                  <SectionIcon name={current.icon} />
                </div>
                <div>
                  <div className="aud-sec-eyebrow">{current.eyebrow}</div>
                  <h2 className="aud-h2" id={`aud-step-${current.n}`}>
                    {current.title}
                  </h2>
                </div>
              </div>
              <div className="aud-rule" />
              <div className="aud-fields">
                {flattenFields(current.fields, data).some(
                  (f) => "required" in f && f.required,
                ) ? (
                  <p className="aud-legend">
                    <b aria-hidden="true">*</b> Required — everything else is optional.
                  </p>
                ) : null}
                {current.fields.map((field, i) => (
                  <Field key={i} field={field} data={data} set={set} errors={errors} />
                ))}
              </div>
              <p className="aud-privacy">
                <LockIcon />
                <span>{PRIVACY_NOTE}</span>
              </p>
            </section>

            {step === LAST_STEP ? (
              <div className="aud-submit">
                <h3>Send it to Aditya</h3>
                <p>
                  One button. Your finished audit saves to your device as a PDF, and the same
                  file goes straight to Aditya&apos;s inbox.
                </p>
                <button type="button" className="aud-btn" onClick={submit} disabled={busy}>
                  <DownloadIcon />
                  {busy ? "Sending…" : "Submit the audit"}
                </button>
              </div>
            ) : null}

            {status ? (
              <p className={`aud-status ${status.kind}`} role="status">
                {status.message}
              </p>
            ) : null}

            <div className="aud-nav">
              <button type="button" className="aud-btn ghost" onClick={() => navigate(step - 1)}>
                <ArrowLeft />
                Back
              </button>
              <div className="spacer" />
              {step < LAST_STEP ? (
                <button type="button" className="aud-btn" onClick={() => navigate(step + 1)}>
                  {step === NUMBERED_STEPS ? "Review & sign" : "Continue"}
                  <ArrowRight />
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
