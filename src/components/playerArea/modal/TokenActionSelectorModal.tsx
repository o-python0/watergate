import React from 'react';
import { TokenColor } from '../../../constants/types';
import { useGame } from '../../../contexts/GameContexts';

// アクションの種類
export type TokenAction = 
  | { type: 'moveToken', tokenId: number }
  | { type: 'challenge' };

interface TokenActionSelectorProps {
  color: TokenColor;
  steps: number;
  onSelect: (action: TokenAction) => void;
  onBack: () => void;
  onCancel: () => void;
}

const TokenActionSelectorModal: React.FC<TokenActionSelectorProps> = ({
  color,
  steps,
  onSelect,
  onBack,
  onCancel
}) => {
  const { gameState } = useGame();
  
  // 調査トラック上の選択色の表向きトークンを取得
  const faceUpTokens = gameState.evidenceTokens.filter(token => 
    token.isFaceUp && 
    token.colors.includes(color) && 
    token.owner === null // 獲得されていないトークンのみ
  );
  
  // 裏向きトークンが1つ以上あるか確認
  const hasFaceDownTokens = gameState.evidenceTokens.some(token => !token.isFaceUp);
  
  // 選択肢が何もない場合のチェック
  const hasNoOptions = faceUpTokens.length === 0 && !hasFaceDownTokens;
  
  // トークンの背景色を取得する関数
  const getColorHex = (color: TokenColor): string => {
    switch(color) {
      case 'red': return '#e74c3c';
      case 'blue': return '#3498db';
      case 'green': return '#2ecc71';
      default: return '#808080';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center border-b pb-2">
          {color.charAt(0).toUpperCase() + color.slice(1)}色のアクション
        </h3>
        <p className="text-center text-gray-600 mb-4">{steps}マス移動します</p>
        
        <div 
          className="w-8 h-8 rounded mx-auto mb-4"
          style={{ backgroundColor: getColorHex(color) }}
        ></div>
        
        <div className="space-y-4 mb-4">
          {/* 表向きトークン選択肢 */}
          {faceUpTokens.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-700 mb-2">表向きトークン</h4>
              <div className="space-y-2">
                {faceUpTokens.map(token => (
                  <button
                    key={token.id}
                    className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center border-l-4 border-blue-500 transition duration-200"
                    onClick={() => onSelect({ type: 'moveToken', tokenId: token.id })}
                  >
                    <div 
                      className="w-8 h-8 flex items-center justify-center text-white font-bold rounded mr-3"
                      style={{ backgroundColor: token.displayColor }}
                    >
                      {token.label}
                    </div>
                    <div>
                      <div className="font-medium">トークン {token.label} を移動</div>
                      <div className="text-xs text-gray-500">位置: {token.position}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* チャレンジ選択肢 */}
          {hasFaceDownTokens && (
            <div>
              <h4 className="font-bold text-gray-700 mb-2">チャレンジ</h4>
              <button
                className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center border-l-4 border-red-500 transition duration-200"
                onClick={() => onSelect({ type: 'challenge' })}
              >
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold rounded mr-3">
                  ?
                </div>
                <div>
                  <div className="font-medium">チャレンジを行う</div>
                  <div className="text-xs text-gray-500">
                    裏向きの{color}色トークンがあれば表向きにして移動します。
                    なければ勢力またはイニシアチブトークンを移動します。
                  </div>
                </div>
              </button>
            </div>
          )}
          
          {/* 選択肢がない場合のメッセージ */}
          {hasNoOptions && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
              利用可能なアクションがありません。戻るボタンを押して別の選択をしてください。
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            戻る
          </button>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenActionSelectorModal;