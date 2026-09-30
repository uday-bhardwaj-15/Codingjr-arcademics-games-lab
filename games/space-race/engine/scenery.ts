import {
  StarItem,
  AsteroidItem,
  PlanetItem,
  MoonCraterItem,
  MoonRockItem,
  MoonCrystalItem,
} from '../types';
import { MOON_R, S_FINISH } from '../constants';
import { calculateSurfacePhi } from './laps';

/**
 * Seeded Mulberry32 pseudo-random number generator
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(987654321);

// 1. Polar Orbit Starfield Layers (Angles in rad from -0.8 to 4.2)
export const ORBIT_FAR_STARS: { angle0: number; radius: number; size: number; opacity: number }[] =
  Array.from({ length: 80 }, () => ({
    angle0: -0.8 + rng() * 5.0,
    radius: MOON_R + 80 + rng() * 500,
    size: 1 + rng() * 1.5,
    opacity: 0.35 + rng() * 0.45,
  }));

export const ORBIT_NEAR_STARS: { angle0: number; radius: number; size: number; opacity: number }[] =
  Array.from({ length: 50 }, () => ({
    angle0: -0.8 + rng() * 5.0,
    radius: MOON_R + 60 + rng() * 550,
    size: 2 + rng() * 2,
    opacity: 0.6 + rng() * 0.4,
  }));

// 2. Drifting Space Asteroids (Polar around moon center C)
export const ORBIT_ASTEROIDS: AsteroidItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `ast_${i}`,
  radius: MOON_R + 70 + rng() * 450,
  angle0: -0.5 + i * 0.16 + (rng() * 0.08 - 0.04),
  size: 14 + rng() * 22,
  rotationSpeed: (rng() - 0.5) * 40,
  color: rng() > 0.5 ? '#4b5563' : '#374151',
}));

// 3. Giant Planet / Red-Orange Space Rock Fragments
export const ORBIT_PLANETS: PlanetItem[] = [
  { id: 'planet_1', radius: MOON_R + 320, angle0: 0.8, size: 90, color: '#f97316' },
  { id: 'planet_2', radius: MOON_R + 250, angle0: 1.8, size: 130, color: '#ef4444' },
  { id: 'planet_3', radius: MOON_R + 380, angle0: 2.7, size: 105, color: '#ec4899' },
];

// 4. Moon Surface Craters (phi0 from -0.5 to (S_FINISH+700)/MOON_R + 0.5 ≈ 3.97)
export const MOON_CRATERS: MoonCraterItem[] = [];
for (let phi = -0.5; phi <= 4.0; phi += 0.09) {
  if (rng() > 0.3) {
    const rx = 35 + rng() * 55;
    MOON_CRATERS.push({
      id: `crater_${phi.toFixed(2)}`,
      phi0: phi + (rng() * 0.04 - 0.02),
      rx,
      ry: rx * 0.24,
    });
  }
}

// 5. Moon Surface Small Rocks
export const MOON_ROCKS: MoonRockItem[] = [];
for (let phi = -0.5; phi <= 4.0; phi += 0.05) {
  if (rng() > 0.4) {
    MOON_ROCKS.push({
      id: `rock_${phi.toFixed(2)}`,
      phi0: phi + (rng() * 0.03 - 0.015),
      size: 4 + rng() * 10,
      color: rng() > 0.5 ? '#557e82' : '#3a6164',
    });
  }
}

// 6. Purple Crystal Clusters at Gate Bases
export const MOON_CRYSTALS: MoonCrystalItem[] = [
  { id: 'cryst_start', phi0: calculateSurfacePhi(350), color: '#8b6fc0' },
  { id: 'cryst_lap2', phi0: calculateSurfacePhi(1850), color: '#8b6fc0' },
  { id: 'cryst_lap3', phi0: calculateSurfacePhi(3350), color: '#8b6fc0' },
  { id: 'cryst_finish', phi0: calculateSurfacePhi(4850), color: '#8b6fc0' },
];

// 7. Spectator Crowd Palette for Grandstands
export const CROWD_COLORS = [
  '#f59e0b', '#3b82f6', '#10b981', '#ef4444',
  '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16',
  '#f97316', '#eab308', '#6366f1', '#14b8a6',
];
