/**
 * In-memory sessions for Streak Challenge (separate from main game).
 */

const TTL_MS = 60 * 60 * 1000;

export type StreakSession = {
  answer: string;
  /** Word slot 1–6 when this round was created. */
  slot: number;
  createdAt: number;
};

const sessions = new Map<string, StreakSession>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.createdAt > TTL_MS) sessions.delete(id);
  }
}

export function createStreakSession(answer: string, slot: number): string {
  pruneExpired();
  const id = crypto.randomUUID();
  sessions.set(id, {
    answer: answer.toLowerCase(),
    slot,
    createdAt: Date.now(),
  });
  return id;
}

export function getStreakSession(id: string): StreakSession | undefined {
  pruneExpired();
  return sessions.get(id);
}

export function deleteStreakSession(id: string): void {
  sessions.delete(id);
}
