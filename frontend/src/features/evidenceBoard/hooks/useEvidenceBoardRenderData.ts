import { useMemo } from "react";
import { EvidenceGraph } from "../../../types/evidenceBoard.types";
import { buildRenderConnections } from "../presentation/mappers/renderGraph.mapper";

export function useEvidenceBoardRenderData(evidenceGraph: EvidenceGraph) {
  const renderConnections = useMemo(
    () => buildRenderConnections(evidenceGraph),
    [evidenceGraph]
  );

  return { renderConnections };
}
