"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "aku-cookie-consent";

/**
 * Small dismissible consent banner (A8). Analytics are dormant in Phase 1
 * (empty IDs → track() no-op), and Phase 2 must not load GA/Pixel before
 * this consent is granted.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // deferred a frame: avoids sync-setState-in-effect cascades and lets the
    // first paint happen before the banner appears
    const raf = requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(KEY)) setVisible(true);
      } catch {
        // storage unavailable → stay hidden
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <p className="type-small text-secondary flex-1 min-w-[200px]">
        We use cookies to improve your experience and measure our ads.{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
          Privacy Policy
        </Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className="btn-gold btn-compact"
      >
        Accept
      </button>
    </div>
  );
}
