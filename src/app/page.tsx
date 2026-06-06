import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { WordGameExperience } from "@/components/word-game/WordGameExperience";
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion";
import "@/styles/home-seo-article.css";
import "@/styles/streak-seo-article.css";

export default function HomePage() {
  return (
    <>
      <GoogleAdsConversion />
      <Suspense fallback={null}>
        <WordGameExperience />
      </Suspense>
      <Footer />
    </>
  );
}

