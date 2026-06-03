"use client";

import { useMobileLite } from "@/hooks/use-mobile-lite";

type ViewTransitionProps = {
  viewKey: string;
  children: React.ReactNode;
  className?: string;
};

/** In-page view switch — fade on desktop, instant panel swap on mobile. */
export function ViewTransition({
  viewKey,
  children,
  className = "",
}: ViewTransitionProps) {
  const mobileLite = useMobileLite();
  const panelClass = mobileLite
    ? "view-transition-panel view-transition-panel--instant"
    : "view-transition-panel";

  return (
    <div className={`view-transition-host ${className}`.trim()}>
      <div key={viewKey} className={panelClass}>
        {children}
      </div>
    </div>
  );
}
