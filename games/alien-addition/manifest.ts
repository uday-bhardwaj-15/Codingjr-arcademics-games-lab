import { GameManifest } from '@/core/types/match';

export const alienAdditionManifest: GameManifest = {
  id: 'alien-addition',
  title: 'Alien Addition',
  subtitle: 'Alien Math Laser Shooter',
  description: 'Shoot the flying saucers that equal the laser turret target number before time runs out!',
  thumbnail: '/assets/thumbnails/alien-addition.png',
  badge: 'Solo Arcade Shooter',
  category: 'Addition & Math',
  subject: 'addition',
  mode: 'solo',
  gradeLevel: 'Grade 1 - 4',
  minPlayers: 1,
  maxPlayers: 1,
  routes: {
    lobby: '/games/alien-addition',
    play: '/games/alien-addition',
    results: '/games/alien-addition',
  },
  supportedRounds: [60],
  defaultRounds: 60,
};
