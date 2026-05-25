import { Footer } from "@/components/Footer";
import { WordifyClient } from "@/components/WordifyClient";

export default function AnagramSolverPage() {
  return (
    <>
      <WordifyClient variant="anagram" />
      <Footer />
    </>
  );
}
