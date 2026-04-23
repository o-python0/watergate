import type { ShapeType } from "./evidenceBoard.constants";

/**
 * 論理座標上でのノードの配置ルール。
 * ring0: center（ニクソン）
 * ring1/2: 証拠（短辺に対する半径比 + 極角）
 * ring3: 情報提供者（同様に onCircle）
 */
export type NodeLayoutRole =
  | { kind: "center" }
  | { kind: "onCircle"; radiusRatio: number; angleRad: number };

export type EvidenceBoardNodeSpec = {
  layout: NodeLayoutRole;
  /** 表示サイズ（直径・一辺に相当する論理ピクセル） */
  size: number;
  /** owner === null のときの形。所有後は getNodeShape に従う */
  baseShape: ShapeType;
};

/** ボードの短辺に対する各リングの半径の割合 */
export const BOARD_LAYOUT_RADIUS_RATIOS = {
  /** ring1: 内側の証拠ノード 5 */
  ring1Evidence: 0.22,
  /** ring2: 外側の証拠ノード 9 */
  ring2Evidence: 0.32,
  /** ring3: 情報提供者 */
  ring3Informant: 0.4,
} as const;
