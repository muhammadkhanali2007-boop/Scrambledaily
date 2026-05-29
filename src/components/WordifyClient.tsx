"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AdvancedFilters,
  type FilterValues,
} from "@/components/AdvancedFilters";
import { ResultsSection, type ResultsStatus } from "@/components/ResultsSection";
import { SearchBox } from "@/components/SearchBox";
import { Sidebar } from "@/components/Sidebar";
import { ToolTeasers } from "@/components/ToolTeasers";
import {
  ANAGRAM_SOLVER_PATH,
  UNSCRAMBLER_PATH,
  type SolverPageVariant,
} from "@/lib/solver-routes";
import {
  groupMatchesByLength,
  sortMatches,
  type ResultGroup,
  type SolverMode,
} from "@/lib/unscramble";

const RECENT_KEY = "wordify-recent";

const defaultFilters: FilterValues = {
  startsWith: "",
  endsWith: "",
  contains: "",
  wordLength: "Any length",
};

const emptySolverState = {
  letters: "",
  filters: defaultFilters,
  status: "idle" as ResultsStatus,
  groups: [] as ResultGroup[],
  total: 0,
  lastLetters: null as string | null,
  error: null as string | null,
};

type ApiSuccess = { matches: string[] };
type ApiErrorBody = { error?: string };

type WordifyClientProps = {
  /** Route-scoped page: each variant mounts as an isolated tool instance. */
  variant: SolverPageVariant;
};

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, 12);
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 12)));
  } catch {
    /* ignore quota */
  }
}

function pushRecent(letters: string): string[] {
  const normalized = letters.trim();
  if (!normalized) return readRecent();
  const prev = readRecent();
  const next = [
    normalized,
    ...prev.filter((x) => x.toLowerCase() !== normalized.toLowerCase()),
  ].slice(0, 12);
  writeRecent(next);
  return next;
}

function clearResultsState() {
  return {
    status: "idle" as ResultsStatus,
    groups: [] as ResultGroup[],
    total: 0,
    lastLetters: null as string | null,
    error: null as string | null,
  };
}

export function WordifyClient({ variant }: WordifyClientProps) {
  const isAnagramPage = variant === "anagram";
  const [letters, setLetters] = useState(emptySolverState.letters);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [status, setStatus] = useState<ResultsStatus>(emptySolverState.status);
  const [groups, setGroups] = useState<ResultGroup[]>(emptySolverState.groups);
  const [total, setTotal] = useState(emptySolverState.total);
  const [lastLetters, setLastLetters] = useState<string | null>(
    emptySolverState.lastLetters,
  );
  const [error, setError] = useState<string | null>(emptySolverState.error);
  const [recent, setRecent] = useState<string[]>([]);

  const solverMode: SolverMode = isAnagramPage ? "anagram" : "unscramble";

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  const runSearch = useCallback(
    async (rack: string) => {
      const trimmed = rack.trim();
      if (!trimmed) {
        setError("Please enter at least one letter or ? wildcard.");
        return;
      }

      setError(null);
      setStatus("loading");

      const body: Record<string, unknown> = { letters: trimmed, mode: solverMode };
      const f: Record<string, string> = {};
      if (filters.startsWith.trim()) f.startsWith = filters.startsWith.trim();
      if (filters.endsWith.trim()) f.endsWith = filters.endsWith.trim();
      if (filters.contains.trim()) f.contains = filters.contains.trim();
      if (filters.wordLength && filters.wordLength !== "Any length") {
        f.wordLength = filters.wordLength;
      }
      if (Object.keys(f).length) body.filters = f;

      try {
        const res = await fetch("/api/unscramble", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        let data: unknown = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        const errBody = data as ApiErrorBody | null;
        const errMsg =
          errBody && typeof errBody.error === "string"
            ? errBody.error
            : "Something went wrong. Please try again.";

        if (!res.ok) {
          setError(errMsg);
          setGroups([]);
          setTotal(0);
          setLastLetters(trimmed);
          setStatus("done");
          return;
        }

        const okBody = data as ApiSuccess | null;
        if (
          !okBody ||
          typeof okBody !== "object" ||
          !Array.isArray(okBody.matches)
        ) {
          setError("Unexpected response from the server.");
          setGroups([]);
          setTotal(0);
          setLastLetters(trimmed);
          setStatus("done");
          return;
        }

        const sorted = sortMatches(okBody.matches);
        setGroups(groupMatchesByLength(sorted));
        setTotal(sorted.length);
        setLastLetters(trimmed);
        setStatus("done");

        const nextRecent = pushRecent(trimmed);
        setRecent(nextRecent);
      } catch {
        setError("Network error. Check your connection and try again.");
        setGroups([]);
        setTotal(0);
        setLastLetters(trimmed);
        setStatus("done");
      }
    },
    [filters, solverMode],
  );

  const onPickRecent = useCallback(
    (q: string) => {
      setLetters(q);
      void runSearch(q);
    },
    [runSearch],
  );

  const modePill = (active: boolean) =>
    `rounded-pill px-4 py-2 text-sm font-medium transition-all duration-luxe ease-luxe focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--luxe-focus-ring)] ${
      active
        ? "bg-gradient-to-br from-luxe-accent to-luxe-accent-mid text-[#04302d] shadow-luxe-soft dark:from-luxe-accent-mid dark:to-luxe-accent-soft dark:text-[#04302d]"
        : "text-luxe-secondary hover:bg-luxe-muted/80 hover:text-luxe-strong"
    }`;

  return (
    <>
      <section
        id={isAnagramPage ? "anagram" : "unscrambler"}
        className="border-b border-luxe px-4 py-10 sm:px-0 sm:py-16"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="ui-fade-up">
            <h1
              id="hero-heading"
              className="luxe-heading-hero text-hero font-display sm:text-[clamp(2.5rem,5vw,4.25rem)]"
            >
              {isAnagramPage
                ? "Anagram Solver"
                : "Unscramble Words Instantly"}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-luxe-secondary sm:text-xl">
              {isAnagramPage
                ? "Find words that use every letter you type (? counts as one blank tile)."
                : "Find all possible words from scrambled letters quickly and easily."}
            </p>
            <div
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-luxe-lg border border-luxe bg-luxe-surface/90 p-1.5 shadow-luxe-soft backdrop-blur-sm dark:bg-luxe-muted/40"
              role="navigation"
              aria-label="Solver tools"
            >
              {!isAnagramPage ? (
                <Link
                  href={UNSCRAMBLER_PATH}
                  className={modePill(true)}
                  aria-current="page"
                >
                  Unscramble
                </Link>
              ) : null}
              <Link
                href={ANAGRAM_SOLVER_PATH}
                className={modePill(isAnagramPage)}
                aria-current={isAnagramPage ? "page" : undefined}
              >
                Anagram Solver
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="ui-fade-up ui-fade-up--delay border-b border-luxe pb-10 pt-8 sm:pb-12 sm:pt-10">
        <SearchBox
          letters={letters}
          onLettersChange={(v) => {
            setLetters(v);
            setError(null);
          }}
          loading={status === "loading"}
          onSubmit={() => void runSearch(letters)}
        />
        <AdvancedFilters values={filters} onChange={setFilters} />
        <ToolTeasers anagramPage={isAnagramPage} />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <div className="solver-results-grid flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <ResultsSection
              status={status}
              groups={groups}
              total={total}
              lastLetters={lastLetters}
              error={error}
            />
          </div>
          <Sidebar recent={recent} onPickRecent={onPickRecent} />
        </div>
      </div>
    </>
  );
}
