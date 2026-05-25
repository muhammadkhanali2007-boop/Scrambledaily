"use client";

import { WordChip } from "@/components/ui/word-chip";
import type { ResultGroup } from "@/lib/unscramble";

export type ResultsStatus = "idle" | "loading" | "done";

type ResultsSectionProps = {
  status: ResultsStatus;
  groups: ResultGroup[];
  total: number;
  /** Letters the user searched (trimmed, original casing ok) */
  lastLetters: string | null;
  error: string | null;
};

export function ResultsSection({
  status,
  groups,
  total,
  lastLetters,
  error,
}: ResultsSectionProps) {
  return (
    <section className="mt-10" aria-labelledby="results-heading">
      <h2
        id="results-heading"
        className="font-display text-section-sm font-semibold tracking-tight text-luxe-strong sm:text-section"
      >
        Results
      </h2>

      {error ? (
        <p
          className="mt-4 rounded-luxe-md border border-luxe bg-luxe-muted px-4 py-3 text-sm text-luxe-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {status === "idle" && !error ? (
        <p className="mt-6 rounded-luxe-md border border-dashed border-luxe bg-luxe-surface/80 px-4 py-8 text-center text-sm leading-relaxed text-luxe-secondary backdrop-blur-sm">
          Enter your letters above, adjust optional filters, then tap{" "}
          <span className="font-semibold text-luxe-strong">Unscramble</span> to
          see every dictionary match we can build from your rack.
        </p>
      ) : null}

      {status === "loading" ? (
        <p className="mt-6 text-sm text-luxe-tertiary">
          Searching the dictionary…
        </p>
      ) : null}

      {status === "done" && !error && lastLetters ? (
        <p className="mt-1 text-sm text-luxe-tertiary">
          {total > 0 ? (
            <>
              <span className="font-medium text-luxe-secondary">{total}</span>{" "}
              {total === 1 ? "word" : "words"} for{" "}
              <span className="font-mono font-medium text-luxe-secondary">
                {lastLetters}
              </span>
            </>
          ) : (
            <>
              No dictionary words found for{" "}
              <span className="font-mono font-medium text-luxe-secondary">
                {lastLetters}
              </span>
              . Try different letters, a{" "}
              <span className="font-mono">?</span> wildcard, or relax your
              filters.
            </>
          )}
        </p>
      ) : null}

      {status === "done" && !error && total > 0 ? (
        <div className="mt-8 space-y-10">
          {groups.map((group) => (
            <div key={group.length}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-luxe-accent-mid">
                {group.length} Letter Words
              </h3>
              <ul
                className="mt-3 flex flex-wrap gap-2"
                aria-label={`${group.length} letter words`}
              >
                {group.words.map((word) => (
                  <li key={word}>
                    <WordChip word={word} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
