export type PlayerColor = 'blue' | 'yellow' | 'red' | 'orange';

export interface BotConfig {
  reactionMsRange: [number, number];
  accuracy: number; // 0 to 1
  namePrefix?: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  botConfig?: BotConfig;
  avatarSeed?: number;
}
