"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { sendLeadMagnet, track } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Shared lead-magnet email capture (Home #blueprint, /tools guides, /blog index).
 * Validates client-side, then posts via sendLeadMagnet() → app/api/lead-magnet,
 * which emails the guide (PDF attached) to the subscriber and notifies the
 * admin. Swaps to a success state (no reload) with an on-screen PDF fallback
 * link. Fires track('Lead') — a no-op until analytics IDs exist.
 */
export default function LeadMagnetForm({
  source,
  resource,
  buttonLabel,
  pdfHref,
  pdfLabel = "Download the PDF",
  successTitle = "You're in." /* [review] */,
  successBody = "Check your inbox — we've also emailed it to you." /* [review] */,
  label = "Email",
  consent,
  children,
  className,
}: {
  /** analytics/source tag, e.g. "home-blueprint" */
  source: string;
  /** explicit resource id (else the server resolves from source) */
  resource?: string;
  buttonLabel: string;
  /** placeholder PDF constant (BLUEPRINT_PDF / SPLIT_PDF) */
  pdfHref?: string;
  pdfLabel?: string;
  successTitle?: string;
  successBody?: string;
  /** visible field label (tools spec: "Your email") */
  label?: string;
  /** consent line override — defaults to the Home #blueprint verbatim line */
  consent?: ReactNode;
  /** cross-sell links rendered inside the success state */
  children?: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const value = email.trim();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("That doesn't look like a valid email. Check it and try again.");
      return;
    }
    setError(null);

    // Honeypot tripped → show success without sending anything.
    if (honeypot) {
      setDone(true);
      return;
    }

    setPending(true);
    try {
      const result = await sendLeadMagnet({
        email: value,
        source,
        resource,
        pdfHref,
      });
      if (!result.ok) {
        if (result.errors?.email) {
          setError(result.errors.email);
        } else {
          setSubmitError(
            "Something went wrong sending your guide. Please try again in a moment.",
          );
        }
        return;
      }
      track("Lead", { source });
      track("lead_magnet_submit", { source });
      setDone(true);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        className={className}
        role="status"
        aria-live="polite"
        style={{ animation: "none" }}
      >
        <p className="type-h3 text-primary">{successTitle}</p>
        <p className="type-body text-secondary mt-2">{successBody}</p>
        {pdfHref && (
          <a
            href={pdfHref}
            className="btn-outline mt-5"
            download
            target="_blank"
            rel="noopener"
          >
            {pdfLabel}
          </a>
        )}
        {children && <div className="mt-5 flex flex-col gap-3">{children}</div>}
      </div>
    );
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      {/* Honeypot — hidden from real users; bots that fill it get silent success. */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={id} className="field-label">
            {label}
          </label>
          <input
            id={id}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="Your best email"
            className="input-dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        <button type="submit" className="btn-gold" disabled={pending}>
          {pending ? "Sending…" : buttonLabel}
        </button>
      </div>
      <div aria-live="polite">
        {error && (
          <p id={`${id}-error`} className="field-error">
            {error}
          </p>
        )}
        {submitError && <p className="field-error">{submitError}</p>}
      </div>
      {consent ?? (
        <p className="type-caption text-muted mt-3">
          By entering your email you agree to receive the free blueprint and
          occasional coaching emails. No spam. Unsubscribe anytime. See our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-secondary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
