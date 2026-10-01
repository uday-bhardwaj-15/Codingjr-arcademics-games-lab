import { COURSE_LENGTH } from '../constants';
import { SplinePoint } from '../types';

// Fixed spline control points through space
// Start at Launch Tower (200, 280), sweeping through space past planets & asteroids
const CONTROL_POINTS: Array<{ x: number; y: number }> = [
  { x: 100, y: 280 },
  { x: 200, y: 280 }, // Start / Launch Tower
  { x: 500, y: 280 },
  { x: 900, y: 200 }, // Sweep up past ringed planet
  { x: 1300, y: 140 },
  { x: 1700, y: 260 }, // S-curve through asteroid field
  { x: 2100, y: 380 },
  { x: 2500, y: 340 }, // Gentle dip
  { x: 2850, y: 280 },
  { x: 3200, y: 280 }, // Finish Ring Gate (s=3000)
  { x: 3400, y: 280 },
];

// Catmull-Rom spline interpolation
function catmullRom(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const t2 = t * t;
  const t3 = t2 * t;

  const f0 = -0.5 * t3 + t2 - 0.5 * t;
  const f1 = 1.5 * t3 - 2.5 * t2 + 1.0;
  const f2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
  const f3 = 0.5 * t3 - 0.5 * t2;

  return {
    x: p0.x * f0 + p1.x * f1 + p2.x * f2 + p3.x * f3,
    y: p0.y * f0 + p1.y * f1 + p2.y * f2 + p3.y * f3,
  };
}

// Pre-sample spline into deterministic lookup table
const SAMPLES = 600;
const SPLINE_TABLE: SplinePoint[] = [];

function initSplineTable() {
  const rawPoints: Array<{ x: number; y: number }> = [];
  const numSegments = CONTROL_POINTS.length - 3;

  for (let seg = 0; seg < numSegments; seg++) {
    const p0 = CONTROL_POINTS[seg];
    const p1 = CONTROL_POINTS[seg + 1];
    const p2 = CONTROL_POINTS[seg + 2];
    const p3 = CONTROL_POINTS[seg + 3];

    const segSamples = Math.floor(SAMPLES / numSegments);
    for (let i = 0; i < segSamples; i++) {
      const t = i / segSamples;
      rawPoints.push(catmullRom(p0, p1, p2, p3, t));
    }
  }

  // Calculate cumulative arc length
  let totalLength = 0;
  const withDist: Array<{ x: number; y: number; s: number }> = [{ x: rawPoints[0].x, y: rawPoints[0].y, s: 0 }];

  for (let i = 1; i < rawPoints.length; i++) {
    const dx = rawPoints[i].x - rawPoints[i - 1].x;
    const dy = rawPoints[i].y - rawPoints[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
    withDist.push({ x: rawPoints[i].x, y: rawPoints[i].y, s: totalLength });
  }

  // Resample evenly by arc length s from 0 to COURSE_LENGTH
  for (let i = 0; i <= SAMPLES; i++) {
    const targetS = (i / SAMPLES) * COURSE_LENGTH;
    const scaledTarget = (targetS / COURSE_LENGTH) * totalLength;

    // Find segment in withDist
    let low = 0;
    let high = withDist.length - 1;
    while (low < high - 1) {
      const mid = Math.floor((low + high) / 2);
      if (withDist[mid].s <= scaledTarget) low = mid;
      else high = mid;
    }

    const pA = withDist[low];
    const pB = withDist[high];
    const segLen = pB.s - pA.s;
    const t = segLen > 0 ? (scaledTarget - pA.s) / segLen : 0;

    const x = pA.x + (pB.x - pA.x) * t;
    const y = pA.y + (pB.y - pA.y) * t;

    // Tangent angle
    const dx = pB.x - pA.x;
    const dy = pB.y - pA.y;
    const angle = Math.atan2(dy, dx);

    // Normal vector (perpendicular to tangent)
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);

    SPLINE_TABLE.push({
      x,
      y,
      s: targetS,
      angle,
      nx,
      ny,
    });
  }
}

initSplineTable();

/**
 * Get interpolated position, tangent angle and normal along the course at distance s
 */
export function getCoursePointAt(s: number): SplinePoint {
  const clampedS = Math.max(0, Math.min(COURSE_LENGTH, s));
  const exactIndex = (clampedS / COURSE_LENGTH) * (SPLINE_TABLE.length - 1);
  const lowIdx = Math.floor(exactIndex);
  const highIdx = Math.min(SPLINE_TABLE.length - 1, lowIdx + 1);
  const t = exactIndex - lowIdx;

  const pA = SPLINE_TABLE[lowIdx];
  const pB = SPLINE_TABLE[highIdx];

  const x = pA.x + (pB.x - pA.x) * t;
  const y = pA.y + (pB.y - pA.y) * t;

  // Shortest angle interpolation
  let angleDiff = pB.angle - pA.angle;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
  const angle = pA.angle + angleDiff * t;

  const nx = -Math.sin(angle);
  const ny = Math.cos(angle);

  return {
    x,
    y,
    s: clampedS,
    angle,
    nx,
    ny,
  };
}

export function getAllCoursePoints(): SplinePoint[] {
  return SPLINE_TABLE;
}
