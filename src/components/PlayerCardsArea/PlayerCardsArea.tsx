// src/components/PlayerCardsArea.tsx
import React from "react";

// サンプルカードデータ（仮データ）
const sampleCards = [
  {
    id: "card1",
    name: "報道記事",
    actionPart: {
      description: "アクション: 相手の手札を1枚見る",
      effect: "view_opponent_card",
    },
    valuePart: {
      value: 2,
      description: "トークンを2マス移動",
      tokenColors: ["red", "blue"],
    },
  },
  {
    id: "card2",
    name: "証言",
    actionPart: {
      description: "アクション: イニシアチブマーカーを1マス移動",
      effect: "move_initiative",
    },
    valuePart: {
      value: 3,
      description: "トークンを3マス移動",
      tokenColors: ["green"],
    },
  },
  {
    id: "card3",
    name: "文書",
    actionPart: {
      description: "アクション: 勢力トークンを1マス移動",
      effect: "move_power",
    },
    valuePart: {
      value: 1,
      description: "トークンを1マス移動",
      tokenColors: ["red", "blue", "green"],
    },
  },
];

const PlayerCardsArea: React.FC = () => {
  return (
    <div className="w-full h-full bg-orange-50 border border-orange-200 rounded p-4">
      <div className="flex justify-center space-x-4 h-full">
        {sampleCards.map((card) => (
          <div
            key={card.id}
            className="bg-white border-2 border-gray-300 rounded-lg shadow-lg w-40 h-full flex flex-col overflow-hidden"
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
                  card.valuePart.tokenColors.map((color) => (
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
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-semibold">
                アクション
              </button>
              <div className="w-px bg-white"></div>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 text-sm font-semibold">
                数値
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerCardsArea;
