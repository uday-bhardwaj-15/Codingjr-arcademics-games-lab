import { Z_NEAR, Z_FAR, BIOME_LENGTH } from './worldMath';

// Seeded PRNG (Mulberry32) - Hydration Safe, deterministic
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type BiomeType = 'meadow' | 'autumn' | 'seaside';

export interface BiomeColors {
  name: BiomeType;
  groundTop: string;
  groundBottom: string;
  mountainBack: string;
  mountainFront: string;
}

export const BIOMES: Record<BiomeType, BiomeColors> = {
  meadow: {
    name: 'meadow',
    groundTop: '#6CC24A',
    groundBottom: '#3FA33A',
    mountainBack: '#6C9BD8',
    mountainFront: '#8BB4E6',
  },
  autumn: {
    name: 'autumn',
    groundTop: '#C8A24A',
    groundBottom: '#A8742A',
    mountainBack: '#9C7A58',
    mountainFront: '#87603B',
  },
  seaside: {
    name: 'seaside',
    groundTop: '#F2DFA0',
    groundBottom: '#DFBC68',
    mountainBack: '#5DA8B8',
    mountainFront: '#458D9C',
  },
};

export type SceneryObjectType =
  // Meadow
  | 'tree_round'
  | 'tree_tall'
  | 'bush_green'
  | 'flower_patch'
  | 'grey_rock'
  | 'wooden_fence'
  // Autumn
  | 'tree_autumn_orange'
  | 'tree_autumn_red'
  | 'tree_autumn_yellow'
  | 'haystack'
  | 'pumpkin_patch'
  | 'autumn_bush'
  // Seaside
  | 'palm_tree'
  | 'beach_umbrella'
  | 'beach_rock'
  | 'small_boat'
  | 'lighthouse'
  | 'seashell_patch';

export interface SceneryItem {
  id: number;
  type: SceneryObjectType;
  side: -1 | 1;
  offset: number; // pixel offset from road edge (>= 60)
  baseScale: number; // Scale factor matching target heights
  z: number;
  biome: BiomeType;
}

const BIOME_OBJECTS: Record<BiomeType, SceneryObjectType[]> = {
  meadow: ['tree_round', 'tree_tall', 'bush_green', 'flower_patch', 'grey_rock', 'wooden_fence'],
  autumn: ['tree_autumn_orange', 'tree_autumn_red', 'tree_autumn_yellow', 'haystack', 'pumpkin_patch', 'autumn_bush'],
  seaside: ['palm_tree', 'beach_umbrella', 'beach_rock', 'small_boat', 'lighthouse', 'seashell_patch'],
};

// Significantly bigger base scales for tall lush side vegetation
export function getBaseScaleForType(type: SceneryObjectType, prng: () => number): number {
  const variation = 0.92 + prng() * 0.18; // +/- 9%
  switch (type) {
    case 'tree_tall':
    case 'lighthouse':
      return 2.1 * variation; // Very tall pine & lighthouse
    case 'tree_round':
    case 'tree_autumn_orange':
    case 'tree_autumn_red':
    case 'tree_autumn_yellow':
    case 'palm_tree':
      return 1.95 * variation; // Big lush canopy trees
    case 'bush_green':
    case 'autumn_bush':
    case 'beach_umbrella':
      return 1.45 * variation; // Full leafy bushes
    case 'wooden_fence':
      return 1.35 * variation; // Solid continuous fence run
    case 'grey_rock':
    case 'beach_rock':
    case 'haystack':
      return 1.15 * variation;
    case 'flower_patch':
    case 'pumpkin_patch':
    case 'seashell_patch':
      return 0.95 * variation;
    default:
      return 1.4 * variation;
  }
}

export function getBiomeForDistance(distance: number): {
  current: BiomeType;
  next: BiomeType;
  blend: number;
} {
  const biomeSequence: BiomeType[] = ['meadow', 'autumn', 'seaside'];
  const totalLength = BIOME_LENGTH * biomeSequence.length;
  const normalizedDist = ((distance % totalLength) + totalLength) % totalLength;

  const biomeIndex = Math.floor(normalizedDist / BIOME_LENGTH);
  const biomeProgress = normalizedDist % BIOME_LENGTH;

  const current = biomeSequence[biomeIndex] ?? 'meadow';
  const next = biomeSequence[(biomeIndex + 1) % biomeSequence.length] ?? 'meadow';

  const fadeStart = BIOME_LENGTH - 72;
  const blend = biomeProgress > fadeStart ? (biomeProgress - fadeStart) / 72 : 0;

  return { current, next, blend };
}

/**
 * Initialize 60 pooled scenery items with dense, tall roadside vegetation
 */
export function initSceneryPool(seed = 1337): SceneryItem[] {
  const prng = mulberry32(seed);
  const pool: SceneryItem[] = [];
  const totalItems = 60;

  for (let i = 0; i < totalItems; i++) {
    const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
    const z = Z_NEAR + 0.8 + ((Z_FAR - Z_NEAR) * (i + prng() * 0.4)) / totalItems;
    const biome: BiomeType = 'meadow';
    const objList = BIOME_OBJECTS[biome];
    const type = objList[Math.floor(prng() * objList.length)] ?? 'tree_round';
    const offset = 65 + prng() * 160;
    const baseScale = getBaseScaleForType(type, prng);

    pool.push({
      id: i,
      type,
      side,
      offset,
      baseScale,
      z,
      biome,
    });
  }

  return pool;
}

/**
 * Respawn a single scenery item when it passes the camera (z < 0.55)
 */
export function respawnSceneryItem(
  item: SceneryItem,
  totalDistance: number,
  prng: () => number
): void {
  const { current, next, blend } = getBiomeForDistance(totalDistance);
  const chosenBiome = prng() < blend ? next : current;
  const objList = BIOME_OBJECTS[chosenBiome];

  item.biome = chosenBiome;
  item.type = objList[Math.floor(prng() * objList.length)] ?? 'tree_round';
  item.side = prng() < 0.5 ? -1 : 1;
  item.offset = 65 + prng() * 160;
  item.baseScale = getBaseScaleForType(item.type, prng);
  item.z = Z_FAR + prng() * 2.0;
}
