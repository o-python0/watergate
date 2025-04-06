// src/components/PlayerCardsArea/CardAreaOverlay.tsx
import React from "react";

interface CardAreaOverlayProps {
  isVisible: boolean;
  isTokenPlacementMode: boolean;
  isLocalPlayerTurn: boolean;
  isCardPhase: boolean;
  currentPhase: string;
}

const CardAreaOverlay: React.FC<CardAreaOverlayProps> = ({
  isVisible,
  isTokenPlacementMode,
  isLocalPlayerTurn,
  isCardPhase,
  currentPhase,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center">
      {/* トークン配置モード中のメッセージ */}
      {isTokenPlacementMode && (
        <div className="bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-purple-400">
          <span className="text-xl font-bold text-purple-600">
            証拠トークンを配置してください
          </span>
        </div>
      )}

      {/* 相手ターン時のメッセージ */}
      {!isTokenPlacementMode && !isLocalPlayerTurn && isCardPhase && (
        <div className="bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-red-400">
          <span className="text-xl font-bold text-red-600">
            相手のターン中です・・・
          </span>
        </div>
      )}

      {/* カードフェーズ以外の場合のメッセージ */}
      {!isTokenPlacementMode && !isCardPhase && (
        <div className="bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-blue-400">
          <span className="text-xl font-bold text-blue-600">
            {currentPhase === "preparation"
              ? "準備フェーズです"
              : "評価フェーズです"}
          </span>
        </div>
      )}
    </div>
  );
};

export default CardAreaOverlay;
