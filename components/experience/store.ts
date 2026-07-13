import { create } from "zustand";

type Quality = "high" | "low";

type ExperienceState = {
  /** damped journey progress 0..1 (written by the scroll hook each frame) */
  progress: number;
  /** raw (undamped) scroll target */
  target: number;
  /** id of the focused fact, or null when free-roaming */
  focus: string | null;
  quality: Quality;
  webglFailed: boolean;
  setTarget: (t: number) => void;
  setProgress: (p: number) => void;
  setFocus: (id: string | null) => void;
  setQuality: (q: Quality) => void;
  setWebglFailed: () => void;
};

export const useExperience = create<ExperienceState>((set) => ({
  progress: 0,
  target: 0,
  focus: null,
  quality: "high",
  webglFailed: false,
  setTarget: (target) => set({ target }),
  setProgress: (progress) => set({ progress }),
  setFocus: (focus) => set({ focus }),
  setQuality: (quality) => set({ quality }),
  setWebglFailed: () => set({ webglFailed: true }),
}));
