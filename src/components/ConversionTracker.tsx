"use client";

import { useEffect } from "react";

export function ConversionTracker() {
  useEffect(() => {
    try {
      const storageKey = "google_ads_conversion_fired";
      const hasFired = sessionStorage.getItem(storageKey);

      if (!hasFired) {
        // Ensure dataLayer is initialized on the window object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        win.dataLayer = win.dataLayer || [];

        // Define gtag function if it hasn't been defined yet by the layout script
        if (typeof win.gtag !== "function") {
          win.gtag = function () {
            // eslint-disable-next-line prefer-rest-params
            win.dataLayer.push(arguments);
          };
        }

        // Fire the Google Ads sign-up conversion event
        win.gtag("event", "conversion", {
          send_to: "AW-17923553832/PgrGCJiP8_AbEKj0zuJC",
        });

        // Store flag in sessionStorage to prevent duplicate conversion fires on page refreshes or sub-page returns
        sessionStorage.setItem(storageKey, "true");
        console.log("[Google Ads] Conversion tag fired successfully.");
      } else {
        console.log("[Google Ads] Conversion tag already fired in this session.");
      }
    } catch (error) {
      console.error("[Google Ads] Error firing conversion tag:", error);
    }
  }, []);

  return null;
}
