"use client";

/** Eight lightweight CSS sparkles — no canvas, under 800ms. */
const SPARKLE_COUNT = 8;

type WinSparkleBurstProps = {
  burstKey: number;
};

export function WinSparkleBurst({ burstKey }: WinSparkleBurstProps) {
  if (burstKey <= 0) return null;

  return (
    <div
      key={burstKey}
      className="wg-win-sparkle"
      aria-hidden
    >
      {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
        <span
          key={i}
          className="wg-win-sparkle__particle"
          style={
            {
              "--wg-sparkle-angle": `${(360 / SPARKLE_COUNT) * i}deg`,
              "--wg-sparkle-delay": `${i * 25}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
