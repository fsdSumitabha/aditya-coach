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
  /**
   * Set once by Home3D for phones and coarse-pointer devices, which start on
   * the low tier by design. PerformanceMonitor may still step DOWN, but must
   * never promote these devices back up to bloom + reflections.
   */
  qualityLocked: boolean;
  /**
   * The visitor asked their OS for reduced motion. The journey still renders —
   * the camera follows scroll, because that IS the navigation — but every
   * idle, looping, ambient motion is switched off: seal and folio rotations,
   * Float bobbing, sparkle drift, hotspot pulsing, pointer look-around.
   * Nothing moves that the visitor did not move themselves.
   *
   * Set once at mount and never changed, so useFrame reads it via getState().
   */
  calm: boolean;
  webglFailed: boolean;
  setCalm: () => void;
  setTarget: (t: number) => void;
  setProgress: (p: number) => void;
  setFocus: (id: string | null) => void;
  setQuality: (q: Quality) => void;
  lockQuality: () => void;
  setWebglFailed: () => void;
};

export const useExperience = create<ExperienceState>((set) => ({
  progress: 0,
  target: 0,
  focus: null,
  quality: "high",
  qualityLocked: false,
  calm: false,
  webglFailed: false,
  setCalm: () => set({ calm: true }),
  setTarget: (target) => set({ target }),
  setProgress: (progress) => set({ progress }),
  setFocus: (focus) => set({ focus }),
  setQuality: (quality) => set({ quality }),
  lockQuality: () => set({ qualityLocked: true }),
  setWebglFailed: () => set({ webglFailed: true }),
}));
