// src/store/gameStore.ts
import { create } from "zustand";
import { GameState, PlayerRole } from "../constants/types";
import { DEFAULT_GAME_STATE } from "../constants/index";

// ゲーム全体の状態を管理するストア
interface GameStore {
  // 基本状態
  gameState: GameState;
  animating: boolean;
  selectedCardId: string;

  // アクション
  setGameState: (updater: React.SetStateAction<GameState>) => void;
  setAnimating: (animating: boolean) => void;
  setSelectedCardId: (cardId: string) => void;
  getLocalPlayerId: () => string;
}

// 基本となるゲームストアを作成
export const useGameStore = create<GameStore>((set, get) => ({
  // 初期状態
  gameState: DEFAULT_GAME_STATE,
  animating: false,
  selectedCardId: "",

  // 状態更新関数
  setGameState: (updater) =>
    set((state) => {
      const newGameState =
        typeof updater === "function" ? updater(state.gameState) : updater;

      return {
        gameState: newGameState,
      };
    }),

  setAnimating: (animating) => set({ animating }),
  setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),

  // ローカルプレイヤーIDを取得するヘルパー関数
  getLocalPlayerId: () => get().gameState.localPlayerId,
}));
