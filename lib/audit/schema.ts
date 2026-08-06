/**
 * The Transformation Audit — the whole question bank as data.
 *
 * One source of truth, read by three consumers:
 *   • components/audit/AuditFlow.tsx  — renders the on-screen stepper
 *   • lib/audit/pdf.ts                — lays the answers out in the PDF
 *   • app/api/audit/route.ts          — summarises the submission for the mail
 *
 * Adding a question is a new entry here, never a redesign. Copy is verbatim
 * from the coach's audit document — do not reword it.
 */

export type TextInputType = "text" | "number" | "date" | "time" | "tel" | "email";

export type AuditField =
  | {
      kind: "text";
      key: string;
      label: string;
      type?: TextInputType;
      placeholder?: string;
    }
  | { kind: "textarea"; key: string; label: string; minHeight?: number }
  | {
      kind: "chips";
      key: string;
      label?: string;
      /** Parenthetical after the label, e.g. "(select all)". */
      labelHint?: string;
      /** Small muted line under the label. */
      note?: string;
      multi?: boolean;
      /** Habits use roomier chips than the rest of the form. */
      size?: "md" | "lg";
      options: readonly string[];
      /** Free-text escape hatch rendered under the chips. */
      otherKey?: string;
      otherPlaceholder?: string;
    }
  | { kind: "rate"; key: string; label: string }
  | { kind: "signature"; key: string; label: string; placeholder: string }
  /** Responsive auto-fit grid of sub-fields. */
  | { kind: "row"; min?: number; fields: readonly AuditField[] }
  /** Eyebrow heading + its own grid. */
  | { kind: "group"; title: string; min?: number; fields: readonly AuditField[] }
  /** The Daily Routine spine — labelled stops down a gold thread. */
  | { kind: "timeline"; fields: readonly { key: string; label: string }[] }
  | { kind: "eyebrow"; text: string }
  | { kind: "callout"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "note"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "closing"; text: string }
  | { kind: "divider" };

export type AuditIcon =
  | "person"
  | "target"
  | "cross"
  | "clock"
  | "cutlery"
  | "dumbbell"
  | "moon"
  | "pulse"
  | "diamond"
  | "sun"
  | "checkbox"
  | "flag"
  | "seal";

export type AuditStep = {
  /** 1-based; step 0 is the cover, which is not a data step. */
  n: number;
  eyebrow: string;
  title: string;
  icon: AuditIcon;
  fields: readonly AuditField[];
};

const YES_NO = ["Yes", "No"] as const;
const FREQUENCY = ["Never", "Sometimes", "Often", "Daily"] as const;

/** Yes/No chip pair — the shape repeats ~20 times across the audit. */
function yesNo(key: string, label: string): AuditField {
  return { kind: "chips", key, label, options: YES_NO };
}

/** Never/Sometimes/Often/Daily chip row. */
function frequency(key: string, label: string): AuditField {
  return { kind: "chips", key, label, options: FREQUENCY };
}

export const AUDIT_STEPS: readonly AuditStep[] = [
  {
    n: 1,
    eyebrow: "Section 01",
    title: "Personal Information",
    icon: "person",
    fields: [
      { kind: "text", key: "fullName", label: "Full name" },
      { kind: "chips", key: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
      {
        kind: "row",
        fields: [
          { kind: "text", key: "age", label: "Age", type: "number" },
          { kind: "text", key: "dob", label: "Date of birth", type: "date" },
          { kind: "text", key: "height", label: "Height", placeholder: "e.g. 175 cm / 5'9\"" },
          { kind: "text", key: "weightCurrent", label: "Current weight", placeholder: "kg" },
          { kind: "text", key: "weightTarget", label: "Target weight", placeholder: "kg" },
          { kind: "text", key: "occupation", label: "Occupation" },
          { kind: "text", key: "phone", label: "Phone number", type: "tel" },
          { kind: "text", key: "email", label: "Email", type: "email" },
          { kind: "text", key: "instagram", label: "Instagram", placeholder: "@handle" },
        ],
      },
    ],
  },
  {
    n: 2,
    eyebrow: "Section 02",
    title: "Goals",
    icon: "target",
    fields: [
      {
        kind: "chips",
        key: "goals",
        label: "What made you contact me?",
        note: "Select all that apply.",
        multi: true,
        options: [
          "Fat Loss",
          "Muscle Gain",
          "Better Health",
          "Better Energy",
          "Confidence",
          "Personality Development",
          "Lifestyle Improvement",
          "Better Sleep",
          "Better Nutrition",
          "Better Discipline",
          "Body Language",
          "Social Confidence",
          "Attraction",
          "Stress Management",
        ],
        otherKey: "goalsOther",
        otherPlaceholder: "Something else? Tell me here…",
      },
      { kind: "divider" },
      {
        kind: "textarea",
        key: "success6mo",
        label: "If we work together for 6 months — what would success look like?",
        minHeight: 110,
      },
      { kind: "textarea", key: "frustration", label: "Your biggest frustration right now?" },
      { kind: "textarea", key: "tried", label: "What have you already tried?" },
    ],
  },
  {
    n: 3,
    eyebrow: "Section 03",
    title: "Medical History",
    icon: "cross",
    fields: [
      {
        kind: "row",
        fields: [
          { kind: "text", key: "medCondition", label: "Medical condition(s)" },
          { kind: "text", key: "injuries", label: "Injuries" },
          { kind: "text", key: "surgeries", label: "Surgeries" },
          { kind: "text", key: "meds", label: "Current medications" },
          { kind: "text", key: "supplements", label: "Supplements" },
          { kind: "text", key: "allergies", label: "Allergies" },
          { kind: "text", key: "bp", label: "Blood pressure" },
        ],
      },
      {
        kind: "group",
        title: "Do any of these apply?",
        min: 180,
        fields: [
          yesNo("diabetes", "Diabetes"),
          yesNo("thyroid", "Thyroid"),
          yesNo("pcos", "PCOS (if applicable)"),
          yesNo("digestive", "Digestive issues"),
          yesNo("backpain", "Back pain"),
          yesNo("jointpain", "Joint pain"),
          yesNo("migraine", "Migraine"),
        ],
      },
      { kind: "textarea", key: "medNotes", label: "Anything your coach should know?" },
    ],
  },
  {
    n: 4,
    eyebrow: "Section 04",
    title: "Lifestyle Audit",
    icon: "clock",
    fields: [
      {
        kind: "row",
        fields: [
          { kind: "text", key: "wakeTime", label: "Wake-up time", type: "time" },
          { kind: "text", key: "sleepTime", label: "Sleep time", type: "time" },
          { kind: "text", key: "sleepHours", label: "Average sleep", placeholder: "hours/night" },
          { kind: "text", key: "water", label: "Water intake", placeholder: "litres/day" },
          { kind: "text", key: "steps", label: "Steps per day" },
          { kind: "text", key: "screen", label: "Screen time", placeholder: "hours/day" },
          { kind: "text", key: "travel", label: "Travel frequency" },
        ],
      },
      {
        kind: "chips",
        key: "workType",
        label: "Nature of work",
        options: ["Desk job", "Standing job", "Physical work", "Mixed"],
      },
      { kind: "eyebrow", text: "Rate out of 10" },
      { kind: "rate", key: "energy", label: "Energy" },
      { kind: "rate", key: "stress", label: "Stress" },
    ],
  },
  {
    n: 5,
    eyebrow: "Section 05",
    title: "Nutrition",
    icon: "cutlery",
    fields: [
      {
        kind: "chips",
        key: "diet",
        label: "Diet type",
        options: ["Vegetarian", "Eggetarian", "Non-Vegetarian", "Vegan"],
      },
      {
        kind: "chips",
        key: "meals",
        label: "Meals per day",
        options: ["1", "2", "3", "4", "5+"],
      },
      {
        kind: "group",
        title: "Which meals do you eat?",
        fields: [
          yesNo("eatBreakfast", "Breakfast"),
          yesNo("eatLunch", "Lunch"),
          yesNo("eatDinner", "Dinner"),
          yesNo("snacking", "Snacking"),
        ],
      },
      {
        kind: "group",
        title: "How often?",
        fields: [
          frequency("outsideFood", "Outside food"),
          frequency("alcohol", "Alcohol"),
          frequency("smoking", "Smoking"),
          frequency("softdrinks", "Soft drinks"),
          frequency("sugar", "Sugar cravings"),
          frequency("nightEating", "Night eating"),
          frequency("emoEating", "Emotional eating"),
        ],
      },
      { kind: "textarea", key: "favFoods", label: "Favourite foods" },
      { kind: "textarea", key: "dislikeFoods", label: "Foods you dislike" },
    ],
  },
  {
    n: 6,
    eyebrow: "Section 06",
    title: "Fitness Assessment",
    icon: "dumbbell",
    fields: [
      yesNo("workout", "Do you currently work out?"),
      {
        kind: "chips",
        key: "trainWhere",
        label: "Where / how do you train?",
        labelHint: "(select all)",
        multi: true,
        options: ["Gym", "Home", "Walking", "Sports", "Yoga", "Nothing"],
      },
      {
        kind: "chips",
        key: "activity",
        label: "Current activity level",
        options: ["Sedentary", "Light", "Moderate", "Active", "Very active"],
      },
      {
        kind: "chips",
        key: "canPerform",
        label: "Movements you can perform",
        labelHint: "(select all)",
        multi: true,
        options: ["Push-ups", "Squats", "Plank", "Cardio"],
      },
      {
        kind: "row",
        fields: [
          { kind: "text", key: "trainYears", label: "Years of training" },
          { kind: "text", key: "fitInjuries", label: "Previous injuries" },
        ],
      },
    ],
  },
  {
    n: 7,
    eyebrow: "Section 07",
    title: "Sleep Assessment",
    icon: "moon",
    fields: [
      {
        kind: "row",
        fields: [
          { kind: "text", key: "bedtime", label: "Average bedtime", type: "time" },
          { kind: "text", key: "wakeup", label: "Average wake-up", type: "time" },
        ],
      },
      {
        kind: "row",
        min: 180,
        fields: [
          yesNo("refreshed", "Wake up refreshed?"),
          yesNo("wakeNight", "Wake up during night?"),
          yesNo("snoring", "Snoring?"),
          yesNo("phoneBed", "Phone before bed?"),
          yesNo("coffeeLate", "Coffee after 4pm?"),
          yesNo("sunlight", "Morning sunlight?"),
        ],
      },
      { kind: "rate", key: "sleepQuality", label: "Sleep quality" },
    ],
  },
  {
    n: 8,
    eyebrow: "Section 08",
    title: "Stress & Mental Health",
    icon: "pulse",
    fields: [
      { kind: "rate", key: "stressRate", label: "Rate your stress" },
      {
        kind: "chips",
        key: "stressSources",
        label: "Main sources of stress",
        labelHint: "(select all)",
        multi: true,
        options: ["Work", "Relationship", "Money", "Family", "Business", "Health", "Other"],
        otherKey: "stressOther",
        otherPlaceholder: "If other, tell me more…",
      },
      {
        kind: "row",
        min: 180,
        fields: [
          yesNo("meditate", "Do you meditate?"),
          yesNo("journal", "Journal?"),
          yesNo("read", "Read?"),
        ],
      },
      { kind: "textarea", key: "manageStress", label: "How do you manage stress?" },
    ],
  },
  {
    n: 9,
    eyebrow: "Section 09",
    title: "Personality & Lifestyle",
    icon: "diamond",
    fields: [
      { kind: "callout", text: "This is where your program becomes different." },
      { kind: "eyebrow", text: "Rate yourself — 1 (low) to 10 (high)" },
      { kind: "rate", key: "confidence", label: "Confidence" },
      { kind: "rate", key: "selfEsteem", label: "Self-esteem" },
      { kind: "rate", key: "communication", label: "Communication" },
      { kind: "rate", key: "bodyLang", label: "Body language" },
      { kind: "rate", key: "discipline", label: "Discipline" },
      { kind: "rate", key: "consistency", label: "Consistency" },
      { kind: "rate", key: "socialConf", label: "Social confidence" },
      { kind: "rate", key: "leadership", label: "Leadership" },
      { kind: "rate", key: "emoControl", label: "Emotional control" },
      { kind: "rate", key: "publicSpeak", label: "Public speaking" },
      { kind: "textarea", key: "struggle", label: "Which area do you struggle with most?" },
      {
        kind: "textarea",
        key: "improveOne",
        label: "If you could instantly improve ONE thing about yourself — what would it be?",
      },
    ],
  },
  {
    n: 10,
    eyebrow: "Section 10",
    title: "Daily Routine",
    icon: "sun",
    fields: [
      { kind: "lead", text: "Walk me through your average day." },
      {
        kind: "timeline",
        fields: [
          { key: "rWake", label: "Wake-up" },
          { key: "rMorning", label: "Morning routine" },
          { key: "rBreakfast", label: "Breakfast" },
          { key: "rWork", label: "Work" },
          { key: "rLunch", label: "Lunch" },
          { key: "rWorkout", label: "Workout" },
          { key: "rEvening", label: "Evening" },
          { key: "rDinner", label: "Dinner" },
          { key: "rSleep", label: "Sleep" },
        ],
      },
    ],
  },
  {
    n: 11,
    eyebrow: "Section 11",
    title: "Habits",
    icon: "checkbox",
    fields: [
      { kind: "note", text: "Tick all that apply — honesty here is what makes the plan work." },
      {
        kind: "chips",
        key: "habits",
        multi: true,
        size: "lg",
        options: [
          "Smoke",
          "Alcohol",
          "Vape",
          "Porn",
          "Late-night scrolling",
          "Fast food",
          "Sugary drinks",
          "Skip breakfast",
          "Overeat",
          "Stress eating",
          "Low water intake",
          "Poor sleep",
        ],
      },
    ],
  },
  {
    n: 12,
    eyebrow: "Section 12",
    title: "Readiness Score",
    icon: "flag",
    fields: [
      { kind: "rate", key: "committed", label: "How committed are you?" },
      yesNo("readyFollow", "Are you ready to follow instructions?"),
      { kind: "textarea", key: "couldStop", label: "What could stop you?" },
    ],
  },
  {
    n: 13,
    eyebrow: "Final step",
    title: "Client Commitment",
    icon: "seal",
    fields: [
      {
        kind: "quote",
        text: "“I understand that results depend on my consistency, honesty and commitment. I agree to follow the plan to the best of my ability.”",
      },
      { kind: "divider" },
      {
        kind: "row",
        min: 240,
        fields: [
          {
            kind: "signature",
            key: "sig_client",
            label: "Client signature",
            placeholder: "Sign here",
          },
          { kind: "text", key: "signDate", label: "Date", type: "date" },
        ],
      },
      { kind: "closing", text: "Thank you for your honesty. This is where the work begins." },
    ],
  },
] as const;

/** Last data step. Steps 1…12 drive the progress bar; 13 is the commitment. */
export const LAST_STEP = 13;
/** Steps counted in the "Section NN / 12" progress label. */
export const NUMBERED_STEPS = 12;

// ---- Reading answers back out --------------------------------------------

export type AuditValue = string | number | string[];
export type AuditData = Record<string, AuditValue | undefined>;

/** Every answerable field in a step, flattened out of rows/groups/timelines. */
export function flattenFields(fields: readonly AuditField[]): AuditField[] {
  const out: AuditField[] = [];
  for (const field of fields) {
    if (field.kind === "row" || field.kind === "group") {
      if (field.kind === "group") out.push({ kind: "eyebrow", text: field.title });
      out.push(...flattenFields(field.fields));
    } else if (field.kind === "timeline") {
      for (const stop of field.fields) {
        out.push({ kind: "text", key: stop.key, label: stop.label });
      }
    } else {
      out.push(field);
    }
  }
  return out;
}

/** Human-readable answer for one field — "—" when it was left blank. */
export function formatAnswer(field: AuditField, data: AuditData): string {
  if (!("key" in field)) return "";
  const raw = data[field.key];
  if (raw == null || raw === "") return "—";
  if (Array.isArray(raw)) return raw.length > 0 ? raw.join(" · ") : "—";
  if (field.kind === "rate") return `${raw} / 10`;
  return String(raw);
}

/** The client's own name, used for the PDF filename and the mail subject. */
export function clientName(data: AuditData): string {
  const name = typeof data.fullName === "string" ? data.fullName.trim() : "";
  return name || "Client";
}
