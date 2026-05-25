"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ANAGRAM_SOLVER_PATH,
  UNSCRAMBLER_PATH,
} from "@/lib/solver-routes";

/**
 * One-time legacy redirect: old hash URLs → pathname routes.
 * Does not patch history; runs in useEffect only.
 */
export function SolverHashRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const key = `${pathname}${hash}`;
    if (!hash || handledRef.current === key) return;

    if (pathname === UNSCRAMBLER_PATH && hash === "#anagram") {
      handledRef.current = key;
      router.replace(ANAGRAM_SOLVER_PATH);
      return;
    }
    if (pathname === ANAGRAM_SOLVER_PATH && hash === "#unscrambler") {
      handledRef.current = key;
      router.replace(UNSCRAMBLER_PATH);
      return;
    }
    if (pathname === UNSCRAMBLER_PATH && hash === "#unscrambler") {
      handledRef.current = key;
      router.replace(UNSCRAMBLER_PATH);
    }
  }, [pathname, router]);

  return null;
}
