import { Footer } from "@/components/Footer";
import { InfoContent } from "@/components/InfoContent";
import { WordifyClient } from "@/components/WordifyClient";

export default function UnscramblePage() {
  return (
    <>
      <WordifyClient variant="unscrambler" />
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <InfoContent />
        </div>
      </div>
      <Footer />
    </>
  );
}
