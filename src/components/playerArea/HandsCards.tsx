import React, { useState } from "react";
import { CardInfo, TokenColor } from "../../constants/types";
import { useGame } from "../../contexts/GameContexts";

import TokenTypeSelectorModal, {
  TokenSelection,
} from "./modal/TokenTypeSelectorModal";
import TokenActionSelectorModal, {
  TokenAction,
} from "./modal/TokenActionSelectorModal";

interface HandCardsProps {
  cards: CardInfo[];
  onPlayActionPart?: (cardId: string) => void;
  onPlayValuePart?: (cardId: string) => void;
}

const HandCards: React.FC<HandCardsProps> = ({
  cards,
  onPlayActionPart,
  onPlayValuePart,
}) => {
  const {
    moveTokenBySteps,
    flipTokenFaceUp,
    findFaceDownTokenWithColor,
    animating,
  } = useGame();

  // 状態管理
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);
  const [showActionSelector, setShowActionSelector] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<TokenColor | null>(null);
  const [challengeFailed, setChallengeFailed] = useState<boolean>(false);

  // アクションパート実行関数
  const handleActionPartPlay = (card: CardInfo) => {
    if (animating) return;

    if (onPlayActionPart) {
      onPlayActionPart(card.id);
    }
  };

  // 数値パート実行関数
  const handleValuePart = (card: CardInfo) => {
    if (animating) return;

    setSelectedCard(card);
    setShowTypeSelector(true);
  };

  // トークンタイプを選択したときの処理
  const handleTypeSelect = (selection: TokenSelection) => {
    if (!selectedCard) return;

    const { value } = selectedCard.valuePart;

    switch (selection.type) {
      case "color":
        // 色が選択された場合、アクション選択モーダルへ
        setSelectedColor(selection.color);
        setShowTypeSelector(false);
        setShowActionSelector(true);
        break;

      case "initiative":
        // イニシアチブトークンが選択された場合、直接移動
        moveTokenBySteps("initiative", null, value);
        completeCardPlay();
        break;

      case "power":
        // 勢力トークンが選択された場合、直接移動
        moveTokenBySteps("power", null, value);
        completeCardPlay();
        break;
    }
  };

  // トークンアクションを選択したときの処理
  const handleActionSelect = (action: TokenAction) => {
    if (!selectedCard || selectedColor === null) return;

    const { value } = selectedCard.valuePart;

    switch (action.type) {
      case "moveToken":
        // 表向きトークンを移動
        moveTokenBySteps("evidence", action.tokenId, value);
        completeCardPlay();
        break;

      case "challenge":
        // チャレンジ処理
        const faceDownTokenId = findFaceDownTokenWithColor(selectedColor);
        if (faceDownTokenId !== null) {
          // トークンを表向きにして移動
          flipTokenFaceUp(faceDownTokenId);
          moveTokenBySteps("evidence", faceDownTokenId, value);
          completeCardPlay();
        } else {
          // 裏向きトークンがない場合は、トークンタイプ選択モーダルに戻る
          setShowActionSelector(false);
          setShowTypeSelector(true);
          // 色選択の選択肢は表示しないフラグを設定
          setChallengeFailed(true);
        }
        break;
    }
  };

  // カードプレイ完了の共通処理
  const completeCardPlay = () => {
    // モーダルを閉じる
    setShowTypeSelector(false);
    setShowActionSelector(false);
    setChallengeFailed(false);

    // カードプレイイベントを発火
    if (selectedCard && onPlayValuePart) {
      onPlayValuePart(selectedCard.id);
    }

    // 状態をリセット
    resetState();
  };

  // 状態リセットの共通処理
  const resetState = () => {
    setSelectedCard(null);
    setSelectedColor(null);
  };

  // 1段階目のモーダルをキャンセルしたときの処理
  const handleTypeSelectorCancel = () => {
    setShowTypeSelector(false);
    resetState();
  };

  // 2段階目のモーダルを戻るボタンで閉じたときの処理
  const handleActionSelectorBack = () => {
    setShowActionSelector(false);
    setSelectedColor(null);
    setShowTypeSelector(true);
  };

  // 2段階目のモーダルをキャンセルしたときの処理
  const handleActionSelectorCancel = () => {
    setShowActionSelector(false);
    resetState();
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border-2 border-gray-300 rounded-lg shadow-lg w-40 h-56 flex flex-col overflow-hidden"
          style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        >
          {/* カード名 */}
          <div className="bg-gray-200 p-2 text-center font-bold text-sm border-b border-gray-300">
            {card.name}
          </div>

          {/* カード数値 */}
          <div className="bg-gray-50 flex items-center justify-center p-3">
            <span className="text-3xl font-bold text-gray-700">
              {card.valuePart.value}
            </span>
            <div className="ml-2 flex">
              {card.valuePart.tokenColors &&
                card.valuePart.tokenColors.map((color: TokenColor) => (
                  <span
                    key={color}
                    className="w-4 h-4 rounded-full mx-0.5"
                    style={{
                      backgroundColor:
                        color === "red"
                          ? "#e74c3c"
                          : color === "blue"
                            ? "#3498db"
                            : "#2ecc71",
                    }}
                  />
                ))}
            </div>
          </div>

          {/* カード効果テキスト */}
          <div className="flex-grow p-2 text-xs overflow-y-auto bg-white">
            {card.actionPart.description}
          </div>

          {/* アクションボタン */}
          <div className="flex border-t border-gray-300">
            <button
              onClick={() => handleActionPartPlay(card)}
              disabled={animating}
              className={`flex-1 ${animating ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 text-sm font-semibold`}
            >
              アクション
            </button>
            <div className="w-px bg-white"></div>
            <button
              onClick={() => handleValuePart(card)}
              disabled={animating}
              className={`flex-1 ${animating ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white py-2 text-sm font-semibold`}
            >
              数値
            </button>
          </div>
        </div>
      ))}

      {/* トークンタイプ選択モーダル (1段階目) */}
      {showTypeSelector && selectedCard && (
        <TokenTypeSelectorModal
          colors={selectedCard.valuePart.tokenColors || []}
          steps={selectedCard.valuePart.value}
          onSelect={handleTypeSelect}
          onCancel={handleTypeSelectorCancel}
          challengeFailed={challengeFailed}
        />
      )}

      {/* トークンアクション選択モーダル (2段階目) */}
      {showActionSelector && selectedCard && selectedColor && (
        <TokenActionSelectorModal
          color={selectedColor}
          steps={selectedCard.valuePart.value}
          onSelect={handleActionSelect}
          onBack={handleActionSelectorBack}
          onCancel={handleActionSelectorCancel}
        />
      )}
    </div>
  );
};

export default HandCards;
