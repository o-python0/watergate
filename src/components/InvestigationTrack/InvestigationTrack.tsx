import React, { useRef } from "react";
import { useGame } from "../../contexts/GameContexts";
import useCanvas from "../../hooks/useCanvas";

const InvestigationTrack: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState } = useGame();

  useCanvas(canvasRef, gameState);

  return (
    <div className="h-full border border-gray-300 rounded bg-white p-2">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default InvestigationTrack;
