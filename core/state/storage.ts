import { PlayerProfile } from '../types/player';
import { MatchResult } from '../types/match';

const SCHEMA_VERSION = 'v1.0';

interface StoragePayload<T> {
  version: string;
  updatedAt: string;
  data: T;
}

export class ArcadeStorage {
  private static isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private static get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed: StoragePayload<T> = JSON.parse(raw);
      if (parsed && parsed.data !== undefined) {
        return parsed.data;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, data: T): void {
    if (!this.isAvailable()) return;
    try {
      const payload: StoragePayload<T> = {
        version: SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        data
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.warn(`[ArcadeStorage] Failed to write key ${key}:`, e);
    }
  }

  // --- Player Profile ---
  public static getPlayerProfile(): PlayerProfile {
    const defaultProfile: PlayerProfile = {
      id: 'player_human',
      name: 'Player1',
      color: 'blue',
      isBot: false,
    };
    return this.get<PlayerProfile>('arcade:playerProfile', defaultProfile);
  }

  public static savePlayerProfile(profile: PlayerProfile): void {
    this.set<PlayerProfile>('arcade:playerProfile', profile);
  }

  // --- Leaderboards per game ---
  public static getLeaderboard(gameId: string): MatchResult[] {
    return this.get<MatchResult[]>(`arcade:leaderboard:${gameId}`, []);
  }

  public static recordMatchResult(result: MatchResult): void {
    const list = this.getLeaderboard(result.gameId);
    const updated = [result, ...list].slice(0, 50); // Keep top 50 recent
    this.set<MatchResult[]>(`arcade:leaderboard:${result.gameId}`, updated);
  }

  // --- Settings per game ---
  public static getGameSettings<T>(gameId: string, defaultSettings: T): T {
    return this.get<T>(`arcade:settings:${gameId}`, defaultSettings);
  }

  public static saveGameSettings<T>(gameId: string, settings: T): void {
    this.set<T>(`arcade:settings:${gameId}`, settings);
  }
}
