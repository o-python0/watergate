import { create } from "zustand";
import { TokenColor } from "../constants/types";
import {
  EvidenceGraph,
  NodeColor,
  NodeOwner,
} from "../types/evidenceBoard.types";

// 初期ノードの位置を計算するヘルパー関数
const calculateInitialPositions = (
  width: number,
  height: number
): { [nodeId: string]: { x: number; y: number } } => {
  // 中心座標
  const centerX = width / 2;
  const centerY = height / 2;

  // 証拠ノードの配置半径（中心からの距離）
  const evidenceRadius = Math.min(width, height) * 0.25;

  // 情報提供者ノードの配置半径（中心からの距離）
  const informantRadius = Math.min(width, height) * 0.35;

  return {
    // ニクソンノードを中心に配置
    nix: { x: centerX, y: centerY },

    // 情報提供者ノードを下部に配置
    inf_1: { x: centerX, y: centerY + informantRadius },

    // 証拠ノードをニクソンの周りに円形に配置
    // 4つの証拠ノードを90度ずつの角度で配置
    ev_b_1: {
      x: centerX + evidenceRadius * Math.cos(Math.PI * 1.75), // 右上 (315度)
      y: centerY + evidenceRadius * Math.sin(Math.PI * 1.75),
    },
    ev_g_1: {
      x: centerX + evidenceRadius * Math.cos(Math.PI * 0.25), // 右下 (45度)
      y: centerY + evidenceRadius * Math.sin(Math.PI * 0.25),
    },
    ev_r_1: {
      x: centerX + evidenceRadius * Math.cos(Math.PI * 1.25), // 左上 (225度)
      y: centerY + evidenceRadius * Math.sin(Math.PI * 1.25),
    },
    ev_y_1: {
      x: centerX + evidenceRadius * Math.cos(Math.PI * 0.75), // 左下 (135度)
      y: centerY + evidenceRadius * Math.sin(Math.PI * 0.75),
    },
  };
};

// 初期状態の証拠グラフを作成
const createInitialGraph = (): EvidenceGraph => {
  const graph: EvidenceGraph = {
    nodes: {
      // ニクソンノード
      nix: {
        id: "nix",
        type: "nixon",
        owner: null,
        connections: ["ev_b_1", "ev_g_1", "ev_g_2", "ev_y_1"],
        placedEvidenceId: null,
      },
      // 情報提供者ノード
      inf_1: {
        id: "inf_1",
        type: "informant",
        owner: null,
        connections: ["ev_g_1", "ev_y_1"],
        placedEvidenceId: null,
      },
      // 証拠ノード
      ev_b_1: {
        id: "ev_b_1",
        type: "evidence",
        color: "blue",
        owner: null,
        connections: ["nix", "ev_g_2"],
        placedEvidenceId: null,
      },
      ev_g_1: {
        id: "ev_g_1",
        type: "evidence",
        color: "green",
        owner: null,
        connections: ["nix", "ev_y_1", "inf_1"],
        placedEvidenceId: null,
      },
      ev_g_2: {
        id: "ev_g_2",
        type: "evidence",
        color: "green",
        owner: null,
        connections: ["nix", "ev_b_1"],
        placedEvidenceId: null,
      },
      ev_y_1: {
        id: "ev_y_1",
        type: "evidence",
        color: "yellow",
        owner: null,
        connections: ["nix", "ev_g_1", "inf_1"],
        placedEvidenceId: null,
      },
    },
  };

  return graph;
};

// 描画用の初期ノード位置
const initialNodePositions: { [nodeId: string]: { x: number; y: number } } =
  calculateInitialPositions(800, 600);

// ストアの型定義
interface EvidenceBoardStore {
  // 状態 - ゲームロジック
  evidenceGraph: EvidenceGraph;
  selectedNodeId: string | null;
  selectedNode: { id: string; color: NodeColor } | null;
  setSelectedNode: (selectedNode: { id: string; color: NodeColor }) => void;
  setPlacedEvidenceId: (nodeid: string, tokenId: string) => void;

  // 状態 - 描画用
  nodePositions: { [nodeId: string]: { x: number; y: number } };
  capturedEvidenceTokens: {
    id: string;
    colors: string[];
  }[];

  // 基本アクション - ゲームロジック
  setEvidenceGraph: (graph: EvidenceGraph) => void;
  selectNode: (nodeId: string | null) => void;
  setNodeOwner: (nodeId: string, owner: NodeOwner) => void;
  addCapturedToken: (tokenId: string, colors: TokenColor[]) => void;

  // 基本アクション - 描画用
  setNodePosition: (nodeId: string, x: number, y: number) => void;

  // リセット
  resetGraph: () => void;
}

// Zustandストアの作成
export const useEvidenceBoardStore = create<EvidenceBoardStore>((set) => ({
  // 初期状態 - ゲームロジック
  evidenceGraph: createInitialGraph(),
  selectedNodeId: null,
  selectedNode: null,
  setSelectedNode: (node) =>
    set(() => ({
      selectedNode: {
        id: node.id,
        color: node.color,
      },
    })),
  capturedEvidenceTokens: [
    { id: "token1", colors: ["blue", "green"] },
    { id: "token2", colors: ["green"] },
    { id: "token3", colors: ["green", "yellow"] },
  ],

  // 初期状態 - 描画用
  nodePositions: initialNodePositions,

  // アクション - ゲームロジック
  setEvidenceGraph: (graph) => set({ evidenceGraph: graph }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setNodeOwner: (nodeId, owner) => {
    set((state) => {
      const updatedGraph = { ...state.evidenceGraph };
      if (updatedGraph.nodes[nodeId]) {
        updatedGraph.nodes[nodeId] = {
          ...updatedGraph.nodes[nodeId],
          owner,
        };
      }
      return { evidenceGraph: updatedGraph };
    });
  },

  addCapturedToken: (tokenId, colors) =>
    set((state) => ({
      capturedEvidenceTokens: [
        ...state.capturedEvidenceTokens,
        { id: tokenId, colors },
      ],
    })),
  setPlacedEvidenceId: (nodeId: string, tokenId: string) =>
    set((state) => {
      const updateNodes = { ...state.evidenceGraph.nodes };

      if (updateNodes[nodeId]) {
        updateNodes[nodeId] = {
          ...updateNodes[nodeId],
          placedEvidenceId: tokenId,
        };
      }

      return {
        evidenceGraph: {
          ...state.evidenceGraph,
          nodes: updateNodes,
        },
      };
    }),

  // アクション - 描画用
  setNodePosition: (nodeId, x, y) => {
    set((state) => {
      const updatedPositions = { ...state.nodePositions };
      updatedPositions[nodeId] = { x, y };
      return { nodePositions: updatedPositions };
    });
  },

  // リセットアクション
  resetGraph: () =>
    set({
      evidenceGraph: createInitialGraph(),
      selectedNodeId: null,
      nodePositions: calculateInitialPositions(800, 600), // 位置も再計算
    }),
}));
