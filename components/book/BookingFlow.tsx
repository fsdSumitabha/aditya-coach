"use client";

/**
 * /book — 3-state conversion machine (client island).
 *
 * STATE A (pre-payment):  Checkout (§1) + intake form + payment block,
 *                         then the persuasion sections (§2–§8) passed in as
 *                         children from app/book/page.tsx.
 * STATE B (post-payment): Success banner (§6) + optional intake (§5).
 * STATE C (finished):     Banner persists + compact "You're all set".
 *
 * Only one state is visible at a time; the others carry hidden + aria-hidden.
 * The container reserves min-height so state swaps cause no layout shift.
 * Focus moves to the new state's heading on every transition; changes are
 * announced via a visually-hidden aria-live="assertive" region.
 */

/* ==========================================================================
   PHASE-2 STUB CHECKLIST — every seam below is a Phase-2 no-op stub that
   lives in @/lib/config (imported, never redefined). Phase 1 ships fully
   working UI on these stubs:
   [ ] REAL GATEWAY        → payment is currently a manual UPI hand-off
                             (components/book/UpiPayPanel + UPI in lib/legal).
                             Nothing is verified: the visitor asserts he paid
                             and hands back a UTR. When Razorpay is live, call
                             startPayment() from lib/config here instead and
                             verify the signature server-side.
   [x] BOOKING DELIVERY    → LIVE. sendBooking() (lib/config) POSTs to
                             app/api/booking, which emails Aditya over SMTP
                             with the UTR in the subject line. This mail is
                             the ONLY record a booking leaves — there is no
                             CRM. The "paid" stage BLOCKS the success screen
                             on delivery; the "intake" stage does not.
   [ ] track('Purchase',…) → real analytics ID + Purchase conversion event
                             (value 999, currency INR).
   [ ] /thank-you?type=booking redirect — wired via BOOKING.THANKYOU_URL but
       intentionally left as a COMMENT in finishIntake() below; keep the
       ?type=booking param so /thank-you can branch booking vs lead-magnet.
   [ ] COACH_WHATSAPP real number (align with global FAB) — from lib/config.
   ========================================================================== */

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import {
  COACH_WHATSAPP,
  sendBooking,
  track,
  waLink,
} from "@/lib/config";
import { CONSULT_INCLUDES, LEGAL, UPI } from "@/lib/legal";
import UpiPayPanel from "@/components/book/UpiPayPanel";

// ==== BOOKING CONFIG (swap in Phase 2) ====
const BOOKING = {
  PRICE_INR: LEGAL.CONSULT_PRICE_INR, // consultation fee — single source of truth in lib/legal.ts
  CURRENCY: "INR",
  DURATION_MIN: 45,
  COACH_WHATSAPP, // [review] Aditya's WhatsApp (same number as global FAB — set once in lib/config)
  REDIRECT_ON_FINISH: false, // Phase-1 toggle for the /thank-you redirect (wired in finishIntake) — false ⇒ STATE C stands alone
  THANKYOU_URL: "/thank-you?type=booking",
};

// Page-level JSON-LD (Service + BreadcrumbList) is emitted by
// app/book/page.tsx (Server Component) — not from this island.

// ---------------------------------------------------------------------------
// §1 checkout summary — two lines. The earlier five restated what /programs
// and §3 "What You Get" already say, so the summary now carries only the
// promise a man needs at the point of payment. The Blueprint and the gift
// card are not dropped from the page: the §4 payment block below states both
// from CONSULT_INCLUDES.
const CHECKOUT_POINTS = [
  "We audit your lifestyle, health, and presence",
  "You leave with exactly what to fix first",
];

const GOAL_OPTIONS = [
  "Fat loss",
  "Muscle gain",
  "Energy",
  "Confidence",
  "Overall lifestyle change",
];

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// §3 validation (JS owns validation — <form noValidate>)
// ---------------------------------------------------------------------------

type FieldName = "name" | "phone" | "email" | "age" | "goal";
const FIELD_ORDER: FieldName[] = ["name", "phone", "email", "age", "goal"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // single @, valid domain, no spaces

function validateField(field: FieldName, raw: string): string | null {
  const v = raw.trim();
  switch (field) {
    case "name":
      // required; ≥ 2 chars; not digits-only
      if (v.length < 2 || /^[\d\s]+$/.test(v)) return "Please enter your full name.";
      return null;
    case "phone": {
      // strip spaces/dashes; optional leading +; 10–15 digits;
      // India default: a bare 10-digit number must start 6–9
      const cleaned = v.replace(/[\s-]/g, "");
      const m = /^\+?(\d{10,15})$/.exec(cleaned);
      const ok =
        !!m &&
        (cleaned.startsWith("+") || m[1].length !== 10 || /^[6-9]/.test(m[1]));
      return ok
        ? null
        : "Enter a valid WhatsApp number (10 digits, or +country code).";
    }
    case "email":
      return EMAIL_RE.test(v) ? null : "Enter a valid email address.";
    case "age": {
      const n = Number(v);
      if (!v || !Number.isInteger(n) || n < 18 || n > 99)
        return "Enter your age (18–99)."; /* [review] confirm minimum age 18 */
      return null;
    }
    case "goal":
      return v ? null : "Select your main goal.";
  }
}

/**
 * UPI reference (UTR) check. Deliberately loose: the canonical UTR is 12
 * digits, but banks and PSPs hand back their own reference formats and a
 * strict rule would block real payers. This only has to stop empty and
 * obviously-junk submissions — Aditya verifies the payment for real.
 */
function validateReference(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "Enter the UPI reference from your payment app.";
  if (!/^[A-Za-z0-9]{6,25}$/.test(v))
    return "That doesn't look like a UPI reference — 6–25 letters or numbers.";
  return null;
}

// ---------------------------------------------------------------------------
// Enter animation helper — reuses the global .reveal / .is-in classes so state
// entrances are opacity/translateY only and degrade under reduced motion
// (globals.css zeroes transition durations for prefers-reduced-motion).
// Classes are applied straight to the DOM node (external system) so no state
// updates happen inside the effect.
// ---------------------------------------------------------------------------

function useEnterAnimation(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.classList.add("reveal"); // hide only now that we can animate back in
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => el.classList.add("is-in"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      el.classList.remove("reveal", "is-in");
    };
  }, [active]);
  return ref;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type MachineState = "A" | "B" | "C";

export default function BookingFlow({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MachineState>("A");

  // §3 pre-payment intake values + errors
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    phone: "",
    email: "",
    age: "",
    goal: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const fieldRefs = useRef<
    Record<FieldName, HTMLInputElement | HTMLSelectElement | null>
  >({ name: null, phone: null, email: null, age: null, goal: null });

  // §4 payment state. payStep is the gateway hand-off: "details" shows the
  // form's Continue button, "pay" swaps in the UPI panel. Nothing verifies the
  // payment, so "confirming" is only the button's busy state.
  const [payStep, setPayStep] = useState<"details" | "pay">("details");
  const [reference, setReference] = useState("");
  const [refError, setRefError] = useState<string | undefined>();
  const [confirming, setConfirming] = useState(false);
  // The booking mail failed. Money has already moved, so this is not a
  // validation error — it is a recovery path (see UpiPayPanel).
  const [confirmFailed, setConfirmFailed] = useState(false);

  // §5 post-payment intake (all optional)
  const [intake, setIntake] = useState({
    occupation: "",
    lifestyle: "",
    training: "",
    blocker: "",
    success: "",
  });

  // a11y: live announcements + focus targets
  const [liveMsg, setLiveMsg] = useState("");
  const bannerHeadingRef = useRef<HTMLHeadingElement>(null);
  const finishedHeadingRef = useRef<HTMLHeadingElement>(null);

  // Enter animations (opacity/transform only, reduced-motion safe)
  const postPayRef = useEnterAnimation(state !== "A");
  const finishedRef = useEnterAnimation(state === "C");

  // Focus management on every state transition (DOM only — the aria-live
  // announcement text is set in the event handlers, not here)
  useEffect(() => {
    if (state === "A") return;
    const target =
      state === "B" ? bannerHeadingRef.current : finishedHeadingRef.current;
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: state === "B" ? "start" : "center",
      });
    }
  }, [state]);

  // Hand-off to payment: bring the panel into view once it has rendered.
  // Runs on the step change, not inside the submit handler, because the panel
  // does not exist in the DOM until React has committed the new step.
  useEffect(() => {
    if (payStep !== "pay") return;
    document.getElementById("pay")?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [payStep]);

  function setValue(field: FieldName) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const next = e.target.value;
      setValues((v) => ({ ...v, [field]: next }));
      // clear a field's error on input
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };
  }

  function blurValidate(field: FieldName) {
    return () => {
      const err = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: err ?? undefined }));
    };
  }

  function scrollToIntake(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("intake")?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  // §4 step 1 — the form's submit button is the hand-off TO payment, not the
  // payment itself. Validate, then swap the button for the UPI panel.
  //
  // Enter inside the reference field also fires this, so once we are already
  // on the pay step it forwards to confirmPaid() rather than re-validating
  // details the visitor has moved past.
  function handlePaySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (payStep === "pay") {
      confirmPaid();
      return;
    }

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const f of FIELD_ORDER) {
      const err = validateField(f, values[f]);
      if (err) nextErrors[f] = err;
    }
    setErrors(nextErrors);
    const firstBad = FIELD_ORDER.find((f) => nextErrors[f]);
    if (firstBad) {
      fieldRefs.current[firstBad]?.focus(); // focus the FIRST invalid field
      return;
    }

    // PHASE 2 STUB — track() is a no-op until analytics IDs exist.
    track("InitiateCheckout", {
      value: BOOKING.PRICE_INR,
      currency: BOOKING.CURRENCY,
    });
    setPayStep("pay"); // the effect below scrolls the panel into view
  }

  // §4 step 2 — the visitor asserts he paid and hands back a UTR.
  //
  // NOTHING HERE VERIFIES THE PAYMENT. There is no gateway, no webhook and no
  // signature: this only records what he says and routes it to Aditya, who
  // checks it against the PhonePe account by hand. Every user-facing string
  // downstream is written to be true under that constraint — see the STATE B
  // banner. Do not upgrade this into a claim that money arrived.
  async function confirmPaid() {
    if (confirming) return; // prevent double-submit
    const err = validateReference(reference);
    setRefError(err ?? undefined);
    if (err) {
      document.getElementById("bk-upiref")?.focus();
      return;
    }

    setConfirming(true);
    setConfirmFailed(false);

    // BLOCKING ON PURPOSE. This mail is the only record the booking leaves —
    // no CRM, no gateway webhook. Money has already moved by the time we get
    // here, so showing the success screen before we know Aditya was told
    // would strand a paid customer as an unattributable ₹999 in PhonePe.
    const res = await sendBooking({
      stage: "paid",
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      age: values.age,
      goal: values.goal,
      upiReference: reference.trim(),
      submittedAt: new Date().toISOString(),
    });

    if (!res.ok) {
      // His money is gone whatever happens next, so the recovery path has to
      // be real: the WhatsApp fallback below carries his UTR.
      setConfirmFailed(true);
      setConfirming(false);
      setLiveMsg(
        "We couldn't record your booking. Your payment is safe — send Aditya the reference on WhatsApp.",
      );
      return;
    }

    // PHASE 2 STUB — track() is a no-op until analytics IDs exist. This fires
    // on the CLAIM of payment, so treat the number as unverified in analytics.
    track("Purchase", {
      value: BOOKING.PRICE_INR,
      currency: BOOKING.CURRENCY,
    });
    setState("B");
    setLiveMsg(
      "Payment details received. Aditya will verify your payment and confirm your slot on WhatsApp within 24 hours.",
    );
    setConfirming(false);
  }

  // §5 — both buttons proceed to STATE C
  function finishIntake() {
    // NOT blocking, unlike confirmPaid(): the booking itself is already
    // recorded by this point, so losing these optional answers costs a few
    // questions on the call, not a booking. Never make the man wait for it.
    void sendBooking({
      stage: "intake",
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      age: values.age,
      goal: values.goal,
      upiReference: reference.trim(),
      submittedAt: new Date().toISOString(),
      ...intake,
    });
    setState("C");
    setLiveMsg("You're all set. See you on WhatsApp."); /* [review] */
    // OPTIONAL REDIRECT — functional toggle per spec STATE C. Disabled in
    // Phase 1 (STATE C stands alone as the final confirmation); flip
    // BOOKING.REDIRECT_ON_FINISH to true to send users to
    // /thank-you?type=booking instead.
    if (BOOKING.REDIRECT_ON_FINISH) window.location.assign(BOOKING.THANKYOU_URL);
  }

  function handleIntakeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    finishIntake();
  }

 function upiLink(amount: number) {
  const params = new URLSearchParams({
    pa: UPI.ID,
    pn: UPI.PAYEE_NAME,
    am: amount.toFixed(2),
    cu: "INR",
  });

  return `upi://pay?${params.toString()}`;
}

  const stateA = state === "A";
  // Heading-tree integrity: STATE A's hero owns the page h1; once the B/C
  // wrapper becomes the visible content its banner heading must take over as
  // the single exposed h1 (the A wrapper is hidden + aria-hidden). Prerendered
  // HTML (STATE A) still contains exactly one h1.
  const BannerHeading = stateA ? "h2" : ("h1" as const);

  return (
    /* min-height reserved so state swaps cause no layout shift (CLS < 0.1) */
    <div id="book" className="min-h-[640px]">
      {/* visually-hidden announcer for state changes */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {liveMsg}
      </div>

      {/* ================= STATE A — PRE-PAYMENT ================= */}
      <div hidden={!stateA} aria-hidden={!stateA}>
        {/* The decision band (checkout → intake → payment) is wrapped so a
            single gold thread can stitch it down the left gutter as one
            continuous line from the price to the pay button. */}
        <div className="relative">
          {/* ---------- §1 CHECKOUT — THE DECISION, FIRST ----------
               This page takes ad traffic. A man who is already convinced must
               be able to act without scrolling, so the offer, the price, the
               fee-credit promise and the WhatsApp button all sit above the
               fold. Everything below §1 exists for the man who isn't. */}
          <section
            id="checkout"
            className="section aurora grain relative overflow-hidden scroll-mt-24"
          >
            <div className="container-site">
              <div className="mx-auto max-w-[680px]">
                <p className="eyebrow text-center">STEP ONE{/* [review] */}</p>
                {/* Hero H1 is NEVER animated — paints at final state frame 1.
                    [review] Reframed from "Book Your Transformation Audit." per
                    the 2026-08-25 direction: this is the first step of a
                    transformation, not an appointment booking. */}
                <h1 className="type-h1 text-primary mt-3 text-center">
                  The Transformation Audit.
                </h1>
                <Reveal delayMs={70}>
                  {/* [review] */}
                  <p className="type-lead text-secondary mt-5 text-center">
                    Not an appointment. The 45 minutes where you find out what
                    is actually holding you back — and which path is yours.
                  </p>
                </Reveal>

                {/* ---- The offer card ---- */}
                <Reveal
                  delayMs={140}
                  style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
                >
                  <div className="card card-featured spot mt-9">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className="type-h3 text-primary">
                        Transformation Audit
                      </h2>
                      <p className="font-display text-gold-grad text-[clamp(2rem,3.4vw,2.5rem)] leading-none">
                        {LEGAL.CONSULT_PRICE}
                      </p>
                    </div>
                    <p className="type-small text-muted mt-1">
                      45 minutes · one to one on WhatsApp
                    </p>

                    <div className="gold-line my-6" aria-hidden="true" />

                    <ul className="grid gap-3">
                      {CHECKOUT_POINTS.map((point) => (
                        <li
                          key={point}
                          className="type-small text-secondary flex gap-3"
                        >
                          <CheckIcon
                            aria-hidden="true"
                            className="text-gold-500 mt-1 h-4 w-4 shrink-0"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* The convinced man's exit. WhatsApp first, payment below
                        — men who want to talk to a person before paying are
                        the majority of this page's traffic. */}
                    <a
                        href={upiLink(LEGAL.CONSULT_PRICE_INR)}
                        className="btn-gold mt-4 w-full"
                    >
                        Pay ₹999 via UPI
                    </a>

                    {/* The most important line on the page. Confirmed copy —
                        lives in lib/legal.ts (CONSULT_INCLUDES), never here. */}
                    <p className="type-small text-gold-300 border-hairline-gold mt-6 border-l pl-4">
                      {CONSULT_INCLUDES.CREDIT}
                    </p>

                    <p className="mt-6 text-center">
                      <a
                        href="#intake"
                        onClick={scrollToIntake}
                        className="link-draw type-small text-secondary hover:text-primary inline-flex min-h-[48px] items-center transition-colors"
                      >
                        Or pay online and book your slot ↓
                      </a>
                    </p>
                  </div>
                </Reveal>

                {/* [review] micro-trust row */}
                <Reveal delayMs={220}>
                  <ul className="type-small text-muted mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <li>
                      <span aria-hidden="true">🔒</span> Secure payment
                    </li>
                    <li>
                      <span aria-hidden="true">📱</span> On WhatsApp
                    </li>
                    <li>
                      <span aria-hidden="true">↩︎</span>{" "}
                      <Link
                        href="/refund"
                        className="underline underline-offset-2 hover:text-secondary"
                      >
                        Read the refund policy
                      </Link>
                    </li>
                  </ul>
                </Reveal>
              </div>
            </div>
          </section>

        {/* ---------- §3 INTAKE FORM + §4 PAYMENT (one continuous form —
             the Pay button runs §3 validation first) ---------- */}
        <section id="intake" className="section scroll-mt-24">
          <div className="container-site">
            <div className="mx-auto max-w-[560px]">
              <SplitHeading
                as="h2"
                text="First, the basics."
                className="type-h2 text-primary"
              />
              <Reveal index={1}>
                {/* [review] */}
                <p className="type-body mt-3 text-secondary">
                  Five quick fields, then payment. This is how I prep before we
                  talk.
                </p>
              </Reveal>

              <form noValidate onSubmit={handlePaySubmit} className="mt-8">
                <Reveal index={2}>
                  {/* intake card: gold hairline top edge + cursor spotlight */}
                  <div className="card spot">
                    <div
                      aria-hidden="true"
                      className="gold-line -mx-6 -mt-6 mb-6 md:-mx-8 md:-mt-8 md:mb-8"
                    />
                    <div className="grid gap-5">
                  {/* 1 — Full name */}
                  <div>
                    <label htmlFor="bk-name" className="field-label">
                      Full name
                    </label>
                    <input
                      id="bk-name"
                      ref={(el) => {
                        fieldRefs.current.name = el;
                      }}
                      type="text"
                      name="name"
                      autoComplete="name"
                      className="input-dark"
                      value={values.name}
                      onChange={setValue("name")}
                      onBlur={blurValidate("name")}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby="bk-name-error"
                    />
                    <p
                      id="bk-name-error"
                      className="field-error"
                      aria-live="polite"
                    >
                      {errors.name}
                    </p>
                  </div>

                  {/* 2 — WhatsApp number (+91 prefix affordance) */}
                  <div>
                    <label htmlFor="bk-phone" className="field-label">
                      WhatsApp number
                    </label>
                    <input
                      id="bk-phone"
                      ref={(el) => {
                        fieldRefs.current.phone = el;
                      }}
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91"
                      className="input-dark"
                      value={values.phone}
                      onChange={setValue("phone")}
                      onBlur={blurValidate("phone")}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby="bk-phone-hint bk-phone-error"
                    />
                    {/* [review] */}
                    <p id="bk-phone-hint" className="type-caption mt-2 text-muted">
                      +91 by default — 10 digits, or include your country code.
                    </p>
                    <p
                      id="bk-phone-error"
                      className="field-error"
                      aria-live="polite"
                    >
                      {errors.phone}
                    </p>
                  </div>

                  {/* 3 — Email + DPDP-2023 consent echo */}
                  <div>
                    <label htmlFor="bk-email" className="field-label">
                      Email
                    </label>
                    <input
                      id="bk-email"
                      ref={(el) => {
                        fieldRefs.current.email = el;
                      }}
                      type="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      className="input-dark"
                      value={values.email}
                      onChange={setValue("email")}
                      onBlur={blurValidate("email")}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby="bk-email-consent bk-email-error"
                    />
                    {/* [review] DPDP-2023 consent echo beside the email field */}
                    <p
                      id="bk-email-consent"
                      className="type-caption mt-2 text-muted"
                    >
                      We&apos;ll use your email and WhatsApp number only to
                      arrange and run your audit. No spam. See our{" "}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-2 hover:text-secondary"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <p
                      id="bk-email-error"
                      className="field-error"
                      aria-live="polite"
                    >
                      {errors.email}
                    </p>
                  </div>

                  {/* 4 — Age */}
                  <div>
                    <label htmlFor="bk-age" className="field-label">
                      Age
                    </label>
                    <input
                      id="bk-age"
                      ref={(el) => {
                        fieldRefs.current.age = el;
                      }}
                      type="number"
                      name="age"
                      inputMode="numeric"
                      min={18}
                      max={99}
                      className="input-dark"
                      value={values.age}
                      onChange={setValue("age")}
                      onBlur={blurValidate("age")}
                      aria-invalid={errors.age ? true : undefined}
                      aria-describedby="bk-age-error"
                    />
                    <p
                      id="bk-age-error"
                      className="field-error"
                      aria-live="polite"
                    >
                      {errors.age}
                    </p>
                  </div>

                  {/* 5 — Main goal */}
                  <div>
                    <label htmlFor="bk-goal" className="field-label">
                      Main goal
                    </label>
                    <select
                      id="bk-goal"
                      ref={(el) => {
                        fieldRefs.current.goal = el;
                      }}
                      name="goal"
                      className="input-dark"
                      value={values.goal}
                      onChange={setValue("goal")}
                      onBlur={blurValidate("goal")}
                      aria-invalid={errors.goal ? true : undefined}
                      aria-describedby="bk-goal-error"
                    >
                      <option value="" disabled>
                        Select your main goal
                      </option>
                      {GOAL_OPTIONS.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                    <p
                      id="bk-goal-error"
                      className="field-error"
                      aria-live="polite"
                    >
                      {errors.goal}
                    </p>
                  </div>
                    </div>
                  </div>
                </Reveal>

                {/* ---------- §4 PAYMENT ----------
                     Two steps, like a gateway: the button hands off, the panel
                     takes the money. The panel is mounted only on the pay step
                     so the QR and the reference field can't be tabbed into
                     before the visitor's details are valid. */}
                {payStep === "details" ? (
                  <Reveal index={3}>
                    <div className="card card-featured spot mt-8">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p className="type-price text-gold-grad">
                          {LEGAL.CONSULT_PRICE}
                        </p>
                        <p className="type-small text-secondary">
                          45-minute Transformation Audit
                        </p>
                      </div>
                      {/* Confirmed inclusions 6 Aug 2026 — copy lives in
                          lib/legal.ts (CONSULT_INCLUDES), not here. */}
                      <ul className="mt-4 grid gap-2">
                        <li className="type-small flex gap-2.5 text-secondary">
                          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-500" />
                          <span>{CONSULT_INCLUDES.GIFT_CARD}</span>
                        </li>
                        <li className="type-small flex gap-2.5 text-secondary">
                          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-500" />
                          <span>{CONSULT_INCLUDES.BLUEPRINT}</span>
                        </li>
                      </ul>
                      <p className="type-small text-gold-300 border-hairline-gold mt-4 border-l pl-4">
                        {CONSULT_INCLUDES.CREDIT}
                      </p>
                      <button
                        type="submit"
                        className="btn-gold mt-6 min-h-[52px] w-full"
                      >
                        Continue to Payment
                        <span aria-hidden="true">→</span>
                      </button>
                      <p className="type-caption text-muted mt-3 text-center">
                        {/* [review] — says what the next screen is, so the
                            hand-off isn't a surprise */}
                        Pay by UPI — PhonePe, Google Pay or Paytm.
                      </p>
                    </div>
                  </Reveal>
                ) : (
                  <div className="mt-8">
                    <UpiPayPanel
                      payerName={values.name.trim()}
                      reference={reference}
                      referenceError={refError}
                      onReferenceChange={(e) => {
                        setReference(e.target.value);
                        setRefError(undefined);
                      }}
                      onConfirm={confirmPaid}
                      confirming={confirming}
                      confirmFailed={confirmFailed}
                      whatsAppFallbackHref={waLink(
                        /* Carries the UTR — the recovery path has to be usable
                           by a man who has already parted with his money. */
                        `Hi Aditya, I've paid ${LEGAL.CONSULT_PRICE} for the Transformation Audit but the website couldn't record my booking. UPI reference: ${reference.trim()}`,
                        BOOKING.COACH_WHATSAPP,
                      )}
                    />
                    <p className="type-caption text-muted mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setPayStep("details")}
                        className="link-draw hover:text-primary inline-flex min-h-[44px] items-center transition-colors"
                      >
                        ← Edit my details
                      </button>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
          </section>

          {/* The gold thread: one continuous 1px line drawing itself down the
              left gutter as you scroll, stitching checkout → payment. Decorative,
              desktop only, reduced-motion → static (kit classes handle both). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
          >
            <div className="container-site relative h-full">
              <div className="thread-v sd-draw absolute inset-y-0 left-0" />
            </div>
          </div>
        </div>

        {/* ---------- §2–§8 PERSUASION CONTENT ----------
             Passed in as children from app/book/page.tsx so they stay Server
             Components (zero JS) while still living inside STATE A — once
             payment succeeds the whole band hides with the rest of STATE A,
             because a paid visitor should not be re-sold the audit. */}
        {children}
      </div>

      {/* ============ STATE B + C (the §6 banner persists into C) ============ */}
      <div hidden={stateA} aria-hidden={stateA}>
        <section className="section aurora grain relative overflow-hidden">
          <div className="container-site">
            <div className="mx-auto max-w-[720px]">
              <div ref={postPayRef}>
                {/* ---------- §6 SUCCESS CONFIRMATION BANNER ---------- */}
                <div className="card card-featured">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline-gold text-gold-300">
                      <DrawCheckIcon width={20} height={20} />
                    </span>
                    {/* [review] — UPI is unverified at this point, so this
                        says "details received", never "payment received".
                        Aditya reconciles the UTR by hand before the slot is
                        real. Do not upgrade this into a guarantee. */}
                    <BannerHeading
                      ref={bannerHeadingRef}
                      tabIndex={-1}
                      className="type-h3 scroll-mt-24 text-primary outline-none"
                    >
                      Got it. Aditya will verify your payment and confirm your
                      slot on WhatsApp within 24 hours.
                    </BannerHeading>
                  </div>
                  {/* [review] */}
                  <p className="type-body mt-4 text-secondary">
                    Message him now to speed it up — the reference is already in
                    the message. Save the thread; that&apos;s where we confirm
                    your time slot.
                  </p>
                  <a
                    href={waLink(
                      /* Carries the UTR so Aditya can match the payment in one
                         glance — the whole point of collecting it. [review] */
                      `Hi Aditya, I've paid ${LEGAL.CONSULT_PRICE} for the Transformation Audit. UPI reference: ${reference.trim()}`,
                      BOOKING.COACH_WHATSAPP,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa mt-5 w-full sm:w-auto"
                  >
                    Message Aditya now
                  </a>
                </div>

                {/* ---------- §5 POST-PAYMENT INTAKE (STATE B only) ---------- */}
                <div hidden={state !== "B"} aria-hidden={state !== "B"}>
                  {/* [review] completing the task's seed sentence in his voice */}
                  <p className="type-lead mt-10 text-secondary">
                    Payment confirmed. Two minutes now saves us fifteen on the
                    call. Tell me a little more so I walk in already knowing
                    you.
                  </p>
                  {/* [review] */}
                  <h2 className="type-h2 mt-3 text-primary">
                    A little more before we talk.
                  </h2>
                  <p className="type-caption mt-2 text-muted">
                    Everything here is optional — your booking is already
                    confirmed.
                    {/* [review] */}
                  </p>

                  <form
                    noValidate
                    onSubmit={handleIntakeSubmit}
                    className="mt-8 grid gap-5"
                  >
                    <Reveal index={0}>
                      {/* [review] label */}
                      <label htmlFor="bk2-occupation" className="field-label">
                        What do you do?
                      </label>
                      <input
                        id="bk2-occupation"
                        type="text"
                        name="occupation"
                        autoComplete="organization-title"
                        className="input-dark"
                        value={intake.occupation}
                        onChange={(e) =>
                          setIntake((v) => ({
                            ...v,
                            occupation: e.target.value,
                          }))
                        }
                      />
                    </Reveal>
                    <Reveal index={1}>
                      {/* [review] label + hint */}
                      <label htmlFor="bk2-lifestyle" className="field-label">
                        Your current lifestyle
                      </label>
                      <textarea
                        id="bk2-lifestyle"
                        name="lifestyle"
                        rows={3}
                        className="input-dark"
                        value={intake.lifestyle}
                        onChange={(e) =>
                          setIntake((v) => ({
                            ...v,
                            lifestyle: e.target.value,
                          }))
                        }
                        aria-describedby="bk2-lifestyle-hint"
                      />
                      <p
                        id="bk2-lifestyle-hint"
                        className="type-caption mt-2 text-muted"
                      >
                        Sleep, work hours, stress, movement — 2–3 lines.
                      </p>
                    </Reveal>
                    <Reveal index={2}>
                      {/* [review] label + hint */}
                      <label htmlFor="bk2-training" className="field-label">
                        Your current training / exercise
                      </label>
                      <textarea
                        id="bk2-training"
                        name="training"
                        rows={3}
                        className="input-dark"
                        value={intake.training}
                        onChange={(e) =>
                          setIntake((v) => ({ ...v, training: e.target.value }))
                        }
                        aria-describedby="bk2-training-hint"
                      />
                      <p
                        id="bk2-training-hint"
                        className="type-caption mt-2 text-muted"
                      >
                        {"Or 'none right now' — be honest."}
                      </p>
                    </Reveal>
                    <Reveal index={3}>
                      {/* [review] label */}
                      <label htmlFor="bk2-blocker" className="field-label">
                        What&apos;s stopped you until now
                      </label>
                      <textarea
                        id="bk2-blocker"
                        name="blocker"
                        rows={3}
                        className="input-dark"
                        value={intake.blocker}
                        onChange={(e) =>
                          setIntake((v) => ({ ...v, blocker: e.target.value }))
                        }
                      />
                    </Reveal>
                    <Reveal index={4}>
                      {/* [review] label */}
                      <label htmlFor="bk2-success" className="field-label">
                        What does success look like in 3–6 months?
                      </label>
                      <textarea
                        id="bk2-success"
                        name="success"
                        rows={3}
                        className="input-dark"
                        value={intake.success}
                        onChange={(e) =>
                          setIntake((v) => ({ ...v, success: e.target.value }))
                        }
                      />
                    </Reveal>

                    <div className="cta-stack mt-2">
                      <button type="submit" className="btn-gold">
                        Send &amp; Finish
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={finishIntake}
                      >
                        Skip for now
                      </button>
                    </div>
                  </form>
                </div>

                {/* ---------- STATE C — FINISHED ---------- */}
                <div hidden={state !== "C"} aria-hidden={state !== "C"}>
                  <div ref={finishedRef} className="mt-10 text-center">
                    {/* [review] */}
                    <h2
                      ref={finishedHeadingRef}
                      tabIndex={-1}
                      className="type-h2 text-primary outline-none"
                    >
                      You&apos;re all set. See you on WhatsApp.
                    </h2>
                    <div className="mt-6 flex justify-center">
                      <a
                        href={waLink(
                          "Hi Aditya, I just booked my Transformation Audit.",
                          BOOKING.COACH_WHATSAPP,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wa w-full sm:w-auto"
                      >
                        Chat with Aditya
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* clearance so the WhatsApp FAB never covers the last button */}
              <div aria-hidden="true" className="h-10" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success-banner check that draws itself in on STATE B entry. pathLength=60
// matches the kit's .stroke-draw dasharray (60), so the tick strokes on
// regardless of its geometric length; reduced motion → static (kit-handled).
function DrawCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path className="stroke-draw" pathLength={60} d="M20 6 9 17l-5-5" />
    </svg>
  );
}
