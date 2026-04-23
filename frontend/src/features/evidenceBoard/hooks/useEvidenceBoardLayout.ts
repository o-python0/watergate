import { RefObject, useEffect, useMemo, useState } from "react";
import {
  BOARD_BASE_SIZE,
  EVIDENCE_BOARD_CONTAINER_PADDING,
} from "../presentation/constants/board.constants";
import { scaleNodePositions } from "../presentation/mappers/layout.mapper";
import { NodePositionMap } from "../presentation/types/presentation.types";

export function useEvidenceBoardLayout(
  containerRef: RefObject<HTMLDivElement | null>,
  nodePositions: NodePositionMap
) {
  const [dimensions, setDimensions] = useState({
    width: BOARD_BASE_SIZE.width,
    height: BOARD_BASE_SIZE.height,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) {
        return;
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: containerRect.width - EVIDENCE_BOARD_CONTAINER_PADDING.width,
        height: containerRect.height - EVIDENCE_BOARD_CONTAINER_PADDING.height,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const scaledNodePositions = useMemo(
    () => scaleNodePositions(nodePositions, dimensions),
    [nodePositions, dimensions]
  );

  return {
    dimensions,
    scaledNodePositions,
  };
}
