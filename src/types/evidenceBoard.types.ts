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

// 描画用のノード型（位置情報を含む）
export interface RenderNode extends EvidenceNode {
  x: number; // 描画位置X
  y: number; // 描画位置Y
  selected?: boolean; // 選択されているかどうか
  highlighted?: boolean; // ハイライト表示するかどうか
}

// 描画用の接続線型
export interface RenderConnection {
  id: string;
  fromId: string;
  toId: string;
  isActive: boolean; // ニクソン所有ノードを含まない有効な接続かどうか
  isHighlighted?: boolean; // ハイライト表示するかどうか
}

// 描画用のグラフ型
export interface RenderGraph {
  nodes: { [nodeId: string]: RenderNode };
  connections: RenderConnection[];
}
