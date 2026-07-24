"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { sendEnquiry, track } from "@/lib/config";
import { WhatsAppIcon } from "@/components/icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MIN = 2;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000; // maxlength ≈1000 per spec

type Errors = { name?: string; email?: string; message?: string };

/**
 * /contact enquiry form island.
 * Client-side validation (submit + per-field blur), honeypot anti-spam,
 * submits to app/api/contact/route.ts — which emails the coach over SMTP and
 * auto-replies to the enquirer — then shows an in-place success state.
 * The server re-validates everything; the client checks are UX, not a gate.
 */
export default function ContactForm({
  waHref,
  responseTime,
  contactEmail,
}: {
  /** WA_CONTACT_LINK — prefilled wa.me deep link */
  waHref: string;
  /** RESPONSE_TIME constant, e.g. "within 24 hours" */
  responseTime: string;
  /** business EMAIL constant — fallback channel on the defensive error path */
  contactEmail: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function validateName(value: string): string | undefined {
    if (value.trim().length < NAME_MIN) {
      return "Please enter your name — at least 2 characters.";
    }
    return undefined;
  }

  function validateEmail(value: string): string | undefined {
    if (!value.trim()) {
      return "Please enter your email address.";
    }
    if (!EMAIL_RE.test(value.trim())) {
      return "That doesn't look like a valid email. Check it and try again.";
    }
    return undefined;
  }

  function validateMessage(value: string): string | undefined {
    if (value.trim().length < MESSAGE_MIN) {
      return "Give me a little more to go on — at least 10 characters.";
    }
    return undefined;
  }

  function setFieldError(field: keyof Errors, error: string | undefined) {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(false);

    const next: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(next);
    if (next.name || next.email || next.message) {
      // Do not submit — move focus to the first invalid field.
      if (next.name) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    // Honeypot tripped → silently "succeed" without calling any stubs.
    if (honeypot) {
      setDone(true);
      return;
    }

    setPending(true);
    try {
      const result = await sendEnquiry({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        source: "contact",
      });

      if (!result.ok) {
        // Server-side validation disagreed — show its messages on the fields.
        if (result.errors) {
          setErrors(result.errors);
          if (result.errors.name) nameRef.current?.focus();
          else if (result.errors.email) emailRef.current?.focus();
          else messageRef.current?.focus();
          return;
        }
        setSubmitError(true);
        return;
      }

      track("Lead", { source: "contact" });
      track("contact_form_submit", { source: "contact" }); // no-op stub
      setDone(true);
      // [review] Optional, off by default — owner may prefer redirecting to the
      // thank-you page instead of the in-place success state:
      // window.location.assign("/thank-you?type=enquiry");
    } catch {
      // sendEnquiry() already swallows network errors; this is belt-and-braces.
      setSubmitError(true);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div role="status" aria-live="polite">
        {/* decorative gold check that draws itself in (stroke-draw is no-preference-gated) */}
        <span
          aria-hidden="true"
          className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline-gold text-gold-500"
        >
          <svg
            viewBox="0 0 24 24"
            width={26}
            height={26}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" pathLength={60} className="stroke-draw" />
          </svg>
        </span>
        <h3 className="type-h3 text-primary">Message sent.</h3>
        <p className="type-body text-secondary mt-3">
          {`Thanks — I've got it. Expect a reply ${responseTime}. Want to move faster?`}
          {/* [review] */}
        </p>
        <div className="cta-stack mt-6">
          <Link href="/book" className="btn-gold">
            Book Your Transformation Audit
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
            aria-label="Chat with Aditya on WhatsApp now"
          >
            <WhatsAppIcon width={18} height={18} />
            Chat now
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot — hidden from real users; bots that fill it get a silent success. */}
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

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor={`${id}-name`} className="field-label">
            Full name
          </label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            type="text"
            name="name"
            autoComplete="name"
            required
            className="input-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setFieldError("name", validateName(name))}
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
          <label htmlFor={`${id}-email`} className="field-label">
            Email
          </label>
          <input
            ref={emailRef}
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            className="input-dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setFieldError("email", validateEmail(email))}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
          />
          <div aria-live="polite">
            {errors.email && (
              <p id={`${id}-email-error`} className="field-error">
                {errors.email}
              </p>
            )}
          </div>
          {/* DPDP-2023 consent — implemented as an inline notice (no checkbox
              friction; the act of submitting is the consent).
              [review — pick one: switch to a required #consent checkbox if the
              owner prefers explicit opt-in.] */}
          <p className="type-caption text-muted mt-3">
            By submitting, you agree we may use these details to reply to your
            enquiry, in line with our{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-secondary"
            >
              Privacy Policy
            </Link>
            . <em>We never sell your data.</em>
          </p>
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="field-label">
            Message
          </label>
          <textarea
            ref={messageRef}
            id={`${id}-message`}
            name="message"
            rows={4}
            maxLength={MESSAGE_MAX}
            required
            className="input-dark min-h-[120px] resize-y"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => setFieldError("message", validateMessage(message))}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message
                ? `${id}-message-hint ${id}-message-error`
                : `${id}-message-hint`
            }
          />
          <p id={`${id}-message-hint`} className="type-caption text-muted mt-1.5">
            {`${message.length}/${MESSAGE_MAX} characters`} {/* [review] — live character hint */}
          </p>
          <div aria-live="polite">
            {errors.message && (
              <p id={`${id}-message-error`} className="field-error">
                {errors.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-gold mt-7 w-full md:w-auto"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send Message"}
      </button>

      <div aria-live="polite">
        {submitError && (
          <p className="field-error mt-3">
            {"Something broke and your message didn't send. Reach me directly on "}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              WhatsApp
            </a>
            {" or email "}
            <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
              {contactEmail}
            </a>
            {" — both work."}
          </p>
        )}
      </div>
    </form>
  );
}
