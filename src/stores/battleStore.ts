import { create } from 'zustand';
import { BattleState, AIOpponent } from '../types/battle';

type BattleStore = {
  battleState: BattleState | null;
  opponent: AIOpponent | null;
  selectedUnitIndex: number | null;
  setBattleState: (state: BattleState | null) => void;
  setOpponent: (opponent: AIOpponent | null) => void;
  setSelectedUnitIndex: (index: number | null) => void;
  reset: () => void;
};

export const useBattleStore = create<BattleStore>((set) => ({
  battleState: null,
  opponent: null,
  selectedUnitIndex: null,

  setBattleState: (battleState) => set({ battleState }),
  setOpponent: (opponent) => set({ opponent }),
  setSelectedUnitIndex: (index) => set({ selectedUnitIndex: index }),
  reset: () => set({ battleState: null, opponent: null, selectedUnitIndex: null }),
}));
