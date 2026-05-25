import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anagram Solver",
  description:
    "Find full-length anagrams that use every letter on your rack. Wildcard tiles supported.",
};

export default function AnagramSolverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
