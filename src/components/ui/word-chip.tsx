type WordChipProps = {
  word: string;
};

export function WordChip({ word }: WordChipProps) {
  return (
    <button
      type="button"
      className="min-h-[44px] w-full rounded-luxe-sm border border-luxe bg-luxe-muted px-3 py-2.5 text-sm font-medium tracking-wide text-luxe-strong shadow-luxe-soft transition duration-luxe ease-luxe hover:-translate-y-0.5 hover:border-luxe-strong hover:bg-luxe-surface hover:shadow-luxe focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--luxe-focus-ring)] max-sm:active:translate-y-0 sm:w-auto"
    >
      {word}
    </button>
  );
}
