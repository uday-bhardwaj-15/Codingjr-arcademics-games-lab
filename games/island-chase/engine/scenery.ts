import { SceneryFeature, WorldPoint } from '../types';
import { COURSE_LENGTH, pointAt, headingAt } from './course';
import { CHANNEL_HALF_WIDTH } from '../constants';

export interface BuoyFeature {
  id: string;
  s: number;
  worldX: number;
  worldY: number;
  side: 'left' | 'right';
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds static scenery features for the course.
 */
export function generateScenery(): {
  islands: SceneryFeature[];
  buoys: BuoyFeature[];
  shorelineIslets: SceneryFeature[];
} {
  const rng = mulberry32(42893);

  // 1. Two Giant Turn Islands on inside of arcs (Radius R - 250 = 850px)
  const islands: SceneryFeature[] = [
    {
      id: 'island_turn_1',
      type: 'island_turn',
      worldX: 500,
      worldY: 1100,
      radius: 850,
      s: 1363,
    },
    {
      id: 'island_turn_2',
      type: 'island_turn',
      worldX: 2700,
      worldY: 1350,
      radius: 850,
      s: 3450,
    },
  ];

  // 2. Channel Buoys every 350px alternating left and right
  const buoys: BuoyFeature[] = [];
  let buoyIdx = 0;
  for (let s = -350; s <= COURSE_LENGTH + 400; s += 350) {
    const pt = pointAt(s);
    const h = headingAt(s);
    const isLeft = buoyIdx % 2 === 0;
    const lateral = isLeft ? -CHANNEL_HALF_WIDTH : CHANNEL_HALF_WIDTH;

    const bx = pt.x + lateral * (-Math.sin(h));
    const by = pt.y + lateral * Math.cos(h);

    buoys.push({
      id: `buoy_${buoyIdx}`,
      s,
      worldX: bx,
      worldY: by,
      side: isLeft ? 'left' : 'right',
    });
    buoyIdx++;
  }

  // 3. Small Islets & Shoreline strips along straights
  const shorelineIslets: SceneryFeature[] = [];
  const isletDistances = [100, 350, 2300, 2450, 4200, 4600, 4900];
  isletDistances.forEach((s, idx) => {
    const pt = pointAt(s);
    const h = headingAt(s);
    const side = idx % 2 === 0 ? -1 : 1;
    const lateral = side * (CHANNEL_HALF_WIDTH + 140 + rng() * 60);

    const ix = pt.x + lateral * (-Math.sin(h));
    const iy = pt.y + lateral * Math.cos(h);

    shorelineIslets.push({
      id: `islet_${idx}`,
      type: 'islet',
      worldX: ix,
      worldY: iy,
      radius: 45 + rng() * 35,
      s,
    });
  });

  return { islands, buoys, shorelineIslets };
}

export const SCENERY = generateScenery();
