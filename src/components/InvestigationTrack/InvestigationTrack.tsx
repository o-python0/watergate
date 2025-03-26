import React, { useRef } from "react";
import useCanvas from "../../hooks/useCanvas";
import { useGameStore } from "../../store/gameStore";

const InvestigationTrack: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState } = useGameStore();

  useCanvas(canvasRef, gameState);

  return (
    <div className="h-full border border-gray-300 rounded bg-white p-2">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default InvestigationTrack;
