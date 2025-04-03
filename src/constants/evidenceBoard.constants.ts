import { NodeType, NodeOwner } from "../types/evidenceBoard.types";

// 色の定義
export const NODE_COLORS = {
  blue: "#3498db",
  green: "#2ecc71",
  red: "#e74c3c",
  yellow: "#f1c40f",
  nixon: "#2c3e50",
  informant: "#9b59b6",
  default: "#95a5a6",
};

export const BOARD_BASE_SIZE = {
  width: 800,
  height: 600,
};

// 形状の種類を定義する型
export type ShapeType = "circle" | "square" | "diamond";

// ノードタイプと所有者に基づいて形状を決定する関数
export const getNodeShape = (
  nodeType: NodeType,
  owner: NodeOwner
): ShapeType => {
  // ノードタイプで基本形状を決定
  if (nodeType === "nixon") {
    return "square";
  }

  if (nodeType === "informant") {
    return "circle";
  }

  if (nodeType === "evidence") {
    if (owner === "nixon") {
      return "square";
    } else if (owner === "journalist") {
      return "square";
    } else {
      return "diamond";
    }
  }

  // フォールバック（通常ここには到達しない）
  return "diamond";
};
