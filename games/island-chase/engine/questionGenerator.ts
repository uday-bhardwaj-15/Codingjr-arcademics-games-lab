import { SubtractionQuestion } from '../types';

let globalQuestionSeq = 0;

export interface GeneratorContext {
  questionIndex: number;
  lastQuestion?: { a: number; b: number };
  lastCorrectSlot?: number;
  repeatSlotCount?: number;
}

const pickInt = (min: number, max: number, rng: () => number = Math.random) =>
  min + Math.floor(rng() * (max - min + 1));

/**
 * Generates a subtraction question with 4 unique non-negative options.
 */
export function generateSubtractionQuestion(
  context: GeneratorContext,
  rng: () => number = Math.random
): SubtractionQuestion {
  globalQuestionSeq++;
  const { questionIndex, lastQuestion, lastCorrectSlot, repeatSlotCount = 0 } = context;

  let a = 2;
  let b = 1;
  let attempts = 0;

  // Question 1 & 2 warm-up (a <= 9)
  const isWarmUp = questionIndex <= 2;

  while (attempts < 50) {
    if (isWarmUp) {
      a = pickInt(2, 9, rng);
      b = pickInt(1, a, rng);
    } else {
      a = pickInt(2, 20, rng);
      // Encourage regrouping for a > 10 in ~50% of questions
      if (a > 10 && rng() < 0.5) {
        const lastDigit = a % 10;
        const minB = lastDigit + 1;
        const maxB = 9;
        if (minB <= maxB && minB <= a) {
          b = pickInt(minB, Math.min(maxB, a), rng);
        } else {
          b = pickInt(1, a, rng);
        }
      } else {
        b = pickInt(1, a, rng);
      }
    }

    if (!lastQuestion || a !== lastQuestion.a || b !== lastQuestion.b) {
      break;
    }
    attempts++;
  }

  const answer = a - b;

  // Generate 3 unique distractors
  const candidatePool: number[] = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 3,
    answer - 3,
    b,
    a,
    a + b <= 25 ? a + b : answer + 4,
  ].filter((val) => val >= 0 && val !== answer);

  const distractorSet = new Set<number>();
  for (const cand of candidatePool) {
    if (distractorSet.size >= 3) break;
    distractorSet.add(cand);
  }

  // If still need distractors, generate close positive integers
  let offset = 4;
  while (distractorSet.size < 3) {
    if (answer + offset >= 0 && answer + offset !== answer) {
      distractorSet.add(answer + offset);
    }
    if (distractorSet.size < 3 && answer - offset >= 0 && answer - offset !== answer) {
      distractorSet.add(answer - offset);
    }
    offset++;
  }

  const distractors = Array.from(distractorSet).slice(0, 3);
  const options = [answer, ...distractors];

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  let correctIndex = options.indexOf(answer);

  // Avoid repeating the same correct slot more than 2 times in a row
  if (
    lastCorrectSlot !== undefined &&
    correctIndex === lastCorrectSlot &&
    repeatSlotCount >= 2
  ) {
    const otherSlots = [0, 1, 2, 3].filter((s) => s !== lastCorrectSlot);
    const swapSlot = otherSlots[Math.floor(rng() * otherSlots.length)];
    [options[correctIndex], options[swapSlot]] = [options[swapSlot], options[correctIndex]];
    correctIndex = swapSlot;
  }

  return {
    id: `q_${globalQuestionSeq}_${a}_${b}`,
    a,
    b,
    answer,
    options,
    correctIndex,
  };
}
