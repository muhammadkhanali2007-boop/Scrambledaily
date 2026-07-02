import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Streak Challenge — Daily Word Game & Global Leaderboard",
  description:
    "Test your word skills in the Streak Challenge. One scrambled word, 45 seconds, no hints. Solve it to keep your streak alive. Compete on the daily leaderboard against players worldwide.",
  keywords: [
    "word streak game",
    "daily word challenge",
    "word game leaderboard",
    "streak word puzzle",
    "daily scramble challenge",
  ],
  alternates: {
    canonical: "https://wordunscramblegame.com/streak-challenge",
  },
  openGraph: {
    title: "Streak Challenge — Can You Keep Your Word Streak Alive?",
    description:
      "One word. 45 seconds. No hints. Solve it or lose your streak. Compete daily on the global leaderboard.",
    url: "https://wordunscramblegame.com/streak-challenge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streak Challenge — Can You Keep Your Word Streak Alive?",
    description:
      "One word. 45 seconds. No hints. Solve it or lose your streak. Compete daily on the global leaderboard.",
  },
};

export default function Page() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Streak Challenge Game</h1>
      <p>This page is live and ready for SEO indexing.</p>
    </main>
  );
}
