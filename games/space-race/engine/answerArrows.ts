import { MultiplicationQuestion, AnswerArrowSet, AnswerArrowItem } from '../types';
import {
  ARROW_SPAWN_X,
  ARROW_HOLD_X,
  ARROW_SCROLL_SPEED,
  ARROW_LIFE_MS,
  LANE_CENTER_Y,
  ARROW_Y_OFFSET,
  IDLE_HINT_MS,
  BLIP_PERIOD_MS,
  BLIP_STAGGER_MS,
  BLIP_URGENT_MS,
  BLIP_URGENT_PERIOD_MS,
  BLIP_SCALE,
} from '../constants';

/**
 * Spawns a new 4-arrow set at ARROW_SPAWN_X (1030px) for the given question.
 */
export function spawnArrowSet(
  question: MultiplicationQuestion,
  spawnTimeSec: number
): AnswerArrowSet {
  const arrows: AnswerArrowItem[] = question.options.map((optVal, laneIdx) => {
    return {
      id: `arrow_${question.id}_lane_${laneIdx}`,
      lane: laneIdx,
      value: optVal,
      isCorrect: laneIdx === question.correctLaneIndex,
      x: ARROW_SPAWN_X,
      y: LANE_CENTER_Y[laneIdx] + ARROW_Y_OFFSET,
      status: 'normal',
      blipScale: 1.0,
      isUrgent: false,
    };
  });

  return {
    id: `arrow_set_${question.id}_${Math.round(spawnTimeSec * 1000)}`,
    question,
    spawnTimeSec,
    arrows,
    isResolved: false,
    holdReachedTimeSec: null,
  };
}

/**
 * Updates arrow positions: scrolls to ARROW_HOLD_X (600px) at ARROW_SCROLL_SPEED (110 px/s), then holds.
 * Calculates idle blip wave starting at IDLE_HINT_MS (2000ms) and checks timeout at ARROW_LIFE_MS (9000ms).
 */
export function updateArrowSet(
  arrowSet: AnswerArrowSet,
  currentRaceTimeSec: number
): { updatedSet: AnswerArrowSet; hasExpired: boolean } {
  if (arrowSet.isResolved) {
    return { updatedSet: arrowSet, hasExpired: false };
  }

  const elapsedSec = Math.max(0, currentRaceTimeSec - arrowSet.spawnTimeSec);
  const elapsedMs = elapsedSec * 1000;

  // 1. Position: scroll left in screen space at ARROW_SCROLL_SPEED until ARROW_HOLD_X (600), then hold
  const scrolledX = ARROW_SPAWN_X - ARROW_SCROLL_SPEED * elapsedSec;
  const currentX = Math.max(ARROW_HOLD_X, scrolledX);
  const isHolding = currentX <= ARROW_HOLD_X;

  const holdTime = isHolding && arrowSet.holdReachedTimeSec === null ? currentRaceTimeSec : arrowSet.holdReachedTimeSec;

  // 2. Timeout check (9.0s since spawn)
  const hasExpired = elapsedMs >= ARROW_LIFE_MS;

  // 3. Idle blip calculation (starts 2.0s after spawn)
  const isIdle = elapsedMs >= IDLE_HINT_MS;
  const remainingMs = Math.max(0, ARROW_LIFE_MS - elapsedMs);
  const isUrgent = remainingMs <= BLIP_URGENT_MS;
  const periodMs = isUrgent ? BLIP_URGENT_PERIOD_MS : BLIP_PERIOD_MS;

  const updatedArrows: AnswerArrowItem[] = arrowSet.arrows.map((arr) => {
    let blipScale = 1.0;

    if (isIdle && !hasExpired && arr.status === 'normal') {
      const laneOffsetMs = arr.lane * BLIP_STAGGER_MS;
      const cycleTimeMs = (elapsedMs - IDLE_HINT_MS + laneOffsetMs) % periodMs;
      // 300ms pulse window
      if (cycleTimeMs < 300) {
        // Sine ease up and down 1.0 -> 1.14 -> 1.0
        const pulseProgress = Math.sin((cycleTimeMs / 300) * Math.PI);
        blipScale = 1.0 + (BLIP_SCALE - 1.0) * pulseProgress;
      }
    }

    return {
      ...arr,
      x: currentX,
      blipScale,
      isUrgent,
      status: hasExpired ? 'expired' : arr.status,
    };
  });

  return {
    updatedSet: {
      ...arrowSet,
      arrows: updatedArrows,
      holdReachedTimeSec: holdTime,
      isResolved: hasExpired ? true : arrowSet.isResolved,
    },
    hasExpired,
  };
}
