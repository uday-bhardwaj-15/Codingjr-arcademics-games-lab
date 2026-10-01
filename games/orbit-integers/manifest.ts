import { GameManifest } from '@/core/types/match';

export const orbitIntegersManifest: GameManifest = {
  id: 'orbit-integers',
  title: 'Orbit Integers',
  subtitle: 'Space Race for Integer Arithmetic',
  description: 'Fly your pod through a cosmic orbit past planets and asteroids by solving integer arithmetic equations! Drift forward and boost with each correct answer in a 4-pod race.',
  thumbnail: '/assets/thumbnails/orbit-integers.png',
  badge: 'Multiplayer Space Race',
  category: 'Integers & Math',
  subject: 'integers',
  mode: 'versus',
  gradeLevel: 'Grade 5 - 8',
  minPlayers: 4,
  maxPlayers: 4,
  routes: {
    lobby: '/games/orbit-integers',
    play: '/games/orbit-integers/play',
    results: '/games/orbit-integers/results',
  },
  supportedRounds: [15],
  defaultRounds: 15,
};
