// src/components/DevTools.tsx
import React from "react";
import { useGame } from "../contexts/GameContexts";
import { PlayerRole } from "../constants/types";
import { useGameStore } from "../store/gameStore";

// 開発用ツール - ロール切り替えなど
export const DevTools: React.FC = () => {
  const { gameState, setGameState } = useGameStore();

  const localPlayerRole =
    gameState.players[gameState.localPlayerId]?.role || PlayerRole.NIXON;

  // ロール切り替え処理
  const switchRole = () => {
    const newRole =
      localPlayerRole === PlayerRole.NIXON
        ? PlayerRole.EDITOR
        : PlayerRole.NIXON;

    setGameState((prev) => ({
      ...prev,
      players: {
        ...prev.players,
        [prev.localPlayerId]: {
          ...prev.players[prev.localPlayerId],
          role: newRole,
        },
      },
    }));
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
      <div>
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
    </div>
  );
};
