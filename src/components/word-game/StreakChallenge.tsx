"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STREAK_CHALLENGE_TARGET,
  STREAK_TIMER_SECONDS,
  buildStreakShareText,
  getTodayTopStreak,
  hasBeatTodayTopStreak,
  streakMessageFor,
} from "@/lib/streak-challenge";
type StreakChallengeProps = {
  onBack: () => void;
};

type StartResponse = {
  gameId: string;
  scrambledWord: string;
  slot?: number;
  letterCount?: number;
  streakSessionId?: string;
};

const STREAK_SESSION_STORAGE_KEY = "wordify-streak-session-id";

function getOrCreateStreakSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem(STREAK_SESSION_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(STREAK_SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function persistStreakSessionId(id: string | undefined): void {
  if (!id || typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STREAK_SESSION_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
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

const FEEDBACK_OVERLAY_MS = 2000;
const STREAK_COMPLIMENT_TEXT = "That Was Impressive Keep It Up";

export function StreakChallenge({ onBack }: StreakChallengeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const streakResetTimerRef = useRef<number | null>(null);
  const timeoutHandledRef = useRef(false);
  const tryAgainTimerRef = useRef<number | null>(null);
  const complimentTimerRef = useRef<number | null>(null);

  const [streak, setStreak] = useState(0);
  const [won, setWon] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [scrambledWord, setScrambledWord] = useState("");
  const [letterCount, setLetterCount] = useState(0);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STREAK_TIMER_SECONDS);
  const [message, setMessage] = useState(streakMessageFor("start"));
  const [inputCorrectGlow, setInputCorrectGlow] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [streakPulse, setStreakPulse] = useState(false);
  const [lettersSuccessGlow, setLettersSuccessGlow] = useState(false);
  const [streakResetFlash, setStreakResetFlash] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTryAgainOverlay, setShowTryAgainOverlay] = useState(false);
  const [tryAgainOverlayKey, setTryAgainOverlayKey] = useState(0);
  const [showComplimentOverlay, setShowComplimentOverlay] = useState(false);
  const [complimentOverlayKey, setComplimentOverlayKey] = useState(0);

  const clearFeedbackAnimations = useCallback(() => {
    setInputCorrectGlow(false);
    setInputShake(false);
    setStreakPulse(false);
    setLettersSuccessGlow(false);
  }, []);

  const triggerCorrectFeedback = useCallback(() => {
    clearFeedbackAnimations();
    setInputCorrectGlow(true);
    setStreakPulse(true);
    setLettersSuccessGlow(true);
  }, [clearFeedbackAnimations]);

  const triggerWrongFeedback = useCallback(() => {
    clearFeedbackAnimations();
    setInputShake(true);
    setStreakResetFlash(true);
    if (streakResetTimerRef.current) {
      window.clearTimeout(streakResetTimerRef.current);
    }
    streakResetTimerRef.current = window.setTimeout(() => {
      setStreakResetFlash(false);
      streakResetTimerRef.current = null;
    }, 800);
  }, [clearFeedbackAnimations]);

  const handleInputAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLInputElement>) => {
      if (e.currentTarget !== e.target) return;
      const name = e.animationName;
      if (
        name === "wg-streak-input-correct-glow" ||
        name.includes("wg-streak-input-correct-glow")
      ) {
        setInputCorrectGlow(false);
      }
      if (name === "shake" || name.includes("shake")) {
        setInputShake(false);
      }
    },
    [],
  );

  const handleStreakCounterAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLParagraphElement>) => {
      if (e.currentTarget !== e.target) return;
      if (
        e.animationName === "streakPulse" ||
        e.animationName.includes("streakPulse")
      ) {
        setStreakPulse(false);
      }
    },
    [],
  );

  const handleLettersWrapAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (
        e.animationName === "wg-streak-letter-success-glow" ||
        e.animationName.includes("wg-streak-letter-success-glow")
      ) {
        setLettersSuccessGlow(false);
      }
    },
    [],
  );

  const triggerTryAgainOverlay = useCallback(() => {
    if (tryAgainTimerRef.current) {
      window.clearTimeout(tryAgainTimerRef.current);
    }
    if (complimentTimerRef.current) {
      window.clearTimeout(complimentTimerRef.current);
      complimentTimerRef.current = null;
    }
    setShowComplimentOverlay(false);
    setTryAgainOverlayKey((k) => k + 1);
    setShowTryAgainOverlay(true);
    tryAgainTimerRef.current = window.setTimeout(() => {
      setShowTryAgainOverlay(false);
      tryAgainTimerRef.current = null;
    }, FEEDBACK_OVERLAY_MS);
  }, []);

  const triggerComplimentOverlay = useCallback(() => {
    if (complimentTimerRef.current) {
      window.clearTimeout(complimentTimerRef.current);
    }
    if (tryAgainTimerRef.current) {
      window.clearTimeout(tryAgainTimerRef.current);
      tryAgainTimerRef.current = null;
    }
    setShowTryAgainOverlay(false);
    setComplimentOverlayKey((k) => k + 1);
    setShowComplimentOverlay(true);
    complimentTimerRef.current = window.setTimeout(() => {
      setShowComplimentOverlay(false);
      complimentTimerRef.current = null;
    }, FEEDBACK_OVERLAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (tryAgainTimerRef.current) {
        window.clearTimeout(tryAgainTimerRef.current);
      }
      if (complimentTimerRef.current) {
        window.clearTimeout(complimentTimerRef.current);
      }
      if (streakResetTimerRef.current) {
        window.clearTimeout(streakResetTimerRef.current);
      }
    };
  }, []);

  const loadWord = useCallback(async (progress: number) => {
    setLoading(true);
    setGuess("");
    timeoutHandledRef.current = false;
    setTimeLeft(STREAK_TIMER_SECONDS);

    try {
      let url = `/api/game/streak?progress=${encodeURIComponent(progress)}`;
      const streakSessionId = getOrCreateStreakSessionId();
      if (streakSessionId) {
        url += `&streakSessionId=${encodeURIComponent(streakSessionId)}`;
      }
      const res = await fetch(url);
      const data = (await res.json()) as StartResponse & { error?: string };
      if (data.streakSessionId) {
        persistStreakSessionId(data.streakSessionId);
      }
      if (!res.ok || !data.gameId || !data.scrambledWord) {
        setMessage(data.error ?? "Could not load a word. Try again.");
        setLoading(false);
        return;
      }
      setGameId(data.gameId);
      setScrambledWord(data.scrambledWord);
      setLetterCount(
        typeof data.letterCount === "number"
          ? data.letterCount
          : data.scrambledWord.length,
      );
      setMessage("");
    } catch {
      setMessage("Network error. Check your connection.");
    } finally {
      setLoading(false);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, []);

  const handleReset = useCallback(
    (msg?: string) => {
      setStreak(0);
      if (msg) setMessage(msg);
      void loadWord(0);
    },
    [loadWord],
  );

  const handleTimeout = useCallback(() => {
    if (timeoutHandledRef.current || won) return;
    timeoutHandledRef.current = true;
    triggerTryAgainOverlay();
    triggerWrongFeedback();
    handleReset(streakMessageFor("timeout"));
  }, [handleReset, triggerTryAgainOverlay, triggerWrongFeedback, won]);

  useEffect(() => {
    setMessage(streakMessageFor("start"));
    void loadWord(0);
  }, [loadWord]);

  useEffect(() => {
    if (won || loading || !gameId || !scrambledWord) return;

    setTimeLeft(STREAK_TIMER_SECONDS);
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [gameId, scrambledWord, won, loading, handleTimeout]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!gameId || submitting || loading || won || !guess.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/game/streak/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess }),
      });
      const data = (await res.json()) as { status?: string };

      if (data.status === "correct") {
        const next = streak + 1;
        triggerCorrectFeedback();
        if (next >= STREAK_CHALLENGE_TARGET) {
          setStreak(next);
          setWon(true);
          setShowComplimentOverlay(false);
          setMessage(
            hasBeatTodayTopStreak(next) ? "You are the winner!" : "",
          );
          playSuccessChime();
          pulseSuccessHaptics();
          return;
        }
        setStreak(next);
        if (hasBeatTodayTopStreak(next)) {
          setShowComplimentOverlay(false);
          setMessage("You are the winner!");
        } else {
          triggerComplimentOverlay();
        }
        playSuccessChime();
        pulseSuccessHaptics();
        void loadWord(next);
        return;
      }

      triggerTryAgainOverlay();
      triggerWrongFeedback();
      handleReset(streakMessageFor("wrong"));
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setWon(false);
    setStreak(0);
    setShareCopied(false);
    setMessage(streakMessageFor("start"));
    void loadWord(0);
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.origin : "";
    const text = buildStreakShareText(url);
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  const timerRatio = timeLeft / STREAK_TIMER_SECONDS;
  const timerFillStyle =
    timeLeft <= 5
      ? { background: "#ef4444" }
      : timeLeft <= 15
        ? { background: "#f59e0b" }
        : undefined;
  const timerFillClass =
    timeLeft <= 5
      ? "wg-streak-timer-fill wg-streak-timer-fill--pulse"
      : "wg-streak-timer-fill";
  const letters = scrambledWord.split("");
  const todayTop = getTodayTopStreak();
  const beatTodayTop = hasBeatTodayTopStreak(streak);

  if (won) {
    return (
      <div className="wg-streak-view wg-streak-view--win">
        <p className="top-streak-bar wg-streak-tagline">
          🏆 Today&apos;s Top Streak: {todayTop}/6 — Can you beat it?
        </p>
        {hasBeatTodayTopStreak(streak) && (
          <p className="wg-streak-counter" role="status">
            You are the winner!
          </p>
        )}
        <button
          type="button"
          className="wg-streak-back"
          onClick={onBack}
          aria-label="Back to main game"
        >
          ←
        </button>
        <div className="wg-streak-win">
          <p className="wg-streak-win-icon" aria-hidden>
            🏆
          </p>
          <h2 className="wg-streak-win-title">
            {hasBeatTodayTopStreak(streak) ? "YOU ARE THE WINNER!" : "UNSTOPPABLE"}
          </h2>
          <p className="wg-streak-win-sub">6 words. 0 mistakes. All yours.</p>
          <p className="wg-streak-win-note">
            Most players never make it past 3.
          </p>
          <div className="wg-streak-rank">
            <span className="wg-streak-rank-emoji" aria-hidden>
              🔥
            </span>
            <span className="wg-streak-rank-title">WORD STRIKER</span>
            <span className="wg-streak-rank-sub">Rank earned today</span>
          </div>
          <div className="wg-streak-win-actions">
            <button
              type="button"
              className="wg-btn-primary wg-streak-btn-secondary"
              onClick={handleTryAgain}
            >
              🔁 Try Again
            </button>
            <button
              type="button"
              className="wg-btn-primary"
              onClick={() => void handleShare()}
            >
              {shareCopied ? "Copied! ✓" : "📤 Share Result"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wg-streak-view">
      <p className="top-streak-bar wg-streak-tagline">
        🏆 Today&apos;s Top Streak: {todayTop}/6 — Can you beat it?
      </p>
      {beatTodayTop && (
        <p className="wg-streak-counter" role="status">
          You are the winner!
        </p>
      )}
      <button
        type="button"
        className="wg-streak-back"
        onClick={onBack}
        aria-label="Back to main game"
      >
        ←
      </button>

      <h2 className="wg-streak-header">⚡ STREAK CHALLENGE</h2>
      <p className="wg-streak-tagline">No hints. No help. Just you.</p>

      <p
        className={`wg-streak-counter ${streakPulse ? "wg-streak-counter--pulse" : ""} ${streakResetFlash ? "wg-streak-counter--reset-flash" : ""}`}
        aria-live="polite"
        aria-label={`Streak ${streak} of ${STREAK_CHALLENGE_TARGET}`}
        onAnimationEnd={handleStreakCounterAnimationEnd}
      >
        <span aria-hidden>🔥</span>{" "}
        <span className="wg-streak-counter-score">
          {streak} / {STREAK_CHALLENGE_TARGET}
        </span>
      </p>

      {loading && !scrambledWord ? (
        <p className="py-10 text-center text-sm text-[var(--text-muted)]">
          Loading…
        </p>
      ) : (
        <>
          <div
            className={`wg-streak-letters-wrap ${lettersSuccessGlow ? "wg-streak-letters--success-glow" : ""}`}
            onAnimationEnd={handleLettersWrapAnimationEnd}
          >
            <div className="wg-streak-letters" aria-label="Scrambled word">
              {letters.map((ch, i) => (
                <span
                  key={`${gameId}-${i}-${ch}`}
                  className="wg-streak-letter"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {ch.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="wg-streak-timer-block">
            <div className="wg-streak-timer-row wg-streak-timer-row--end">
              <span
                className={`wg-streak-timer-value tabular-nums ${timeLeft <= 10 ? "wg-streak-timer-value--low" : ""}`}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="wg-progress-track wg-streak-timer-track">
              <div
                className={timerFillClass}
                style={{
                  transform: `scaleX(${timerRatio})`,
                  ...timerFillStyle,
                }}
              />
            </div>
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(ev) => void handleSubmit(ev)}
          >
            {showTryAgainOverlay && (
              <p
                key={tryAgainOverlayKey}
                className="wg-streak-try-again"
                role="status"
                aria-live="polite"
              >
                Try again — you can do it
              </p>
            )}
            {showComplimentOverlay && (
              <p
                key={complimentOverlayKey}
                className="wg-streak-try-again"
                role="status"
                aria-live="polite"
              >
                {STREAK_COMPLIMENT_TEXT}
              </p>
            )}
            <label htmlFor="streak-guess" className="sr-only">
              Your answer
            </label>
            <input
              ref={inputRef}
              id="streak-guess"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={guess}
              onChange={(e) =>
                setGuess(e.target.value.replace(/[^a-zA-Z]/g, ""))
              }
              onAnimationEnd={handleInputAnimationEnd}
              disabled={submitting || loading}
              placeholder="Type your answer"
              className={`wg-input wg-streak-input ${inputCorrectGlow ? "wg-streak-input--correct-glow" : ""} ${inputShake ? "wg-streak-input--shake" : ""}`}
            />
            <button
              type="submit"
              disabled={submitting || loading || !guess.trim()}
              className="wg-btn-primary wg-streak-submit"
            >
              Submit
            </button>
          </form>

          <p className="wg-streak-message" role="status">
            {message}
          </p>
        </>
      )}
    </div>
  );
}
