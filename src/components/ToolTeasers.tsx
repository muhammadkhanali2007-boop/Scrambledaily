type ToolTeasersProps = {
  /** True on /unscramble/anagram — hide mode-switch copy. */
  anagramPage?: boolean;
};

export function ToolTeasers({ anagramPage = false }: ToolTeasersProps) {
  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-2 pt-4 sm:px-6 lg:px-8"
      aria-label="Other solvers"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="luxe-card rounded-luxe-lg border-luxe bg-luxe-muted/70 p-5 backdrop-blur-sm">
          <h2 className="font-display text-base font-semibold text-luxe-strong">
            Anagram Solver
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-luxe-secondary">
            {anagramPage
              ? "Enter your rack to find full-length anagrams that use every tile."
              : "Use the mode switch in the hero to run full-length anagrams with the same dictionary as Unscramble."}
          </p>
        </article>
      </div>
    </section>
  );
}
