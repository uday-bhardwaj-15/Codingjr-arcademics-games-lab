import { GameManifest } from '@/core/types/match';

export const spaceRaceManifest: GameManifest = {
  id: 'space-race',
  title: 'Space Race Multiplication',
  subtitle: 'High-Speed Space Racer',
  description: 'Pilot your spaceship across 3 laps on the moon by solving multiplication equations! Select the correct chevron answer arrows to surge ahead to the finish banner.',
  thumbnail: '/assets/thumbnails/space-race.png',
  badge: 'Multiplayer Space Race',
  category: 'Multiplication & Math',
  subject: 'multiplication',
  mode: 'versus',
  gradeLevel: 'Grade 2 - 5',
  minPlayers: 4,
  maxPlayers: 4,
  routes: {
    lobby: '/games/space-race',
    play: '/games/space-race/play',
    results: '/games/space-race/results',
  },
  supportedRounds: [12],
  defaultRounds: 12,
};
