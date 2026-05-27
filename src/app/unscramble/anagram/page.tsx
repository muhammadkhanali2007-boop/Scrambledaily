import { Footer } from "@/components/Footer";
import { WordifyClient } from "@/components/WordifyClient";

export default function AnagramSolverPage() {
  return (
    <>
      <div id="top">
        <WordifyClient variant="anagram" />
      </div>
      <Footer />
    </>
  );
}
