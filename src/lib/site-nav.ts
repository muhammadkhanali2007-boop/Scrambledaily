import { HOME_STREAK_PATH } from "@/lib/home-view";
import { ANAGRAM_SOLVER_PATH, UNSCRAMBLER_PATH } from "@/lib/solver-routes";

export type SiteNavItem = {
  href: string;
  label: string;
};

/** Primary site navigation (shared by desktop + mobile headers). */
export const PRIMARY_SITE_NAV: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: UNSCRAMBLER_PATH, label: "Unscramble" },
  { href: ANAGRAM_SOLVER_PATH, label: "Anagram Solver" },
  { href: HOME_STREAK_PATH, label: "Streak Challenge" },
  { href: "/about", label: "About" },
];
