// src/components/TokenSelectorModal.tsx
import React from 'react';
import { Card, TokenType, TokenColor } from '../../constants/types';

interface TokenSelectorModalProps {
  card: Card;
  onSelect: (tokenType: TokenType, tokenColor?: TokenColor) => void; // tokenColorパラメータを追加
  onCancel: () => void;
}

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({ card, onSelect, onCancel }) => {
  // 証拠トークンボタンの有効/無効を決定
  const hasTokenColors = Array.isArray(card.valuePart.tokenColors) && card.valuePart.tokenColors.length > 0;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">移動させるトークンを選択して下さい</h3>
        <p className="text-sm text-gray-600 mb-4">
          移動距離：{card.valuePart.value}マス
        </p>
        
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => onSelect('initiative')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center"
          >
            <span className="w-6 h-6 rounded-full bg-white text-yellow-500 flex items-center justify-center font-bold mr-2">I</span>
            イニシアチブマーカー
          </button>
          
          <button 
            onClick={() => onSelect('power')}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center"
          >
            <span className="w-6 h-6 rounded-full bg-white text-red-500 flex items-center justify-center font-bold mr-2">P</span>
            勢力トークン
          </button>
          
          {/* 証拠トークンのボタン - 複数色対応 */}
          {hasTokenColors ? (
            <>
              <div className="text-sm text-gray-700 mt-2 mb-1">証拠トークン:</div>
              {card.valuePart.tokenColors.map((color) => (
                <button 
                  key={color}
                  onClick={() => onSelect('evidence', color)}
                  className={`${
                    color === 'red' ? 'bg-red-500 hover:bg-red-600' : 
                    color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 
                    'bg-green-500 hover:bg-green-600'
                  } text-white py-2 px-4 rounded flex items-center`}
                >
                  <span 
                    className="w-6 h-6 rounded bg-white flex items-center justify-center font-bold mr-2"
                    style={{
                      color: color === 'red' ? '#e74c3c' : 
                             color === 'blue' ? '#3498db' : '#2ecc71'
                    }}
                  >
                    E
                  </span>
                  証拠トークン ({color})
                </button>
              ))}
            </>
          ) : (
            <button 
              disabled={true}
              className="bg-gray-400 cursor-not-allowed text-white py-2 px-4 rounded flex items-center"
            >
              <span className="w-6 h-6 rounded bg-white text-gray-500 flex items-center justify-center font-bold mr-2">E</span>
              証拠トークン (なし)
            </button>
          )}
        </div>
        
        <button 
          onClick={onCancel}
          className="mt-4 bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded w-full"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default TokenSelectorModal;