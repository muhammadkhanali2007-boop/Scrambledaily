/**
 * Downloads a public-domain style word list and writes `data/words.txt`
 * (one word per line) for the local dictionary loader.
 * Run: npm run build:words
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../data/words.txt");

const SOURCE =
  "https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt";

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const text = await res.text();
  const words = [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((w) => w.trim().toLowerCase())
        .filter((w) => /^[a-z]{2,24}$/.test(w)),
    ),
  ].sort((a, b) => a.localeCompare(b));

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${words.join("\n")}\n`, "utf8");
  console.log(`Wrote ${words.length} words to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
