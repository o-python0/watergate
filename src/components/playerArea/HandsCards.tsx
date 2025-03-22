import React from 'react';
import { Card } from '../../constants/types';


interface HandCardsProps {
  cards: Card[];
  onPlayActionPart?: (cardId: string) => void;
  onPlayValuePart?: (cardId: string) => void;
}

const HandCards: React.FC<HandCardsProps> = ({ cards, onPlayActionPart, onPlayValuePart }) => {
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
              <span className="text-3xl font-bold text-gray-700">{card.value}</span>
            </div>
            
            {/* カード効果テキスト */}
            <div className="flex-grow p-2 text-xs overflow-y-auto bg-white">
              {card.actionEffect}
            </div>
            
            {/* アクションボタン */}
            <div className="flex border-t border-gray-300">
              <button
                // onClick={() => onPlayActionPart()}
                onClick={() => alert("数値パートを実行")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-semibold"
              >
                アクション
              </button>
              <div className="w-px bg-white"></div>
              <button
                // onClick={() => onPlayValuePart()}
                onClick={() => alert("数値パートを実行")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 text-sm font-semibold"
              >
                数値
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default HandCards;