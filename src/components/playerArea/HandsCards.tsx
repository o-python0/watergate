import React, { useState } from 'react';
import { Card, TokenColor, TokenType } from '../../constants/types';
import { useGame } from '../../contexts/GameContexts';
import TokenSelectorModal from './TokenSelectorModal';

interface HandCardsProps {
  cards: Card[];
  onPlayActionPart?: (cardId: string) => void;
  onPlayValuePart?: (cardId: string) => void;
}

const HandCards: React.FC<HandCardsProps> = ({ cards, onPlayActionPart, onPlayValuePart }) => {
  const { moveTokenBySteps, getEvidenceTokenIdByColor, animating } = useGame();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  
  // アクションパート実行関数
  const handleActionPartPlay = (card: Card) => {
    if (animating) return;
    
    // 仮の実装：アラートを表示
    alert(`アクションパート: ${card.actionPart.description}`);
    
    if (onPlayActionPart) {
      onPlayActionPart(card.id);
    }
  };
  
  // 数値パート実行関数
  const handleValuePart = (card: Card) => {
    if (animating) return;
    
    setSelectedCard(card);
    setShowTokenSelector(true);
  };


  // modalで対象トークンを選択後の処理
  const handleTokenSelect = (tokenType: TokenType, tokenColor?: TokenColor) => {
    if (!selectedCard) return;
    
    const { value } = selectedCard.valuePart;
    
    if (tokenType === 'evidence' && tokenColor) {
      const tokenId = getEvidenceTokenIdByColor(tokenColor);
      if (tokenId !== null) {
        moveTokenBySteps('evidence', tokenId, value);
      }
    } else {
      // 勢力またはイニシアチブトークンの移動
      moveTokenBySteps(tokenType, null, value);
    }
    
    setShowTokenSelector(false);
    setSelectedCard(null);
    
    if (onPlayValuePart) {
      onPlayValuePart(selectedCard.id);
    }
  };

  const handleModalCancel = () => {
    setShowTokenSelector(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border-2 border-gray-300 rounded-lg shadow-lg w-40 h-56 flex flex-col overflow-hidden"
          style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          {/* カード名 */}
          <div className="bg-gray-200 p-2 text-center font-bold text-sm border-b border-gray-300">
            {card.name}
          </div>
          
          {/* カード数値 */}
          <div className="bg-gray-50 flex items-center justify-center p-3">
            <span className="text-3xl font-bold text-gray-700">{card.valuePart.value}</span>
            <div className="ml-2 flex">
              {card.valuePart.tokenColors && card.valuePart.tokenColors.map((color) => (
                <span 
                  key={color}
                  className="w-4 h-4 rounded-full mx-0.5" 
                  style={{ 
                    backgroundColor: color === 'red' ? '#e74c3c' : 
                                    color === 'blue' ? '#3498db' : '#2ecc71' 
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
              className={`flex-1 ${animating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 text-sm font-semibold`}
            >
              アクション
            </button>
            <div className="w-px bg-white"></div>
            <button
              onClick={() => handleValuePart(card)}
              disabled={animating}
              className={`flex-1 ${animating ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white py-2 text-sm font-semibold`}
            >
              数値
            </button>
          </div>
        </div>
      ))}

      {showTokenSelector && selectedCard && (
        <TokenSelectorModal
          card={selectedCard}
          onSelect={handleTokenSelect}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default HandCards;