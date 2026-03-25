import { PixelUnit, Deck } from './unit';
import { MatchResult } from './battle';

/** プレイヤーの全永続データ */
export type PlayerData = {
  version: number;
  profile: PlayerProfile;
  inventory: Inventory;
  progress: Progress;
  settings: GameSettings;
  stats: PlayerStats;
};

export type PlayerProfile = {
  name: string;
  createdAt: number;
  lastPlayedAt: number;
};

export type Inventory = {
  units: PixelUnit[];
  decks: Deck[];
  activeDeckId: string;
  unlockedColorIds: string[];
  coins: number;
  gems: number;
  adsWatchedToday: number;
  lastAdDate: string;
};

export type Progress = {
  currentStage: number;
  clearedStages: number[];
  matchHistory: MatchResult[];
  achievements: AchievementState[];
  tutorialCompleted: boolean;
  totalWins: number;
  totalLosses: number;
};

export type AchievementState = {
  id: string;
  unlocked: boolean;
  unlockedAt: number | null;
  progress: number;
};

export type GameSettings = {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'ja' | 'en';
  battleSpeed: 1 | 1.5 | 2;
};

export type PlayerStats = {
  totalBattles: number;
  totalUnitsCreated: number;
  totalParticlesGenerated: number;
  longestWinStreak: number;
  currentWinStreak: number;
  favoriteUnitId: string | null;
};
