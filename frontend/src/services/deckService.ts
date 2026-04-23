// src/services/deckService.ts
import { CardInfo, PlayerRole } from "../constants/types";
import { getCardsByRole } from "../mocks/card";

// プレイヤーロールに基づいた手札の取得
export const fetchHandByRole = async (
  role: PlayerRole
): Promise<CardInfo[]> => {
  try {
    // 現在は定義済みのカードデータを使用（将来的にはAPI経由で取得）
    const allCards = getCardsByRole(role);

    // API呼び出しをシミュレート
    return new Promise((resolve) => {
      setTimeout(() => {
        // ランダムに5枚選んで返す
        const shuffled = [...allCards].sort(() => 0.5 - Math.random());
        const hand = shuffled.slice(0, 5);
        resolve(hand);
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
};

// 将来的な拡張のためのスケルトン関数
export const markCardAsPlayed = async (cardId: string): Promise<void> => {
  // 将来的にAPIと連携する予定
  console.log(`Card ${cardId} marked as played`);
  return Promise.resolve();
};
