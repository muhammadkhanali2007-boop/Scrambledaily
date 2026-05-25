import { NextResponse } from "next/server";
import { getCachedDictionary } from "@/lib/dictionary-cache";
import { buildStreakWordPool } from "@/lib/streak-word-pools";
import { pickStreakWordForSession } from "@/lib/streak-word-session-store";
import { createStreakSession } from "@/lib/streak-session-store";
import { streakWordSlotForProgress } from "@/lib/streak-challenge";
import { scrambleLetters, scrambleLettersFriendly } from "@/lib/word-game";

function resolveStreakSessionId(raw: string | null): string {
  const trimmed = raw?.trim() ?? "";
  if (trimmed.length >= 8 && trimmed.length <= 64) return trimmed;
  return crypto.randomUUID();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const progressRaw = url.searchParams.get("progress");
  const progress = progressRaw
    ? Math.max(0, Math.min(5, Number.parseInt(progressRaw, 10) || 0))
    : 0;

  const dict = getCachedDictionary();
  if (!dict.ok) {
    return NextResponse.json({ error: dict.error }, { status: 503 });
  }

  const pool = buildStreakWordPool(dict.words);
  if (!pool.all.length) {
    return NextResponse.json(
      { error: "No words available for Streak Challenge." },
      { status: 503 },
    );
  }

  const streakSessionId = resolveStreakSessionId(
    url.searchParams.get("streakSessionId"),
  );

  const slot = streakWordSlotForProgress(progress);
  const answer = pickStreakWordForSession(streakSessionId, pool, slot);
  if (!answer) {
    return NextResponse.json(
      { error: "No words available for Streak Challenge." },
      { status: 503 },
    );
  }

  const gameId = createStreakSession(answer, slot);
  const scrambledWord =
    slot === 1 ? scrambleLettersFriendly(answer) : scrambleLetters(answer);

  return NextResponse.json({
    gameId,
    scrambledWord,
    slot,
    letterCount: answer.length,
    streakSessionId,
  });
}
