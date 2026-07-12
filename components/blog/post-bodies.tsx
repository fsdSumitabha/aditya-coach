import type { ComponentType } from "react";
import LifestyleFirst from "@/components/blog/posts/LifestyleFirst";
import HowMuchToEat from "@/components/blog/posts/HowMuchToEat";
import SleepHabitsDrive from "@/components/blog/posts/SleepHabitsDrive";

/** slug → article body component (rendered inside the /blog/[slug] template) */
export const POST_BODIES: Record<string, ComponentType> = {
  "lifestyle-first-why-most-diets-fail-men": LifestyleFirst,
  "how-much-should-a-man-eat-to-lose-fat": HowMuchToEat,
  "sleep-habits-drive-men-30-50": SleepHabitsDrive,
};
