import { EvidenceGraph } from "../../../../types/evidenceBoard.types";
import { RenderConnection } from "../types/presentation.types";

export function buildRenderConnections(
  evidenceGraph: EvidenceGraph
): RenderConnection[] {
  const connections: RenderConnection[] = [];

  Object.values(evidenceGraph.nodes).forEach((node) => {
    node.connections.forEach((targetId) => {
      const connectionId = [node.id, targetId].sort().join("-");

      if (!connections.some((conn) => conn.id === connectionId)) {
        const fromNode = evidenceGraph.nodes[node.id];
        const toNode = evidenceGraph.nodes[targetId];
        if (!fromNode || !toNode) {
          return;
        }

        connections.push({
          id: connectionId,
          fromId: node.id,
          toId: targetId,
          isActive: fromNode.owner !== "nixon" && toNode.owner !== "nixon",
        });
      }
    });
  });

  return connections;
}
