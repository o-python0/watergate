import { create } from "zustand";
import {
  GameState,
  TokenType,
  TokenColor,
  PlayerInfo,
  PlayerRole,
  CardInfo,
} from "../constants/types";
import { DEFAULT_GAME_STATE } from "../constants/index";
import {
  getTokenPosition,
  calculateNewPosition,
  updateTokenPosition,
  getEvidenceTokenIdByColor as getTokenByColor,
  findFaceDownTokenWithColor as findFaceDownToken,
  flipTokenFaceUp as flipToken,
} from "../services/tokenService";
import { discardCardImpl } from "../services/cardPlayService";

interface GameStore {
  // 状態
  gameState: GameState;
  animating: boolean;
  localPlayerRole: string;
  selectedCardId: string;

  // 状態更新
  setGameState: (updater: React.SetStateAction<GameState>) => void;
  // setter
  setSelectedCardId: (cardId: string) => void;

  // トークン関連インターフェース
  moveToken: (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ) => void;
  flipTokenFaceUp: (tokenId: number | string) => void;
  findFaceDownTokenWithColor: (colorName: TokenColor) => number | string;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | string;

  // カード関連インターフェース
  discardCard: (cardId: string) => CardInfo | null;

  // プレイヤー関連インターフェース
  getPlayerById: (playerId: string) => PlayerInfo | undefined;
  isLocalPlayer: (playerId: string) => boolean;

  // 内部実装（コンポーネントからは直接使用しない）
  moveTokenBySteps: (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 初期状態
  gameState: DEFAULT_GAME_STATE,
  animating: false,
  localPlayerRole:
    DEFAULT_GAME_STATE.players[DEFAULT_GAME_STATE.localPlayerId]?.role ||
    PlayerRole.NIXON,
  selectedCardId: "",

  // gameStateを更新する関数
  setGameState: (updater) =>
    set((state) => {
      const newGameState =
        typeof updater === "function" ? updater(state.gameState) : updater;

      return {
        gameState: newGameState,
        localPlayerRole:
          newGameState.players[newGameState.localPlayerId]?.role ||
          PlayerRole.NIXON,
      };
    }),
  // setter
  setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),

  getEvidence: () => get().gameState.evidence,
  // トークン関連インターフェース -------------------------------
  moveToken: (tokenType, steps, tokenId) => {
    get().moveTokenBySteps(tokenType, steps, tokenId);
  },

  flipTokenFaceUp: (tokenId) => flipToken(tokenId),

  findFaceDownTokenWithColor: (colorName) => findFaceDownToken(colorName),

  getEvidenceTokenIdByColor: (colorName) => getTokenByColor(colorName),

  // カード関連インターフェース ---------------------------------
  discardCard: (cardId) => discardCardImpl(cardId),

  // プレイヤー関連インターフェース ------------------------------
  getPlayerById: (playerId) => {
    return get().gameState.players[playerId];
  },

  isLocalPlayer: (playerId) => {
    return playerId === get().gameState.localPlayerId;
  },

  // 内部実装
  moveTokenBySteps: (tokenType, steps, tokenId) => {
    const { animating } = get();
    if (animating || steps === 0) return;

    set({ animating: true });

    // 現在位置の取得
    const currentPosition = getTokenPosition(tokenType, tokenId);
    if (currentPosition === null) {
      set({ animating: false });
      return;
    }

    // 新しい位置を計算
    const newPosition = calculateNewPosition(currentPosition, steps);

    // 移動が不要な場合はスキップ
    if (currentPosition === newPosition) {
      set({ animating: false });
      return;
    }

    const distance = newPosition - currentPosition;
    const absoluteSteps = Math.abs(distance);

    // アニメーションステップ
    let currentStep = 0;
    const stepDuration = 200;

    const animateStep = () => {
      currentStep++;

      // 次の位置を計算
      const nextPosition =
        distance > 0
          ? currentPosition + currentStep
          : currentPosition - currentStep;

      // トークン位置を更新
      updateTokenPosition(tokenType, nextPosition, tokenId);

      // アニメーション継続または終了
      if (currentStep < absoluteSteps) {
        setTimeout(animateStep, stepDuration);
      } else {
        set({ animating: false });
      }
    };

    // アニメーション開始
    if (absoluteSteps > 0) {
      setTimeout(animateStep, 10);
    } else {
      set({ animating: false });
    }
  },
}));
