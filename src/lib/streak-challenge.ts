/**
 * Streak Challenge — constants and copy (no answer hints).
 */

export const STREAK_CHALLENGE_TARGET = 6;

export const STREAK_TIMER_SECONDS = 45;

/** Social proof bar — top streak to beat by day (Sun–Sat). */
const TODAY_TOP_STREAKS = [5, 4, 3, 2, 4, 4, 5];

export function getTodayTopStreak(): number {
  return TODAY_TOP_STREAKS[new Date().getDay()];
}

/** True when the user's current run streak exceeds today's benchmark. */
export function hasBeatTodayTopStreak(streak: number): boolean {
  return streak > getTodayTopStreak();
}

export type StreakMessageEvent = "start" | "wrong" | "timeout";

const MESSAGES: Record<StreakMessageEvent, string> = {
  start: "No mistakes. No mercy. Let's go.",
  wrong: "Reset. But you know the way now.",
  timeout: "Time's up. The streak resets — but so does your focus.",
};

export function streakMessageFor(
  event: StreakMessageEvent,
): string {
  return MESSAGES[event];
}

/** Word slot 1–6: slot 1 = 5-letter medium ramp; 2–6 = hard pool. */
export function streakWordSlotForProgress(
  consecutiveCorrect: number,
): number {
  return Math.min(Math.max(consecutiveCorrect, 0) + 1, STREAK_CHALLENGE_TARGET);
}

export function buildStreakShareText(siteUrl: string): string {
  return `⚡ WORD STRIKER
6/6 — No mistakes. No hints. No mercy.
Can you beat the Streak Challenge?
🔗 ${siteUrl}`;
}
