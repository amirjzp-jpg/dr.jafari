"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** First-party page-view beacon (no cookies). Skips the admin area and honours Do Not Track. */
export function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith("/admin") || navigator.doNotTrack === "1") return;
    let first = false;
    try {
      first = !sessionStorage.getItem("_t");
      sessionStorage.setItem("_t", "1");
    } catch {}
    const utm = first ? new URLSearchParams(location.search).get("utm_source") : null;
    const body = JSON.stringify({ p: path, r: first ? document.referrer : "", u: utm });
    if (!navigator.sendBeacon?.("/api/hit", body)) void fetch("/api/hit", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [path]);
  return null;
}
