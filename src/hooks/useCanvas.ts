import { RefObject, useEffect } from "react";
import { GameState } from "../constants/types";
import { drawInvestigationTrack } from "../utils/drawnInvestigationTrack";

const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  gameState: GameState
) => {
  useEffect(() => {
    if (canvasRef.current) {
      drawInvestigationTrack(canvasRef, gameState);
    }
  }, [gameState, canvasRef]);
};

export default useCanvas;
