/** Mobile / low-power viewport — used to skip heavy UI without affecting desktop. */

export const MOBILE_LITE_MQ = "(max-width: 768px)";

export function isMobileLiteViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_LITE_MQ).matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when animations, parallax, and decorative layers should be minimized. */
export function shouldUseMobileLite(): boolean {
  return isMobileLiteViewport() || prefersReducedMotion();
}
