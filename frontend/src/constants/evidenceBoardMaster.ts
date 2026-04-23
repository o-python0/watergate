/**
 * 証拠ボードのマスタデータ取得の単一境界。
 *
 * 開発時: このファイル内の定数から `EvidenceGraph` と初期座標を組み立てる。
 * 本番想定: `getEvidenceBoardInitialState` の実装のみを API / DB 取得に差し替え、
 *           戻り値の型（EvidenceGraph + nodePositions）は維持する。
 */

import { BOARD_BASE_SIZE } from "./evidenceBoard.constants";
import {
  EVIDENCE_BOARD_EVIDENCE_NODE_SEEDS,
  EVIDENCE_BOARD_INFORMANT_NODE_SEEDS,
  INFORMANT_NODE_IDS,
} from "./evidenceBoardNode";
import { calculateInitialPositions } from "./evidenceBoardLayout";
import { BOARD_EVIDENCE_NODE_IDS, NIXON_NODE_ID } from "./evidenceBoardNodeSpec";
import type { EvidenceGraph } from "../types/evidenceBoard.types";

function assertEvidenceSeedsMatchLayout(): void {
  const seedIds = new Set(EVIDENCE_BOARD_EVIDENCE_NODE_SEEDS.map((s) => s.id));
  if (BOARD_EVIDENCE_NODE_IDS.length !== seedIds.size) {
    throw new Error(
      `evidenceBoardMaster: BOARD_EVIDENCE_NODE_IDS と EVIDENCE_BOARD_EVIDENCE_NODE_SEEDS の件数が一致しません (${BOARD_EVIDENCE_NODE_IDS.length} vs ${seedIds.size})`
    );
  }
  for (let i = 0; i < BOARD_EVIDENCE_NODE_IDS.length; i++) {
    const id = BOARD_EVIDENCE_NODE_IDS[i]!;
    if (!seedIds.has(id)) {
      throw new Error(
        `evidenceBoardMaster: レイアウト上の id「${id}」に対応する seed がありません`
      );
    }
  }
}

function assertInformantSeedsMatchLayout(): void {
  if (
    EVIDENCE_BOARD_INFORMANT_NODE_SEEDS.length !== INFORMANT_NODE_IDS.length
  ) {
    throw new Error(
      `evidenceBoardMaster: INFORMANT_NODE_IDS と EVIDENCE_BOARD_INFORMANT_NODE_SEEDS の件数が一致しません (${INFORMANT_NODE_IDS.length} vs ${EVIDENCE_BOARD_INFORMANT_NODE_SEEDS.length})`
    );
  }
  for (let i = 0; i < INFORMANT_NODE_IDS.length; i++) {
    const layoutId = INFORMANT_NODE_IDS[i]!;
    const seedId = EVIDENCE_BOARD_INFORMANT_NODE_SEEDS[i]!.id;
    if (layoutId !== seedId) {
      throw new Error(
        `evidenceBoardMaster: informant の並びが一致しません（index ${i}: ${layoutId} vs ${seedId}）`
      );
    }
  }
}

function buildEvidenceBoardGraph(): EvidenceGraph {
  assertEvidenceSeedsMatchLayout();
  assertInformantSeedsMatchLayout();

  const evidenceNodes: EvidenceGraph["nodes"] = {};
  const informantNodes: EvidenceGraph["nodes"] = {};

  for (const seed of EVIDENCE_BOARD_EVIDENCE_NODE_SEEDS) {
    evidenceNodes[seed.id] = {
      id: seed.id,
      type: "evidence",
      color: seed.color,
      owner: null,
      connections: [...seed.connections],
      placedEvidenceId: null,
    };
  }

  for (const seed of EVIDENCE_BOARD_INFORMANT_NODE_SEEDS) {
    informantNodes[seed.id] = {
      id: seed.id,
      type: "informant",
      owner: null,
      connections: [...seed.connections],
      placedEvidenceId: null,
    };
  }

  return {
    nodes: {
      [NIXON_NODE_ID]: {
        id: NIXON_NODE_ID,
        type: "nixon",
        owner: null,
        connections: [],
        placedEvidenceId: null,
      },
      ...informantNodes,
      ...evidenceNodes,
    },
  };
}

/** 接続・ノード属性のマスタ（開発用は定数から構築） */
export function getEvidenceBoardGraph(): EvidenceGraph {
  return buildEvidenceBoardGraph();
}

/** レイアウト定義に基づく初期座標（論理座標系） */
export function getEvidenceBoardInitialNodePositions(): {
  [nodeId: string]: { x: number; y: number };
} {
  return calculateInitialPositions(
    BOARD_BASE_SIZE.width,
    BOARD_BASE_SIZE.height
  );
}

/** ストア初期化・リセット用のまとめ取得 */
export function getEvidenceBoardInitialState(): {
  evidenceGraph: EvidenceGraph;
  nodePositions: { [nodeId: string]: { x: number; y: number } };
} {
  return {
    evidenceGraph: getEvidenceBoardGraph(),
    nodePositions: getEvidenceBoardInitialNodePositions(),
  };
}
