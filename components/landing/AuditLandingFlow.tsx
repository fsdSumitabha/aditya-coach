"use client";

/**
 * /landing-page — the paid-traffic conversion machine (client island).
 *
 * TWO states, not three. /book has an optional post-payment intake; this page
 * does not, on purpose: the detailed pre-assessment is a Google Form sent over
 * WhatsApp AFTER payment (brief §7, "RULE"). Asking a cold ad visitor more
 * questions on the success screen is friction with nothing left to buy.
 *
 *   STATE A (pre-payment):  hero (§2) + the sections passed in as children
 *                           (§3–§5, §7, §9–§10) + booking and payment (§8).
 *   STATE B (post-payment): confirmation, and what happens next on WhatsApp.
 *
 * Only one state is in the accessibility tree at a time; the other carries
 * hidden + aria-hidden. Focus moves to the new state's heading and the change
 * is announced through a visually-hidden aria-live region.
 *
 * The persuasion sections are Server Components passed in as `middle` and
 * `tail`, so they cost zero JS and still hide with STATE A once payment
 * succeeds — a man who has paid must not be re-sold the thing he just bought.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NOT REAL YET (same seams as /book — see lib/config.ts):
 *   [ ] REAL GATEWAY  → payment is a manual UPI hand-off. NOTHING here
 *                       verifies that money moved: the visitor asserts he paid
 *                       and hands back a UTR, and Aditya matches it against
 *                       PhonePe by hand. Every downstream string is written to
 *                       be true under that constraint. Do not upgrade any of
 *                       them into "payment received".
 *   [x] BOOKING MAIL  → LIVE. sendBooking() → app/api/booking → SMTP. The only
 *                       record a booking leaves. Blocking, and a failure hands
 *                       the payer a WhatsApp fallback carrying his UTR.
 *   [ ] TRACKING      → track() is a no-op until GA/Meta Pixel IDs exist in
 *                       lib/config. The three events the brief requires are
 *                       already fired below: ViewContent (landing-page view),
 *                       InitiateCheckout (booking initiation) and Purchase
 *                       (successful booking). Setting META_PIXEL_ID turns them
 *                       on — nothing on this page needs to change.
 * ---------------------------------------------------------------------------
 */

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import UpiPayPanel from "@/components/book/UpiPayPanel";
import { COACH_WHATSAPP, sendBooking, track, waLink } from "@/lib/config";
import { LEGAL } from "@/lib/legal";
import {
  BOOKING_ANCHOR,
  CREDIT_LINE,
  GOAL_OPTIONS,
  HERO,
  LANDING_SOURCE,
  PAY_CTA,
  PRICE,
} from "@/components/landing/landing-data";
import { LP_SECTION } from "@/components/landing/section";

/** No duration anywhere on this page — the Audit sells direction, not time. */
const PRODUCT_LABEL = "Transformation Audit · Online via WhatsApp";

// ---------------------------------------------------------------------------
// Validation. Three fields, and no more (brief §7). Same rules as /book for
// the two they share, so a man who fills either form is judged identically.
// ---------------------------------------------------------------------------

type FieldName = "name" | "phone" | "goal";
const FIELD_ORDER: FieldName[] = ["name", "phone", "goal"];

function validateField(field: FieldName, raw: string): string | null {
  const v = raw.trim();
  switch (field) {
    case "name":
      if (v.length < 2 || /^[\d\s]+$/.test(v)) return "Please enter your full name.";
      return null;
    case "phone": {
      // strip spaces/dashes; optional leading +; 10–15 digits;
      // India default: a bare 10-digit number must start 6–9
      const cleaned = v.replace(/[\s-]/g, "");
      const m = /^\+?(\d{10,15})$/.exec(cleaned);
      const ok =
        !!m && (cleaned.startsWith("+") || m[1].length !== 10 || /^[6-9]/.test(m[1]));
      return ok
        ? null
        : "Enter a valid WhatsApp number (10 digits, or +country code).";
    }
    case "goal":
      return v ? null : "Select what you would most like to improve.";
  }
}

/**
 * UPI reference (UTR) check. Deliberately loose: the canonical UTR is 12
 * digits, but banks and PSPs hand back their own formats and a strict rule
 * would block real payers. This only stops empty and obviously-junk input —
 * Aditya verifies the payment for real.
 */
function validateReference(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "Enter the UPI reference from your payment app.";
  if (!/^[A-Za-z0-9]{6,25}$/.test(v))
    return "That doesn't look like a UPI reference — 6–25 letters or numbers.";
  return null;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---------------------------------------------------------------------------

export default function AuditLandingFlow({
  middle,
  tail,
}: {
  /** §3–§5 + §7 — everything between the hero and the booking section. */
  middle: ReactNode;
  /** §9–§10 — FAQ and the closing CTA, below the booking section. */
  tail: ReactNode;
}) {
  const [paid, setPaid] = useState(false);

  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    phone: "",
    goal: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const fieldRefs = useRef<
    Record<FieldName, HTMLInputElement | HTMLSelectElement | null>
  >({ name: null, phone: null, goal: null });

  // The gateway hand-off: "details" shows the Continue button, "pay" swaps in
  // the UPI panel. Nothing verifies the payment, so "confirming" is only the
  // button's busy state.
  const [payStep, setPayStep] = useState<"details" | "pay">("details");
  const [reference, setReference] = useState("");
  const [refError, setRefError] = useState<string | undefined>();
  const [confirming, setConfirming] = useState(false);
  // The booking mail failed. Money has already moved, so this is a recovery
  // path, not a validation error.
  const [confirmFailed, setConfirmFailed] = useState(false);

  const [liveMsg, setLiveMsg] = useState("");
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);

  // Sticky mobile CTA visibility — on once the hero has scrolled away, off
  // again while the booking section is on screen (nothing should sit over the
  // button it points at).
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const bookSectionRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [bookInView, setBookInView] = useState(false);

  // Landing-page view — the first of the three events the brief requires.
  useEffect(() => {
    track("ViewContent", {
      content_name: "Transformation Audit",
      value: LEGAL.CONSULT_PRICE_INR,
      currency: "INR",
      source: LANDING_SOURCE,
    });
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = heroSentinelRef.current;
    const book = bookSectionRef.current;
    if (!hero || !book) return;

    const heroIo = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    // The WHOLE booking section, not a sentinel at its top: the bar must stay
    // down for the entire scroll through the form and the payment panel, not
    // reappear over the button it points at as soon as the top edge leaves.
    const bookIo = new IntersectionObserver(
      ([entry]) => setBookInView(entry.isIntersecting),
      { threshold: 0 },
    );
    heroIo.observe(hero);
    bookIo.observe(book);
    return () => {
      heroIo.disconnect();
      bookIo.disconnect();
    };
  }, []);

  // Focus the confirmation on the state change (DOM only — the announcement
  // text is set in the handler that caused it).
  useEffect(() => {
    if (!paid) return;
    const target = doneHeadingRef.current;
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [paid]);

  // Bring the payment panel into view once it has rendered. Runs on the step
  // change, not in the submit handler — the panel is not in the DOM until
  // React has committed the new step.
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
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };
  }

  function blurValidate(field: FieldName) {
    return () => {
      const err = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: err ?? undefined }));
    };
  }

  // Step 1 — the submit button is the hand-off TO payment, not the payment.
  // Enter inside the reference field also fires this, so once we are already
  // on the pay step it forwards rather than re-validating details he has
  // moved past.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (payStep === "pay") {
      void confirmPaid();
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
      fieldRefs.current[firstBad]?.focus();
      return;
    }

    // Booking initiation — the second event the brief requires.
    track("InitiateCheckout", {
      value: LEGAL.CONSULT_PRICE_INR,
      currency: "INR",
      source: LANDING_SOURCE,
    });
    setPayStep("pay");
  }

  // Step 2 — he asserts he paid and hands back a UTR.
  //
  // NOTHING HERE VERIFIES THE PAYMENT. No gateway, no webhook, no signature.
  // This records what he says and routes it to Aditya, who checks it against
  // PhonePe by hand.
  async function confirmPaid() {
    if (confirming) return;
    const err = validateReference(reference);
    setRefError(err ?? undefined);
    if (err) {
      document.getElementById("bk-upiref")?.focus();
      return;
    }

    setConfirming(true);
    setConfirmFailed(false);

    // BLOCKING ON PURPOSE. This mail is the only record the booking leaves.
    // Money has already moved by the time we get here, so showing the success
    // screen before we know Aditya was told would strand a paid customer as an
    // unattributable ₹999 in PhonePe.
    //
    // No email and no age: this page collects three fields (brief §7), so the
    // WhatsApp number is the only way back to him. app/api/booking accepts
    // that and validates the phone hard in exchange.
    const res = await sendBooking({
      stage: "paid",
      name: values.name.trim(),
      email: "",
      phone: values.phone.trim(),
      age: "",
      goal: values.goal,
      upiReference: reference.trim(),
      submittedAt: new Date().toISOString(),
      source: LANDING_SOURCE,
    });

    if (!res.ok) {
      setConfirmFailed(true);
      setConfirming(false);
      setLiveMsg(
        "We couldn't record your booking. Your payment is safe — send Aditya the reference on WhatsApp.",
      );
      return;
    }

    // Successful booking — the third event the brief requires. Fires on the
    // CLAIM of payment, so treat the number as unverified in analytics.
    track("Purchase", {
      value: LEGAL.CONSULT_PRICE_INR,
      currency: "INR",
      source: LANDING_SOURCE,
    });
    setPaid(true);
    setLiveMsg(
      "Booking received. Aditya will confirm on WhatsApp and send your Pre-Assessment Form.",
    );
    setConfirming(false);
  }

  // Heading-tree integrity: the hero owns the page h1 while STATE A is
  // visible, so the confirmation heading is an h2 until STATE A hides and it
  // takes over. Prerendered HTML therefore contains exactly one h1.
  const DoneHeading = paid ? "h1" : ("h2" as const);

  const whatsAppAfterPay = waLink(
    `Hi Aditya, I've paid ${PRICE} for the Transformation Audit. UPI reference: ${reference.trim()}`,
    COACH_WHATSAPP,
  );

  return (
    <>
      {/* visually-hidden announcer for the state change */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {liveMsg}
      </div>

      {/* ==================== STATE A — PRE-PAYMENT ==================== */}
      <div hidden={paid} aria-hidden={paid}>
        {/* ---------------- §2 HERO ----------------
             One screen, one action. The h1 is never animated — it paints at
             its final state on frame 1 (LCP). No competing programme links and
             no free-resource CTA above the booking section (brief §1, §3). */}
        <section className={`aurora grain relative overflow-hidden ${LP_SECTION}`}>
          <div className="container-site relative z-10">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="eyebrow">{HERO.eyebrow}</p>

              <h1 className="type-h1 text-primary mt-4">{HERO.headline}</h1>

              <Reveal delayMs={70}>
                <p className="type-lead text-secondary mx-auto mt-6 max-w-[54ch]">
                  {HERO.body}
                </p>
              </Reveal>

              <Reveal delayMs={140}>
                {/* clamped so the line holds on a 375px phone without wrapping
                    mid-phrase — the words are the brief's, verbatim */}
                <p className="font-display text-gold-grad mt-8 text-[clamp(1.25rem,4.6vw,1.75rem)] leading-tight">
                  {HERO.meta}
                </p>
              </Reveal>

              <Reveal
                delayMs={210}
                className="mt-8"
                style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
              >
                {/* Plain anchor, not a scripted scroll — it works before
                    hydration, which matters on the phones ads land on. */}
                <a
                  href={BOOKING_ANCHOR}
                  className="btn-gold shine-loop w-full leading-snug sm:w-auto"
                >
                  {HERO.cta}
                </a>
              </Reveal>

              <Reveal delayMs={280}>
                <ul className="type-small text-muted mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                  {HERO.microproof.map((item, i) => (
                    <li key={item} className="flex items-center gap-3">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-gold-700">
                          ·
                        </span>
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* sticky-CTA trigger: once this leaves the viewport, the bar arrives */}
        <div ref={heroSentinelRef} aria-hidden="true" className="h-px" />

        {/* §3–§7 — server-rendered, zero JS */}
        {middle}

        {/* ---------------- §8 BOOKING + PAYMENT ----------------
             Three fields, then the money. A cold visitor does NOT complete the
             full pre-assessment before paying — that form is sent on WhatsApp
             after the Audit is booked (brief §7). */}
        <section
          id="book"
          ref={bookSectionRef}
          className="bg-surface-warm grain relative overflow-hidden scroll-mt-6"
        >
          <div className={`container-site relative z-10 ${LP_SECTION}`}>
            <div className="mx-auto max-w-[560px]">
              <SplitHeading
                as="h2"
                text="Book your Transformation Audit."
                className="type-h2 text-primary text-center"
              />
              <Reveal delayMs={100}>
                <p className="type-body text-secondary mt-4 text-center">
                  Three details, then payment. Everything else comes to you on
                  WhatsApp.
                  {/* [review] */}
                </p>
              </Reveal>

              <form noValidate onSubmit={handleSubmit} className="mt-9">
                <Reveal delayMs={160}>
                  <div className="card spot">
                    <div
                      aria-hidden="true"
                      className="gold-line -mx-6 -mt-6 mb-6 md:-mx-8 md:-mt-8 md:mb-8"
                    />
                    <div className="grid gap-5">
                      {/* 1 — Full name */}
                      <div>
                        <label htmlFor="lp-name" className="field-label">
                          Full name
                        </label>
                        <input
                          id="lp-name"
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
                          aria-describedby="lp-name-error"
                        />
                        <p id="lp-name-error" className="field-error" aria-live="polite">
                          {errors.name}
                        </p>
                      </div>

                      {/* 2 — WhatsApp number. The only channel back to him. */}
                      <div>
                        <label htmlFor="lp-phone" className="field-label">
                          WhatsApp number
                        </label>
                        <input
                          id="lp-phone"
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
                          aria-describedby="lp-phone-hint lp-phone-error"
                        />
                        <p id="lp-phone-hint" className="type-caption text-muted mt-2">
                          {/* DPDP-2023 consent echo, next to the only personal
                              data this page collects before payment. */}
                          Your Audit and your confirmation happen here. We use
                          it for nothing else — see our{" "}
                          <a
                            href="/privacy"
                            className="underline underline-offset-2 hover:text-secondary"
                          >
                            Privacy Policy
                          </a>
                          .
                        </p>
                        <p id="lp-phone-error" className="field-error" aria-live="polite">
                          {errors.phone}
                        </p>
                      </div>

                      {/* 3 — Main goal */}
                      <div>
                        <label htmlFor="lp-goal" className="field-label">
                          What would you most like to improve?
                        </label>
                        <select
                          id="lp-goal"
                          ref={(el) => {
                            fieldRefs.current.goal = el;
                          }}
                          name="goal"
                          className="input-dark"
                          value={values.goal}
                          onChange={setValue("goal")}
                          onBlur={blurValidate("goal")}
                          aria-invalid={errors.goal ? true : undefined}
                          aria-describedby="lp-goal-error"
                        >
                          <option value="" disabled>
                            Select one
                          </option>
                          {GOAL_OPTIONS.map((goal) => (
                            <option key={goal} value={goal}>
                              {goal}
                            </option>
                          ))}
                        </select>
                        <p id="lp-goal-error" className="field-error" aria-live="polite">
                          {errors.goal}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {payStep === "details" ? (
                  <Reveal delayMs={230}>
                    <div className="card card-featured spot mt-8">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p className="type-price text-gold-grad">{PRICE}</p>
                        <p className="type-small text-secondary">
                          {PRODUCT_LABEL}
                        </p>
                      </div>

                      {/* Confirmed policy, 6 Aug 2026 — the brief gates this
                          line on exactly that (§7). Copy in landing-data.ts. */}
                      <p className="type-small text-gold-300 border-hairline-gold mt-5 border-l pl-4">
                        {CREDIT_LINE}
                      </p>

                      <button
                        type="submit"
                        className="btn-gold mt-6 min-h-[52px] w-full leading-snug"
                      >
                        {PAY_CTA}
                      </button>
                      <p className="type-caption text-muted mt-3 text-center">
                        Pay by UPI — PhonePe, Google Pay or Paytm.
                      </p>
                    </div>
                  </Reveal>
                ) : (
                  <div className="mt-8">
                    <UpiPayPanel
                      payerName={values.name.trim()}
                      productLabel={PRODUCT_LABEL}
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
                        `Hi Aditya, I've paid ${PRICE} for the Transformation Audit but the website couldn't record my booking. UPI reference: ${reference.trim()}`,
                        COACH_WHATSAPP,
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

        {/* §9–§10 — server-rendered, zero JS */}
        {tail}

        {/* ---------------- STICKY MOBILE CTA ----------------
             Mobile only, and only between the hero and the booking section.
             The global WhatsApp FAB is switched off on this route, so nothing
             else occupies this corner; iOS safe-area inset keeps it clear of
             the home indicator (brief §11 P2). */}
        <div
          className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 sm:hidden ${
            pastHero && !bookInView ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
          aria-hidden={!pastHero || bookInView}
        >
          <div className="border-hairline-soft bg-void/95 border-t px-4 pt-3 backdrop-blur">
            <a
              href={BOOKING_ANCHOR}
              className="btn-gold w-full leading-snug"
              tabIndex={pastHero && !bookInView ? undefined : -1}
            >
              {HERO.cta} — {PRICE}
            </a>
          </div>
        </div>
      </div>

      {/* ==================== STATE B — BOOKED ==================== */}
      <div hidden={!paid} aria-hidden={!paid}>
        <section className={`aurora grain relative overflow-hidden ${LP_SECTION}`}>
          <div className="container-site relative z-10">
            <div className="mx-auto max-w-[640px]">
              <div className="card card-featured">
                <span
                  aria-hidden="true"
                  className="border-hairline-gold text-gold-300 inline-flex h-11 w-11 items-center justify-center rounded-full border"
                >
                  <CheckIcon className="h-5 w-5" />
                </span>

                {/* STATE B owns the single exposed h1 once STATE A is hidden.
                    UPI is unverified here, so this says the booking is
                    received — never that the payment cleared. */}
                <DoneHeading
                  ref={doneHeadingRef}
                  tabIndex={-1}
                  className="type-h2 text-primary mt-5 outline-none"
                >
                  You&apos;re booked. Check WhatsApp.
                </DoneHeading>

                <p className="type-body text-secondary mt-5">
                  Aditya confirms your payment and your Audit on WhatsApp, and
                  sends your Pre-Assessment Form there. Complete it before we
                  speak — that is what makes the Audit specific to you.
                  {/* [review] */}
                </p>

                <a
                  href={whatsAppAfterPay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa mt-7 w-full sm:w-auto"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Message Aditya now
                </a>

                <p className="type-caption text-muted mt-4">
                  Your UPI reference is already in the message. Save the thread
                  — that is where everything happens next.
                  {/* [review] */}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
