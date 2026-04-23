// src/components/EvidenceBoard/EvidenceBoard.tsx
import React, { useRef, useState } from "react";
import { useEvidenceBoardStore } from "../../store/evidenceBoardStore";
import { NodeColor } from "../../types/evidenceBoard.types";
import { useEvidenceBoardLayout } from "../../features/evidenceBoard/hooks/useEvidenceBoardLayout";
import { useEvidenceBoardRenderData } from "../../features/evidenceBoard/hooks/useEvidenceBoardRenderData";
import ConnectionLine from "./ConnectionLine";
import CorkBoard from "./CorkBoard";
import EvidenceNodeComponent from "./EvidenceNode";
import SelectorNodeModal from "./modal/SelectorNodeModal";

const EvidenceBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);

  // ストアから状態と関数を取得
  const {
    evidenceGraph,
    nodePositions,
    selectedNodeId,
    selectedNode,
    capturedEvidenceTokens,
    selectNode,
    setSelectedNode,
    placeEvidenceToken,
  } = useEvidenceBoardStore();

  const { dimensions, scaledNodePositions } = useEvidenceBoardLayout(
    containerRef,
    nodePositions
  );

  const { renderConnections } = useEvidenceBoardRenderData(evidenceGraph);

  // ノードをクリックした時の処理
  const handleNodeClick = (nodeId: string) => {
    selectNode(selectedNodeId === nodeId ? null : nodeId);
  };

  // ダブルクリックでトークン選択モーダルへ
  const handleNodeDoubleClick = (node: { id: string; color: NodeColor }) => {
    setSelectedNode({ id: node.id, color: node.color });
    setShowNodeModal(true);
  };

  // 利用可能なトークンをフィルタリング
  const getAvailableTokens = () => {
    if (!selectedNode?.color || !selectedNode?.color) return [];

    // capturedEvidenceTokens からフィルタリング
    return capturedEvidenceTokens
      .filter((token) => token.colors.includes(selectedNode.color as string))
      .map((token) => ({
        id: token.id,
        colors: token.colors as NodeColor[],
      }));
  };

  // モーダルで配置するトークンを選択した後の処理
  const handleTokenSelect = (tokenId: string) => {
    selectedNode?.id && placeEvidenceToken(selectedNode.id, tokenId);

    setShowNodeModal(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-blue-500 bg-opacity-50 rounded border border-blue-600 p-4 flex flex-col"
    >
      <div className="flex-grow relative overflow-hidden rounded shadow">
        <CorkBoard width={dimensions.width} height={dimensions.height}>
          {/* 接続線を描画 */}
          {renderConnections.map((connection) => (
            <ConnectionLine
              key={connection.id}
              id={connection.id}
              isActive={connection.isActive}
              isHighlighted={connection.isHighlighted}
              fromPosition={
                scaledNodePositions[connection.fromId] || { x: 0, y: 0 }
              }
              toPosition={
                scaledNodePositions[connection.toId] || { x: 0, y: 0 }
              }
            />
          ))}

          {/* ノードを描画 */}
          {Object.entries(evidenceGraph.nodes).map(([nodeId, node]) => (
            <EvidenceNodeComponent
              data={{
                id: node.id,
                type: node.type,
                color: node.color,
                owner: node.owner,
              }}
              position={scaledNodePositions[nodeId] || { x: 0, y: 0 }}
              isSelected={selectedNodeId === nodeId}
              handlers={{
                onClick: () => handleNodeClick(nodeId),
                onDoubleClick: () =>
                  handleNodeDoubleClick({
                    id: node.id,
                    color: node.color as NodeColor,
                  }),
              }}
            />
          ))}
        </CorkBoard>
      </div>

      {/* トークン選択モーダル */}
      <SelectorNodeModal
        isOpen={showNodeModal}
        onClose={() => setShowNodeModal(false)}
        onSelect={handleTokenSelect}
        availableTokens={getAvailableTokens()}
        selectedNode={selectedNode}
      />
    </div>
  );
};

export default EvidenceBoard;
