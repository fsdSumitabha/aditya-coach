"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode, } from "react";
import { useExperience } from "./store";
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
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
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

export default function Home3D() {
  const [mode, setMode] = useState<"loading" | "3d" | "fallback">("loading");
  const trackRef = useRef<HTMLDivElement>(null);
  const focusAnchor = useRef<number | null>(null);
  const aliveRef = useRef(false);

  // Mount watchdog: on devices/networks too slow to even load and boot the
  // three.js chunk, the visitor would sit on the poster spinner forever —
  // the in-canvas fps watchdog only exists once the canvas mounts. If no
  // frame has been produced 12s after choosing 3D, serve the 2D journey.
  useEffect(() => {
    if (mode !== "3d") return;
    let t = 0;
    const arm = () => {
      t = window.setTimeout(() => {
        if (aliveRef.current || navigator.webdriver) return;
        // background tabs pause rAF — don't punish them, check again later
        if (document.visibilityState !== "visible") {
          arm();
          return;
        }
        setMode("fallback");
      }, 12000);
    };
    arm();
    return () => window.clearTimeout(t);
  }, [mode]);

  useEffect(() => {
    // deferred a frame — avoids a sync setState-in-effect cascade
    const raf = requestAnimationFrame(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // phones start on the low tier (no bloom/reflections, fewer particles);
      // PerformanceMonitor can only step down further, never up past this
      if (
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768
      ) {
        useExperience.getState().setQuality("low");
      }
      // ?flat=1 — manual escape hatch to preview the 2D journey on any device
      const forced = new URLSearchParams(window.location.search).has("flat");
      setMode(!forced && !reduced && supportsWebGL() ? "3d" : "fallback");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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
          <GLBoundary onFail={() => setMode("fallback")}>
            <ExperienceCanvas
              onPerfFail={() => setMode("fallback")}
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
