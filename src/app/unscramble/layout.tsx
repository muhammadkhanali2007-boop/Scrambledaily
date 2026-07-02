import { SolverHashRedirect } from "@/components/SolverHashRedirect";


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
