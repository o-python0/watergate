// // src/services/cardPlayService.ts
import React from "react";

// import { CardInfo } from "../constants/types";
// import { useGameStore } from "../store/gameStore";

// /**
//  * カードを手札から捨て札に移動する
//  * @param hand 現在の手札
//  * @param discardedCards 現在の捨て札
//  * @param cardId 捨てるカードのID
//  * @returns 更新された手札と捨て札、捨てられたカード
//  */
// export const discardCard = (
//   hand: CardInfo[],
//   discardedCards: CardInfo[],
//   cardId: string
// ): {
//   updatedHand: CardInfo[];
//   updatedDiscardedCards: CardInfo[];
//   discardedCard: CardInfo | null;
// } => {
//   // カードを手札から見つける
//   const cardIndex = hand.findIndex((card) => card.id === cardId);

//   // カードが見つからない場合
//   if (cardIndex === -1) {
//     return {
//       updatedHand: hand,
//       updatedDiscardedCards: discardedCards,
//       discardedCard: null,
//     };
//   }

//   // 捨てるカードを取得
//   const discardedCard = hand[cardIndex];

//   // 手札を更新（捨てたカードを除去）
//   const updatedHand = [
//     ...hand.slice(0, cardIndex),
//     ...hand.slice(cardIndex + 1),
//   ];

//   // 捨て札に追加
//   const updatedDiscardedCards = [...discardedCards, discardedCard];

//   return {
//     updatedHand,
//     updatedDiscardedCards,
//     discardedCard,
//   };
// };

// /**
//  * カードを手札から捨て札に移動する
//  */
// export const discardCardImpl = (cardId: string): CardInfo | null => {
//   const { gameState, setGameState } = useGameStore.getState();
//   const { localPlayerId } = gameState;
//   const player = gameState.players[localPlayerId];

//   if (!player) return null;

//   const { updatedHand, updatedDiscardedCards, discardedCard } = discardCard(
//     player.hand || [],
//     player.discardedCards || [],
//     cardId
//   );

//   if (!discardedCard) return null;

//   setGameState((prev) => ({
//     ...prev,
//     players: {
//       ...prev.players,
//       [localPlayerId]: {
//         ...player,
//         hand: updatedHand,
//         discardedCards: updatedDiscardedCards,
//       },
//     },
//   }));

//   return discardedCard;
// };
