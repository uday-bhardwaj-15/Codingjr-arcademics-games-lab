import { Question, WordCategory, AntonymPair } from '../types';
import {
  ANTONYMS_LIST,
  SYNONYMS_LIST,
  HOMOPHONES_LIST,
  DISTRACTOR_POOL,
} from '../constants';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateFrogQuestion(
  category: WordCategory = 'antonyms',
  lastPrompt?: string
): Question {
  let pairList: AntonymPair[] = ANTONYMS_LIST;
  let categoryLabel = 'Antonyms';

  if (category === 'synonyms') {
    pairList = SYNONYMS_LIST;
    categoryLabel = 'Synonyms';
  } else if (category === 'homophones') {
    pairList = HOMOPHONES_LIST;
    categoryLabel = 'Homophones';
  } else if (category === 'mixed') {
    const r = Math.random();
    if (r < 0.6) {
      pairList = ANTONYMS_LIST;
      categoryLabel = 'Antonyms';
    } else if (r < 0.85) {
      pairList = SYNONYMS_LIST;
      categoryLabel = 'Synonyms';
    } else {
      pairList = HOMOPHONES_LIST;
      categoryLabel = 'Homophones';
    }
  }

  // Pick a random pair different from last prompt
  const availablePairs = pairList.filter((p) => p.prompt !== lastPrompt);
  const selectedPair =
    availablePairs[Math.floor(Math.random() * availablePairs.length)] || pairList[0];

  const prompt = selectedPair.prompt;
  const correctAnswer = selectedPair.answer;

  // Build 5 unique distractors
  const usedWords = new Set<string>([
    prompt.toLowerCase(),
    correctAnswer.toLowerCase(),
  ]);

  // Collect potential words from same list first
  const pool = shuffle([
    ...pairList.map((p) => p.answer),
    ...pairList.map((p) => p.prompt),
    ...DISTRACTOR_POOL,
  ]);

  const distractors: string[] = [];
  for (const word of pool) {
    const lower = word.toLowerCase();
    if (!usedWords.has(lower)) {
      usedWords.add(lower);
      distractors.push(word);
      if (distractors.length >= 5) break;
    }
  }

  // Total 6 options (1 correct + 5 distractors)
  const rawOptions = [
    { word: correctAnswer, isCorrect: true },
    ...distractors.map((d) => ({ word: d, isCorrect: false })),
  ];

  const shuffledOptions = shuffle(rawOptions).map((opt, idx) => ({
    id: `fly_${idx}_${Date.now()}_${Math.random()}`,
    word: opt.word,
    isCorrect: opt.isCorrect,
    positionIndex: idx,
  }));

  return {
    prompt,
    answer: correctAnswer,
    categoryLabel,
    options: shuffledOptions,
  };
}
