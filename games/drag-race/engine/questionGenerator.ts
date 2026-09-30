import { DivisionQuestion } from '../types';

/**
 * Generate a list of clean integer division questions.
 * dividend ÷ divisor = quotient
 * Options are guaranteed to include the quotient and 3 distinct reasonable distractors.
 */
export function generateDivisionQuestions(count: number = 10): DivisionQuestion[] {
  const questions: DivisionQuestion[] = [];
  const usedFacts = new Set<string>();

  // Division fact pool (Divisors 1 to 12, quotients 1 to 12)
  const pool: Array<{ dividend: number; divisor: number; quotient: number }> = [];

  // Common grade 3-6 division tables
  for (let divisor = 1; divisor <= 10; divisor++) {
    for (let quotient = 1; quotient <= 10; quotient++) {
      pool.push({
        dividend: divisor * quotient,
        divisor,
        quotient,
      });
    }
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  let poolIdx = 0;
  while (questions.length < count) {
    const item = shuffled[poolIdx % shuffled.length];
    poolIdx++;

    const key = `${item.dividend}÷${item.divisor}`;
    if (usedFacts.has(key) && poolIdx < shuffled.length) {
      continue;
    }
    usedFacts.add(key);

    // Generate 3 unique distractors close to the quotient
    const optionsSet = new Set<number>([item.quotient]);
    const candidates = [
      item.quotient + 1,
      item.quotient - 1,
      item.quotient + 2,
      item.quotient - 2,
      item.quotient + 3,
      item.quotient - 3,
      item.divisor,
      Math.max(1, item.quotient + Math.floor(Math.random() * 5) - 2),
    ].filter((val) => val > 0 && val !== item.quotient);

    // Shuffle candidates
    const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);
    for (const cand of shuffledCandidates) {
      if (optionsSet.size >= 4) break;
      optionsSet.add(cand);
    }

    // Fallback if still under 4
    let fallback = 1;
    while (optionsSet.size < 4) {
      if (!optionsSet.has(fallback)) {
        optionsSet.add(fallback);
      }
      fallback++;
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(item.quotient);

    questions.push({
      id: `q_${questions.length + 1}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dividend: item.dividend,
      divisor: item.divisor,
      quotient: item.quotient,
      prompt: `${item.dividend} ÷ ${item.divisor}`,
      options,
      correctIndex,
    });
  }

  return questions;
}
