"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function TrackPageview() {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer?.slice(0, 500) || "",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track-pageview",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/track-pageview", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
