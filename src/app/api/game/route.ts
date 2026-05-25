import { NextResponse } from "next/server";
import { getCachedDictionary } from "@/lib/dictionary-cache";
import {
  buildEasyWordPool,
  buildHardWordPool,
  buildMediumWordPool,
  type HardWordPool,
} from "@/lib/game-word-pools";
import { pickWordForSession } from "@/lib/game-word-session-store";
import { createGameSession } from "@/lib/game-session-store";
import {
  maxWrongForDifficulty,
  parseEasyCompletedThisSession,
  parseGameDifficulty,
  scrambleLetters,
  scrambleLettersFriendly,
  type GameDifficulty,
} from "@/lib/word-game";

function resolveGameSessionId(
  gameSessionId: string | null,
  easySessionId: string | null,
): string {
  const raw = gameSessionId?.trim() || easySessionId?.trim() || "";
  if (raw.length >= 8 && raw.length <= 64) return raw;
  return crypto.randomUUID();
}

function poolForDifficulty(
  entries: readonly { word: string }[],
  difficulty: GameDifficulty,
): readonly string[] | HardWordPool {
  if (difficulty === "easy") return buildEasyWordPool(entries);
  if (difficulty === "medium") return buildMediumWordPool(entries);
  return buildHardWordPool(entries);
}

function poolHasWords(
  pool: readonly string[] | HardWordPool,
): boolean {
  if ("all" in pool) return pool.all.length > 0;
  return pool.length > 0;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const difficulty =
    parseGameDifficulty(url.searchParams.get("difficulty")) ?? "easy";
  const easyCompleted = parseEasyCompletedThisSession(
    url.searchParams.get("easyCompleted"),
  );

  const dict = getCachedDictionary();

  if (difficulty !== "easy" && !dict.ok) {
    return NextResponse.json(
      { error: dict.error },
      { status: 503 },
    );
  }

  const entries = dict.ok ? dict.words : [];
  const pool = poolForDifficulty(entries, difficulty);

  if (!poolHasWords(pool)) {
    return NextResponse.json(
      { error: `No words available for ${difficulty} mode.` },
      { status: 503 },
    );
  }

  const gameSessionId = resolveGameSessionId(
    url.searchParams.get("gameSessionId"),
    url.searchParams.get("easySessionId"),
  );

  const hardPool = difficulty === "hard" && "all" in pool ? pool : undefined;
  const flatPool: readonly string[] = hardPool
    ? hardPool.all
    : (pool as readonly string[]);

  const answer = pickWordForSession(gameSessionId, {
    difficulty,
    pool: flatPool,
    hardPool,
    easyCompletedThisSession: easyCompleted,
  });

  if (!answer) {
    return NextResponse.json(
      { error: "No words available for this difficulty." },
      { status: 503 },
    );
  }

  const gameId = createGameSession(answer, difficulty);
  const scrambledWord =
    difficulty === "easy" || difficulty === "hard"
      ? scrambleLettersFriendly(answer)
      : scrambleLetters(answer);

  return NextResponse.json({
    gameId,
    scrambledWord,
    difficulty,
    maxWrong: maxWrongForDifficulty(difficulty),
    gameSessionId,
    easySessionId: gameSessionId,
  });
}
