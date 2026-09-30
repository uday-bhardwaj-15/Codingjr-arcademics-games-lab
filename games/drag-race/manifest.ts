import { GameManifest } from '@/core/types/match';

export const dragRaceManifest: GameManifest = {
  id: 'drag-race',
  title: 'Drag Race Division',
  subtitle: 'High-Speed Drag Racing',
  description: 'Rev up your dragster and race 3 rival cars down the speedway by solving division equations! Select the correct number button to speed to the finish line.',
  thumbnail: '/assets/thumbnails/drag-race.png',
  badge: 'Multiplayer Drag Race',
  category: 'Division & Math',
  subject: 'division',
  mode: 'versus',
  gradeLevel: 'Grade 3 - 6',
  minPlayers: 4,
  maxPlayers: 4,
  routes: {
    lobby: '/games/drag-race',
    play: '/games/drag-race/play',
    results: '/games/drag-race/results',
  },
  supportedRounds: [10, 12, 15],
  defaultRounds: 10,
};
