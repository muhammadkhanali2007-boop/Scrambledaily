"use client";

import { useEffect, useMemo, useState } from "react";

function seed(n: number, salt: number): number {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Letters from common puzzle words — not the full alphabet grid. */
const PUZZLE_WORDS = [
  "TAKE",
  "APPLE",
  "WORD",
  "BRAIN",
  "PLAY",
  "STREAK",
  "SOLVE",
  "QUIZ",
  "CROSS",
  "PUZZLE",
] as const;

type LetterDepth = "near" | "mid" | "far";

type LetterSpec = {
  id: string;
  char: string;
  x: number;
  y: number;
  rot: number;
  depth: LetterDepth;
  dur: number;
  delay: number;
  scale: number;
  group: number;
};

type GhostWordSpec = {
  scrambled: string;
  solved: string;
  x: number;
  y: number;
  align: "left" | "right";
};

type NetworkEdge = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type ParticleSpec = {
  x: number;
  y: number;
  size: number;
  delay: number;
};

const GHOST_WORDS: GhostWordSpec[] = [
  { scrambled: "TAEK", solved: "TAKE", x: 7, y: 18, align: "left" },
  { scrambled: "LPAEP", solved: "APPLE", x: 91, y: 24, align: "right" },
  { scrambled: "WROD", solved: "WORD", x: 6, y: 52, align: "left" },
  { scrambled: "RNAB", solved: "BRAIN", x: 90, y: 58, align: "right" },
  { scrambled: "LAYP", solved: "PLAY", x: 8, y: 78, align: "left" },
  { scrambled: "EVLOS", solved: "SOLVE", x: 88, y: 82, align: "right" },
];

const PARTICLES: ParticleSpec[] = [
  { x: 14, y: 28, size: 2, delay: 0 },
  { x: 86, y: 34, size: 1.5, delay: -2 },
  { x: 22, y: 62, size: 2, delay: -4 },
  { x: 78, y: 48, size: 1.5, delay: -1 },
  { x: 12, y: 88, size: 2, delay: -3 },
  { x: 92, y: 72, size: 1.5, delay: -5 },
  { x: 50, y: 12, size: 1.5, delay: -2.5 },
];

/** Even spread across viewport including side margins; puzzle letters only. */
function buildLetterSpecs(): LetterSpec[] {
  const specs: LetterSpec[] = [];
  let idx = 0;

  PUZZLE_WORDS.forEach((word, group) => {
    const letters = word.split("");
    const cols = 5;
    const baseX = 6 + (group % cols) * 18 + seed(group, 9) * 4;
    const baseY = 8 + Math.floor(group / cols) * 22 + seed(group, 10) * 6;

    letters.forEach((char, li) => {
      const i = idx++;
      const depthRoll = seed(i, 7);
      const depth: LetterDepth =
        depthRoll < 0.35 ? "far" : depthRoll < 0.7 ? "mid" : "near";

      specs.push({
        id: `${group}-${li}`,
        char,
        x: Math.min(94, Math.max(3, baseX + li * 2.8 + seed(i, 1) * 5)),
        y: Math.min(92, Math.max(4, baseY + seed(i, 2) * 8)),
        rot: -14 + seed(i, 3) * 28,
        depth,
        dur: 88 + seed(i, 4) * 40,
        delay: -seed(i, 5) * 50,
        scale: 0.48 + seed(i, 6) * 0.22,
        group,
      });
    });
  });

  return specs;
}

/** Thin connections between letters in the same puzzle word cluster. */
function buildNetworkEdges(specs: LetterSpec[]): NetworkEdge[] {
  const edges: NetworkEdge[] = [];
  const byGroup = new Map<number, LetterSpec[]>();

  for (const spec of specs) {
    const list = byGroup.get(spec.group) ?? [];
    list.push(spec);
    byGroup.set(spec.group, list);
  }

  byGroup.forEach((letters) => {
    for (let i = 0; i < letters.length - 1; i++) {
      const a = letters[i]!;
      const b = letters[i + 1]!;
      edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    if (letters.length > 2) {
      const first = letters[0]!;
      const last = letters[letters.length - 1]!;
      edges.push({ x1: first.x, y1: first.y, x2: last.x, y2: last.y });
    }
  });

  return edges;
}

const MAX_PARALLAX_PX = 4;

export function HomeAmbientBackground() {
  const specs = useMemo(() => buildLetterSpecs(), []);
  const edges = useMemo(() => buildNetworkEdges(specs), [specs]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const desktop = window.matchMedia("(min-width: 769px)");

    const updateEnabled = () => {
      setParallaxEnabled(
        !reduced.matches && finePointer.matches && desktop.matches,
      );
    };

    updateEnabled();
    reduced.addEventListener("change", updateEnabled);
    finePointer.addEventListener("change", updateEnabled);
    desktop.addEventListener("change", updateEnabled);

    return () => {
      reduced.removeEventListener("change", updateEnabled);
      finePointer.removeEventListener("change", updateEnabled);
      desktop.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!parallaxEnabled) {
      setParallax({ x: 0, y: 0 });
      return;
    }

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({
        x: Math.max(
          -MAX_PARALLAX_PX,
          Math.min(MAX_PARALLAX_PX, nx * MAX_PARALLAX_PX),
        ),
        y: Math.max(
          -MAX_PARALLAX_PX,
          Math.min(MAX_PARALLAX_PX, ny * MAX_PARALLAX_PX),
        ),
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallaxEnabled]);

  const parallaxStyle = parallaxEnabled
    ? { transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }
    : undefined;

  return (
    <div className="wg-page-bg" aria-hidden>
      <div className="wg-page-bg__gradient" />
      <div className="wg-page-bg__gradient-side wg-page-bg__gradient-side--left" />
      <div className="wg-page-bg__gradient-side wg-page-bg__gradient-side--right" />
      <div className="wg-page-bg__spotlight" />
      <div className="wg-page-bg__vignette" />

      <div className="wg-page-bg__atmosphere" style={parallaxStyle}>
        <svg
          className="wg-page-bg__network"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {edges.map((edge, i) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="wg-page-bg__ghost-words">
          {GHOST_WORDS.map((ghost) => (
            <div
              key={`${ghost.scrambled}-${ghost.solved}`}
              className={`wg-bg-ghost wg-bg-ghost--${ghost.align}`}
              style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }}
            >
              <span className="wg-bg-ghost__scrambled">{ghost.scrambled}</span>
              <span className="wg-bg-ghost__arrow" aria-hidden>
                →
              </span>
              <span className="wg-bg-ghost__solved">{ghost.solved}</span>
            </div>
          ))}
        </div>

        <div className="wg-page-bg__particles">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="wg-bg-particle"
              style={
                {
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  "--wg-particle-size": `${p.size}px`,
                  "--wg-particle-delay": `${p.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="wg-page-bg__letters">
          {specs.map((spec) => (
            <span
              key={spec.id}
              className={`wg-bg-letter wg-bg-letter--${spec.depth}`}
              style={
                {
                  "--wg-letter-x": `${spec.x}%`,
                  "--wg-letter-y": `${spec.y}%`,
                  "--wg-letter-rot": `${spec.rot}deg`,
                  "--wg-letter-dur": `${spec.dur}s`,
                  "--wg-letter-delay": `${spec.delay}s`,
                  "--wg-letter-scale": spec.scale,
                } as React.CSSProperties
              }
            >
              {spec.char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
