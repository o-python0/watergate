import React from "react";
import { TokenColor } from "../../../constants/types";
import { NodeColor } from "../../../types/evidenceBoard.types";
import { getColorHex } from "../../../utils/tokenUtils";

interface TokenOption {
  id: string;
  colors: TokenColor[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tokenId: string) => void;
  availableTokens: TokenOption[];
  selectedNode: { id: string; color: NodeColor } | null;
}

const SelectorNodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  availableTokens,
  selectedNode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="mb-7 text-sm text-gray-600">
          使用する証拠トークンを選択して下さい
        </div>

        {availableTokens.length === 0 ? null : (
          <div className="flex flex-wrap gap-4 mb-4 justify-center">
            {availableTokens.map((token) => (
              <button
                key={token.id}
                className="p-2 bg-transparent hover:bg-gray-100 rounded transition duration-200 flex flex-col items-center"
                onClick={() => onSelect(token.id)}
              >
                <div className="w-10 h-14 rounded border border-gray-800 overflow-hidden mb-1 relative">
                  {token.colors.length === 1 ? (
                    // 1色の場合
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: getColorHex(token.colors[0]) }}
                    />
                  ) : (
                    // 2色の場合
                    <>
                      <div
                        className="w-full h-1/2"
                        style={{
                          backgroundColor: getColorHex(token.colors[0]),
                        }}
                      />
                      <div
                        className="w-full h-1/2"
                        style={{
                          backgroundColor: getColorHex(token.colors[1]),
                        }}
                      />
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectorNodeModal;
