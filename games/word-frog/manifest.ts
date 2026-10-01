import { GameManifest } from '@/core/types/match';

export const wordFrogManifest: GameManifest = {
  id: 'word-frog',
  title: 'Word Frog',
  subtitle: 'Language Arts Games, Antonyms',
  description: 'Help the hungry frog catch dragonflies by finding the correct antonyms, synonyms, and homophones! Zap matching words with your sticky tongue in this fast-paced word game.',
  thumbnail: '/assets/thumbnails/word-frog.png',
  badge: 'Language Arts & Antonyms',
  category: 'Language Arts',
  subject: 'language-arts',
  mode: 'solo',
  gradeLevel: 'Grade 2 - 5',
  minPlayers: 1,
  maxPlayers: 1,
  routes: {
    lobby: '/games/word-frog',
    play: '/games/word-frog/play',
    results: '/games/word-frog/results',
  },
  supportedRounds: [60],
  defaultRounds: 60,
};
