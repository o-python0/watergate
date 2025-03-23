import React from 'react';
import { TokenColor } from '../../../constants/types';

// 選択肢の種類
export type TokenSelectionType = 'power' | 'initiative' | 'color';

// 選択結果の型
export type TokenSelection = 
  | { type: 'power' }
  | { type: 'initiative' }
  | { type: 'color', color: TokenColor };

  interface Props {
    colors: TokenColor[];
    steps: number;
    onSelect: (selection: TokenSelection) => void;
    onCancel: () => void;
    challengeFailed?: boolean;
  }
  
  const TokenTypeSelectorModal: React.FC<Props> = ({
    colors,
    steps,
    onSelect,
    onCancel,
    challengeFailed = false
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center border-b pb-2">
            {challengeFailed 
              ? "指定の色の証拠トークンはありませんでした。どちらかを選択してください。" 
              : "トークンを選択してください"}
          </h3>
          <p className="text-center text-gray-600 mb-4">{steps}マス移動します</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* イニシアチブトークン */}
            <button
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex flex-col items-center transition duration-200 border border-gray-300"
              onClick={() => onSelect({ type: 'initiative' })}
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-700 flex items-center justify-center mb-2 font-bold">I</div>
              <div className="text-sm font-medium">イニシアチブマーカー</div>
            </button>
            
            {/* 勢力トークン */}
            <button
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex flex-col items-center transition duration-200 border border-gray-300"
              onClick={() => onSelect({ type: 'power' })}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-gray-700 flex items-center justify-center mb-2 font-bold text-white">P</div>
              <div className="text-sm font-medium">勢力トークン</div>
            </button>
            
            {/* 色ごとの選択肢 - チャレンジ失敗時は表示しない */}
            {!challengeFailed && colors.map(color => (
              <button
                key={color}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex flex-col items-center transition duration-200 border border-gray-300"
                onClick={() => onSelect({ type: 'color', color })}
              >
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-700 mb-2"
                  style={{
                    backgroundColor: color === 'red' ? '#e74c3c' : 
                                     color === 'blue' ? '#3498db' : '#2ecc71'
                  }}
                ></div>
                <div className="text-sm font-medium">
                  {color.charAt(0).toUpperCase() + color.slice(1)}色
                </div>
              </button>
            ))}
          </div>
          
          {!challengeFailed &&
            <div className="flex justify-end">
            <button 
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
            >
                キャンセル
            </button>
            </div>
          }
        </div>
      </div>
    );
  };

export default TokenTypeSelectorModal;