/**
 * 証拠ボード上の証拠・情報提供者ノードの接続・色などのマスタ。
 * レイアウトの ID 列（`BOARD_*_NODE_IDS` / `evidenceBoardNodeSpec`）と一致させること。
 */

import type { NodeColor } from "../types/evidenceBoard.types";

export interface EvidenceBoardEvidenceNodeSeed {
  id: string;
  color: NodeColor;
  /** 接続先ノード ID（無向グラフとして双方向を想定し、隣接リストを明示する） */
  connections: string[];
}

export interface EvidenceBoardInformantNodeSeed {
  id: string;
  connections: string[];
}

/**
 * 各証拠ノードの定義。
 * 本番ではストーリーに合わせて `connections` を編集する。
 */
export const EVIDENCE_BOARD_EVIDENCE_NODE_SEEDS: EvidenceBoardEvidenceNodeSeed[] =
  [
    {
      id: "ev_b_1",
      color: "blue",
      connections: ["ev_x_1", "ev_g_1"],
    },
    {
      id: "ev_g_1",
      color: "green",
      connections: ["ev_b_1", "ev_g_2"],
    },
    {
      id: "ev_g_2",
      color: "green",
      connections: ["ev_g_1", "ev_y_1"],
    },
    {
      id: "ev_y_1",
      color: "yellow",
      connections: ["ev_g_2", "ev_x_1"],
    },
    {
      id: "ev_x_1",
      color: "green",
      connections: ["ev_y_1", "ev_b_1"],
    },
    {
      id: "ev_x_2",
      color: "yellow",
      connections: ["ev_x_10", "ev_x_3"],
    },
    {
      id: "ev_x_3",
      color: "blue",
      connections: ["ev_x_2", "ev_x_4"],
    },
    {
      id: "ev_x_4",
      color: "green",
      connections: ["ev_x_3", "ev_x_5"],
    },
    {
      id: "ev_x_5",
      color: "yellow",
      connections: ["ev_x_4", "ev_x_6"],
    },
    {
      id: "ev_x_6",
      color: "blue",
      connections: ["ev_x_5", "ev_x_7"],
    },
    {
      id: "ev_x_7",
      color: "green",
      connections: ["ev_x_6", "ev_x_8"],
    },
    {
      id: "ev_x_8",
      color: "yellow",
      connections: ["ev_x_7", "ev_x_9"],
    },
    {
      id: "ev_x_9",
      color: "blue",
      connections: ["ev_x_8", "ev_x_10"],
    },
    {
      id: "ev_x_10",
      color: "green",
      connections: ["ev_x_9", "ev_x_2"],
    },
  ];

/**
 * 情報提供者ノードの定義（ring3）。
 */
export const EVIDENCE_BOARD_INFORMANT_NODE_SEEDS: EvidenceBoardInformantNodeSeed[] =
  [
    { id: "inf_1", connections: [] },
    { id: "inf_2", connections: [] },
    { id: "inf_3", connections: [] },
    { id: "inf_4", connections: [] },
    { id: "inf_5", connections: [] },
    { id: "inf_6", connections: [] },
    { id: "inf_7", connections: [] },
  ];

export const INFORMANT_NODE_IDS: readonly string[] =
  EVIDENCE_BOARD_INFORMANT_NODE_SEEDS.map((s) => s.id);

export const PRIMARY_INFORMANT_NODE_ID = INFORMANT_NODE_IDS[0] ?? "inf_1";
