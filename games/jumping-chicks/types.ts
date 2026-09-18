export interface PlatformOption {
  id: string;
  count: number;
  isCorrect: boolean;
}

export interface RoundState {
  targetNumber: number;
  options: PlatformOption[];
}

export type PlayerActionStatus = 'idle' | 'jumping' | 'falling' | 'respawning' | 'finished' | 'celebrate';

export interface PlayerRunState {
  playerId: string;
  name: string;
  isBot: boolean;
  color: 'blue' | 'yellow' | 'red' | 'orange';
  currentRound: RoundState;
  correctCount: number;
  wrongCount: number;
  status: PlayerActionStatus;
  currentPlatformIndex: number | null; // null = base leaf, 0..3 = on pond leaf cluster
  targetPlatformIndex?: number;
  finishedAtMs?: number;
  rank?: number;
}

export interface JumpingChicksConfig {
  roundsToWin: number;
  numberRange: [number, number];
  botDifficulty: 'easy' | 'normal' | 'hard';
}
