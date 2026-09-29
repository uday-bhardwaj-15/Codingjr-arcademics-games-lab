import { RacerState, CompetitionResultItem } from '../types';
import { MAX_STEPS, WORLD_SPEED, LAUNCH_PX, STEP_PX } from '../constants';
import { COURSE_LENGTH } from './course';

/**
 * Pure reducer for a correct answer event.
 * Each correct answer advances the boat by +1 step (20px lead offset).
 * If a boat is N steps behind, answering N questions correctly matches the leader.
 */
export function applyCorrect(
  racers: RacerState[],
  racerId: string,
  timestamp: number
): RacerState[] {
  return racers.map((racer) => {
    if (racer.id !== racerId) return racer;

    const newPos = Math.min(MAX_STEPS, racer.pos + 1);
    const hasChanged = newPos !== racer.pos;

    return {
      ...racer,
      pos: newPos,
      reachedAt: hasChanged ? timestamp : racer.reachedAt,
      correctCount: racer.correctCount + 1,
      isLocked: false,
      streak: racer.streak + 1,
    };
  });
}

/**
 * Pure reducer for a wrong answer event.
 * No position change. 1000ms wrong lock + 400ms wobble.
 */
export function applyWrong(
  racers: RacerState[],
  racerId: string,
  timestamp: number
): RacerState[] {
  return racers.map((racer) => {
    if (racer.id !== racerId) return racer;

    return {
      ...racer,
      wrongCount: racer.wrongCount + 1,
      isLocked: true,
      wobbleUntil: timestamp + 400,
      streak: 0,
    };
  });
}

/**
 * Unlocks a racer after the wrong answer lock expires.
 */
export function unlockRacer(
  racers: RacerState[],
  racerId: string
): RacerState[] {
  return racers.map((racer) => {
    if (racer.id !== racerId) return racer;
    return {
      ...racer,
      isLocked: false,
    };
  });
}

/**
 * Computes finish times and places with standard competition ranking (1st, 1st, 1st, 4th).
 * Finish times are compared rounded to 0.01 s.
 * Boats that have not crossed use projected time: (COURSE_LENGTH - LAUNCH_PX - STEP_PX * pos) / WORLD_SPEED
 */
export function getCompetitionPlaces(
  racers: RacerState[]
): CompetitionResultItem[] {
  // 1. Compute exact/projected finish time for each boat
  const computedList = racers.map((r) => {
    let finishTimeSec: number;
    if (r.crossedAt !== null) {
      finishTimeSec = r.crossedAt;
    } else {
      // Projected time
      finishTimeSec = Math.max(0, (COURSE_LENGTH - LAUNCH_PX - STEP_PX * r.pos) / WORLD_SPEED);
    }
    // Round to 2 decimals for ranking comparison
    const roundedTime = Math.round(finishTimeSec * 100) / 100;
    return {
      racer: r,
      finishTimeSec,
      roundedTime,
      finishTimeFormatted: `${finishTimeSec.toFixed(2)} sec`,
    };
  });

  // 2. Sort ascending by finish time, with ties preserving lane order (human first among equals)
  computedList.sort((a, b) => {
    if (a.roundedTime !== b.roundedTime) {
      return a.roundedTime - b.roundedTime;
    }
    return a.racer.lane - b.racer.lane;
  });

  // 3. Assign competition ranks (e.g., 1st, 1st, 1st, 4th)
  const results: CompetitionResultItem[] = [];
  let currentRank = 1;

  for (let i = 0; i < computedList.length; i++) {
    if (i > 0 && computedList[i].roundedTime > computedList[i - 1].roundedTime) {
      currentRank = i + 1;
    }

    const placeSuffix =
      currentRank === 1 ? '1st' : currentRank === 2 ? '2nd' : currentRank === 3 ? '3rd' : `${currentRank}th`;

    results.push({
      id: computedList[i].racer.id,
      name: computedList[i].racer.name,
      color: computedList[i].racer.color,
      isBot: computedList[i].racer.isBot,
      lane: computedList[i].racer.lane,
      finishTimeSec: computedList[i].finishTimeSec,
      finishTimeFormatted: computedList[i].finishTimeFormatted,
      rank: currentRank,
      placeText: placeSuffix,
      correctCount: computedList[i].racer.correctCount,
      wrongCount: computedList[i].racer.wrongCount,
    });
  }

  return results;
}

/**
 * Pure sorting for simple rankings
 */
export function getRankings(racers: RacerState[]): RacerState[] {
  return [...racers].sort((a, b) => {
    if (a.crossedAt !== null && b.crossedAt !== null) {
      if (a.crossedAt !== b.crossedAt) {
        return a.crossedAt - b.crossedAt;
      }
    } else if (a.crossedAt !== null) {
      return -1;
    } else if (b.crossedAt !== null) {
      return 1;
    }

    if (b.s !== a.s) return b.s - a.s;
    if (b.pos !== a.pos) return b.pos - a.pos;
    if (a.reachedAt !== b.reachedAt) return a.reachedAt - b.reachedAt;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return a.lane - b.lane;
  });
}

