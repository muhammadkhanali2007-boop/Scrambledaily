import { Footer } from "@/components/Footer";
import { UnscrambleSeoArticle } from "@/components/unscramble/UnscrambleSeoArticle";
import { WordifyClient } from "@/components/WordifyClient";
import "@/styles/unscramble-seo-article.css";

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
