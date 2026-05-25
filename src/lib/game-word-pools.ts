/**
 * Difficulty word pools built from the on-disk dictionary.
 */

import {
  wordHasContextualHints,
  wordHasMediumProgressiveHints,
} from "@/lib/game-hint-lexicon";
import { EASY_CURATED_4 } from "@/lib/word-game";

export type WordPickSource = { word: string };

const MIN_EASY_POOL = 200;
const TARGET_EASY_POOL = 650;

const MIN_MEDIUM_POOL = 300;
const TARGET_MEDIUM_POOL = 800;

const HARD_SIX_LETTER_CAP = 15;

let cachedEasy: readonly string[] | null = null;
let cachedMedium: readonly string[] | null = null;
let cachedHard: HardWordPool | null = null;

/** Hard mode buckets: 6 (small cap), 7, and 8 letters only (never 9+). */
export type HardWordPool = {
  len6: readonly string[];
  len7: readonly string[];
  len8: readonly string[];
  /** Union of all buckets — used for exhaustion checks. */
  all: readonly string[];
};

function isBeginnerFriendlyWord(word: string): boolean {
  if (word.includes("q") && !word.includes("qu")) return false;
  return true;
}

function isBeginnerFriendlyFourLetter(word: string): boolean {
  if (word.length !== 4) return false;
  if (!/^[a-z]+$/.test(word)) return false;
  return isBeginnerFriendlyWord(word);
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

function isMediumEligible(word: string): boolean {
  const len = word.length;
  if (len < 5 || len > 6) return false;
  if (!/^[a-z]+$/.test(word)) return false;
  return isBeginnerFriendlyWord(word);
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
  return arr;
}

/** Hard pool: 6–8 letters only (9+ excluded). */
function isHardEligible(word: string): boolean {
  const len = word.length;
  if (len < 6 || len > 8) return false;
  if (!/^[a-z]+$/.test(word)) return false;
  if (!isBeginnerFriendlyWord(word)) return false;
  if (hasExcessiveRepeatedLetters(word)) return false;
  return true;
}

function growPool(
  primary: Set<string>,
  secondary: string[],
  minSize: number,
  targetSize: number,
): string[] {
  if (primary.size < minSize) {
    for (const w of secondary) {
      primary.add(w);
      if (primary.size >= targetSize) break;
    }
  } else if (primary.size < targetSize) {
    for (const w of secondary) {
      if (primary.has(w)) continue;
      primary.add(w);
      if (primary.size >= targetSize) break;
    }
  }
  return [...primary].sort((a, b) => a.localeCompare(b));
}

export function buildEasyWordPool(
  entries: readonly WordPickSource[],
): readonly string[] {
  if (cachedEasy) return cachedEasy;

  const hinted = new Set<string>(EASY_CURATED_4);
  const plain: string[] = [];

  for (const { word } of entries) {
    const w = word.toLowerCase();
    if (!isBeginnerFriendlyFourLetter(w)) continue;
    if (wordHasContextualHints(w)) {
      hinted.add(w);
    } else {
      plain.push(w);
    }
  }

  cachedEasy = growPool(hinted, plain, MIN_EASY_POOL, TARGET_EASY_POOL);
  return cachedEasy;
}

export function buildMediumWordPool(
  entries: readonly WordPickSource[],
): readonly string[] {
  if (cachedMedium) return cachedMedium;

  const hinted = new Set<string>();
  const plain: string[] = [];

  for (const { word } of entries) {
    const w = word.toLowerCase();
    if (!isMediumEligible(w)) continue;
    if (wordHasMediumProgressiveHints(w)) {
      hinted.add(w);
    } else {
      plain.push(w);
    }
  }

  const plainWithHints = plain.filter((w) => wordHasMediumProgressiveHints(w));
  cachedMedium = growPool(
    hinted,
    plainWithHints,
    MIN_MEDIUM_POOL,
    TARGET_MEDIUM_POOL,
  );
  return cachedMedium;
}

export function buildHardWordPool(
  entries: readonly WordPickSource[],
): HardWordPool {
  if (cachedHard) return cachedHard;

  const len6Candidates: string[] = [];
  const len7 = new Set<string>();
  const len8 = new Set<string>();

  for (const { word } of entries) {
    const w = word.toLowerCase();
    if (!isHardEligible(w)) continue;
    if (w.length === 6) len6Candidates.push(w);
    else if (w.length === 7) len7.add(w);
    else if (w.length === 8) len8.add(w);
  }

  shuffleInPlace(len6Candidates);
  const len6 = len6Candidates.slice(0, HARD_SIX_LETTER_CAP);
  const len7Sorted = [...len7].sort((a, b) => a.localeCompare(b));
  const len8Sorted = [...len8].sort((a, b) => a.localeCompare(b));

  cachedHard = {
    len6,
    len7: len7Sorted,
    len8: len8Sorted,
    all: [...len6, ...len7Sorted, ...len8Sorted],
  };
  return cachedHard;
}

/** @internal Test helper — reset cached pools between tests. */
export function resetGameWordPoolCacheForTests(): void {
  cachedEasy = null;
  cachedMedium = null;
  cachedHard = null;
}
