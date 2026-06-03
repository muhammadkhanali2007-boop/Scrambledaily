"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { shouldUseMobileLite } from "@/lib/mobile-lite";

type PageTransitionProps = {
  children: React.ReactNode;
};

/** Route fade on desktop; instant navigation on mobile to avoid jank. */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const skipEnterRef = useRef(true);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (shouldUseMobileLite()) {
      rootRef.current?.classList.remove("page-transition-root--enter");
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    if (skipEnterRef.current) {
      skipEnterRef.current = false;
      root.classList.remove("page-transition-root--enter");
      return;
    }

    root.classList.remove("page-transition-root--enter");
    void root.offsetWidth;
    root.classList.add("page-transition-root--enter");

    const onEnd = (e: AnimationEvent) => {
      if (e.target !== root || e.animationName !== "page-transition-fade-in") {
        return;
      }
      root.classList.remove("page-transition-root--enter");
    };
    root.addEventListener("animationend", onEnd);
    return () => root.removeEventListener("animationend", onEnd);
  }, [pathname]);

  return (
    <div ref={rootRef} className="page-transition-root">
      {children}
    </div>
  );
}
