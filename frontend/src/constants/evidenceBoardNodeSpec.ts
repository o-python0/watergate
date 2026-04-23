/**
 * 証拠ボードのノード辞書をパターンから組み立てる。
 *
 * レイヤー（ring）構成:
 * - ring0: ニクソン（中心）
 * - ring1: 証拠 5
 * - ring2: 証拠 9
 * - ring3: 情報提供者
 */

import {
  INFORMANT_NODE_IDS,
  PRIMARY_INFORMANT_NODE_ID,
} from "./evidenceBoardNode";
import type { EvidenceBoardNodeSpec } from "./evidenceBoardLayout.types";
import { BOARD_LAYOUT_RADIUS_RATIOS } from "./evidenceBoardLayout.types";

export { INFORMANT_NODE_IDS, PRIMARY_INFORMANT_NODE_ID };

/**
 * 円周に等間隔で n 個の角度（ラジアン）を返す。
 * @param startRad 先頭スロットの角度（既定 0 = 右方向）
 */
export function evenlySpacedRingAngles(
  count: number,
  startRad = 0
): number[] {
  if (count <= 0) return [];
  const step = (2 * Math.PI) / count;
  return Array.from({ length: count }, (_, i) => startRad + i * step);
}

/**
 * ノード ID 列と角度列を結合し、リングスロット配列を生成する。
 */
export function zipEvidenceRingSlots(
  ids: string[],
  anglesRad: number[]
): { id: string; angleRad: number }[] {
  if (ids.length !== anglesRad.length) {
    throw new Error(
      `evidenceBoardNodeSpec: ids (${ids.length}) and anglesRad (${anglesRad.length}) length mismatch`
    );
  }
  return ids.map((id, i) => ({ id, angleRad: anglesRad[i]! }));
}

// --- ring0: ニクソン -----------------------------------------------------------

export const NIXON_NODE_ID = "nix";

const NIXON_NODE = {
  id: NIXON_NODE_ID,
  size: 40,
  baseShape: "square" as const,
};

// --- ring3: 情報提供者（ID は evidenceBoardNode の定義と一致） ----------------

const INFORMANT_SLOTS: {
  id: string;
  size: number;
  baseShape: EvidenceBoardNodeSpec["baseShape"];
}[] = INFORMANT_NODE_IDS.map((id) => ({
  id,
  size: 40,
  baseShape: "circle" as const,
}));

// --- ring1 / ring2: 証拠 ------------------------------------------------------

const EVIDENCE_NODE_DEFAULTS = {
  size: 30,
  baseShape: "diamond" as const,
};

/** ring1: 内側リング上のノード ID 順（周上の等間隔割り当て順） */
export const BOARD_RING1_NODE_IDS = [
  "ev_b_1",
  "ev_g_1",
  "ev_g_2",
  "ev_y_1",
  "ev_x_1",
] as const;

/** ring2: 中リング上のノード ID 順 */
export const BOARD_RING2_NODE_IDS = [
  "ev_x_2",
  "ev_x_3",
  "ev_x_4",
  "ev_x_5",
  "ev_x_6",
  "ev_x_7",
  "ev_x_8",
  "ev_x_9",
  "ev_x_10",
] as const;

/** ring1・ring2 に配置する証拠ノードの全体順（デバッグ番号・マスタ整合用） */
export const BOARD_EVIDENCE_NODE_IDS = [
  ...BOARD_RING1_NODE_IDS,
  ...BOARD_RING2_NODE_IDS,
] as const;

/** 追加したプレースホルダー証拠ノード（グラフ生成などで利用） */
export const EXTRA_EVIDENCE_NODE_IDS = BOARD_EVIDENCE_NODE_IDS.filter((id) =>
  id.startsWith("ev_x_")
);

export const CORE_EVIDENCE_NODE_IDS = BOARD_EVIDENCE_NODE_IDS.filter(
  (id) => !id.startsWith("ev_x_")
);

/** デバッグ表示用: 証拠ノード ID → 1 始まりの連番（BOARD_EVIDENCE_NODE_IDS の並び順） */
export const EVIDENCE_NODE_DEBUG_ID_BY_NODE_ID: Record<string, number> =
  Object.fromEntries(
    BOARD_EVIDENCE_NODE_IDS.map((nodeId, index) => [nodeId, index + 1])
  );

/** 画面上の「右上」方向の極角（SVG は y 下向き正） */
const BOARD_RING_UPPER_RIGHT_ANCHOR_RAD = -Math.PI / 4;

/**
 * ring2 上でデバッグ番号 11（ev_x_7 = 0-based index 5）を右上に置く先頭角
 */
const RING2_COUNT = BOARD_RING2_NODE_IDS.length;
const RING2_ANGLE_STEP = (2 * Math.PI) / RING2_COUNT;
const RING2_DEBUG_ANCHOR_INDEX = 5;
const RING2_START_RAD =
  BOARD_RING_UPPER_RIGHT_ANCHOR_RAD -
  RING2_DEBUG_ANCHOR_INDEX * RING2_ANGLE_STEP;

/**
 * ring1 は ring2 に対して半ステップずらし、ノードが重なりにくいようにする
 */
const RING1_COUNT = BOARD_RING1_NODE_IDS.length;
const RING1_START_RAD = RING2_START_RAD + RING2_ANGLE_STEP / 2;

const BOARD_RING1_SLOTS = zipEvidenceRingSlots(
  [...BOARD_RING1_NODE_IDS],
  evenlySpacedRingAngles(RING1_COUNT, RING1_START_RAD)
);

const BOARD_RING2_SLOTS = zipEvidenceRingSlots(
  [...BOARD_RING2_NODE_IDS],
  evenlySpacedRingAngles(RING2_COUNT, RING2_START_RAD)
);

/** ring3: 情報提供者を外周に等間隔（先頭を盤の下方向 π/2 から） */
const RING3_COUNT = INFORMANT_NODE_IDS.length;
const RING3_START_RAD = Math.PI / 2;
const BOARD_RING3_SLOTS = zipEvidenceRingSlots(
  [...INFORMANT_NODE_IDS],
  evenlySpacedRingAngles(RING3_COUNT, RING3_START_RAD)
);

// -----------------------------------------------------------------------------

function buildEvidenceBoardNodeSpec(): Record<string, EvidenceBoardNodeSpec> {
  const out: Record<string, EvidenceBoardNodeSpec> = {};

  out[NIXON_NODE.id] = {
    layout: { kind: "center" },
    size: NIXON_NODE.size,
    baseShape: NIXON_NODE.baseShape,
  };

  for (let i = 0; i < BOARD_RING3_SLOTS.length; i++) {
    const slot = BOARD_RING3_SLOTS[i]!;
    const meta = INFORMANT_SLOTS[i]!;
    out[slot.id] = {
      layout: {
        kind: "onCircle",
        radiusRatio: BOARD_LAYOUT_RADIUS_RATIOS.ring3Informant,
        angleRad: slot.angleRad,
      },
      size: meta.size,
      baseShape: meta.baseShape,
    };
  }

  for (const slot of BOARD_RING1_SLOTS) {
    out[slot.id] = {
      layout: {
        kind: "onCircle",
        radiusRatio: BOARD_LAYOUT_RADIUS_RATIOS.ring1Evidence,
        angleRad: slot.angleRad,
      },
      size: EVIDENCE_NODE_DEFAULTS.size,
      baseShape: EVIDENCE_NODE_DEFAULTS.baseShape,
    };
  }

  for (const slot of BOARD_RING2_SLOTS) {
    out[slot.id] = {
      layout: {
        kind: "onCircle",
        radiusRatio: BOARD_LAYOUT_RADIUS_RATIOS.ring2Evidence,
        angleRad: slot.angleRad,
      },
      size: EVIDENCE_NODE_DEFAULTS.size,
      baseShape: EVIDENCE_NODE_DEFAULTS.baseShape,
    };
  }

  return out;
}

/** 盤面マッピング（グラフの node id とキーを一致させる） */
export const EVIDENCE_BOARD_NODE_SPEC: Record<string, EvidenceBoardNodeSpec> =
  buildEvidenceBoardNodeSpec();
