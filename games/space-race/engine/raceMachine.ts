import { RacePhase } from '../types';

export type RaceMachineAction =
  | { type: 'COUNTDOWN_TICK'; value: string | number }
  | { type: 'RACE_START'; timestamp: number }
  | { type: 'FIRST_CROSSING'; crossingTimeSec: number }
  | { type: 'FINISH_ALL_CROSSED' }
  | { type: 'WATCHDOG_TRIGGERED' }
  | { type: 'RESTART_RACE' };

export interface RaceMachineState {
  phase: RacePhase;
  firstCrossingSec: number | null;
  raceStartTimestamp: number;
}

export const initialRaceMachineState: RaceMachineState = {
  phase: 'countdown',
  firstCrossingSec: null,
  raceStartTimestamp: 0,
};

/**
 * Pure reducer for race phase transitions.
 */
export function raceMachineReducer(
  state: RaceMachineState,
  action: RaceMachineAction
): RaceMachineState {
  switch (action.type) {
    case 'RACE_START':
      if (state.phase !== 'countdown') return state;
      return {
        ...state,
        phase: 'racing',
        raceStartTimestamp: action.timestamp,
        firstCrossingSec: null,
      };

    case 'FIRST_CROSSING':
      if (state.phase !== 'racing') return state;
      return {
        ...state,
        phase: 'finishing',
        firstCrossingSec: action.crossingTimeSec,
      };

    case 'FINISH_ALL_CROSSED':
    case 'WATCHDOG_TRIGGERED':
      if (state.phase !== 'finishing') return state;
      return {
        ...state,
        phase: 'results',
      };

    case 'RESTART_RACE':
      return {
        ...initialRaceMachineState,
      };

    default:
      return state;
  }
}
