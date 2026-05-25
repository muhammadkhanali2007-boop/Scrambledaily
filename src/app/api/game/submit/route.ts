import { NextResponse } from "next/server";
import { buildWrongHintFromAnswer } from "@/lib/game-hint-lexicon";
import {
  deleteGameSession,
  getGameSession,
  incrementWrongCount,
} from "@/lib/game-session-store";
import { maxWrongForDifficulty, normalizeGuess, type GameDifficulty } from "@/lib/word-game";

type Body = {
  gameId?: unknown;
  guess?: unknown;
};

function asString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  return v;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const gameId = asString(body.gameId)?.trim();
  const guessRaw = asString(body.guess);
  if (!gameId) {
    return NextResponse.json({ error: "gameId is required." }, { status: 400 });
  }

  const session = getGameSession(gameId);
  if (!session) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  const guess = normalizeGuess(guessRaw ?? "");
  if (!guess.length) {
    return NextResponse.json({ error: "guess is required." }, { status: 400 });
  }

  if (guess === session.answer) {
    deleteGameSession(gameId);
    return NextResponse.json({ status: "success", message: "Good" });
  }

  const after = incrementWrongCount(gameId);
  if (!after) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  const difficulty: GameDifficulty = after.difficulty ?? "hard";
  const maxWrong = maxWrongForDifficulty(difficulty);

  if (after.wrongCount < maxWrong) {
    const hint = buildWrongHintFromAnswer(
      after.wrongCount,
      after.answer,
      difficulty,
    );

    return NextResponse.json({
      status: "wrong",
      message: "Try again",
      attemptsLeft: maxWrong - after.wrongCount,
      hint,
    });
  }

  const answer = after.answer;
  deleteGameSession(gameId);
  return NextResponse.json({
    status: "failed",
    message: "Word changed",
    answer,
  });
}
