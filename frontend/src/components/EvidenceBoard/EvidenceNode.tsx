import React, { useMemo } from "react";
import { NODE_COLORS, ShapeType } from "../../constants/evidenceBoard.constants";
import {
  resolveNodeShape,
  resolveNodeSize,
} from "../../constants/evidenceBoardLayout";
import { EVIDENCE_NODE_DEBUG_ID_BY_NODE_ID } from "../../constants/evidenceBoardNodeSpec";
import { useEvidenceBoardStore } from "../../store/evidenceBoardStore";
import { NodeColor, NodeOwner, NodeType } from "../../types/evidenceBoard.types";

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
    onDoubleClick: (node: Props["data"]) => void;
  };
}

const EvidenceNodeComponent: React.FC<Props> = ({
  data,
  position,
  isSelected,
  handlers,
}) => {
  const { id, type, color, owner } = data;
  const { onClick, onDoubleClick } = handlers;
  const nodeSize = resolveNodeSize(id, type);
  const { isTokenPlacementMode, capturedEvidenceTokens } =
    useEvidenceBoardStore();

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

  const isDimmed = owner === "nixon";

  // nodeの非活性条件
  const isNotClickable =
    //nodeTypeが証拠トークン以外のもの
    type === "nixon" ||
    type === "informant" ||
    // ownerが中立でないトークン
    owner !== null ||
    // トークン配置モードでない場合
    !isTokenPlacementMode;

  const shapeType = resolveNodeShape(id, type, owner);

  // 指定された形状を描画する関数
  const renderShape = (shape: ShapeType) => {
    const commonProps = {
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    };

    switch (shape) {
      case "circle":
        return <circle r={nodeSize / 2} {...commonProps} />;

      case "square":
        return (
          <rect
            x={-nodeSize / 2}
            y={-nodeSize / 2}
            width={nodeSize}
            height={nodeSize}
            {...commonProps}
          />
        );

      case "diamond":
        return (
          <polygon
            points={`0,${-nodeSize / 2} ${nodeSize / 2},0 0,${nodeSize / 2} ${-nodeSize / 2},0`}
            {...commonProps}
          />
        );
    }
  };

  const isHighlighted = useMemo(() => {
    if (
      !(isTokenPlacementMode && type === "evidence" && owner === null && color)
    ) {
      return false;
    }

    // capturedEvidenceTokens の中に、このノードの色と一致するトークンがあるかチェック
    return capturedEvidenceTokens.some((token) =>
      token.colors.includes(color as string)
    );
  }, [isTokenPlacementMode, type, owner, color, capturedEvidenceTokens]);

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onClick={isNotClickable ? undefined : () => onClick(id)}
      onDoubleClick={isNotClickable ? undefined : () => onDoubleClick(data)}
      style={{
        cursor: isNotClickable ? "default" : "pointer",
        opacity: isDimmed ? 0.7 : 1,
      }}
      className={isHighlighted ? "animate-pulse-highlight" : ""}
      pointerEvents={isNotClickable ? "none" : "auto"}
    >
      {/* ノードの形状を描画 */}
      {renderShape(shapeType)}

      {/* ノードラベル */}
      <text
        textAnchor="middle"
        dy="0.3em"
        fill={owner === "nixon" ? "white" : "black"}
        fontSize="12"
        fontWeight="bold"
      >
        {type === "evidence"
          ? String(EVIDENCE_NODE_DEBUG_ID_BY_NODE_ID[id] ?? "?")
          : id.split("_").pop() || "N"}
      </text>
    </g>
  );
};

export default EvidenceNodeComponent;
