"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { track } from "@/lib/config";

// ---- calculator tuning constants (spec CONFIG BLOCK — do not alter) ----
const KG_TO_LB = 2.20462;
const PROTEIN_PER_KG = 2.0; // g protein per kg of IDEAL bodyweight
const CLAMP_MIN_KG = 30;
const CLAMP_MAX_KG = 250;
const KCAL_ROUND = 10; // round kcal outputs to nearest 10
const PROTEIN_ROUND = 5; // round protein to nearest 5 g

/** round to nearest n */
const roundTo = (x: number, n: number) => Math.round(x / n) * n;
const clampKg = (kg: number) =>
  Math.min(CLAMP_MAX_KG, Math.max(CLAMP_MIN_KG, kg));

type Result = {
  targetKcal: number;
  currentKcal: number;
  proteinG: number;
  gapKcal: number;
};

/**
 * FORMULA (EXACT — from SHARED; do not alter). Inputs are kg; activity
 * multipliers are kcal per POUND, so convert kg→lb first. Calorie TARGET
 * uses IDEAL weight; the contrast number uses CURRENT weight.
 */
function compute(currentKg: number, idealKg: number, mult: number): Result {
  const currentLb = currentKg * KG_TO_LB;
  const idealLb = idealKg * KG_TO_LB;
  const targetKcal = roundTo(idealLb * mult, KCAL_ROUND);
  const currentKcal = roundTo(currentLb * mult, KCAL_ROUND);
  const proteinG = roundTo(idealKg * PROTEIN_PER_KG, PROTEIN_ROUND);
  return { targetKcal, currentKcal, proteinG, gapKcal: currentKcal - targetKcal };
}

// Worked example (spec — must match exactly): 90 kg / 75 kg / x16
// → target 2650, current 3170, protein 150, gap 520.
const EXAMPLE = compute(90, 75, 16);

export default function Calculator() {
  const uid = useId();
  const [current, setCurrent] = useState("90");
  const [ideal, setIdeal] = useState("75");
  const [activity, setActivity] = useState("16");
  const [errors, setErrors] = useState<{ current?: string; ideal?: string }>(
    {},
  );
  const [note, setNote] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(EXAMPLE);
  const [runs, setRuns] = useState(0); // 0 = worked example shown on load

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const cur = Number(current);
    const idl = Number(ideal);
    const errs: { current?: string; ideal?: string } = {};
    if (current.trim() === "" || Number.isNaN(cur)) {
      errs.current = "Enter your current weight in kg."; /* [review] */
    }
    if (ideal.trim() === "" || Number.isNaN(idl)) {
      errs.ideal = "Enter your ideal body weight in kg."; /* [review] */
    }
    setErrors(errs);
    if (errs.current || errs.ideal) {
      setNote(null);
      return;
    }

    const curClamped = clampKg(cur);
    const idlClamped = clampKg(idl);
    const wasClamped = curClamped !== cur || idlClamped !== idl;
    if (wasClamped) {
      setCurrent(String(curClamped));
      setIdeal(String(idlClamped));
    }
    setNote(wasClamped ? "Adjusted to the 30–250 kg range." : null); /* [review] */

    const mult = Number(activity); // 14 | 16 | 18
    const next = compute(curClamped, idlClamped, mult);
    setResult(next);
    setRuns((n) => n + 1);
    track("calculator_result", {
      currentKg: curClamped,
      idealKg: idlClamped,
      activity: mult,
      targetKcal: next.targetKcal,
      currentKcal: next.currentKcal,
      proteinG: next.proteinG,
      gapKcal: next.gapKcal,
    });
  }

  // First paint animates when scrolled into view; each Calculate press
  // remounts the CountUps (key) so numbers re-animate from 0, landing
  // staggered target → current → gap → protein via increasing durations.
  const startOn = runs === 0 ? ("visible" as const) : ("mount" as const);
  const gapAbs = Math.abs(result.gapKcal);

  return (
    <div className="card-dark-gold">
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor={`${uid}-current`} className="field-label">
              Current weight (kg)
            </label>
            <input
              id={`${uid}-current`}
              className="input-dark"
              type="number"
              inputMode="decimal"
              min={30}
              max={250}
              step={0.5}
              required
              placeholder="90"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              aria-invalid={errors.current ? true : undefined}
              aria-describedby={
                errors.current ? `${uid}-current-error` : undefined
              }
            />
            <div aria-live="polite" className="min-h-[1.5rem]">
              {errors.current && (
                <p id={`${uid}-current-error`} className="field-error">
                  {errors.current}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-ideal`} className="field-label">
              Ideal body weight (kg)
            </label>
            <input
              id={`${uid}-ideal`}
              className="input-dark"
              type="number"
              inputMode="decimal"
              min={30}
              max={250}
              step={0.5}
              required
              placeholder="75"
              value={ideal}
              onChange={(e) => setIdeal(e.target.value)}
              aria-invalid={errors.ideal ? true : undefined}
              aria-describedby={errors.ideal ? `${uid}-ideal-error` : undefined}
            />
            <div aria-live="polite" className="min-h-[1.5rem]">
              {errors.ideal && (
                <p id={`${uid}-ideal-error`} className="field-error">
                  {errors.ideal}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-activity`} className="field-label">
              Activity level
            </label>
            {/* option labels are the client's verbatim wording — do not paraphrase */}
            <select
              id={`${uid}-activity`}
              className="input-dark"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="14">Not very active (x14)</option>
              <option value="16">Gym 3 to 4 times a week (x16)</option>
              <option value="18">Very active daily (x18)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="submit"
            className="btn-gold w-full md:w-auto md:min-w-[260px]"
          >
            Calculate My Numbers{/* [review] */}
          </button>
          <div aria-live="polite" className="min-h-[1.5rem] mt-2">
            {note && <p className="type-caption text-muted">{note}</p>}
          </div>
        </div>
      </form>

      {/* ---- RESULT (height reserved; worked example shown on load → no CLS) ---- */}
      <div className="mt-8">
        {/* screen-reader summary — final values only, no count-up churn */}
        <p className="sr-only" role="status">
          {runs > 0
            ? `Your target is ${result.targetKcal} kcal per day, eating for the body you want. ${result.currentKcal} kcal per day maintains the body you have now. Protein target ${result.proteinG} grams per day.`
            : ""}
        </p>

        <div className="min-h-[1.5rem] text-center">
          {runs === 0 && (
            <p className="type-caption text-muted">
              Worked example shown — 90 kg now, 75 kg goal, gym 3 to 4 times a
              week. Enter your numbers and hit Calculate.{/* [review] */}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          {/* Left — TARGET (hero number, gold) */}
          <div className="rounded-xl border border-hairline-gold bg-[rgba(201,162,75,0.07)] p-5 text-center min-h-[150px] flex flex-col justify-center">
            <p className="type-caption text-secondary uppercase tracking-[0.08em]">
              Your target — eat for the body you want{/* [review] */}
            </p>
            <p className="type-numeral mt-3">
              <CountUp
                key={`target-${runs}`}
                value={result.targetKcal}
                durationMs={800}
                startOn={startOn}
              />
            </p>
            <p className="type-small text-muted mt-1">kcal/day</p>
          </div>

          {/* Right — CURRENT (contrast number, muted) */}
          <div className="rounded-xl border border-hairline-soft p-5 text-center min-h-[150px] flex flex-col justify-center">
            <p className="type-caption text-muted uppercase tracking-[0.08em]">
              What maintains the body you have now{/* [review] */}
            </p>
            <p className="font-display text-[2.5rem] md:text-[3.5rem] leading-none text-secondary mt-3">
              <CountUp
                key={`current-${runs}`}
                value={result.currentKcal}
                durationMs={950}
                startOn={startOn}
              />
            </p>
            <p className="type-small text-muted mt-1">kcal/day</p>
          </div>
        </div>

        {/* GAP callout */}
        <p className="type-lead text-primary text-center mt-6 min-h-[3.2em] max-w-[46ch] mx-auto">
          {result.gapKcal > 0 && (
            <>
              That&apos;s a{" "}
              <strong className="font-display font-medium text-gold-300">
                <CountUp
                  key={`gap-${runs}`}
                  value={gapAbs}
                  durationMs={1100}
                  startOn={startOn}
                />{" "}
                kcal/day
              </strong>{" "}
              gap between where you are and where you want to be.{/* [review] */}
            </>
          )}
          {result.gapKcal < 0 && (
            <>
              You&apos;d eat about{" "}
              <strong className="font-display font-medium text-gold-300">
                <CountUp
                  key={`gap-${runs}`}
                  value={gapAbs}
                  durationMs={1100}
                  startOn={startOn}
                />{" "}
                kcal/day
              </strong>{" "}
              MORE to build toward your ideal.{/* [review] */}
            </>
          )}
          {result.gapKcal === 0 && (
            <>
              No gap — you&apos;re already eating for the body you want. Now
              make it consistent.{/* [review] */}
            </>
          )}
        </p>

        {/* Protein stat */}
        <p className="type-body text-primary text-center mt-2 min-h-[1.7em]">
          Protein target —{" "}
          <strong className="font-display font-medium text-gold-300">
            <CountUp
              key={`protein-${runs}`}
              value={result.proteinG}
              durationMs={1250}
              startOn={startOn}
            />{" "}
            g/day
          </strong>{" "}
          (2 g per kg of your ideal weight){/* [review] */}
        </p>

        {/* required one-line disclaimer, directly under the result */}
        <p className="type-caption text-muted text-center mt-4">
          This is a starting estimate, not medical advice — individual needs
          vary. Aditya is a lifestyle coach, not a doctor or dietitian.
          {/* [review] */}
        </p>
      </div>

      {/* ---- BRIDGE → /book ---- */}
      <hr className="gold-line my-8" />
      <Reveal delayMs={200} className="text-center">
        <p className="type-body text-secondary max-w-[46ch] mx-auto">
          This is the same starting framework I use with every client. Want the
          full plan built around your numbers?
        </p>
        <div className="cta-stack justify-center mt-6">
          <Link href="/book" className="btn-gold">
            Book My Call — ₹2,000
          </Link>
        </div>
        <p className="type-small mt-5">
          <Link
            href="/blog/how-much-should-a-man-eat-to-lose-fat"
            className="text-muted underline underline-offset-4 hover:text-secondary"
          >
            Read the full breakdown{/* [review] */}
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
