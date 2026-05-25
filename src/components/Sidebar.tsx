"use client";

import Link from "next/link";
import { popularTools, tips } from "@/lib/site-data";

type SidebarProps = {
  recent: string[];
  onPickRecent: (letters: string) => void;
};

export function Sidebar({ recent, onPickRecent }: SidebarProps) {
  return (
    <aside
      className="solver-sidebar-mobile w-full min-w-0 lg:sticky lg:top-24 lg:w-auto"
      aria-label="Supplementary"
    >
      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="luxe-card rounded-luxe-lg p-5">
          <h2 className="text-sm font-semibold text-luxe-strong">
            Popular Tools
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {popularTools.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-luxe-secondary transition-colors duration-luxe ease-luxe hover:text-luxe-accent-mid"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="luxe-card rounded-luxe-lg p-5">
          <h2 className="text-sm font-semibold text-luxe-strong">
            Recent searches
          </h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-luxe-tertiary">
              Your recent letter racks will show up here.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recent.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => onPickRecent(q)}
                    className="min-h-[44px] w-full rounded-luxe-sm px-3 py-2.5 text-left font-mono text-sm text-luxe-secondary transition-colors duration-luxe ease-luxe hover:bg-luxe-muted hover:text-luxe-accent-mid"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="luxe-card rounded-luxe-lg p-5">
          <h2 className="text-sm font-semibold text-luxe-strong">Tips</h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-luxe-secondary">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
