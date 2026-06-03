"use client";

import { useEffect, useRef, useState } from "react";

type CountUpNumberProps = {
  value: number;
  className?: string;
  duration?: number;
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth count-up when `value` changes; instant update when motion is reduced. */
export function CountUpNumber({
  value,
  className,
  duration = 420,
}: CountUpNumberProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const from = fromRef.current;
    const to = value;
    fromRef.current = to;

    if (from === to) {
      setDisplay(to);
      return;
    }

    if (prefersReducedMotion()) {
      setDisplay(to);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(from + (to - from) * easeOutCubic(t)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
