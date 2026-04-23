import { useState } from "react";
import { CardInfo } from "../../constants/types";

// トークン選択の状態を管理するカスタムフック
export function useTokenTypeSelector() {
  // モーダルの表示状態
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);
  // 選択されたカード
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  // チャレンジ失敗状態
  const [challengeFailed, setChallengeFailed] = useState<boolean>(false);

  // モーダルを開く
  const openTypeSelector = (card: CardInfo) => {
    setSelectedCard(card);
    setShowTypeSelector(true);
    setChallengeFailed(false);
  };

  // モーダルを閉じる
  const closeTypeSelector = () => {
    setShowTypeSelector(false);
    setSelectedCard(null);
    setChallengeFailed(false);
  };

  // チャレンジ失敗状態を設定
  const setFailedChallenge = (failed: boolean) => {
    setChallengeFailed(failed);
  };

  return {
    showTypeSelector,
    selectedCard,
    challengeFailed,
    openTypeSelector,
    closeTypeSelector,
    setFailedChallenge,
  };
}
