"use client";

type SearchBoxProps = {
  letters: string;
  onLettersChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export function SearchBox({
  letters,
  onLettersChange,
  onSubmit,
  loading,
}: SearchBoxProps) {
  return (
    <section
      className="mx-auto max-w-3xl px-4 sm:px-6"
      aria-label="Unscramble letters"
    >
      <div className="luxe-card rounded-luxe p-5 sm:p-7">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) onSubmit();
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
            <label htmlFor="letters-input" className="sr-only">
              Letters to unscramble
            </label>
            <input
              id="letters-input"
              name="letters"
              type="text"
              value={letters}
              onChange={(e) => onLettersChange(e.target.value)}
              inputMode="text"
              autoComplete="off"
              placeholder="Enter letters here..."
              disabled={loading}
              className="luxe-input min-h-14 flex-1 rounded-luxe-md py-3.5 font-sans text-base disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading}
              className="luxe-btn-primary min-h-12 w-full px-8 disabled:opacity-70 sm:min-h-14 sm:w-auto sm:shrink-0"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Working…</span>
                </>
              ) : (
                "Unscramble"
              )}
            </button>
          </div>
          <p className="mt-3 text-sm text-luxe-tertiary">
            Use ? for blank tiles
          </p>
        </form>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#04302d]/30 border-t-[#04302d] dark:border-[#04302d]/30 dark:border-t-[#04302d]"
      aria-hidden
    />
  );
}
