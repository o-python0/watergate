import React from "react";

interface Props {
  id: string;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isActive: boolean;
  isHighlighted?: boolean;
}

const ConnectionLine: React.FC<Props> = ({
  id,
  fromPosition,
  toPosition,
  isActive,
  isHighlighted = false,
}) => {
  // 接続線のスタイル
  const strokeColor = isActive ? "#5D4037" : "#8D6E63";
  const strokeDasharray = isActive ? "none" : "4";
  const strokeWidth = isHighlighted ? 2 : 1;

  return (
    <line
      key={id}
      x1={fromPosition.x}
      y1={fromPosition.y}
      x2={toPosition.x}
      y2={toPosition.y}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
    />
  );
};

export default ConnectionLine;
