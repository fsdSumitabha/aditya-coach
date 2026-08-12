import type { ComponentType, SVGProps } from "react";
import {
  ICON_STEP1,
  ICON_STEP2,
  ICON_STEP3,
  ICON_STEP4,
  ICON_STEP5,
} from "@/components/method/method-assets";

/**
 * The Complete Rebuild, one entry per layer. Single source of truth for the
 * /method page: FoundationStack renders these as the pinned stack + its detail
 * panel, and the page builds its HowTo JSON-LD from the same array.
 *
 * `body` is VERBATIM copy — do not alter. Depth lines are in Aditya's voice
 * and carry [review] tags for the owner's audit.
 *
 * Visual stack order = DOM top→bottom, widest first: Lifestyle at the top
 * (100%) narrowing down to Presence at the bottom (40%).
 */
export type MethodStep = {
  id: string;
  num: string;
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  body: string; // VERBATIM — do not alter
  depth: { lead: string; text: string }[];
  width: string;
  bg: string;
  edge: string;
};

export const METHOD_STEPS: MethodStep[] = [
  {
    id: "step-1",
    num: "01",
    name: "LIFESTYLE",
    Icon: ICON_STEP1,
    label: "The Foundation" /* [review] */,
    body: "Fix how you live.", // VERBATIM
    depth: [
      { lead: "What we change:", text: "When you sleep and when you wake. How much you move. The daily habits running on autopilot. How you handle stress and how you recover." } /* [review] */,
      { lead: "Why it's first:", text: "This is the ground everything else stands on. Fix how a man lives and his body starts changing before he's touched a barbell or his diet." } /* [review] */,
      { lead: "Skip it and:", text: "every layer above collapses. You can't out-train broken sleep. You can't out-eat a life that's falling apart." } /* [review] */,
    ],
    width: "100%",
    bg: "var(--surface-warm)",
    edge: "var(--gold-500)",
  },
  {
    id: "step-2",
    num: "02",
    name: "BODY",
    Icon: ICON_STEP2,
    label: "Build the frame" /* [review] */,
    body: "Build strength, fitness, and physical confidence.", // VERBATIM
    depth: [
      { lead: "What we build:", text: "Real strength. Everyday fitness. The training foundations that make hard work feel normal instead of punishment." } /* [review] */,
      { lead: "Why it's second:", text: "Once the day around you is stable, the body can take load and actually adapt. Strength built on a solid life stays." } /* [review] */,
      { lead: "What you get:", text: "A body that can do things — and the physical confidence that comes with it. That doesn't come from a mirror. It comes from what you can do." } /* [review] */,
    ],
    width: "85%",
    bg: "var(--surface-2)",
    edge: "rgba(201, 162, 75, 0.8)",
  },
  {
    id: "step-3",
    num: "03",
    name: "NUTRITION",
    Icon: ICON_STEP3,
    label: "Fuel it right" /* [review] */,
    body: "Fuel your body properly.", // VERBATIM
    depth: [
      { lead: "What we change:", text: "How much you eat, how often, and the few foods doing the most damage. Eating for the body you actually want. No crash diet. No banned list you'll quit in a week." } /* [review] */,
      { lead: "Why it comes here:", text: "Food only holds once the life and the training around it hold it in place. Not before. Never before." } /* [review] — reuses verbatim fragment "Not before. Never before." */,
      { lead: "Skip the foundation and:", text: "you get the same result you always got — three good weeks, then back to square one." } /* [review] */,
    ],
    width: "70%",
    bg: "var(--surface-2)",
    edge: "rgba(201, 162, 75, 0.6)",
  },
  {
    id: "step-4",
    num: "04",
    name: "PERFORMANCE",
    Icon: ICON_STEP4,
    label: "Sharpen everything" /* [review] */,
    body: "Improve training, recovery, energy, and performance.", // VERBATIM
    depth: [
      { lead: "What we sharpen:", text: "How you recover. Your energy across the day. The quality of every session — so the work you put in actually pays you back." } /* [review] */,
      { lead: "Where supplements fit:", text: "Right here, as guidance — not a shortcut. A short, honest list that fills a real gap once the food is right. Never a cabinet full of tubs." } /* [review] */,
      { lead: "Why it's this late:", text: "Performance is the finishing layer. It works because there's already a foundation under it to sharpen." } /* [review] */,
    ],
    width: "55%",
    bg: "var(--surface-1)",
    edge: "rgba(201, 162, 75, 0.42)",
  },
  {
    id: "step-5",
    num: "05",
    name: "PRESENCE",
    Icon: ICON_STEP5,
    label: "How you show up" /* [review] */,
    body: "Improve how you communicate, carry yourself, and show up.", // VERBATIM
    depth: [
      { lead: "What we build:", text: "Body language. The way you communicate. Grooming and style that fit the man you've become. How you show up the moment you walk into a room." } /* [review] */,
      { lead: "Why it's last:", text: "You earn it. Once the body is rebuilt, presence is what makes the change land on everyone who meets you. It's the finish, not the foundation." } /* [review] */,
      { lead: "The full picture:", text: "This is the part most coaching never reaches — the part that decides how the world reads you before you've said a word." } /* [review] */,
    ],
    width: "40%",
    bg: "var(--surface-1)",
    edge: "rgba(201, 162, 75, 0.25)",
  },
];
