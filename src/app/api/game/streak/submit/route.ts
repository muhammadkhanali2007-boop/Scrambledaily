import { NextResponse } from "next/server";
import {
  deleteStreakSession,
  getStreakSession,
} from "@/lib/streak-session-store";
import { normalizeGuess } from "@/lib/word-game";

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

  const session = getStreakSession(gameId);
  if (!session) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  const guess = normalizeGuess(guessRaw ?? "");
  if (!guess.length) {
    return NextResponse.json({ error: "guess is required." }, { status: 400 });
  }

  deleteStreakSession(gameId);

  if (guess === session.answer) {
    return NextResponse.json({ status: "correct" });
  }

  return NextResponse.json({ status: "wrong" });
}
