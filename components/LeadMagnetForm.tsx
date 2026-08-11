"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { sendLeadMagnet, track, type LeadMagnetErrors } from "@/lib/config";

type FieldErrors = LeadMagnetErrors;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Digits only, after stripping spaces/dashes/brackets — 10 (IN local) to 15 (E.164 max). */
const PHONE_DIGITS_RE = /^\d{10,15}$/;

function phoneDigits(value: string): string {
  return value.replace(/[^\d]/g, "").replace(/^0+/, "");
}

/**
 * Shared lead-magnet capture — name, phone and email (Home #blueprint, /tools
 * guides, /blog index). All three are required so every lead is contactable and
 * traceable. Validates client-side, then posts via sendLeadMagnet() →
 * app/api/lead-magnet, which emails the guide (PDF attached) to the subscriber
 * and notifies the admin with the full contact record. Swaps to a success state
 * (no reload) with an on-screen PDF fallback link. Fires track('Lead') — a
 * no-op until analytics IDs exist.
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
  nameLabel = "Name",
  phoneLabel = "Phone number",
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
  /** visible field label for the email input (tools spec: "Your email") */
  label?: string;
  /** visible field label for the name input */
  nameLabel?: string;
  /** visible field label for the phone input */
  phoneLabel?: string;
  /** consent line override — defaults to the Home #blueprint verbatim line */
  consent?: ReactNode;
  /** cross-sell links rendered inside the success state */
  children?: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const nameValue = name.trim();
    const phoneValue = phone.trim();
    const emailValue = email.trim();
    const digits = phoneDigits(phoneValue);

    const next: FieldErrors = {};
    if (!nameValue) {
      next.name = "Please enter your name.";
    } else if (nameValue.length < 2) {
      next.name = "Please enter your full name.";
    }
    if (!phoneValue) {
      next.phone = "Please enter your phone number.";
    } else if (!PHONE_DIGITS_RE.test(digits)) {
      next.phone = "That doesn't look like a valid phone number.";
    }
    if (!emailValue) {
      next.email = "Please enter your email address.";
    } else if (!EMAIL_RE.test(emailValue)) {
      next.email =
        "That doesn't look like a valid email. Check it and try again.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Honeypot tripped → show success without sending anything.
    if (honeypot) {
      setDone(true);
      return;
    }

    setPending(true);
    try {
      const result = await sendLeadMagnet({
        name: nameValue,
        phone: phoneValue,
        email: emailValue,
        source,
        resource,
        pdfHref,
      });
      if (!result.ok) {
        if (result.errors && Object.keys(result.errors).length > 0) {
          setErrors(result.errors);
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

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="field-label">
              {nameLabel}
            </label>
            <input
              id={`${id}-name`}
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Your full name"
              className="input-dark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
            />
            <div aria-live="polite">
              {errors.name && (
                <p id={`${id}-name-error`} className="field-error">
                  {errors.name}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-phone`} className="field-label">
              {phoneLabel}
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="10-digit mobile"
              className="input-dark"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            />
            <div aria-live="polite">
              {errors.phone && (
                <p id={`${id}-phone-error`} className="field-error">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
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
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${id}-error` : undefined}
            />
          </div>
          <button type="submit" className="btn-gold" disabled={pending}>
            {pending ? "Sending…" : buttonLabel}
          </button>
        </div>
      </div>
      <div aria-live="polite">
        {errors.email && (
          <p id={`${id}-error`} className="field-error">
            {errors.email}
          </p>
        )}
        {submitError && <p className="field-error">{submitError}</p>}
      </div>
      {consent ?? (
        <p className="type-caption text-muted mt-3">
          By submitting your details you agree to receive the free blueprint and
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
