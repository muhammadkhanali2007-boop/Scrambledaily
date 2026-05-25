import type { Metadata } from "next";
import { SolverHashRedirect } from "@/components/SolverHashRedirect";

export const metadata: Metadata = {
  title: "Unscramble",
  description:
    "Unscramble letters into valid words. Filters, anagram mode, and tips.",
};

export default function UnscrambleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SolverHashRedirect />
      {children}
    </>
  );
}
