import { BOARD_BASE_SIZE } from "../constants/board.constants";
import { NodePositionMap } from "../types/presentation.types";

export function scaleNodePositions(
  nodePositions: NodePositionMap,
  dimensions: { width: number; height: number }
): NodePositionMap {
  const scaled: NodePositionMap = {};

  const scaleX = dimensions.width / BOARD_BASE_SIZE.width;
  const scaleY = dimensions.height / BOARD_BASE_SIZE.height;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (dimensions.width - BOARD_BASE_SIZE.width * scale) / 2;
  const offsetY = (dimensions.height - BOARD_BASE_SIZE.height * scale) / 2;

  Object.entries(nodePositions).forEach(([nodeId, position]) => {
    scaled[nodeId] = {
      x: position.x * scale + offsetX,
      y: position.y * scale + offsetY,
    };
  });

  return scaled;
}
