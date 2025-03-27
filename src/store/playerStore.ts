// src/store/playerStore.ts
import { create } from "zustand";
import { PlayerInfo, PlayerRole, CardInfo } from "../constants/types";
import { fetchHandByRole } from "../services/deckService";
import { PLAYER1_DATA, PLAYER2_DATA } from "../constants/index";
import { useGameStore } from "./gameStore";

// プレイヤー操作に関するストアの型定義
interface PlayerStore {
  // 状態
  players: { [playerId: string]: PlayerInfo };
  loading: boolean;
  error: Error | null;

  // アクション
  getPlayerById: (playerId: string) => PlayerInfo | undefined;
  isLocalPlayer: (playerId: string) => boolean;
  loadPlayerHand: (localPlayerId: string) => Promise<void>;
  getLocalPlayerRole: (localPlayerId: string) => PlayerRole;

  // 内部実装
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setPlayers: (players: { [playerId: string]: PlayerInfo }) => void;
  initializePlayers: () => void;
}

// プレイヤー関連の操作を管理するストア
export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // 状態 - 初期値を設定
  players: {
    player1: PLAYER1_DATA,
    player2: PLAYER2_DATA,
  },
  loading: false,
  error: null,

  // アクション
  getPlayerById: (playerId) => {
    return get().players[playerId];
  },

  isLocalPlayer: (playerId) => {
    // gameStoreから直接依存を取り除く
    const localPlayerId = useGameStore.getState().getLocalPlayerId();
    return playerId === localPlayerId;
  },

  // 手札を読み込む
  loadPlayerHand: async (localPlayerId) => {
    const localPlayer = get().players[localPlayerId];

    if (!localPlayer) return;

    try {
      set({ loading: true });
      const cards = await fetchHandByRole(localPlayer.role);

      // プレイヤーの手札を更新
      set((state) => {
        const updatedPlayers = {
          ...state.players,
          [localPlayerId]: {
            ...localPlayer,
            hand: cards,
          },
        };

        return { players: updatedPlayers, error: null };
      });
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error(String(err)) });
    } finally {
      set({ loading: false });
    }
  },

  // ローカルプレイヤーの役割を取得
  getLocalPlayerRole: (localPlayerId) => {
    const localPlayer = get().players[localPlayerId];
    return localPlayer?.role || PlayerRole.NIXON;
  },

  // 内部実装: ローディング状態を設定
  setLoading: (loading) => set({ loading }),

  // 内部実装: エラー状態を設定
  setError: (error) => set({ error }),

  // プレイヤー情報の設定
  setPlayers: (players) => set({ players }),

  // プレイヤー情報の初期化
  initializePlayers: () => {
    set({
      players: {
        player1: PLAYER1_DATA,
        player2: PLAYER2_DATA,
      },
    });
  },
}));

// 手札を取得するセレクタ
export const getPlayerHand = (playerId: string): CardInfo[] => {
  const player = usePlayerStore.getState().getPlayerById(playerId);
  return player?.hand || [];
};

// ローカルプレイヤーの手札を取得するセレクタ
export const getLocalPlayerHand = (): CardInfo[] => {
  const localPlayerId = useGameStore.getState().getLocalPlayerId();
  const player = usePlayerStore.getState().getPlayerById(localPlayerId);
  return player?.hand || [];
};
