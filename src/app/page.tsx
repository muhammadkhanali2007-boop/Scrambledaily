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
  title: "Word Unscramble Game — Play Free Online",
  description:
    "Play the Word Unscramble Game free online. Unscramble letters, solve anagrams, and build your word streak with easy, medium, and hard levels.",
  openGraph: {
    title: "Word Unscramble Game — Play Free Online",
    description:
      "Play the Word Unscramble Game free online. Unscramble letters, solve anagrams, and build your word streak with easy, medium, and hard levels.",
    type: "website",
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
