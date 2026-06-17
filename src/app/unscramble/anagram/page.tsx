import { Footer } from "@/components/Footer";
import { AnagramSeoArticle } from "@/components/anagram/AnagramSeoArticle";
import { WordifyClient } from "@/components/WordifyClient";

export default function AnagramSolverPage() {
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
