/**
 * Word Unscramble Game word finder: match dictionary words against a letter rack.
 * - Multiset / “sorted signature” path when there are no wildcards (fast two-pointer).
 * - Frequency + wildcard path when the rack contains ? tiles.
 *
 * Modes:
 * - unscramble: any word spellable from the rack (subset of tiles; ? are blanks).
 * - anagram: words that use every tile exactly (full-length anagrams; ? count as tiles).
 */

export type SolverMode = "unscramble" | "anagram";

export type UnscrambleFilters = {
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  /** Exact length, or "8+" for eight or more */
  wordLength?: string;
};

export type UnscrambleInput = {
  letters: string;
  filters?: UnscrambleFilters;
  /** Defaults to "unscramble". */
  mode?: SolverMode;
};

/** One dictionary row with a precomputed sorted multiset signature. */
export type DictionaryEntry = {
  word: string;
  sig: string;
};

export type ResultGroup = {
  length: number;
  words: string[];
};

export type UnscrambleResult = {
  groups: ResultGroup[];
  words: string[];
  total: number;
};

const MAX_LETTERS = 32;

/** Sorted lowercase letters only (multiset signature string). */
export function sortedLetterSignature(letters: string): string {
  return letters.toLowerCase().replace(/[^a-z]/g, "").split("").sort().join("");
}

/**
 * True when every letter of `wordSorted` can be drawn from `rackSorted`
 * (both ascending, duplicates preserved). Classic multiset subset on sorted strings.
 */
export function sortedMultisetSubset(wordSorted: string, rackSorted: string): boolean {
  let i = 0;
  let j = 0;
  while (j < wordSorted.length) {
    if (i >= rackSorted.length) return false;
    if (rackSorted[i] === wordSorted[j]) {
      i++;
      j++;
    } else if (rackSorted[i] < wordSorted[j]) {
      i++;
    } else {
      return false;
    }
  }
  return true;
}

/** Expand letter counts into a sorted multiset string, e.g. {a:2,b:1} -> "aab" */
export function countsToSortedString(counts: Map<string, number>): string {
  const parts: string[] = [];
  for (const [ch, n] of [...counts.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    if (n > 0) parts.push(ch.repeat(n));
  }
  return parts.join("");
}

/** Parse rack: lowercase letters + ? wildcards; spaces stripped */
export function parseRack(raw: string): {
  counts: Map<string, number>;
  wildcards: number;
} | null {
  const counts = new Map<string, number>();
  let wildcards = 0;

  for (const ch of raw.toLowerCase()) {
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") continue;
    if (ch === "?") {
      wildcards += 1;
      continue;
    }
    if (ch < "a" || ch > "z") return null;
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }

  const letterTotal = [...counts.values()].reduce((a, b) => a + b, 0);
  if (letterTotal + wildcards === 0) return null;
  if (letterTotal + wildcards > MAX_LETTERS) return null;

  return { counts, wildcards };
}

/**
 * True if `word` can be built from the rack (each letter consumes a tile;
 * wildcards fill gaps). Used when `?` is present.
 */
export function canSpellFromRackWithWildcards(
  word: string,
  counts: Map<string, number>,
  wildcards: number,
): boolean {
  let wild = wildcards;
  const bag = new Map(counts);

  for (const c of word) {
    const left = bag.get(c) ?? 0;
    if (left > 0) {
      bag.set(c, left - 1);
    } else if (wild > 0) {
      wild -= 1;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * True if the word uses every rack letter and every ? (no tiles left unused).
 * Used for anagram mode with or without wildcards.
 */
export function usesEntireRack(
  word: string,
  counts: Map<string, number>,
  wildcards: number,
): boolean {
  let wild = wildcards;
  const bag = new Map(counts);

  for (const c of word) {
    const left = bag.get(c) ?? 0;
    if (left > 0) {
      bag.set(c, left - 1);
    } else if (wild > 0) {
      wild -= 1;
    } else {
      return false;
    }
  }

  if (wild !== 0) return false;
  for (const left of bag.values()) {
    if (left !== 0) return false;
  }
  return true;
}

function normalizeFilter(s: string | undefined): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function passesFilters(
  word: string,
  filters: UnscrambleFilters | undefined,
): boolean {
  if (!filters) return true;

  const starts = normalizeFilter(filters.startsWith);
  const ends = normalizeFilter(filters.endsWith);
  const contains = normalizeFilter(filters.contains);
  const lenOpt = filters.wordLength?.trim();

  if (starts && !word.startsWith(starts)) return false;
  if (ends && !word.endsWith(ends)) return false;
  if (contains && !word.includes(contains)) return false;

  if (lenOpt && lenOpt !== "Any length") {
    if (lenOpt === "8+") {
      if (word.length < 8) return false;
    } else {
      const n = Number(lenOpt);
      if (Number.isFinite(n) && n > 0 && word.length !== n) return false;
    }
  }

  return true;
}

/** Longest first, then A–Z (for matches list and UI grouping). */
export function sortMatches(words: readonly string[]): string[] {
  return [...words].sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return a.localeCompare(b);
  });
}

export function groupMatchesByLength(sortedWords: readonly string[]): ResultGroup[] {
  const byLength = new Map<number, string[]>();
  for (const w of sortedWords) {
    const arr = byLength.get(w.length) ?? [];
    arr.push(w);
    byLength.set(w.length, arr);
  }
  const lengths = [...byLength.keys()].sort((a, b) => b - a);
  return lengths.map((length) => ({
    length,
    words: byLength.get(length) ?? [],
  }));
}

/**
 * Returns unique words, longest first, then alphabetical, plus length groups.
 * Dictionary entries should include precomputed `sig` (see dictionary loader).
 */
export function unscrambleFromDictionary(
  dictionary: readonly DictionaryEntry[],
  input: UnscrambleInput,
): UnscrambleResult {
  const rack = parseRack(input.letters);
  if (!rack) {
    return { groups: [], words: [], total: 0 };
  }

  const mode: SolverMode = input.mode === "anagram" ? "anagram" : "unscramble";
  const { counts, wildcards } = rack;
  const filters = input.filters;
  const seen = new Set<string>();
  const matches: string[] = [];

  const rackSorted =
    wildcards === 0 ? countsToSortedString(counts) : "";

  for (const row of dictionary) {
    const word = row.word;
    if (seen.has(word)) continue;

    const fits =
      wildcards > 0
        ? canSpellFromRackWithWildcards(word, counts, wildcards)
        : sortedMultisetSubset(row.sig, rackSorted);

    if (!fits) continue;
    if (mode === "anagram" && !usesEntireRack(word, counts, wildcards)) {
      continue;
    }
    if (!passesFilters(word, filters)) continue;
    seen.add(word);
    matches.push(word);
  }

  const sorted = sortMatches(matches);
  const groups = groupMatchesByLength(sorted);

  return { groups, words: sorted, total: sorted.length };
}
