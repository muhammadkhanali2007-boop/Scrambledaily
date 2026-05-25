/**
 * Random word selection from a pool with per-session used-word tracking.
 */

import type { HardWordPool } from "@/lib/game-word-pools";
import {
  EASY_DOPAMINE_ROUNDS,
  EASY_DOPAMINE_WORDS,
} from "@/lib/word-game";

const HARD_LENGTH_WEIGHTS: ReadonlyArray<{ len: 6 | 7 | 8; weight: number }> = [
  { len: 7, weight: 0.6 },
  { len: 8, weight: 0.3 },
  { len: 6, weight: 0.1 },
];

export function pickRandomUnusedWord(
  pool: readonly string[],
  usedWords: Set<string>,
): string | null {
  if (!pool.length) return null;

  const normalizedPool = pool.map((w) => w.toLowerCase());
  let candidates = normalizedPool.filter((w) => !usedWords.has(w));

  if (!candidates.length) {
    usedWords.clear();
    candidates = [...normalizedPool];
  }

  const word = candidates[Math.floor(Math.random() * candidates.length)]!;
  usedWords.add(word);
  return word;
}

export function pickEasyWordFromPool(
  pool: readonly string[],
  usedWords: Set<string>,
  easyCompletedThisSession: number,
): string | null {
  if (!pool.length) return null;

  const useDopamine =
    easyCompletedThisSession < EASY_DOPAMINE_ROUNDS &&
    EASY_DOPAMINE_WORDS.length > 0;

  if (useDopamine) {
    const dopamineSet = new Set(
      EASY_DOPAMINE_WORDS.map((w) => w.toLowerCase()),
    );
    const dopaminePool = pool.filter((w) => dopamineSet.has(w.toLowerCase()));
    if (dopaminePool.length) {
      return pickRandomUnusedWord(dopaminePool, usedWords);
    }
  }

  return pickRandomUnusedWord(pool, usedWords);
}

function unusedByLength(
  hardPool: HardWordPool,
  usedWords: Set<string>,
): Record<6 | 7 | 8, string[]> {
  return {
    6: hardPool.len6.filter((w) => !usedWords.has(w)),
    7: hardPool.len7.filter((w) => !usedWords.has(w)),
    8: hardPool.len8.filter((w) => !usedWords.has(w)),
  };
}

function pickWeightedHardLength(
  available: ReadonlyArray<{ len: 6 | 7 | 8; weight: number }>,
): 6 | 7 | 8 {
  const total = available.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of available) {
    roll -= item.weight;
    if (roll <= 0) return item.len;
  }
  return available[available.length - 1]!.len;
}

function pickRandomFromList(words: readonly string[]): string | null {
  if (!words.length) return null;
  return words[Math.floor(Math.random() * words.length)]!;
}

/**
 * Hard mode: weighted length (60% × 7, 30% × 8, 10% × 6) with used-word tracking.
 */
export function pickHardWordFromPool(
  hardPool: HardWordPool,
  usedWords: Set<string>,
): string | null {
  if (!hardPool.all.length) return null;

  let unused = unusedByLength(hardPool, usedWords);

  if (!unused[6].length && !unused[7].length && !unused[8].length) {
    usedWords.clear();
    unused = unusedByLength(hardPool, usedWords);
  }

  const availableWeights = HARD_LENGTH_WEIGHTS.filter(
    (item) => unused[item.len].length > 0,
  );

  if (!availableWeights.length) return null;

  const chosenLen = pickWeightedHardLength(availableWeights);
  let candidates = unused[chosenLen];

  if (!candidates.length) {
    candidates =
      unused[7].length ? unused[7] : unused[8].length ? unused[8] : unused[6];
  }

  const word = pickRandomFromList(candidates);
  if (!word) return null;

  usedWords.add(word);
  return word;
}
