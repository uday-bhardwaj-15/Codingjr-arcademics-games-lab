import { ShipState, CompetitionResultItem } from '../types';
import { WORLD_SPEED, S_FINISH, CATCH_UP } from '../constants';

/**
 * Pure reducer for a correct answer event (v1.2: CATCH_UP is false by default).
 * If catchUpEnabled is true and player is behind the leader:
 *   player.pos = leaderPos (matches leader, does not pass)
 * Else:
 *   player.pos = player.pos + 1 (no upper step cap)
 */
export function applyCorrect(
  ships: ShipState[],
  shipId: string,
  timestamp: number,
  catchUpEnabled: boolean = CATCH_UP
): ShipState[] {
  const leaderPos = Math.max(...ships.map((s) => s.pos));

  return ships.map((ship) => {
    if (ship.id !== shipId) return ship;

    let newPos: number;
    if (catchUpEnabled && ship.pos < leaderPos) {
      newPos = leaderPos;
    } else {
      newPos = ship.pos + 1;
    }

    const hasChanged = newPos !== ship.pos;

    return {
      ...ship,
      pos: newPos,
      reachedAt: hasChanged ? timestamp : ship.reachedAt,
      correctCount: ship.correctCount + 1,
      isLocked: false,
      streak: ship.streak + 1,
    };
  });
}

/**
 * Pure reducer for a wrong answer event.
 * No position change. 1000ms wrong lock + 400ms shake.
 */
export function applyWrong(
  ships: ShipState[],
  shipId: string,
  timestamp: number
): ShipState[] {
  return ships.map((ship) => {
    if (ship.id !== shipId) return ship;

    return {
      ...ship,
      wrongCount: ship.wrongCount + 1,
      isLocked: true,
      shakeUntil: timestamp + 400,
      streak: 0,
    };
  });
}

/**
 * Pure reducer for a timeout (arrow set expires).
 * No position change, no lock, increments timeoutCount.
 */
export function applyTimeout(
  ships: ShipState[],
  shipId: string
): ShipState[] {
  return ships.map((ship) => {
    if (ship.id !== shipId) return ship;

    return {
      ...ship,
      timeoutCount: ship.timeoutCount + 1,
      streak: 0,
    };
  });
}

/**
 * Unlocks a ship after the wrong answer lock expires.
 */
export function unlockShip(
  ships: ShipState[],
  shipId: string
): ShipState[] {
  return ships.map((ship) => {
    if (ship.id !== shipId) return ship;
    return {
      ...ship,
      isLocked: false,
    };
  });
}

/**
 * Computes finish times and places with standard competition ranking (1st, 1st, 1st, 4th).
 * Finish times are compared rounded to 0.01 s.
 * Ships that have not crossed use projected time: (S_FINISH - s_i) / WORLD_SPEED + currentTimeSec
 */
export function getCompetitionPlaces(
  ships: ShipState[],
  currentTimeSec: number = 0
): CompetitionResultItem[] {
  // 1. Compute exact/projected finish time for each ship
  const computedList = ships.map((s) => {
    let finishTimeSec: number;
    if (s.crossedAt !== null) {
      finishTimeSec = s.crossedAt;
    } else {
      const remainingDist = Math.max(0, S_FINISH - s.s);
      finishTimeSec = currentTimeSec + remainingDist / WORLD_SPEED;
    }
    const roundedTime = Math.round(finishTimeSec * 100) / 100;
    return {
      ship: s,
      finishTimeSec,
      roundedTime,
      finishTimeFormatted: `${finishTimeSec.toFixed(2)} sec`,
    };
  });

  // 2. Sort ascending by finish time; ties preserve lane order (human first among equals)
  computedList.sort((a, b) => {
    if (a.roundedTime !== b.roundedTime) {
      return a.roundedTime - b.roundedTime;
    }
    return a.ship.lane - b.ship.lane;
  });

  // 3. Assign competition ranks (with shared ties: 1, 1, 1, 4)
  const results: CompetitionResultItem[] = [];
  let currentRank = 1;

  for (let i = 0; i < computedList.length; i++) {
    if (i > 0 && computedList[i].roundedTime > computedList[i - 1].roundedTime) {
      currentRank = i + 1;
    }

    const placeSuffix =
      currentRank === 1 ? '1st' : currentRank === 2 ? '2nd' : currentRank === 3 ? '3rd' : `${currentRank}th`;

    results.push({
      id: computedList[i].ship.id,
      name: computedList[i].ship.name,
      color: computedList[i].ship.color,
      isBot: computedList[i].ship.isBot,
      lane: computedList[i].ship.lane,
      finishTimeSec: computedList[i].finishTimeSec,
      finishTimeFormatted: computedList[i].finishTimeFormatted,
      rank: currentRank,
      placeText: placeSuffix,
      correctCount: computedList[i].ship.correctCount,
      wrongCount: computedList[i].ship.wrongCount + computedList[i].ship.timeoutCount,
    });
  }

  return results;
}
