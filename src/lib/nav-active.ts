import { isHomeStreakView } from "@/lib/home-view";

/** Whether a nav item matches the current route (client-side). */
export function isActiveNavPath(
  pathname: string,
  href: string,
  searchParams?: URLSearchParams | null,
): boolean {
  const [base, query] = href.split("?");
  const streakLink = query?.includes("streak=1");

  if (streakLink) {
    return pathname === "/" && isHomeStreakView(searchParams);
  }

  if (base === "/") {
    return pathname === "/" && !isHomeStreakView(searchParams);
  }

  return pathname === base || pathname.startsWith(`${base}/`);
}
