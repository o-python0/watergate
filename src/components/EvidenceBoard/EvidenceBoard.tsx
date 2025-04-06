// src/components/EvidenceBoard/EvidenceBoard.tsx
import React, { useRef, useEffect, useState } from "react";
import { BOARD_BASE_SIZE } from "../../constants/evidenceBoard.constants";
import { useEvidenceBoardStore } from "../../store/evidenceBoardStore";
import { EvidenceNode, NodeColor } from "../../types/evidenceBoard.types";
import ConnectionLine from "./ConnectionLine";
import CorkBoard from "./CorkBoard";
import EvidenceNodeComponent from "./EvidenceNode";
import SelectorNodeModal from "./modal/SelectorNodeModal";

const EvidenceBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: BOARD_BASE_SIZE.width,
    height: BOARD_BASE_SIZE.height,
  });

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

  // コンテナのサイズに合わせてSVGサイズを調整
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: containerRect.width - 16, // パディングを考慮
          height: containerRect.height - 24,
        });
      }
    };

    // 初回レンダリング時とリサイズ時に更新
    updateDimensions();

    // ResizeObserverを使ってより正確にサイズ変更を検知
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // クリーンアップ
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // 描画用のデータを計算
  const renderConnections = React.useMemo(() => {
    const connections: any[] = [];

    // ノード間の全ての接続を処理
    Object.values(evidenceGraph.nodes).forEach((node) => {
      node.connections.forEach((targetId) => {
        // 各接続に一意のIDを割り当て
        const connectionId = [node.id, targetId].sort().join("-");

        // 重複を防ぐ
        if (!connections.some((conn) => conn.id === connectionId)) {
          // 接続が有効かどうかを判断
          const isActive =
            evidenceGraph.nodes[node.id].owner !== "nixon" &&
            evidenceGraph.nodes[targetId].owner !== "nixon";

          connections.push({
            id: connectionId,
            fromId: node.id,
            toId: targetId,
            isActive,
          });
        }
      });
    });

    return connections;
  }, [evidenceGraph]);

  // ノードの位置を調整して表示領域に収める
  const scaledNodePositions = React.useMemo(() => {
    const scaled: typeof nodePositions = {};

    // 初期設定の基準サイズ
    const baseWidth = BOARD_BASE_SIZE.width;
    const baseHeight = BOARD_BASE_SIZE.height;

    // スケールファクターを計算（アスペクト比を保持するため小さい方に合わせる）
    const scaleX = dimensions.width / baseWidth;
    const scaleY = dimensions.height / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    // 中央揃えのためのオフセット計算
    const offsetX = (dimensions.width - baseWidth * scale) / 2;
    const offsetY = (dimensions.height - baseHeight * scale) / 2;

    // 各ノードの位置をスケーリング
    Object.entries(nodePositions).forEach(([nodeId, position]) => {
      scaled[nodeId] = {
        x: position.x * scale + offsetX,
        y: position.y * scale + offsetY,
      };
    });

    return scaled;
  }, [nodePositions, dimensions]);

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
