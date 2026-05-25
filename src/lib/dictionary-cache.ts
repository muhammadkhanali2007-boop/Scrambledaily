/**
 * Loads the English word list from the project `/data` folder (one word per line).
 * Parsed once and kept in memory for all subsequent API requests.
 *
 * Import only from server code (e.g. Route Handlers) — uses Node `fs`.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { sortedLetterSignature, type DictionaryEntry } from "@/lib/unscramble";

const EMPTY_ERROR = "Dictionary not found or empty";

let cachedWords: readonly DictionaryEntry[] | null = null;
let cachedSourcePath: string | null = null;
/** Set after a failed load so we do not re-read a bad path on every request */
let cachedFailure: string | null = null;

function dataDir(): string {
  return join(process.cwd(), "data");
}

function scoreDictionaryFilename(name: string): number {
  const n = name.toLowerCase();
  if (!n.endsWith(".txt")) return -1;
  if (n === "words.txt") return 1_000;
  if (n.includes("english")) return 800;
  if (n.startsWith("words")) return 600;
  return 400;
}

/**
 * Picks the best `.txt` dictionary in `/data`, preferring `words.txt`,
 * then names that mention "english", then other `words*.txt` files.
 * On a tie, prefers the larger file (usually the fuller English list).
 */
export function pickBestDictionaryFile(
  dir: string,
  filenames: string[],
): string | null {
  const txts = filenames.filter((f) => /\.txt$/i.test(f));
  if (txts.length === 0) return null;

  let bestName: string | null = null;
  let bestScore = -1;
  let bestSize = -1;

  for (const name of txts) {
    const score = scoreDictionaryFilename(name);
    if (score < 0) continue;
    let size = 0;
    try {
      size = statSync(join(dir, name)).size;
    } catch {
      size = 0;
    }

    if (!bestName) {
      bestName = name;
      bestScore = score;
      bestSize = size;
      continue;
    }

    if (score > bestScore) {
      bestName = name;
      bestScore = score;
      bestSize = size;
    } else if (score === bestScore) {
      if (size > bestSize) {
        bestName = name;
        bestSize = size;
      } else if (
        size === bestSize &&
        name.localeCompare(bestName, "en", { sensitivity: "base" }) < 0
      ) {
        bestName = name;
      }
    }
  }

  return bestName;
}

/** Trim, lowercase, keep a–z only; require length ≥ 2 */
export function normalizeDictionaryLine(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  const letters = trimmed.replace(/[^a-z]/g, "");
  return letters.length >= 2 ? letters : null;
}

function parseDictionaryContent(content: string): DictionaryEntry[] {
  const seen = new Set<string>();
  const words: DictionaryEntry[] = [];

  for (const line of content.split(/\r?\n/)) {
    const w = normalizeDictionaryLine(line);
    if (!w || seen.has(w)) continue;
    seen.add(w);
    words.push({ word: w, sig: sortedLetterSignature(w) });
  }

  words.sort((a, b) => a.word.localeCompare(b.word));
  return words;
}

function loadDictionaryFromDisk():
  | { ok: true; words: readonly DictionaryEntry[]; path: string }
  | { ok: false; error: string } {
  const dir = dataDir();

  if (!existsSync(dir)) {
    return { ok: false, error: EMPTY_ERROR };
  }

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return { ok: false, error: EMPTY_ERROR };
  }

  const chosen = pickBestDictionaryFile(dir, entries);
  if (!chosen) {
    return { ok: false, error: EMPTY_ERROR };
  }

  const fullPath = join(dir, chosen);

  try {
    const st = statSync(fullPath);
    if (!st.isFile()) {
      return { ok: false, error: EMPTY_ERROR };
    }
  } catch {
    return { ok: false, error: EMPTY_ERROR };
  }

  let content: string;
  try {
    content = readFileSync(fullPath, "utf8");
  } catch {
    return { ok: false, error: EMPTY_ERROR };
  }

  const words = parseDictionaryContent(content);
  if (words.length === 0) {
    return { ok: false, error: EMPTY_ERROR };
  }

  return { ok: true, words, path: fullPath };
}

/**
 * Returns cached words after the first successful disk read.
 * On failure, the same error is returned without re-parsing the filesystem.
 */
export function getCachedDictionary():
  | { ok: true; words: readonly DictionaryEntry[]; sourcePath: string }
  | { ok: false; error: string } {
  if (cachedFailure) {
    return { ok: false, error: cachedFailure };
  }
  if (cachedWords && cachedSourcePath) {
    return { ok: true, words: cachedWords, sourcePath: cachedSourcePath };
  }

  const loaded = loadDictionaryFromDisk();
  if (!loaded.ok) {
    cachedFailure = loaded.error;
    return loaded;
  }

  cachedWords = loaded.words;
  cachedSourcePath = loaded.path;
  return {
    ok: true,
    words: cachedWords,
    sourcePath: cachedSourcePath,
  };
}

/** Test hook: clear module cache */
export function __resetDictionaryCache(): void {
  cachedWords = null;
  cachedSourcePath = null;
  cachedFailure = null;
}
