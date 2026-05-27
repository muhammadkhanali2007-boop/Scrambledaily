"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { isActiveNavPath } from "@/lib/nav-active";
import type { SiteNavItem } from "@/lib/site-nav";

type MobileNavMenuProps = {
  items: SiteNavItem[];
  /** `luxe` = solver pages header; `wg` = word game header */
  variant?: "luxe" | "wg";
};

export function MobileNavMenu({ items, variant = "luxe" }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const drawerId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const triggerClass =
    variant === "wg"
      ? "mobile-nav-trigger wg-header-icon-btn md:hidden"
      : "mobile-nav-trigger mobile-nav-trigger--luxe md:hidden";

  return (
    <>
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>

      <div
        className={`mobile-nav-root md:hidden ${open ? "mobile-nav-root--open" : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="mobile-nav-backdrop"
          onClick={close}
          tabIndex={open ? 0 : -1}
          aria-label="Close navigation menu"
        />
        <nav
          id={drawerId}
          className="mobile-nav-drawer"
          aria-label="Mobile"
          role="dialog"
          aria-modal="true"
        >
          <div className="mobile-nav-drawer-head">
            <span className="mobile-nav-drawer-title">Menu</span>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={close}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <ul className="mobile-nav-list">
            {items.map((item) => {
              const active = isActiveNavPath(pathname, item.href, searchParams);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${active ? "mobile-nav-link--active" : ""}`}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
