// src/components/EvidenceBoard/BoardPin.tsx
import React from "react";

interface BoardPinProps {
  x: number;
  y: number;
}

/**
 * コルクボードの画鋲を描画するシンプルなコンポーネント
 */
const BoardPin: React.FC<BoardPinProps> = ({ x, y }) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill="#A52A2A"
      stroke="#8B0000"
      strokeWidth="1"
    />
  );
};

export default BoardPin;
