import { GameManifest } from '../core/types/match';
import { gameRegistry } from './gameRegistry';

export interface SubjectGroup {
  id: string;
  name: string;
  description: string;
  games: GameManifest[];
}

export const SUBJECT_METADATA: Record<string, { name: string; description: string; order: number }> = {
  counting: {
    name: 'Counting',
    description: 'Learn number recognition, patterns, and counting foundations',
    order: 1,
  },
  addition: {
    name: 'Addition',
    description: 'Master fast single and multi-digit addition through high-speed racing',
    order: 2,
  },
  subtraction: {
    name: 'Subtraction',
    description: 'Boost subtraction fluency and quick mental math',
    order: 3,
  },
  multiplication: {
    name: 'Multiplication',
    description: 'Accelerate times table recall with fun multiplayer arcade races',
    order: 4,
  },
  division: {
    name: 'Division',
    description: 'High-speed drag racing to sharpen fast division facts and math fluency',
    order: 5,
  },
};

export function getSubjectGroups(): SubjectGroup[] {
  const map = new Map<string, GameManifest[]>();

  gameRegistry.forEach((game) => {
    const subj = game.subject || 'other';
    if (!map.has(subj)) {
      map.set(subj, []);
    }
    map.get(subj)!.push(game);
  });

  const groups: SubjectGroup[] = [];

  map.forEach((games, subjectId) => {
    const meta = SUBJECT_METADATA[subjectId] || {
      name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
      description: `Fun educational games for ${subjectId}`,
      order: 99,
    };

    groups.push({
      id: subjectId,
      name: meta.name,
      description: meta.description,
      games,
    });
  });

  return groups.sort((a, b) => {
    const orderA = SUBJECT_METADATA[a.id]?.order ?? 99;
    const orderB = SUBJECT_METADATA[b.id]?.order ?? 99;
    return orderA - orderB;
  });
}
