"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import {
  THEME_TOGGLE_VISIBLE,
  useTheme,
} from "@/components/providers/theme-provider";
import { isActiveNavPath } from "@/lib/nav-active";
import { PRIMARY_SITE_NAV } from "@/lib/site-nav";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="luxe-glass-nav sticky top-0 z-50">
      <div className="site-header-inner mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-2 px-4 md:h-16 md:gap-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="site-header-logo font-display text-base font-semibold tracking-tight text-luxe-strong transition-colors duration-luxe ease-luxe hover:text-luxe-accent-mid md:text-lg"
        >
          ScrambleDaily
        </Link>

        <nav
          className="hidden max-w-[100vw] items-center justify-center gap-3 overflow-x-auto px-1 py-1 text-xs font-medium md:flex md:gap-5 md:text-sm"
          aria-label="Primary"
        >
          {PRIMARY_SITE_NAV.map((item) => {
            const active = isActiveNavPath(pathname, item.href, searchParams);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 whitespace-nowrap transition-colors duration-luxe ease-luxe ${
                  active
                    ? "font-semibold text-luxe-strong underline decoration-luxe-accent-mid decoration-2 underline-offset-4"
                    : "text-luxe-secondary hover:text-luxe-strong"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <MobileNavMenu items={PRIMARY_SITE_NAV} variant="luxe" />
          <div
            className={THEME_TOGGLE_VISIBLE ? "flex" : "hidden"}
            aria-hidden={!THEME_TOGGLE_VISIBLE}
          >
            <button
              type="button"
              onClick={mounted ? toggleTheme : undefined}
              disabled={!THEME_TOGGLE_VISIBLE || !mounted}
              tabIndex={THEME_TOGGLE_VISIBLE && mounted ? 0 : -1}
              className="inline-flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-luxe-md border border-luxe bg-luxe-muted text-luxe-text shadow-luxe-soft transition duration-luxe ease-luxe hover:border-luxe-strong hover:bg-luxe-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--luxe-focus-ring)]"
              aria-label={
                mounted
                  ? isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                  : "Toggle theme"
              }
              aria-hidden={!THEME_TOGGLE_VISIBLE || !mounted}
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                ) : (
                  <Moon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                )
              ) : (
                <span className="block h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
