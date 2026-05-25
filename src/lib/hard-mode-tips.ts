/**
 * Hard mode: professional word-solving tips (not answer hints).
 * Full production copy — title + body, no shortening or paraphrasing.
 */

export const HARD_MODE_TIP_COUNT = 20;

export const HARD_MODE_RECENT_WINDOW = 6;

export type HardModeTipEntry = {
  id: number;
  title: string;
  body: string;
};

/** Tips 1–20 — exact production wording. */
export const HARD_MODE_TIP_LIBRARY: readonly HardModeTipEntry[] = [
  {
    id: 1,
    title: "Separate Vowels from Consonants First",
    body: "Professionals start by separating vowels and consonants.\nEnglish words follow structured vowel patterns, so this quickly reduces combinations and reveals structure.",
  },
  {
    id: 2,
    title: "Hunt for -ING Endings",
    body: "-ING is a very common word pattern in English.\nIf you see I, N, G together, lock them as the ending and solve the rest as the base word.",
  },
  {
    id: 3,
    title: "Check for -ED and -LY Endings",
    body: "-ED and -LY appear very frequently in English words.\nSpotting them early helps predict word structure and reduces guessing effort.",
  },
  {
    id: 4,
    title: "Spot Prefixes Immediately",
    body: "UN-, RE-, DIS-, IN-, PRE-, OVER- are strong clues.\nIf detected early, they lock the start of the word and simplify the remaining letters.",
  },
  {
    id: 5,
    title: "Count Vowels First",
    body: "Vowel count defines structure: 3 = flexible, 2 = balanced, 1 = central core.\nThis quick check immediately narrows possible arrangements.",
  },
  {
    id: 6,
    title: "Recognize Common Letter Pairs",
    body: "Pairs like TH, SH, CH, ST, TR appear very often in English.\nFinding them early gives strong anchors inside the scrambled word.",
  },
  {
    id: 7,
    title: "Re-sort Letters Mentally",
    body: "Rearrange letters in different mental orders (vowels first, reverse, groups).\nThis breaks fixed patterns and helps reveal hidden structures.",
  },
  {
    id: 8,
    title: "Fix One Vowel Position",
    body: "Place one vowel in a stable position (usually middle or second slot).\nThen test consonants around it to quickly form possible words.",
  },
  {
    id: 9,
    title: "Find Smaller Words Inside",
    body: "Many scrambles contain smaller valid words or fragments.\nIdentifying them first gives a strong base to build the full word.",
  },
  {
    id: 10,
    title: "Use Letter Frequency",
    body: "E, T, A, O, I, N are most common in English words.\nIf present, they are usually part of the core structure, not random letters.",
  },
  {
    id: 11,
    title: "Look for -TION and -MENT Endings",
    body: "-TION and -MENT are very common in longer English words.\nIf you spot T, I, O, N together, try locking the suffix and solving the rest around it.",
  },
  {
    id: 12,
    title: "Group Consonant Clusters",
    body: "Clusters like STR, SPR, CHR, BR often stay together in real words.\nFinding these groups helps you quickly identify word structure.",
  },
  {
    id: 13,
    title: "Think in Syllables, Not Letters",
    body: "Break letters into possible syllable chunks instead of individual letters.\nMost 6–7 letter words form 2–3 natural sound parts.",
  },
  {
    id: 14,
    title: "Reshuffle Visually or Physically",
    body: "Changing letter order breaks mental fixation on one wrong pattern.\nThis often reveals combinations you initially missed.",
  },
  {
    id: 15,
    title: "Reset Your Focus Quickly",
    body: "If stuck, look away for a few seconds and return fresh.\nThis resets mental bias and improves pattern recognition.",
  },
  {
    id: 16,
    title: "Use Context or Category",
    body: "If the game has a theme, always use it as a filter.\nContext drastically reduces possible valid word options.",
  },
  {
    id: 17,
    title: "Start with Flexible Consonants",
    body: "Letters like S, R, T, N appear in many word positions.\nTesting them first increases your chance of early structure detection.",
  },
  {
    id: 18,
    title: "Identify Rare Letters Early",
    body: "Letters like Q, Z, X, J have limited placement options.\nFixing them early reduces confusion in remaining arrangement.",
  },
  {
    id: 19,
    title: "Use Root Word Knowledge",
    body: "Many English words come from roots like GRAPH, PHON, PORT.\nRecognizing these patterns helps decode advanced vocabulary faster.",
  },
  {
    id: 20,
    title: "Build Daily Pattern Recognition",
    body: "Word solving improves with consistent practice over time.\nThe more you play, the faster your brain recognizes patterns automatically.",
  },
] as const;

/**
 * User-facing tip text (no numbers — ids are internal only).
 * Title + full body, exact production wording.
 */
export function formatHardModeTipDisplay(tipId: number): string {
  const tip =
    HARD_MODE_TIP_LIBRARY[tipId - 1] ?? HARD_MODE_TIP_LIBRARY[0]!;
  return `${tip.title}\n\n${tip.body}`;
}

export function getHardModeTipEntry(tipId: number): HardModeTipEntry {
  return HARD_MODE_TIP_LIBRARY[tipId - 1] ?? HARD_MODE_TIP_LIBRARY[0]!;
}

export type HardTipSessionState = {
  shuffledOrder: number[];
  usedTipIds: number[];
  rotationIndex: number;
};

function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
  return arr;
}

export function createHardTipState(): HardTipSessionState {
  return {
    shuffledOrder: shuffleIndices(HARD_MODE_TIP_COUNT),
    usedTipIds: [],
    rotationIndex: 0,
  };
}

function tipDisplayById(tipId: number): string {
  return formatHardModeTipDisplay(tipId);
}

function wasRecentlyUsed(
  tipId: number,
  usedTipIds: number[],
  window: number,
): boolean {
  return usedTipIds.slice(-window).includes(tipId);
}

export function getContextTipIds(answer: string): number[] {
  const w = answer.toLowerCase().replace(/[^a-z]/g, "");
  const ids: number[] = [];

  if (w.endsWith("ing")) ids.push(2);
  if (w.endsWith("ed") || w.endsWith("ly")) ids.push(3);
  if (/^(un|re|dis|in|pre|over)/.test(w)) ids.push(4);
  if (/tion$/.test(w)) ids.push(11);
  if (/ment$/.test(w)) ids.push(11);
  if (/(th|sh|ch|st|tr)/.test(w)) ids.push(6);
  if (/(str|spr|chr|br)/.test(w)) ids.push(12);
  if (/[qzxj]/.test(w)) ids.push(18);
  if ((w.match(/[aeiouy]/gi)?.length ?? 0) >= 2) ids.push(5);
  if (w.length >= 6) ids.push(13);
  if (/^(graph|phon|port)/.test(w) || /(graph|phon|port)/.test(w)) {
    ids.push(19);
  }

  return [...new Set(ids)];
}

export function getAttemptTipIds(wrongNumber: number): number[] {
  if (wrongNumber <= 2) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (wrongNumber <= 4) return [8, 9, 10, 11, 12, 13, 14, 15, 16];
  return [14, 15, 16, 17, 18, 19, 20];
}

function reshuffleExhaustedState(state: HardTipSessionState): HardTipSessionState {
  let next = shuffleIndices(HARD_MODE_TIP_COUNT);
  const prev = state.shuffledOrder.join(",");
  let guard = 0;
  while (next.join(",") === prev && guard++ < 8) {
    next = shuffleIndices(HARD_MODE_TIP_COUNT);
  }
  return {
    shuffledOrder: next,
    usedTipIds: [],
    rotationIndex: 0,
  };
}

function pickFromRotation(
  state: HardTipSessionState,
  preferIds?: number[],
): { tipId: number; state: HardTipSessionState } {
  let s = state;
  if (s.usedTipIds.length >= HARD_MODE_TIP_COUNT) {
    s = reshuffleExhaustedState(s);
  }

  const prefer = new Set(preferIds ?? []);

  for (let pass = 0; pass < HARD_MODE_TIP_COUNT; pass++) {
    for (let i = 0; i < HARD_MODE_TIP_COUNT; i++) {
      const pos = (s.rotationIndex + i) % HARD_MODE_TIP_COUNT;
      const idx = s.shuffledOrder[pos]!;
      const tipId = idx + 1;
      if (prefer.size && !prefer.has(tipId)) continue;
      if (s.usedTipIds.includes(tipId)) continue;
      if (wasRecentlyUsed(tipId, s.usedTipIds, HARD_MODE_RECENT_WINDOW)) {
        continue;
      }
      return {
        tipId,
        state: {
          ...s,
          usedTipIds: [...s.usedTipIds, tipId],
          rotationIndex: (pos + 1) % HARD_MODE_TIP_COUNT,
        },
      };
    }
    if (prefer.size) {
      prefer.clear();
      continue;
    }
    break;
  }

  for (let i = 0; i < HARD_MODE_TIP_COUNT; i++) {
    const pos = (s.rotationIndex + i) % HARD_MODE_TIP_COUNT;
    const tipId = s.shuffledOrder[pos]! + 1;
    if (!wasRecentlyUsed(tipId, s.usedTipIds, HARD_MODE_RECENT_WINDOW)) {
      return {
        tipId,
        state: {
          ...s,
          usedTipIds: [...s.usedTipIds, tipId],
          rotationIndex: (pos + 1) % HARD_MODE_TIP_COUNT,
        },
      };
    }
  }

  const tipId = s.shuffledOrder[s.rotationIndex]! + 1;
  return {
    tipId,
    state: {
      ...s,
      usedTipIds: [...s.usedTipIds, tipId],
      rotationIndex: (s.rotationIndex + 1) % HARD_MODE_TIP_COUNT,
    },
  };
}

export function selectHardModeTip(
  answer: string,
  wrongNumber: number,
  state: HardTipSessionState,
): { tip: string; state: HardTipSessionState } {
  const contextIds = getContextTipIds(answer);
  const attemptIds = getAttemptTipIds(wrongNumber);
  const attemptSet = new Set(attemptIds);

  const tryContext = (ids: number[]) => {
    for (const id of ids) {
      if (state.usedTipIds.includes(id)) continue;
      if (wasRecentlyUsed(id, state.usedTipIds, HARD_MODE_RECENT_WINDOW)) {
        continue;
      }
      return {
        tip: tipDisplayById(id),
        state: {
          ...state,
          usedTipIds: [...state.usedTipIds, id],
          rotationIndex: state.rotationIndex,
        },
      };
    }
    return null;
  };

  const contextualInBand = contextIds.filter((id) => attemptSet.has(id));
  const hit =
    tryContext(contextualInBand) ?? tryContext(contextIds);
  if (hit) return hit;

  const { tipId, state: next } = pickFromRotation(state, attemptIds);
  return { tip: tipDisplayById(tipId), state: next };
}

export function hardModeTipFallback(
  answer: string,
  wrongNumber: number,
): string {
  const context = getContextTipIds(answer);
  const attempt = getAttemptTipIds(wrongNumber);
  for (const id of context) {
    if (attempt.includes(id)) return tipDisplayById(id);
  }
  for (const id of context) return tipDisplayById(id);
  const idx = Math.min(wrongNumber - 1, HARD_MODE_TIP_COUNT - 1);
  return formatHardModeTipDisplay(Math.max(1, idx + 1));
}

/** Split display string into title line and body paragraphs for UI. */
export function parseHardModeTipDisplay(text: string): {
  title: string;
  paragraphs: string[];
} {
  let trimmed = text.trim();
  trimmed = trimmed.replace(/^Tip\s+\d+\s*[—–-]\s*/i, "");
  const split = trimmed.split(/\n\n+/);
  const title = split[0] ?? trimmed;
  const body = split.slice(1).join("\n\n");
  const paragraphs = body
    ? body.split(/\n/).map((p) => p.trim()).filter(Boolean)
    : [];
  return { title, paragraphs };
}
