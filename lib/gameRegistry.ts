import { GameManifest } from '../core/types/match';
import { jumpingChicksManifest } from '../games/jumping-chicks/manifest';
import { alienAdditionManifest } from '../games/alien-addition/manifest';
import { islandChaseManifest } from '../games/island-chase/manifest';
import { spaceRaceManifest } from '../games/space-race/manifest';

export const gameRegistry: GameManifest[] = [
  jumpingChicksManifest,
  alienAdditionManifest,
  islandChaseManifest,
  spaceRaceManifest,
];

export function getGameManifest(gameId: string): GameManifest | undefined {
  return gameRegistry.find(g => g.id === gameId);
}
