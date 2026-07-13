"use client";

import CountUp from "@/components/CountUp";

/** ₹2,000 counts up when it scrolls into view (client island — the format
    function can't cross the server boundary). Reduced motion → static. */
export default function PriceTicker({ value }: { value: number }) {
  return (
    <CountUp
      value={value}
      durationMs={1100}
      format={(n) => `₹${Math.round(n).toLocaleString("en-IN")}`}
    />
  );
}
