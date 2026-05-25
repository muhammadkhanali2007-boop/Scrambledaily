import { NextResponse } from "next/server";
import { getCachedDictionary } from "@/lib/dictionary-cache";
import {
  parseRack,
  unscrambleFromDictionary,
  type SolverMode,
  type UnscrambleFilters,
} from "@/lib/unscramble";

type Body = {
  letters?: unknown;
  mode?: unknown;
  filters?: {
    startsWith?: unknown;
    endsWith?: unknown;
    contains?: unknown;
    wordLength?: unknown;
  };
};

function asNonEmptyString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

function asOptionalString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

function asSolverMode(v: unknown): SolverMode {
  if (v === "anagram") return "anagram";
  return "unscramble";
}

export async function POST(req: Request) {
  const dict = getCachedDictionary();
  if (!dict.ok) {
    return NextResponse.json({ error: dict.error }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const letters = asNonEmptyString(body.letters);
  if (!letters) {
    return NextResponse.json(
      { error: "Please enter at least one letter or ? wildcard." },
      { status: 400 },
    );
  }

  if (parseRack(letters) === null) {
    return NextResponse.json(
      {
        error:
          "Only letters A–Z and ? are allowed. Remove numbers or symbols.",
      },
      { status: 400 },
    );
  }

  const mode = asSolverMode(body.mode);

  const f = body.filters;
  const filters: UnscrambleFilters | undefined = f
    ? {
        startsWith: asOptionalString(f.startsWith),
        endsWith: asOptionalString(f.endsWith),
        contains: asOptionalString(f.contains),
        wordLength: asOptionalString(f.wordLength),
      }
    : undefined;

  const { words } = unscrambleFromDictionary(dict.words, {
    letters,
    filters,
    mode,
  });

  return NextResponse.json({ matches: words });
}
