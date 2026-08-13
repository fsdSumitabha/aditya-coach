"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useExperience } from "./store";
import { forceFlat, forceThree, reportFallback } from "./flags";
import { NAVIGATE_EVENT } from "./ui";
import Overlay from "./Overlay";
import StaticFallback from "./StaticFallback";

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
  loading: () => <Poster />,
});

function Poster() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#08080a]">
      <span
        aria-hidden="true"
        className="block h-14 w-14 animate-spin rounded-full border border-[rgba(201,162,75,0.25)] border-t-[#c9a24b]"
        style={{ animationDuration: "1.4s" }}
      />
      <p className="text-[11px] font-medium tracking-[0.24em] text-[#8a847a]">
        ENTERING THE ATELIER
      </p>
    </div>
  );
}

/** WebGL render crashes downgrade to the content-first fallback. */
class GLBoundary extends Component<
  { onFail: (reason: string) => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    // A genuine bug in the scene, not a device limitation — always report the
    // message so it is fixable, rather than silently serving the 2D page.
    console.error("[atelier] 3D scene crashed:", error);
    this.props.onFail(`the 3D scene threw an error: ${error.message}`);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const TRACK_VH = 6.2; // journey length: 6.2 viewport heights

/** Strict Mode double-mounts and Fast Refresh remounts churn WebGL contexts in
 *  dev, producing failures no visitor will ever see. Never auto-demote there. */
const DEV = process.env.NODE_ENV !== "production";

export default function Home3D() {
  const [mode, setMode] = useState<"loading" | "3d" | "fallback">("loading");
  const trackRef = useRef<HTMLDivElement>(null);
  const focusAnchor = useRef<number | null>(null);
  const aliveRef = useRef(false);
  const router = useRouter();

  // Buttons rendered inside the Canvas live in react-three-fiber's own React
  // root, where the app router's context does not reach — so they raise this
  // and the push happens out here, in the normal tree.
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      if (typeof href === "string" && href.startsWith("/")) router.push(href);
    };
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, [router]);

  /** Single exit to the 2D journey — every trigger says why, in the console. */
  const demote = useCallback((reason: string) => {
    reportFallback(reason);
    setMode("fallback");
  }, []);

  // Mount watchdog: on devices/networks too slow to even load and boot the
  // three.js chunk, the visitor would sit on the poster spinner forever —
  // the in-canvas fps watchdog only exists once the canvas mounts. This is a
  // last resort for a scene that never arrives at all, so it is deliberately
  // patient: a slow connection downloading three.js is not a broken device,
  // and a spinner that eventually resolves beats swapping the page out.
  useEffect(() => {
    if (mode !== "3d") return;
    let t = 0;
    const arm = () => {
      t = window.setTimeout(() => {
        if (aliveRef.current || navigator.webdriver || DEV) return;
        if (forceThree()) return;
        // background tabs pause rAF — don't punish them, check again later
        if (document.visibilityState !== "visible") {
          arm();
          return;
        }
        demote("the 3D scene never started within 45 seconds of loading");
      }, 45000);
    };
    arm();
    return () => window.clearTimeout(t);
  }, [mode, demote]);

  useEffect(() => {
    // deferred a frame — avoids a sync setState-in-effect cascade
    const raf = requestAnimationFrame(() => {
      // Phones start on the low tier (no bloom/reflections, fewer particles).
      // NOTE: this is a QUALITY choice, never a fallback — no screen size,
      // aspect ratio or input type sends anyone to the 2D journey.
      if (
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768
      ) {
        useExperience.getState().setQuality("low");
        useExperience.getState().lockQuality();
      }

      // ?three=1 — force the 3D journey, overriding every check below AND
      // every runtime watchdog. The fastest way to prove on a visitor's own
      // machine that the hardware is fine and something else routed them to
      // the 2D page.
      if (forceThree()) {
        setMode("3d");
        return;
      }

      // Reduced motion no longer swaps the whole page out. DESIGN-KIT.md says
      // "reduced motion → static everywhere", and for CSS effects it still
      // does — but replacing the homepage with a different homepage was too
      // blunt a reading, and it was sending capable machines (a WebGL-healthy
      // M1 among them) to the 2D page permanently. These visitors now get the
      // real journey with every idle animation switched off; see `calm` in
      // store.ts. Decided with the owner, 12 Aug 2026.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        useExperience.getState().setCalm();
      }

      // ?flat=1 — manual escape hatch to preview the 2D journey on any device
      const reason = forceFlat()
        ? "?flat=1 is in the URL"
        : !supportsWebGL()
          ? "this browser did not return a WebGL context"
          : null;

      if (reason) demote(reason);
      else setMode("3d");
    });
    return () => cancelAnimationFrame(raf);
  }, [demote]);

  // scroll → journey target (raw; the scene damps it per-frame)
  useEffect(() => {
    if (mode !== "3d") return;
    const st = useExperience.getState();

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const t = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      st.setTarget(t);
      // Pointer-out never fires when an object scrolls out from under a
      // stationary cursor (R3F only raycasts on pointer moves), and on touch
      // there is no pointer-out at all — so scrolling clears the description.
      if (useExperience.getState().hover) useExperience.getState().setHover(null);
      // a meaningful scroll releases the focused fact
      if (
        useExperience.getState().focus &&
        focusAnchor.current !== null &&
        Math.abs(t - focusAnchor.current) > 0.022
      ) {
        useExperience.getState().setFocus(null);
      }
    };

    // remember where the journey was when a fact was opened
    const unsub = useExperience.subscribe((s, prev) => {
      if (s.focus && !prev.focus) focusAnchor.current = s.target;
      if (!s.focus) focusAnchor.current = null;
    });

    const onJump = (e: Event) => {
      const el = trackRef.current;
      if (!el) return;
      const p = (e as CustomEvent<number>).detail;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY +
        p * (el.offsetHeight - window.innerHeight);
      window.scrollTo({ top, behavior: "smooth" });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("journey:jump", onJump);
    return () => {
      unsub();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("journey:jump", onJump);
    };
  }, [mode]);

  if (mode === "fallback") return <StaticFallback />;

  return (
    <div
      ref={trackRef}
      className="relative bg-[#08080a]"
      style={{ height: `${TRACK_VH * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {mode === "loading" ? (
          <Poster />
        ) : (
          <GLBoundary onFail={demote}>
            <ExperienceCanvas
              onPerfFail={demote}
              onAlive={() => {
                aliveRef.current = true;
              }}
            />
          </GLBoundary>
        )}
        {mode === "3d" && <Overlay />}
      </div>
    </div>
  );
}
