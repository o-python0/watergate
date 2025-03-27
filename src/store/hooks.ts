// src/store/hooks.ts
import { useGameStore } from "./gameStore";
import { useTokenStore } from "./tokenStore";
import { useCardStore } from "./cardStore";
import { usePlayerStore } from "./playerStore";
import {
  TokenType,
  TokenColor,
  CardInfo,
  PlayerInfo,
  PlayerRole,
} from "../constants/types";

/**
 * ゲーム全体の状態と操作にアクセスするためのカスタムフック
 */
export const useGame = () => {
  const gameState = useGameStore((state) => state.gameState);
  const animating = useGameStore((state) => state.animating);
  const selectedCardId = useGameStore((state) => state.selectedCardId);
  const setSelectedCardId = useGameStore((state) => state.setSelectedCardId);
  const localPlayerId = useGameStore((state) => state.getLocalPlayerId());

  // playerStoreからローカルプレイヤーのロールを取得
  const localPlayerRole = usePlayerStore((state) =>
    state.getLocalPlayerRole(localPlayerId)
  );

  return {
    gameState,
    animating,
    localPlayerRole,
    selectedCardId,
    setSelectedCardId,
    localPlayerId,
  };
};

/**
 * トークン操作にアクセスするためのカスタムフック
 */
export const useTokens = () => {
  const moveToken = useTokenStore((state) => state.moveToken);
  const flipTokenFaceUp = useTokenStore((state) => state.flipTokenFaceUp);
  const findFaceDownTokenWithColor = useTokenStore(
    (state) => state.findFaceDownTokenWithColor
  );
  const getEvidenceTokenIdByColor = useTokenStore(
    (state) => state.getEvidenceTokenIdByColor
  );

  return {
    moveToken,
    flipTokenFaceUp,
    findFaceDownTokenWithColor,
    getEvidenceTokenIdByColor,
  };
};

/**
 * カード操作にアクセスするためのカスタムフック
 */
export const useCards = () => {
  const discardCard = useCardStore((state) => state.discardCard);

  return {
    discardCard,
  };
};

/**
 * プレイヤー情報と操作にアクセスするためのカスタムフック
 */
export const usePlayers = () => {
  const loading = usePlayerStore((state) => state.loading);
  const error = usePlayerStore((state) => state.error);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const isLocalPlayer = usePlayerStore((state) => state.isLocalPlayer);
  const loadPlayerHand = usePlayerStore((state) => state.loadPlayerHand);

  const localPlayerId = useGameStore((state) => state.getLocalPlayerId());
  const localPlayer = usePlayerStore((state) =>
    state.getPlayerById(localPlayerId)
  );

  // 修正したloadPlayerHandを呼び出すラッパー関数
  const loadLocalPlayerHand = async () => {
    await loadPlayerHand(localPlayerId);
  };

  return {
    loading,
    error,
    getPlayerById,
    isLocalPlayer,
    loadPlayerHand: loadLocalPlayerHand,
    localPlayer,
    localPlayerId,
  };
};
