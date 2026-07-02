import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { UnscrambleSeoArticle } from "@/components/unscramble/UnscrambleSeoArticle";
import { WordifyClient } from "@/components/WordifyClient";
import "@/styles/unscramble-seo-article.css";

export const metadata: Metadata = {
  title: "Word Unscrambler — Instantly Unscramble Any Letters Free",
  description:
    "Use our free Word Unscrambler tool to instantly find all valid words from any letters. Perfect for Scrabble, Words With Friends, Wordle, Jumble and all word games. Enter letters and go.",
  keywords: [
    "word unscrambler",
    "unscramble letters",
    "unscramble words",
    "word finder",
    "jumble solver",
    "scrabble word finder",
  ],
  alternates: {
    canonical: "https://wordunscramblegame.com/unscramble",
  },
  openGraph: {
    title: "Free Word Unscrambler Tool — Find All Words Instantly",
    description:
      "Enter any scrambled letters and instantly see every valid word. Free tool for Scrabble, Wordle, WWF and more.",
    url: "https://wordunscramblegame.com/unscramble",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word Unscrambler Tool — Find All Words Instantly",
    description:
      "Enter any scrambled letters and instantly see every valid word. Free tool for Scrabble, Wordle, WWF and more.",
  },
};

export default function UnscramblePage() {
  return (
    <>
      <div id="top">
        <WordifyClient variant="unscrambler" />
      </div>
      <UnscrambleSeoArticle />
      <Footer />
    </>
  );
}
