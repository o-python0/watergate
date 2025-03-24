import React, { useState } from "react";
import { useGame } from "../../contexts/GameContexts";
import { CardInfo, TokenColor } from "../../constants/types";
import Card from "./Card";
import { TEST_HAND_CARDS } from "../../constants";
import TokenTypeSelectorModal, {
  TokenSelection,
} from "./modal/TokenTypeSelectorModal";
import TokenActionSelectorModal, {
  TokenAction,
} from "./modal/TokenActionSelectorModal";

type Props = {
  onPlayActionPart?: (cardId: string) => void;
  onPlayValuePart?: (cardId: string) => void;
};

const PlayerCardsArea: React.FC<Props> = ({
  onPlayActionPart,
  onPlayValuePart,
}) => {
  const {
    moveTokenBySteps,
    flipTokenFaceUp,
    findFaceDownTokenWithColor,
    animating,
  } = useGame();

  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);
  const [showActionSelector, setShowActionSelector] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<TokenColor | null>(null);
  const [challengeFailed, setChallengeFailed] = useState<boolean>(false);

  // アクションパート実行関数
  const handleActionPartClick = (card: CardInfo) => {
    console.log(`アクションパートがクリックされました: ${card.id}`);
    // TODO: アクションパートの実装
  };

  // 数値パート実行関数
  const handleValuePartClick = (card: CardInfo) => {
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
    <div className="w-full h-full bg-orange-50 border border-orange-200 rounded p-4">
      <div className="flex justify-center space-x-4 h-full">
        {TEST_HAND_CARDS.map((card) => (
          <Card
            key={card.id}
            card={card}
            onActionPartClick={handleActionPartClick}
            onValuePartClick={handleValuePartClick}
            disabled={animating}
          />
        ))}
      </div>
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

export default PlayerCardsArea;
