import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AnagramSeoArticle } from "@/components/anagram/AnagramSeoArticle";
import { WordifyClient } from "@/components/WordifyClient";

export const metadata: Metadata = {
  title: "Anagram Solver — Find Every Word Hidden in Your Letters",
  description:
    "Free Anagram Solver that finds every valid word hidden in your letters. Discover famous anagrams, sharpen your brain and dominate word games like Scrabble and Words With Friends.",
  keywords: [
    "anagram solver",
    "anagram finder",
    "word anagram",
    "solve anagram",
    "anagram maker",
    "letters to words",
  ],
  alternates: {
    canonical: "https://wordunscramblegame.com/anagram-solver",
  },
  openGraph: {
    title: "Free Anagram Solver — Unscramble Any Word Instantly",
    description:
      "Find every anagram hidden in your letters. Free, fast and accurate anagram solver for all word games.",
    url: "https://wordunscramblegame.com/anagram-solver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Anagram Solver — Unscramble Any Word Instantly",
    description:
      "Find every anagram hidden in your letters. Free, fast and accurate anagram solver for all word games.",
  },
};

export default function Page() {
  return (
    <>
      <div id="top">
        <WordifyClient variant="anagram" />
      </div>
      <AnagramSeoArticle />
      <Footer />
    </>
  );
}
