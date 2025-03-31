import React from "react";
import { NODE_COLORS } from "../../constants/evidenceBoard.constants";
import {
  NodeColor,
  NodeOwner,
  NodeType,
} from "../../types/evidenceBoard.types";

// ノードサイズの定義
const NODE_SIZES = {
  nixon: 40,
  informant: 40,
  evidence: 30,
};

// 所有者による色
const OWNER_COLORS = {
  journalist: "#27ae60",
  nixon: "#2c3e50",
  null: "transparent",
};

interface Props {
  data: {
    id: string;
    type: NodeType;
    color?: NodeColor;
    owner: NodeOwner;
  };
  position: {
    x: number;
    y: number;
  };
  isSelected?: boolean;
  handlers: {
    onClick: (nodeId: string) => void;
    onDoubleClick: (nodeId: string) => void;
  };
}

const EvidenceNode: React.FC<Props> = ({
  data,
  position,
  isSelected,
  handlers,
}) => {
  const { id, type, color, owner } = data;
  const { onClick, onDoubleClick } = handlers;
  const nodeSize = NODE_SIZES[type];

  // ノードの色を決定
  let fillColor = NODE_COLORS.default;
  if (type === "nixon") {
    fillColor = NODE_COLORS.nixon;
  } else if (type === "informant") {
    fillColor = NODE_COLORS.informant;
  } else if (color && color in NODE_COLORS) {
    fillColor = NODE_COLORS[color as keyof typeof NODE_COLORS];
  }

  // 所有者による枠線の色
  const strokeColor = owner !== null ? OWNER_COLORS[owner] : "#95a5a6";

  // 選択状態でハイライト
  const strokeWidth = isSelected ? 4 : 2;

  // ニクソン所有の場合は黒で塗りつぶし
  if (owner === "nixon") {
    fillColor = OWNER_COLORS.nixon;
  }

  // ノードが非活性かどうか判定
  const isDisabled = owner === "nixon";

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onClick={() => onClick(id)}
      onDoubleClick={() => onDoubleClick(id)}
      style={{
        cursor: isDisabled ? "default" : "pointer",
        opacity: isDisabled ? 0.7 : 1,
      }}
      pointerEvents={isDisabled ? "none" : "auto"}
    >
      {/* ノードの形状を描画 */}
      {type === "nixon" && (
        <rect
          x={-nodeSize / 2}
          y={-nodeSize / 2}
          width={nodeSize}
          height={nodeSize}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      {type === "informant" && (
        <circle
          r={nodeSize / 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      {type === "evidence" && (
        <polygon
          points={`0,${-nodeSize / 2} ${nodeSize / 2},0 0,${nodeSize / 2} ${-nodeSize / 2},0`}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}

      {/* ノードラベル */}
      <text
        textAnchor="middle"
        dy="0.3em"
        fill={owner === "nixon" ? "white" : "black"}
        fontSize="12"
        fontWeight="bold"
      >
        {id.split("_").pop() || "N"}
      </text>
    </g>
  );
};

export default EvidenceNode;
