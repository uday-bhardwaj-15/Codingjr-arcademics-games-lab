import { create } from 'zustand';
import { PlayerProfile, PlayerColor } from '../types/player';
import { MatchResult, PlayerMatchScore } from '../types/match';
import { ArcadeStorage } from './storage';
import { generateBotName } from '../utils/random';

export type MatchStatus = 'idle' | 'lobby' | 'countdown' | 'in-progress' | 'completed';

interface MatchStoreState {
  gameId: string;
  gameTitle: string;
  matchId: string;
  status: MatchStatus;
  targetRounds: number;
  players: PlayerProfile[];
  humanPlayer: PlayerProfile;
  countdownValue: number;
  startTimeMs: number;
  lastMatchResult: MatchResult | null;

  // Actions
  initLobby: (gameId: string, gameTitle: string, defaultRounds?: number) => void;
  updateHumanProfile: (updates: Partial<PlayerProfile>) => void;
  setTargetRounds: (rounds: number) => void;
  updateBotDifficulty: (level: 'easy' | 'normal' | 'hard') => void;
  startCountdown: (onComplete: () => void) => void;
  startMatch: () => void;
  recordFinishedMatch: (scores: PlayerMatchScore[]) => MatchResult;
  resetMatch: () => void;
}

// Bot configs slowed down for Grade 3 kids
const DEFAULT_BOT_CONFIGS: Record<'easy' | 'normal' | 'hard', { reaction: [number, number]; accuracy: number }> = {
  easy: { reaction: [3800, 7000], accuracy: 0.65 },
  normal: { reaction: [2800, 5200], accuracy: 0.78 },
  hard: { reaction: [2000, 3800], accuracy: 0.88 }
};

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  gameId: 'jumping-chicks',
  gameTitle: 'Jumping Chicks',
  matchId: '',
  status: 'idle',
  targetRounds: 10,
  players: [
    { id: 'player_human', name: 'Player852', color: 'blue', isBot: false },
    { id: 'bot_1', name: 'ChickChamp', color: 'yellow', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
    { id: 'bot_2', name: 'FeatherFast', color: 'red', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
    { id: 'bot_3', name: 'PeckMaster', color: 'orange', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
  ],
  humanPlayer: {
    id: 'player_human',
    name: 'Player852',
    color: 'blue',
    isBot: false,
  },
  countdownValue: 3,
  startTimeMs: 0,
  lastMatchResult: null,

  initLobby: (gameId: string, gameTitle: string, defaultRounds = 10) => {
    const savedHuman = ArcadeStorage.getPlayerProfile();
    const colors: PlayerColor[] = ['blue', 'yellow', 'red', 'orange'];
    const humanColor = savedHuman.color || 'blue';
    const remainingColors = colors.filter(c => c !== humanColor);

    const usedNames = new Set<string>([savedHuman.name || 'Player852']);
    const bot1Name = generateBotName(0, usedNames);
    const bot2Name = generateBotName(1, usedNames);
    const bot3Name = generateBotName(2, usedNames);

    const botConfig = DEFAULT_BOT_CONFIGS.normal;

    const roster: PlayerProfile[] = [
      { ...savedHuman, name: savedHuman.name || 'Player852', isBot: false },
      {
        id: 'bot_1',
        name: bot1Name,
        color: remainingColors[0],
        isBot: true,
        botConfig: { reactionMsRange: botConfig.reaction, accuracy: botConfig.accuracy }
      },
      {
        id: 'bot_2',
        name: bot2Name,
        color: remainingColors[1],
        isBot: true,
        botConfig: { reactionMsRange: botConfig.reaction, accuracy: botConfig.accuracy }
      },
      {
        id: 'bot_3',
        name: bot3Name,
        color: remainingColors[2],
        isBot: true,
        botConfig: { reactionMsRange: botConfig.reaction, accuracy: botConfig.accuracy }
      }
    ];

    // matchId must only be generated client-side to avoid SSR/client hydration mismatch
    const matchId =
      typeof window !== 'undefined'
        ? `match_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        : 'match_ssr_placeholder';

    set({
      gameId,
      gameTitle,
      matchId,
      status: 'lobby',
      targetRounds: defaultRounds,
      humanPlayer: savedHuman,
      players: roster,
      countdownValue: 3,
      startTimeMs: 0
    });
  },

  updateHumanProfile: (updates: Partial<PlayerProfile>) => {
    const current = get().humanPlayer;
    const updated = { ...current, ...updates };
    ArcadeStorage.savePlayerProfile(updated);

    const colors: PlayerColor[] = ['blue', 'yellow', 'red', 'orange'];
    const remainingColors = colors.filter(c => c !== updated.color);

    const newPlayers = get().players.map((p, idx) => {
      if (!p.isBot) return updated;
      return {
        ...p,
        color: remainingColors[idx - 1] || 'orange'
      };
    });

    set({ humanPlayer: updated, players: newPlayers });
  },

  setTargetRounds: (rounds: number) => {
    set({ targetRounds: rounds });
  },

  updateBotDifficulty: (level: 'easy' | 'normal' | 'hard') => {
    const conf = DEFAULT_BOT_CONFIGS[level];
    const updatedPlayers = get().players.map(p => {
      if (p.isBot) {
        return {
          ...p,
          botConfig: {
            reactionMsRange: conf.reaction,
            accuracy: conf.accuracy
          }
        };
      }
      return p;
    });
    set({ players: updatedPlayers });
  },

  startCountdown: (onComplete: () => void) => {
    set({ status: 'countdown', countdownValue: 3 });

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        set({ countdownValue: count });
      } else if (count === 0) {
        set({ countdownValue: 0 });
      } else {
        clearInterval(interval);
        get().startMatch();
        onComplete();
      }
    }, 850);
  },

  startMatch: () => {
    set({
      status: 'in-progress',
      startTimeMs: Date.now()
    });
  },

  recordFinishedMatch: (scores: PlayerMatchScore[]): MatchResult => {
    const state = get();
    const sortedScores = [...scores].sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.finishTimeMs - b.finishTimeMs;
    });

    const matchResult: MatchResult = {
      matchId: state.matchId || `match_${Date.now()}`,
      gameId: state.gameId,
      gameTitle: state.gameTitle,
      playedAt: new Date().toISOString(),
      targetRounds: state.targetRounds,
      players: sortedScores
    };

    ArcadeStorage.recordMatchResult(matchResult);
    set({ status: 'completed', lastMatchResult: matchResult });
    return matchResult;
  },

  resetMatch: () => {
    const state = get();
    get().initLobby(state.gameId, state.gameTitle, state.targetRounds);
  }
}));
