// src/hooks/usePlayerCards.ts
import { useState } from "react";
import { useGame } from "../contexts/GameContexts";
import { fetchHandByRole } from "../services/deckService";

export const usePlayerCards = () => {
  const { gameState, setGameState } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const localPlayer = gameState.players[gameState.localPlayerId];

  // 手札を取得して更新する
  const loadPlayerHand = async () => {
    if (!localPlayer) return;

    try {
      setLoading(true);
      const cards = await fetchHandByRole(localPlayer.role);

      // ゲーム状態の手札を更新
      setGameState((prev) => ({
        ...prev,
        players: {
          ...prev.players,
          [gameState.localPlayerId]: {
            ...localPlayer,
            hand: cards,
          },
        },
      }));

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return {
    hand: localPlayer?.hand || [],
    loading,
    error,
    loadPlayerHand,
  };
};
