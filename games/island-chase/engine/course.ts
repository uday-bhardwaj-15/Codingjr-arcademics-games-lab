import { WorldPoint, CourseSample, CourseBBox } from '../types';
import { COURSE_SEGMENTS, RUNWAY_BEFORE, RUNWAY_AFTER, CAM_SMOOTH_PX } from '../constants';

export const SAMPLE_STEP = 4; // Sample every 4 px

export interface SegmentInfo {
  type: 'straight' | 'arc';
  length: number;
  startS: number;
  endS: number;
  startX: number;
  startY: number;
  startHeading: number; // radians
  // Arc specific
  dir?: 'left' | 'right';
  radius?: number;
  centerX?: number;
  centerY?: number;
  startAngle?: number;
  endAngle?: number;
}

function buildCourseSegments(): { segments: SegmentInfo[]; totalLength: number } {
  const segments: SegmentInfo[] = [];
  let curS = 0;
  let curX = 0;
  let curY = 0;
  let curHeading = 0; // 0 rad = East

  for (const seg of COURSE_SEGMENTS) {
    if (seg.type === 'straight') {
      const endX = curX + seg.length * Math.cos(curHeading);
      const endY = curY + seg.length * Math.sin(curHeading);
      const segInfo: SegmentInfo = {
        type: 'straight',
        length: seg.length,
        startS: curS,
        endS: curS + seg.length,
        startX: curX,
        startY: curY,
        startHeading: curHeading,
      };
      segments.push(segInfo);
      curS += seg.length;
      curX = endX;
      curY = endY;
    } else if (seg.type === 'arc') {
      const angleRad = (seg.angleDeg * Math.PI) / 180;
      const arcLength = seg.radius * angleRad;
      const isRight = seg.dir === 'right';

      // Center is perpendicular to current heading
      const normalAngle = curHeading + (isRight ? Math.PI / 2 : -Math.PI / 2);
      const centerX = curX + seg.radius * Math.cos(normalAngle);
      const centerY = curY + seg.radius * Math.sin(normalAngle);

      // Angle from center to start point
      const startAngle = Math.atan2(curY - centerY, curX - centerX);
      const endAngle = isRight ? startAngle + angleRad : startAngle - angleRad;
      const endHeading = isRight ? curHeading + angleRad : curHeading - angleRad;

      const endX = centerX + seg.radius * Math.cos(endAngle);
      const endY = centerY + seg.radius * Math.sin(endAngle);

      const segInfo: SegmentInfo = {
        type: 'arc',
        length: arcLength,
        startS: curS,
        endS: curS + arcLength,
        startX: curX,
        startY: curY,
        startHeading: curHeading,
        dir: seg.dir,
        radius: seg.radius,
        centerX,
        centerY,
        startAngle,
        endAngle,
      };
      segments.push(segInfo);
      curS += arcLength;
      curX = endX;
      curY = endY;
      curHeading = endHeading;
    }
  }

  return { segments, totalLength: curS };
}

const { segments: PARSED_SEGMENTS, totalLength: COURSE_LENGTH_VAL } = buildCourseSegments();
export const COURSE_LENGTH = COURSE_LENGTH_VAL;

function computeSample(s: number): CourseSample {
  // 1. Runway before start (s < 0): extend first straight backward
  if (s < 0) {
    const firstSeg = PARSED_SEGMENTS[0];
    const x = firstSeg.startX + s * Math.cos(firstSeg.startHeading);
    const y = firstSeg.startY + s * Math.sin(firstSeg.startHeading);
    return { s, x, y, headingRad: firstSeg.startHeading };
  }

  // 2. Runway after finish (s > COURSE_LENGTH): extend last segment straight forward
  if (s > COURSE_LENGTH) {
    const lastSeg = PARSED_SEGMENTS[PARSED_SEGMENTS.length - 1];
    const extraS = s - COURSE_LENGTH;
    const endX = lastSeg.startX + lastSeg.length * Math.cos(lastSeg.startHeading);
    const endY = lastSeg.startY + lastSeg.length * Math.sin(lastSeg.startHeading);
    const x = endX + extraS * Math.cos(lastSeg.startHeading);
    const y = endY + extraS * Math.sin(lastSeg.startHeading);
    return { s, x, y, headingRad: lastSeg.startHeading };
  }

  // 3. Inside segments
  for (const seg of PARSED_SEGMENTS) {
    if (s >= seg.startS && s <= seg.endS + 0.0001) {
      const segFrac = (s - seg.startS) / seg.length;
      if (seg.type === 'straight') {
        const x = seg.startX + (s - seg.startS) * Math.cos(seg.startHeading);
        const y = seg.startY + (s - seg.startS) * Math.sin(seg.startHeading);
        return { s, x, y, headingRad: seg.startHeading };
      } else if (seg.type === 'arc' && seg.centerX !== undefined && seg.centerY !== undefined && seg.radius !== undefined) {
        const angle = seg.startAngle! + (seg.endAngle! - seg.startAngle!) * segFrac;
        const x = seg.centerX + seg.radius * Math.cos(angle);
        const y = seg.centerY + seg.radius * Math.sin(angle);
        const headingRad = seg.dir === 'right' ? angle + Math.PI / 2 : angle - Math.PI / 2;
        return { s, x, y, headingRad };
      }
    }
  }

  const lastSeg = PARSED_SEGMENTS[PARSED_SEGMENTS.length - 1];
  return { s, x: lastSeg.startX, y: lastSeg.startY, headingRad: lastSeg.startHeading };
}

// Build pre-computed dense sample table
function buildSampleTable(): { samples: CourseSample[]; minS: number; maxS: number; bbox: CourseBBox } {
  const minS = -RUNWAY_BEFORE;
  const maxS = COURSE_LENGTH + RUNWAY_AFTER;
  const samples: CourseSample[] = [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let s = minS; s <= maxS; s += SAMPLE_STEP) {
    const smp = computeSample(s);
    samples.push(smp);
    if (smp.x < minX) minX = smp.x;
    if (smp.y < minY) minY = smp.y;
    if (smp.x > maxX) maxX = smp.x;
    if (smp.y > maxY) maxY = smp.y;
  }

  return {
    samples,
    minS,
    maxS,
    bbox: {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    },
  };
}

const { samples: COURSE_SAMPLES, minS: MIN_S, bbox: COURSE_BBOX } = buildSampleTable();

/**
 * Returns the position {x, y} on the course centerline at distance s.
 */
export function pointAt(s: number): WorldPoint {
  const idxFloat = (s - MIN_S) / SAMPLE_STEP;
  if (idxFloat <= 0) return { x: COURSE_SAMPLES[0].x, y: COURSE_SAMPLES[0].y };
  if (idxFloat >= COURSE_SAMPLES.length - 1) {
    const last = COURSE_SAMPLES[COURSE_SAMPLES.length - 1];
    return { x: last.x, y: last.y };
  }
  const i = Math.floor(idxFloat);
  const frac = idxFloat - i;
  const p0 = COURSE_SAMPLES[i];
  const p1 = COURSE_SAMPLES[i + 1];
  return {
    x: p0.x + (p1.x - p0.x) * frac,
    y: p0.y + (p1.y - p0.y) * frac,
  };
}

/**
 * Returns the heading angle θ (radians clockwise from East) at distance s.
 */
export function headingAt(s: number): number {
  const idxFloat = (s - MIN_S) / SAMPLE_STEP;
  if (idxFloat <= 0) return COURSE_SAMPLES[0].headingRad;
  if (idxFloat >= COURSE_SAMPLES.length - 1) return COURSE_SAMPLES[COURSE_SAMPLES.length - 1].headingRad;
  const i = Math.floor(idxFloat);
  const frac = idxFloat - i;
  return COURSE_SAMPLES[i].headingRad + (COURSE_SAMPLES[i + 1].headingRad - COURSE_SAMPLES[i].headingRad) * frac;
}

/**
 * Returns the smooth heading angle θcam at distance s (averaged over ±CAM_SMOOTH_PX).
 */
export function smoothHeadingAt(s: number): number {
  const windowRadius = CAM_SMOOTH_PX;
  const steps = 10;
  let sumSin = 0;
  let sumCos = 0;

  for (let i = -steps; i <= steps; i++) {
    const sampleS = s + (i / steps) * windowRadius;
    const h = headingAt(sampleS);
    sumSin += Math.sin(h);
    sumCos += Math.cos(h);
  }

  return Math.atan2(sumSin, sumCos);
}

export function getCourseBBox(): CourseBBox {
  return COURSE_BBOX;
}

export function getCourseSamples(): CourseSample[] {
  return COURSE_SAMPLES;
}

export function getSegments(): SegmentInfo[] {
  return PARSED_SEGMENTS;
}
