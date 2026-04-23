import { create } from "zustand";
import { getEvidenceBoardInitialState } from "../constants/evidenceBoardMaster";
import { Token, TokenColor } from "../constants/types";
import {
  EvidenceGraph,
  NodeColor,
  NodeOwner,
} from "../types/evidenceBoard.types";
import { usePlayerStore } from "./playerStore";
import { useRoundStore } from "./roundStore";

const {
  evidenceGraph: initialEvidenceGraph,
  nodePositions: initialNodePositions,
} = getEvidenceBoardInitialState();

// ストアの型定義
interface EvidenceBoardStore {
  // 状態 - ゲームロジック
  evidenceGraph: EvidenceGraph;
  selectedNodeId: string | null;
  selectedNode: { id: string; color: NodeColor } | null;
  setSelectedNode: (selectedNode: { id: string; color: NodeColor }) => void;

  // 状態 - 描画用
  nodePositions: { [nodeId: string]: { x: number; y: number } };
  capturedEvidenceTokens: {
    id: string;
    colors: string[];
  }[];
  isTokenPlacementMode: boolean;

  // 基本アクション - ゲームロジック
  setEvidenceGraph: (graph: EvidenceGraph) => void;
  selectNode: (nodeId: string | null) => void;
  setNodeOwner: (nodeId: string, owner: NodeOwner) => void;
  addCapturedToken: (tokenId: string, colors: TokenColor[]) => void;
  placeEvidenceToken: (nodeId: string, tokenId: string) => void;
  startTokenPlacement: (onComplete?: () => void) => void;
  onPlacementCompleteCallback: (() => void) | null;

  // 基本アクション - 描画用
  setNodePosition: (nodeId: string, x: number, y: number) => void;

  // リセット
  resetGraph: () => void;
}

// Zustandストアの作成
export const useEvidenceBoardStore = create<EvidenceBoardStore>((set) => ({
  // 初期状態 - ゲームロジック
  evidenceGraph: initialEvidenceGraph,
  selectedNodeId: null,
  selectedNode: null,
  setSelectedNode: (node) =>
    set(() => ({
      selectedNode: {
        id: node.id,
        color: node.color,
      },
    })),
  capturedEvidenceTokens: [],
  // capturedEvidenceTokens: [
  //   { id: "token1", colors: ["blue", "green"] },
  //   { id: "token2", colors: ["green"] },
  //   { id: "token3", colors: ["green", "yellow"] },
  // ],
  isTokenPlacementMode: false,
  onPlacementCompleteCallback: null,

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

  startTokenPlacement: (onComplete?: () => void) => {
    console.log("startTokenPlacement Mode");
    set({
      // capturedEvidenceTokens: tokens,
      isTokenPlacementMode: true,
      onPlacementCompleteCallback: onComplete || null,
    });
  },

  // 証拠トークン配置処理
  placeEvidenceToken: (nodeId: string, tokenId: string) =>
    set((state) => {
      // 現在のターンのプレイヤーのroleを取得
      console.log("トークン配置");
      const currentPlayerId = useRoundStore.getState().currentPlayerTurn;
      const playerRole = usePlayerStore
        .getState()
        .getPlayerById(currentPlayerId!)?.role;

      // 選択したnodeのownerとplacedEvidenceIdを更新
      const updateNodes = { ...state.evidenceGraph.nodes };
      if (updateNodes[nodeId]) {
        updateNodes[nodeId] = {
          ...updateNodes[nodeId],
          owner: playerRole as NodeOwner,
          placedEvidenceId: tokenId,
        };
      }
      // capturedEvidenceTokensからtokenIdと一致するTokenを削除
      const updatedTokens = state.capturedEvidenceTokens.filter(
        (token) => token.id !== tokenId
      );

      const isAllTokensPlaced = updatedTokens.length === 0;

      // 全て配置したらコールバックを実行
      if (isAllTokensPlaced && state.onPlacementCompleteCallback) {
        setTimeout(() => {
          state.onPlacementCompleteCallback?.();
          set({ onPlacementCompleteCallback: null });
        }, 0);
      }

      return {
        evidenceGraph: {
          ...state.evidenceGraph,
          nodes: updateNodes,
        },
        capturedEvidenceTokens: updatedTokens,
        isTokenPlacementMode: !isAllTokensPlaced,
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
      ...getEvidenceBoardInitialState(),
      selectedNodeId: null,
    }),
}));
