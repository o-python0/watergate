import { useState } from "react";
import { CardInfo, TokenColor } from "../../constants/types";

// アクション選択モーダルの状態を管理するカスタムフック
export function useTokenActionSelector() {
  // モーダルの表示状態
  const [showActionSelector, setShowActionSelector] = useState<boolean>(false);
  // 選択されたカード
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  // 選択された色
  const [selectedColor, setSelectedColor] = useState<TokenColor | null>(null);

  // モーダルを開く
  const openActionSelector = (card: CardInfo, color: TokenColor) => {
    setSelectedCard(card);
    setSelectedColor(color);
    setShowActionSelector(true);
  };

  // モーダルを閉じる
  const closeActionSelector = () => {
    setShowActionSelector(false);
    setSelectedCard(null);
    setSelectedColor(null);
  };

  return {
    showActionSelector,
    selectedCard,
    selectedColor,
    openActionSelector,
    closeActionSelector,
  };
}
