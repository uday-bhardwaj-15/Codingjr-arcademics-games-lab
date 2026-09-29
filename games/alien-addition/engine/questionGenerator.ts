import { RoundState, UfoState } from '../types';
import { UFO_SLOTS } from '../constants';
import { SPAWN_Y, COLUMNS_X } from './ufoMotion';

let globalUfoSeq = 0;

const pick = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const pair = (sum: number): { a: number; b: number } => {
  const a = pick(1, sum - 1);
  return { a, b: sum - a };
};

export function generateRound(
  from: number = 1,
  to: number = 12,
  previousTarget?: number
): RoundState {
  const lo = Math.max(from, 2);
  const hi = Math.max(lo + 2, to);

  // 1. Pick target sum in [lo, hi] different from previous target
  let target = pick(lo, hi);
  let attempts = 0;
  while (target === previousTarget && hi > lo && attempts < 20) {
    target = pick(lo, hi);
    attempts++;
  }

  const usedExpressions = new Set<string>();

  // 2. Correct ship equation
  const correctPair = pair(target);
  usedExpressions.add(`${correctPair.a}+${correctPair.b}`);

  // 3. Pick which slot holds the correct ship
  const correctSlotIndex = pick(0, 4);

  // 4. Generate 5 ships
  const ufos: UfoState[] = [];

  // Candidate sums for distractors in [lo, hi], excluding target
  const allPossibleSums: number[] = [];
  for (let s = lo; s <= hi; s++) {
    if (s !== target) allPossibleSums.push(s);
  }

  for (let i = 0; i < 5; i++) {
    const slotConfig = UFO_SLOTS[i];
    globalUfoSeq++;
    const ufoId = `ufo_${globalUfoSeq}_${i}`;

    if (i === correctSlotIndex) {
      ufos.push({
        id: ufoId,
        slot: i,
        a: correctPair.a,
        b: correctPair.b,
        isCorrect: true,
        color: slotConfig.color,
        x: slotConfig.x,
        y: slotConfig.y,
        status: 'flying',
        spawn: 'pop',
      });
    } else {
      // Prioritize believable close distractors within ±3
      const closeSums = allPossibleSums.filter(
        (s) => Math.abs(s - target) <= 3
      );
      const sumPool = closeSums.length >= 2 ? closeSums : allPossibleSums;

      let chosenSum = sumPool[pick(0, sumPool.length - 1)];
      let candidatePair = pair(chosenSum);
      let pairAttempts = 0;

      while (
        pairAttempts < 30 &&
        (chosenSum === target ||
          usedExpressions.has(`${candidatePair.a}+${candidatePair.b}`))
      ) {
        chosenSum = allPossibleSums[pick(0, allPossibleSums.length - 1)];
        candidatePair = pair(chosenSum);
        pairAttempts++;
      }

      usedExpressions.add(`${candidatePair.a}+${candidatePair.b}`);

      ufos.push({
        id: ufoId,
        slot: i,
        a: candidatePair.a,
        b: candidatePair.b,
        isCorrect: false,
        color: slotConfig.color,
        x: slotConfig.x,
        y: slotConfig.y,
        status: 'flying',
        spawn: 'pop',
      });
    }
  }

  return {
    target,
    ufos,
  };
}

export function generateReplacementDistractor(
  target: number,
  from: number,
  to: number,
  existingUfos: UfoState[],
  slotIndex: number
): UfoState {
  const lo = Math.max(from, 2);
  const hi = Math.max(lo + 2, to);
  const slotConfig = UFO_SLOTS[slotIndex] || UFO_SLOTS[0];

  const existingExprs = new Set(existingUfos.map((u) => `${u.a}+${u.b}`));

  const allPossibleSums: number[] = [];
  for (let s = lo; s <= hi; s++) {
    if (s !== target) allPossibleSums.push(s);
  }

  const closeSums = allPossibleSums.filter((s) => Math.abs(s - target) <= 3);
  const sumPool = closeSums.length >= 2 ? closeSums : allPossibleSums;

  let chosenSum = sumPool[pick(0, sumPool.length - 1)];
  let candidatePair = pair(chosenSum);
  let attempts = 0;

  while (
    attempts < 30 &&
    (chosenSum === target ||
      existingExprs.has(`${candidatePair.a}+${candidatePair.b}`))
  ) {
    chosenSum = allPossibleSums[pick(0, allPossibleSums.length - 1)];
    candidatePair = pair(chosenSum);
    attempts++;
  }

  globalUfoSeq++;
  return {
    id: `ufo_repl_${globalUfoSeq}_${slotIndex}`,
    slot: slotIndex,
    a: candidatePair.a,
    b: candidatePair.b,
    isCorrect: false,
    color: slotConfig.color,
    x: COLUMNS_X[slotIndex] ?? slotConfig.x,
    y: SPAWN_Y,
    status: 'flying',
    spawn: 'fade',
  };
}

// Re-rolls the expression of one ship so that it uniquely equals a new target in [lo, hi]
export function reRollShipAsTarget(
  target: number,
  from: number,
  to: number,
  existingUfos: UfoState[],
  shipIndex: number
): { a: number; b: number } {
  const lo = Math.max(from, 2);
  const hi = Math.max(lo + 2, to);
  const clampedTarget = Math.max(lo, Math.min(hi, target));
  const existingExprs = new Set(existingUfos.map((u) => `${u.a}+${u.b}`));

  for (let a = 1; a < clampedTarget; a++) {
    const b = clampedTarget - a;
    if (!existingExprs.has(`${a}+${b}`)) {
      return { a, b };
    }
  }

  const p = pair(clampedTarget);
  return p;
}
