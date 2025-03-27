// src/store/cardStore.ts
import { create } from "zustand";
import { CardInfo } from "../constants/types";
import { useGameStore } from "./gameStore";
import { usePlayerStore } from "./playerStore";

// カード操作に関するストアの型定義
interface CardStore {
  // アクション
  discardCard: (cardId: string) => CardInfo | null;

  // 内部実装
  _discardCardImpl: (cardId: string) => CardInfo | null;
}

// カード関連の操作を管理するストア
export const useCardStore = create<CardStore>((set, get) => ({
  // パブリックAPI: カードを捨てる
  discardCard: (cardId) => {
    return get()._discardCardImpl(cardId);
  },

  // 内部実装: カード捨て処理
  _discardCardImpl: (cardId) => {
    const localPlayerId = useGameStore.getState().getLocalPlayerId();
    const { players } = usePlayerStore.getState();
    const player = players[localPlayerId];

    if (!player) return null;

    // カードを捨てる処理
    const { updatedHand, updatedDiscardedCards, discardedCard } = discardCard(
      player.hand || [],
      player.discardedCards || [],
      cardId
    );

    if (!discardedCard) return null;

    // プレイヤー情報を更新
    usePlayerStore.getState().setPlayers({
      ...players,
      [localPlayerId]: {
        ...player,
        hand: updatedHand,
        discardedCards: updatedDiscardedCards,
      },
    });

    return discardedCard;
  },
}));

/**
 * カードを手札から捨て札に移動する純粋関数
 */
export const discardCard = (
  hand: CardInfo[],
  discardedCards: CardInfo[],
  cardId: string
): {
  updatedHand: CardInfo[];
  updatedDiscardedCards: CardInfo[];
  discardedCard: CardInfo | null;
} => {
  // カードを手札から見つける
  const cardIndex = hand.findIndex((card) => card.id === cardId);

  // カードが見つからない場合
  if (cardIndex === -1) {
    return {
      updatedHand: hand,
      updatedDiscardedCards: discardedCards,
      discardedCard: null,
    };
  }

  // 捨てるカードを取得
  const discardedCard = hand[cardIndex];

  // 手札を更新（捨てたカードを除去）
  const updatedHand = [
    ...hand.slice(0, cardIndex),
    ...hand.slice(cardIndex + 1),
  ];

  // 捨て札に追加
  const updatedDiscardedCards = [...discardedCards, discardedCard];

  return {
    updatedHand,
    updatedDiscardedCards,
    discardedCard,
  };
};
