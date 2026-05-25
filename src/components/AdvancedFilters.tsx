"use client";

const LENGTH_OPTIONS = [
  "Any length",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8+",
] as const;

export type FilterValues = {
  startsWith: string;
  endsWith: string;
  contains: string;
  wordLength: string;
};

type AdvancedFiltersProps = {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
};

export function AdvancedFilters({ values, onChange }: AdvancedFiltersProps) {
  const patch = (partial: Partial<FilterValues>) =>
    onChange({ ...values, ...partial });

  return (
    <section
      className="mx-auto mt-6 max-w-3xl px-4 sm:px-6"
      aria-labelledby="advanced-heading"
    >
      <details className="group luxe-card rounded-luxe-lg transition-shadow duration-luxe ease-luxe open:shadow-luxe">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-luxe-lg px-4 py-3 text-left text-base font-medium text-luxe-strong outline-none transition-colors duration-luxe ease-luxe hover:bg-luxe-muted/60 focus-visible:ring-2 focus-visible:ring-[color:var(--luxe-focus-ring)] [&::-webkit-details-marker]:hidden">
          <span id="advanced-heading">Advanced Filters</span>
          <span
            className="text-luxe-tertiary transition-transform duration-luxe ease-luxe group-open:rotate-180"
            aria-hidden
          >
            <ChevronIcon />
          </span>
        </summary>
        <div className="border-t border-luxe px-4 pb-5 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Starts with"
              id="starts"
              placeholder="e.g. h"
              value={values.startsWith}
              onChange={(v) => patch({ startsWith: v })}
            />
            <Field
              label="Ends with"
              id="ends"
              placeholder="e.g. e"
              value={values.endsWith}
              onChange={(v) => patch({ endsWith: v })}
            />
            <Field
              label="Contains"
              id="contains"
              placeholder="e.g. sk"
              value={values.contains}
              onChange={(v) => patch({ contains: v })}
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="word-length"
                className="text-sm font-medium text-luxe-secondary"
              >
                Word length
              </label>
              <select
                id="word-length"
                value={values.wordLength}
                onChange={(e) => patch({ wordLength: e.target.value })}
                className="luxe-input h-12 w-full rounded-luxe-md border border-luxe bg-luxe-muted px-3 text-base text-luxe-text shadow-luxe-inset outline-none transition duration-luxe ease-luxe focus:border-luxe-accent-mid focus:ring-2 focus:ring-[color:var(--luxe-focus-ring)]"
              >
                {LENGTH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}

function Field({
  label,
  id,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-luxe-secondary"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="luxe-input h-12 rounded-luxe-md py-0 text-base"
      />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
