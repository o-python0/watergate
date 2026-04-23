import { RefObject, useEffect } from "react";
import { GameState, PlayerRole } from "../constants/types";
import { drawInvestigationTrack } from "../utils/drawnInvestigationTrack";

/**
 * キャンバス描画用カスタムフック
 * @param canvasRef キャンバスへの参照
 * @param gameState
 * @param localPlayerRole
 */
const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  gameState: GameState,
  localPlayerRole: PlayerRole
) => {
  useEffect(() => {
    const handleDraw = () => {
      if (canvasRef.current) {
        // 修正したdrawInvestigationTrack関数を呼び出し
        drawInvestigationTrack(canvasRef, gameState, localPlayerRole);
      }
    };

    handleDraw();

    // リサイズイベントのハンドリング
    const handleResize = () => {
      handleDraw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, canvasRef, localPlayerRole]);
};

export default useCanvas;
