// src/components/EvidenceBoard/EvidenceBoard.tsx
import React, { useRef, useEffect, useState } from "react";
import { BOARD_BASE_SIZE } from "../../constants/evidenceBoard.constants";
import { useEvidenceBoardStore } from "../../store/evidenceBoardStore";
import ConnectionLine from "./ConnectionLine";
import CorkBoard from "./CorkBoard";
import EvidenceNode from "./EvidenceNode";

const EvidenceBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: BOARD_BASE_SIZE.width,
    height: BOARD_BASE_SIZE.height,
  });

  // ストアから状態と関数を取得
  const {
    evidenceGraph,
    nodePositions,
    selectedNodeId,
    selectNode,
    setNodeOwner,
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

  // ダブルクリックで所有者を変更
  const handleNodeDoubleClick = (nodeId: string) => {
    const node = evidenceGraph.nodes[nodeId];
    if (!node) return;

    // 所有者を循環: null -> journalist -> nixon -> null
    const nextOwner =
      node.owner === null
        ? "journalist"
        : node.owner === "journalist"
          ? "nixon"
          : null;

    setNodeOwner(nodeId, nextOwner);
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
            <EvidenceNode
              data={{
                id: node.id,
                type: node.type,
                color: node.color,
                owner: node.owner,
              }}
              position={scaledNodePositions[nodeId] || { x: 0, y: 0 }}
              // isSelected={selectedNodeId === nodeId}
              handlers={{
                onClick: () => handleNodeClick(nodeId),
                onDoubleClick: () => handleNodeDoubleClick(nodeId),
              }}
            />
          ))}
        </CorkBoard>
      </div>
    </div>
  );
};

export default EvidenceBoard;
