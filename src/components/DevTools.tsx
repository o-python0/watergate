// src/components/DevTools.tsx
import React from "react";
import { PlayerRole } from "../constants/types";
import { useGameStore } from "../store/gameStore";
import { usePlayerStore } from "../store/playerStore";
import { usePlayers } from "../store/hooks";
import { useRoundStore } from "../store/roundStore";

// 開発用ツール - ロール切り替えなど
export const DevTools: React.FC = () => {
  const { gameState } = useGameStore();
  const { getPlayerById } = usePlayerStore();
  const { localPlayer } = usePlayers();

  const { currentPhase, currentPlayerTurn, remainingTurns, skipCurrentTurn } =
    useRoundStore();

  // localPlayerの役割を取得
  const localPlayerRole = localPlayer?.role || PlayerRole.NIXON;
  const isLocalPlayerTurn = currentPlayerTurn === gameState.localPlayerId;

  // 現在のプレイヤー情報
  const currentPlayer = getPlayerById(currentPlayerTurn || "");
  const playerRoleName =
    currentPlayer?.role === PlayerRole.NIXON ? "ニクソン側" : "編集者側";

  // ロール切り替え処理
  const switchRole = () => {
    const newRole =
      localPlayerRole === PlayerRole.NIXON
        ? PlayerRole.EDITOR
        : PlayerRole.NIXON;

    // playerStoreの状態を更新
    usePlayerStore.getState().setPlayers({
      ...usePlayerStore.getState().players,
      [gameState.localPlayerId]: {
        ...getPlayerById(gameState.localPlayerId)!,
        role: newRole,
      },
    });
  };

  return (
    <div
      className="dev-tools"
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "#f0f0f0",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>開発ツール</h3>

      {/* 既存の機能 */}
      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "10px" }}>
          現在のロール: <strong>{localPlayerRole}</strong>
        </span>
        <button
          onClick={switchRole}
          style={{
            padding: "4px 8px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ロール切り替え
        </button>
      </div>

      {/* ターン情報とスキップ機能 */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ marginBottom: "5px" }}>
          <span style={{ marginRight: "10px" }}>
            フェーズ: <strong>{currentPhase}</strong>
          </span>
          <span style={{ marginRight: "10px" }}>
            残りターン: <strong>{remainingTurns}</strong>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            現在の手番:{" "}
            <strong style={{ color: isLocalPlayerTurn ? "green" : "red" }}>
              {isLocalPlayerTurn ? "あなた" : "相手"} ({playerRoleName})
            </strong>
          </span>

          <button
            onClick={() => skipCurrentTurn()}
            style={{
              padding: "4px 8px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            ターンスキップ
          </button>
        </div>
      </div>
    </div>
  );
};
