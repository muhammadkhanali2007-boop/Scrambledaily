/** Canonical routes for solver tools (no hash-based routing). */

export const UNSCRAMBLER_PATH = "/unscramble";

export const ANAGRAM_SOLVER_PATH = "/unscramble/anagram";

export type SolverPageVariant = "unscrambler" | "anagram";

export function solverVariantFromPath(pathname: string): SolverPageVariant {
  return pathname === ANAGRAM_SOLVER_PATH ? "anagram" : "unscrambler";
}
