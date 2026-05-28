"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import {
  THEME_TOGGLE_VISIBLE,
  useTheme,
} from "@/components/providers/theme-provider";
import { PRIMARY_SITE_NAV } from "@/lib/site-nav";

export function WordGameHeader() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="wg-header">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-5">
        <Link href="/" className="wg-logo text-base sm:text-lg">
          Word Unscramble Game
        </Link>
        <nav
          className="hidden min-w-0 flex-1 justify-center gap-1 md:flex md:gap-2"
          aria-label="Primary"
        >
          {PRIMARY_SITE_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="wg-header-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MobileNavMenu items={PRIMARY_SITE_NAV} variant="wg" />
          <div
            className={THEME_TOGGLE_VISIBLE ? undefined : "hidden"}
            aria-hidden={!THEME_TOGGLE_VISIBLE}
          >
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!THEME_TOGGLE_VISIBLE}
              tabIndex={THEME_TOGGLE_VISIBLE ? 0 : -1}
              className="wg-header-icon-btn"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              ) : (
                <Moon
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
