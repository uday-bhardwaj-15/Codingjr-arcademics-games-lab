import { GameManifest } from '@/core/types/match';

export const islandChaseManifest: GameManifest = {
  id: 'island-chase',
  title: 'Island Chase Subtraction',
  subtitle: 'Jet Ski Multi-Racer',
  description: 'Race jet skis against 3 players by solving subtraction equations! Correct answers surge your boat ahead to the island finish line.',
  thumbnail: '/assets/thumbnails/island-chase.png',
  badge: 'Multiplayer Arcade Race',
  category: 'Subtraction & Math',
  subject: 'subtraction',
  mode: 'versus',
  gradeLevel: 'Grade 1 - 4',
  minPlayers: 4,
  maxPlayers: 4,
  routes: {
    lobby: '/games/island-chase',
    play: '/games/island-chase/play',
    results: '/games/island-chase/results',
  },
  supportedRounds: [12],
  defaultRounds: 12,
};
