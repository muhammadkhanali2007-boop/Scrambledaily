import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { WordGameExperience } from "@/components/word-game/WordGameExperience";
import "@/styles/home-seo-article.css";
import "@/styles/streak-seo-article.css";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <WordGameExperience />
      </Suspense>
      <Footer />
    </>
  );
}
