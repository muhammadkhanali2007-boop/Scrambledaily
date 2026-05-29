"use client";

type ViewTransitionProps = {
  viewKey: string;
  children: React.ReactNode;
  className?: string;
};

/** In-page fade (e.g. main game ↔ Streak) — CSS only, no height-collapsing wait mode. */
export function ViewTransition({
  viewKey,
  children,
  className = "",
}: ViewTransitionProps) {
  return (
    <div className={`view-transition-host ${className}`.trim()}>
      <div key={viewKey} className="view-transition-panel">
        {children}
      </div>
    </div>
  );
}
