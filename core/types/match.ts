import { PlayerProfile, PlayerColor } from './player';

export interface PlayerMatchScore {
  playerId: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  rank: number;
  correctCount: number;
  wrongCount: number;
  finishTimeMs: number;
  accuracy: number; // percentage 0-100
}

export interface MatchResult {
  matchId: string;
  gameId: string;
  gameTitle: string;
  playedAt: string; // ISO date
  targetRounds: number;
  players: PlayerMatchScore[];
}

export interface GameManifest {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  badge: string;
  category: string;
  gradeLevel: string;
  minPlayers: number;
  maxPlayers: number;
  routes: {
    lobby: string;
    play: string;
    results: string;
  };
  supportedRounds?: number[];
  defaultRounds?: number;
}
