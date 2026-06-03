/** Home page in-card views (main game vs Streak Challenge). URL is the source of truth. */

export const HOME_PATH = "/" as const;
export const HOME_STREAK_PATH = "/?streak=1" as const;

export type HomeViewMode = "main" | "streak";

type SearchParamsLike = { get(name: string): string | null } | null | undefined;

export function isHomeStreakView(searchParams: SearchParamsLike): boolean {
  return searchParams?.get("streak") === "1";
}

export function homeViewModeFromSearchParams(
  searchParams: SearchParamsLike,
): HomeViewMode {
  return isHomeStreakView(searchParams) ? "streak" : "main";
}
