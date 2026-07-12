"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/config";

/** Fires track('PageView') on every route change (A8). No-op until IDs exist. */
export default function TrackPageview() {
  const pathname = usePathname();
  useEffect(() => {
    track("PageView", { path: pathname });
  }, [pathname]);
  return null;
}
