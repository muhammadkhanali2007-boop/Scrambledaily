import { Footer } from "@/components/Footer";
import { WordGameExperience } from "@/components/word-game/WordGameExperience";
import "@/styles/home-game.css";
import "@/styles/home-seo-article.css";

export default function HomePage() {
  return (
    <>
      <WordGameExperience />
      <Footer />
    </>
  );
}
