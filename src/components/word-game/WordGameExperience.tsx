"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { buildWrongHintLine } from "@/lib/game-hint-lexicon";
import { HardModeTipDisplay } from "@/components/word-game/HardModeTipDisplay";
import { HomeSeoArticle } from "@/components/home/HomeSeoArticle";
import { StreakSeoArticle } from "@/components/streak/StreakSeoArticle";
import { ViewTransition } from "@/components/ViewTransition";
import { StreakChallenge } from "@/components/word-game/StreakChallenge";
import {
  type GameDifficulty,
  BASE_MAX_WRONG,
  EASY_DOPAMINE_ROUNDS,
  maxWrongForDifficulty,
  PROGRESS_TO_NEXT_LEVEL,
} from "@/lib/word-game";
import "@/styles/word-game.css";
import "@/styles/home-game.css";

type StartResponse = {
  gameId: string;
  scrambledWord: string;
  difficulty?: GameDifficulty;
  maxWrong?: number;
  gameSessionId?: string;
  easySessionId?: string;
};

const GAME_SESSION_STORAGE_KEY = "wordify-game-session-id";
const LEGACY_EASY_SESSION_STORAGE_KEY = "wordify-easy-session-id";

function getOrCreateGameSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing =
      sessionStorage.getItem(GAME_SESSION_STORAGE_KEY) ??
      sessionStorage.getItem(LEGACY_EASY_SESSION_STORAGE_KEY);
    if (existing && existing.length >= 8) {
      sessionStorage.setItem(GAME_SESSION_STORAGE_KEY, existing);
      return existing;
    }
    const id = crypto.randomUUID();
    sessionStorage.setItem(GAME_SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function persistGameSessionId(id: string | undefined): void {
  if (!id || typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GAME_SESSION_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DIFFICULTY_ORDER: GameDifficulty[] = ["easy", "medium", "hard"];

const MICRO_PRAISE = ["Nice!", "Clean!", "You got it!"];

function pickMicroPraise(): string {
  return MICRO_PRAISE[Math.floor(Math.random() * MICRO_PRAISE.length)]!;
}

function playSuccessChime(): void {
  try {
    const AC =
      typeof window !== "undefined" &&
      (window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext);
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.connect(g);
    g.connect(ctx.destination);
    const t0 = ctx.currentTime;
    o.frequency.setValueAtTime(392, t0);
    o.frequency.exponentialRampToValueAtTime(523.25, t0 + 0.07);
    o.frequency.exponentialRampToValueAtTime(659.25, t0 + 0.14);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
    void ctx.resume?.().catch(() => {});
    o.start(t0);
    o.stop(t0 + 0.3);
    window.setTimeout(() => void ctx.close().catch(() => {}), 400);
  } catch {
    /* ignore */
  }
}

function pulseSuccessHaptics(): void {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 35, 14]);
    }
  } catch {
    /* ignore */
  }
}

function difficultyTitle(d: GameDifficulty): string {
  return d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
}

function fireConfetti() {
  confetti({
    particleCount: 72,
    spread: 58,
    origin: { y: 0.62 },
    ticks: 120,
    gravity: 1.05,
    colors: ["#52c49e", "#4ade80", "#f0ede5", "#8ab5af", "#facc15"],
  });
}

function fireGoldenBonusConfetti() {
  confetti({
    particleCount: 88,
    spread: 54,
    origin: { y: 0.58 },
    ticks: 130,
    gravity: 1,
    colors: ["#facc15", "#f4a261", "#52c49e", "#f0ede5", "#4ade80"],
    scalar: 1,
  });
}

export function WordGameExperience() {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDifficultyRef = useRef<GameDifficulty>("easy");

  const [currentDifficulty, setCurrentDifficulty] =
    useState<GameDifficulty>("easy");
  const [manualDifficultyOverride, setManualDifficultyOverride] =
    useState(false);

  const [gameId, setGameId] = useState<string | null>(null);
  const [scrambledWord, setScrambledWord] = useState("");
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [maxLives, setMaxLives] = useState(BASE_MAX_WRONG);
  const [livesRemaining, setLivesRemaining] = useState(BASE_MAX_WRONG);
  const [currentGuess, setCurrentGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<
    "neutral" | "success" | "wrong" | "fail"
  >("neutral");
  const [loadingGame, setLoadingGame] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [wonHold, setWonHold] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scoreBump, setScoreBump] = useState(false);
  const [streakBump, setStreakBump] = useState(false);
  const [tileExiting, setTileExiting] = useState(false);
  const [tilesShake, setTilesShake] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [tilesCorrect, setTilesCorrect] = useState(false);
  const [revealWord, setRevealWord] = useState<string | null>(null);
  const [solvedWord, setSolvedWord] = useState<string | null>(null);
  const [hintTip, setHintTip] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{
    praise: string;
    xp: number;
  } | null>(null);
  const [cardWinGlow, setCardWinGlow] = useState(false);
  const [heartsWinPulse, setHeartsWinPulse] = useState(false);
  const [easySolvedSession, setEasySolvedSession] = useState(0);
  const [wordsSolvedSession, setWordsSolvedSession] = useState(0);
  const [tileIndexStack, setTileIndexStack] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"main" | "streak">("main");
  const isFirstRoundRef = useRef(true);
  const fromTileRef = useRef(false);
  const totalCorrectWordsRef = useRef(0);
  const easySolvedThisSessionRef = useRef(0);

  currentDifficultyRef.current = currentDifficulty;

  const focusInput = useCallback(() => {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const startNewGame = useCallback(
    async (difficultyOverride?: GameDifficulty) => {
      const difficulty =
        difficultyOverride ?? currentDifficultyRef.current;

      setLoadingGame(true);
      setFeedback(null);
      setRevealWord(null);
      setSolvedWord(null);
      setHintTip(null);
      setCelebration(null);
      setCardWinGlow(false);
      setTileIndexStack([]);
      setFeedbackTone("neutral");
      setWrongGuesses([]);
      const initialCap = maxWrongForDifficulty(difficulty);
      setMaxLives(initialCap);
      setLivesRemaining(initialCap);
      setCurrentGuess("");
      setWonHold(false);
      setTilesCorrect(false);
      setTilesShake(false);
      setInputShake(false);

      if (isFirstRoundRef.current) {
        isFirstRoundRef.current = false;
      } else {
        setTileExiting(true);
        await sleep(260);
      }

      try {
        let url = `/api/game?difficulty=${encodeURIComponent(difficulty)}`;
        const gameSessionId = getOrCreateGameSessionId();
        if (gameSessionId) {
          url += `&gameSessionId=${encodeURIComponent(gameSessionId)}`;
        }
        if (difficulty === "easy") {
          url += `&easyCompleted=${easySolvedThisSessionRef.current}`;
        }
        const res = await fetch(url);
        const data = (await res.json()) as StartResponse & { error?: string };
        const sessionId = data.gameSessionId ?? data.easySessionId;
        if (sessionId) {
          persistGameSessionId(sessionId);
        }
        if (!res.ok || !data.gameId || typeof data.scrambledWord !== "string") {
          setGameId(null);
          setScrambledWord("");
          setFeedback(
            data.error ?? "Could not start a game. Try again later.",
          );
          setFeedbackTone("fail");
          return;
        }
        setGameId(data.gameId);
        setScrambledWord(data.scrambledWord);
        const resolvedCap =
          typeof data.maxWrong === "number" && data.maxWrong > 0
            ? data.maxWrong
            : maxWrongForDifficulty(difficulty);
        setMaxLives(resolvedCap);
        setLivesRemaining(resolvedCap);
      } catch {
        setGameId(null);
        setScrambledWord("");
        setFeedback("Network error. Please try again.");
        setFeedbackTone("fail");
      } finally {
        setTileExiting(false);
        setLoadingGame(false);
        focusInput();
      }
    },
    [focusInput],
  );

  useEffect(() => {
    void startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (!loadingGame && !wonHold && gameId) focusInput();
  }, [loadingGame, wonHold, gameId, scrambledWord, focusInput]);

  useEffect(() => {
    if (!scoreBump) return;
    const t = window.setTimeout(() => setScoreBump(false), 350);
    return () => window.clearTimeout(t);
  }, [scoreBump]);

  useEffect(() => {
    if (!streakBump) return;
    const t = window.setTimeout(() => setStreakBump(false), 350);
    return () => window.clearTimeout(t);
  }, [streakBump]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("streak") === "1") setViewMode("streak");
  }, []);

  const selectDifficulty = useCallback(
    (d: GameDifficulty) => {
      setCurrentDifficulty(d);
      currentDifficultyRef.current = d;
      setManualDifficultyOverride(true);
      setStreak(0);
      void startNewGame(d);
    },
    [startNewGame],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId || submitting || wonHold) return;
    const trimmed = currentGuess.trim();
    if (!trimmed) return;

    const wrongBefore = wrongGuesses.length;
    setSubmitting(true);
    setFeedback(null);
    setRevealWord(null);
    setHintTip(null);
    setFeedbackTone("neutral");

    try {
      const res = await fetch("/api/game/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess: trimmed }),
      });

      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok || typeof data.error === "string") {
        setFeedback(
          typeof data.error === "string" ? data.error : "Something went wrong.",
        );
        setFeedbackTone("fail");
        return;
      }

      const status = data.status;
      if (status === "success") {
        let add =
          wrongBefore === 0 ? 20 : wrongBefore === 1 ? 10 : 5;
        totalCorrectWordsRef.current += 1;
        let bonus = false;
        if (totalCorrectWordsRef.current % 5 === 0) {
          add += 30;
          bonus = true;
        }
        setScore((s) => s + add);
        setScoreBump(true);
        setWordsSolvedSession((n) => n + 1);
        if (currentDifficulty === "easy") {
          easySolvedThisSessionRef.current += 1;
          setEasySolvedSession(easySolvedThisSessionRef.current);
        }
        setHintTip(null);
        setCelebration({ praise: pickMicroPraise(), xp: add });
        window.setTimeout(() => setCelebration(null), 1680);
        setHeartsWinPulse(true);
        window.setTimeout(() => setHeartsWinPulse(false), 900);
        setCardWinGlow(true);
        window.setTimeout(() => setCardWinGlow(false), 1100);
        playSuccessChime();
        pulseSuccessHaptics();

        const nextStreakRaw = streak + 1;
        let nextStreak = nextStreakRaw;
        let nextDifficulty = currentDifficulty;

        if (!manualDifficultyOverride) {
          if (
            currentDifficulty === "easy" &&
            nextStreakRaw >= PROGRESS_TO_NEXT_LEVEL
          ) {
            nextDifficulty = "medium";
            nextStreak = 0;
          } else if (
            currentDifficulty === "medium" &&
            nextStreakRaw >= PROGRESS_TO_NEXT_LEVEL
          ) {
            nextDifficulty = "hard";
            nextStreak = 0;
          }
        }

        if (nextDifficulty !== currentDifficulty) {
          setCurrentDifficulty(nextDifficulty);
          currentDifficultyRef.current = nextDifficulty;
        }

        setStreak(nextStreak);
        if (!(nextDifficulty !== currentDifficulty && nextStreak === 0)) {
          setStreakBump(true);
        }

        setFeedback(null);
        setFeedbackTone("success");
        setTilesCorrect(true);
        setWonHold(true);
        setSolvedWord(trimmed.toLowerCase());
        setCurrentGuess("");
        setTileIndexStack([]);
        fireConfetti();
        if (bonus) fireGoldenBonusConfetti();
        window.setTimeout(() => {
          void startNewGame(nextDifficulty);
        }, 1750);
        return;
      }

      if (status === "wrong") {
        setWrongGuesses((prev) => [...prev, trimmed]);
        setCurrentGuess("");
        setTileIndexStack([]);
        setStreak(0);
        setManualDifficultyOverride(false);
        const left = data.attemptsLeft;
        const lives =
          typeof left === "number"
            ? left
            : Math.max(0, maxLives - wrongBefore - 1);
        setLivesRemaining(lives);
        const wrongNum = wrongBefore + 1;
        const serverHintRaw = data.hint;
        const serverHint =
          typeof serverHintRaw === "string" && serverHintRaw.trim().length > 0
            ? serverHintRaw.trim()
            : null;
        setHintTip(
          serverHint ??
            (currentDifficulty === "easy" || currentDifficulty === "medium"
              ? buildWrongHintLine(
                  wrongNum,
                  scrambledWord,
                  currentDifficulty === "medium",
                )
              : null),
        );
        setFeedback("Try Again");
        setFeedbackTone("wrong");
        setTilesShake(true);
        setInputShake(true);
        window.setTimeout(() => {
          setTilesShake(false);
          setInputShake(false);
          focusInput();
        }, 480);
        return;
      }

      if (status === "failed") {
        const ans = typeof data.answer === "string" ? data.answer : "";
        setWrongGuesses((prev) => [...prev, trimmed]);
        setLivesRemaining(0);
        setStreak(0);
        setManualDifficultyOverride(false);
        setHintTip(null);
        setTileIndexStack([]);
        setRevealWord(ans || null);
        setFeedback(
          ans
            ? `The correct answer was: ${ans.toUpperCase()}`
            : "Out of tries.",
        );
        setFeedbackTone("fail");
        setTilesShake(true);
        setCurrentGuess("");
        window.setTimeout(() => {
          setTilesShake(false);
          void startNewGame();
        }, 2000);
        return;
      }

      setFeedback("Something went wrong.");
      setFeedbackTone("fail");
    } catch {
      setFeedback("Network error. Try again.");
      setFeedbackTone("fail");
    } finally {
      setSubmitting(false);
    }
  };

  const disabledInput = loadingGame || submitting || wonHold || !gameId;
  const scrambledLetters = scrambledWord.split("").filter(Boolean);
  const displayWord =
    revealWord ?? (wonHold && solvedWord ? solvedWord : scrambledWord);
  const displayLetters = displayWord.split("").filter(Boolean);
  const wordRevealed = Boolean(revealWord || (wonHold && solvedWord));

  const appendFromTile = useCallback(
    (i: number) => {
      if (disabledInput) return;
      const ch = scrambledLetters[i];
      if (!ch) return;
      fromTileRef.current = true;
      setCurrentGuess((g) => g + ch.toLowerCase());
      setTileIndexStack((s) => [...s, i]);
      focusInput();
    },
    [disabledInput, scrambledLetters, focusInput],
  );

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const old = currentGuess;
    const removed = old.length - v.length;
    if (removed > 0) {
      setTileIndexStack((st) =>
        st.slice(0, Math.max(0, st.length - removed)),
      );
    } else if (v.length > old.length && !fromTileRef.current) {
      setTileIndexStack([]);
    }
    fromTileRef.current = false;
    setCurrentGuess(v);
  };

  const feedbackColor =
    feedbackTone === "success"
      ? "text-[var(--accent-green)]"
      : feedbackTone === "wrong"
        ? "text-[var(--accent-red)]"
        : feedbackTone === "fail"
          ? "text-[var(--text-muted)]"
          : "text-[var(--text-muted)]";

  const tierProgressRatio =
    currentDifficulty === "hard"
      ? Math.min(streak / 10, 1)
      : Math.min(streak / PROGRESS_TO_NEXT_LEVEL, 1);

  return (
    <div
      id="top"
      className="wg-root relative min-h-screen max-w-full overflow-x-clip text-[var(--text-primary)]"
    >
      <div className="wg-page-bg" aria-hidden />

      <main className="wg-home-main relative z-10 flex min-h-[calc(100dvh-3.25rem)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-4rem)] sm:py-12">
        <div
          className={`wg-card relative w-full max-w-md overflow-x-clip px-5 py-8 sm:overflow-visible sm:px-8 sm:py-9 ${viewMode === "main" && cardWinGlow ? "wg-card--win-glow" : ""}`}
        >
          <ViewTransition viewKey={viewMode} className="w-full">
          {viewMode === "streak" ? (
            <StreakChallenge onBack={() => setViewMode("main")} />
          ) : (
            <>
          {celebration ? (
            <div className="wg-celebration" aria-live="polite">
              <div
                key={`${celebration.praise}-${celebration.xp}`}
                className="wg-celebration-inner wg-celebration-inner--stack"
              >
                <span className="wg-celebration-praise">{celebration.praise}</span>
                <span className="wg-celebration-xp">+{celebration.xp} XP</span>
              </div>
            </div>
          ) : null}

            <div className="wg-home">
          <div
            className="wg-diff-segment mb-3 flex justify-center"
            role="group"
            aria-label="Difficulty"
          >
            {DIFFICULTY_ORDER.map((d) => {
              const active = currentDifficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={loadingGame}
                  onClick={() => selectDifficulty(d)}
                  className={`wg-diff-tab ${active ? "wg-diff-tab--active" : ""}`}
                >
                  {difficultyTitle(d)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={loadingGame}
            className="wg-streak-entry"
            onClick={() => setViewMode("streak")}
            aria-label="Open Streak Challenge"
          >
            <span className="wg-streak-entry-text">
              <span className="wg-streak-entry-icon" aria-hidden>
                ⚡
              </span>{" "}
              Think you&apos;re good? Beat the top streaker —{" "}
              <span className="wg-streak-entry-accent">Streak Challenge</span>
            </span>
            <span className="wg-streak-entry-arrow" aria-hidden>
              →
            </span>
          </button>

          {currentDifficulty === "easy" &&
          easySolvedSession < EASY_DOPAMINE_ROUNDS ? (
            <p className="wg-callout-soft mb-2 text-center text-xs sm:text-sm">
              Quick wins {easySolvedSession + 1}/{EASY_DOPAMINE_ROUNDS} — easiest
              picks first
            </p>
          ) : null}

          <p className="wg-game-session-solved mb-2 text-center text-[var(--text-muted)]">
            {wordsSolvedSession} solved this session
          </p>

          <p className="wg-game-subtitle mb-5 text-center text-[var(--text-muted)]">
            {currentDifficulty === "easy"
              ? `Easy • 4-letter everyday words`
              : currentDifficulty === "medium"
                ? `Medium • 5-letter words`
                : `Hard • 6–7 letter words · skill tips`}
            <span className="mx-1.5 opacity-40">·</span>
            {currentDifficulty === "hard"
              ? `${streak} streak`
              : `${Math.min(streak, PROGRESS_TO_NEXT_LEVEL)}/${PROGRESS_TO_NEXT_LEVEL} toward next tier`}
          </p>

          <div
            className={`stats-bar ${streak >= 3 ? "stats-bar--hot" : ""}`}
            aria-label="Score and streak"
          >
            <div className="stat">
              <span className="stat-label">SCORE</span>
              <span
                className={`stat-value tabular-nums ${scoreBump ? "wg-badge--pulse" : ""}`}
              >
                {score}
              </span>
            </div>
            <div className="stat-divider" aria-hidden />
            <div className={`stat ${streak >= 3 ? "stat--hot" : ""}`}>
              <span className="stat-label">STREAK</span>
              <span
                className={`stat-value tabular-nums ${streakBump ? "wg-badge--pulse" : ""}`}
              >
                🔥 {streak}
              </span>
            </div>
          </div>

          <div
            className="wg-momentum-block mb-6 px-1"
            aria-label={
              currentDifficulty === "hard"
                ? "Streak momentum"
                : "Progress toward next difficulty"
            }
          >
            <div className="mb-1 flex justify-between">
              <span className="wg-muted-label">Momentum</span>
              <span className="wg-progress-pct">
                {Math.round(tierProgressRatio * 100)}%
              </span>
            </div>
            <div className="wg-progress-track">
              <div
                className="wg-progress-fill"
                style={{
                  transform: `scaleX(${tierProgressRatio})`,
                }}
              />
            </div>
          </div>

          <h1 className="game-title wg-title mb-6 text-center">
            Active Word
          </h1>

          {loadingGame && !scrambledWord ? (
            <p className="py-12 text-center text-sm text-[var(--text-muted)]">
              Loading…
            </p>
          ) : (
            <>
              <section
                className={`wg-word-display ${tilesShake ? "wg-tiles-wrap--shake" : ""}`}
                aria-label={wordRevealed ? "Answer" : "Scrambled word"}
              >
                <div
                  className="wg-tiles-outer"
                  style={
                    displayLetters.length > 0
                      ? ({
                          "--wg-letter-count": displayLetters.length,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <div
                    className={`wg-tiles ${tileExiting ? "wg-tiles--exit" : ""} ${tilesCorrect ? "wg-tiles--correct wg-tiles--correct-glow" : ""} ${wordRevealed ? "wg-tiles--revealed" : ""}`}
                  >
                    {!tileExiting &&
                      displayLetters.map((ch, i) => (
                        <button
                          key={`${gameId}-${displayWord}-${i}-${ch}`}
                          type="button"
                          disabled={disabledInput}
                          className={`wg-tile wg-word-tile ${tileIndexStack.includes(i) ? "wg-tile--selected" : ""}`}
                          style={{ animationDelay: `${i * 60}ms` }}
                          onClick={() => appendFromTile(i)}
                          aria-label={
                            wordRevealed
                              ? `Letter ${ch.toUpperCase()}`
                              : `Add letter ${ch.toUpperCase()}`
                          }
                        >
                          <span className="wg-tile-inner">
                            <span className="wg-tile-face wg-tile-face--front">
                              {ch.toUpperCase()}
                            </span>
                            <span className="wg-tile-face wg-tile-face--back">
                              {ch.toUpperCase()}
                            </span>
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </section>

              <div
                className="mb-4 flex justify-center gap-1.5 sm:gap-2"
                aria-label="Lives remaining"
              >
                {Array.from({ length: maxLives }).map((_, i) => {
                  const full = i < livesRemaining;
                  return (
                    <span
                      key={i}
                      className={`wg-heart ${full ? "" : "wg-heart--lost"} ${heartsWinPulse && full ? "wg-heart--win-pop" : ""}`}
                      aria-hidden
                    >
                      ♥
                    </span>
                  );
                })}
              </div>

              {hintTip ? (
                currentDifficulty === "hard" ? (
                  <HardModeTipDisplay tip={hintTip} />
                ) : (
                  <div
                    className="wg-hint-box mb-4 flex items-start gap-2 text-left text-sm leading-snug"
                    role="status"
                    aria-label="Hint"
                  >
                    <span aria-hidden className="wg-hint-dot shrink-0 pt-1">
                      ●
                    </span>
                    <span>{hintTip}</span>
                  </div>
                )
              ) : null}

              {feedback ? (
                <div className={`mb-4 text-center ${feedbackColor}`} role="status">
                  <p className="text-sm font-semibold sm:text-base">{feedback}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="wg-guess" className="sr-only">
                  Your guess
                </label>
                <input
                  ref={inputRef}
                  id="wg-guess"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  value={currentGuess}
                  onChange={handleGuessChange}
                  disabled={disabledInput}
                  placeholder="Type your answer"
                  className={`wg-input ${inputShake ? "wg-input--shake" : ""}`}
                />
                <button
                  type="submit"
                  disabled={disabledInput || !currentGuess.trim()}
                  className="wg-btn-primary"
                >
                  Check answer
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
                <Link href="/unscramble" className="wg-link">
                  Letter unscrambler →
                </Link>
              </p>
            </>
          )}
            </div>
            </>
          )}
          </ViewTransition>
        </div>
      </main>

      {viewMode === "streak" ? <StreakSeoArticle /> : <HomeSeoArticle />}
    </div>
  );
}
