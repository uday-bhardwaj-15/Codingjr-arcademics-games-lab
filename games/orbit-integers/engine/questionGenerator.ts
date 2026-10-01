import { Question, QuestionOption, IntegerOperation } from '../types';

export function formatInteger(n: number): string {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  }
  return `${n}`;
}

export function formatIntegerPrompt(a: number, b: number, op: '+' | '−'): string {
  const aStr = formatInteger(a);
  const bStr = b < 0 ? `(${formatInteger(b)})` : `${b}`;
  return `${aStr} ${op} ${bStr}`;
}

export function generateIntegerQuestion(
  from: number = -10,
  to: number = 10,
  operation: IntegerOperation = 'mixed',
  excludePrompt?: string
): Question {
  // Pre-generate all valid pairs (a, b) such that answer is within [from, to]
  const validPairs: Array<{ a: number; b: number; op: '+' | '−'; answer: number }> = [];

  const ops: Array<'+' | '−'> =
    operation === 'add' ? ['+'] : operation === 'subtract' ? ['−'] : ['+', '−'];

  for (let a = from; a <= to; a++) {
    for (let b = from; b <= to; b++) {
      for (const op of ops) {
        const ans = op === '+' ? a + b : a - b;
        if (ans >= from && ans <= to) {
          validPairs.push({ a, b, op, answer: ans });
        }
      }
    }
  }

  // Filter out the excluded prompt if possible to prevent identical consecutive questions
  let filtered = validPairs;
  if (excludePrompt && validPairs.length > 1) {
    filtered = validPairs.filter(
      (p) => formatIntegerPrompt(p.a, p.b, p.op) !== excludePrompt
    );
    if (filtered.length === 0) filtered = validPairs;
  }

  const chosen = filtered[Math.floor(Math.random() * filtered.length)] || {
    a: 1,
    b: 1,
    op: '+' as const,
    answer: 2,
  };

  const prompt = formatIntegerPrompt(chosen.a, chosen.b, chosen.op);

  // Generate 3 unique distractors inside [from, to]
  const optionsSet = new Set<number>([chosen.answer]);

  // Candidates from common integer arithmetic misconceptions
  const candidates: number[] = [
    -chosen.answer, // Opposite sign
    chosen.op === '+' ? chosen.a - chosen.b : chosen.a + chosen.b, // Wrong operation
    chosen.answer + 1,
    chosen.answer - 1,
    chosen.answer + 2,
    chosen.answer - 2,
    chosen.a,
    chosen.b,
    -chosen.a,
    -chosen.b,
  ].filter((v) => v >= from && v <= to && v !== chosen.answer);

  // Shuffle candidates
  const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);
  for (const c of shuffledCandidates) {
    if (optionsSet.size >= 4) break;
    optionsSet.add(c);
  }

  // Fill in with any remaining numbers in [from, to] if still under 4
  if (optionsSet.size < 4) {
    const allInRange: number[] = [];
    for (let i = from; i <= to; i++) {
      if (!optionsSet.has(i)) {
        allInRange.push(i);
      }
    }
    const shuffledFill = allInRange.sort(() => Math.random() - 0.5);
    for (const val of shuffledFill) {
      if (optionsSet.size >= 4) break;
      optionsSet.add(val);
    }
  }

  const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  const options: QuestionOption[] = optionsArray.map((val, idx) => ({
    id: `opt_${idx}_${val}`,
    value: val,
    isCorrect: val === chosen.answer,
  }));

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    a: chosen.a,
    b: chosen.b,
    op: chosen.op,
    answer: chosen.answer,
    prompt,
    options,
  };
}

export function generateIntegerQuestions(
  count: number = 15,
  from: number = -10,
  to: number = 10,
  operation: IntegerOperation = 'mixed'
): Question[] {
  const questions: Question[] = [];
  let lastPrompt = '';

  for (let i = 0; i < count; i++) {
    const q = generateIntegerQuestion(from, to, operation, lastPrompt);
    questions.push(q);
    lastPrompt = q.prompt;
  }

  return questions;
}
