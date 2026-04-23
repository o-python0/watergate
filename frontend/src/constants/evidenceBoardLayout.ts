/**
 * 証拠ボードの座標計算・表示解決。
 * ノード辞書は evidenceBoardNodeSpec を参照。
 */

import {
  getNodeShape,
  type ShapeType,
} from "./evidenceBoard.constants";
import {
  BOARD_LAYOUT_RADIUS_RATIOS,
  type EvidenceBoardNodeSpec,
  type NodeLayoutRole,
} from "./evidenceBoardLayout.types";
import {
  EVIDENCE_BOARD_NODE_SPEC,
  evenlySpacedRingAngles,
  zipEvidenceRingSlots,
} from "./evidenceBoardNodeSpec";
import type { NodeType, NodeOwner } from "../types/evidenceBoard.types";

export type { EvidenceBoardNodeSpec, NodeLayoutRole };
export {
  BOARD_LAYOUT_RADIUS_RATIOS,
  EVIDENCE_BOARD_NODE_SPEC,
  evenlySpacedRingAngles,
  zipEvidenceRingSlots,
};

const DEFAULT_NODE_SIZES: Record<NodeType, number> = {
  nixon: 40,
  informant: 40,
  evidence: 30,
};

/**
 * 論理サイズ (width × height) のボード上の初期ノード座標を返す。
 * 基準サイズは BOARD_BASE_SIZE と揃え、EvidenceBoard のスケール計算と対にする。
 */
export function calculateInitialPositions(
  width: number,
  height: number
): { [nodeId: string]: { x: number; y: number } } {
  const centerX = width / 2;
  const centerY = height / 2;
  const minSide = Math.min(width, height);

  const positions: { [nodeId: string]: { x: number; y: number } } = {};

  for (const [nodeId, spec] of Object.entries(EVIDENCE_BOARD_NODE_SPEC)) {
    const { layout } = spec;
    if (layout.kind === "center") {
      positions[nodeId] = { x: centerX, y: centerY };
    } else if (layout.kind === "onCircle") {
      const r = minSide * layout.radiusRatio;
      positions[nodeId] = {
        x: centerX + r * Math.cos(layout.angleRad),
        y: centerY + r * Math.sin(layout.angleRad),
      };
    }
  }

  return positions;
}

/** マッピングが無いノード ID のときのフォールバック */
export function resolveNodeSize(nodeId: string, type: NodeType): number {
  return EVIDENCE_BOARD_NODE_SPEC[nodeId]?.size ?? DEFAULT_NODE_SIZES[type];
}

/**
 * 所有者あり: ゲームルール（getNodeShape）。
 * 中立: マッピングの baseShape。
 */
export function resolveNodeShape(
  nodeId: string,
  type: NodeType,
  owner: NodeOwner
): ShapeType {
  if (owner !== null) {
    return getNodeShape(type, owner);
  }
  const spec = EVIDENCE_BOARD_NODE_SPEC[nodeId];
  if (spec) {
    return spec.baseShape;
  }
  return getNodeShape(type, owner);
}
