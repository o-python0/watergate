import React from "react";
import { CardInfo, TokenColor } from "../../constants/types";
import { getColorHex } from "../../utils/tokenUtils";

interface Props {
  card: CardInfo;
  onActionPartClick: (card: CardInfo) => void;
  onValuePartClick: (card: CardInfo) => void;
  disabled?: boolean;
}

const Card: React.FC<Props> = ({
  card,
  onActionPartClick,
  onValuePartClick,
  disabled = false,
}) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg w-40 h-full flex flex-col overflow-hidden">
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
            card.valuePart.tokenColors.map(
              (color: TokenColor, index: number) => (
                <span
                  key={`${color}-${index}`}
                  className="w-4 h-4 rounded-full mx-0.5"
                  style={{ backgroundColor: getColorHex(color) }}
                />
              )
            )}
        </div>
      </div>

      {/* カード効果テキスト */}
      <div className="flex-grow p-2 text-xs overflow-y-auto bg-white">
        {card.actionPart.description}
      </div>

      {/* アクションボタン */}
      <div className="flex border-t border-gray-300">
        <button
          onClick={() => onActionPartClick(card)}
          disabled={disabled}
          className={`flex-1 ${disabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 text-sm font-semibold transition duration-150`}
        >
          アクション
        </button>
        <div className="w-px bg-white"></div>
        <button
          onClick={() => onValuePartClick(card)}
          disabled={disabled}
          className={`flex-1 ${disabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white py-2 text-sm font-semibold transition duration-150`}
        >
          数値
        </button>
      </div>
    </div>
  );
};

export default Card;
