import { GameManifest } from '../../core/types/match';

export const jumpingChicksManifest: GameManifest = {
  id: 'jumping-chicks',
  title: 'Jumping Chicks',
  subtitle: 'Counting & Number Matching Race',
  description: 'Count the lily petals on each water lily, jump to the matching target number, and race 3 lively chicks to the golden trophy nest!',
  thumbnail: '/assets/thumbnails/jumping-chicks.png',
  badge: 'Multiplayer Arcade Race',
  category: 'Counting & Math',
  gradeLevel: 'K - Grade 2',
  minPlayers: 4,
  maxPlayers: 4,
  routes: {
    lobby: '/games/jumping-chicks',
    play: '/games/jumping-chicks/play',
    results: '/games/jumping-chicks/results',
  },
  supportedRounds: [5, 10, 15],
  defaultRounds: 10
};
