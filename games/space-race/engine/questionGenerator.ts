import { MultiplicationQuestion } from '../types';

export interface QuestionGenOptions {
  questionIndex: number;
  lastQuestion?: { a: number; b: number };
  lastCorrectLane?: number;
  repeatLaneCount?: number;
  rng?: () => number;
}

/**
 * Generates a valid multiplication question for Class 3 with 4 unique options.
 */
export function generateMultiplicationQuestion(
  opts: QuestionGenOptions
): MultiplicationQuestion {
  const rng = opts.rng || Math.random;
  const isWarmUp = opts.questionIndex <= 2;

  let a = 2;
  let b = 2;
  let attempts = 0;

  // Generate factors a and b
  while (attempts < 50) {
    attempts++;
    if (isWarmUp) {
      a = Math.floor(rng() * 4) + 2; // 2 to 5
      b = Math.floor(rng() * 4) + 2; // 2 to 5
    } else {
      a = Math.floor(rng() * 9) + 2; // 2 to 10
      b = Math.floor(rng() * 9) + 2; // 2 to 10
    }

    if (opts.lastQuestion) {
      const isIdentical = a === opts.lastQuestion.a && b === opts.lastQuestion.b;
      const isReversed = a === opts.lastQuestion.b && b === opts.lastQuestion.a;
      if (isIdentical || isReversed) {
        continue;
      }
    }
    break;
  }

  const answer = a * b;

  // Candidate distractors
  const candidateDistractors = [
    (a + 1) * b,
    Math.max(1, (a - 1) * b),
    a * (b + 1),
    Math.max(1, a * (b - 1)),
    answer + 1,
    Math.max(1, answer - 1),
    answer + 2,
    Math.max(1, answer - 2),
    answer + 10,
    Math.max(1, answer - 10),
    a + b,
  ];

  // Pick 3 unique distractors that are not equal to answer and >= 0
  const validDistractors: number[] = [];
  const shuffledCandidates = [...candidateDistractors].sort(() => rng() - 0.5);

  for (const d of shuffledCandidates) {
    if (d !== answer && d >= 0 && !validDistractors.includes(d)) {
      validDistractors.push(d);
      if (validDistractors.length === 3) break;
    }
  }

  // If still need distractors, fill with random offsets
  let offset = 3;
  while (validDistractors.length < 3) {
    const candidate = answer + offset;
    if (candidate !== answer && candidate >= 0 && !validDistractors.includes(candidate)) {
      validDistractors.push(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }

  // Pick correct lane (0 to 3), avoiding more than 2 repeats
  let correctLane = Math.floor(rng() * 4);
  if (opts.lastCorrectLane !== undefined && opts.repeatLaneCount !== undefined && opts.repeatLaneCount >= 2) {
    const alternativeLanes = [0, 1, 2, 3].filter((l) => l !== opts.lastCorrectLane);
    correctLane = alternativeLanes[Math.floor(rng() * alternativeLanes.length)];
  }

  // Place answer and distractors into 4 options
  const options: number[] = new Array(4);
  options[correctLane] = answer;

  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== correctLane) {
      options[i] = validDistractors[dIdx++];
    }
  }

  return {
    id: `q_${opts.questionIndex}_${a}x${b}_${Math.round(rng() * 10000)}`,
    a,
    b,
    answer,
    options,
    correctLaneIndex: correctLane,
  };
}
