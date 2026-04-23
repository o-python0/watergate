import { EvidenceGraph } from "../../../../types/evidenceBoard.types";

export type NodePosition = { x: number; y: number };
export type NodePositionMap = Record<string, NodePosition>;

export interface RenderConnection {
  id: string;
  fromId: string;
  toId: string;
  isActive: boolean;
  isHighlighted?: boolean;
}

export type EvidenceGraphLike = EvidenceGraph;
