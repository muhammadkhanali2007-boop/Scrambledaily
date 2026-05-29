"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type PageTransitionProps = {
  children: React.ReactNode;
};

/** Route fade-in via CSS; scrolls to top without layout-affecting motion libs. */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const skipEnterRef = useRef(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

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
      if (e.target !== root || e.animationName !== "page-transition-fade-in") return;
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
