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
 *
 * Three cross-cutting flags:
 *   required — marked with * on screen. Guidance only: nothing blocks Continue,
 *              and only name + email are enforced, at the point of sending.
 *   info     — guidance shown behind an (i) on the label
 *   showIf   — the field only appears once another answer matches
 */

export type TextInputType = "text" | "number" | "date" | "time" | "tel" | "email";

/** Show this field only while `data[key]` matches `is`. */
export type ShowIf = { key: string; is: string };

type Conditional = { showIf?: ShowIf };

export type AuditField =
  | (Conditional & {
      kind: "text";
      key: string;
      label: string;
      type?: TextInputType;
      placeholder?: string;
      required?: boolean;
      info?: string;
    })
  | (Conditional & {
      kind: "textarea";
      key: string;
      label: string;
      minHeight?: number;
      required?: boolean;
      info?: string;
    })
  | (Conditional & {
      kind: "chips";
      key: string;
      label?: string;
      /** Parenthetical after the label, e.g. "(you can pick more than one)". */
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
      required?: boolean;
      info?: string;
    })
  | (Conditional & {
      kind: "rate";
      key: string;
      label: string;
      required?: boolean;
      info?: string;
    })
  | { kind: "signature"; key: string; label: string; placeholder: string }
  /** Responsive auto-fit grid of sub-fields. */
  | (Conditional & { kind: "row"; min?: number; fields: readonly AuditField[] })
  /** Eyebrow heading + its own grid. */
  | (Conditional & {
      kind: "group";
      title: string;
      min?: number;
      fields: readonly AuditField[];
    })
  /** The Daily Routine spine — labelled stops down a gold thread. */
  | { kind: "timeline"; fields: readonly { key: string; label: string }[] }
  | (Conditional & { kind: "eyebrow"; text: string })
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

/** Yes/No chip pair — the shape repeats across the audit. */
function yesNo(key: string, label: string, extra: Partial<AuditField> = {}): AuditField {
  return { kind: "chips", key, label, options: YES_NO, ...extra } as AuditField;
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
      { kind: "text", key: "fullName", label: "Full name", required: true },
      {
        kind: "chips",
        key: "gender",
        label: "Gender",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      {
        kind: "row",
        fields: [
          { kind: "text", key: "age", label: "Age", type: "number", required: true },
          { kind: "text", key: "dob", label: "Date of birth", type: "date", required: true },
          {
            kind: "text",
            key: "height",
            label: "Height",
            placeholder: "e.g. 175 cm / 5'9\"",
            required: true,
          },
          {
            kind: "text",
            key: "weightCurrent",
            label: "Current weight",
            placeholder: "kg",
            required: true,
          },
          {
            kind: "text",
            key: "weightTarget",
            label: "Target weight",
            placeholder: "kg",
            required: true,
          },
          { kind: "text", key: "occupation", label: "Occupation", required: true },
          { kind: "text", key: "phone", label: "Phone number", type: "tel", required: true },
          { kind: "text", key: "email", label: "Email", type: "email", required: true },
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
        note: "You can pick more than one.",
        multi: true,
        required: true,
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
        ],
      },
      {
        kind: "group",
        title: "Do any of these apply?",
        min: 180,
        fields: [
          yesNo("diabetes", "Diabetes"),
          yesNo("thyroid", "Thyroid"),
          yesNo("digestive", "Digestive issues"),
          yesNo("backpain", "Back pain"),
          yesNo("jointpain", "Joint pain"),
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
          { kind: "text", key: "water", label: "Water intake", placeholder: "litres/day" },
          { kind: "text", key: "steps", label: "Steps per day" },
          { kind: "text", key: "screen", label: "Screen time", placeholder: "hours/day" },
        ],
      },
      {
        kind: "chips",
        key: "workType",
        label: "Nature of work",
        options: ["Desk job", "Standing job", "Physical work", "Mixed"],
      },
      { kind: "eyebrow", text: "Rate out of 10" },
      {
        kind: "rate",
        key: "energy",
        label: "Energy",
        info: "How much energy you have on a normal day, not how motivated you feel. 1 = you are tired by mid-morning and running on coffee. 10 = you feel steady from morning to night, with no slump after lunch.",
      },
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
        ],
      },
      { kind: "textarea", key: "dislikeFoods", label: "Food you don't want to take" },
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
        key: "activity",
        label: "Current activity level",
        options: ["Sedentary", "Light", "Moderate", "Active", "Very active"],
      },
      // The training questions only make sense once he says he trains.
      {
        kind: "chips",
        key: "trainWhere",
        label: "Where / how do you train?",
        labelHint: "(you can pick more than one)",
        multi: true,
        options: ["Gym", "Home", "Walking", "Sports", "Yoga"],
        showIf: { key: "workout", is: "Yes" },
      },
      {
        kind: "chips",
        key: "canPerform",
        label: "Movements you can perform",
        labelHint: "(you can pick more than one)",
        multi: true,
        options: ["Push-ups", "Squats", "Plank", "Cardio"],
        showIf: { key: "workout", is: "Yes" },
      },
      {
        kind: "text",
        key: "trainYears",
        label: "Years of training",
        showIf: { key: "workout", is: "Yes" },
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
          { kind: "text", key: "sleepTime", label: "Sleep time", type: "time" },
          { kind: "text", key: "wakeTime", label: "Wake-up time", type: "time" },
          { kind: "text", key: "sleepHours", label: "Average sleep", placeholder: "hours/night" },
        ],
      },
      {
        kind: "row",
        min: 180,
        fields: [
          yesNo("refreshed", "Wake up refreshed?"),
          yesNo("wakeNight", "Wake up during night?"),
          yesNo("phoneBed", "Phone before bed?"),
        ],
      },
      { kind: "eyebrow", text: "Rate out of 10" },
      {
        kind: "rate",
        key: "sleepQuality",
        label: "Sleep quality",
        info: "How well you sleep, not how long. 1 = broken sleep, and you still wake up tired. 10 = deep sleep all night, and you wake up fresh.",
      },
      {
        kind: "rate",
        key: "fallAsleep",
        label: "How easily do you fall asleep?",
        info: "How long it takes you to fall asleep after you switch off the light. 1 = you lie awake an hour or more with your mind running. 10 = you are asleep within ten minutes on most nights.",
      },
    ],
  },
  {
    n: 8,
    eyebrow: "Section 08",
    title: "Stress & Mental Health",
    icon: "pulse",
    fields: [
      {
        kind: "rate",
        key: "stressRate",
        label: "Rate your stress",
        info: "How stressed you feel on a normal day, not in your worst week. 1 = calm and in control. 10 = tense all the time, and it follows you to bed.",
      },
      {
        kind: "chips",
        key: "stressSources",
        label: "Main sources of stress",
        labelHint: "(you can pick more than one)",
        multi: true,
        options: ["Work", "Relationship", "Money", "Family", "Business", "Health", "Other"],
        otherKey: "stressOther",
        otherPlaceholder: "If other, tell me more…",
      },
      {
        kind: "textarea",
        key: "manageStress",
        label: "How do you manage stress?",
        info: "What you actually do when stress hits, not what you plan to do. The gym, your phone, food, a drink, a walk, or nothing. This answer changes your plan more than most.",
      },
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
      {
        kind: "rate",
        key: "confidence",
        label: "Confidence",
        info: "How sure you are of yourself before anyone reacts to you. 1 = you doubt every move you make. 10 = you trust yourself without needing anyone to approve.",
      },
      {
        kind: "rate",
        key: "selfEsteem",
        label: "Self-esteem",
        info: "What you really think of yourself when nobody is watching. 1 = you feel behind everyone your age. 10 = you think well of yourself, and you mean it.",
      },
      {
        kind: "rate",
        key: "communication",
        label: "Communication",
        info: "How clearly you get your point across at work, at home, and with people you do not know. 1 = you go quiet, or you talk too much. 10 = you say it once and people get it.",
      },
      {
        kind: "rate",
        key: "bodyLang",
        label: "Body language",
        info: "How you hold yourself before you say anything. Your posture, your eye contact, how much space you take. 1 = closed off and small. 10 = open, calm and steady.",
      },
      {
        kind: "rate",
        key: "discipline",
        label: "Discipline",
        info: "Doing what you decided to do even when you no longer feel like it. 1 = your mood decides your day. 10 = your plan decides your day.",
      },
      {
        kind: "rate",
        key: "leadership",
        label: "Leadership",
        info: "Whether people look to you when a decision has to be made. 1 = you wait to be told what to do. 10 = you make the call and take responsibility for it.",
      },
      {
        kind: "rate",
        key: "emoControl",
        label: "Emotional control",
        info: "What you do between something upsetting you and how you react. 1 = you snap, shut down, or think about it for days. 10 = you feel it and still choose how you react.",
      },
      {
        kind: "rate",
        key: "publicSpeak",
        label: "Public speaking",
        info: "Speaking to a room, a camera, or a table where everyone is listening to you. 1 = you avoid it. 10 = you look forward to it.",
      },
      {
        kind: "textarea",
        key: "struggle",
        label: "Which area do you struggle with most?",
        info: "Name one, not five. The one that holds you back the most is where we start.",
      },
      {
        kind: "textarea",
        key: "improveOne",
        label: "If you could instantly improve ONE thing about yourself — what would it be?",
        info: "Write your first answer, not the tidy one. Whatever came to mind before you changed it.",
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
      {
        kind: "note",
        text: "Tick every one that is true for you. Being honest here is what makes the plan work.",
      },
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

/** Steps counted in the "Section NN / NN" progress label. */
export const NUMBERED_STEPS = AUDIT_STEPS.filter((s) =>
  s.eyebrow.startsWith("Section"),
).length;
/** The commitment page — the last step there is. */
export const LAST_STEP = AUDIT_STEPS[AUDIT_STEPS.length - 1]!.n;

// ---- Reading answers back out --------------------------------------------

export type AuditValue = string | number | string[];
export type AuditData = Record<string, AuditValue | undefined>;

/** Conditional fields disappear when their trigger answer does not match. */
export function isVisible(field: AuditField, data: AuditData): boolean {
  const condition = (field as Conditional).showIf;
  if (!condition) return true;
  const value = data[condition.key];
  return Array.isArray(value)
    ? value.includes(condition.is)
    : String(value ?? "") === condition.is;
}

/**
 * Every answerable field in a step, flattened out of rows/groups/timelines.
 * Pass `data` to drop the branches that are currently hidden.
 */
export function flattenFields(
  fields: readonly AuditField[],
  data?: AuditData,
): AuditField[] {
  const out: AuditField[] = [];
  for (const field of fields) {
    if (data && !isVisible(field, data)) continue;
    if (field.kind === "row" || field.kind === "group") {
      if (field.kind === "group") out.push({ kind: "eyebrow", text: field.title });
      out.push(...flattenFields(field.fields, data));
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
