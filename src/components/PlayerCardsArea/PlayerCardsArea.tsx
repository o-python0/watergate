import React, { useEffect } from "react";
import { CardInfo, PlayerRole } from "../../constants/types";
import Card from "./Card";
import TokenTypeSelectorModal, {
  TokenSelection,
} from "./modal/TokenTypeSelectorModal";
import TokenActionSelectorModal, {
  TokenAction,
} from "./modal/TokenActionSelectorModal";
import { useTokenTypeSelector } from "../../hooks/modals/useTokenTypeSelector";
import { useTokenActionSelector } from "../../hooks/modals/useTokenActionSelector";
import { usePlayerCards } from "../../hooks/usePlayerCards";
import { useGameStore } from "../../store/gameStore";
import { useCards, usePlayers, useTokens } from "../../store/hooks";

const PlayerCardsArea: React.FC = () => {
  const { selectedCardId, setSelectedCardId, animating } = useGameStore();
  const { localPlayer } = usePlayers();
  const { moveToken, flipTokenFaceUp, findFaceDownTokenWithColor } =
    useTokens();
  const { discardCard } = useCards();

  const { hand, loading, loadPlayerHand } = usePlayerCards();
  const localPlayerRole = localPlayer?.role || PlayerRole.NIXON;

  useEffect(() => {
    loadPlayerHand();
  }, [localPlayerRole]);

  // 1段階目のモーダルのフック
  const {
    showTypeSelector,
    selectedCard: typeSelectorCard,
    challengeFailed,
    openTypeSelector,
    closeTypeSelector,
    setFailedChallenge,
  } = useTokenTypeSelector();

  // 2段階目のモーダルのフック
  const {
    showActionSelector,
    selectedCard: actionSelectorCard,
    selectedColor,
    openActionSelector,
    closeActionSelector,
  } = useTokenActionSelector();

  // アクションパート実行関数
  const handleActionPartClick = (card: CardInfo) => {
    console.log(`アクションパートがクリックされました: ${card.id}`);
    // TODO: アクションパートの実装
  };

  // 数値パート実行関数
  const handleValuePartClick = (card: CardInfo) => {
    if (animating) return;
    setSelectedCardId(card.id);
    openTypeSelector(card);
  };

  // トークンタイプを選択したときの処理
  const handleTypeSelect = (selection: TokenSelection) => {
    if (!typeSelectorCard) return;

    const { value } = typeSelectorCard.valuePart;

    switch (selection.type) {
      case "color":
        if (selection.color) {
          // 証拠トークンの場合、アクション選択モーダルへ
          openActionSelector(typeSelectorCard, selection.color);
          closeTypeSelector();
        }
        break;

      case "initiative":
      case "power":
        // イニシアチブまたは勢力トークンの場合、直接移動
        moveToken(selection.type, value);
        completeCardPlay(typeSelectorCard.id);
        break;
    }
  };

  // 証拠トークンアクションを選択したときの処理
  const handleActionSelect = (action: TokenAction) => {
    if (!actionSelectorCard || selectedColor === null) return;

    const { value } = actionSelectorCard.valuePart;

    switch (action.type) {
      case "moveToken":
        // 表向きトークンを移動
        moveToken("evidence", value, action.tokenId);
        completeCardPlay(actionSelectorCard.id);
        break;

      case "challenge":
        // チャレンジ処理
        const faceDownTokenId = findFaceDownTokenWithColor(selectedColor);

        if (faceDownTokenId !== null) {
          // トークンを表向きにして移動
          flipTokenFaceUp(faceDownTokenId);
          moveToken("evidence", value, faceDownTokenId);
          completeCardPlay(actionSelectorCard.id);
        } else {
          // 裏向きトークンがない場合は、トークンタイプ選択モーダルに戻る
          closeActionSelector();
          openTypeSelector(actionSelectorCard);
          // 色選択の選択肢は表示しないフラグを設定
          setFailedChallenge(true);
        }
        break;
    }
  };

  // カードプレイ完了の共通処理
  const completeCardPlay = (cardId: string) => {
    // プレイしたカードを捨てる
    discardCard(selectedCardId);
    setSelectedCardId("");
    // モーダルを閉じる
    closeTypeSelector();
    closeActionSelector();
  };

  if (loading) {
    return <div>カード読み込み中...</div>;
  }

  return (
    <div className="w-full h-full bg-orange-50 border border-orange-200 rounded p-4">
      <div className="flex justify-center space-x-4 h-full">
        {hand.map((card: CardInfo) => (
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
      {showTypeSelector && typeSelectorCard && (
        <TokenTypeSelectorModal
          colors={typeSelectorCard.valuePart.tokenColors || []}
          steps={typeSelectorCard.valuePart.value}
          onSelect={handleTypeSelect}
          onCancel={closeTypeSelector}
          challengeFailed={challengeFailed}
        />
      )}

      {/* トークンアクション選択モーダル (2段階目) */}
      {showActionSelector && actionSelectorCard && selectedColor && (
        <TokenActionSelectorModal
          color={selectedColor}
          steps={actionSelectorCard.valuePart.value}
          onSelect={handleActionSelect}
          onBack={() => {
            closeActionSelector();
            if (actionSelectorCard) {
              openTypeSelector(actionSelectorCard);
            }
          }}
          onCancel={closeActionSelector}
        />
      )}
    </div>
  );
};

export default PlayerCardsArea;
