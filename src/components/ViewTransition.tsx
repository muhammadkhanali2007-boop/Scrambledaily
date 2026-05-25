"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const FADE_DURATION = 0.28;

type ViewTransitionProps = {
  viewKey: string;
  children: React.ReactNode;
  className?: string;
};

/** In-page fade (e.g. main game ↔ Streak Challenge) without route change. */
export function ViewTransition({
  viewKey,
  children,
  className,
}: ViewTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewKey}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: reduceMotion ? 0 : FADE_DURATION,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
