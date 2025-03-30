// 証拠ボード関連の型
export type NodeOwner = "journalist" | "nixon" | null;
export type NodeType = "informant" | "nixon" | "evidence";
export type NodeColor = "blue" | "green" | "yellow" | "red"; // redは既存のカラーシステムと統合するため追加

export interface EvidenceNode {
  id: string;
  type: NodeType;
  color?: NodeColor;
  owner: NodeOwner;
  connections: string[]; // 接続先ノードのID配列
}

export interface EvidenceGraph {
  nodes: { [nodeId: string]: EvidenceNode };
}

// レンダリング用の拡張モデル
export interface RenderNode extends Omit<EvidenceNode, "connections"> {
  x: number;
  y: number;
  selected?: boolean;
  highlighted?: boolean;
}

export interface RenderConnection {
  id: string;
  fromId: string;
  toId: string;
  isActive: boolean;
  isVictoryPath?: boolean;
}

export interface RenderGraph {
  nodes: { [nodeId: string]: RenderNode };
  connections: RenderConnection[];
}
