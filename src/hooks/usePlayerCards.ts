// src/hooks/usePlayerCards.ts
import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { usePlayerStore } from "../store/playerStore";
import { fetchHandByRole } from "../services/deckService";

export const usePlayerCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // gameStoreからローカルプレイヤーIDを取得
  const localPlayerId = useGameStore((state) => state.getLocalPlayerId());

  // playerStoreからプレイヤー情報と更新関数を取得
  const { players, setPlayers } = usePlayerStore();
  const localPlayer = players[localPlayerId];

  // 手札を取得して更新する
  const loadPlayerHand = async () => {
    if (!localPlayer) return;

    try {
      setLoading(true);
      const cards = await fetchHandByRole(localPlayer.role);

      // playerStoreの手札を更新
      setPlayers({
        ...players,
        [localPlayerId]: {
          ...localPlayer,
          hand: cards,
        },
      });

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
