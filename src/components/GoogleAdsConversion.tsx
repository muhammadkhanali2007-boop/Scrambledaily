"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function GoogleAdsConversion() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasFired = sessionStorage.getItem("google_ads_conversion_fired");
      if (!hasFired) {
        // Ensure gtag function exists (safety backup)
        if (!window.gtag) {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer?.push(arguments);
          };
        }

        // Trigger conversion event
        window.gtag("event", "conversion", {
          send_to: "AW-17923553832/PgrGCJiP8_AbEKj0zuJC",
        });

        // Store flag to prevent duplicate conversion fires in the same session
        sessionStorage.setItem("google_ads_conversion_fired", "true");
      }
    }
  }, []);

  return null;
}
