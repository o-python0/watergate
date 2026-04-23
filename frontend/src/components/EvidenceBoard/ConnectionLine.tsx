import React from "react";
import { EDGE_STYLES } from "../../features/evidenceBoard/presentation/constants/edgeStyle.constants";

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
  const strokeColor = isActive
    ? EDGE_STYLES.active.stroke
    : EDGE_STYLES.inactive.stroke;
  const strokeDasharray = isActive
    ? EDGE_STYLES.active.dasharray
    : EDGE_STYLES.inactive.dasharray;
  const strokeWidth = isHighlighted
    ? EDGE_STYLES.width.highlighted
    : EDGE_STYLES.width.normal;

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
