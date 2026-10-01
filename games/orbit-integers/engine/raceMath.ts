import { STEP_PX, COURSE_LENGTH, DRIFT_PX_PER_S } from '../constants';
import { PodState, GameSpeed } from '../types';

/**
 * Calculate the step gap between a computer pod and the human pod
 * Positive: bot is ahead (+2 steps)
 * Negative: bot is behind (-1 step)
 */
export function calculateStepGap(botS: number, humanS: number): number {
  return Math.round((botS - humanS) / STEP_PX);
}

/**
 * Calculate projected finish time for a pod that hasn't crossed the finish line yet
 */
export function calculateProjectedFinishTime(
  pod: PodState,
  currentTimeMs: number,
  speed: GameSpeed = 'normal'
): number {
  if (pod.finishedAtMs) return pod.finishedAtMs;

  const remainingPx = Math.max(0, COURSE_LENGTH - pod.logicalS);
  const drift = DRIFT_PX_PER_S[speed];
  const elapsedSec = Math.max(1, currentTimeMs / 1000);
  const correctRatePerSec = Math.max(0.1, pod.correctCount / elapsedSec);
  const effectiveSpeedPxPerSec = drift + STEP_PX * correctRatePerSec;

  const remainingMs = (remainingPx / effectiveSpeedPxPerSec) * 1000;
  return currentTimeMs + remainingMs;
}

/**
 * Rank pods by fastest finish time (or lowest projected finish time), ties broken by fewer wrong answers
 */
export function rankPods(pods: PodState[]): PodState[] {
  const sorted = [...pods].sort((a, b) => {
    const timeA = a.finishedAtMs ?? a.projectedFinishTimeMs ?? 999999;
    const timeB = b.finishedAtMs ?? b.projectedFinishTimeMs ?? 999999;

    if (Math.abs(timeA - timeB) > 10) {
      return timeA - timeB;
    }
    return a.wrongCount - b.wrongCount;
  });

  return sorted.map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));
}
