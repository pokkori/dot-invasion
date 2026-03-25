import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerData, GameSettings } from '../types/player';
import { PRESET_UNITS } from '../constants/presets';
import { INITIAL_COLORS } from '../constants/colors';
import { ACHIEVEMENTS } from '../constants/achievements';

const KEYS = {
  PLAYER_DATA: '@pixel_siege/player_data',
  SETTINGS: '@pixel_siege/settings',
  SCHEMA_VERSION: '@pixel_siege/schema_version',
  TUTORIAL_STEP: '@pixel_siege/tutorial_step',
} as const;

const CURRENT_SCHEMA = 1;

export function createDefaultPlayerData(): PlayerData {
  const defaultDeck = {
    id: 'deck_default',
    name: 'デフォルト',
    unitIds: [PRESET_UNITS[0].id, PRESET_UNITS[1].id, PRESET_UNITS[2].id] as [string, string, string],
  };

  return {
    version: CURRENT_SCHEMA,
    profile: {
      name: '',
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    },
    inventory: {
      units: [...PRESET_UNITS],
      decks: [defaultDeck],
      activeDeckId: defaultDeck.id,
      unlockedColorIds: INITIAL_COLORS.map(c => c.id),
      coins: 0,
      gems: 0,
      adsWatchedToday: 0,
      lastAdDate: new Date().toISOString().split('T')[0],
    },
    progress: {
      currentStage: 1,
      clearedStages: [],
      matchHistory: [],
      achievements: ACHIEVEMENTS.map(a => ({
        id: a.id,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
      })),
      tutorialCompleted: false,
      totalWins: 0,
      totalLosses: 0,
    },
    settings: {
      soundEnabled: true,
      hapticEnabled: true,
      notificationsEnabled: false,
      language: 'ja',
      battleSpeed: 1,
    },
    stats: {
      totalBattles: 0,
      totalUnitsCreated: 0,
      totalParticlesGenerated: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      favoriteUnitId: null,
    },
  };
}

export async function loadPlayerData(): Promise<PlayerData> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAYER_DATA);
    if (data) {
      return JSON.parse(data) as PlayerData;
    }
  } catch (e) {
    console.error('Failed to load player data:', e);
  }
  return createDefaultPlayerData();
}

export async function savePlayerData(data: PlayerData): Promise<void> {
  try {
    data.profile.lastPlayedAt = Date.now();
    await AsyncStorage.setItem(KEYS.PLAYER_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save player data:', e);
  }
}

export async function loadSettings(): Promise<GameSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (data) return JSON.parse(data) as GameSettings;
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return {
    soundEnabled: true,
    hapticEnabled: true,
    notificationsEnabled: false,
    language: 'ja',
    battleSpeed: 1,
  };
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export async function getTutorialStep(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEYS.TUTORIAL_STEP);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setTutorialStep(step: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.TUTORIAL_STEP, String(step));
}

export async function migrateIfNeeded(): Promise<void> {
  const stored = await AsyncStorage.getItem(KEYS.SCHEMA_VERSION);
  const version = stored ? parseInt(stored, 10) : 0;

  if (version < 1) {
    const data = createDefaultPlayerData();
    await savePlayerData(data);
  }

  await AsyncStorage.setItem(KEYS.SCHEMA_VERSION, String(CURRENT_SCHEMA));
}
