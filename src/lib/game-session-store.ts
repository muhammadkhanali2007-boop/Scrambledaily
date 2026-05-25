/**
 * In-memory game sessions for /api/game (no database).
 * Stale sessions are pruned on access (serverless-friendly enough for MVP).
 */

import type { HardTipSessionState } from "@/lib/hard-mode-tips";
import { createHardTipState } from "@/lib/hard-mode-tips";
import type { GameDifficulty } from "@/lib/word-game";

const TTL_MS = 60 * 60 * 1000;

export type GameSession = {
  answer: string;
  wrongCount: number;
  createdAt: number;
  difficulty: GameDifficulty;
  /** Hard mode: professional tip rotation (per word session). */
  hardTips?: HardTipSessionState;
};

const sessions = new Map<string, GameSession>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.createdAt > TTL_MS) sessions.delete(id);
  }
}

export function createGameSession(
  answer: string,
  difficulty: GameDifficulty,
): string {
  pruneExpired();
  const id = crypto.randomUUID();
  sessions.set(id, {
    answer: answer.toLowerCase(),
    wrongCount: 0,
    createdAt: Date.now(),
    difficulty,
    hardTips: difficulty === "hard" ? createHardTipState() : undefined,
  });
  return id;
}

/** Persist hard-mode tip rotation after a wrong guess. */
export function updateHardTipState(
  id: string,
  hardTips: HardTipSessionState,
): void {
  const s = sessions.get(id);
  if (s) s.hardTips = hardTips;
}

export function getGameSession(id: string): GameSession | undefined {
  pruneExpired();
  return sessions.get(id);
}

export function deleteGameSession(id: string): void {
  sessions.delete(id);
}

/** Increments wrong guess count. Returns updated session or null if missing. */
export function incrementWrongCount(id: string): GameSession | null {
  pruneExpired();
  const s = sessions.get(id);
  if (!s) return null;
  s.wrongCount += 1;
  return s;
}
