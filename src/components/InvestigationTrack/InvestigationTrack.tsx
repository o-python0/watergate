import React, { useRef } from "react";
import useCanvas from "../../hooks/useCanvas";
import { useGameStore } from "../../store/gameStore";
import { usePlayers } from "../../store/hooks";
import { PlayerRole } from "../../constants/types";

const InvestigationTrack: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState } = useGameStore();
  const { localPlayer } = usePlayers();
  const localPlayerRole = localPlayer?.role || PlayerRole.NIXON;

  // 修正したuseCanvasフックにlocalPlayerRoleを渡す
  useCanvas(canvasRef, gameState, localPlayerRole);

  return (
    <div className="h-full border border-gray-300 rounded bg-white p-2">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default InvestigationTrack;
