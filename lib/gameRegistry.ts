import { GameManifest } from '../core/types/match';
import { jumpingChicksManifest } from '../games/jumping-chicks/manifest';
import { alienAdditionManifest } from '../games/alien-addition/manifest';

export const gameRegistry: GameManifest[] = [
  jumpingChicksManifest,
  alienAdditionManifest,
  {
    id: 'memory-match',
    title: 'Memory Match Safari',
    subtitle: 'Card Matching Multi-Racer',
    description: 'Flip and match jungle animal pairs against 3 speedy racers!',
    thumbnail: '/assets/thumbnails/memory-match.png',
    badge: 'Coming Soon',
    category: 'Memory & Focus',
    subject: 'subtraction',
    gradeLevel: 'Grade 1 - 4',
    minPlayers: 4,
    maxPlayers: 4,
    routes: {
      lobby: '/games/memory-match',
      play: '/games/memory-match/play',
      results: '/games/memory-match/results'
    },
    defaultRounds: 8
  },
  {
    id: 'math-racer',
    title: 'Math Sprint Turbo',
    subtitle: 'High-Speed Multiplication',
    description: 'Solve arithmetic equations to turbocharge your race kart to the finish line!',
    thumbnail: '/assets/thumbnails/math-racer.png',
    badge: 'Coming Soon',
    category: 'Speed Multiplication',
    subject: 'multiplication',
    gradeLevel: 'Grade 2 - 5',
    minPlayers: 4,
    maxPlayers: 4,
    routes: {
      lobby: '/games/math-racer',
      play: '/games/math-racer/play',
      results: '/games/math-racer/results'
    },
    defaultRounds: 12
  }
];

export function getGameManifest(gameId: string): GameManifest | undefined {
  return gameRegistry.find(g => g.id === gameId);
}
