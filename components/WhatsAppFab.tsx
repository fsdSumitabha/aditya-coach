"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/icons";

/**
 * WhatsApp floating button (A5): fixed bottom-right on every page.
 * Entrance overshoot pop after first scroll or 1500ms; gentle breathing loop
 * that pauses when the tab is hidden and under reduced motion.
 */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setShown(true);
      window.removeEventListener("scroll", show);
    };
    const t = setTimeout(show, 1500);
    window.addEventListener("scroll", show, { passive: true, once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", show);
    };
  }, []);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="wa-fab-wrap">
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`wa-fab${shown ? " shown" : ""}${paused ? " paused" : ""}`}
        aria-label="Chat with Aditya on WhatsApp"
      >
        <WhatsAppIcon width={30} height={30} />
      </a>
      <span className="wa-label" aria-hidden="true">
        Chat with Aditya
      </span>
    </div>
  );
}
