/**
 * Word scramble game helpers (separate from unscramble/anagram engine).
 */

import { wordHasContextualHints } from "@/lib/game-hint-lexicon";

export type GameDifficulty = "easy" | "medium" | "hard";

/** Consecutive correct answers needed to auto-promote Easy→Medium or Medium→Hard */
export const PROGRESS_TO_NEXT_LEVEL = 5;

/** Max wrong guesses for Easy and Hard (must match server session limit). */
export const BASE_MAX_WRONG = 4;

/** Wrong guesses allowed before game over (all difficulties). */
export function maxWrongForDifficulty(difficulty: GameDifficulty): number {
  void difficulty;
  return BASE_MAX_WRONG;
}

/** First N easy puzzles in a session use a tighter dopamine word pool */
export const EASY_DOPAMINE_ROUNDS = 5;

/** Curated 4-letter everyday words only (Easy mode never uses 5+ here). */
export const EASY_CURATED_4: readonly string[] = [
  "game",
  "tree",
  "fish",
  "book",
  "ship",
  "ball",
  "star",
  "cake",
  "fire",
  "wind",
  "lion",
  "king",
  "ring",
  "fork",
  "home",
  "milk",
  "road",
  "moon",
  "door",
  "rain",
  "hand",
  "time",
  "note",
  "face",
  "love",
  "blue",
  "song",
  "bird",
  "fast",
  "slow",
];

/** Ultra-safe first-session words for Easy (subset of EASY_CURATED_4). */
export const EASY_DOPAMINE_WORDS: readonly string[] = [
  "ball",
  "book",
  "star",
  "tree",
  "cake",
  "fish",
  "moon",
  "home",
  "game",
  "milk",
];

export function parseGameDifficulty(raw: string | null): GameDifficulty | null {
  if (!raw) return null;
  const n = raw.trim().toLowerCase();
  if (n === "easy" || n === "medium" || n === "hard") return n;
  return null;
}

/**
 * How many easy words the player has already solved this session (client-reported).
 * Used only for onboarding; clamped server-side.
 */
export function parseEasyCompletedThisSession(raw: string | null): number {
  if (raw == null || raw === "") return 0;
  const n = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 10_000);
}

export function scrambleLetters(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = chars[i];
    chars[i] = chars[j]!;
    chars[j] = t!;
  }
  let out = chars.join("");
  if (out === word && word.length > 1) {
    out = word[word.length - 1] + word.slice(1, -1) + word[0];
  }
  return out;
}

function hasDuplicateLetters(word: string): boolean {
  const seen = new Set<string>();
  for (const ch of word) {
    if (seen.has(ch)) return true;
    seen.add(ch);
  }
  return false;
}

function positionalMismatchCount(word: string, scrambled: string): number {
  let n = 0;
  const len = Math.min(word.length, scrambled.length);
  for (let i = 0; i < len; i++) {
    if (word[i] !== scrambled[i]) n += 1;
  }
  return n + Math.abs(word.length - scrambled.length);
}

function reverseString(s: string): string {
  return s.split("").reverse().join("");
}

/**
 * Scramble that stays solvable but avoids “sticky” letters (e.g. TREE→ERTE)
 * by favoring permutations that move as many letters off their original slots
 * as the multiset allows.
 */
export function scrambleLettersFriendly(word: string): string {
  const w = word.toLowerCase();
  if (w.length <= 1) return w;

  const dup = hasDuplicateLetters(w);
  const minMismatch =
    w.length <= 4 ? (dup ? Math.min(3, w.length) : w.length) : dup
      ? Math.max(2, Math.floor(w.length * 0.75))
      : w.length;

  const rev = reverseString(w);
  let best = scrambleLetters(w);
  let bestScore = positionalMismatchCount(w, best);

  for (let attempt = 0; attempt < 96; attempt++) {
    const candidate = scrambleLetters(w);
    if (candidate === w) continue;
    if (w.length >= 4 && candidate === rev) continue;

    const score = positionalMismatchCount(w, candidate);
    if (score >= minMismatch) return candidate;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

export type WordPickSource = { word: string };

function randomEntry(
  list: readonly WordPickSource[],
): WordPickSource | null {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)]!;
}

function randomFrom<T>(arr: readonly T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * @deprecated Use pickEasyWordForSession + buildEasyWordPool on the server.
 * Kept for tests/fallback only.
 */
export function pickEasyCuratedWord(easyCompletedThisSession: number): string | null {
  const dopamine =
    easyCompletedThisSession < EASY_DOPAMINE_ROUNDS &&
    EASY_DOPAMINE_WORDS.length > 0;
  const pool = dopamine ? EASY_DOPAMINE_WORDS : EASY_CURATED_4;
  return randomFrom(pool);
}

/** Drop rare Q-without-U patterns and other awkward racks. */
function isBeginnerFriendlyWord(word: string): boolean {
  if (word.includes("q") && !word.includes("qu")) return false;
  return true;
}

/** Hard mode: avoid frustrating racks (e.g. four of the same letter). */
function hasExcessiveRepeatedLetters(word: string): boolean {
  const counts = new Map<string, number>();
  for (const ch of word) {
    const n = (counts.get(ch) ?? 0) + 1;
    counts.set(ch, n);
    if (n >= 4) return true;
  }
  return false;
}

/** Hard pool: 6–7 letters only, recognizable and fair on mobile. */
function isHardEligibleWord(word: string): boolean {
  const len = word.length;
  if (len !== 6 && len !== 7) return false;
  if (!isBeginnerFriendlyWord(word)) return false;
  if (hasExcessiveRepeatedLetters(word)) return false;
  return true;
}

/** ~12% of Hard picks are 7 letters; the rest are 6 letters. */
const HARD_SEVEN_LETTER_RATE = 0.12;

export function pickRandomHardWord(
  entries: readonly WordPickSource[],
): string | null {
  const eligible = entries.filter((e) => isHardEligibleWord(e.word));
  if (!eligible.length) return null;

  const hinted = eligible.filter((e) => wordHasContextualHints(e.word));
  const source = hinted.length ? hinted : eligible;

  const len6 = source.filter((e) => e.word.length === 6);
  const len7 = source.filter((e) => e.word.length === 7);

  if (Math.random() < HARD_SEVEN_LETTER_RATE && len7.length) {
    return randomEntry(len7)?.word ?? null;
  }
  if (len6.length) return randomEntry(len6)?.word ?? null;
  if (len7.length) return randomEntry(len7)?.word ?? null;

  return randomEntry(source)?.word ?? null;
}

/**
 * Picks a random dictionary word for the given difficulty band.
 * Easy: curated 4-letter list only (caller supplies easy session index).
 * Medium: mostly 5-letter words from dictionary.
 * Hard: mostly 6-letter words, rarely 7 (never 8+).
 */
export function pickRandomGameWordForDifficulty(
  entries: readonly WordPickSource[],
  difficulty: GameDifficulty,
  easyCompletedThisSession = 0,
): string | null {
  if (difficulty === "easy") {
    return pickEasyCuratedWord(easyCompletedThisSession);
  }

  if (!entries.length) return null;

  if (difficulty === "medium") {
    const pool = entries.filter(
      (e) =>
        e.word.length === 5 &&
        isBeginnerFriendlyWord(e.word) &&
        wordHasContextualHints(e.word),
    );
    const fallback = entries.filter(
      (e) => e.word.length === 5 && isBeginnerFriendlyWord(e.word),
    );
    return randomEntry(pool)?.word ?? randomEntry(fallback)?.word ?? null;
  }

  if (difficulty === "hard") {
    return pickRandomHardWord(entries);
  }

  return pickRandomGameWord(entries);
}

/**
 * Streak Challenge word slot: 1 = 5-letter medium ramp; 2–6 = hard pool.
 */
export function pickStreakChallengeWord(
  entries: readonly WordPickSource[],
  slot: number,
): string | null {
  if (!entries.length) return null;

  if (slot <= 1) {
    const pool = entries.filter(
      (e) =>
        e.word.length === 5 &&
        isBeginnerFriendlyWord(e.word) &&
        wordHasContextualHints(e.word),
    );
    const fallback = entries.filter(
      (e) => e.word.length === 5 && isBeginnerFriendlyWord(e.word),
    );
    return randomEntry(pool)?.word ?? randomEntry(fallback)?.word ?? null;
  }

  return pickRandomHardWord(entries);
}

/** Prefer medium-length words for a better game feel. */
export function pickRandomGameWord(
  entries: readonly WordPickSource[],
): string | null {
  if (!entries.length) return null;
  const pool = entries.filter(
    (e) => e.word.length >= 4 && e.word.length <= 12,
  );
  const list = pool.length > 0 ? pool : entries.filter((e) => e.word.length >= 3);
  if (!list.length) return null;
  const i = Math.floor(Math.random() * list.length);
  return list[i]!.word;
}

export function normalizeGuess(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z]/g, "");
}
