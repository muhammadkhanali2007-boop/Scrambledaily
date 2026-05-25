"use client";

import { parseHardModeTipDisplay } from "@/lib/hard-mode-tips";

type HardModeTipDisplayProps = {
  tip: string;
};

export function HardModeTipDisplay({ tip }: HardModeTipDisplayProps) {
  const { title, paragraphs } = parseHardModeTipDisplay(tip);

  return (
    <div
      className="wg-tip-block mb-4 text-left"
      role="status"
      aria-label="Professional tip"
    >
      <p className="wg-tip-label">Professional Tip</p>
      <p className="wg-tip-title">{title}</p>
      {paragraphs.map((p) => (
        <p key={p} className="wg-tip-body">
          {p}
        </p>
      ))}
    </div>
  );
}
