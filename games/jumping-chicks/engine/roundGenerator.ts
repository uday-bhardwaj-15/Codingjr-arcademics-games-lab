import { RoundState, PlatformOption } from '../types';
import { randomInt, shuffleArray } from '@/core/utils/random';

export function generateRound(
  range: [number, number] = [1, 10],
  previousTarget?: number
): RoundState {
  const [min, max] = range;

  // Pick target number distinct from previous target if possible
  let target = randomInt(min, max);
  if (previousTarget !== undefined && max - min >= 2) {
    let attempts = 0;
    while (target === previousTarget && attempts < 10) {
      target = randomInt(min, max);
      attempts++;
    }
  }

  // Generate 3 unique distractors within or around the range
  const usedCounts = new Set<number>([target]);
  const distractors: number[] = [];

  // Candidate pool
  const candidatePool: number[] = [];
  for (let i = min; i <= max; i++) {
    if (i !== target) candidatePool.push(i);
  }

  // If pool has enough candidates, shuffle and pick 3
  const shuffledPool = shuffleArray(candidatePool);
  for (const num of shuffledPool) {
    if (distractors.length < 3) {
      distractors.push(num);
      usedCounts.add(num);
    }
  }

  // Safety fallback if range was somehow < 4 numbers
  let fallbackVal = 1;
  while (distractors.length < 3) {
    if (!usedCounts.has(fallbackVal)) {
      distractors.push(fallbackVal);
      usedCounts.add(fallbackVal);
    }
    fallbackVal++;
  }

  // Form the 4 options (1 correct, 3 wrong)
  const optionsRaw: { count: number; isCorrect: boolean }[] = [
    { count: target, isCorrect: true },
    { count: distractors[0], isCorrect: false },
    { count: distractors[1], isCorrect: false },
    { count: distractors[2], isCorrect: false }
  ];

  const shuffledOptions = shuffleArray(optionsRaw);

  const options: PlatformOption[] = shuffledOptions.map((opt: { count: number; isCorrect: boolean }, idx: number) => ({
    id: `platform-${idx}`,
    count: opt.count,
    isCorrect: opt.isCorrect
  }));

  return {
    targetNumber: target,
    options
  };
}
