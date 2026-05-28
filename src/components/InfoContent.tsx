const sections = [
  {
    id: "what-is",
    title: "What is a word unscrambler?",
    body: [
      "A word unscrambler helps you discover valid words that can be built from a set of letters. It is useful for puzzles, crosswords, and competitive word games where you need to see every option at a glance.",
      "Word Unscramble Game compares your letters against a plain-text English word list in the /data folder on the server—no account required.",
    ],
  },
  {
    id: "how-to-use",
    title: "How to use this tool",
    body: [
      "Type or paste your letters, then tap Unscramble. Matches are grouped by length so you can line them up with spaces on your board or rack.",
      "Optional filters narrow results by prefix, suffix, substring, or exact length. Use a question mark for a blank tile when you are missing a letter.",
    ],
  },
  {
    id: "tips",
    title: "Tips for winning word games",
    body: [
      "Look for common prefixes and suffixes first to unlock longer plays. Pair high-value letters with premium squares when the board allows it.",
      "When time is short, filter by length to surface bingo-friendly words or short hooks that open the board for your next turn.",
    ],
  },
];

export function InfoContent() {
  return (
    <section
      className="mt-16 border-t border-luxe pt-14"
      aria-labelledby="learn-heading"
    >
      <h2 id="learn-heading" className="sr-only">
        Learn more about Word Unscramble Game
      </h2>
      <div className="space-y-12">
        {sections.map((block) => (
          <article key={block.id} id={block.id} className="max-w-3xl">
            <h3 className="font-display text-lg font-semibold tracking-tight text-luxe-strong sm:text-2xl">
              {block.title}
            </h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-luxe-secondary">
              {block.body.map((p, i) => (
                <p key={`${block.id}-${i}`}>{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
