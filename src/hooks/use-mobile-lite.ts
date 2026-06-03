"use client";

import { useEffect, useState } from "react";
import { MOBILE_LITE_MQ, shouldUseMobileLite } from "@/lib/mobile-lite";

/** Subscribes to viewport + reduced-motion; desktop stays false. */
export function useMobileLite(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_LITE_MQ);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setLite(shouldUseMobileLite());
    update();
    mobile.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return lite;
}
