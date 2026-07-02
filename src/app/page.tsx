import { Suspense } from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { WordGameExperience } from "@/components/word-game/WordGameExperience";
import { ConversionTracker } from "@/components/ConversionTracker";
import { HomeSeoArticle } from "@/components/home/HomeSeoArticle";
import { StreakSeoArticle } from "@/components/streak/StreakSeoArticle";
import "@/styles/home-seo-article.css";
import "@/styles/streak-seo-article.css";

export const metadata: Metadata = {
  title: "Word Unscramble Game — Play Free Online (Easy, Medium & Hard)",
  description:
    "Play the free Word Unscramble Game online. Solve scrambled words across Easy, Medium and Hard levels. Build your streak, earn XP and learn new words every day. No signup needed.",
  keywords: [
    "word unscramble game",
    "word scramble game online free",
    "unscramble words game",
    "daily word game",
  ],
  alternates: {
    canonical: "https://wordunscramblegame.com",
  },
  openGraph: {
    title: "Word Unscramble Game — Play Free Online",
    description:
      "Solve scrambled words, build streaks and level up your vocabulary. Free daily word game — no signup needed.",
    url: "https://wordunscramblegame.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Unscramble Game — Play Free Online",
    description:
      "Solve scrambled words, build streaks and level up your vocabulary. Free daily word game — no signup needed.",
  },
};

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const isStreak = searchParams.streak === "1";

  return (
    <>
      <h1 className="sr-only">Word Unscramble Game — Play Free Online</h1>
      <ConversionTracker />
      <Suspense fallback={null}>
        <WordGameExperience />
      </Suspense>
      {isStreak ? <StreakSeoArticle /> : <HomeSeoArticle />}
      <Footer />
    </>
  );
}
