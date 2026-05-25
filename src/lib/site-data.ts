/** Static copy for sidebar and navigation (no backend). */

import { ANAGRAM_SOLVER_PATH, UNSCRAMBLER_PATH } from "@/lib/solver-routes";

export const popularTools = [
  { label: "Word Unscrambler", href: UNSCRAMBLER_PATH },
  { label: "Anagram Finder", href: ANAGRAM_SOLVER_PATH },
  { label: "Jumble Solver", href: UNSCRAMBLER_PATH },
];

export const tips = [
  "Sort letters alphabetically to spot patterns faster.",
  "Use ? as a wildcard when one letter is unknown.",
  "Filter by length to match game board slots.",
];
