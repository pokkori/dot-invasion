import { create } from 'zustand';
import { PlayerData } from '../types/player';
import { PixelUnit, Deck } from '../types/unit';
import { MatchResult } from '../types/battle';
import { loadPlayerData, savePlayerData, createDefaultPlayerData } from '../utils/storage';

type PlayerStore = {
  data: PlayerData;
  loaded: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  setName: (name: string) => void;
  addUnit: (unit: PixelUnit) => void;
  removeUnit: (unitId: string) => void;
  updateDeck: (deck: Deck) => void;
  setActiveDeck: (deckId: string) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  unlockColor: (colorId: string) => void;
  addMatchResult: (result: MatchResult) => void;
  clearStage: (stageNumber: number) => void;
  setTutorialCompleted: () => void;
  getActiveDeck: () => Deck | undefined;
  getDeckUnits: () => PixelUnit[];
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  data: createDefaultPlayerData(),
  loaded: false,

  load: async () => {
    const data = await loadPlayerData();
    set({ data, loaded: true });
  },

  save: async () => {
    await savePlayerData(get().data);
  },

  setName: (name: string) => {
    set(state => ({
      data: {
        ...state.data,
        profile: { ...state.data.profile, name },
      },
    }));
  },

  addUnit: (unit: PixelUnit) => {
    set(state => ({
      data: {
        ...state.data,
        inventory: {
          ...state.data.inventory,
          units: [...state.data.inventory.units, unit],
        },
        stats: {
          ...state.data.stats,
          totalUnitsCreated: state.data.stats.totalUnitsCreated + 1,
        },
      },
    }));
  },

  removeUnit: (unitId: string) => {
    set(state => ({
      data: {
        ...state.data,
        inventory: {
          ...state.data.inventory,
          units: state.data.inventory.units.filter(u => u.id !== unitId),
        },
      },
    }));
  },

  updateDeck: (deck: Deck) => {
    set(state => {
      const decks = state.data.inventory.decks.map(d =>
        d.id === deck.id ? deck : d
      );
      if (!decks.find(d => d.id === deck.id)) {
        decks.push(deck);
      }
      return {
        data: {
          ...state.data,
          inventory: { ...state.data.inventory, decks },
        },
      };
    });
  },

  setActiveDeck: (deckId: string) => {
    set(state => ({
      data: {
        ...state.data,
        inventory: { ...state.data.inventory, activeDeckId: deckId },
      },
    }));
  },

  addCoins: (amount: number) => {
    set(state => ({
      data: {
        ...state.data,
        inventory: {
          ...state.data.inventory,
          coins: state.data.inventory.coins + amount,
        },
      },
    }));
  },

  addGems: (amount: number) => {
    set(state => ({
      data: {
        ...state.data,
        inventory: {
          ...state.data.inventory,
          gems: state.data.inventory.gems + amount,
        },
      },
    }));
  },

  unlockColor: (colorId: string) => {
    set(state => {
      const ids = state.data.inventory.unlockedColorIds;
      if (ids.includes(colorId)) return state;
      return {
        data: {
          ...state.data,
          inventory: {
            ...state.data.inventory,
            unlockedColorIds: [...ids, colorId],
          },
        },
      };
    });
  },

  addMatchResult: (result: MatchResult) => {
    set(state => {
      const isWin = result.winner === 'player';
      const newWinStreak = isWin ? state.data.stats.currentWinStreak + 1 : 0;
      const history = [result, ...state.data.progress.matchHistory].slice(0, 50);

      return {
        data: {
          ...state.data,
          progress: {
            ...state.data.progress,
            matchHistory: history,
            totalWins: state.data.progress.totalWins + (isWin ? 1 : 0),
            totalLosses: state.data.progress.totalLosses + (isWin ? 0 : 1),
          },
          stats: {
            ...state.data.stats,
            totalBattles: state.data.stats.totalBattles + 1,
            currentWinStreak: newWinStreak,
            longestWinStreak: Math.max(state.data.stats.longestWinStreak, newWinStreak),
          },
        },
      };
    });
  },

  clearStage: (stageNumber: number) => {
    set(state => {
      const cleared = state.data.progress.clearedStages;
      if (cleared.includes(stageNumber)) return state;
      return {
        data: {
          ...state.data,
          progress: {
            ...state.data.progress,
            clearedStages: [...cleared, stageNumber],
            currentStage: Math.max(state.data.progress.currentStage, stageNumber + 1),
          },
        },
      };
    });
  },

  setTutorialCompleted: () => {
    set(state => ({
      data: {
        ...state.data,
        progress: { ...state.data.progress, tutorialCompleted: true },
      },
    }));
  },

  getActiveDeck: () => {
    const state = get();
    return state.data.inventory.decks.find(d => d.id === state.data.inventory.activeDeckId);
  },

  getDeckUnits: () => {
    const state = get();
    const deck = state.getActiveDeck();
    if (!deck) return [];
    return deck.unitIds.map(id =>
      state.data.inventory.units.find(u => u.id === id)
    ).filter((u): u is PixelUnit => u !== undefined);
  },
}));
