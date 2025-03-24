import { RefObject, useEffect } from "react";
import { TestToken, Token } from "../constants/types";
import { drawInvestigationTrack } from "../utils/drawnInvestigationTrack";

const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  tokens: TestToken[]
) => {
  useEffect(() => {
    if (canvasRef.current) {
      drawInvestigationTrack(canvasRef, tokens);
    }
  }, [canvasRef, tokens]);
};

export default useCanvas;
