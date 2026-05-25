/**
 * Streak Challenge session: tracks used words until the full pool is exhausted.
 */

import type { StreakWordPool } from "@/lib/streak-word-pools";

const TTL_MS = 2 * 60 * 60 * 1000;

export type StreakWordSessionState = {
  usedWordsStreak: Set<string>;
  createdAt: number;
};

const sessions = new Map<string, StreakWordSessionState>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.createdAt > TTL_MS) sessions.delete(id);
  }
}

export function getOrCreateStreakWordSession(
  sessionId: string,
): StreakWordSessionState {
  pruneExpired();
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      usedWordsStreak: new Set(),
      createdAt: Date.now(),
    };
    sessions.set(sessionId, session);
  }
  return session;
}

/**
 * Pick a random unused word for the slot; resets usedWordsStreak only when all words are used.
 */
export function pickStreakWordForSession(
  sessionId: string,
  pool: StreakWordPool,
  slot: number,
): string | null {
  const session = getOrCreateStreakWordSession(sessionId);
  const used = session.usedWordsStreak;

  const preferred = slot <= 1 && pool.ramp.length > 0 ? pool.ramp : pool.main;
  const pickPool = preferred.length > 0 ? preferred : pool.all;

  let candidates = pickPool.filter((w) => !used.has(w));

  if (!candidates.length) {
    const anyUnused = pool.all.filter((w) => !used.has(w));
    if (!anyUnused.length) {
      used.clear();
      candidates = [...pickPool];
    } else {
      candidates = anyUnused;
    }
  }

  if (!candidates.length) return null;

  const word =
    candidates[Math.floor(Math.random() * candidates.length)]!.toLowerCase();
  used.add(word);
  return word;
}

export function clearStreakWordSession(sessionId: string): void {
  sessions.delete(sessionId);
}
