/**
 * Server-side game session: tracks used words per difficulty (in-memory, TTL).
 */

import type { HardWordPool } from "@/lib/game-word-pools";
import {
  pickEasyWordFromPool,
  pickHardWordFromPool,
  pickRandomUnusedWord,
} from "@/lib/game-word-picker";
import type { GameDifficulty } from "@/lib/word-game";

const TTL_MS = 2 * 60 * 60 * 1000;

export type GameWordSessionState = {
  usedWords: Record<GameDifficulty, Set<string>>;
  createdAt: number;
};

const sessions = new Map<string, GameWordSessionState>();

function emptyUsedSets(): Record<GameDifficulty, Set<string>> {
  return {
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
  };
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.createdAt > TTL_MS) sessions.delete(id);
  }
}

export function getOrCreateGameWordSession(
  sessionId: string,
): GameWordSessionState {
  pruneExpired();
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      usedWords: emptyUsedSets(),
      createdAt: Date.now(),
    };
    sessions.set(sessionId, session);
  }
  return session;
}

export type PickWordForSessionInput = {
  difficulty: GameDifficulty;
  pool: readonly string[];
  hardPool?: HardWordPool;
  easyCompletedThisSession?: number;
};

/**
 * Pick a word from the pool without repeating until the pool is exhausted.
 */
export function pickWordForSession(
  sessionId: string,
  input: PickWordForSessionInput,
): string | null {
  const session = getOrCreateGameWordSession(sessionId);
  const used = session.usedWords[input.difficulty];
  const { pool, difficulty, hardPool, easyCompletedThisSession = 0 } = input;

  if (difficulty === "easy") {
    return pickEasyWordFromPool(pool, used, easyCompletedThisSession);
  }

  if (difficulty === "hard" && hardPool) {
    return pickHardWordFromPool(hardPool, used);
  }

  return pickRandomUnusedWord(pool, used);
}

export function clearGameWordSession(sessionId: string): void {
  sessions.delete(sessionId);
}
