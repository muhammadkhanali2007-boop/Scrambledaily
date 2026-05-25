/**
 * Streak Challenge word pool — large, varied, hardest dictionary words.
 */

import type { WordPickSource } from "@/lib/game-word-pools";

const MIN_STREAK_POOL = 300;
const TARGET_STREAK_POOL = 600;

let cachedStreakPool: StreakWordPool | null = null;

export type StreakWordPool = {
  /** 5-letter ramp words (first slot). */
  ramp: readonly string[];
  /** 6–8 letter challenge words (slots 2–6 and bulk of the pool). */
  main: readonly string[];
  /** Union of ramp + main for exhaustion checks. */
  all: readonly string[];
};

function isBeginnerFriendlyWord(word: string): boolean {
  if (word.includes("q") && !word.includes("qu")) return false;
  return true;
}

function hasExcessiveRepeatedLetters(word: string): boolean {
  const counts = new Map<string, number>();
  for (const ch of word) {
    const n = (counts.get(ch) ?? 0) + 1;
    counts.set(ch, n);
    if (n >= 4) return true;
  }
  return false;
}

function isStreakRampWord(word: string): boolean {
  return (
    word.length === 5 &&
    /^[a-z]+$/.test(word) &&
    isBeginnerFriendlyWord(word)
  );
}

function isStreakMainWord(word: string): boolean {
  const len = word.length;
  if (len < 6 || len > 8) return false;
  if (!/^[a-z]+$/.test(word)) return false;
  if (!isBeginnerFriendlyWord(word)) return false;
  if (hasExcessiveRepeatedLetters(word)) return false;
  return true;
}

function isStreakFillWord(word: string): boolean {
  const len = word.length;
  if (len < 5 || len > 8) return false;
  if (!/^[a-z]+$/.test(word)) return false;
  return isBeginnerFriendlyWord(word) && !hasExcessiveRepeatedLetters(word);
}

/**
 * Build a large Streak pool (300+ words): all eligible 6–8 letter words plus 5-letter ramp.
 */
export function buildStreakWordPool(
  entries: readonly WordPickSource[],
): StreakWordPool {
  if (cachedStreakPool) return cachedStreakPool;

  const ramp = new Set<string>();
  const main = new Set<string>();

  for (const { word } of entries) {
    const w = word.toLowerCase();
    if (isStreakRampWord(w)) ramp.add(w);
    if (isStreakMainWord(w)) main.add(w);
  }

  if (main.size < MIN_STREAK_POOL) {
    for (const { word } of entries) {
      const w = word.toLowerCase();
      if (!isStreakFillWord(w) || ramp.has(w)) continue;
      if (w.length >= 5) main.add(w);
      if (main.size >= TARGET_STREAK_POOL) break;
    }
  }

  if (main.size < MIN_STREAK_POOL) {
    for (const { word } of entries) {
      const w = word.toLowerCase();
      if (!isStreakFillWord(w)) continue;
      main.add(w);
      if (main.size >= TARGET_STREAK_POOL) break;
    }
  }

  const rampSorted = [...ramp].sort((a, b) => a.localeCompare(b));
  const mainSorted = [...main].sort((a, b) => a.localeCompare(b));
  const all = [...new Set([...rampSorted, ...mainSorted])];

  cachedStreakPool = {
    ramp: rampSorted,
    main: mainSorted,
    all,
  };
  return cachedStreakPool;
}

/** @internal Test helper — reset cached pool between tests. */
export function resetStreakWordPoolCacheForTests(): void {
  cachedStreakPool = null;
}
